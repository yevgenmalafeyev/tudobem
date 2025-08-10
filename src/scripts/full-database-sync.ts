#!/usr/bin/env npx tsx

import { generateFreshDump } from './generate-fresh-dump';
import { syncToVercel } from './sync-to-vercel';

/**
 * Complete database sync process:
 * 1. Generate fresh dump from local database
 * 2. Sync the dump to Vercel production database
 */
async function fullDatabaseSync() {
  console.log('🌟 [FULL-SYNC] Starting complete database sync process...');
  console.log('');
  
  try {
    // Step 1: Generate fresh dump from local database
    console.log('📦 [FULL-SYNC] Phase 1: Generating fresh dump from local database');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await generateFreshDump();
    console.log('✅ [FULL-SYNC] Phase 1 completed');
    console.log('');
    
    // Step 2: Sync to Vercel
    console.log('🚀 [FULL-SYNC] Phase 2: Syncing to Vercel production database');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await syncToVercel();
    console.log('✅ [FULL-SYNC] Phase 2 completed');
    console.log('');
    
    console.log('🎉 [FULL-SYNC] Complete database sync finished successfully!');
    console.log('📊 [FULL-SYNC] Your Vercel database now has the latest data from your local database.');
    
  } catch (error) {
    console.error('💥 [FULL-SYNC] Full database sync failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  fullDatabaseSync()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Full sync process failed:', error);
      process.exit(1);
    });
}