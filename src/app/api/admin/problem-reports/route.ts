import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/admin-middleware';
import { ProblemReportDatabase } from '@/lib/problemReportDatabase';

export async function GET(request: NextRequest) {
  // Apply admin authentication middleware
  const authResult = await adminMiddleware(request);
  if (authResult) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const status = searchParams.get('status') as 'pending' | 'accepted' | 'declined' | undefined;

    // Validate page parameters
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid page parameters' },
        { status: 400 }
      );
    }

    const result = await ProblemReportDatabase.getProblemReports(page, pageSize, status);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error getting problem reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}