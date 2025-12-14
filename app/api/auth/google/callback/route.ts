import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

/**
 * Google OAuth Callback Handler
 * Google থেকে redirect হওয়ার পর token exchange করে user create/login করে
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/login?error=no_code', request.url)
      );
    }

    // Google OAuth2 Client
    const oauth2Client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      `${new URL(request.url).origin}/api/auth/google/callback`
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.redirect(
        new URL('/login?error=invalid_token', request.url)
      );
    }

    await connectDB();

    const { email, name, picture, sub: googleId } = payload;

    // Find or create user
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.image = picture || user.image;
      user.googleId = googleId;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        email: email!,
        name: name || 'User',
        image: picture,
        googleId,
        role: 'customer',
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Redirect to dashboard with token
    const redirectUrl = new URL('/dashboard', request.url);
    redirectUrl.searchParams.set('token', token);

    const response = NextResponse.redirect(redirectUrl);

    // Set token in cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Google OAuth Callback Error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}

