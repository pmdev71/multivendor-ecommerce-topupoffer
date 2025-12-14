import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import SellerProduct from '@/models/SellerProduct';
import Seller from '@/models/Seller';

/**
 * GET: Specific Product Details with All Sellers
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Await params in Next.js 15
    const { id } = await params;

    // Validate ObjectId format
    if (!id || id.length !== 24) {
      return NextResponse.json({ success: false, error: 'Invalid product ID format' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    if (!product.isApproved) {
      return NextResponse.json({ success: false, error: 'Product is pending approval' }, { status: 403 });
    }
    if (product.status !== 'active') {
      return NextResponse.json({ success: false, error: 'Product is not active' }, { status: 403 });
    }

    // সকল Active Seller-দের Price List করা (Lowest Price আগে)
    const sellerProducts = await SellerProduct.find({
      productId: id,
      isActive: true,
    })
      .populate({
        path: 'sellerId',
        select: 'storeName isOnline rating totalOrders completedOrders',
      })
      .sort({ price: 1 });

    return NextResponse.json({
      success: true,
      product: {
        ...product.toObject(),
        sellers: sellerProducts.map((sp) => ({
          _id: sp._id.toString(), // sellerProductId - needed for order creation
          sellerId: sp.sellerId,
          price: sp.price,
          stock: sp.stock,
        })),
        lowestPrice: sellerProducts[0]?.price || null,
      },
    });
  } catch (error: any) {
    console.error('Product Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

