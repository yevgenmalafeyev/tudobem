import { NextResponse } from 'next/server';

// Check if OAuth credentials are properly configured (not placeholder values)
const isValidGoogleConfig = process.env.GOOGLE_CLIENT_ID && 
  process.env.GOOGLE_CLIENT_SECRET && 
  !process.env.GOOGLE_CLIENT_ID.includes('your-google-client-id') &&
  !process.env.GOOGLE_CLIENT_SECRET.includes('your-google-client-secret');

export async function GET() {
  try {
    const providers: Record<string, boolean> = {};
    
    // Check Google OAuth configuration
    if (isValidGoogleConfig) {
      providers.google = true;
    }
    
    return NextResponse.json(providers);
  } catch (error) {
    console.error('Error checking providers:', error);
    return NextResponse.json(
      { error: 'Failed to check available providers' },
      { status: 500 }
    );
  }
}