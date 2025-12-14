import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SellerProduct from '@/models/SellerProduct';
import Product from '@/models/Product';
import Seller from '@/models/Seller';
import { requireRole } from '@/lib/auth';

/**
 * GET: Seller-এর সকল Products List করা
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

    const sellerProducts = await SellerProduct.find({ sellerId: seller._id })
      .populate('productId')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products: sellerProducts,
    });
  } catch (error: any) {
    console.error('Seller Products Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST: Seller Product Add করা বা Price Update করা
 */
export async function POST(request: NextRequest) {
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
    const { productId, price, stock } = body;

    if (!productId || !price || price < 0) {
      return NextResponse.json(
        { error: 'Product ID and valid price are required' },
        { status: 400 }
      );
    }

    // Product Approved আছে কিনা Check করা
    const product = await Product.findById(productId);
    if (!product || !product.isApproved) {
      return NextResponse.json(
        { error: 'Product not found or not approved' },
        { status: 404 }
      );
    }

    // SellerProduct Update বা Create করা
    const sellerProduct = await SellerProduct.findOneAndUpdate(
      { sellerId: seller._id, productId },
      {
        price,
        stock: stock !== undefined ? stock : undefined,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      sellerProduct,
      message: 'Product added/updated successfully',
    });
  } catch (error: any) {
    console.error('Seller Product Add Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add product' },
      { status: 500 }
    );
  }
}

