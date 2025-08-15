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
    
    console.log('🔧 SQL execution request:', { id, sqlCorrection: sqlCorrection?.substring(0, 100) + '...' });
    
    if (!sqlCorrection) {
      console.log('❌ No SQL correction provided');
      return NextResponse.json(
        { error: 'SQL correction is required' },
        { status: 400 }
      );
    }

    // Get the problem report to validate it has AI response with SQL
    const reportsResult = await ProblemReportDatabase.getProblemReports(1, 1000);
    const report = reportsResult.reports.find(r => r.id === id);
    
    if (!report) {
      console.log('❌ Problem report not found:', id);
      return NextResponse.json(
        { error: 'Problem report not found' },
        { status: 404 }
      );
    }

    console.log('📋 Report found:', { 
      id: report.id, 
      hasAiResponse: !!report.aiResponse, 
      hasSqlCorrection: !!report.aiResponse?.sqlCorrection 
    });

    if (!report.aiResponse?.sqlCorrection) {
      console.log('❌ No SQL correction available for this report');
      return NextResponse.json(
        { error: 'No SQL correction available for this report' },
        { status: 400 }
      );
    }

    // Verify the SQL matches what was provided by AI (normalize whitespace)
    const normalizeSQL = (sql: string) => sql.trim().replace(/\s+/g, ' ');
    const expectedSQL = normalizeSQL(report.aiResponse.sqlCorrection);
    const providedSQL = normalizeSQL(sqlCorrection);
    
    console.log('🔍 SQL comparison:', { 
      expected: expectedSQL.substring(0, 100) + '...',
      provided: providedSQL.substring(0, 100) + '...',
      matches: expectedSQL === providedSQL
    });
    
    if (expectedSQL !== providedSQL) {
      console.log('❌ SQL correction does not match AI recommendation');
      return NextResponse.json(
        { error: 'SQL correction does not match AI recommendation' },
        { status: 400 }
      );
    }

    // Execute the SQL correction and update status with unified method
    console.log('🚀 About to execute SQL correction and update status...');
    
    // Add a timeout promise to prevent indefinite hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('SQL execution timeout - operation took longer than 45 seconds'));
      }, 45000); // 45 second timeout
    });
    
    const result = await Promise.race([
      ProblemReportDatabase.executeSQLCorrectionAndUpdateStatus(
        id,
        sqlCorrection,
        'admin',
        'Correction applied via AI assistance',
        report.aiResponse
      ),
      timeoutPromise
    ]);
    
    console.log('📊 Unified operation result:', result);
    
    if (!result.success) {
      console.log('❌ Unified operation failed:', result.error);
      return NextResponse.json(
        { error: `Operation failed: ${result.error}` },
        { status: 500 }
      );
    }

    const updatedReport = result.report!;

    // Send acceptance email if user has email (non-blocking)
    if (updatedReport.userId) {
      // Don't await email sending to prevent blocking the response
      Promise.resolve().then(async () => {
        try {
          // Get user email - for now using placeholder
          // In production, you'd query the users table
          const userEmail = 'user@example.com'; // Replace with actual email lookup
          
          await EmailService.sendProblemReportAcceptance(
            userEmail,
            updatedReport.id
          );
          console.log('📧 Acceptance email sent successfully');
        } catch (emailError) {
          console.error('Failed to send acceptance email:', emailError);
          // Email failure doesn't affect the main operation
        }
      });
    }

    console.log('✅ SQL correction process completed successfully');
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to execute SQL correction', 
        details: errorMessage
      },
      { status: 500 }
    );
  }
}