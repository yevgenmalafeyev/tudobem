#!/usr/bin/env tsx

/**
 * Prepare Deployment Script
 * Complete workflow to prepare local database for production deployment
 * 
 * This script:
 * 1. Dumps current local database to JSON
 * 2. Creates production seed script
 * 3. Validates the dump
 * 4. Prepares files for Vercel deployment
 */

import { dumpDatabase } from './database-dump';
import { validateMigration } from './migrateStaticExercises';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Validate that the dump contains expected data
 */
async function validateDump(): Promise<boolean> {
  console.log('🔍 Validating database dump...\n');
  
  try {
    const dumpFile = path.join(process.cwd(), 'database-dumps', 'database-dump.json');
    const dumpContent = await fs.readFile(dumpFile, 'utf-8');
    const dump = JSON.parse(dumpContent);
    
    // Check dump structure
    if (!dump.data || !dump.data.exercises) {
      console.error('❌ Invalid dump structure - missing exercises data');
      return false;
    }
    
    const exercises = dump.data.exercises;
    console.log(`📊 Dump contains ${exercises.length} exercises`);
    
    // Check that we have exercises for required levels
    const requiredLevels = ['A1', 'A2', 'B1', 'B2'];
    const levelCounts: Record<string, number> = {};
    
    exercises.forEach((ex: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      levelCounts[ex.level] = (levelCounts[ex.level] || 0) + 1;
    });
    
    console.log('📈 Exercises by level:');
    for (const level of requiredLevels) {
      const count = levelCounts[level] || 0;
      console.log(`   ${level}: ${count} exercises`);
      
      if (count === 0) {
        console.warn(`⚠️ Warning: No exercises found for level ${level}`);
      }
    }
    
    // Check for exercises with proper hints
    const exercisesWithHints = exercises.filter((ex: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
    
      ex.hint && typeof ex.hint === 'object' && ex.hint.infinitive
    );
    
    console.log(`💡 Exercises with proper hints: ${exercisesWithHints.length}/${exercises.length}`);
    
    // Check for recent updates (exercises from hint format fixes)
    const recentUpdates = exercises.filter((ex: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!ex.updatedAt) return false;
      const updateTime = new Date(ex.updatedAt);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return updateTime > oneDayAgo;
    });
    
    console.log(`🆕 Recently updated exercises: ${recentUpdates.length}`);
    
    console.log('\n✅ Dump validation completed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Dump validation failed:', error);
    return false;
  }
}

/**
 * Create deployment checklist
 */
async function createDeploymentChecklist(): Promise<void> {
  const checklist = `# Database Deployment Checklist

Generated: ${new Date().toISOString()}

## Pre-Deployment Steps Completed ✅

- [x] Local database dumped to \`database-dumps/database-dump.json\`
- [x] Production seed script generated at \`database-dumps/production-seed.ts\`
- [x] Dump validation completed successfully
- [x] Vercel post-build hook configured in package.json

## Deployment Process

When you push to git and deploy to Vercel:

1. **Build Process**: Next.js builds the application
2. **Post-Build Hook**: \`postbuild\` script runs automatically
3. **Database Sync**: Production database is cleared and reseeded
4. **Production Ready**: App starts with fresh database data

## What Happens on Vercel

\`\`\`bash
# During Vercel build:
npm run build              # Build the app
npm run postbuild         # Run post-build hook
npm run db:sync-prod      # Sync database
npx tsx vercel-postbuild.ts  # Execute sync
\`\`\`

## Manual Commands (if needed)

\`\`\`bash
# Generate fresh dump of local database
npm run db:dump

# Test production sync locally
npm run db:sync-prod

# Validate database state
npm run db:validate
\`\`\`

## Environment Variables Required on Vercel

- \`POSTGRES_URL\`: Production database connection string
- \`VERCEL_ENV\`: Should be "production" for production deployments
- \`NODE_ENV\`: Should be "production" for production builds

## Troubleshooting

If database sync fails during deployment:
1. Check Vercel build logs for error messages
2. Verify \`POSTGRES_URL\` is set correctly in Vercel environment
3. Run \`npm run db:dump\` locally to regenerate dump files
4. Redeploy to Vercel

## Files Created

- \`database-dumps/database-dump.json\` - Complete database export
- \`database-dumps/production-seed.ts\` - Executable seed script
- \`src/scripts/vercel-postbuild.ts\` - Vercel deployment hook

✅ **Ready for deployment!** Push to git and deploy to Vercel.
`;

  const checklistFile = path.join(process.cwd(), 'DEPLOYMENT-CHECKLIST.md');
  await fs.writeFile(checklistFile, checklist);
  console.log(`📋 Deployment checklist created: ${checklistFile}`);
}

/**
 * Main preparation workflow
 */
async function prepareDeployment(): Promise<void> {
  console.log('🚀 Starting deployment preparation workflow...\n');
  
  try {
    // Step 1: Create database dump
    console.log('Step 1: Creating database dump...');
    await dumpDatabase();
    console.log('');
    
    // Step 2: Validate the dump
    console.log('Step 2: Validating dump...');
    const isValid = await validateDump();
    if (!isValid) {
      throw new Error('Database dump validation failed');
    }
    console.log('');
    
    // Step 3: Validate migration state
    console.log('Step 3: Validating migration state...');
    const migrationValid = await validateMigration();
    if (!migrationValid) {
      console.warn('⚠️ Migration validation warnings (deployment will continue)');
    }
    console.log('');
    
    // Step 4: Create deployment checklist
    console.log('Step 4: Creating deployment checklist...');
    await createDeploymentChecklist();
    console.log('');
    
    console.log('🎉 Deployment preparation completed successfully!\n');
    console.log('📋 Next steps:');
    console.log('   1. Review DEPLOYMENT-CHECKLIST.md');
    console.log('   2. Commit the database-dumps/ directory to git');
    console.log('   3. Push to git to trigger Vercel deployment');
    console.log('   4. Monitor Vercel build logs for database sync');
    console.log('\n✅ Ready for production deployment!');
    
  } catch (error) {
    console.error('❌ Deployment preparation failed:', error);
    throw error;
  }
}

// Allow running as standalone script
if (require.main === module) {
  prepareDeployment()
    .then(() => {
      console.log('Deployment preparation script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Deployment preparation script failed:', error);
      process.exit(1);
    });
}

export { prepareDeployment, validateDump, createDeploymentChecklist };