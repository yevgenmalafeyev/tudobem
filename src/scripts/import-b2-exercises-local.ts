#!/usr/bin/env npx tsx

import * as fs from 'fs';
import { Pool } from 'pg';
import { EnhancedExercise } from '@/types/enhanced';

// Create database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://yevgenmalafeyev:@localhost:5432/tudobem_dev'
});

/**
 * Initialize database tables
 */
async function initializeTables(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sentence TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        topic TEXT NOT NULL,
        level TEXT NOT NULL,
        hint TEXT,
        multiple_choice_options JSONB,
        explanations JSONB,
        difficulty_score FLOAT DEFAULT 0.5,
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create index for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_exercises_level_topic 
      ON exercises(level, topic);
    `);
    
    console.log('✅ Database tables initialized successfully');
  } finally {
    client.release();
  }
}

/**
 * Check for duplicate exercises
 */
async function checkDuplicates(exercises: EnhancedExercise[]): Promise<string[]> {
  const client = await pool.connect();
  try {
    const sentences = exercises.map(ex => ex.sentence);
    const result = await client.query(
      'SELECT sentence FROM exercises WHERE sentence = ANY($1)',
      [sentences]
    );
    
    return result.rows.map(row => row.sentence);
  } finally {
    client.release();
  }
}

/**
 * Import exercises in batch
 */
async function importBatch(exercises: EnhancedExercise[]): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    for (const exercise of exercises) {
      await client.query(`
        INSERT INTO exercises (
          sentence, gap_index, correct_answer, topic, level, hint, 
          multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
          difficulty_score, usage_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        exercise.sentence,
        0, // gap_index - set to 0 since we removed it from the logic
        exercise.correctAnswer,
        exercise.topic,
        exercise.level,
        exercise.hint || null,
        JSON.stringify(exercise.multipleChoiceOptions || []),
        exercise.explanations?.pt || '',
        exercise.explanations?.en || '',
        exercise.explanations?.uk || '',
        exercise.difficultyScore || 0.5,
        exercise.usageCount || 0
      ]);
    }
    
    await client.query('COMMIT');
    console.log(`✅ Imported batch of ${exercises.length} exercises`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Main import function
 */
async function importFromJSON(filePath: string): Promise<void> {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    console.log(`🚀 Starting JSON import from: ${filePath}`);
    
    // Read and parse JSON
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const exercises: EnhancedExercise[] = JSON.parse(fileContent);
    
    if (!Array.isArray(exercises)) {
      throw new Error('JSON file must contain an array of exercises');
    }
    
    console.log(`📊 Found ${exercises.length} exercises to import`);
    
    if (exercises.length > 0) {
      console.log(`📝 Sample exercise: "${exercises[0].sentence}" (${exercises[0].topic}, ${exercises[0].level})`);
    }
    
    // Initialize database
    await initializeTables();
    
    // Check for duplicates
    console.log('🔍 Checking for duplicates...');
    const duplicates = await checkDuplicates(exercises);
    
    if (duplicates.length > 0) {
      console.log(`⚠️  Found ${duplicates.length} potential duplicates:`);
      duplicates.slice(0, 3).forEach(sentence => {
        console.log(`   - "${sentence.substring(0, 50)}..."`);
      });
      if (duplicates.length > 3) {
        console.log(`   ... and ${duplicates.length - 3} more`);
      }
      
      // Filter out duplicates
      const uniqueExercises = exercises.filter(ex => !duplicates.includes(ex.sentence));
      console.log(`📝 Proceeding with ${uniqueExercises.length} unique exercises`);
      
      if (uniqueExercises.length === 0) {
        console.log('ℹ️  All exercises already exist in database. Import skipped.');
        return;
      }
    }
    
    const exercisesToImport = duplicates.length > 0 
      ? exercises.filter(ex => !duplicates.includes(ex.sentence))
      : exercises;
    
    // Import in batches of 25
    const batchSize = 25;
    let imported = 0;
    
    for (let i = 0; i < exercisesToImport.length; i += batchSize) {
      const batch = exercisesToImport.slice(i, i + batchSize);
      await importBatch(batch);
      imported += batch.length;
      console.log(`📈 Progress: ${imported}/${exercisesToImport.length} exercises imported`);
    }
    
    console.log('');
    console.log('🎉 Import completed successfully!');
    console.log('📊 Final Statistics:');
    console.log(`   Total exercises in file: ${exercises.length}`);
    console.log(`   Duplicates skipped: ${duplicates.length}`);
    console.log(`   New exercises imported: ${exercisesToImport.length}`);
    
    // Show hint statistics
    const withHints = exercisesToImport.filter(ex => ex.hint && ex.hint.length > 0).length;
    const withoutHints = exercisesToImport.length - withHints;
    console.log(`   Exercises with hints: ${withHints}`);
    console.log(`   Exercises without hints: ${withoutHints}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('Usage: npx tsx import-b2-exercises-local.ts <path-to-json-file>');
    console.error('Example: npx tsx import-b2-exercises-local.ts excercises/chatgpt_portuguese_B2_exercises.json');
    process.exit(1);
  }
  
  try {
    await importFromJSON(filePath);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}