import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

export async function POST() {
  const startTime = Date.now();
  console.log('🚀 Auto-initializing database on first deployment...');
  
  try {
    // Check if we have a database connection (use DATABASE_URL to avoid Vercel secret reference issues)
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured'
      }, { status: 500 });
    }

    const pool = new Pool({
      connectionString: dbUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Check if database is already initialized
    console.log('🔍 Checking if database is already initialized...');
    try {
      const existingData = await pool.query('SELECT COUNT(*) FROM exercises');
      const count = parseInt(existingData.rows[0].count);
      
      if (count > 100) {
        console.log(`✅ Database already has ${count} exercises, skipping initialization`);
        await pool.end();
        return NextResponse.json({
          success: true,
          message: 'Database already initialized',
          existingExercises: count,
          timestamp: new Date().toISOString()
        });
      }
    } catch {
      console.log('📋 Database not initialized yet, proceeding with setup...');
    }

    // Initialize tables
    console.log('🔧 Creating database tables...');
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_config (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        claude_api_key TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('🔧 Creating indexes...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_exercises_level ON exercises(level);
      CREATE INDEX IF NOT EXISTS idx_exercises_topic ON exercises(topic);
      CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty_score);
    `);

    // Clear existing data (in case of partial initialization)
    console.log('🧹 Clearing any existing data...');
    await pool.query('DELETE FROM exercises');
    await pool.query('DELETE FROM admin_config');

    // Load and execute database dump
    console.log('📦 Loading production database dump...');
    const dumpPath = path.join(process.cwd(), 'database-complete-backup.sql');
    
    if (!fs.existsSync(dumpPath)) {
      console.error('❌ Database dump file not found at:', dumpPath);
      await pool.end();
      return NextResponse.json({
        success: false,
        error: 'Database dump file not found'
      }, { status: 500 });
    }

    console.log('📊 Executing database dump...');
    const dumpContent = fs.readFileSync(dumpPath, 'utf8');
    
    // Replace API key placeholders with actual environment values
    const processedDump = dumpContent.replace(
      /YOUR_ANTHROPIC_API_KEY_HERE/g,
      process.env.ANTHROPIC_API_KEY || 'YOUR_ANTHROPIC_API_KEY_HERE'
    );

    // Parse dump file and handle COPY commands properly
    console.log('📝 Parsing database dump file...');
    
    const lines = processedDump.split('\n');
    let currentTable = '';
    let copyMode = false;
    let copyColumns: string[] = [];
    let copyData: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip comments, SET statements, and other PostgreSQL-specific commands
      if (trimmedLine.startsWith('--') || 
          trimmedLine.startsWith('SET') || 
          trimmedLine.startsWith('SELECT pg_catalog') || 
          trimmedLine.length === 0) {
        continue;
      }
      
      // Handle COPY command start
      if (trimmedLine.startsWith('COPY public.')) {
        copyMode = true;
        const match = trimmedLine.match(/COPY public\.(\w+) \((.*?)\) FROM stdin/);
        if (match) {
          currentTable = match[1];
          copyColumns = match[2].split(',').map(col => col.trim());
          copyData = [];
          console.log(`📊 Processing COPY data for table: ${currentTable}`);
        }
        continue;
      }
      
      // Handle COPY command end
      if (trimmedLine === '\\.') {
        if (copyMode && currentTable && copyData.length > 0) {
          // Convert COPY data to INSERT statements
          console.log(`📝 Converting ${copyData.length} COPY rows to INSERT statements for ${currentTable}`);
          
          for (const dataRow of copyData) {
            const values = dataRow.split('\t');
            if (values.length === copyColumns.length) {
              // Create parameterized insert
              const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
              const insertSQL = `INSERT INTO ${currentTable} (${copyColumns.join(', ')}) VALUES (${placeholders})`;
              
              // Convert values, handle NULL markers and quoted strings
              const processedValues = values.map(val => {
                if (val === '\\N') return null;
                // Remove quotes from quoted values (like UUIDs)
                if (val.startsWith('"') && val.endsWith('"')) {
                  return val.slice(1, -1);
                }
                return val;
              });
              
              try {
                await pool.query(insertSQL, processedValues);
              } catch (error) {
                console.error(`❌ Failed to insert data into ${currentTable}:`, error);
                // Continue with other data, don't fail completely
              }
            }
          }
        }
        copyMode = false;
        currentTable = '';
        copyData = [];
        continue;
      }
      
      // Collect COPY data
      if (copyMode) {
        copyData.push(trimmedLine);
        continue;
      }
      
      // Handle regular SQL statements
      if (trimmedLine.endsWith(';') && !copyMode) {
        try {
          await pool.query(trimmedLine);
        } catch (error) {
          console.error(`❌ Failed to execute SQL: ${trimmedLine.substring(0, 100)}...`, error);
          // Continue with other statements, don't fail completely
        }
      }
    }
    
    console.log('✅ Database dump processing completed');

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

    console.log('✅ Auto-initialization completed successfully!');
    console.log('📈 Final statistics:');
    console.log(`   Total exercises: ${stats.total}`);
    console.log(`   By level: A1:${stats.a1_count}, A2:${stats.a2_count}, B1:${stats.b1_count}, B2:${stats.b2_count}, C1:${stats.c1_count}, C2:${stats.c2_count}`);

    await pool.end();

    return NextResponse.json({
      success: true,
      message: 'Database auto-initialized successfully with production data',
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
    console.error('❌ Auto-initialization failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({
    message: 'Auto-init endpoint available. POST to initialize database.',
    timestamp: new Date().toISOString()
  });
}