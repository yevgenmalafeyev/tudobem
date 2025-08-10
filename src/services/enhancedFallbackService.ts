import { SmartDatabase } from '@/lib/smartDatabase';
import { getFallbackExercise, fallbackExercises } from './exerciseService';
import { EnhancedExercise } from '@/types/enhanced';
import { LanguageLevel, Exercise } from '@/types';

/**
 * Enhanced Fallback Service
 * Priority order: Database exercises > Static exercises > Error
 */
export class EnhancedFallbackService {
  private static readonly FALLBACK_BATCH_SIZE = 10;
  private static readonly MIN_DATABASE_EXERCISES = 5;

  /**
   * Get exercise with smart fallback logic
   * Priority: Database > Static > Error
   */
  static async getExercise(
    levels: LanguageLevel[], 
    topics: string[] = [],
    masteredWords: Record<string, unknown> = {}, // Kept for API compatibility but not used
    userId?: string
  ): Promise<EnhancedExercise | null> {
    console.log('🔄 Enhanced fallback: Getting exercise', { levels, topics: topics.length, userId: !!userId });
    
    try {
      // Step 1: Try database first
      const databaseExercise = await this.getDatabaseExercise(levels, topics, masteredWords, userId);
      if (databaseExercise) {
        console.log('✅ Enhanced fallback: Using database exercise');
        return databaseExercise;
      }

      // Step 2: Fall back to static exercises
      console.log('⚠️ Enhanced fallback: No database exercises, using static');
      const staticExercise = await this.getStaticExercise(levels, topics, masteredWords);
      if (staticExercise) {
        return this.convertToEnhancedExercise(staticExercise);
      }

      // Step 3: No exercises available
      console.error('❌ Enhanced fallback: No exercises available');
      return null;
      
    } catch (error) {
      console.error('❌ Enhanced fallback error:', error);
      
      // Ultimate fallback to static exercises
      const staticExercise = await this.getStaticExercise(levels, topics, masteredWords);
      return staticExercise ? this.convertToEnhancedExercise(staticExercise) : null;
    }
  }

  /**
   * Get batch of exercises with smart fallback
   */
  static async getExerciseBatch(
    levels: LanguageLevel[],
    topics: string[] = [],
    count: number = 10,
    masteredWords: Record<string, unknown> = {}, // Kept for API compatibility but not used
    userId?: string
  ): Promise<EnhancedExercise[]> {
    console.log('📦 Enhanced fallback: Getting exercise batch', { levels, topics: topics.length, count, userId: !!userId });
    
    try {
      // Try to get from database first
      const databaseExercises = await SmartDatabase.getExercises({
        levels,
        topics,
        limit: count * 2, // Get more for variety
        userId // Include user filtering
      });

      // NO CLIENT-SIDE FILTERING - Server handles all filtering
      if (databaseExercises.length >= count) {
        console.log(`✅ Enhanced fallback: Using ${count} database exercises`);
        return databaseExercises.slice(0, count);
      }

      // Not enough database exercises, supplement with static
      console.log(`⚠️ Enhanced fallback: Only ${databaseExercises.length} database exercises, supplementing with static`);
      
      const needed = count - databaseExercises.length;
      const staticExercises = await this.getStaticExerciseBatch(levels, topics, needed, masteredWords);
      const enhancedStaticExercises = staticExercises.map(ex => this.convertToEnhancedExercise(ex));

      return [...databaseExercises, ...enhancedStaticExercises];
      
    } catch (error) {
      console.error('❌ Enhanced fallback batch error:', error);
      
      // Ultimate fallback to static exercises only
      const staticExercises = await this.getStaticExerciseBatch(levels, topics, count, masteredWords);
      return staticExercises.map(ex => this.convertToEnhancedExercise(ex));
    }
  }

  /**
   * Populate database from static exercises (migration helper)
   */
  static async populateFromStaticExercises(): Promise<number> {
    console.log('🔄 Migrating static exercises to database...');
    
    try {
      const allStaticExercises: EnhancedExercise[] = [];
      
      // Convert all static exercises to enhanced format
      for (const [, exercises] of Object.entries(fallbackExercises)) {
        for (const exercise of exercises) {
          const enhanced = this.convertToEnhancedExercise(exercise);
          allStaticExercises.push(enhanced);
        }
      }

      // Save to database
      const savedIds = await SmartDatabase.saveExerciseBatch(allStaticExercises);
      
      console.log(`✅ Migrated ${savedIds.length}/${allStaticExercises.length} static exercises to database`);
      return savedIds.length;
      
    } catch (error) {
      console.error('❌ Error migrating static exercises:', error);
      throw error;
    }
  }

  /**
   * Get exercise from database
   */
  private static async getDatabaseExercise(
    levels: LanguageLevel[],
    topics: string[],
    masteredWords: Record<string, unknown>, // Kept for API compatibility but not used
    userId?: string
  ): Promise<EnhancedExercise | null> {
    try {
      const exercises = await SmartDatabase.getExercises({
        levels,
        topics,
        limit: 10, // Get a few options
        userId // Include user filtering
      });

      // NO CLIENT-SIDE FILTERING - Server handles all filtering
      if (exercises.length === 0) {
        return null;
      }

      // Return the least used exercise
      const selectedExercise = exercises[0]; // Already sorted by usage count

      return selectedExercise;
      
    } catch (error) {
      console.error('❌ Database exercise retrieval error:', error);
      return null;
    }
  }

