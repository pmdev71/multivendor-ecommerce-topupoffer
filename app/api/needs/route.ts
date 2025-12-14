import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Need from '@/models/Need';
import Offer from '@/models/Offer';
import Seller from '@/models/Seller';
import Product from '@/models/Product';
import { requireRole } from '@/lib/auth';

/**
 * POST: Need Request Create করা
 * Customer Need Request দিলে সকল Online Seller-দের কাছে Notification যাবে
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['customer'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { productId, operator, mobileNumber, quantity = 1 } = body;

    if (!productId || !operator || !mobileNumber) {
      return NextResponse.json(
        { error: 'Product ID, operator, and mobile number are required' },
        { status: 400 }
      );
    }

    // Need Number Generate করা
    const needCount = await Need.countDocuments();
    const needNumber = `NEED-${Date.now()}-${String(needCount + 1).padStart(6, '0')}`;

    // Need Request Create করা
    const need = await Need.create({
      needNumber,
      customerId: user.userId,
      productId,
      operator,
      mobileNumber,
      quantity,
      status: 'active',
    });

    // সকল Online Seller-দের List করা
    const onlineSellers = await Seller.find({ isOnline: true, isApproved: true });

    // Socket.IO Event Emit করা
    try {
      const { getSocketIO } = await import('@/lib/socket-server');
      const io = getSocketIO();
      
      if (io) {
        // Customer-এর Socket.IO Event Emit করা
        io.to(`user:${user.userId}`).emit('need:create', {
          needId: need._id.toString(),
        });

        // Product details fetch করা notification-এ পাঠানোর জন্য
        const product = await Product.findById(need.productId);
        
        // সকল Online Seller-দের কাছে Notification পাঠানো
        onlineSellers.forEach((seller) => {
          io.to(`seller:${seller._id.toString()}`).emit('need:new', {
            needId: need._id.toString(),
            needNumber: need.needNumber,
            productId: need.productId.toString(),
            productName: product?.name || 'Product',
            operator: need.operator,
            mobileNumber: need.mobileNumber,
            quantity: need.quantity,
            message: 'New need request available',
            timestamp: new Date(),
          });
        });
      }
    } catch (error) {
      console.error('Socket.IO emit error:', error);
      // Continue even if Socket.IO fails
    }

    return NextResponse.json({
      success: true,
      need,
      onlineSellersCount: onlineSellers.length,
      message: 'Need request created. Sellers will be notified.',
    });
  } catch (error: any) {
    console.error('Need Request Create Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create need request' },
      { status: 500 }
    );
  }
}

/**
 * GET: Customer-এর Need Requests List করা
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['customer'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = { customerId: user.userId };
    if (status) {
      query.status = status;
    }

    const needs = await Need.find(query)
      .populate('productId')
      .populate('acceptedOfferId')
      .populate('acceptedOrderId')
      .sort({ createdAt: -1 });

    // প্রতিটি Need-এর জন্য Offers Fetch করা
    const needsWithOffers = await Promise.all(
      needs.map(async (need) => {
        const offers = await Offer.find({ needId: need._id })
          .populate('sellerId', 'storeName rating')
          .sort({ price: 1 });

        return {
          ...need.toObject(),
          offers,
          offersCount: offers.length,
        };
      })
    );

    return NextResponse.json({
      success: true,
      needs: needsWithOffers,
    });
  } catch (error: any) {
    console.error('Needs Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch needs' },
      { status: 500 }
    );
  }
}

