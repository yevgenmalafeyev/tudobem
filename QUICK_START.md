# Quick Start Guide - Enhanced Question Generation

## 🚀 Immediate Setup (No Database Required)

The enhanced system works in **two modes**:

1. **🔧 Development Mode** (No database) - Uses static exercises with enhanced features
2. **🏗️ Production Mode** (With database) - Full enhanced experience with persistent storage

## Option 1: Development Mode (Quick Start)

**Works immediately without any setup:**

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

✅ **What you get:**
- Enhanced UI with status indicators
- Improved question flow
- Multilingual explanations (basic)
- Background loading simulation
- All features except database persistence

## Option 2: Production Mode (Full Features)

**Requires database setup for full enhanced experience:**

### Step 1: Database Setup

**Option A: Vercel Postgres (Recommended for deployment)**
1. Create a Vercel Postgres database
2. Copy the connection string
3. Add to `.env.local`:
```bash
POSTGRES_URL="your-vercel-postgres-connection-string"
```

**Option B: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create database: `createdb tudobem_dev`
3. Add to `.env.local`:
```bash
POSTGRES_URL="postgresql://localhost:5432/tudobem_dev"
```

### Step 2: Initialize Enhanced System

```bash
# Run complete setup
npm run enhanced:setup
```

### Step 3: Add AI (Optional)

```bash
# Add to .env.local
ANTHROPIC_API_KEY="your-claude-api-key"
```

## ✅ Verification

### Check Current Mode

```bash
npm run db:init
```

**Expected outputs:**

**Development Mode:**
```
⚠️ Database not available - enhanced features will use static fallback
✅ Enhanced exercise system is ready!
```

**Production Mode:**
```
Database tables initialized successfully
✅ Enhanced exercise system is ready!
```

### Test the Application

1. Start the app: `npm run dev`
2. Look for the status indicator (top-right corner)
3. Start a learning session
4. Verify enhanced features are working

## 🎯 Features by Mode

| Feature | Development Mode | Production Mode |
|---------|------------------|-----------------|
| Enhanced UI | ✅ | ✅ |
| Status Indicators | ✅ | ✅ |
| Background Loading | ✅ (simulated) | ✅ (real) |
| Multilingual Explanations | ✅ (basic) | ✅ (full) |
| Question Persistence | ❌ | ✅ |
| AI Question Generation | ✅ (if API key) | ✅ (if API key) |
| Growing Question Database | ❌ | ✅ |
| Usage Analytics | ❌ | ✅ |

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `POSTGRES_URL` (from Vercel Postgres)
   - `ANTHROPIC_API_KEY` (optional)
4. Deploy
5. Run setup: `npm run enhanced:setup` (in Vercel terminal if needed)

### Other Platforms

The enhanced system works on any platform that supports:
- Node.js
- PostgreSQL (for full features)
- Environment variables

## 🔧 Troubleshooting

### "Database not available" message
- This is normal for development mode
- Add `POSTGRES_URL` to enable full features

### "tsx command not found"
```bash
npm install tsx
```

### Migration issues
```bash
# Reset and retry
npm run db:rollback
npm run enhanced:setup
```

### Test enhanced features
```bash
npm run test:enhanced
```

## 📞 Support

The enhanced system is backward compatible - existing functionality continues to work while new features enhance the experience.

For issues:
1. Check this guide
2. Verify environment variables
3. Run `npm run db:validate`
4. Check browser console for detailed logs