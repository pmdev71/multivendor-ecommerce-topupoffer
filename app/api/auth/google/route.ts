import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

/**
 * Google OAuth Login API
 * Google One Click Login এর জন্য
 * 
 * Two methods:
 * 1. GET - Redirect to Google OAuth
 * 2. POST - Verify Google ID Token (for client-side)
 */
export async function GET(request: NextRequest) {
  try {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Google OAuth not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const redirectUri = searchParams.get('redirect_uri') || 
      `${new URL(request.url).origin}/api/auth/google/callback`;

    // Google OAuth2 Client
    const oauth2Client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // Generate OAuth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      prompt: 'consent',
    });

    return NextResponse.json({
      success: true,
      authUrl,
      message: 'Redirect user to authUrl for Google login',
    });
  } catch (error: any) {
    console.error('Google OAuth URL Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate OAuth URL' },
      { status: 500 }
    );
  }
}

/**
 * POST: Verify Google ID Token (Client-side verification)
 * Frontend থেকে Google ID Token verify করে user login করবে
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { error: 'Google OAuth not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { idToken } = body; // Google ID Token from client

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID Token is required' },
        { status: 400 }
      );
    }

    // Verify Google ID Token
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return NextResponse.json(
        { error: 'Email not provided by Google' },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await User.findOne({ $or: [{ email }, { googleId }] });
    let isNewUser = false;

    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.image = picture || user.image;
      user.googleId = googleId;
      await user.save();
    } else {
      // Create new user - role will be set after account type selection
      isNewUser = true;
      user = await User.create({
        email,
        name: name || 'User',
        image: picture,
        googleId,
        role: 'customer', // Default, will be updated after account type selection
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Check if seller has store created
    let sellerStore = null;
    if (user.role === 'seller') {
      const Seller = (await import('@/models/Seller')).default;
      sellerStore = await Seller.findOne({ userId: user._id });
    }

    // Response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        wallet: user.wallet,
      },
      token,
      isNewUser,
      needsAccountTypeSelection: isNewUser,
      sellerStore: sellerStore ? {
        storeName: sellerStore.storeName,
        isApproved: sellerStore.isApproved,
      } : null,
    });

    // Cookie-তে Token Set করা
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}

