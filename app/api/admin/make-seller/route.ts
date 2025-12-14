import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Seller from '@/models/Seller';

/**
 * POST: Convert a user to seller (Admin only)
 * For testing purposes - temporarily disabled auth
 */
export async function POST(request: NextRequest) {
  try {
    // Temporarily disabled auth for testing
    // const { user, error } = await requireRole(['admin'])(request);
    // if (error || !user) {
    //   return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();

    const body = await request.json();
    const { userId, email } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    // Find user by ID or email
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user role to seller
    user.role = 'seller';
    await user.save();

    // Check if seller profile already exists
    let seller = await Seller.findOne({ userId: user._id });
    
    if (!seller) {
      // Create seller profile WITHOUT store name - seller will set it later
      seller = await Seller.create({
        userId: user._id,
        storeName: '', // Empty - seller needs to set it
        isApproved: true,
        isOnline: false,
        availableBalance: 0,
        totalEarnings: 0,
        completedOrders: 0,
        totalOrders: 0,
        rating: 0,
      });
    } else {
      // Update existing seller profile
      seller.isApproved = true;
      await seller.save();
    }

    return NextResponse.json({
      success: true,
      message: 'User converted to seller successfully',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      seller: {
        _id: seller._id,
        storeName: seller.storeName,
        isApproved: seller.isApproved,
      },
    });
  } catch (error: any) {
    console.error('Make Seller Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to convert user to seller' },
      { status: 500 }
    );
  }
}

