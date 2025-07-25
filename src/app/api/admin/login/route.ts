import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling } from '@/lib/api-utils';

interface AdminLoginRequest {
  username: string;
  password: string;
}

// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '321admin123';

async function adminLoginHandler(request: NextRequest) {
  const { username, password } = await parseRequestBody<AdminLoginRequest>(request);

  // Validate required fields
  if (!username || !password) {
    return createApiError('Username and password are required', 400);
  }

  // Check hardcoded credentials
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return createApiError('Invalid admin credentials', 401);
  }

  try {
    // Set secure HTTP-only cookie for admin session
    const cookieStore = await cookies();
    cookieStore.set('admin-session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: '/'
    });
    
    return createApiResponse({
      message: 'Admin login successful',
      admin: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    });
  } catch (error) {
    throw error;
  }
}

export const POST = withErrorHandling(adminLoginHandler);