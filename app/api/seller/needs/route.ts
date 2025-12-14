import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Need from '@/models/Need';
import Seller from '@/models/Seller';
import Product from '@/models/Product';
import { requireRole } from '@/lib/auth';

/**
 * GET: Seller-এর জন্য Active Need Requests List করা
 * শুধুমাত্র Active এবং Approved Product-এর Need Requests দেখাবে
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['seller'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Seller Find করা
    const seller = await Seller.findOne({ userId: user.userId });
    if (!seller || !seller.isApproved) {
      return NextResponse.json(
        { error: 'Seller not found or not approved' },
        { status: 403 }
      );
    }

    // Active Need Requests Fetch করা
    const needs = await Need.find({
      status: 'active',
      expiresAt: { $gt: new Date() }, // Not expired
    })
      .populate({
        path: 'productId',
        match: { isApproved: true, status: 'active' }, // Only approved products
      })
      .sort({ createdAt: -1 })
      .limit(50);

    // Filter out needs with null productId (not approved products)
    const validNeeds = needs.filter((need) => need.productId !== null);

    return NextResponse.json({
      success: true,
      needs: validNeeds,
      count: validNeeds.length,
    });
  } catch (error: any) {
    console.error('Seller Needs Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch needs' },
      { status: 500 }
    );
  }
}

