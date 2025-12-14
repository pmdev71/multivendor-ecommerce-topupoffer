import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Seller from '@/models/Seller';
import Withdrawal from '@/models/Withdrawal';
import { requireRole } from '@/lib/auth';

/**
 * POST: Withdrawal Request করা
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['seller'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const seller = await Seller.findOne({ userId: user.userId });
    if (!seller || !seller.isApproved) {
      return NextResponse.json(
        { error: 'Seller not found or not approved' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { amount, method, accountNumber, accountName } = body;

    if (!amount || amount < 500) {
      return NextResponse.json(
        { error: 'Minimum withdrawal amount is 500 BDT' },
        { status: 400 }
      );
    }

    if (amount > seller.availableBalance) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    if (!method || !['bkash', 'nagad', 'rocket', 'bank'].includes(method)) {
      return NextResponse.json(
        { error: 'Invalid withdrawal method' },
        { status: 400 }
      );
    }

    if (!accountNumber) {
      return NextResponse.json(
        { error: 'Account number is required' },
        { status: 400 }
      );
    }

    // Withdrawal Request Create করা
    const withdrawal = await Withdrawal.create({
      sellerId: seller._id,
      amount,
      method,
      accountNumber,
      accountName,
      status: 'pending',
    });

    // Seller-এর Pending Withdrawals Update করা
    seller.pendingWithdrawals += amount;
    seller.availableBalance -= amount;
    await seller.save();

    return NextResponse.json({
      success: true,
      withdrawal,
      message: 'Withdrawal request submitted. Waiting for admin approval.',
    });
  } catch (error: any) {
    console.error('Withdrawal Request Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
}

/**
 * GET: Seller-এর Withdrawal History
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['seller'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const seller = await Seller.findOne({ userId: user.userId });
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    const withdrawals = await Withdrawal.find({ sellerId: seller._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      withdrawals,
    });
  } catch (error: any) {
    console.error('Withdrawal History Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch withdrawal history' },
      { status: 500 }
    );
  }
}

