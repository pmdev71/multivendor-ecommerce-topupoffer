import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SellerProduct from '@/models/SellerProduct';
import Seller from '@/models/Seller';
import { requireRole } from '@/lib/auth';

/**
 * PATCH: Seller Product Update করা (isActive, price, stock)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { isActive, price, stock } = body;

    // SellerProduct Find করা (seller-এর own product হতে হবে)
    const sellerProduct = await SellerProduct.findOne({
      _id: id,
      sellerId: seller._id,
    });

    if (!sellerProduct) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update fields
    if (typeof isActive === 'boolean') {
      sellerProduct.isActive = isActive;
    }

    if (price !== undefined && price >= 0) {
      sellerProduct.price = price;
    }

    if (stock !== undefined) {
      sellerProduct.stock = stock >= 0 ? stock : undefined;
    }

    await sellerProduct.save();

    return NextResponse.json({
      success: true,
      sellerProduct,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('Seller Product Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Seller Product Remove করা
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // SellerProduct Delete করা
    const sellerProduct = await SellerProduct.findOneAndDelete({
      _id: id,
      sellerId: seller._id,
    });

    if (!sellerProduct) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error: any) {
    console.error('Seller Product Delete Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

