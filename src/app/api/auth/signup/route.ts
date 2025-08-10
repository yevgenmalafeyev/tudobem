import { NextRequest } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling } from '@/lib/api-utils';

export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    const { email, password, name } = await parseRequestBody<{ 
      email: string; 
      password: string; 
      name: string;
    }>(request);

    if (!email || !password || !name) {
      return createApiError('Email, password, and name are required', 400);
    }

    if (password.length < 8) {
      return createApiError('Password must be at least 8 characters long', 400);
    }

    const user = await UserDatabase.registerUser(name, password, email);

    // Remove password hash from user data before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userResponse } = user;

    return createApiResponse({
      user: userResponse
    });
  } catch (error) {
    console.error('Signup API error:', error);
    return createApiError('Internal server error', 500);
  }
});