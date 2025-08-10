#!/usr/bin/env tsx

import { LocalDatabase } from '@/lib/localDatabase';
import { UserDatabase } from '@/lib/userDatabase';
import { callClaudeApi, extractJsonFromClaudeResponse } from '@/lib/api-utils';
import { EnhancedExercise } from '@/types/enhanced';

interface HintAnalysis {
  id: string;
  needsHint: boolean;
  infinitive?: string;
  person?: string;
  form?: string;
  reason?: string;
}

interface ExerciseToAnalyze {
  id: string;
  sentence: string;
  correctAnswer: string;
  level: string;
  topic: string;
  currentHint: any;
}

/**
 * Create AI prompt to analyze if an exercise needs hints and generate them
 */
function createHintAnalysisPrompt(exercises: ExerciseToAnalyze[]): string {
  return `You are a Portuguese grammar expert analyzing exercises to determine if they need verb hints.

For each exercise, determine:
1. Whether the infinitive verb and grammatical person are obvious from context
2. If NOT obvious, provide the infinitive form and person/form details

Guidelines:
- If the subject clearly indicates the person (eu, tu, ele/ela, nós, vós, eles/elas), hints may not be needed
- If context makes the verb obvious (same verb used elsewhere, clear semantic context), hints may not be needed
- If the verb form is ambiguous or the person is unclear from context, provide hints
- For irregular verbs or complex conjugations, hints are usually helpful
- Consider the difficulty level: A1 needs more hints than B2

Return JSON array with this structure:
[
  {
    "id": "exercise-id",
    "needsHint": true/false,
    "infinitive": "verb infinitive" (if needsHint is true),
    "person": "1st person singular" or "2nd person plural" etc (if applicable),
    "form": "present indicative" or "past subjunctive" etc (if applicable),
    "reason": "brief explanation why hint is/isn't needed"
  }
]

Exercises to analyze:

${exercises.map((ex, i) => `${i + 1}. ID: ${ex.id}
   Sentence: "${ex.sentence}"
   Correct Answer: "${ex.correctAnswer}"
   Level: ${ex.level}
   Topic: ${ex.topic}
   Current Hint: ${JSON.stringify(ex.currentHint)}`).join('\n\n')}

Provide only the JSON array response.`;
}

/**
 * Get all exercises that have empty or insufficient hint data
 */
async function getExercisesNeedingHintAnalysis(): Promise<ExerciseToAnalyze[]> {
  console.log('🔍 Getting all exercises from database...');
  
  // Get all exercises
  const allExercises = await LocalDatabase.getExercises({ 
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    limit: 1000 // Get many exercises
  });
  
  console.log(`📊 Found ${allExercises.length} total exercises`);
  
  // Filter exercises that need hint analysis
  const exercisesNeedingAnalysis = allExercises.filter(exercise => {
    const hint = exercise.hint || {};
    
    // Need analysis if hint is empty or doesn't have infinitive/person data
    const hasInfinitive = hint.infinitive && hint.infinitive.trim();
    const hasPerson = hint.person && hint.person.trim();
    const hasForm = hint.form && hint.form.trim();
    
    // Consider it needs analysis if missing critical hint data
    return !hasInfinitive || (!hasPerson && !hasForm);
  }).map(exercise => ({
    id: exercise.id,
    sentence: exercise.sentence,
    correctAnswer: exercise.correctAnswer,
    level: exercise.level,
    topic: exercise.topic,
    currentHint: exercise.hint || {}
  }));
  
  console.log(`🎯 Found ${exercisesNeedingAnalysis.length} exercises needing hint analysis`);
  return exercisesNeedingAnalysis;
}

/**
 * Process exercises in batches to avoid overwhelming the AI
 */
async function analyzeExerciseBatch(exercises: ExerciseToAnalyze[], claudeApiKey: string): Promise<HintAnalysis[]> {
  console.log(`🤖 Analyzing batch of ${exercises.length} exercises with Claude AI...`);
  
  const prompt = createHintAnalysisPrompt(exercises);
  
  try {
    const response = await callClaudeApi(claudeApiKey, prompt);
    const jsonString = extractJsonFromClaudeResponse(response);
    const analysis: HintAnalysis[] = JSON.parse(jsonString);
    
    console.log(`✅ Successfully analyzed ${analysis.length} exercises`);
    return analysis;
  } catch (error) {
    console.error('❌ Error analyzing exercises:', error);
    throw error;
  }
}

