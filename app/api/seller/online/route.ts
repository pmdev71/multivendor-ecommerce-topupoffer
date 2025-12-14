import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Seller from '@/models/Seller';
import { requireRole } from '@/lib/auth';

/**
 * PATCH: Seller Online/Offline Status Update করা
 */
export async function PATCH(request: NextRequest) {
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
    const { isOnline } = body;

    if (typeof isOnline !== 'boolean') {
      return NextResponse.json(
        { error: 'isOnline must be a boolean' },
        { status: 400 }
      );
    }

    seller.isOnline = isOnline;
    await seller.save();

    // Socket.IO Event Emit করা হবে
    // seller:online বা seller:offline event

    return NextResponse.json({
      success: true,
      seller: {
        isOnline: seller.isOnline,
      },
      message: `Seller ${isOnline ? 'online' : 'offline'}`,
    });
  } catch (error: any) {
    console.error('Seller Online Status Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update status' },
      { status: 500 }
    );
  }
}

