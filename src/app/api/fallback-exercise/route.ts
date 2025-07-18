import { NextRequest, NextResponse } from 'next/server';
import { ExerciseDatabase } from '@/lib/database';
import { LanguageLevel } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { levels, topics } = await request.json();

    if (!levels || !Array.isArray(levels) || levels.length === 0) {
      return NextResponse.json({ error: 'Invalid levels provided' }, { status: 400 });
    }

    let fallbackExercise;

    // Try to get exercise matching both levels and topics
    if (topics && Array.isArray(topics) && topics.length > 0) {
      const exercisesWithTopics = await ExerciseDatabase.getRandomExercises(
        levels as LanguageLevel[], 
        topics, 
        1
      );
      
      if (exercisesWithTopics.length > 0) {
        fallbackExercise = exercisesWithTopics[0];
      }
    }

    // If no exercise found with topics, try with levels only
    if (!fallbackExercise) {
      const exercisesWithLevels = await ExerciseDatabase.getRandomExercisesByLevel(
        levels as LanguageLevel[], 
        1
      );
      
      if (exercisesWithLevels.length > 0) {
        fallbackExercise = exercisesWithLevels[0];
      }
    }

    if (!fallbackExercise) {
      return NextResponse.json({ fallbackExercise: null }, { status: 200 });
    }

    return NextResponse.json({ fallbackExercise }, { status: 200 });
  } catch (error) {
    console.error('Error fetching fallback exercise:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}