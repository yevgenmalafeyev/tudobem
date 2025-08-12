import { NextRequest } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';
import { createApiResponse, createApiError, parseRequestBody, withErrorHandling } from '@/lib/api-utils';

export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    const { email, password, name, privacyPolicyAgreed, emailMarketingConsent } = await parseRequestBody<{ 
      email: string; 
      password: string; 
      name: string;
      privacyPolicyAgreed: boolean;
      emailMarketingConsent: boolean;
    }>(request);

    if (!email || !password || !name) {
      return createApiError('Email, password, and name are required', 400);
    }

    if (!privacyPolicyAgreed) {
      return createApiError('You must agree to the Privacy Policy to create an account', 400);
    }

    if (password.length < 8) {
      return createApiError('Password must be at least 8 characters long', 400);
    }

    const user = await UserDatabase.registerUser(name, password, email, emailMarketingConsent || false);

    // Generate and send email verification token
    if (email) {
      const verificationToken = await UserDatabase.generateEmailVerificationToken(email);
      await UserDatabase.sendVerificationEmail(email, verificationToken);
    }

    // Remove password hash from user data before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userResponse } = user;

    return createApiResponse({
      message: email 
        ? 'User registered successfully. Please check your email to verify your account.'
        : 'User registered successfully',
      user: userResponse,
      emailSent: !!email
    });
  } catch (error) {
    console.error('Signup API error:', error);
    return createApiError('Internal server error', 500);
  }
});