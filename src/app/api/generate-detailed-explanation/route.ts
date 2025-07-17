import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_CONFIG } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    const { exercise, claudeApiKey, explanationLanguage = 'portuguese' } = await request.json();
    
    if (!claudeApiKey) {
      return NextResponse.json({ explanation: '' });
    }

    const anthropic = new Anthropic({
      apiKey: claudeApiKey,
    });

    const languageInstructions = explanationLanguage === 'english' 
      ? 'Respond in English.'
      : 'Responda em português.';

    const prompt = `You are a Portuguese grammar expert. Given this exercise:

Sentence: "${exercise.sentence}"
Correct answer: "${exercise.correctAnswer}"
Level: ${exercise.level}
Topic: ${exercise.topic}

Provide a detailed grammar explanation focusing on:
1. Why "${exercise.correctAnswer}" is the correct answer
2. The specific grammar rule that applies here
3. Common mistakes students make with this construction
4. A brief example of the same rule in a different context

Keep it concise but informative, around 3-4 sentences. ${languageInstructions}`;

    const message = await anthropic.messages.create({
      model: ANTHROPIC_CONFIG.model,
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const explanation = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Error generating detailed explanation:', error);
    return NextResponse.json({ explanation: '' });
  }
}