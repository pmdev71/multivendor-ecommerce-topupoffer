import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Need from '@/models/Need';
import Offer from '@/models/Offer';
import Order from '@/models/Order';
import SellerProduct from '@/models/SellerProduct';
import Seller from '@/models/Seller';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { requireRole } from '@/lib/auth';
import { calculateCommission } from '@/lib/utils';

/**
 * POST: Need Request-এ Offer Accept করা
 * Customer Offer Accept করলে Order Create হবে
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireRole(['customer'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { offerId, paymentMethod } = body;

    if (!offerId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Offer ID and payment method are required' },
        { status: 400 }
      );
    }

    // Need Request Fetch করা
    const need = await Need.findById(id);
    if (!need || need.customerId.toString() !== user.userId) {
      return NextResponse.json({ error: 'Need request not found' }, { status: 404 });
    }

    if (need.status !== 'active') {
      return NextResponse.json(
        { error: 'Need request is no longer active' },
        { status: 400 }
      );
    }

    // Offer Fetch করা
    const offer = await Offer.findById(offerId)
      .populate('sellerId')
      .populate('productId');
    if (!offer || offer.needId.toString() !== need._id.toString()) {
      return NextResponse.json({ error: 'Invalid offer' }, { status: 404 });
    }

    if (offer.status !== 'pending') {
      return NextResponse.json(
        { error: 'Offer is no longer available' },
        { status: 400 }
      );
    }

    const seller = await Seller.findById(offer.sellerId);
    if (!seller || !seller.isApproved) {
      return NextResponse.json(
        { error: 'Seller not available' },
        { status: 404 }
      );
    }

    // SellerProduct খুঁজে বের করা
    const sellerProduct = await SellerProduct.findOne({
      sellerId: seller._id,
      productId: offer.productId._id,
      isActive: true,
    });

    if (!sellerProduct) {
      return NextResponse.json(
        { error: 'Product not available from this seller' },
        { status: 404 }
      );
    }

    // Total Amount Calculate করা
    const totalAmount = offer.price * need.quantity;
    const { commission, sellerAmount } = calculateCommission(totalAmount);

    // Customer Wallet Check করা
    const customer = await User.findById(user.userId);
    if (paymentMethod === 'wallet' && customer.wallet.balance < totalAmount) {
      return NextResponse.json(
        { error: 'Insufficient wallet balance' },
        { status: 400 }
      );
    }

    // Order Number Generate করা (validation-এর আগে)
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${String(orderCount + 1).padStart(6, '0')}`;

    // Order Create করা
    const order = await Order.create({
      orderNumber, // Manually generate করা orderNumber
      customerId: user.userId,
      sellerId: seller._id,
      productId: offer.productId._id,
      sellerProductId: sellerProduct._id,
      operator: need.operator,
      mobileNumber: need.mobileNumber,
      quantity: need.quantity,
      unitPrice: offer.price,
      totalAmount,
      commission,
      sellerAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
    });

    // Need Status Update করা
    need.status = 'accepted';
    need.acceptedOfferId = offer._id;
    need.acceptedOrderId = order._id;
    await need.save();

    // Offer Status Update করা
    offer.status = 'accepted';
    await offer.save();

    // অন্যান্য Offers Reject করা
    await Offer.updateMany(
      { needId: need._id, _id: { $ne: offer._id } },
      { status: 'rejected' }
    );

    // Wallet Payment হলে Balance Deduct করা
    if (paymentMethod === 'wallet') {
      customer.wallet.balance -= totalAmount;
      await customer.save();

      // Transaction Number Generate করা (validation-এর আগে)
      const transactionCount = await Transaction.countDocuments();
      const transactionNumber = `TXN-${Date.now()}-${String(transactionCount + 1).padStart(6, '0')}`;

      await Transaction.create({
        transactionNumber, // Manually generate করা transactionNumber
        userId: user.userId,
        type: 'order_payment',
        amount: -totalAmount,
        status: 'completed',
        paymentMethod: 'wallet',
        orderId: order._id,
        description: `Order payment for ${order.orderNumber}`,
      });
    }

    // Socket.IO Event Emit করা হবে
    // offer:accept এবং order:new events

    return NextResponse.json({
      success: true,
      order,
      message: 'Offer accepted. Order created successfully.',
    });
  } catch (error: any) {
    console.error('Offer Accept Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to accept offer' },
      { status: 500 }
    );
  }
}

