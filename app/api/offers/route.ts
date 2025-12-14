import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Offer from '@/models/Offer';
import Need from '@/models/Need';
import Seller from '@/models/Seller';
import SellerProduct from '@/models/SellerProduct';
import { requireRole } from '@/lib/auth';

/**
 * POST: Seller Need Request-এ Offer দেওয়া
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['seller'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const seller = await Seller.findOne({ userId: user.userId });
    if (!seller || !seller.isApproved || !seller.isOnline) {
      return NextResponse.json(
        { error: 'Seller not available or offline' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { needId, price } = body;

    if (!needId || !price || price < 0) {
      return NextResponse.json(
        { error: 'Need ID and valid price are required' },
        { status: 400 }
      );
    }

    // Need Request Fetch করা
    const need = await Need.findById(needId).populate('productId');
    if (!need || need.status !== 'active') {
      return NextResponse.json(
        { error: 'Need request not found or expired' },
        { status: 404 }
      );
    }

    // Seller-এর কাছে এই Product আছে কিনা Check করা
    const sellerProduct = await SellerProduct.findOne({
      sellerId: seller._id,
      productId: need.productId._id,
      isActive: true,
    });

    if (!sellerProduct) {
      return NextResponse.json(
        { error: 'You do not have this product in your store' },
        { status: 400 }
      );
    }

    // Already Offer দেওয়া আছে কিনা Check করা
    const existingOffer = await Offer.findOne({
      needId,
      sellerId: seller._id,
    });

    if (existingOffer) {
      // Existing Offer Update করা
      existingOffer.price = price;
      existingOffer.status = 'pending';
      existingOffer.expiresAt = new Date(Date.now() + 30 * 60 * 1000);
      await existingOffer.save();

      // Socket.IO Event Emit করা হবে
      return NextResponse.json({
        success: true,
        offer: existingOffer,
        message: 'Offer updated successfully',
      });
    }

    // Offer Number Generate করা (validation-এর আগে)
    const offerCount = await Offer.countDocuments();
    const offerNumber = `OFFER-${Date.now()}-${String(offerCount + 1).padStart(6, '0')}`;

    // নতুন Offer Create করা
    const offer = await Offer.create({
      offerNumber, // Manually generate করা offerNumber
      needId,
      sellerId: seller._id,
      productId: need.productId._id,
      price,
      status: 'pending',
    });

    // Socket.IO Event Emit করা
    try {
      const { getSocketIO } = await import('@/lib/socket-server');
      const io = getSocketIO();
      
      if (io) {
        // Seller-এর Socket.IO Event Emit করা
        io.to(`seller:${seller._id.toString()}`).emit('offer:submit', {
          needId: need._id.toString(),
          offerId: offer._id.toString(),
        });

        // Need Owner-এর কাছে Notification
        io.to(`user:${need.customerId.toString()}`).emit('need:offer', {
          needId: need._id.toString(),
          offerId: offer._id.toString(),
          sellerId: seller._id.toString(),
          storeName: seller.storeName,
          price: offer.price,
          message: 'New offer received',
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Socket.IO emit error:', error);
    }

    return NextResponse.json({
      success: true,
      offer,
      message: 'Offer submitted successfully',
    });
  } catch (error: any) {
    console.error('Offer Create Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create offer' },
      { status: 500 }
    );
  }
}

/**
 * GET: Seller-এর Offers List করা
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = { sellerId: seller._id };
    if (status) {
      query.status = status;
    }

    const offers = await Offer.find(query)
      .populate('needId')
      .populate('productId')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      offers,
    });
  } catch (error: any) {
    console.error('Offers Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

