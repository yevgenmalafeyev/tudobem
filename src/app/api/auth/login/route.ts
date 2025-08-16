import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling } from '@/lib/api-utils';

export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    const { email, password, sessionId } = await parseRequestBody<{ email: string; password: string; sessionId?: string }>(request);

    if (!email || !password) {
      return createApiError('Email and password are required', 400);
    }

    const result = await UserDatabase.loginUser(email, password);

    // Migrate session data to user profile if sessionId is provided
    if (sessionId) {
      try {
        await UserDatabase.migrateSessionDataToUser(result.user.id, sessionId);
      } catch (migrationError) {
        console.error('Session migration failed during login:', migrationError);
        // Don't fail login if migration fails
      }
    }

    // Remove password hash from user data before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userResponse } = result.user;
    
    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    return createApiResponse({
      token: result.token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login API error:', error);
    return createApiError('Internal server error', 500);
  }
});