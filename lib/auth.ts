import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';
import User from '@/models/User';

/**
 * Request থেকে JWT Token Extract করে Verify করার Function
 */
export async function getAuthUser(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Role-based Authorization Check করার Function
 */
export function requireRole(allowedRoles: ('customer' | 'seller' | 'admin')[]) {
  return async (request: NextRequest): Promise<{ user: JWTPayload; error?: string }> => {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return { user: null as any, error: 'Unauthorized' };
    }

    if (!allowedRoles.includes(authUser.role)) {
      return { user: null as any, error: 'Forbidden' };
    }

    // Database থেকে User Check করা
    const user = await User.findById(authUser.userId);
    if (!user || user.isBlocked) {
      return { user: null as any, error: 'User blocked or not found' };
    }

    return { user: authUser };
  };
}

