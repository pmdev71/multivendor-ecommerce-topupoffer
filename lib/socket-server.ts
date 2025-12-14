import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from './jwt';
import connectDB from './mongodb';

// Note: Using relative imports for ts-node compatibility

/**
 * Socket.IO Server Setup for Next.js API Routes
 * Realtime Communication এর জন্য
 */

// Global Socket.IO instance (singleton pattern)
let io: SocketIOServer | null = null;

// Make io accessible globally for API routes
declare global {
  // eslint-disable-next-line no-var
  var socketIOInstance: SocketIOServer | null | undefined;
}

// Use global variable for persistence across module reloads (Next.js hot reload)
if (typeof global !== 'undefined') {
  if (!global.socketIOInstance) {
    global.socketIOInstance = null;
  }
  io = global.socketIOInstance;
}

/**
 * Socket.IO Server Initialize করার Function
 * Next.js API Routes-এর সাথে কাজ করার জন্য
 */
export function initSocketIO(httpServer: HTTPServer): SocketIOServer {
  // Check if already initialized (including global)
  if (io || (typeof global !== 'undefined' && global.socketIOInstance)) {
    io = io || global.socketIOInstance || null;
    if (io) return io;
  }

  io = new SocketIOServer(httpServer, {
    path: '/api/socket.io',
    addTrailingSlash: false,
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  });

  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const payload = verifyToken(token);
      socket.data.user = payload;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    await connectDB();
    
    // Dynamic imports using relative paths for ts-node compatibility
    const Seller = (await import('../models/Seller')).default;
    const Need = (await import('../models/Need')).default;
    const Offer = (await import('../models/Offer')).default;
    const Order = (await import('../models/Order')).default;
    const Chat = (await import('../models/Chat')).default;

    const user = socket.data.user;
    console.log(`✅ User connected: ${user.userId} (${user.role})`);

    // Seller Online Status Update করা
    if (user.role === 'seller') {
      try {
        const seller = await Seller.findOne({ userId: user.userId });
        if (seller) {
          seller.isOnline = true;
          await seller.save();

          // seller:online event broadcast করা
          io!.emit('seller:online', {
            sellerId: seller._id.toString(),
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
      try {
        const seller = await Seller.findOne({ userId: user.userId });
        if (seller) {
          const sellerRoom = `seller:${seller._id.toString()}`;
          socket.join(sellerRoom);
          console.log(`✅ Seller joined room: ${sellerRoom} (Store: ${seller.storeName})`);
        } else {
          console.warn(`⚠️ Seller not found for user: ${user.userId}`);
        }
      } catch (error) {
        console.error('Seller room join error:', error);
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
          io!.to(`seller:${seller._id.toString()}`).emit('need:new', {
            needId,
            message: 'New need request available',
            timestamp: new Date(),
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
          io!.to(`user:${need.customerId.toString()}`).emit('need:offer', {
            needId,
            offerId,
            message: 'New offer received',
            timestamp: new Date(),
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
          io!.to(`user:${need.customerId.toString()}`).emit('offer:accept', {
            needId,
            offerId,
            orderId,
            message: 'Offer accepted. Order created.',
            timestamp: new Date(),
          });
        }

        // Offer Owner (Seller)-কে Notification
        const offer = await Offer.findById(offerId);
        if (offer) {
          const seller = await Seller.findById(offer.sellerId);
          if (seller) {
            io!.to(`seller:${seller._id.toString()}`).emit('offer:accept', {
              needId,
              offerId,
              orderId,
              message: 'Your offer was accepted. Order created.',
              timestamp: new Date(),
            });
          }
        }

        // অন্যান্য Seller-দের কাছে Notification (Offer Rejected)
        const allOffers = await Offer.find({ needId, _id: { $ne: offerId } });
        for (const off of allOffers) {
          const s = await Seller.findById(off.sellerId);
          if (s) {
            io!.to(`seller:${s._id.toString()}`).emit('offer:rejected', {
              needId,
              offerId: off._id.toString(),
              message: 'Your offer was not selected',
              timestamp: new Date(),
            });
          }
        }
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

        const order = await Order.findById(orderId);
        if (order) {
          // Seller-এর কাছে Notification
          const seller = await Seller.findById(order.sellerId);
          if (seller) {
            io!.to(`seller:${seller._id.toString()}`).emit('order:new', {
              orderId,
              orderNumber: order.orderNumber,
              message: 'New order received',
              timestamp: new Date(),
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
          io!.to(`user:${order.customerId.toString()}`).emit('order:assign', {
            orderId,
            message: 'Order accepted by seller. Chat enabled.',
            timestamp: new Date(),
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
          io!.to(`user:${order.customerId.toString()}`).emit('order:complete', {
            orderId,
            message: 'Order completed successfully',
            timestamp: new Date(),
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
        io!.to(chatRoom).emit('chat:message', {
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
      console.log(`❌ User disconnected: ${user.userId}`);

      // Seller Offline Status Update করা
      if (user.role === 'seller') {
        try {
          const seller = await Seller.findOne({ userId: user.userId });
          if (seller) {
            seller.isOnline = false;
            await seller.save();

            // seller:offline event broadcast করা
            io!.emit('seller:offline', {
              sellerId: seller._id.toString(),
              timestamp: new Date(),
            });
          }
        } catch (error) {
          console.error('Seller offline status update error:', error);
        }
      }
    });
  });

  // Store in global for API route access
  if (typeof global !== 'undefined') {
    global.socketIOInstance = io;
  }

  return io;
}

/**
 * Get existing Socket.IO instance
 * API Routes থেকে access করার জন্য
 */
export function getSocketIO(): SocketIOServer | null {
  // Check global first (for Next.js hot reload)
  if (typeof global !== 'undefined' && global.socketIOInstance) {
    return global.socketIOInstance;
  }
  return io;
}

