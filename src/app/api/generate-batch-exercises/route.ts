import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { topics } from '@/data/topics';
import { ANTHROPIC_CONFIG } from '@/constants';
import { getFallbackExercise, createExercise } from '@/services/exerciseService';
import { generateBatchExercisePrompt } from '@/utils/prompts';
import { LanguageLevel } from '@/types';
import { ExerciseDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  console.log('Batch exercise generation API called');
  
  let levels: LanguageLevel[] = [];
  let selectedTopics: string[] = [];
  let masteredWords: Record<string, unknown> = {};
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { 
      levels: parsedLevels, 
      topics: parsedTopics, 
      claudeApiKey, 
      masteredWords: parsedMasteredWords = {}
    } = body;
    
    levels = parsedLevels || [];
    selectedTopics = parsedTopics || [];
    masteredWords = parsedMasteredWords;
    
    console.log('Parsed data:', { 
      levels, 
      selectedTopics: selectedTopics?.length, 
      hasApiKey: !!claudeApiKey, 
      masteredWordsCount: Object.keys(masteredWords).length
    });
    
    // If no Claude API key, use database exercises
    if (!claudeApiKey) {
      console.log('No API key, fetching exercises from database');
      try {
        // Initialize database tables if needed
        await ExerciseDatabase.initializeTables();
        
        let exercises = [];
        
        if (selectedTopics.length > 0) {
          // Get exercises for specific topics
          exercises = await ExerciseDatabase.getRandomExercises(levels || ['A1'], selectedTopics, 10);
        } else {
          // Get exercises for levels only
          exercises = await ExerciseDatabase.getRandomExercisesByLevel(levels || ['A1'], 10);
        }
        
        console.log('Returning database exercises:', exercises.length);
        return NextResponse.json({ exercises });
      } catch (error) {
        console.error('Database error, falling back to hardcoded exercises:', error);
        // Fallback to hardcoded exercises if database fails
        const exercises = [];
        for (let i = 0; i < 10; i++) {
          const exercise = getFallbackExercise(levels || ['A1'], masteredWords, selectedTopics);
          if (exercise) {
            exercises.push(exercise);
          }
        }
        console.log('Returning hardcoded fallback exercises:', exercises.length);
        return NextResponse.json({ exercises });
      }
    }

    // Generate batch exercises using Claude AI
    const anthropic = new Anthropic({
      apiKey: claudeApiKey,
    });

    const topicNames = topics
      .filter(topic => selectedTopics.includes(topic.id))
      .map(topic => topic.name);

    const prompt = generateBatchExercisePrompt(levels, selectedTopics, topicNames, masteredWords);

    console.log('Claude AI batch prompt:', prompt);
    
    const message = await anthropic.messages.create({
      model: ANTHROPIC_CONFIG.model,
      max_tokens: ANTHROPIC_CONFIG.maxTokens.exercise * 10, // 10x for batch
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    console.log('Claude AI response:', responseText);
    
    // Extract JSON from response
    const startIndex = responseText.indexOf('[');
    if (startIndex === -1) {
      throw new Error('No JSON array found in Claude response');
    }
    
    let bracketCount = 0;
    let endIndex = startIndex;
    
    for (let i = startIndex; i < responseText.length; i++) {
      if (responseText[i] === '[') {
        bracketCount++;
      } else if (responseText[i] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          endIndex = i;
          break;
        }
      }
    }
    
    const jsonString = responseText.substring(startIndex, endIndex + 1);
    console.log('Extracted JSON:', jsonString);
    
    const batchData = JSON.parse(jsonString);
    console.log('Parsed batch data:', batchData.length, 'exercises');
    
    // Validate and process each exercise
    const exercises = [];
    const exercisesToSave: {
      sentence: string;
      correctAnswer: string;
      topic: string;
      level: string;
      hint?: { infinitive?: string; person?: string; form?: string };
      multipleChoiceOptions?: string[];
      explanations?: { pt: string; en: string; uk: string };
    }[] = [];
    
    for (const exerciseData of batchData) {
      try {
        // Validate constraints
        if (!levels.includes(exerciseData.level)) {
          console.warn('Level constraint violation:', { requested: levels, actual: exerciseData.level });
          continue;
        }
        
        if (!selectedTopics.includes(exerciseData.topic)) {
          console.warn('Topic constraint violation:', { requested: selectedTopics, actual: exerciseData.topic });
          continue;
        }
        
        const exercise = createExercise(exerciseData);
        exercises.push(exercise);
        
        // Prepare exercise for database saving
        exercisesToSave.push({
          sentence: exerciseData.sentence,
          correctAnswer: exerciseData.correctAnswer,
          topic: exerciseData.topic,
          level: exerciseData.level,
          hint: exerciseData.hint,
          multipleChoiceOptions: exerciseData.multipleChoiceOptions,
          explanations: exerciseData.explanations
        });
      } catch (error) {
        console.warn('Error processing exercise:', error, exerciseData);
      }
    }
    
    console.log('Final exercises to return:', exercises.length);
    
    // Save exercises to database (don't wait for completion)
    if (exercisesToSave.length > 0) {
      ExerciseDatabase.initializeTables()
        .then(() => ExerciseDatabase.saveBatchExercises(exercisesToSave))
        .then(() => console.log('Exercises saved to database successfully'))
        .catch(error => console.error('Error saving exercises to database:', error));
    }

    // If we don't have enough valid exercises, fill with fallbacks
    while (exercises.length < 10) {
      const fallback = getFallbackExercise(levels || ['A1'], masteredWords, selectedTopics);
      if (fallback) {
        exercises.push(fallback);
      } else {
        break;
      }
    }

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error('Error generating batch exercises:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined
    });
    
    // Try fallback with original request parameters
    console.log('Attempting fallback with original parameters');
    const exercises = [];
    for (let i = 0; i < 10; i++) {
      const exercise = getFallbackExercise(levels || ['A1'], masteredWords, selectedTopics);
      if (exercise) {
        exercises.push(exercise);
      }
    }
    
    if (exercises.length > 0) {
      console.log('Fallback exercises found:', exercises.length);
      return NextResponse.json({ exercises });
    }
    
    console.error('Fallback failed for levels:', levels, 'and topics:', selectedTopics);
    return NextResponse.json({ 
      error: `No exercises available for selected levels (${levels?.join(', ')}) and topics. Please try selecting different levels or topics.`,
      fallbackAttempted: true,
      originalError: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}