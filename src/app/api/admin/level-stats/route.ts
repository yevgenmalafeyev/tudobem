import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET() {
  try {
    // Get level statistics
    const levelStatsQuery = `
      WITH level_questions AS (
        SELECT 
          level,
          COUNT(*) as total_questions
        FROM exercises 
        GROUP BY level
      ),
      user_level_progress AS (
        SELECT 
          u.id as user_id,
          e.level,
          COUNT(DISTINCT e.id) as total_level_questions,
          COUNT(DISTINCT CASE WHEN uea.is_correct = true THEN e.id END) as correct_questions
        FROM users u
        CROSS JOIN (SELECT DISTINCT level FROM exercises) levels(level)
        LEFT JOIN exercises e ON e.level = levels.level
        LEFT JOIN user_exercise_attempts uea ON uea.user_id = u.id AND uea.exercise_id = e.id
        WHERE u.is_active = true
        GROUP BY u.id, e.level
      ),
      user_completion_stats AS (
        SELECT 
          level,
          COUNT(CASE WHEN (correct_questions::float / NULLIF(total_level_questions, 0)) >= 0.5 THEN 1 END) as users_50_percent,
          COUNT(CASE WHEN (correct_questions::float / NULLIF(total_level_questions, 0)) >= 0.75 THEN 1 END) as users_75_percent,
          COUNT(CASE WHEN (correct_questions::float / NULLIF(total_level_questions, 0)) >= 0.9 THEN 1 END) as users_90_percent,
          COUNT(CASE WHEN correct_questions = total_level_questions AND total_level_questions > 0 THEN 1 END) as users_complete
        FROM user_level_progress
        GROUP BY level
      )
      SELECT 
        lq.level,
        lq.total_questions,
        COALESCE(ucs.users_50_percent, 0) as users_50_percent,
        COALESCE(ucs.users_75_percent, 0) as users_75_percent,
        COALESCE(ucs.users_90_percent, 0) as users_90_percent,
        COALESCE(ucs.users_complete, 0) as users_complete
      FROM level_questions lq
      LEFT JOIN user_completion_stats ucs ON lq.level = ucs.level
      ORDER BY 
        CASE lq.level 
          WHEN 'A1' THEN 1 
          WHEN 'A2' THEN 2 
          WHEN 'B1' THEN 3 
          WHEN 'B2' THEN 4 
          WHEN 'C1' THEN 5 
          WHEN 'C2' THEN 6 
          ELSE 7 
        END;
    `;

    const result = await pool.query(levelStatsQuery);
    
    const levelStats = result.rows.map(row => ({
      level: row.level,
      totalQuestions: parseInt(row.total_questions),
      users50Percent: parseInt(row.users_50_percent),
      users75Percent: parseInt(row.users_75_percent),
      users90Percent: parseInt(row.users_90_percent),
      usersComplete: parseInt(row.users_complete)
    }));

    return NextResponse.json({
      success: true,
      levelStats
    });

  } catch (error) {
    console.error('Error fetching level statistics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch level statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}