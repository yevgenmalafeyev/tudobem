import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Interface for exercise structure (for reference)
// interface Exercise {
//   sentence: string;
//   correctAnswer: string;
//   topic: string;
//   level: string;
//   hint?: string;
//   multipleChoiceOptions?: string[];
//   explanations?: {
//     pt?: string;
//     en?: string;
//     uk?: string;
//   };
//   difficultyScore?: number;
//   usageCount?: number;
// }

export async function POST() {
  const startTime = Date.now();
  console.log('🔄 Starting database sync from local dump...');
  
  try {
    // Check if we have a database connection (use DATABASE_URL to avoid Vercel secret reference issues)
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not configured'
      }, { status: 500 });
    }

    const pool = new Pool({
      connectionString: dbUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Initialize tables first
    console.log('🔧 Initializing database tables...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id SERIAL PRIMARY KEY,
        sentence TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        topic TEXT NOT NULL,
        level TEXT NOT NULL,
        hint TEXT,
        multiple_choice_options TEXT[],
        explanations JSONB DEFAULT '{}',
        difficulty_score INTEGER DEFAULT 1,
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('🔧 Creating indexes...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_exercises_level ON exercises(level);
      CREATE INDEX IF NOT EXISTS idx_exercises_topic ON exercises(topic);
      CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty_score);
    `);

    // Load and parse database dump
    console.log('📦 Loading database dump...');
    const dumpPath = path.join(process.cwd(), 'database-complete-backup.sql');
    
    if (!fs.existsSync(dumpPath)) {
      return NextResponse.json({
        success: false,
        error: 'Database dump file not found'
      }, { status: 500 });
    }

    // Clear existing exercises
    console.log('🧹 Clearing existing exercises...');
    await pool.query('DELETE FROM exercises');

    // Execute the SQL dump
    console.log('📊 Executing database dump...');
    const dumpContent = fs.readFileSync(dumpPath, 'utf8');
    
    // Replace API key placeholders with actual values
    const processedDump = dumpContent.replace(
      /YOUR_ANTHROPIC_API_KEY_HERE/g,
      process.env.ANTHROPIC_API_KEY || 'YOUR_ANTHROPIC_API_KEY_HERE'
    );

    // Execute the dump (this will restore all tables and data)
    await pool.query(processedDump);

    // Get final statistics
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE level = 'A1') as a1_count,
        COUNT(*) FILTER (WHERE level = 'A2') as a2_count,
        COUNT(*) FILTER (WHERE level = 'B1') as b1_count,
        COUNT(*) FILTER (WHERE level = 'B2') as b2_count,
        COUNT(*) FILTER (WHERE level = 'C1') as c1_count,
        COUNT(*) FILTER (WHERE level = 'C2') as c2_count
      FROM exercises
    `);

    const stats = result.rows[0];
    const totalTime = Date.now() - startTime;

    console.log('✅ Database sync completed successfully!');
    console.log('📈 Final statistics:');
    console.log(`   Total exercises: ${stats.total}`);
    console.log(`   By level: A1:${stats.a1_count}, A2:${stats.a2_count}, B1:${stats.b1_count}, B2:${stats.b2_count}, C1:${stats.c1_count}, C2:${stats.c2_count}`);

    await pool.end();

    return NextResponse.json({
      success: true,
      message: 'Database synchronized successfully from local dump',
      stats: {
        totalExercises: parseInt(stats.total),
        byLevel: {
          A1: parseInt(stats.a1_count),
          A2: parseInt(stats.a2_count),
          B1: parseInt(stats.b1_count),
          B2: parseInt(stats.b2_count),
          C1: parseInt(stats.c1_count),
          C2: parseInt(stats.c2_count)
        }
      },
      responseTime: totalTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Database sync failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}