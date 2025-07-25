import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling } from '@/lib/api-utils';

interface LoginRequest {
  username: string;
  password: string;
}

async function loginHandler(request: NextRequest) {
  const { username, password } = await parseRequestBody<LoginRequest>(request);

  // Validate required fields
  if (!username || !password) {
    return createApiError('Username and password are required', 400);
  }

  try {
    // Initialize database tables if needed
    await UserDatabase.initializeTables();

    // Attempt login
    const { user, token } = await UserDatabase.loginUser(username, password);

    // Set secure HTTP-only cookie with session token
    const cookieStore = await cookies();
    cookieStore.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    });

    // Return user data without password hash
    const { password_hash, ...userResponse } = user;
    
    return createApiResponse({
      user: userResponse,
      token, // Also return token for frontend storage if needed
      message: 'Login successful'
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid username or password')) {
      return createApiError('Invalid username or password', 401);
    }
    throw error;
  }
}

export const POST = withErrorHandling(loginHandler);