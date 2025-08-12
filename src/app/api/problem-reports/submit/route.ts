import { NextRequest, NextResponse } from 'next/server';
import { ProblemReportDatabase } from '@/lib/problemReportDatabase';
import { ProblemReportSubmission } from '@/types/problem-report';
// Note: For now we'll allow anonymous reports, user session handling can be added later

export async function POST(request: NextRequest) {
  try {
    // For now, allow anonymous reports (session handling can be added later)
    
    const body: ProblemReportSubmission = await request.json();
    
    // Validate required fields
    if (!body.exerciseId || !body.problemType || !body.userComment) {
      return NextResponse.json(
        { error: 'Missing required fields: exerciseId, problemType, userComment' },
        { status: 400 }
      );
    }

    // Validate problem type
    const validProblemTypes = ['irrelevant_hint', 'incorrect_answer', 'missing_option', 'other'];
    if (!validProblemTypes.includes(body.problemType)) {
      return NextResponse.json(
        { error: 'Invalid problem type' },
        { status: 400 }
      );
    }

    // Validate comment length
    if (body.userComment.length < 10 || body.userComment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }

    // Create the problem report
    const report = await ProblemReportDatabase.createProblemReport({
      userId: undefined, // Anonymous reports for now
      exerciseId: body.exerciseId,
      problemType: body.problemType,
      userComment: body.userComment.trim(),
    });

    // Send confirmation email if user has email
    // For anonymous reports, no email confirmation is sent
    // When user authentication is implemented, email confirmation will be enabled

    return NextResponse.json({
      success: true,
      reportId: report.id,
      message: 'Problem report submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting problem report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}