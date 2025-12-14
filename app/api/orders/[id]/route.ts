import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Seller from '@/models/Seller';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { requireRole } from '@/lib/auth';

/**
 * GET: Specific Order Details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireRole(['customer', 'seller', 'admin'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const order = await Order.findById(id)
      .populate('customerId', 'name email')
      .populate('sellerId', 'storeName')
      .populate('productId')
      .populate('sellerProductId');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Authorization Check
    if (
      user.role === 'customer' &&
      order.customerId._id.toString() !== user.userId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user.userId });
      if (seller && order.sellerId._id.toString() !== seller._id.toString()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Order Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Order Status Update করা (Accept, Complete, Cancel)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireRole(['customer', 'seller', 'admin'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await request.json();
    const { action, reason } = body; // action: 'accept', 'complete', 'cancel'

    if (action === 'accept' && user.role === 'seller') {
      // Seller Order Accept করলে
      const seller = await Seller.findOne({ userId: user.userId });
      if (!seller || order.sellerId.toString() !== seller._id.toString()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (order.status !== 'pending') {
        return NextResponse.json(
          { error: 'Order cannot be accepted' },
          { status: 400 }
        );
      }

      order.status = 'assigned';
      order.assignedAt = new Date();
      await order.save();

      // Socket.IO Event Emit করা
      try {
        const { getSocketIO } = await import('@/lib/socket-server');
        const io = getSocketIO();
        
        if (io) {
          // Customer-কে Notification
          io.to(`user:${order.customerId.toString()}`).emit('order:assign', {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            sellerId: seller._id.toString(),
            storeName: seller.storeName,
            message: 'Order accepted by seller. Chat enabled.',
            timestamp: new Date(),
          });

          // Seller-কে Confirmation
          io.to(`seller:${seller._id.toString()}`).emit('order:assigned', {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            message: 'Order accepted successfully',
            timestamp: new Date(),
          });

          // Order Status Changed Event (for notification component)
          io.to(`seller:${seller._id.toString()}`).emit('order:status_changed', {
            orderId: order._id.toString(),
            status: order.status,
          });
        }
      } catch (error) {
        console.error('Socket.IO emit error:', error);
      }

      return NextResponse.json({
        success: true,
        order,
        message: 'Order accepted successfully',
      });
    }

    if (action === 'complete' && user.role === 'seller') {
      // Seller Order Complete করলে
      const seller = await Seller.findOne({ userId: user.userId });
      if (!seller || order.sellerId.toString() !== seller._id.toString()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (order.status !== 'assigned' && order.status !== 'processing') {
        return NextResponse.json(
          { error: 'Order cannot be completed' },
          { status: 400 }
        );
      }

      order.status = 'completed';
      order.completedAt = new Date();
      await order.save();

      // Seller Balance Credit করা
      seller.availableBalance += order.sellerAmount;
      seller.totalEarnings += order.sellerAmount;
      seller.completedOrders += 1;
      seller.totalOrders += 1;
      await seller.save();

      // Transaction Number Generate করা (validation-এর আগে)
      const transactionCount = await Transaction.countDocuments();
      const transactionNumber = `TXN-${Date.now()}-${String(transactionCount + 1).padStart(6, '0')}`;

      // Transaction Create করা
      await Transaction.create({
        transactionNumber, // Manually generate করা transactionNumber
        userId: seller.userId,
        type: 'payout',
        amount: order.sellerAmount,
        status: 'completed',
        orderId: order._id,
        description: `Order completion payout for ${order.orderNumber}`,
      });

      // Socket.IO Event Emit করা
      try {
        const { getSocketIO } = await import('@/lib/socket-server');
        const io = getSocketIO();
        
        if (io) {
          // Customer-কে Notification
          io.to(`user:${order.customerId.toString()}`).emit('order:complete', {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            message: 'Order completed successfully',
            timestamp: new Date(),
          });

          // Seller-কে Confirmation
          io.to(`seller:${seller._id.toString()}`).emit('order:completed', {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            sellerAmount: order.sellerAmount,
            message: 'Order completed. Payment credited.',
            timestamp: new Date(),
          });

          // Order Status Changed Event
          io.to(`seller:${seller._id.toString()}`).emit('order:status_changed', {
            orderId: order._id.toString(),
            status: order.status,
          });
        }
      } catch (error) {
        console.error('Socket.IO emit error:', error);
      }

      return NextResponse.json({
        success: true,
        order,
        message: 'Order completed successfully',
      });
    }

    if (action === 'cancel') {
      // Order Cancel করা
      if (order.status === 'assigned' && user.role === 'customer') {
        return NextResponse.json(
          { error: 'Cannot cancel order after seller acceptance' },
          { status: 400 }
        );
      }

      if (order.status === 'completed' || order.status === 'cancelled') {
        return NextResponse.json(
          { error: 'Order cannot be cancelled' },
          { status: 400 }
        );
      }

      order.status = 'cancelled';
      order.cancelledAt = new Date();
      order.cancelledBy = user.role;
      order.cancellationReason = reason || 'Cancelled by user';

      // Payment Refund করা (Wallet হলে)
      if (order.paymentMethod === 'wallet' && order.paymentStatus === 'paid') {
        const customer = await User.findById(order.customerId);
        if (customer) {
          customer.wallet.balance += order.totalAmount;
          await customer.save();

          // Transaction Number Generate করা (validation-এর আগে)
          const refundTransactionCount = await Transaction.countDocuments();
          const refundTransactionNumber = `TXN-${Date.now()}-${String(refundTransactionCount + 1).padStart(6, '0')}`;

          await Transaction.create({
            transactionNumber: refundTransactionNumber, // Manually generate করা transactionNumber
            userId: order.customerId,
            type: 'order_refund',
            amount: order.totalAmount,
            status: 'completed',
            paymentMethod: 'wallet',
            orderId: order._id,
            description: `Order cancellation refund for ${order.orderNumber}`,
          });
        }
      }

      await order.save();

      // Socket.IO Event Emit করা
      try {
        const { getSocketIO } = await import('@/lib/socket-server');
        const io = getSocketIO();
        
        if (io) {
          const seller = await Seller.findById(order.sellerId);
          if (seller) {
            // Order Status Changed Event (for notification component)
            io.to(`seller:${seller._id.toString()}`).emit('order:status_changed', {
              orderId: order._id.toString(),
              status: order.status,
            });
          }
        }
      } catch (error) {
        console.error('Socket.IO emit error:', error);
      }

      return NextResponse.json({
        success: true,
        order,
        message: 'Order cancelled successfully',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Order Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

