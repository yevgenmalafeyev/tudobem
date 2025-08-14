import { sql } from './database-adapter';
import { 
  EnhancedExercise, 
  ExerciseFilter, 
  UsageStats, 
  GenerationQueueRecord 
} from '@/types/enhanced';
import { LanguageLevel } from '@/types';

interface ExerciseRow {
  id: string;
  sentence: string;
  correct_answer: string;
  topic: string;
  level: string;
  multiple_choice_options: string[];
  explanation_pt: string;
  explanation_en: string;
  explanation_uk: string;
  hint: Record<string, unknown>;
  difficulty_score: number;
  usage_count: number;
  created_at: Date;
  updated_at: Date;
}

export class ExerciseDatabase {
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

    try {
      // Create exercises table
      await sql`
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
          hint JSONB DEFAULT '{}'::jsonb,
          difficulty_score FLOAT DEFAULT 0.5,
          usage_count INTEGER DEFAULT 0,
          
          -- Timestamps
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          -- Unique constraint to prevent duplicates
          UNIQUE(sentence, correct_answer, topic, level)
        )
      `;

      // Create indexes for performance
      await sql`CREATE INDEX IF NOT EXISTS idx_exercises_level_topic ON exercises(level, topic)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_exercises_usage_count ON exercises(usage_count)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_exercises_created_at ON exercises(created_at DESC)`;

      // Create exercise sessions table for tracking usage
      await sql`
        CREATE TABLE IF NOT EXISTS exercise_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_session_id VARCHAR(100) NOT NULL,
          exercise_id UUID NOT NULL,
          answered_correctly BOOLEAN NOT NULL,
          response_time_ms INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;

      // Create generation queue table
      await sql`
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
      `;

      console.log('Database tables initialized successfully');
    } catch (error) {
      console.error('Error initializing database tables:', error);
      throw error;
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

    try {
      const savedIds: string[] = [];

      for (const exercise of exercises) {
        try {
          const result = await sql`
            INSERT INTO exercises (
              sentence, correct_answer, topic, level,
              multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
              hint, difficulty_score, usage_count
            ) VALUES (
              ${exercise.sentence},
              ${exercise.correctAnswer},
              ${exercise.topic},
              ${exercise.level},
              ${JSON.stringify(exercise.multipleChoiceOptions)},
              ${exercise.explanations.pt},
              ${exercise.explanations.en},
              ${exercise.explanations.uk},
              ${JSON.stringify(exercise.hint || {})},
              ${exercise.difficultyScore || 0.5},
              ${exercise.usageCount || 0}
            )
            ON CONFLICT (sentence, correct_answer, topic, level) 
            DO UPDATE SET 
              multiple_choice_options = EXCLUDED.multiple_choice_options,
              explanation_pt = EXCLUDED.explanation_pt,
              explanation_en = EXCLUDED.explanation_en,
              explanation_uk = EXCLUDED.explanation_uk,
              updated_at = NOW()
            RETURNING id
          `;

          if (result.rows.length > 0) {
            savedIds.push(String(result.rows[0].id));
          }
        } catch (exerciseError) {
          console.error(`Error saving exercise: ${exercise.sentence}`, exerciseError);
          // Continue with other exercises even if one fails
        }
      }

      console.log(`Saved ${savedIds.length}/${exercises.length} exercises to database`);
      return savedIds;
    } catch (error) {
      console.error('Error saving exercise batch:', error);
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

    try {
      // Build conditions dynamically but use template literals
      let result;
      
      if (filter.levels && filter.levels.length > 0 && filter.topics && filter.topics.length > 0 && filter.limit) {
        // Most common case: levels, topics, and limit
        result = await sql`
          SELECT 
            id, sentence, correct_answer, topic, level,
            multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
            hint, difficulty_score, usage_count,
            created_at, updated_at
          FROM exercises
          WHERE level = ANY(${filter.levels}) 
            AND topic = ANY(${filter.topics})
          ORDER BY usage_count ASC, created_at DESC
          LIMIT ${filter.limit}
        `;
      } else if (filter.levels && filter.levels.length > 0 && filter.limit) {
        // Levels and limit only
        result = await sql`
          SELECT 
            id, sentence, correct_answer, topic, level,
            multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
            hint, difficulty_score, usage_count,
            created_at, updated_at
          FROM exercises
          WHERE level = ANY(${filter.levels})
          ORDER BY usage_count ASC, created_at DESC
          LIMIT ${filter.limit}
        `;
      } else if (filter.topics && filter.topics.length > 0 && filter.limit) {
        // Topics and limit only
        result = await sql`
          SELECT 
            id, sentence, correct_answer, topic, level,
            multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
            hint, difficulty_score, usage_count,
            created_at, updated_at
          FROM exercises
          WHERE topic = ANY(${filter.topics})
          ORDER BY usage_count ASC, created_at DESC
          LIMIT ${filter.limit}
        `;
      } else if (filter.limit) {
        // Limit only
        result = await sql`
          SELECT 
            id, sentence, correct_answer, topic, level,
            multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
            hint, difficulty_score, usage_count,
            created_at, updated_at
          FROM exercises
          ORDER BY usage_count ASC, created_at DESC
          LIMIT ${filter.limit}
        `;
      } else {
        // No filters
        result = await sql`
          SELECT 
            id, sentence, correct_answer, topic, level,
            multiple_choice_options, explanation_pt, explanation_en, explanation_uk,
            hint, difficulty_score, usage_count,
            created_at, updated_at
          FROM exercises
          ORDER BY usage_count ASC, created_at DESC
        `;
      }

      return (result.rows as unknown as ExerciseRow[]).map((row: ExerciseRow) => ({
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
        hint: typeof row.hint === 'string' ? row.hint : JSON.stringify(row.hint),
        difficultyScore: row.difficulty_score,
        usageCount: row.usage_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error getting exercises:', error);
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
    try {
      // Update usage count
      await sql`
        UPDATE exercises 
        SET usage_count = usage_count + 1, updated_at = NOW()
        WHERE id = ${exerciseId}
      `;

      // Record session
      await sql`
        INSERT INTO exercise_sessions (
          user_session_id, exercise_id, answered_correctly, response_time_ms
        ) VALUES (
          ${sessionId}, ${exerciseId}, ${answeredCorrectly}, ${responseTimeMs || null}
        )
      `;
    } catch (error) {
      console.error('Error marking exercise as used:', error);
      throw error;
    }
  }

  /**
   * Get exercise usage statistics
   */
  static async getUsageStats(): Promise<UsageStats> {
    try {
      const totalResult = await sql`SELECT COUNT(*) as total FROM exercises`;
      const levelResult = await sql`
        SELECT level, COUNT(*) as count 
        FROM exercises 
        GROUP BY level
      `;
      const topicResult = await sql`
        SELECT topic, COUNT(*) as count 
        FROM exercises 
        GROUP BY topic
      `;
      const avgUsageResult = await sql`
        SELECT AVG(usage_count) as avg_usage 
        FROM exercises
      `;

      const exercisesByLevel: Record<LanguageLevel, number> = {
        A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0
      };
      levelResult.rows.forEach(row => {
        exercisesByLevel[row.level as LanguageLevel] = parseInt(String(row.count));
      });

      const exercisesByTopic: Record<string, number> = {};
      topicResult.rows.forEach(row => {
        exercisesByTopic[String(row.topic)] = parseInt(String(row.count));
      });

      return {
        totalExercises: parseInt(String(totalResult.rows[0].total)),
        exercisesByLevel,
        exercisesByTopic,
        averageUsageCount: parseFloat(String(avgUsageResult.rows[0].avg_usage || '0'))
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      throw error;
    }
  }

  /**
   * Add generation request to queue
   */
  static async addToGenerationQueue(
    userSessionId: string,
    levels: LanguageLevel[],
    topics: string[],
    priority: number = 0
  ): Promise<string> {
    try {
      const result = await sql`
        INSERT INTO generation_queue (
          user_session_id, levels, topics, priority
        ) VALUES (
          ${userSessionId}, 
          ${JSON.stringify(levels)}, 
          ${JSON.stringify(topics)}, 
          ${priority}
        )
        RETURNING id
      `;

      return String(result.rows[0].id);
    } catch (error) {
      console.error('Error adding to generation queue:', error);
      throw error;
    }
  }

  /**
   * Get pending generation queue items
   */
  static async getPendingQueueItems(): Promise<GenerationQueueRecord[]> {
    try {
      const result = await sql`
        SELECT id, user_session_id, levels, topics, status, priority, created_at, processed_at
        FROM generation_queue
        WHERE status = 'pending'
        ORDER BY priority DESC, created_at ASC
      `;

      return result.rows.map(row => ({
        id: String(row.id),
        userSessionId: String(row.user_session_id),
        levels: row.levels as LanguageLevel[],
        topics: row.topics as string[],
        status: String(row.status) as 'pending' | 'processing' | 'completed' | 'failed',
        priority: Number(row.priority),
        createdAt: row.created_at as Date,
        processedAt: row.processed_at ? row.processed_at as Date : undefined
      }));
    } catch (error) {
      console.error('Error getting pending queue items:', error);
      throw error;
    }
  }

  /**
   * Update queue item status
   */
  static async updateQueueItemStatus(
    queueId: string, 
    status: 'processing' | 'completed' | 'failed'
  ): Promise<void> {
    try {
      await sql`
        UPDATE generation_queue
        SET status = ${status}, processed_at = NOW()
        WHERE id = ${queueId}
      `;
    } catch (error) {
      console.error('Error updating queue item status:', error);
      throw error;
    }
  }
}