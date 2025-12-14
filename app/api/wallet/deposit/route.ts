import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { requireRole } from '@/lib/auth';

/**
 * POST: Wallet Deposit Request করা
 * SSLCommerz বা bKash Payment Gateway-এর সাথে Integration
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['customer', 'seller'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { amount, paymentMethod } = body; // paymentMethod: 'sslcommerz' | 'bkash'

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Minimum deposit amount is 100 BDT' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['sslcommerz', 'bkash'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Transaction Number Generate করা (validation-এর আগে)
    const transactionCount = await Transaction.countDocuments();
    const transactionNumber = `TXN-${Date.now()}-${String(transactionCount + 1).padStart(6, '0')}`;

    // Transaction Create করা (Pending Status)
    const transaction = await Transaction.create({
      transactionNumber, // Manually generate করা transactionNumber
      userId: user.userId,
      type: 'deposit',
      amount,
      status: 'pending',
      paymentMethod,
      description: `Wallet deposit via ${paymentMethod}`,
    });

    // SSLCommerz বা bKash Payment Gateway Integration
    // এখানে Payment Gateway API Call করতে হবে
    // Example for SSLCommerz:
    if (paymentMethod === 'sslcommerz') {
      // SSLCommerz API Integration
      // const sslResponse = await initiateSSLCommerzPayment({
      //   amount,
      //   transactionId: transaction.transactionNumber,
      //   customerId: user.userId,
      // });
      // return NextResponse.json({
      //   success: true,
      //   transaction,
      //   paymentUrl: sslResponse.GatewayPageURL,
      // });
    }

    // bKash Integration
    if (paymentMethod === 'bkash') {
      // bKash API Integration
      // const bkashResponse = await initiateBkashPayment({
      //   amount,
      //   transactionId: transaction.transactionNumber,
      //   customerId: user.userId,
      // });
      // return NextResponse.json({
      //   success: true,
      //   transaction,
      //   paymentUrl: bkashResponse.paymentUrl,
      // });
    }

    // For now, return transaction (Payment Gateway Integration পরে করা হবে)
    return NextResponse.json({
      success: true,
      transaction,
      message: 'Deposit request created. Payment gateway integration pending.',
    });
  } catch (error: any) {
    console.error('Wallet Deposit Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process deposit' },
      { status: 500 }
    );
  }
}

/**
 * GET: Deposit Transactions History
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['customer', 'seller'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const transactions = await Transaction.find({
      userId: user.userId,
      type: 'deposit',
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      transactions,
    });
  } catch (error: any) {
    console.error('Deposit History Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch deposit history' },
      { status: 500 }
    );
  }
}