/**
 * Update exercise hint data in the database
 */
async function updateExerciseHints(exerciseId: string, hintData: HintAnalysis): Promise<void> {
  if (!hintData.needsHint) return;
  
  const updatedHint = {
    infinitive: hintData.infinitive,
    person: hintData.person,
    form: hintData.form
  };
  
  // Remove undefined fields
  Object.keys(updatedHint).forEach(key => {
    if (updatedHint[key as keyof typeof updatedHint] === undefined) {
      delete updatedHint[key as keyof typeof updatedHint];
    }
  });
  
  await LocalDatabase.updateExerciseHint(exerciseId, updatedHint);
  console.log(`💾 Updated hint for exercise ${exerciseId}:`, updatedHint);
}

/**
 * Main function to enhance all exercise hints
 */
async function enhanceAllHints(): Promise<void> {
  console.log('🚀 Starting hint enhancement process...');
  
  try {
    // Get Claude API key
    const claudeApiKey = await UserDatabase.getClaudeApiKey();
    if (!claudeApiKey) {
      throw new Error('Claude API key not found in database. Please configure it first.');
    }
    console.log('🔑 Claude API key found');
    
    // Get exercises needing analysis
    const exercisesToAnalyze = await getExercisesNeedingHintAnalysis();
    if (exercisesToAnalyze.length === 0) {
      console.log('✅ All exercises already have sufficient hint data!');
      return;
    }
    
    // Process in batches of 20 to avoid overwhelming the AI
    const batchSize = 20;
    const batches = [];
    for (let i = 0; i < exercisesToAnalyze.length; i += batchSize) {
      batches.push(exercisesToAnalyze.slice(i, i + batchSize));
    }
    
    console.log(`📦 Processing ${batches.length} batches of up to ${batchSize} exercises each`);
    
    let totalUpdated = 0;
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`\n📦 Processing batch ${i + 1}/${batches.length}...`);
      
      try {
        const analyses = await analyzeExerciseBatch(batch, claudeApiKey);
        
        // Update exercises based on analysis
        for (let j = 0; j < analyses.length; j++) {
          const analysis = analyses[j];
          const exercise = batch.find(ex => ex.id === analysis.id);
          
          if (!exercise) {
            console.warn(`⚠️  Could not find exercise with ID ${analysis.id}`);
            continue;
          }
          
          if (analysis.needsHint) {
            await updateExerciseHints(exercise.id, analysis);
            totalUpdated++;
          } else {
            console.log(`ℹ️  Exercise "${exercise.sentence}" → "${exercise.correctAnswer}" doesn't need hint: ${analysis.reason}`);
          }
        }
        
        // Wait between batches to avoid rate limiting
        if (i < batches.length - 1) {
          console.log('⏳ Waiting 2 seconds before next batch...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ Error processing batch ${i + 1}:`, error);
        console.log('⏭️  Continuing with next batch...');
      }
    }
    
    console.log(`\n🎉 Hint enhancement complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Exercises analyzed: ${exercisesToAnalyze.length}`);
    console.log(`   - Hints added/updated: ${totalUpdated}`);
    console.log(`   - Exercises with sufficient hints: ${exercisesToAnalyze.length - totalUpdated}`);
    
  } catch (error) {
    console.error('💥 Fatal error in hint enhancement:', error);
    throw error;
  }
}

/**
 * Update exercise hint in database
 * Method updateExerciseHint now exists in LocalDatabase
 */

// Run the enhancement if this script is executed directly
if (require.main === module) {
  enhanceAllHints()
    .then(() => {
      console.log('✅ Hint enhancement completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Hint enhancement failed:', error);
      process.exit(1);
    });
}

export { enhanceAllHints, getExercisesNeedingHintAnalysis, analyzeExerciseBatch };