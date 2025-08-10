#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';

/**
 * Generate a fresh database dump from local tudobem_dev database
 * This ensures we have the latest data for Vercel sync
 */
async function generateFreshDump() {
  console.log('📦 [DUMP] Generating fresh database dump from local database...');
  
  // Connect to local database
  const localDatabaseUrl = process.env.POSTGRES_URL || 'postgresql://yevgenmalafeyev:@localhost:5432/tudobem_dev';
  console.log(`🔗 [DUMP] Connecting to: ${localDatabaseUrl}`);
  
  const pool = new Pool({
    connectionString: localDatabaseUrl,
    ssl: false // Local development doesn't need SSL
  });
  
  const client = await pool.connect();
  
  try {
    console.log('📊 [DUMP] Fetching exercises from local database...');
    
    // Fetch all exercises
    const result = await client.query(`
      SELECT 
        sentence, 
        correct_answer as "correctAnswer",
        topic, 
        level, 
        hint,
        multiple_choice_options as "multipleChoiceOptions",
        explanation_pt,
        explanation_en, 
        explanation_uk,
        difficulty_score as "difficultyScore",
        usage_count as "usageCount",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM exercises 
      ORDER BY level, topic, sentence
    `);
    
    console.log(`📊 [DUMP] Found ${result.rows.length} exercises`);
    
    // Process exercises
    const exercises = result.rows.map(row => ({
      id: null, // Always null for new imports
      sentence: row.sentence,
      correctAnswer: row.correctAnswer,
      topic: row.topic,
      level: row.level,
      hint: row.hint || '',
      multipleChoiceOptions: typeof row.multipleChoiceOptions === 'string' 
        ? JSON.parse(row.multipleChoiceOptions) 
        : row.multipleChoiceOptions,
      explanations: {
        pt: row.explanation_pt || '',
        en: row.explanation_en || '',
        uk: row.explanation_uk || ''
      },
      difficultyScore: row.difficultyScore || 0.6,
      usageCount: row.usageCount || 0,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
    
    // Get statistics
    const levelStats = await client.query(`
      SELECT level, COUNT(*) as count 
      FROM exercises 
      GROUP BY level 
      ORDER BY level
    `);
    
    const topicStats = await client.query(`
      SELECT topic, level, COUNT(*) as count 
      FROM exercises 
      GROUP BY topic, level 
      ORDER BY level, topic
    `);
    
    // Create dump object
    const dump = {
      metadata: {
        source: 'tudobem_dev',
        timestamp: new Date().toISOString(),
        totalExercises: exercises.length,
        levels: levelStats.rows.map(row => ({
          level: row.level,
          count: parseInt(row.count)
        })),
        topics: topicStats.rows.map(row => ({
          topic: row.topic,
          level: row.level,
          count: parseInt(row.count)
        }))
      },
      exercises: exercises
    };
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'database-dumps', 'database-dump.json');
    console.log(`📁 [DUMP] Writing dump to: ${outputPath}`);
    
    // Ensure directory exists
    const dumpDir = path.dirname(outputPath);
    if (!fs.existsSync(dumpDir)) {
      fs.mkdirSync(dumpDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(dump, null, 2));
    
    console.log(`✅ [DUMP] Fresh dump generated successfully!`);
    console.log(`📊 [DUMP] Total exercises: ${exercises.length}`);
    console.log(`📊 [DUMP] Exercises by level:`);
    
    levelStats.rows.forEach(row => {
      console.log(`   - ${row.level}: ${row.count} exercises`);
    });
    
    console.log(`📁 [DUMP] Dump saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ [DUMP] Failed to generate dump:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if executed directly
if (require.main === module) {
  generateFreshDump()
    .then(() => {
      console.log('🎉 [DUMP] Fresh dump generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 [DUMP] Fresh dump generation failed:', error);
      process.exit(1);
    });
}

export { generateFreshDump };