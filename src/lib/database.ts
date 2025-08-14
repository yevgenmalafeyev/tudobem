import { sql } from './database-adapter';
import { LanguageLevel } from '@/types';

export interface DatabaseExercise {
  id: string;
  sentence: string;
  correct_answer: string;
  topic: string;
  level: LanguageLevel;
  hint?: string;  // Changed to single text field
  multiple_choice_options: string[];
  explanation_pt: string;
  explanation_en: string;
  explanation_uk: string;
  created_at: Date;
}

export class ExerciseDatabase {
  // Initialize database tables
  static async initializeTables() {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS exercises (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sentence TEXT NOT NULL,
          correct_answer TEXT NOT NULL,
          topic VARCHAR(100) NOT NULL,
          level VARCHAR(10) NOT NULL,
          hint TEXT,  -- Single text field for flexible hints
          multiple_choice_options TEXT[] NOT NULL,
          explanation_pt TEXT NOT NULL,
          explanation_en TEXT NOT NULL,
          explanation_uk TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create indexes for better performance
      await sql`
        CREATE INDEX IF NOT EXISTS idx_exercises_level ON exercises(level)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_exercises_topic ON exercises(topic)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_exercises_level_topic ON exercises(level, topic)
      `;

      console.log('Database tables initialized successfully');
    } catch (error) {
      console.error('Error initializing database tables:', error);
      throw error;
    }
  }

  // Save a batch of exercises to the database
  static async saveBatchExercises(exercises: {
    sentence: string;
    correctAnswer: string;
    topic: string;
    level: string;
    hint?: string | { infinitive?: string; person?: string; form?: string };  // Accept both formats
    multipleChoiceOptions?: string[];
    explanations?: { pt: string; en: string; uk: string };
  }[]) {
    try {
      const savedExercises = [];
      
      for (const exercise of exercises) {
        // Convert hint to string format if it's an object
        let hintText: string | null = null;
        if (exercise.hint) {
          if (typeof exercise.hint === 'string') {
            hintText = exercise.hint;
          } else {
            // Convert object format to string
            const { infinitive, person, form } = exercise.hint;
            if (infinitive && person) {
              hintText = `${infinitive} (${person})`;
            } else if (infinitive && form) {
              hintText = `${infinitive} (${form})`;
            } else if (infinitive) {
              hintText = infinitive;
            } else if (person) {
              hintText = `(${person})`;
            } else if (form) {
              hintText = `(${form})`;
            }
          }
        }
        
        const result = await sql`
          INSERT INTO exercises (
            sentence, correct_answer, topic, level,
            hint,
            multiple_choice_options, explanation_pt, explanation_en, explanation_uk
          ) VALUES (
            ${exercise.sentence},
            ${exercise.correctAnswer},
            ${exercise.topic},
            ${exercise.level},
            ${hintText},
            ${JSON.stringify(exercise.multipleChoiceOptions || [])},
            ${exercise.explanations?.pt || ''},
            ${exercise.explanations?.en || ''},
            ${exercise.explanations?.uk || ''}
          )
          RETURNING *
        `;
        
        if (result.rows.length > 0) {
          savedExercises.push(result.rows[0]);
        }
      }
      
      console.log(`Saved ${savedExercises.length} exercises to database`);
      return savedExercises;
    } catch (error) {
      console.error('Error saving batch exercises:', error);
      throw error;
    }
  }

  // Get random exercises from database for fallback
  static async getRandomExercises(levels: LanguageLevel[], topics: string[], limit: number = 10) {
    try {
      const result = await sql`
        SELECT * FROM exercises 
        WHERE level = ANY(${JSON.stringify(levels)}) 
        AND topic = ANY(${JSON.stringify(topics)})
        ORDER BY RANDOM()
        LIMIT ${limit}
      `;
      
      return result.rows.map(row => ({
        id: row.id,
        sentence: row.sentence,
        correctAnswer: row.correct_answer,
        topic: row.topic,
        level: row.level as LanguageLevel,
        hint: row.hint || undefined,  // Now just a string
        multipleChoiceOptions: row.multiple_choice_options || [],
        detailedExplanation: {
          pt: row.explanation_pt,
          en: row.explanation_en,
          uk: row.explanation_uk
        }
      }));
    } catch (error) {
      console.error('Error getting random exercises:', error);
      throw error;
    }
  }

