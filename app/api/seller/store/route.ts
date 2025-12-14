import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Seller from '@/models/Seller';
import { requireRole } from '@/lib/auth';

/**
 * GET: Get Seller Store Info
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
      return NextResponse.json(
        { error: 'Seller profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      seller: {
        _id: seller._id,
        storeName: seller.storeName,
        isApproved: seller.isApproved,
        isOnline: seller.isOnline,
        availableBalance: seller.availableBalance,
        totalEarnings: seller.totalEarnings,
      },
    });
  } catch (error: any) {
    console.error('Seller Store Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch seller store' },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Update Seller Store Name
 */
export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['seller'])(request);
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

    const seller = await Seller.findOne({ userId: user.userId });
    if (!seller) {
      return NextResponse.json(
        { error: 'Seller profile not found' },
        { status: 404 }
      );
    }

    seller.storeName = storeName.trim();
    await seller.save();

    return NextResponse.json({
      success: true,
      seller: {
        _id: seller._id,
        storeName: seller.storeName,
        isApproved: seller.isApproved,
      },
      message: 'Store name updated successfully',
    });
  } catch (error: any) {
    console.error('Seller Store Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update store name' },
      { status: 500 }
    );
  }
}


