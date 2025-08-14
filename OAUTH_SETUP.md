# OAuth Authentication Setup Guide

## Issue Resolution

**Problem:** OAuth login (Google) shows "Server error" because environment variables are not configured.

**Root Cause:** NextAuth.js requires OAuth provider credentials, but they're missing from both local and production environments.

## Required Environment Variables

Add these to your deployment environment (Vercel, Netlify, etc.):

```bash
# Google OAuth (Required for Google Sign-In)
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# NextAuth Configuration (Required)
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secure-nextauth-secret-32-chars-min"
```

## Setup Instructions

### 1. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)
6. Copy Client ID and Client Secret

### 2. NextAuth Secret
Generate a secure secret:
```bash
openssl rand -base64 32
```

## Deployment Steps

### For Vercel:
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add all the variables above
4. Redeploy the application

### For Other Platforms:
Add environment variables to your deployment platform's environment configuration.

## Testing

After adding environment variables:

1. Redeploy the application
2. Visit `/auth/signin`
3. You should see the Google OAuth button
4. Test login with Google

## Current Status

- ✅ Code is ready and functional
- ✅ Error handling implemented for missing provider
- ❌ Environment variables need to be configured in production
- ✅ User feedback added for missing OAuth configuration

## Temporary Workaround

The app now shows a clear message when the OAuth provider is not configured instead of showing a server error.