import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Seller from '@/models/Seller';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Withdrawal from '@/models/Withdrawal';

/**
 * GET: Admin Dashboard Stats
 */
export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth check for development - enable in production
    // const { user, error } = await requireRole(['admin'])(request);
    // if (error || !user) {
    //   return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();

    // Get counts
    const [
      totalUsers,
      totalSellers,
      totalOrders,
      totalProducts,
      pendingSellers,
      pendingProducts,
      pendingWithdrawals,
      completedOrders,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Seller.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Seller.countDocuments({ isApproved: false }),
      Product.countDocuments({ isApproved: false, status: 'pending' }),
      Withdrawal.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
    ]);

    // Calculate total revenue from completed orders
    const revenueData = await Order.aggregate([
      { $match: { status: 'completed', paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalOrders,
        totalProducts,
        totalRevenue,
        pendingSellers,
        pendingProducts,
        pendingWithdrawals,
        completedOrders,
      },
    });
  } catch (error: any) {
    console.error('Stats Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

