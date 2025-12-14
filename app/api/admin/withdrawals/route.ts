import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';
import Seller from '@/models/Seller';
import Transaction from '@/models/Transaction';
import { requireRole } from '@/lib/auth';

/**
 * GET: সকল Withdrawal Requests List করা (Admin)
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

    const withdrawals = await Withdrawal.find(query)
      .populate('sellerId', 'storeName')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      withdrawals,
    });
  } catch (error: any) {
    console.error('Withdrawals Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch withdrawals' },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Withdrawal Approve/Reject করা (Admin)
 */
export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['admin'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { withdrawalId, action, rejectionReason } = body; // action: 'approve' | 'reject'

    if (!withdrawalId || !action) {
      return NextResponse.json(
        { error: 'Withdrawal ID and action are required' },
        { status: 400 }
      );
    }

    const withdrawal = await Withdrawal.findById(withdrawalId).populate('sellerId');
    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json(
        { error: 'Withdrawal already processed' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      withdrawal.status = 'approved';
      withdrawal.approvedBy = user.userId;
      withdrawal.approvedAt = new Date();
      await withdrawal.save();

      // Transaction Number Generate করা (validation-এর আগে)
      const transactionCount = await Transaction.countDocuments();
      const transactionNumber = `TXN-${Date.now()}-${String(transactionCount + 1).padStart(6, '0')}`;

      // Transaction Create করা
      const transaction = await Transaction.create({
        transactionNumber, // Manually generate করা transactionNumber
        userId: (withdrawal.sellerId as any).userId,
        type: 'payout',
        amount: -withdrawal.amount,
        status: 'completed',
        paymentMethod: withdrawal.method,
        withdrawalId: withdrawal._id,
        description: `Withdrawal payout for ${withdrawal.withdrawalNumber}`,
      });

      withdrawal.transactionId = transaction._id;
      withdrawal.status = 'completed';
      await withdrawal.save();

      // Seller-এর Pending Withdrawals Update করা
      const seller = await Seller.findById(withdrawal.sellerId);
      if (seller) {
        seller.pendingWithdrawals -= withdrawal.amount;
        await seller.save();
      }
    } else if (action === 'reject') {
      withdrawal.status = 'rejected';
      withdrawal.rejectionReason = rejectionReason || 'Rejected by admin';
      await withdrawal.save();

      // Seller-এর Balance Refund করা
      const seller = await Seller.findById(withdrawal.sellerId);
      if (seller) {
        seller.pendingWithdrawals -= withdrawal.amount;
        seller.availableBalance += withdrawal.amount;
        await seller.save();
      }
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      withdrawal,
      message: `Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error: any) {
    console.error('Withdrawal Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update withdrawal' },
      { status: 500 }
    );
  }
}

