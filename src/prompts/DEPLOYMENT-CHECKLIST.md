# Database Deployment Checklist

Generated: 2025-08-10T09:13:08.077Z

## Pre-Deployment Steps Completed ✅

- [x] Local database dumped to `database-dumps/database-dump.json`
- [x] Production seed script generated at `database-dumps/production-seed.ts`
- [x] Dump validation completed successfully
- [x] Vercel post-build hook configured in package.json

## Deployment Process

When you push to git and deploy to Vercel:

1. **Build Process**: Next.js builds the application
2. **Post-Build Hook**: `postbuild` script runs automatically
3. **Database Sync**: Production database is cleared and reseeded
4. **Production Ready**: App starts with fresh database data

## What Happens on Vercel

```bash
# During Vercel build:
npm run build              # Build the app
npm run postbuild         # Run post-build hook
npm run db:sync-prod      # Sync database
npx tsx vercel-postbuild.ts  # Execute sync
```

## Manual Commands (if needed)

```bash
# Generate fresh dump of local database
npm run db:dump

# Test production sync locally
npm run db:sync-prod

# Validate database state
npm run db:validate
```

## Environment Variables Required on Vercel

- `POSTGRES_URL`: Production database connection string
- `VERCEL_ENV`: Should be "production" for production deployments
- `NODE_ENV`: Should be "production" for production builds

## Troubleshooting

If database sync fails during deployment:
1. Check Vercel build logs for error messages
2. Verify `POSTGRES_URL` is set correctly in Vercel environment
3. Run `npm run db:dump` locally to regenerate dump files
4. Redeploy to Vercel

## Files Created

- `database-dumps/database-dump.json` - Complete database export
- `database-dumps/production-seed.ts` - Executable seed script
- `src/scripts/vercel-postbuild.ts` - Vercel deployment hook

✅ **Ready for deployment!** Push to git and deploy to Vercel.
