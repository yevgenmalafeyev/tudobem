import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/admin-middleware';
import { ProblemReportDatabase } from '@/lib/problemReportDatabase';
import { EmailService } from '@/lib/emailService';

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply admin authentication middleware
  const authResult = await adminMiddleware(request);
  if (authResult) return authResult;

  try {
    const { id } = await params;
    const body = await request.json();
    const { sqlCorrection } = body;
    
    if (!sqlCorrection) {
      return NextResponse.json(
        { error: 'SQL correction is required' },
        { status: 400 }
      );
    }

    // Get the problem report to validate it has AI response with SQL
    const reportsResult = await ProblemReportDatabase.getProblemReports(1, 1000);
    const report = reportsResult.reports.find(r => r.id === id);
    
    if (!report) {
      return NextResponse.json(
        { error: 'Problem report not found' },
        { status: 404 }
      );
    }

    if (!report.aiResponse?.sqlCorrection) {
      return NextResponse.json(
        { error: 'No SQL correction available for this report' },
        { status: 400 }
      );
    }

    // Verify the SQL matches what was provided by AI
    if (report.aiResponse.sqlCorrection !== sqlCorrection) {
      return NextResponse.json(
        { error: 'SQL correction does not match AI recommendation' },
        { status: 400 }
      );
    }

    // Execute the SQL correction
    const executionResult = await ProblemReportDatabase.executeSQLCorrection(sqlCorrection);
    
    if (!executionResult.success) {
      return NextResponse.json(
        { error: `SQL execution failed: ${executionResult.error}` },
        { status: 400 }
      );
    }

    // Mark the report as accepted
    const updatedReport = await ProblemReportDatabase.updateProblemReportStatus(
      id,
      'accepted',
      'admin', // Admin user ID
      'Correction applied via AI assistance',
      report.aiResponse
    );

    // Send acceptance email if user has email
    if (updatedReport.userId) {
      try {
        // Get user email - for now using placeholder
        // In production, you'd query the users table
        const userEmail = 'user@example.com'; // Replace with actual email lookup
        
        await EmailService.sendProblemReportAcceptance(
          userEmail,
          updatedReport.id
        );
      } catch (emailError) {
        console.error('Failed to send acceptance email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'SQL correction executed successfully and report marked as accepted',
      data: {
        reportId: updatedReport.id,
        executedSQL: sqlCorrection,
        status: updatedReport.status
      }
    });

  } catch (error) {
    console.error('Error executing SQL correction:', error);
    return NextResponse.json(
      { error: 'Failed to execute SQL correction' },
      { status: 500 }
    );
  }
}