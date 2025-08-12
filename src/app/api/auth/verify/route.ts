import { NextRequest } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, withErrorHandling } from '@/lib/api-utils';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return createApiError('Verification token is required', 400);
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; type: string };

    if (decoded.type !== 'email_verification') {
      return createApiError('Invalid token type', 400);
    }

    // Mark email as verified and activate user
    const result = await UserDatabase.verifyEmail(decoded.email);

    if (!result) {
      return createApiError('User not found or already verified', 404);
    }

    // Auto-login the user after email verification
    const loginResult = await UserDatabase.loginUserByEmail(decoded.email);

    return createApiResponse({
      message: 'Email verified successfully',
      user: loginResult.user,
      token: loginResult.token,
      verified: true
    });

  } catch (error) {
    console.error('Email verification error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return createApiError('Invalid or expired verification token', 400);
    }
    return createApiError('Verification failed', 500);
  }
});