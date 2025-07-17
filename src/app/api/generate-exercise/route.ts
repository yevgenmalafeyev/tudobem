import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { topics } from '@/data/topics';
import { ANTHROPIC_CONFIG } from '@/constants';
import { getFallbackExercise, createExercise } from '@/services/exerciseService';
import { generateExercisePrompt } from '@/utils/prompts';
import { LanguageLevel } from '@/types';

export async function POST(request: NextRequest) {
  console.log('Exercise generation API called');
  
  let levels: LanguageLevel[] = [];
  let selectedTopics: string[] = [];
  let masteredWords: Record<string, unknown> = {};
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { levels: parsedLevels, topics: parsedTopics, claudeApiKey, masteredWords: parsedMasteredWords = {} } = body;
    levels = parsedLevels || [];
    selectedTopics = parsedTopics || [];
    masteredWords = parsedMasteredWords;
    
    console.log('Parsed data:', { levels, selectedTopics: selectedTopics?.length, hasApiKey: !!claudeApiKey, masteredWordsCount: Object.keys(masteredWords).length });
    
    // If no Claude API key, use fallback exercises
    if (!claudeApiKey) {
      console.log('No API key, using fallback exercises');
      const exercise = getFallbackExercise(levels || ['A1'], masteredWords, selectedTopics);
      if (!exercise) {
        console.error('No fallback exercise found for levels:', levels, 'and topics:', selectedTopics);
        return NextResponse.json({ error: 'No exercises available for selected levels and topics. Please check your configuration.' }, { status: 400 });
      }
      console.log('Returning fallback exercise:', exercise.level, exercise.correctAnswer, exercise.topic);
      return NextResponse.json(exercise);
    }

    // Generate exercise using Claude AI
    const anthropic = new Anthropic({
      apiKey: claudeApiKey,
    });

    const topicNames = topics
      .filter(topic => selectedTopics.includes(topic.id))
      .map(topic => topic.name);

    const prompt = generateExercisePrompt(levels, selectedTopics, topicNames, masteredWords);

    console.log('Claude AI prompt:', prompt);
    
    const message = await anthropic.messages.create({
      model: ANTHROPIC_CONFIG.model,
      max_tokens: ANTHROPIC_CONFIG.maxTokens.exercise,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    console.log('Claude AI response:', responseText);
    
    // Extract JSON from response (Claude sometimes adds explanatory text)
    // Find the first { and its matching }
    const startIndex = responseText.indexOf('{');
    if (startIndex === -1) {
      throw new Error('No JSON found in Claude response');
    }
    
    let braceCount = 0;
    let endIndex = startIndex;
    
    for (let i = startIndex; i < responseText.length; i++) {
      if (responseText[i] === '{') {
        braceCount++;
      } else if (responseText[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }
    }
    
    const jsonString = responseText.substring(startIndex, endIndex + 1);
    console.log('Extracted JSON:', jsonString);
    
    const exerciseData = JSON.parse(jsonString);
    console.log('Parsed exercise data:', exerciseData);
    
    // Validate that the exercise matches the requested constraints
    if (!levels.includes(exerciseData.level)) {
      console.error('Level constraint violation:', { requested: levels, actual: exerciseData.level });
      throw new Error(`AI generated exercise with level ${exerciseData.level} but requested levels were ${levels.join(', ')}`);
    }
    
    if (!selectedTopics.includes(exerciseData.topic)) {
      console.error('Topic constraint violation:', { requested: selectedTopics, actual: exerciseData.topic });
      throw new Error(`AI generated exercise with topic ${exerciseData.topic} but requested topics were ${selectedTopics.join(', ')}`);
    }
    
    const exercise = createExercise(exerciseData);
    console.log('Final exercise to return:', exercise);

    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Error generating exercise:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined
    });
    
    // Try fallback with original request parameters instead of forcing A1
    console.log('Attempting fallback with original parameters');
    const exercise = getFallbackExercise(levels || ['A1'], masteredWords, selectedTopics);
    
    if (exercise) {
      console.log('Fallback exercise found:', exercise.level, exercise.correctAnswer, exercise.topic);
      return NextResponse.json(exercise);
    }
    
    console.error('Fallback failed for levels:', levels, 'and topics:', selectedTopics);
    return NextResponse.json({ 
      error: `No exercises available for selected levels (${levels?.join(', ')}) and topics. Please try selecting different levels or topics.`,
      fallbackAttempted: true,
      originalError: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}