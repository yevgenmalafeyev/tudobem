import { Pool, Client } from 'pg';
import { 
  EnhancedExercise, 
  ExerciseFilter, 
  UsageStats
} from '@/types/enhanced';
import { LanguageLevel } from '@/types';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: false // Local development doesn't need SSL
    });
  }
  return pool;
}

export class LocalDatabase {
  /**
   * Check if database is available
   */
  static isDatabaseAvailable(): boolean {
    return !!process.env.POSTGRES_URL && process.env.DISABLE_DATABASE !== 'true';
  }


  /**
   * Initialize database tables if they don't exist
   */
  static async initializeTables(): Promise<void> {
    if (!this.isDatabaseAvailable()) {
      console.log('⚠️ Database not available - enhanced features will use static fallback');
      return;
    }

    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: false
    });

    try {
      await client.connect();
      
      // Create exercises table
      await client.query(`
        CREATE TABLE IF NOT EXISTS exercises (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sentence TEXT NOT NULL,
          correct_answer TEXT NOT NULL,
          topic VARCHAR(50) NOT NULL,
          level VARCHAR(5) NOT NULL CHECK (level IN ('A1','A2','B1','B2','C1','C2')),
          
          -- Multiple Choice Options (JSON array)
          multiple_choice_options JSONB NOT NULL DEFAULT '[]'::jsonb,
          
          -- Multilingual Explanations
          explanation_pt TEXT,
          explanation_en TEXT, 
          explanation_uk TEXT,
          
          -- Additional Metadata
          hint TEXT,
          difficulty_score FLOAT DEFAULT 0.5,
          usage_count INTEGER DEFAULT 0,
          
          -- Timestamps
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          -- Unique constraint to prevent duplicates
          UNIQUE(sentence, correct_answer, topic, level)
        )
      `);

      // Create indexes for performance
      await client.query(`CREATE INDEX IF NOT EXISTS idx_exercises_level_topic ON exercises(level, topic)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_exercises_usage_count ON exercises(usage_count)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_exercises_created_at ON exercises(created_at DESC)`);

      // Create exercise sessions table for tracking usage
      await client.query(`
        CREATE TABLE IF NOT EXISTS exercise_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_session_id VARCHAR(100) NOT NULL,
          exercise_id UUID NOT NULL,
          answered_correctly BOOLEAN NOT NULL,
          response_time_ms INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Create generation queue table
      await client.query(`
        CREATE TABLE IF NOT EXISTS generation_queue (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_session_id VARCHAR(100) NOT NULL,
          levels JSONB NOT NULL,
          topics JSONB NOT NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
          priority INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          processed_at TIMESTAMP WITH TIME ZONE
        )
      `);

      console.log('✅ Local database tables initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing local database tables:', error);
      throw error;
    } finally {
      await client.end();
    }
  }

  /**
   * Save a batch of exercises to the database
   */
  static async saveExerciseBatch(exercises: EnhancedExercise[]): Promise<string[]> {
    if (!this.isDatabaseAvailable()) {
      console.log('⚠️ Database not available - skipping exercise save');
      return [];
    }

    const pool = getPool();
    const savedIds: string[] = [];

    try {
      for (const exercise of exercises) {
        try {
          const result = await pool.query(`
            INSERT INTO exercises (
              sentence, correct_answer, topic, level,
              multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
              hint, difficulty_score, usage_count
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (sentence, correct_answer, topic, level) 
            DO UPDATE SET 
              multiple_choice_options = EXCLUDED.multiple_choice_options,
              explanation_pt = EXCLUDED.explanation_pt,
              explanation_en = EXCLUDED.explanation_en,
              explanation_uk = EXCLUDED.explanation_uk,
              updated_at = NOW()
            RETURNING id
          `, [
            exercise.sentence,
            exercise.correctAnswer,
            exercise.topic,
            exercise.level,
            JSON.stringify(exercise.multipleChoiceOptions),
            exercise.explanations.pt,
            exercise.explanations.en,
            exercise.explanations.uk,
            exercise.hint || null,
            exercise.difficultyScore || 0.5,
            exercise.usageCount || 0
          ]);

          if (result.rows.length > 0) {
            savedIds.push(result.rows[0].id);
          }
        } catch (exerciseError) {
          console.error(`Error saving exercise: ${exercise.sentence}`, exerciseError);
          // Continue with other exercises even if one fails
        }
      }

      console.log(`✅ Saved ${savedIds.length}/${exercises.length} exercises to local database`);
      return savedIds;
    } catch (error) {
      console.error('❌ Error saving exercise batch to local database:', error);
      throw error;
    }
  }

  /**
   * Get exercises by level and topic with filtering
   */
  static async getExercises(filter: ExerciseFilter): Promise<EnhancedExercise[]> {
    if (!this.isDatabaseAvailable()) {
      console.log('⚠️ Database not available - returning empty array');
      return [];
    }

    const pool = getPool();

    try {
      let query = `
        SELECT 
          id, sentence, correct_answer, topic, level,
          multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
          hint, difficulty_score, usage_count,
          created_at, updated_at
        FROM exercises
        WHERE 1=1
      `;

      const params: (string | number | string[])[] = [];
      let paramIndex = 1;

      // Add level filter
      if (filter.levels && filter.levels.length > 0) {
        query += ` AND level = ANY($${paramIndex})`;
        params.push(filter.levels);
        paramIndex++;
      }

      // Add topic filter
      if (filter.topics && filter.topics.length > 0) {
        query += ` AND topic = ANY($${paramIndex})`;
        params.push(filter.topics);
        paramIndex++;
      }


      // Exclude specific exercise IDs (for user-specific filtering)
      if (filter.excludeExerciseIds && filter.excludeExerciseIds.length > 0) {
        query += ` AND id != ALL($${paramIndex})`;
        params.push(filter.excludeExerciseIds);
        paramIndex++;
      }

      // User-specific filtering: exclude exercises the user has answered correctly
      if (filter.userId) {
        query += ` AND id NOT IN (
          SELECT DISTINCT exercise_id 
          FROM user_exercise_attempts 
          WHERE user_id = $${paramIndex} AND is_correct = true
        )`;
        params.push(filter.userId);
        paramIndex++;
      } else if (filter.sessionId) {
        // Session-specific filtering for anonymous users: exclude exercises they've answered correctly in this session
        query += ` AND id NOT IN (
          SELECT DISTINCT exercise_id 
          FROM exercise_sessions 
          WHERE user_session_id = $${paramIndex} AND answered_correctly = true
        )`;
        params.push(filter.sessionId);
        paramIndex++;
      }

      // Order by usage count (least used first) and creation date
      query += ` ORDER BY usage_count ASC, created_at DESC`;

      // Add limit
      if (filter.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filter.limit);
      }

      const result = await pool.query(query, params);

      return result.rows.map(row => ({
        id: row.id,
        sentence: row.sentence,
        correctAnswer: row.correct_answer,
        topic: row.topic,
        level: row.level as LanguageLevel,
        multipleChoiceOptions: row.multiple_choice_options,
        explanations: {
          pt: row.explanation_pt,
          en: row.explanation_en,
          uk: row.explanation_uk
        },
        hint: row.hint,
        difficultyScore: row.difficulty_score,
        usageCount: row.usage_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('❌ Error getting exercises from local database:', error);
      throw error;
    }
  }

  /**
   * Mark an exercise as used and track session
   */
  static async markExerciseUsed(
    exerciseId: string, 
    sessionId: string, 
    answeredCorrectly: boolean,
    responseTimeMs?: number
  ): Promise<void> {
    if (!this.isDatabaseAvailable()) {
      return;
    }

    const pool = getPool();

    try {
      // Update usage count
      await pool.query(`
        UPDATE exercises 
        SET usage_count = usage_count + 1, updated_at = NOW()
        WHERE id = $1
      `, [exerciseId]);

      // Record session
      await pool.query(`
        INSERT INTO exercise_sessions (
          user_session_id, exercise_id, answered_correctly, response_time_ms
        ) VALUES ($1, $2, $3, $4)
      `, [sessionId, exerciseId, answeredCorrectly, responseTimeMs || null]);
    } catch (error) {
      console.error('❌ Error marking exercise as used in local database:', error);
      throw error;
    }
  }

  /**
   * Get exercise usage statistics
   */
  static async getUsageStats(): Promise<UsageStats> {
    if (!this.isDatabaseAvailable()) {
      throw new Error('Database not available');
    }

    const pool = getPool();

    try {
      const totalResult = await pool.query(`SELECT COUNT(*) as total FROM exercises`);
      const levelResult = await pool.query(`
        SELECT level, COUNT(*) as count 
        FROM exercises 
        GROUP BY level
      `);
      const topicResult = await pool.query(`
        SELECT topic, COUNT(*) as count 
        FROM exercises 
        GROUP BY topic
      `);
      const avgUsageResult = await pool.query(`
        SELECT AVG(usage_count) as avg_usage 
        FROM exercises
      `);

      const exercisesByLevel: Record<LanguageLevel, number> = {
        A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0
      };
      levelResult.rows.forEach(row => {
        exercisesByLevel[row.level as LanguageLevel] = parseInt(row.count);
      });

      const exercisesByTopic: Record<string, number> = {};
      topicResult.rows.forEach(row => {
        exercisesByTopic[row.topic] = parseInt(row.count);
      });

      return {
        totalExercises: parseInt(totalResult.rows[0].total),
        exercisesByLevel,
        exercisesByTopic,
        averageUsageCount: parseFloat(avgUsageResult.rows[0].avg_usage || '0')
      };
    } catch (error) {
      console.error('❌ Error getting usage stats from local database:', error);
      throw error;
    }
  }

  /**
   * Update exercise hint data
   */
  static async updateExerciseHint(exerciseId: string, hintText: string): Promise<void> {
    if (!this.isDatabaseAvailable()) {
      console.log('⚠️ Database not available - cannot update hint');
      return;
    }

    const pool = getPool();

    try {
      await pool.query(
        `UPDATE exercises 
         SET hint = $1, updated_at = NOW() 
         WHERE id = $2`,
        [hintText, exerciseId]
      );
    } catch (error) {
      console.error('❌ Error updating exercise hint:', error);
      throw error;
    }
  }

  /**
   * Add a single exercise to the database
   */
  static async addExercise(exercise: EnhancedExercise): Promise<void> {
    if (!this.isDatabaseAvailable()) {
      console.log('⚠️ Database not available - cannot add exercise');
      return;
    }

    const pool = getPool();

    try {
      await pool.query(
        `INSERT INTO exercises (
          id, sentence, correct_answer, topic, level,
          multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
          hint, difficulty_score, usage_count, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          exercise.id,
          exercise.sentence,
          exercise.correctAnswer,
          exercise.topic,
          exercise.level,
          JSON.stringify(exercise.multipleChoiceOptions || []),
          exercise.explanations?.pt || null,
          exercise.explanations?.en || null,
          exercise.explanations?.uk || null,
          exercise.hint || null,
          exercise.difficultyScore || 0.5,
          exercise.usageCount || 0,
          exercise.createdAt || new Date().toISOString(),
          exercise.updatedAt || new Date().toISOString()
        ]
      );
    } catch (error) {
      console.error('❌ Error adding exercise:', error);
      throw error;
    }
  }

  /**
   * Clear all exercises from database (for production reset)
   */
  static async clearAllExercises(): Promise<void> {
    if (!this.isDatabaseAvailable()) {
      console.log('⚠️ Database not available - cannot clear exercises');
      return;
    }

    const pool = getPool();

    try {
      // Delete in order to respect foreign key constraints
      await pool.query('DELETE FROM exercise_sessions');
      await pool.query('DELETE FROM generation_queue');
      await pool.query('DELETE FROM exercises');
      
      console.log('🧹 All exercises cleared from database');
    } catch (error) {
      console.error('❌ Error clearing exercises:', error);
      throw error;
    }
  }
}