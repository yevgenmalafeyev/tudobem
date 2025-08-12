import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createApiError } from './api-utils';

export async function withAdminAuth(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const cookieStore = await cookies();
      const adminSession = cookieStore.get('admin-session');
      
      if (!adminSession || adminSession.value !== 'authenticated') {
        return createApiError('Unauthorized', 401);
      }
      
      return await handler(request);
    } catch (error) {
      console.error('Admin middleware error:', error);
      return createApiError('Internal server error', 500);
    }
  };
}

export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin@tudobem.blaster.app',
  password: process.env.ADMIN_PASSWORD || '321admin123'
};

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('admin-session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
}

// Simple admin middleware for API routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function adminMiddleware(_request: NextRequest): Promise<NextResponse | null> {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin-session');
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      return createApiError('Unauthorized', 401);
    }
    
    return null; // No error, continue
  } catch (error) {
    console.error('Admin middleware error:', error);
    return createApiError('Internal server error', 500);
  }
}