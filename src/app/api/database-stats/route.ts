import { NextResponse } from 'next/server';
import { ExerciseDatabase } from '@/lib/database';

export async function GET() {
  try {
    await ExerciseDatabase.initializeTables();
    const stats = await ExerciseDatabase.getStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch database statistics'
    }, { status: 500 });
  }
}