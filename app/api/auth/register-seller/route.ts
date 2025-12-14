import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Seller from '@/models/Seller';
import { requireRole } from '@/lib/auth';

/**
 * Seller Registration API
 * User নিজেকে Seller হিসেবে Register করতে পারবে
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['customer', 'seller'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { storeName } = body;

    if (!storeName || storeName.trim().length < 3) {
      return NextResponse.json(
        { error: 'Store name must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Check if user already has a seller account
    const existingSeller = await Seller.findOne({ userId: user.userId });
    if (existingSeller) {
      return NextResponse.json(
        { error: 'Seller account already exists' },
        { status: 400 }
      );
    }

    // Create Seller Account
    const seller = await Seller.create({
      userId: user.userId,
      storeName: storeName.trim(),
      isApproved: false, // Admin Approval Required
    });

    // Update User Role
    await User.findByIdAndUpdate(user.userId, { role: 'seller' });

    return NextResponse.json({
      success: true,
      seller: {
        id: seller._id,
        storeName: seller.storeName,
        isApproved: seller.isApproved,
      },
      message: 'Seller account created. Waiting for admin approval.',
    });
  } catch (error: any) {
    console.error('Seller Registration Error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}

