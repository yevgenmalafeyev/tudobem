# Database Synchronization Guide

This guide explains how to synchronize your local database with the Vercel production database.

## Overview

The database sync system allows you to:
1. Export your local `tudobem_dev` database to a JSON dump
2. Automatically sync this dump to Vercel production database on deployment
3. Manually sync when needed

## Available Commands

### Local Database Operations

```bash
# Generate a fresh dump from your local database
npm run db:dump-fresh

# Import B1 exercises from JSON (example)
npm run db:import-b1

# Import B2 exercises from JSON (example)  
npm run db:import-b2
```

### Vercel Sync Operations

```bash
# Sync local dump to Vercel (requires POSTGRES_URL environment variable)
npm run db:sync-vercel

# Complete sync: generate fresh dump + sync to Vercel
npm run db:sync-full

# Run the postbuild script (automatically runs after Vercel deployment)
npm run db:sync-prod
```

## Automatic Sync on Deployment

The system is configured to automatically sync your database when you deploy to Vercel:

1. **Generate Fresh Dump Locally**:
   ```bash
   npm run db:dump-fresh
   git add database-dumps/database-dump.json
   git commit -m "Update database dump"
   git push
   ```

2. **Automatic Vercel Sync**: 
   - Vercel builds your application
   - After successful build, runs `postbuild` script
   - `postbuild` automatically syncs the dump to production database
   - Your production database now has the latest local data

## Manual Sync Process

If you want to manually sync without deploying:

1. **Local to Dump**:
   ```bash
   npm run db:dump-fresh
   ```

2. **Dump to Vercel** (requires production environment):
   ```bash
   npm run db:sync-vercel
   ```

3. **Full Process**:
   ```bash
   npm run db:sync-full
   ```

## File Structure

- `src/scripts/generate-fresh-dump.ts` - Exports local database to JSON
- `src/scripts/sync-to-vercel.ts` - Imports JSON dump to Vercel database
- `src/scripts/full-database-sync.ts` - Complete sync process
- `src/scripts/vercel-postbuild.ts` - Automatic post-deployment sync
- `database-dumps/database-dump.json` - Generated database dump

## Environment Variables

Make sure these are set in Vercel:

- `POSTGRES_URL` - Connection string to your production PostgreSQL database
- `VERCEL_ENV` - Automatically set by Vercel (production/preview/development)

## Workflow Example

### Adding New Exercises Locally

1. Import exercises to your local `tudobem_dev` database:
   ```bash
   npm run db:import-b1  # or any import script
   ```

2. Test locally:
   ```bash
   npm run dev
   ```

3. Generate fresh dump:
   ```bash
   npm run db:dump-fresh
   ```

4. Commit and deploy:
   ```bash
   git add .
   git commit -m "Add new B1 exercises"
   git push
   ```

5. **Automatic sync happens**: Vercel deploys and automatically syncs your database!

### Manual Sync (Alternative)

If you want to sync without deploying:

```bash
# Generate fresh local dump
npm run db:dump-fresh

# Sync to Vercel (requires POSTGRES_URL to be set locally)
POSTGRES_URL="your-vercel-postgres-url" npm run db:sync-vercel
```

## Database Dump Format

The dump includes:
- Complete exercise data with metadata
- Statistics by level and topic
- Timestamp and source information
- Ready for production import

## Troubleshooting

### Sync Fails
- Check `POSTGRES_URL` environment variable
- Verify database dump exists: `database-dumps/database-dump.json`
- Check Vercel build logs for detailed error messages

### Missing Exercises
- Run `npm run db:dump-fresh` to generate latest dump
- Commit the updated dump file before deploying

### Local Import Issues
- Verify local database is running: `postgresql://localhost:5432/tudobem_dev`
- Check that JSON files exist in `excercises/` directory

## Security

- Database dumps contain no sensitive user data (only exercise content)
- Production database credentials are stored securely in Vercel environment
- Sync operations include transaction rollback on failure