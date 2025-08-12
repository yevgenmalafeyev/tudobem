import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/admin-middleware';
import { ProblemReportDatabase } from '@/lib/problemReportDatabase';
import { EmailService } from '@/lib/emailService';

export async function PATCH(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply admin authentication middleware
  const authResult = await adminMiddleware(request);
  if (authResult) return authResult;

  try {
    const { id } = await params;
    const body = await request.json();
    
    const { action, adminComment } = body;
    
    if (!action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "accept" or "decline"' },
        { status: 400 }
      );
    }

    // Get admin user ID from session/token (simplified for now)
    const adminUserId = 'admin'; // In production, get from authenticated session

    // Update the problem report
    const updatedReport = await ProblemReportDatabase.updateProblemReportStatus(
      id,
      action === 'accept' ? 'accepted' : 'declined',
      adminUserId,
      adminComment
    );

    // Send acceptance email if accepted and user has email
    if (action === 'accept' && updatedReport.userId) {
      try {
        // Get user email from user ID
        // For now, we'll assume the email is available in the report
        // In production, you'd query the users table
        const userEmail = 'user@example.com'; // Replace with actual email lookup
        
        await EmailService.sendProblemReportAcceptance(
          userEmail,
          updatedReport.id,
          updatedReport.userId
        );
      } catch (emailError) {
        console.error('Failed to send acceptance email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedReport,
      message: `Problem report ${action}ed successfully`
    });

  } catch (error) {
    console.error('Error updating problem report:', error);
    
    if (error instanceof Error && error.message === 'Problem report not found') {
      return NextResponse.json(
        { error: 'Problem report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}