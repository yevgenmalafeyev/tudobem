# OAuth Authentication Setup Guide

## Current Issue Resolution

**Problem:** Google OAuth login shows an error when attempting to register/login via Google.

**Root Cause:** The `.env.local` file contains placeholder OAuth credentials (`your-google-client-id-here`). The application correctly detects invalid credentials and disables OAuth accordingly.

**Status:** 
- ✅ The error handling is working correctly
- ✅ LocalStorage persistence for logged-out users is now implemented
- ❌ Google OAuth requires proper credentials to function

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

## Implementation Status

- ✅ Code is ready and functional
- ✅ Error handling implemented for missing provider
- ✅ LocalStorage persistence for logged-out user preferences implemented
- ✅ Authentication state synchronization implemented  
- ✅ Guest preferences preserved when logging in/out
- ❌ Environment variables need to be configured for Google OAuth
- ✅ User feedback added for missing OAuth configuration

## Current Authentication Features

### ✅ Working Features:
1. **Email/Password Authentication** - Full registration and login system
2. **Guest Mode with Persistence** - User preferences saved in localStorage
3. **Auth State Management** - Automatic sync between logged-in and guest states
4. **Profile Configuration Override** - User profile settings override guest preferences when logging in
5. **Guest Preference Restoration** - Guest preferences restored when logging out

### ❌ Requires Setup:
1. **Google OAuth** - Needs proper credentials in environment variables

## User Experience

- Users can configure language, levels, topics, and tense preferences while logged out
- These preferences persist in localStorage across browser sessions
- When logging in, user profile settings (if any) override guest preferences
- When logging out, guest preferences are restored automatically
- Google OAuth shows helpful error message until proper credentials are configured