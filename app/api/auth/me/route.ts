import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Seller from '@/models/Seller';
import { requireRole } from '@/lib/auth';

/**
 * GET: Current User Information
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['customer', 'seller', 'admin'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userDoc = await User.findById(user.userId).select('name email image role');
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let sellerInfo = null;
    if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user.userId }).select('storeName isApproved');
      sellerInfo = seller;
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        image: userDoc.image,
        role: userDoc.role,
        seller: sellerInfo,
      },
    });
  } catch (error: any) {
    console.error('User Info Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user info' },
      { status: 500 }
    );
  }
}

