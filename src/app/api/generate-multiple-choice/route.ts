import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_CONFIG } from '@/constants';
import { generateBasicDistractors, processMultipleChoiceOptions } from '@/services/multipleChoiceService';
import { shuffleArray } from '@/utils/arrays';
import { generateMultipleChoicePrompt } from '@/utils/prompts';

export async function POST(request: NextRequest) {
  let requestData;
  try {
    requestData = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }
  
  const { exercise, claudeApiKey, explanationLanguage = 'pt' } = requestData;
  
  // Validate required data
  if (!exercise || exercise.correctAnswer === undefined || exercise.correctAnswer === null) {
    return NextResponse.json(
      { error: 'Exercise data with correctAnswer is required' },
      { status: 400 }
    );
  }
  
  try {
    if (!claudeApiKey) {
      // Fallback: generate basic distractors without AI
      const distractors = generateBasicDistractors(exercise.correctAnswer);
      const options = processMultipleChoiceOptions(exercise.correctAnswer, distractors);
      
      return NextResponse.json({
        options: shuffleArray(options)
      });
    }

    const anthropic = new Anthropic({
      apiKey: claudeApiKey,
    });

    const prompt = generateMultipleChoicePrompt(exercise, explanationLanguage);

    const message = await anthropic.messages.create({
      model: ANTHROPIC_CONFIG.model,
      max_tokens: ANTHROPIC_CONFIG.maxTokens.multipleChoice,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const distractors = JSON.parse(responseText);
    const options = processMultipleChoiceOptions(exercise.correctAnswer, distractors);

    return NextResponse.json({ 
      options: shuffleArray(options) 
    });
  } catch (error) {
    console.error('Error generating multiple choice options:', error);
    
    // Fallback to basic distractors
    const distractors = generateBasicDistractors(exercise.correctAnswer);
    const options = processMultipleChoiceOptions(exercise.correctAnswer, distractors);
    
    return NextResponse.json({
      options: shuffleArray(options)
    });
  }
}