import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Seller from '@/models/Seller';
import User from '@/models/User';
import { requireRole } from '@/lib/auth';

/**
 * GET: সকল Sellers List করা (Admin)
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
    const isApproved = searchParams.get('isApproved');

    const query: any = {};
    if (isApproved !== null) {
      query.isApproved = isApproved === 'true';
    }

    const sellers = await Seller.find(query)
      .populate('userId', 'name email image')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      sellers,
    });
  } catch (error: any) {
    console.error('Sellers Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sellers' },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Seller Approve/Block করা (Admin)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Temporarily disable auth check for development
    // const { user, error } = await requireRole(['admin'])(request);
    // if (error || !user) {
    //   return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();

    const body = await request.json();
    const { sellerId, action } = body; // action: 'approve' | 'block'

    if (!sellerId || !action) {
      return NextResponse.json(
        { error: 'Seller ID and action are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'block'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "block"' },
        { status: 400 }
      );
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    if (action === 'approve') {
      seller.isApproved = true;
      // Set approval metadata if fields exist
      if (seller.schema.paths.approvedBy) {
        // seller.approvedBy = user.userId; // Uncomment when auth is enabled
      }
      if (seller.schema.paths.approvedAt) {
        seller.approvedAt = new Date();
      }
      await seller.save();
      
      console.log(`✅ Seller approved: ${seller.storeName} (${sellerId})`);
    } else if (action === 'block') {
      seller.isApproved = false;
      await seller.save();
      
      console.log(`❌ Seller blocked: ${seller.storeName} (${sellerId})`);
    }

    return NextResponse.json({
      success: true,
      seller: {
        _id: seller._id,
        storeName: seller.storeName,
        isApproved: seller.isApproved,
        userId: seller.userId,
      },
      message: `Seller ${action === 'approve' ? 'approved' : 'blocked'} successfully`,
    });
  } catch (error: any) {
    console.error('Seller Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update seller' },
      { status: 500 }
    );
  }
}

