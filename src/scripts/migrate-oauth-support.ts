#!/usr/bin/env node

/**
 * Migration script to add OAuth support columns to users table
 * 
 * Run with: npx tsx src/scripts/migrate-oauth-support.ts
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function addOAuthSupport() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Starting migration: Adding OAuth support...');
    
    // Add the oauth_provider column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50)
    `);
    
    console.log('✅ Added oauth_provider column');
    
    // Update username column to allow longer names (full names)
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN username TYPE VARCHAR(100)
    `);
    
    console.log('✅ Updated username column to support full names');
    
    // Verify the migration
    const verifyResult = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(oauth_provider) as with_oauth_provider
      FROM users
    `);
    
    const stats = verifyResult.rows[0];
    console.log('\n📊 Migration verification:');
    console.log(`  Total users: ${stats.total_users}`);
    console.log(`  With OAuth provider: ${stats.with_oauth_provider}`);
    
    console.log('✅ OAuth support migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration if called directly
if (require.main === module) {
  addOAuthSupport()
    .then(() => {
      console.log('🎉 OAuth migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 OAuth migration script failed:', error);
      process.exit(1);
    });
}

export { addOAuthSupport };