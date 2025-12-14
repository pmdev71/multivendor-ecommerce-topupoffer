import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import SellerProduct from '@/models/SellerProduct';
import Seller from '@/models/Seller';

/**
 * GET: সকল Approved Products List করা
 * Lowest Price Seller আগে দেখাবে
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const operator = searchParams.get('operator');
    const category = searchParams.get('category');

    // Query Build করা
    const query: any = { isApproved: true, status: 'active' };
    if (operator) query.operator = operator;
    if (category) query.category = category;

    // Products Fetch করা
    const products = await Product.find(query).sort({ createdAt: -1 });

    // প্রতিটি Product-এর জন্য Lowest Price Seller Product খুঁজে বের করা
    const productsWithPrices = await Promise.all(
      products.map(async (product) => {
        const sellerProducts = await SellerProduct.find({
          productId: product._id,
          isActive: true,
        })
          .populate('sellerId', 'storeName isOnline')
          .sort({ price: 1 })
          .limit(1);

        const lowestPriceSeller = sellerProducts[0] || null;
        const allSellers = await SellerProduct.find({
          productId: product._id,
          isActive: true,
        })
          .populate('sellerId', 'storeName isOnline rating')
          .sort({ price: 1 });

        return {
          ...product.toObject(),
          lowestPrice: lowestPriceSeller?.price || null,
          lowestPriceSeller: lowestPriceSeller
            ? {
                sellerId: lowestPriceSeller.sellerId,
                price: lowestPriceSeller.price,
              }
            : null,
          allSellers: allSellers.map((sp) => ({
            sellerId: sp.sellerId,
            price: sp.price,
          })),
          sellerCount: allSellers.length,
        };
      })
    );

    return NextResponse.json({
      success: true,
      products: productsWithPrices,
    });
  } catch (error: any) {
    console.error('Products Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST: নতুন Product Create করা (Seller/Admin)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { getAuthUser } = await import('@/lib/auth');
    const authUser = await getAuthUser(request);

    if (!authUser || (authUser.role !== 'seller' && authUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, operator, packageSize, validity, image } = body;

    if (!name || !category || !operator) {
      return NextResponse.json(
        { error: 'Name, category, and operator are required' },
        { status: 400 }
      );
    }

    // Product Create করা
    const product = await Product.create({
      name,
      description,
      category,
      operator,
      packageSize,
      validity,
      image,
      createdBy: authUser.userId,
      isApproved: authUser.role === 'admin', // Admin হলে Auto Approve
      status: authUser.role === 'admin' ? 'active' : 'pending',
    });

    return NextResponse.json({
      success: true,
      product,
      message:
        authUser.role === 'admin'
          ? 'Product created successfully'
          : 'Product created. Waiting for admin approval.',
    });
  } catch (error: any) {
    console.error('Product Create Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

