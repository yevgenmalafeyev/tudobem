import { NextRequest, NextResponse } from 'next/server';
import { UserDatabase } from '@/lib/userDatabase';

// GET /api/admin/users/[id] - Get detailed user statistics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Validate user ID format (basic UUID check)
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Get detailed user statistics
    const userStats = await UserDatabase.getDetailedUserStats(userId);

    if (!userStats) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive information from response
    const { user, stats, levelAccuracies, recentSessions } = userStats;
    const sanitizedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      last_login: user.last_login,
      is_active: user.is_active,
      email_verified: user.email_verified,
      app_language: user.app_language,
      explanation_language: user.explanation_language,
      learning_mode: user.learning_mode,
      oauth_provider: user.oauth_provider
    };

    return NextResponse.json({
      success: true,
      data: {
        user: sanitizedUser,
        stats,
        levelAccuracies,
        recentSessions
      }
    });

  } catch (error) {
    console.error('Error fetching detailed user stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}