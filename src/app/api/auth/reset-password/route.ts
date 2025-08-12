import { NextRequest } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling } from '@/lib/api-utils';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

// POST - Request password reset
export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    const { email } = await parseRequestBody<{ email: string }>(request);

    if (!email) {
      return createApiError('Email is required', 400);
    }

    // Check if user exists
    const userExists = await UserDatabase.findUserByEmail(email);
    
    // Always return success to prevent email enumeration attacks
    if (!userExists) {
      return createApiResponse({
        message: 'If an account with this email exists, a password reset link has been sent.'
      });
    }

    // Generate password reset token
    const resetToken = await UserDatabase.generatePasswordResetToken(email);
    await UserDatabase.sendPasswordResetEmail(email, resetToken);

    return createApiResponse({
      message: 'If an account with this email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    return createApiError('Internal server error', 500);
  }
});

// PUT - Reset password with token
export const PUT = withErrorHandling(async (request: NextRequest) => {
  try {
    const { token, newPassword } = await parseRequestBody<{ 
      token: string; 
      newPassword: string; 
    }>(request);

    if (!token || !newPassword) {
      return createApiError('Token and new password are required', 400);
    }

    if (newPassword.length < 8) {
      return createApiError('Password must be at least 8 characters long', 400);
    }

    // Verify the reset token
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; type: string };

    if (decoded.type !== 'password_reset') {
      return createApiError('Invalid token type', 400);
    }

    // Reset the password
    const result = await UserDatabase.resetPassword(decoded.email, newPassword);

    if (!result) {
      return createApiError('User not found or password reset failed', 404);
    }

    return createApiResponse({
      message: 'Password reset successfully. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return createApiError('Invalid or expired reset token', 400);
    }
    return createApiError('Password reset failed', 500);
  }
});