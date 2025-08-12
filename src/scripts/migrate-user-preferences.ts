#!/usr/bin/env node

/**
 * Migration script to add user preference columns to users table
 * 
 * Run with: npx tsx src/scripts/migrate-user-preferences.ts
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function addUserPreferenceColumns() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Starting migration: Adding user preference columns...');
    
    // Add the new columns
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS app_language VARCHAR(10) DEFAULT 'pt',
      ADD COLUMN IF NOT EXISTS explanation_language VARCHAR(10) DEFAULT 'pt',
      ADD COLUMN IF NOT EXISTS learning_mode VARCHAR(20) DEFAULT 'typing',
      ADD COLUMN IF NOT EXISTS levels_enabled TEXT[] DEFAULT ARRAY['A1','A2','B1','B2','C1','C2'],
      ADD COLUMN IF NOT EXISTS topics_enabled TEXT[] DEFAULT ARRAY[]::TEXT[],
      ADD COLUMN IF NOT EXISTS email_marketing_consent BOOLEAN DEFAULT FALSE
    `);
    
    console.log('✅ Added user preference columns');
    
    // Verify the migration
    const verifyResult = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(app_language) as with_app_language,
        COUNT(email_marketing_consent) as with_marketing_consent
      FROM users
    `);
    
    const stats = verifyResult.rows[0];
    console.log('\n📊 Migration verification:');
    console.log(`  Total users: ${stats.total_users}`);
    console.log(`  With app language: ${stats.with_app_language}`);
    console.log(`  With marketing consent: ${stats.with_marketing_consent}`);
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration if called directly
if (require.main === module) {
  addUserPreferenceColumns()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { addUserPreferenceColumns };