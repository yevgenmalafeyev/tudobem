import { NextRequest } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling } from '@/lib/api-utils';

interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

async function registerHandler(request: NextRequest) {
  const { username, password, email } = await parseRequestBody<RegisterRequest>(request);

  // Validate required fields
  if (!username || !password) {
    return createApiError('Username and password are required', 400);
  }

  // Validate username format
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  if (!usernameRegex.test(username)) {
    return createApiError('Username must be 3-50 characters and contain only letters, numbers, and underscores', 400);
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return createApiError('Password must be at least 8 characters with at least one letter and one number', 400);
  }

  // Validate email format if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createApiError('Invalid email format', 400);
    }
  }

  try {
    // Initialize database tables if needed
    await UserDatabase.initializeTables();

    // Register user
    const user = await UserDatabase.registerUser(username, password, email);

    // Return user data without password hash
    const { password_hash, ...userResponse } = user;
    
    return createApiResponse({
      user: userResponse,
      message: 'User registered successfully'
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return createApiError(error.message, 409);
      }
    }
    throw error;
  }
}

export const POST = withErrorHandling(registerHandler);