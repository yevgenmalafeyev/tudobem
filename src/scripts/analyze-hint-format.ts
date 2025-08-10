#!/usr/bin/env tsx

/**
 * Analyze current hint format in the database
 * This script examines all exercises to understand the current hint format
 */

import { LocalDatabase } from '@/lib/localDatabase';

interface HintAnalysis {
  id: string;
  sentence: string;
  correctAnswer: string;
  level: string;
  topic: string;
  hint: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  needsFormatting?: boolean;
  suggestedFormat?: string;
}

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

function formatHint(hint: any): string | null { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!hint || typeof hint !== 'object') {
    return null;
  }

  const { infinitive, person, form } = hint;
  
  if (!infinitive) {
    return null;
  }

  if (person) {
    const pronoun = personMapping[person.toLowerCase()] || person;
    return `${infinitive} (${pronoun})`;
  }

  if (form) {
    return `${infinitive} (${form})`;
  }

  return infinitive;
}

function needsHintFormatting(hint: any): boolean { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!hint || typeof hint !== 'object') {
    return false;
  }

  const { infinitive, person } = hint;
  
  // Check if it uses the old "verb, person" format pattern
  if (infinitive && person && typeof person === 'string') {
    // Check if person contains "person singular/plural" pattern
    return /\d+(st|nd|rd|th)\s+person\s+(singular|plural)/.test(person.toLowerCase()) ||
           /(first|second|third)\s+person\s+(singular|plural)/.test(person.toLowerCase());
  }

  return false;
}

async function analyzeHintFormats() {
  console.log('🔍 Starting hint format analysis...\n');
  
  try {
    // Initialize database
    await LocalDatabase.initializeTables();
    
    // Get all exercises
    const allExercises = await LocalDatabase.getExercises({
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      topics: [], // Get all topics
      limit: 1000 // Get all exercises
    });

    console.log(`📊 Found ${allExercises.length} exercises in database\n`);

    const exercisesWithHints: HintAnalysis[] = [];
    const exercisesNeedingFormatting: HintAnalysis[] = [];
    
    // Analyze each exercise
    for (const exercise of allExercises) {
      if (exercise.hint && typeof exercise.hint === 'object' && Object.keys(exercise.hint).length > 0) {
        const analysis: HintAnalysis = {
          id: exercise.id!,
          sentence: exercise.sentence,
          correctAnswer: exercise.correctAnswer,
          level: exercise.level,
          topic: exercise.topic,
          hint: exercise.hint
        };

        exercisesWithHints.push(analysis);

        if (needsHintFormatting(exercise.hint)) {
          analysis.needsFormatting = true;
          analysis.suggestedFormat = formatHint(exercise.hint) || 'Unable to format';
          exercisesNeedingFormatting.push(analysis);
        }
      }
    }

    console.log(`📈 Statistics:`);
    console.log(`   Total exercises: ${allExercises.length}`);
    console.log(`   Exercises with hints: ${exercisesWithHints.length}`);
    console.log(`   Exercises needing formatting: ${exercisesNeedingFormatting.length}`);
    console.log('');

    if (exercisesNeedingFormatting.length > 0) {
      console.log('🔧 Exercises that need hint formatting:');
      console.log('=====================================\n');
      
      exercisesNeedingFormatting.slice(0, 10).forEach((exercise, index) => {
        console.log(`${index + 1}. [${exercise.level}] ${exercise.sentence.slice(0, 60)}...`);
        console.log(`   Current hint: ${JSON.stringify(exercise.hint)}`);
        console.log(`   Suggested format: "${exercise.suggestedFormat}"`);
        console.log('');
      });

      if (exercisesNeedingFormatting.length > 10) {
        console.log(`   ... and ${exercisesNeedingFormatting.length - 10} more exercises\n`);
      }
    }

    // Show examples of current hint formats
    console.log('📋 Current hint format examples:');
    console.log('=================================\n');
    
    const uniqueHintFormats = new Set<string>();
    exercisesWithHints.forEach(exercise => {
      const hintStr = JSON.stringify(exercise.hint);
      if (uniqueHintFormats.size < 10) {
        uniqueHintFormats.add(hintStr);
      }
    });

    Array.from(uniqueHintFormats).forEach((hintFormat, index) => {
      console.log(`${index + 1}. ${hintFormat}`);
    });

    console.log('\n✅ Hint format analysis completed');

    return {
      totalExercises: allExercises.length,
      exercisesWithHints: exercisesWithHints.length,
      exercisesNeedingFormatting: exercisesNeedingFormatting.length,
      exercisesToUpdate: exercisesNeedingFormatting
    };

  } catch (error) {
    console.error('❌ Error analyzing hint formats:', error);
    throw error;
  }
}

// Run the analysis
if (require.main === module) {
  analyzeHintFormats().catch(console.error);
}

export { analyzeHintFormats, formatHint, needsHintFormatting };