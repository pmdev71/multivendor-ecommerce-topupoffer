import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { requireRole } from '@/lib/auth';

/**
 * GET: সকল Orders List করা (Admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth check for development
    // const { user, error } = await requireRole(['admin'])(request);
    // if (error || !user) {
    //   return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customerId', 'name email')
      .populate('sellerId', 'storeName')
      .populate('productId')
      .sort({ createdAt: -1 })
      .limit(100);

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

/**
 * PATCH: Order Cancel করা (Admin)
 */
export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['admin'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { orderId, reason } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Order cannot be cancelled' },
        { status: 400 }
      );
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelledBy = 'admin';
    order.cancellationReason = reason || 'Cancelled by admin';

    // Payment Refund করা
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

    return NextResponse.json({
      success: true,
      order,
      message: 'Order cancelled successfully',
    });
  } catch (error: any) {
    console.error('Order Cancel Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel order' },
      { status: 500 }
    );
  }
}

