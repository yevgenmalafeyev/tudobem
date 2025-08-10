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

async function importB1Exercises() {
  const jsonPath = path.join(process.cwd(), 'excercises', 'chatgpt_portuguese_b1_exercises.json');
  
  console.log('📚 [DEBUG] Reading B1 exercises from:', jsonPath);
  
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`File not found: ${jsonPath}`);
  }
  
  const fileContent = fs.readFileSync(jsonPath, 'utf-8');
  const exercises: Exercise[] = JSON.parse(fileContent);
  
  console.log(`📚 [DEBUG] Found ${exercises.length} B1 exercises`);
  
  // Validate exercises
  const validExercises = exercises.filter(exercise => {
    if (!exercise.sentence || !exercise.correctAnswer || !exercise.topic || !exercise.level) {
      console.warn('⚠️ [DEBUG] Skipping invalid exercise:', exercise);
      return false;
    }
    return true;
  });
  
  console.log(`📚 [DEBUG] ${validExercises.length} valid exercises to import`);
  
  if (validExercises.length === 0) {
    throw new Error('No valid exercises found');
  }
  
  // Connect to local PostgreSQL database
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || 'postgresql://yevgenmalafeyev:@localhost:5432/tudobem_dev',
    ssl: false // Local development doesn't need SSL
  });
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    let importedCount = 0;
    let skippedCount = 0;
    
    for (const exercise of validExercises) {
      try {
        // Check if exercise with same sentence and topic already exists
        const existingResult = await client.query(
          'SELECT id FROM exercises WHERE sentence = $1 AND topic = $2',
          [exercise.sentence, exercise.topic]
        );
        
        if (existingResult.rows.length > 0) {
          console.log(`📚 [DEBUG] Skipping duplicate: "${exercise.sentence.substring(0, 50)}..."`);
          skippedCount++;
          continue;
        }
        
        // Insert new exercise
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
        
        if (importedCount % 10 === 0) {
          console.log(`📚 [DEBUG] Imported ${importedCount} exercises...`);
        }
        
      } catch (error) {
        console.error(`❌ [DEBUG] Error importing exercise: "${exercise.sentence}"`, error);
        throw error;
      }
    }
    
    await client.query('COMMIT');
    
    console.log('\n📚 [DEBUG] ✅ B1 exercises import completed!');
    console.log(`📚 [DEBUG] Imported: ${importedCount} exercises`);
    console.log(`📚 [DEBUG] Skipped (duplicates): ${skippedCount} exercises`);
    
    // Verify import
    const countResult = await client.query('SELECT COUNT(*) FROM exercises WHERE level = $1', ['B1']);
    console.log(`📚 [DEBUG] Total B1 exercises in database: ${countResult.rows[0].count}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ [DEBUG] Import failed, transaction rolled back:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the import
if (require.main === module) {
  importB1Exercises()
    .then(() => {
      console.log('✅ Import completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Import failed:', error);
      process.exit(1);
    });
}