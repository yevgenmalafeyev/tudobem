import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ExerciseDatabase } from '@/lib/database';

async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin-session');
  return adminSession?.value === 'authenticated';
}

export async function GET() {
  try {
    // Check admin authentication
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get statistics from database
    const stats = await ExerciseDatabase.getStats();

    // Format the response
    const response = {
      total: parseInt(stats.total as string),
      byLevel: stats.byLevel.map(item => ({
        level: item.level,
        count: parseInt(item.count as string)
      })),
      byTopic: stats.byTopic.map(item => ({
        topic: item.topic,
        count: parseInt(item.count as string)
      }))
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}