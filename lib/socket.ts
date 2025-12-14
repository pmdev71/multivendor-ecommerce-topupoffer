import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from './jwt';
import connectDB from './mongodb';

// Note: Models need to be imported after DB connection
// We'll use dynamic imports in the connection handler

/**
 * Socket.IO Server Setup
 * Realtime Communication এর জন্য
 */

let io: SocketIOServer | null = null;

export function initializeSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const payload = verifyToken(token);
      socket.data.user = payload;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    await connectDB(); // Ensure DB connection
    const Seller = (await import('@/models/Seller')).default;
    const Need = (await import('@/models/Need')).default;
    const Offer = (await import('@/models/Offer')).default;
    const Order = (await import('@/models/Order')).default;
    const Chat = (await import('@/models/Chat')).default;

    const user = socket.data.user;
    console.log(`User connected: ${user.userId} (${user.role})`);

    // Seller Online Status Update করা
    if (user.role === 'seller') {
      try {
        const seller = await Seller.findOne({ userId: user.userId });
        if (seller) {
          seller.isOnline = true;
          await seller.save();

          // seller:online event broadcast করা
          io.emit('seller:online', {
            sellerId: seller._id,
            storeName: seller.storeName,
          });
        }
      } catch (error) {
        console.error('Seller online status update error:', error);
      }
    }

    // Room Join করা (User-specific)
    socket.join(`user:${user.userId}`);

    // Seller হলে Seller Room-এ Join করা
    if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user.userId });
      if (seller) {
        socket.join(`seller:${seller._id}`);
      }
    }

    // ============================================
    // NEED REQUEST EVENTS
    // ============================================

    // Customer Need Request Create করলে
    socket.on('need:create', async (data) => {
      try {
        const { needId } = data;

        // সকল Online Seller-দের কাছে Notification পাঠানো
        const onlineSellers = await Seller.find({ isOnline: true, isApproved: true });
        
        onlineSellers.forEach((seller) => {
          io.to(`seller:${seller._id}`).emit('need:new', {
            needId,
            message: 'New need request available',
          });
        });
      } catch (error) {
        console.error('Need create event error:', error);
      }
    });

    // Seller Offer Submit করলে
    socket.on('offer:submit', async (data) => {
      try {
        const { needId, offerId } = data;

        // Need Request Owner-এর কাছে Notification পাঠানো
        const need = await Need.findById(needId);
        if (need) {
          io.to(`user:${need.customerId}`).emit('need:offer', {
            needId,
            offerId,
            message: 'New offer received',
          });
        }
      } catch (error) {
        console.error('Offer submit event error:', error);
      }
    });

    // Customer Offer Accept করলে
    socket.on('offer:accept', async (data) => {
      try {
        const { needId, offerId, orderId } = data;

        // Need Owner-কে Notification
        const need = await Need.findById(needId);
        if (need) {
          io.to(`user:${need.customerId}`).emit('offer:accept', {
            needId,
            offerId,
            orderId,
            message: 'Offer accepted. Order created.',
          });
        }

        // Offer Owner (Seller)-কে Notification
        const offer = await Offer.findById(offerId);
        if (offer) {
          const seller = await Seller.findById(offer.sellerId);
          if (seller) {
            io.to(`seller:${seller._id}`).emit('offer:accept', {
              needId,
              offerId,
              orderId,
              message: 'Your offer was accepted. Order created.',
            });
          }
        }

        // অন্যান্য Seller-দের কাছে Notification (Offer Rejected)
        const allOffers = await Offer.find({ needId, _id: { $ne: offerId } });
        allOffers.forEach(async (off) => {
          const s = await Seller.findById(off.sellerId);
          if (s) {
            io.to(`seller:${s._id}`).emit('offer:rejected', {
              needId,
              offerId: off._id,
              message: 'Your offer was not selected',
            });
          }
        });
      } catch (error) {
        console.error('Offer accept event error:', error);
      }
    });

    // ============================================
    // ORDER EVENTS
    // ============================================

    // নতুন Order Create হলে
    socket.on('order:new', async (data) => {
      try {
        const { orderId } = data;

        const order = await Order.findById(orderId).populate('sellerId');
        if (order) {
          // Seller-এর কাছে Notification
          const seller = await Seller.findById(order.sellerId);
          if (seller) {
            io.to(`seller:${seller._id}`).emit('order:new', {
              orderId,
              orderNumber: order.orderNumber,
              message: 'New order received',
            });
          }
        }
      } catch (error) {
        console.error('Order new event error:', error);
      }
    });

    // Seller Order Accept করলে
    socket.on('order:assign', async (data) => {
      try {
        const { orderId } = data;

        const order = await Order.findById(orderId);
        if (order) {
          // Customer-কে Notification
          io.to(`user:${order.customerId}`).emit('order:assign', {
            orderId,
            message: 'Order accepted by seller. Chat enabled.',
          });
        }
      } catch (error) {
        console.error('Order assign event error:', error);
      }
    });

    // Order Complete হলে
    socket.on('order:complete', async (data) => {
      try {
        const { orderId } = data;

        const order = await Order.findById(orderId);
        if (order) {
          // Customer-কে Notification
          io.to(`user:${order.customerId}`).emit('order:complete', {
            orderId,
            message: 'Order completed successfully',
          });
        }
      } catch (error) {
        console.error('Order complete event error:', error);
      }
    });

    // ============================================
    // CHAT EVENTS
    // ============================================

    // Chat Message Send করা
    socket.on('chat:message', async (data) => {
      try {
        const { orderId, message } = data;

        const order = await Order.findById(orderId);
        if (!order) return;

        // Chat Room Join করা
        const chatRoom = `chat:${orderId}`;
        socket.join(chatRoom);

        // Message Broadcast করা
        io.to(chatRoom).emit('chat:message', {
          orderId,
          senderId: user.userId,
          senderRole: user.role,
          message,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Chat message event error:', error);
      }
    });

    // Chat Room Join করা
    socket.on('chat:join', (data) => {
      const { orderId } = data;
      socket.join(`chat:${orderId}`);
    });

    // ============================================
    // DISCONNECT
    // ============================================

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${user.userId}`);

      // Seller Offline Status Update করা
      if (user.role === 'seller') {
        try {
          const seller = await Seller.findOne({ userId: user.userId });
          if (seller) {
            seller.isOnline = false;
            await seller.save();

            // seller:offline event broadcast করা
            io.emit('seller:offline', {
              sellerId: seller._id,
            });
          }
        } catch (error) {
          console.error('Seller offline status update error:', error);
        }
      }
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

