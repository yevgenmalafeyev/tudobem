import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/database-adapter';
import JSZip from 'jszip';

async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin-session');
  return adminSession?.value === 'authenticated';
}

export async function POST() {
  try {
    // Check admin authentication
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all exercises from database
    const result = await sql`
      SELECT 
        id,
        sentence,
        correct_answer,
        topic,
        level,
        hint_infinitive,
        hint_person,
        hint_form,
        multiple_choice_options,
        explanation_pt,
        explanation_en,
        explanation_uk,
        created_at
      FROM exercises
      ORDER BY created_at DESC
    `;

    // Format the data for export
    const exercises = result.rows.map(row => ({
      id: row.id,
      sentence: row.sentence,
      correctAnswer: row.correct_answer,
      topic: row.topic,
      level: row.level,
      hint: {
        infinitive: row.hint_infinitive || undefined,
        person: row.hint_person || undefined,
        form: row.hint_form || undefined
      },
      multipleChoiceOptions: row.multiple_choice_options || [],
      explanations: {
        pt: row.explanation_pt,
        en: row.explanation_en,
        uk: row.explanation_uk
      },
      createdAt: row.created_at
    }));

    // Create ZIP file
    const zip = new JSZip();
    
    // Add main data file
    zip.file('questions.json', JSON.stringify(exercises, null, 2));
    
    // Add metadata
    const metadata = {
      exportDate: new Date().toISOString(),
      totalQuestions: exercises.length,
      version: '1.0.0',
      source: 'Tudobem Admin Panel'
    };
    zip.file('metadata.json', JSON.stringify(metadata, null, 2));

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Return ZIP file
    return new NextResponse(zipBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="tudobem-questions-${new Date().toISOString().split('T')[0]}.zip"`
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}