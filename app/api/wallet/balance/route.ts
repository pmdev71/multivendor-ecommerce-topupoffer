import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireRole } from '@/lib/auth';

/**
 * GET: User Wallet Balance Fetch করা
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['customer', 'seller', 'admin'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userDoc = await User.findById(user.userId).select('wallet');
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      balance: userDoc.wallet.balance,
      wallet: userDoc.wallet,
    });
  } catch (error: any) {
    console.error('Wallet Balance Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}

