#!/usr/bin/env node

/**
 * Migration script to add exercise_level and exercise_topic columns to user_exercise_attempts table
 * 
 * Run with: npx tsx src/scripts/migrate-add-level-topic.ts
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function addLevelTopicColumns() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Starting migration: Adding exercise_level and exercise_topic columns...');
    
    // Add the new columns
    await pool.query(`
      ALTER TABLE user_exercise_attempts 
      ADD COLUMN IF NOT EXISTS exercise_level VARCHAR(10),
      ADD COLUMN IF NOT EXISTS exercise_topic VARCHAR(100)
    `);
    
    console.log('✅ Added columns exercise_level and exercise_topic');
    
    // Create indexes for the new columns for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_attempts_level 
      ON user_exercise_attempts(user_id, exercise_level)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_attempts_topic 
      ON user_exercise_attempts(user_id, exercise_topic)
    `);
    
    console.log('✅ Created performance indexes');
    
    // Try to populate existing records with data from exercises table
    console.log('🔄 Attempting to populate existing records with level/topic data...');
    
    const updateResult = await pool.query(`
      UPDATE user_exercise_attempts 
      SET 
        exercise_level = e.level,
        exercise_topic = e.topic
      FROM exercises e
      WHERE user_exercise_attempts.exercise_id = e.id
        AND (user_exercise_attempts.exercise_level IS NULL 
             OR user_exercise_attempts.exercise_topic IS NULL)
    `);
    
    console.log(`✅ Updated ${updateResult.rowCount} existing records with level/topic data`);
    
    // Set NOT NULL constraints after populating data
    await pool.query(`
      ALTER TABLE user_exercise_attempts 
      ALTER COLUMN exercise_level SET NOT NULL
    `);
    
    await pool.query(`
      ALTER TABLE user_exercise_attempts 
      ALTER COLUMN exercise_topic SET NOT NULL
    `);
    
    console.log('✅ Set NOT NULL constraints on new columns');
    
    // Verify the migration
    const verifyResult = await pool.query(`
      SELECT 
        COUNT(*) as total_attempts,
        COUNT(exercise_level) as with_level,
        COUNT(exercise_topic) as with_topic
      FROM user_exercise_attempts
    `);
    
    const stats = verifyResult.rows[0];
    console.log('\n📊 Migration verification:');
    console.log(`  Total attempts: ${stats.total_attempts}`);
    console.log(`  With level data: ${stats.with_level}`);
    console.log(`  With topic data: ${stats.with_topic}`);
    
    if (stats.total_attempts === stats.with_level && stats.total_attempts === stats.with_topic) {
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('⚠️ Some records missing level/topic data - may need manual cleanup');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration if called directly
if (require.main === module) {
  addLevelTopicColumns()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { addLevelTopicColumns };