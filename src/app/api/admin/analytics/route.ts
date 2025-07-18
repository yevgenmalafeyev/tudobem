import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AnalyticsDatabase } from '@/lib/database';

async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin-session');
  return adminSession?.value === 'authenticated';
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '7d';

    // Get real analytics data from database
    const analytics = await AnalyticsDatabase.getAnalytics(range as '1d' | '7d' | '30d' | '90d');

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}