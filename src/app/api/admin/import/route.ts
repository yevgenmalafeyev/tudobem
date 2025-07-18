import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ExerciseDatabase } from '@/lib/database';
import JSZip from 'jszip';

async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin-session');
  return adminSession?.value === 'authenticated';
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read ZIP file
    const arrayBuffer = await file.arrayBuffer();
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(arrayBuffer);

    // Extract questions.json
    const questionsFile = zipContent.file('questions.json');
    if (!questionsFile) {
      return NextResponse.json({ error: 'questions.json not found in ZIP file' }, { status: 400 });
    }

    const questionsData = await questionsFile.async('text');
    let exercises;
    
    try {
      exercises = JSON.parse(questionsData);
    } catch (_error) {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    if (!Array.isArray(exercises)) {
      return NextResponse.json({ error: 'Questions data must be an array' }, { status: 400 });
    }

    // Validate and import exercises
    const validExercises = [];
    let duplicateCount = 0;

    for (const exercise of exercises) {
      // Basic validation
      if (!exercise.sentence || !exercise.correctAnswer || !exercise.topic || !exercise.level) {
        continue; // Skip invalid exercises
      }

      // Check for duplicates
      const exists = await ExerciseDatabase.exerciseExists(
        exercise.sentence,
        exercise.correctAnswer,
        exercise.topic,
        exercise.level
      );

      if (exists) {
        duplicateCount++;
        continue; // Skip duplicates
      }

      // Format exercise for database
      const formattedExercise = {
        sentence: exercise.sentence,
        correctAnswer: exercise.correctAnswer,
        topic: exercise.topic,
        level: exercise.level,
        hint: exercise.hint || {},
        multipleChoiceOptions: exercise.multipleChoiceOptions || [],
        explanations: exercise.explanations || {
          pt: exercise.explanation_pt || '',
          en: exercise.explanation_en || '',
          uk: exercise.explanation_uk || ''
        }
      };

      validExercises.push(formattedExercise);
    }

    // Save to database
    if (validExercises.length > 0) {
      await ExerciseDatabase.saveBatchExercises(validExercises);
    }

    return NextResponse.json({
      success: true,
      count: validExercises.length,
      duplicates: duplicateCount,
      total: exercises.length
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}