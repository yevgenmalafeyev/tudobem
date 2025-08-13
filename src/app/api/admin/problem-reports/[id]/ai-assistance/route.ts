import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/admin-middleware';
import { ProblemReportDatabase } from '@/lib/problemReportDatabase';
import { AIAssistanceService, MockAIAssistanceService } from '@/lib/aiAssistanceService';

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply admin authentication middleware
  const authResult = await adminMiddleware(request);
  if (authResult) return authResult;

  try {
    const { id } = await params;
    
    // Get the problem report with exercise data
    const reportsResult = await ProblemReportDatabase.getProblemReports(1, 1);
    const report = reportsResult.reports.find(r => r.id === id);
    
    if (!report) {
      return NextResponse.json(
        { error: 'Problem report not found' },
        { status: 404 }
      );
    }

    // Use mock service in development/testing, real service in production
    const useRealAI = process.env.NODE_ENV === 'production' && process.env.ANTHROPIC_API_KEY;
    const aiService = useRealAI ? AIAssistanceService : MockAIAssistanceService;

    // Get AI analysis
    const aiResponse = await aiService.analyzeReport(report);

    // Store AI response in the database
    await ProblemReportDatabase.updateProblemReportStatus(
      id,
      report.status, // Keep current status
      'admin', // Admin user ID
      undefined, // No admin comment change
      aiResponse
    );

    // Format SQL for display if present
    let formattedSQL = aiResponse.sqlCorrection;
    if (formattedSQL) {
      // Basic SQL formatting for display
      formattedSQL = formattedSQL
        .replace(/UPDATE/gi, 'UPDATE')
        .replace(/SET/gi, 'SET')
        .replace(/WHERE/gi, 'WHERE')
        .replace(/'/g, "'")
        .trim();
    }

    return NextResponse.json({
      success: true,
      data: {
        isValid: aiResponse.isValid,
        explanation: aiResponse.explanation,
        sqlCorrection: aiResponse.sqlCorrection,
        formattedSQL,
        canExecute: !!aiResponse.sqlCorrection && aiResponse.isValid
      }
    });

  } catch (error) {
    console.error('Error getting AI assistance:', error);
    return NextResponse.json(
      { error: 'AI assistance service unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}