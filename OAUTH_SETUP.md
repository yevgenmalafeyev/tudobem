# OAuth Authentication Setup Guide

## Issue Resolution

**Problem:** OAuth login (Google, Facebook) shows "Server error" because environment variables are not configured.

**Root Cause:** NextAuth.js requires OAuth provider credentials, but they're missing from both local and production environments.

## Required Environment Variables

Add these to your deployment environment (Vercel, Netlify, etc.):

```bash
# Google OAuth (Required for Google Sign-In)
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# Facebook OAuth (Required for Facebook Sign-In)
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"


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

### 2. Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs:
   - `https://yourdomain.com/api/auth/callback/facebook`
   - `http://localhost:3000/api/auth/callback/facebook` (for development)
5. Copy App ID and App Secret


### 3. NextAuth Secret
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
3. You should see OAuth provider buttons
4. Test login with each provider

## Current Status

- ✅ Code is ready and functional
- ✅ Error handling implemented for missing providers
- ❌ Environment variables need to be configured in production
- ✅ User feedback added for missing OAuth configuration

## Temporary Workaround

The app now shows a clear message when OAuth providers are not configured instead of showing a server error.