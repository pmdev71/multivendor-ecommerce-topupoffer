import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireRole } from '@/lib/auth';

/**
 * POST: Set Account Type (Customer or Seller)
 * New users select their account type after Google login
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['customer'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { accountType } = body;

    if (!accountType || !['customer', 'seller'].includes(accountType)) {
      return NextResponse.json(
        { error: 'Invalid account type. Must be customer or seller' },
        { status: 400 }
      );
    }

    // Update user role
    const userDoc = await User.findById(user.userId);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    userDoc.role = accountType;
    await userDoc.save();

    // Generate new token with updated role
    const { generateToken } = await import('@/lib/jwt');
    const token = generateToken({
      userId: userDoc._id.toString(),
      email: userDoc.email,
      role: userDoc.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: userDoc._id.toString(),
        email: userDoc.email,
        name: userDoc.name,
        role: userDoc.role,
      },
      token,
      message: `Account type set to ${accountType}`,
    });

    // Update cookie with new token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Set Account Type Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set account type' },
      { status: 500 }
    );
  }
}


