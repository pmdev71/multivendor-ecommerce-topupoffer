import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import SellerProduct from '@/models/SellerProduct';
import Seller from '@/models/Seller';
import Product from '@/models/Product';
import Transaction from '@/models/Transaction';
import { requireRole } from '@/lib/auth';
import { calculateCommission } from '@/lib/utils';

/**
 * POST: নতুন Order Create করা
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['customer'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { sellerProductId, operator, mobileNumber, quantity = 1, paymentMethod } = body;

    if (!sellerProductId || !operator || !mobileNumber || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // SellerProduct Fetch করা
    const sellerProduct = await SellerProduct.findById(sellerProductId)
      .populate('productId')
      .populate('sellerId');
    if (!sellerProduct || !sellerProduct.isActive) {
      return NextResponse.json(
        { error: 'Product not available' },
        { status: 404 }
      );
    }

    const seller = await Seller.findById(sellerProduct.sellerId);
    if (!seller || !seller.isApproved) {
      return NextResponse.json(
        { error: 'Seller not available' },
        { status: 404 }
      );
    }

    // Total Amount Calculate করা
    const totalAmount = sellerProduct.price * quantity;
    const { commission, sellerAmount } = calculateCommission(totalAmount);

    // Customer Wallet Check করা (Wallet Payment হলে)
    const customer = await User.findById(user.userId);
    if (paymentMethod === 'wallet' && customer.wallet.balance < totalAmount) {
      return NextResponse.json(
        { error: 'Insufficient wallet balance' },
        { status: 400 }
      );
    }

    // Order Number Generate করা (validation-এর আগে)
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${String(orderCount + 1).padStart(6, '0')}`;

    // Order Create করা
    const order = await Order.create({
      orderNumber, // Manually generate করা orderNumber
      customerId: user.userId,
      sellerId: seller._id,
      productId: sellerProduct.productId._id,
      sellerProductId: sellerProduct._id,
      operator,
      mobileNumber,
      quantity,
      unitPrice: sellerProduct.price,
      totalAmount,
      commission,
      sellerAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
    });

    // Wallet Payment হলে Balance Deduct করা
    if (paymentMethod === 'wallet') {
      customer.wallet.balance -= totalAmount;
      await customer.save();

      // Transaction Number Generate করা (validation-এর আগে)
      const transactionCount = await Transaction.countDocuments();
      const transactionNumber = `TXN-${Date.now()}-${String(transactionCount + 1).padStart(6, '0')}`;

      // Transaction Create করা
      await Transaction.create({
        transactionNumber, // Manually generate করা transactionNumber
        userId: user.userId,
        type: 'order_payment',
        amount: -totalAmount,
        status: 'completed',
        paymentMethod: 'wallet',
        orderId: order._id,
        description: `Order payment for ${order.orderNumber}`,
      });
    }

    // Socket.IO Event Emit করা (Seller-এর কাছে Notification)
    try {
      const { getSocketIO } = await import('@/lib/socket-server');
      const io = getSocketIO();
      
      if (io) {
        const sellerRoom = `seller:${seller._id.toString()}`;
        console.log(`📤 Emitting order:new to room: ${sellerRoom}`);
        
        // Seller-এর কাছে Notification
        io.to(sellerRoom).emit('order:new', {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          customerId: order.customerId.toString(),
          productId: order.productId.toString(),
          totalAmount: order.totalAmount,
          message: 'New order received',
          timestamp: new Date(),
        });
        
        // Also emit to all sockets in the seller room (fallback)
        const socketsInRoom = await io.in(sellerRoom).fetchSockets();
        console.log(`📊 Sockets in seller room ${sellerRoom}:`, socketsInRoom.length);
        
        if (socketsInRoom.length === 0) {
          console.warn(`⚠️ No sockets found in room ${sellerRoom}. Seller might not be connected.`);
        }

        // Customer-এর কাছে Confirmation
        io.to(`user:${user.userId}`).emit('order:created', {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          message: 'Order created successfully',
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Socket.IO emit error:', error);
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Order Create Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

/**
 * GET: Customer-এর Order History
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['customer', 'seller', 'admin'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = {};
    if (user.role === 'customer') {
      query.customerId = user.userId;
    } else if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user.userId });
      if (seller) {
        query.sellerId = seller._id;
      } else {
        return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
      }
    }
    // Admin can see all orders

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customerId', 'name email')
      .populate('sellerId', 'storeName')
      .populate('productId')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error('Orders Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

