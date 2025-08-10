#!/usr/bin/env tsx

/**
 * Vercel Post-Build Hook
 * Runs after build to sync database from local dump to production
 * This ensures production always has the latest local database state
 */

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Check if we're in production deployment
 */
function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === 'production' || 
         process.env.NODE_ENV === 'production';
}

/**
 * Load and execute the production seed script
 */
async function syncProductionDatabase(): Promise<void> {
  console.log('🔄 Starting production database sync...\n');
  
  try {
    // Check if production seed file exists
    const seedFile = path.join(process.cwd(), 'database-dumps', 'production-seed.ts');
    
    try {
      await fs.access(seedFile);
    } catch (_error) {
      console.log('⚠️ No production seed file found. Creating empty database...');
      
      // Import and run basic database initialization
      const { LocalDatabase } = await import('../lib/localDatabase');
      await LocalDatabase.initializeTables();
      
      console.log('✅ Empty production database initialized');
      return;
    }
    
    // Dynamic import of the seed script
    console.log('📄 Loading production seed script...');
    const { seedProductionDatabase } = await import(seedFile);
    
    // Run the seeding process
    console.log('🌱 Executing database sync...');
    await seedProductionDatabase();
    
    console.log('✅ Production database sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Production database sync failed:', error);
    
    // Don't fail the entire build - just log and continue
    console.warn('⚠️ Continuing with existing production database state');
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