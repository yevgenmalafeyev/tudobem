#!/usr/bin/env tsx

/**
 * Vercel Post-Build Hook
 * Runs after build to sync database from local dump to production
 * This ensures production always has the latest local database state
 */

import { syncToVercel } from './sync-to-vercel';
import * as fs from 'fs';
import path from 'path';

/**
 * Check if we're in production deployment
 */
function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === 'production' || 
         process.env.NODE_ENV === 'production';
}

/**
 * Sync production database using the latest local dump
 */
async function syncProductionDatabase(): Promise<void> {
  console.log('🔄 Starting production database sync...\n');
  
  try {
    // Check if database dump exists
    const dumpFile = path.join(process.cwd(), 'database-dumps', 'database-dump.json');
    
    if (!fs.existsSync(dumpFile)) {
      console.log('⚠️ No database dump found. Skipping sync...');
      console.log('💡 Run "npm run db:dump-fresh" locally to generate a fresh dump before deployment.');
      return;
    }
    
    console.log('📦 Database dump found. Starting sync to Vercel database...');
    
    // Use our new sync function
    await syncToVercel();
    
    console.log('✅ Production database sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Production database sync failed:', error);
    
    // Don't fail the entire build - just log and continue
    console.warn('⚠️ Continuing with existing production database state');
    console.warn('💡 To fix: ensure POSTGRES_URL is set and database-dump.json exists');
  }
}

/**
 * Main post-build process
 */
async function postBuild(): Promise<void> {
  console.log('📦 Vercel post-build hook started...\n');
  
  console.log('Environment variables:');
  console.log(`  VERCEL_ENV: ${process.env.VERCEL_ENV || 'not set'}`);
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`  POSTGRES_URL: ${process.env.POSTGRES_URL ? 'set' : 'not set'}`);
  console.log('');
  
  // Only sync database in production deployments
  if (isProductionDeployment()) {
    console.log('🎯 Production deployment detected - syncing database...');
    await syncProductionDatabase();
  } else {
    console.log('🔧 Non-production deployment - skipping database sync');
  }
  
  console.log('\n✅ Post-build hook completed');
}

// Run the post-build process
if (require.main === module) {
  postBuild()
    .then(() => {
      console.log('Post-build script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Post-build script failed:', error);
      // Don't fail the build for database sync issues
      console.warn('Continuing build despite database sync failure');
      process.exit(0);
    });
}

export { postBuild, syncProductionDatabase };