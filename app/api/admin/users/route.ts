import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireRole } from '@/lib/auth';

/**
 * GET: সকল Users List করা (Admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth check for development - enable in production
    // const { user, error } = await requireRole(['admin'])(request);
    // if (error || !user) {
    //   return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const isBlocked = searchParams.get('isBlocked');

    const query: any = {};
    if (role) query.role = role;
    if (isBlocked !== null) query.isBlocked = isBlocked === 'true';

    const users = await User.find(query)
      .select('-wallet.transactions')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    console.error('Users Fetch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create New User (Admin)
 */
export async function POST(request: NextRequest) {
  try {
    // Temporarily disable auth check for development - enable in production
    // const { user, error } = await requireRole(['admin'])(request);
    // if (error || !user) {
    //   return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();

    const body = await request.json();
    const { name, email, phone, role = 'customer', password } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      role,
      googleId: `admin_created_${Date.now()}`, // Temporary ID for admin-created users
      wallet: {
        balance: 0,
        transactions: [],
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
      message: 'User created successfully',
    });
  } catch (error: any) {
    console.error('User Creation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

/**
 * PATCH: User Block/Unblock করা (Admin)
 */
export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await requireRole(['admin'])(request);
    if (error || !user) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { userId, isBlocked } = body;

    if (!userId || typeof isBlocked !== 'boolean') {
      return NextResponse.json(
        { error: 'User ID and isBlocked status are required' },
        { status: 400 }
      );
    }

    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    userDoc.isBlocked = isBlocked;
    await userDoc.save();

    return NextResponse.json({
      success: true,
      user: userDoc,
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
    });
  } catch (error: any) {
    console.error('User Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

