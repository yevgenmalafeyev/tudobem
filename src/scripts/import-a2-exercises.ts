#!/usr/bin/env npx tsx

import { sql } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Import Portuguese A2 exercises from JSON file to database
 */

interface JsonExercise {
  id: null;
  sentence: string;
  correctAnswer: string;
  topic: string;
  level: string;
  hint: string;
  multipleChoiceOptions: string[];
  explanations: {
    pt: string;
    en: string;
    uk: string;
  };
  difficultyScore: number;
  usageCount: number;
}

async function importA2Exercises() {
  console.log('📚 Starting import of Portuguese A2 exercises...');
  
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), 'excercises', 'portuguese_a2_exercises.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const exercises: JsonExercise[] = JSON.parse(jsonData);
    
    console.log(`📊 Found ${exercises.length} exercises to import`);
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const exercise of exercises) {
      try {
        // Check if exercise with same sentence already exists (due to unique constraint)
        const existing = await sql`
          SELECT id FROM exercises WHERE sentence = ${exercise.sentence}
        `;
        
        if (existing.rows.length > 0) {
          console.log(`⚠️  Skipping duplicate sentence: "${exercise.sentence}"`);
          skippedCount++;
          continue;
        }
        
        // Insert the exercise
        await sql`
          INSERT INTO exercises (
            sentence,
            correct_answer,
            topic,
            level,
            hint,
            multiple_choice_options,
            explanation_pt,
            explanation_en,
            explanation_uk
          ) VALUES (
            ${exercise.sentence},
            ${exercise.correctAnswer},
            ${exercise.topic},
            ${exercise.level},
            ${exercise.hint || ''},
            ${JSON.stringify(exercise.multipleChoiceOptions)}::jsonb,
            ${exercise.explanations.pt},
            ${exercise.explanations.en},
            ${exercise.explanations.uk}
          )
        `;
        
        console.log(`✅ Imported: "${exercise.sentence.substring(0, 50)}..."`);
        importedCount++;
        
      } catch (error) {
        console.error(`❌ Error importing exercise: "${exercise.sentence}"`, error);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Import completed!`);
    console.log(`✅ Successfully imported: ${importedCount} exercises`);
    console.log(`⚠️  Skipped (duplicates): ${skippedCount} exercises`);
    console.log(`❌ Errors: ${errorCount} exercises`);
    
    // Verify the import
    const totalA2 = await sql`
      SELECT COUNT(*) as count FROM exercises WHERE level = 'A2'
    `;
    console.log(`📊 Total A2 exercises in database: ${totalA2.rows[0].count}`);
    
    const totalExercises = await sql`
      SELECT COUNT(*) as count FROM exercises
    `;
    console.log(`📊 Total exercises in database: ${totalExercises.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Fatal error during import:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  importA2Exercises()
    .then(() => {
      console.log('✅ Import script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Import script failed:', error);
      process.exit(1);
    });
}

export { importA2Exercises };