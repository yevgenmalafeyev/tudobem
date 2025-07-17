import { sql } from '@vercel/postgres';
import { LanguageLevel } from '@/types';

export interface DatabaseExercise {
  id: string;
  sentence: string;
  correct_answer: string;
  topic: string;
  level: LanguageLevel;
  hint_infinitive?: string;
  hint_person?: string;
  hint_form?: string;
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
          hint_infinitive VARCHAR(100),
          hint_person VARCHAR(50),
          hint_form VARCHAR(100),
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
    hint?: { infinitive?: string; person?: string; form?: string };
    multipleChoiceOptions?: string[];
    explanations?: { pt: string; en: string; uk: string };
  }[]) {
    try {
      const savedExercises = [];
      
      for (const exercise of exercises) {
        const result = await sql`
          INSERT INTO exercises (
            sentence, correct_answer, topic, level,
            hint_infinitive, hint_person, hint_form,
            multiple_choice_options, explanation_pt, explanation_en, explanation_uk
          ) VALUES (
            ${exercise.sentence},
            ${exercise.correctAnswer},
            ${exercise.topic},
            ${exercise.level},
            ${exercise.hint?.infinitive || null},
            ${exercise.hint?.person || null},
            ${exercise.hint?.form || null},
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
        gapIndex: row.sentence.indexOf('_____'),
        correctAnswer: row.correct_answer,
        topic: row.topic,
        level: row.level as LanguageLevel,
        hint: {
          infinitive: row.hint_infinitive || undefined,
          person: row.hint_person || undefined,
          form: row.hint_form || undefined
        },
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
        gapIndex: row.sentence.indexOf('_____'),
        correctAnswer: row.correct_answer,
        topic: row.topic,
        level: row.level as LanguageLevel,
        hint: {
          infinitive: row.hint_infinitive || undefined,
          person: row.hint_person || undefined,
          form: row.hint_form || undefined
        },
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
      
      return result.rows[0].count > 0;
    } catch (error) {
      console.error('Error checking exercise existence:', error);
      return false;
    }
  }
}