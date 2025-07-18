import { NextResponse } from 'next/server';
import { AnalyticsDatabase } from '@/lib/database';

export async function POST() {
  try {
    await AnalyticsDatabase.initializeAnalyticsTables();
    return NextResponse.json({ success: true, message: 'Analytics tables initialized successfully' });
  } catch (error) {
    console.error('Error initializing analytics tables:', error);
    return NextResponse.json({ error: 'Failed to initialize analytics tables' }, { status: 500 });
  }
}