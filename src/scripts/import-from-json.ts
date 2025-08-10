#!/usr/bin/env npx tsx

import fs from 'fs';
import { Pool } from 'pg';

// Create database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://yevgenmalafeyev:@localhost:5432/tudobem_dev'
});

async function initializeTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sentence TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        topic VARCHAR(100) NOT NULL,
        level VARCHAR(10) NOT NULL,
        hint TEXT,
        multiple_choice_options JSONB NOT NULL,
        explanation_pt TEXT NOT NULL,
        explanation_en TEXT NOT NULL,
        explanation_uk TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create unique constraint if it doesn't exist
    try {
      await client.query(`
        ALTER TABLE exercises 
        ADD CONSTRAINT exercises_sentence_unique UNIQUE (sentence)
      `);
    } catch (error: unknown) {
      // Ignore if constraint already exists
      if (error && typeof error === 'object' && 'code' in error && error.code !== '42P07') {
        throw error;
      }
    }
    
    console.log('✅ Database tables initialized');
  } finally {
    client.release();
  }
}


interface ExerciseInput {
  sentence: string;
  correctAnswer: string;
  topic: string;
  level: string;
  hint?: string;
  multipleChoiceOptions: string[];
  explanations: {
    pt: string;
    en: string;
    uk: string;
  };
}

async function insertExercise(exercise: ExerciseInput): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO exercises (
        sentence, correct_answer, topic, level, hint, 
        multiple_choice_options, explanation_pt, explanation_en, explanation_uk
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      exercise.sentence,
      exercise.correctAnswer,
      exercise.topic,
      exercise.level,
      exercise.hint || '',
      JSON.stringify(exercise.multipleChoiceOptions),
      exercise.explanations.pt,
      exercise.explanations.en,
      exercise.explanations.uk
    ]);
    return true;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') { // Unique constraint violation
      return false; // Already exists
    }
    throw error;
  } finally {
    client.release();
  }
}

async function getStats() {
  const client = await pool.connect();
  try {
    const totalResult = await client.query('SELECT COUNT(*) as count FROM exercises');
    const levelResult = await client.query('SELECT level, COUNT(*) as count FROM exercises GROUP BY level ORDER BY level');
    
    return {
      total: parseInt(totalResult.rows[0].count),
      byLevel: levelResult.rows.map(row => ({ level: row.level, count: parseInt(row.count) }))
    };
  } finally {
    client.release();
  }
}

async function importFromJSON(filePath: string) {
  console.log(`🚀 Starting JSON import from: ${filePath}`);
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Read and parse JSON file
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    let exercises;
    
    try {
      exercises = JSON.parse(jsonData);
    } catch (parseError) {
      throw new Error(`Invalid JSON format: ${parseError}`);
    }
    
    // Validate that it's an array
    if (!Array.isArray(exercises)) {
      throw new Error('JSON must contain an array of exercises');
    }
    
    console.log(`📊 Found ${exercises.length} exercises to import`);
    
    if (exercises.length === 0) {
      console.log('⚠️ No exercises to import');
      return;
    }
    
    // Display sample exercise info
    const sample = exercises[0];
    console.log(`📝 Sample exercise: "${sample.sentence}" (${sample.topic}, ${sample.level})`);
    
    // Initialize database tables if needed
    await initializeTables();
    
    // Import exercises
    let totalImported = 0;
    let duplicateCount = 0;
    let errorCount = 0;
    
    console.log(`💾 Starting import...`);
    
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      try {
        const imported = await insertExercise(exercise);
        if (imported) {
          totalImported++;
          if (i % 10 === 0) {
            console.log(`📤 Imported ${i + 1}/${exercises.length}: "${exercise.sentence.substring(0, 50)}..."`);
          }
        } else {
          duplicateCount++;
        }
      } catch (error) {
        console.error(`❌ Error importing exercise: "${exercise.sentence}"`, error);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Import completed successfully!`);
    console.log(`📊 Total imported: ${totalImported}/${exercises.length} exercises`);
    console.log(`📊 Skipped duplicates: ${duplicateCount}`);
    console.log(`📊 Errors: ${errorCount}`);
    
    // Get statistics by level and topic
    console.log('\n📈 Import summary:');
    const stats = await getStats();
    console.log(`   Total exercises in database: ${stats.total}`);
    console.log('   By level:', stats.byLevel.map(l => `${l.level}: ${l.count}`).join(', '));
    console.log(`   Topics imported: ${[...new Set(exercises.map(e => e.topic))].join(', ')}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Main execution
async function main() {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error(`
Usage: npx tsx src/scripts/import-from-json.ts <json-file>

Examples:
  npx tsx src/scripts/import-from-json.ts ./b1-exercises.json
  npx tsx src/scripts/import-from-json.ts ./generated-exercises/b2-exercises.json
  
The JSON file should contain an array of exercise objects with the structure:
{
  "id": null,
  "sentence": "...",
  "correctAnswer": "...",
  "topic": "...",
  "level": "B1|B2|C1",
  "hint": "...",
  "multipleChoiceOptions": [...],
  "explanations": { "pt": "...", "en": "...", "uk": "..." },
  "difficultyScore": 0.6,
  "usageCount": 0
}

Note: If the JSON contains "gapIndex" field, it will be ignored during import.
`);
    process.exit(1);
  }
  
  await importFromJSON(filePath);
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

main();