import { NextResponse } from 'next/server';
import { SmartDatabase } from '@/lib/smartDatabase';

export async function GET() {
  try {
    await SmartDatabase.initializeTables();
    const stats = await SmartDatabase.getUsageStats();
    
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