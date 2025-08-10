#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';

interface Exercise {
  id: string | null;
  sentence: string;
  correctAnswer: string;
  topic: string;
  level: string;
  hint?: string;
  multipleChoiceOptions?: string[];
  explanations?: {
    pt?: string;
    en?: string;
    uk?: string;
  };
  difficultyScore?: number;
  usageCount?: number;
}

/**
 * Sync local database dump to Vercel production database
 * This script:
 * 1. Clears all exercises from Vercel database
 * 2. Imports fresh data from local database dump
 * 3. Validates the import
 */
async function syncToVercel() {
  console.log('🚀 [SYNC] Starting database sync to Vercel...');
  
  // Check if we're in a production environment
  const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.POSTGRES_URL;
  
  if (!databaseUrl) {
    throw new Error('❌ POSTGRES_URL environment variable not found. Make sure you\'re running this in Vercel environment.');
  }
  
  console.log(`🔧 [SYNC] Environment: ${isProduction ? 'Production (Vercel)' : 'Development'}`);
  console.log(`🔗 [SYNC] Database URL: ${databaseUrl.substring(0, 30)}...`);
  
  // Read local database dump
  const dumpPath = path.join(process.cwd(), 'database-dumps', 'database-dump.json');
  console.log(`📁 [SYNC] Reading dump from: ${dumpPath}`);
  
  if (!fs.existsSync(dumpPath)) {
    throw new Error(`❌ Database dump not found at: ${dumpPath}`);
  }
  
  const dumpContent = fs.readFileSync(dumpPath, 'utf-8');
  const dumpData = JSON.parse(dumpContent);
  const exercises: Exercise[] = dumpData.exercises || [];
  
  console.log(`📊 [SYNC] Found ${exercises.length} exercises in dump`);
  
  // Connect to Vercel database
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false
  });
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🧹 [SYNC] Step 1: Clearing existing exercises...');
    
    // Clear existing exercises
    const deleteResult = await client.query('DELETE FROM exercises');
    console.log(`🧹 [SYNC] Deleted ${deleteResult.rowCount} existing exercises`);
    
    console.log('📥 [SYNC] Step 2: Importing new exercises...');
    
    let importedCount = 0;
    let skippedCount = 0;
    
    for (const exercise of exercises) {
      try {
        // Validate required fields
        if (!exercise.sentence || !exercise.correctAnswer || !exercise.topic || !exercise.level) {
          console.warn(`⚠️ [SYNC] Skipping invalid exercise:`, exercise);
          skippedCount++;
          continue;
        }
        
        // Insert exercise
        await client.query(`
          INSERT INTO exercises (
            sentence, correct_answer, topic, level, hint,
            multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
            difficulty_score, usage_count
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          exercise.sentence,
          exercise.correctAnswer,
          exercise.topic,
          exercise.level,
          exercise.hint || '',
          JSON.stringify(exercise.multipleChoiceOptions || []),
          exercise.explanations?.pt || '',
          exercise.explanations?.en || '',
          exercise.explanations?.uk || '',
          exercise.difficultyScore || 0.6,
          exercise.usageCount || 0
        ]);
        
        importedCount++;
        
        if (importedCount % 50 === 0) {
          console.log(`📥 [SYNC] Imported ${importedCount}/${exercises.length} exercises...`);
        }
        
      } catch (error) {
        console.error(`❌ [SYNC] Error importing exercise: "${exercise.sentence?.substring(0, 50)}..."`, error);
        throw error;
      }
    }
    
    await client.query('COMMIT');
    
    console.log('\n✅ [SYNC] Step 3: Validating import...');
    
    // Validate import
    const countResult = await client.query('SELECT COUNT(*) as count FROM exercises');
    const totalCount = parseInt(countResult.rows[0].count);
    
    const levelCounts = await client.query(`
      SELECT level, COUNT(*) as count 
      FROM exercises 
      GROUP BY level 
      ORDER BY level
    `);
    
    console.log(`✅ [SYNC] Import completed successfully!`);
    console.log(`📊 [SYNC] Total exercises: ${totalCount}`);
    console.log(`📊 [SYNC] Imported: ${importedCount}`);
    console.log(`📊 [SYNC] Skipped: ${skippedCount}`);
    console.log(`📊 [SYNC] Exercises by level:`);
    
    levelCounts.rows.forEach(row => {
      console.log(`   - ${row.level}: ${row.count} exercises`);
    });
    
    // Additional validation
    const topicCounts = await client.query(`
      SELECT topic, COUNT(*) as count 
      FROM exercises 
      GROUP BY topic 
      ORDER BY count DESC 
      LIMIT 10
    `);
    
    console.log(`📊 [SYNC] Top 10 topics:`);
    topicCounts.rows.forEach(row => {
      console.log(`   - ${row.topic}: ${row.count} exercises`);
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ [SYNC] Sync failed, transaction rolled back:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the sync if this script is executed directly
if (require.main === module) {
  syncToVercel()
    .then(() => {
      console.log('🎉 [SYNC] Database sync completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 [SYNC] Database sync failed:', error);
      process.exit(1);
    });
}

export { syncToVercel };