#!/usr/bin/env npx tsx

import fs from 'fs';
import { ExerciseDatabase } from '@/lib/database';

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
    await ExerciseDatabase.initializeTables();
    console.log('✅ Database tables initialized');
    
    // Check for duplicates before importing
    let duplicateCount = 0;
    const exercisesToImport = [];
    
    for (const exercise of exercises) {
      const exists = await ExerciseDatabase.exerciseExists(
        exercise.sentence,
        exercise.correctAnswer,
        exercise.topic,
        exercise.level
      );
      
      if (exists) {
        duplicateCount++;
      } else {
        exercisesToImport.push(exercise);
      }
    }
    
    if (duplicateCount > 0) {
      console.log(`⚠️ Skipping ${duplicateCount} duplicate exercises`);
    }
    
    if (exercisesToImport.length === 0) {
      console.log('📋 All exercises already exist in database');
      return;
    }
    
    console.log(`💾 Importing ${exercisesToImport.length} new exercises...`);
    
    // Import exercises in batches to avoid overwhelming the database
    const BATCH_SIZE = 50;
    let totalImported = 0;
    
    for (let i = 0; i < exercisesToImport.length; i += BATCH_SIZE) {
      const batch = exercisesToImport.slice(i, i + BATCH_SIZE);
      console.log(`📤 Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(exercisesToImport.length/BATCH_SIZE)} (${batch.length} exercises)`);
      
      const saved = await ExerciseDatabase.saveBatchExercises(batch);
      totalImported += saved.length;
      
      console.log(`✅ Batch completed: ${saved.length}/${batch.length} exercises saved`);
    }
    
    console.log(`\n🎉 Import completed successfully!`);
    console.log(`📊 Total imported: ${totalImported}/${exercises.length} exercises`);
    console.log(`📊 Skipped duplicates: ${duplicateCount}`);
    
    // Get statistics by level and topic
    console.log('\n📈 Import summary:');
    const stats = await ExerciseDatabase.getStats();
    console.log(`   Total exercises in database: ${stats.total}`);
    console.log('   By level:', stats.byLevel.map(l => `${l.level}: ${l.count}`).join(', '));
    console.log(`   Topics imported: ${[...new Set(exercisesToImport.map(e => e.topic))].join(', ')}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
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