  // Get exercises by level only (when no topics specified)
  static async getRandomExercisesByLevel(levels: LanguageLevel[], limit: number = 10) {
    try {
      const result = await sql`
        SELECT * FROM exercises 
        WHERE level = ANY(${JSON.stringify(levels)})
        ORDER BY RANDOM()
        LIMIT ${limit}
      `;
      
      return result.rows.map(row => ({
        id: row.id,
        sentence: row.sentence,
        correctAnswer: row.correct_answer,
        topic: row.topic,
        level: row.level as LanguageLevel,
        hint: row.hint || undefined,  // Now just a string
        multipleChoiceOptions: row.multiple_choice_options || [],
        detailedExplanation: {
          pt: row.explanation_pt,
          en: row.explanation_en,
          uk: row.explanation_uk
        }
      }));
    } catch (error) {
      console.error('Error getting random exercises by level:', error);
      throw error;
    }
  }

  // Get database statistics
  static async getStats() {
    try {
      const totalResult = await sql`SELECT COUNT(*) as total FROM exercises`;
      const levelResult = await sql`
        SELECT level, COUNT(*) as count 
        FROM exercises 
        GROUP BY level 
        ORDER BY level
      `;
      const topicResult = await sql`
        SELECT topic, COUNT(*) as count 
        FROM exercises 
        GROUP BY topic 
        ORDER BY count DESC
      `;

      return {
        total: totalResult.rows[0].total,
        byLevel: levelResult.rows,
        byTopic: topicResult.rows
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw error;
    }
  }

  // Check if exercise already exists (to avoid duplicates)
  static async exerciseExists(sentence: string, correctAnswer: string, topic: string, level: string) {
    try {
      const result = await sql`
        SELECT COUNT(*) as count 
        FROM exercises 
        WHERE sentence = ${sentence} 
        AND correct_answer = ${correctAnswer}
        AND topic = ${topic}
        AND level = ${level}
      `;
      
      return Number(result.rows[0].count) > 0;
    } catch (error) {
      console.error('Error checking exercise existence:', error);
      return false;
    }
  }
}

// Analytics database class for tracking user behavior
export class AnalyticsDatabase {
  // Initialize analytics tables
  static async initializeAnalyticsTables() {
    try {
      // User sessions table
      await sql`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id TEXT NOT NULL UNIQUE,
          user_agent TEXT,
          ip_address TEXT,
          country TEXT,
          platform TEXT,
          browser TEXT,
          device_type TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // User activity table
      await sql`
        CREATE TABLE IF NOT EXISTS user_activities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id TEXT NOT NULL,
          activity_type TEXT NOT NULL,
          exercise_id UUID,
          question_level VARCHAR(10),
          question_topic VARCHAR(100),
          user_answer TEXT,
          correct_answer TEXT,
          is_correct BOOLEAN,
          response_time_ms INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create indexes for better performance
      await sql`
        CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_user_activities_session_id ON user_activities(session_id)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_user_activities_level ON user_activities(question_level)
      `;
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_user_activities_topic ON user_activities(question_topic)
      `;

      console.log('Analytics tables initialized successfully');
    } catch (error) {
      console.error('Error initializing analytics tables:', error);
      throw error;
    }
  }

  // Create or update user session
  static async createOrUpdateSession(sessionData: {
    sessionId: string;
    userAgent?: string;
    ipAddress?: string;
    country?: string;
    platform?: string;
    browser?: string;
    deviceType?: string;
  }) {
    try {
      const result = await sql`
        INSERT INTO user_sessions (
          session_id, user_agent, ip_address, country, platform, browser, device_type
        ) VALUES (
          ${sessionData.sessionId},
          ${sessionData.userAgent || null},
          ${sessionData.ipAddress || null},
          ${sessionData.country || null},
          ${sessionData.platform || null},
          ${sessionData.browser || null},
          ${sessionData.deviceType || null}
        )
        ON CONFLICT (session_id) DO UPDATE SET
          last_activity = CURRENT_TIMESTAMP,
          user_agent = EXCLUDED.user_agent,
          ip_address = EXCLUDED.ip_address,
          country = EXCLUDED.country,
          platform = EXCLUDED.platform,
          browser = EXCLUDED.browser,
          device_type = EXCLUDED.device_type
        RETURNING *
      `;
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating/updating session:', error);
      throw error;
    }
  }

  // Track user activity
  static async trackActivity(activityData: {
    sessionId: string;
    activityType: 'question_answered' | 'session_started' | 'exercise_generated' | 'mode_changed';
    exerciseId?: string;
    questionLevel?: string;
    questionTopic?: string;
    userAnswer?: string;
    correctAnswer?: string;
    isCorrect?: boolean;
    responseTimeMs?: number;
  }) {
    try {
      const result = await sql`
        INSERT INTO user_activities (
          session_id, activity_type, exercise_id, question_level, question_topic,
          user_answer, correct_answer, is_correct, response_time_ms
        ) VALUES (
          ${activityData.sessionId},
          ${activityData.activityType},
          ${activityData.exerciseId || null},
          ${activityData.questionLevel || null},
          ${activityData.questionTopic || null},
          ${activityData.userAnswer || null},
          ${activityData.correctAnswer || null},
          ${activityData.isCorrect || null},
          ${activityData.responseTimeMs || null}
        )
        RETURNING *
      `;
      
      return result.rows[0];
    } catch (error) {
      console.error('Error tracking activity:', error);
      throw error;
    }
  }

  // Get analytics data for admin dashboard
  static async getAnalytics(timeRange: '1d' | '7d' | '30d' | '90d' = '7d') {
    try {
      const daysBack = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Get basic stats
      const totalUsersResult = await sql`
        SELECT COUNT(DISTINCT session_id) as total_users
        FROM user_sessions
        WHERE created_at >= ${startDate.toISOString()}
      `;

      const totalSessionsResult = await sql`
        SELECT COUNT(*) as total_sessions
        FROM user_sessions
        WHERE created_at >= ${startDate.toISOString()}
      `;

      const totalQuestionsResult = await sql`
        SELECT COUNT(*) as total_questions
        FROM user_activities
        WHERE activity_type = 'question_answered'
        AND created_at >= ${startDate.toISOString()}
      `;

      const correctAnswersResult = await sql`
        SELECT COUNT(*) as correct_answers
        FROM user_activities
        WHERE activity_type = 'question_answered'
        AND is_correct = true
        AND created_at >= ${startDate.toISOString()}
      `;

      const incorrectAnswersResult = await sql`
        SELECT COUNT(*) as incorrect_answers
        FROM user_activities
        WHERE activity_type = 'question_answered'
        AND is_correct = false
        AND created_at >= ${startDate.toISOString()}
      `;

      // Get countries data
      const countriesResult = await sql`
        SELECT country, COUNT(DISTINCT session_id) as count
        FROM user_sessions
        WHERE created_at >= ${startDate.toISOString()}
        AND country IS NOT NULL
        GROUP BY country
        ORDER BY count DESC
        LIMIT 10
      `;

      // Get platforms data
      const platformsResult = await sql`
        SELECT platform, COUNT(DISTINCT session_id) as count
        FROM user_sessions
        WHERE created_at >= ${startDate.toISOString()}
        AND platform IS NOT NULL
        GROUP BY platform
        ORDER BY count DESC
        LIMIT 10
      `;

      // Get levels data
      const levelsResult = await sql`
        SELECT question_level as level, COUNT(*) as count
        FROM user_activities
        WHERE activity_type = 'question_answered'
        AND created_at >= ${startDate.toISOString()}
        AND question_level IS NOT NULL
        GROUP BY question_level
        ORDER BY level
      `;

      // Get daily stats
      const dailyStatsResult = await sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(DISTINCT session_id) as users,
          COUNT(CASE WHEN activity_type = 'question_answered' THEN 1 END) as questions,
          COUNT(CASE WHEN activity_type = 'question_answered' AND is_correct = true THEN 1 END) as correct
        FROM user_activities
        WHERE created_at >= ${startDate.toISOString()}
        GROUP BY DATE(created_at)
        ORDER BY date
      `;

      return {
        totalUsers: parseInt(String(totalUsersResult.rows[0]?.total_users || '0')),
        totalSessions: parseInt(String(totalSessionsResult.rows[0]?.total_sessions || '0')),
        totalQuestions: parseInt(String(totalQuestionsResult.rows[0]?.total_questions || '0')),
        correctAnswers: parseInt(String(correctAnswersResult.rows[0]?.correct_answers || '0')),
        incorrectAnswers: parseInt(String(incorrectAnswersResult.rows[0]?.incorrect_answers || '0')),
        countries: countriesResult.rows.map(row => ({
          country: String(row.country),
          count: parseInt(String(row.count))
        })),
        platforms: platformsResult.rows.map(row => ({
          platform: String(row.platform),
          count: parseInt(String(row.count))
        })),
        levels: levelsResult.rows.map(row => ({
          level: String(row.level),
          count: parseInt(String(row.count))
        })),
        dailyStats: dailyStatsResult.rows.map(row => ({
          date: String(row.date),
          users: parseInt(String(row.users)),
          questions: parseInt(String(row.questions)),
          correct: parseInt(String(row.correct))
        }))
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
}