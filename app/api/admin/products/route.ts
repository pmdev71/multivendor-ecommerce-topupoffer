import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireRole } from '@/lib/auth';

/**
 * GET: সকল Products List করা (Admin) - Pending Products সহ
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
    const status = searchParams.get('status');
    const isApproved = searchParams.get('isApproved');

    const query: any = {};
    if (status) query.status = status;
    if (isApproved !== null) query.isApproved = isApproved === 'true';

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products,
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
 * PATCH: Product Approve/Disable করা (Admin)
 */
export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['admin'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { productId, action } = body; // action: 'approve' | 'disable' | 'delete'

    if (!productId || !action) {
      return NextResponse.json(
        { error: 'Product ID and action are required' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (action === 'approve') {
      product.isApproved = true;
      product.status = 'active';
      product.approvedBy = user.userId;
      product.approvedAt = new Date();
      await product.save();
    } else if (action === 'disable') {
      product.status = 'inactive';
      await product.save();
    } else if (action === 'delete') {
      await Product.findByIdAndDelete(productId);
      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      product,
      message: `Product ${action === 'approve' ? 'approved' : 'disabled'} successfully`,
    });
  } catch (error: any) {
    console.error('Product Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