  /**
   * Get static exercise from database instead of hardcoded exercises
   */
  private static async getStaticExercise(
    levels: LanguageLevel[],
    topics: string[],
    masteredWords: Record<string, unknown> // Kept for API compatibility but not used
  ): Promise<Exercise | null> {
    console.log('📚 Enhanced fallback: Getting static exercise from database');
    
    try {
      // Try to get from database first
      const databaseExercises = await SmartDatabase.getExercises({
        levels,
        topics,
        limit: 10 // Get some variety
      });
      
      if (databaseExercises.length > 0) {
        // NO CLIENT-SIDE FILTERING - Server handles all filtering
        const randomIndex = Math.floor(Math.random() * databaseExercises.length);
        return this.convertToLegacyExercise(databaseExercises[randomIndex]);
      }
      
      // Fallback to legacy system only if database is empty
      console.log('⚠️ Database empty, falling back to legacy static exercises');
      return getFallbackExercise(levels, masteredWords, topics);
      
    } catch (error) {
      console.error('❌ Error getting static exercise from database:', error);
      // Ultimate fallback to legacy system
      return getFallbackExercise(levels, masteredWords, topics);
    }
  }

  /**
   * Get multiple static exercises
   */
  private static async getStaticExerciseBatch(
    levels: LanguageLevel[],
    topics: string[],
    count: number,
    masteredWords: Record<string, unknown> // Kept for API compatibility but not used
  ): Promise<Exercise[]> {
    const exercises: Exercise[] = [];
    const usedIds = new Set<string>();

    // Try to get the requested number of unique exercises
    for (let i = 0; i < count * 3 && exercises.length < count; i++) {
      const exercise = await this.getStaticExercise(levels, topics, masteredWords);
      
      if (exercise && !usedIds.has(exercise.id)) {
        exercises.push(exercise);
        usedIds.add(exercise.id);
      }
    }

    return exercises;
  }

  /**
   * Convert enhanced exercise back to legacy format
   */
  private static convertToLegacyExercise(exercise: EnhancedExercise): Exercise {
    return {
      id: exercise.id,
      sentence: exercise.sentence,
      correctAnswer: exercise.correctAnswer,
      topic: exercise.topic,
      level: exercise.level,
      hint: exercise.hint,
      multipleChoiceOptions: exercise.multipleChoiceOptions
    };
  }

  /**
   * Convert legacy exercise to enhanced format
   */
  private static convertToEnhancedExercise(exercise: Exercise): EnhancedExercise {
    // Generate basic multiple choice options if not present
    const options = exercise.multipleChoiceOptions || [
      exercise.correctAnswer,
      ...this.generateBasicDistractors(exercise.correctAnswer, exercise.topic)
    ];

    // Generate basic explanations
    const explanations = {
      pt: this.generateBasicExplanation(exercise, 'pt'),
      en: this.generateBasicExplanation(exercise, 'en'),
      uk: this.generateBasicExplanation(exercise, 'uk')
    };

    return {
      ...exercise,
      multipleChoiceOptions: options,
      explanations,
      difficultyScore: 0.5,
      usageCount: 0
    };
  }

  /**
   * Generate basic distractors for multiple choice
   */
  private static generateBasicDistractors(correctAnswer: string, topic: string): string[] {
    // This is a simplified version - the full implementation would be more sophisticated
    const commonDistractions: Record<string, string[]> = {
      'ser-estar': ['é', 'está', 'era', 'seja'],
      'present-indicative': ['falo', 'falas', 'fala', 'falamos'],
      'preterite-perfect': ['foi', 'era', 'será', 'fosse'],
      'articles': ['o', 'a', 'os', 'as', 'um', 'uma']
    };

    const topicDistractions = commonDistractions[topic] || [];
    const distractors = topicDistractions.filter(d => d !== correctAnswer).slice(0, 3);
    
    // If not enough topic-specific distractors, add generic ones
    while (distractors.length < 3) {
      const generic = ['um', 'o', 'de', 'em', 'com', 'para'];
      const candidate = generic[Math.floor(Math.random() * generic.length)];
      if (!distractors.includes(candidate) && candidate !== correctAnswer) {
        distractors.push(candidate);
      }
    }

    return distractors;
  }

  /**
   * Generate basic explanation in the specified language
   */
  private static generateBasicExplanation(exercise: Exercise, _lang: 'pt' | 'en' | 'uk'): string {
    const templates = {
      pt: {
        default: `A resposta correta é "${exercise.correctAnswer}".`,
        verb: `Usamos "${exercise.correctAnswer}" (${exercise.hint || 'forma verbal'}).`,
        article: `"${exercise.correctAnswer}" é o artigo correto neste contexto.`
      },
      en: {
        default: `The correct answer is "${exercise.correctAnswer}".`,
        verb: `We use "${exercise.correctAnswer}" (${exercise.hint || 'verb form'}).`,
        article: `"${exercise.correctAnswer}" is the correct article in this context.`
      },
      uk: {
        default: `Правильна відповідь: "${exercise.correctAnswer}".`,
        verb: `Ми використовуємо "${exercise.correctAnswer}" (${exercise.hint || 'форма дієслова'}).`,
        article: `"${exercise.correctAnswer}" - правильний артикль у цьому контексті.`
      }
    };

    const template = templates[_lang];
    
    // Choose template based on topic
    if (exercise.topic.includes('verb') || (exercise.hint && (exercise.hint.includes('ar') || exercise.hint.includes('er') || exercise.hint.includes('ir')))) {
      return template.verb;
    } else if (exercise.topic.includes('article')) {
      return template.article;
    } else {
      return template.default;
    }
  }
}