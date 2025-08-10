#!/usr/bin/env tsx

/**
 * Fix hint format in the database
 * Convert from "verb, 2nd person singular" to "verb (tu)" format
 */

import { LocalDatabase } from '@/lib/localDatabase';
import { analyzeHintFormats, formatHint, needsHintFormatting } from './analyze-hint-format';

// Person mapping for Portuguese pronouns
const personMapping: Record<string, string> = {
  '1st person singular': 'eu',
  '2nd person singular': 'tu',
  '3rd person singular': 'ele/ela',
  '1st person plural': 'nós',
  '2nd person plural': 'vós',
  '3rd person plural': 'eles/elas',
  'first person singular': 'eu',
  'second person singular': 'tu',
  'third person singular': 'ele/ela',
  'first person plural': 'nós',
  'second person plural': 'vós',
  'third person plural': 'eles/elas'
};

function convertHintFormat(hint: any): any {
  if (!hint || typeof hint !== 'object') {
    return hint;
  }

  const { infinitive, person, form } = hint;
  
  if (!infinitive) {
    return hint;
  }

  // If it has the old person format, convert it
  if (person && typeof person === 'string') {
    const lowerPerson = person.toLowerCase();
    
    // Check if it matches the old format
    if (/\d+(st|nd|rd|th)\s+person\s+(singular|plural)/.test(lowerPerson) ||
        /(first|second|third)\s+person\s+(singular|plural)/.test(lowerPerson)) {
      
      const pronoun = personMapping[lowerPerson] || person;
      
      // Create new hint format
      const newHint: any = {
        infinitive: infinitive,
        person: pronoun
      };

      // Keep form if it exists and is not redundant
      if (form) {
        newHint.form = form;
      }

      return newHint;
    }
  }

  return hint;
}

async function fixHintFormats() {
  console.log('🔧 Starting hint format conversion...\n');
  
  try {
    // Initialize database
    await LocalDatabase.initializeTables();
    
    // First, analyze current state
    const analysis = await analyzeHintFormats();
    
    if (analysis.exercisesNeedingFormatting === 0) {
      console.log('✅ No exercises need hint formatting updates');
      return;
    }

    console.log(`\n🎯 Found ${analysis.exercisesNeedingFormatting} exercises that need formatting updates`);
    console.log('📝 Starting conversion process...\n');

    // Get all exercises that need formatting
    const allExercises = await LocalDatabase.getExercises({
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      topics: [], // Get all topics
      limit: 1000 // Get all exercises
    });

    let updatedCount = 0;
    const updatePromises: Promise<void>[] = [];

    for (const exercise of allExercises) {
      if (exercise.hint && needsHintFormatting(exercise.hint)) {
        const originalHint = JSON.parse(JSON.stringify(exercise.hint)); // Deep clone
        const updatedHint = convertHintFormat(exercise.hint);
        
        console.log(`🔄 Updating exercise: [${exercise.level}] ${exercise.sentence.slice(0, 50)}...`);
        console.log(`   Old format: ${JSON.stringify(originalHint)}`);
        console.log(`   New format: ${JSON.stringify(updatedHint)}`);
        
        // Update the hint in the database
        const updatePromise = LocalDatabase.updateExerciseHint(exercise.id!, updatedHint)
          .then(() => {
            console.log(`   ✅ Updated successfully\n`);
            updatedCount++;
          })
          .catch((error) => {
            console.error(`   ❌ Failed to update: ${error.message}\n`);
          });
          
        updatePromises.push(updatePromise);
      }
    }

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log(`\n🎉 Hint format conversion completed!`);
    console.log(`   Total exercises updated: ${updatedCount}`);
    console.log(`   Expected updates: ${analysis.exercisesNeedingFormatting}`);

    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    const finalAnalysis = await analyzeHintFormats();
    
    console.log(`\n📊 Final Results:`);
    console.log(`   Exercises with hints: ${finalAnalysis.exercisesWithHints}`);
    console.log(`   Exercises still needing formatting: ${finalAnalysis.exercisesNeedingFormatting}`);
    
    if (finalAnalysis.exercisesNeedingFormatting === 0) {
      console.log('\n✅ All hint formats have been successfully updated!');
    } else {
      console.log(`\n⚠️ ${finalAnalysis.exercisesNeedingFormatting} exercises still need formatting`);
    }

  } catch (error) {
    console.error('❌ Error fixing hint formats:', error);
    throw error;
  }
}

// Run the fix
if (require.main === module) {
  fixHintFormats().catch(console.error);
}

export { fixHintFormats, convertHintFormat };