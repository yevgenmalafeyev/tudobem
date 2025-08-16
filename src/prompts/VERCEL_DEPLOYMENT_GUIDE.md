# Vercel Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Create New Vercel Project
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository `tudobem`
4. **DO NOT deploy yet** - click "Configure Project" first

### 2. Add Neon Database Integration
1. In the project configuration screen, go to **Storage** tab
2. Click "Add Integration" → Search for "Neon"
3. Click "Add" next to Neon Database
4. Follow the setup to create/connect your Neon database
5. This will automatically add all required environment variables:
   - `DATABASE_URL`
   - `POSTGRES_URL`
   - `POSTGRES_USER`, `POSTGRES_PASSWORD`, etc.

### 3. Add Required Environment Variables
Add these additional variables in **Environment Variables** section:
- `ANTHROPIC_API_KEY` = your actual Anthropic API key
- `ADMIN_PASSWORD_HASH` = `$2b$12$BTNEfwEClD7SY3FvLQu/Be9akUFJm6966Ocy9BMiXIuy95dFJ/6sa` (for password: 321admin123)
- `ADMIN_USERNAME` = `admin@tudobem.blaster.app`

### 4. Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. The app will automatically initialize the database on first load

## What Happens During Deployment

1. **Build Phase**: Clean Next.js build with no database operations
2. **Runtime Phase**: Auto-initialization component loads
3. **Database Setup**: 
   - Creates all required tables
   - Loads complete database dump from `database-complete-backup.sql`
   - Replaces API key placeholders with environment variables
   - Shows success notification with exercise count

## Expected Results

After successful deployment, you should see:
- ✅ Clean deployment with no errors
- ✅ App loads successfully
- ✅ Database auto-initializes with ~3000+ exercises (not just 154)
- ✅ All levels populated: A1, A2, B1, B2, C1, C2
- ✅ Admin panel accessible with bcrypt-secured passwords
- ✅ PWA functionality working

## Troubleshooting

If auto-initialization fails:
1. Check Vercel function logs for errors
2. Manually trigger via: `POST https://your-app.vercel.app/api/auto-init`
3. Or use admin panel: `/api/admin/sync-database`

## Admin Access

- URL: `https://your-app.vercel.app/admin`
- Username: `admin@tudobem.blaster.app`
- Password: `321admin123`

The password is now securely hashed using bcrypt instead of stored in plain text.