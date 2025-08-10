import { describe, it, expect } from '@jest/globals';
import { 
  generateBatchExercisePrompt, 
  validateBatchExerciseResponse, 
  processGeneratedExercises 
} from '@/utils/batchPrompts';
import type { LanguageLevel } from '@/types';

describe('Enhanced Batch Prompts', () => {
  describe('generateBatchExercisePrompt', () => {
    it('should include verb hint guidelines in the prompt', () => {
      const levels: LanguageLevel[] = ['A2'];
      const topicIds = ['preterito-perfeito'];
      const topicNames = ['Pretérito Perfeito'];
      const masteredWords = {};
      
      const prompt = generateBatchExercisePrompt(levels, topicIds, topicNames, masteredWords, 5);
      
      expect(prompt).toContain('VERB HINT GUIDELINES');
      expect(prompt).toContain('Always include "infinitive" for verb exercises');
      expect(prompt).toContain('Add "person" indicator only when sentence context doesn\'t clearly indicate');
      expect(prompt).toContain('Include "grammarRule" with conjugation pattern');
    });

    it('should include enhanced hint structure in example', () => {
      const levels: LanguageLevel[] = ['A2'];
      const topicIds = ['preterito-perfeito'];
      const topicNames = ['Pretérito Perfeito'];
      const masteredWords = {};
      
      const prompt = generateBatchExercisePrompt(levels, topicIds, topicNames, masteredWords, 5);
      
      expect(prompt).toContain('"infinitive": "ir"');
      expect(prompt).toContain('"person": "(1ª pessoa)"');
      expect(prompt).toContain('"form": "pretérito perfeito"');
      expect(prompt).toContain('"grammarRule": "Pretérito perfeito: exprime ações completas no passado');
    });
  });

  describe('validateBatchExerciseResponse', () => {
    it('should validate exercises with enhanced hint structure', () => {
      const exercises = [
        {
          sentence: 'Eu ___ ao cinema.',
          correctAnswer: 'fui',
          topic: 'preterito-perfeito',
          level: 'A2',
          hint: {
            infinitive: 'ir',
            person: '(1ª pessoa)',
            form: 'pretérito perfeito',
            grammarRule: 'Pretérito perfeito: eu fui, tu foste, ele foi...'
          },
          multipleChoiceOptions: ['fui', 'ia', 'vou', 'fosse'],
          explanations: {
            pt: 'Explicação em português',
            en: 'English explanation',
            uk: 'Українське пояснення'
          }
        }
      ];

      const isValid = validateBatchExerciseResponse(exercises);
      expect(isValid).toBe(true);
    });

    it('should accept exercises without hints', () => {
      const exercises = [
        {
          sentence: 'A casa é ___.',
          correctAnswer: 'bonita',
          topic: 'adjetivos',
          level: 'A1',
          multipleChoiceOptions: ['bonita', 'bonito', 'bonitas', 'bonitos'],
          explanations: {
            pt: 'Explicação em português',
            en: 'English explanation',
            uk: 'Українське пояснення'
          }
        }
      ];

      const isValid = validateBatchExerciseResponse(exercises);
      expect(isValid).toBe(true);
    });

    it('should accept exercises with partial hint information', () => {
      const exercises = [
        {
          sentence: 'Ele ___ muito cansado.',
          correctAnswer: 'está',
          topic: 'verbo-estar',
          level: 'A1',
          hint: {
            infinitive: 'estar'
            // No person, form, or grammarRule - should still be valid
          },
          multipleChoiceOptions: ['está', 'é', 'tem', 'foi'],
          explanations: {
            pt: 'Explicação em português',
            en: 'English explanation',
            uk: 'Українське пояснення'
          }
        }
      ];

      const isValid = validateBatchExerciseResponse(exercises);
      expect(isValid).toBe(true);
    });

    it('should still validate core required fields', () => {
      const exercisesWithMissingFields = [
        {
          sentence: 'Eu ___ ao cinema.',
          // Missing correctAnswer
          topic: 'preterito-perfeito',
          level: 'A2',
          multipleChoiceOptions: ['fui', 'ia', 'vou', 'fosse'],
          explanations: {
            pt: 'Explicação em português',
            en: 'English explanation',
            uk: 'Українське пояснення'
          }
        }
      ];

      const isValid = validateBatchExerciseResponse(exercisesWithMissingFields);
      expect(isValid).toBe(false);
    });
  });

  describe('processGeneratedExercises', () => {
    it('should preserve hint information during processing', () => {
      const exercises = [
        {
          sentence: 'Eu ___ ao cinema.',
          correctAnswer: 'fui',
          topic: 'preterito-perfeito',
          level: 'A2',
          hint: {
            infinitive: 'ir',
            person: '(1ª pessoa)',
            form: 'pretérito perfeito',
            grammarRule: 'Pretérito perfeito: eu fui, tu foste, ele foi...'
          },
          multipleChoiceOptions: ['fui', 'ia', 'vou', 'fosse'],
          explanations: {
            pt: 'Explicação em português',
            en: 'English explanation',
            uk: 'Українське пояснення'
          }
        }
      ];

      const processed = processGeneratedExercises(exercises);
      
      expect(processed[0].hint).toEqual({
        infinitive: 'ir',
        person: '(1ª pessoa)',
        form: 'pretérito perfeito',
        grammarRule: 'Pretérito perfeito: eu fui, tu foste, ele foi...'
      });
    });

    it('should handle exercises without hints', () => {
      const exercises = [
        {
          sentence: 'A casa é ___.',
          correctAnswer: 'bonita',
          topic: 'adjetivos',
          level: 'A1',
          multipleChoiceOptions: ['bonita', 'bonito', 'bonitas', 'bonitos'],
          explanations: {
            pt: 'Explicação em português',
            en: 'English explanation',
            uk: 'Українське пояснення'
          }
        }
      ];

      const processed = processGeneratedExercises(exercises);
      
      expect(processed[0].hint).toBeUndefined();
      expect(processed[0].correctAnswer).toBe('bonita');
    });

    it('should maintain all enhanced exercise properties', () => {
      const exercises = [
        {
          sentence: 'Eu ___ ao cinema.',
          correctAnswer: 'fui',
          topic: 'preterito-perfeito',
          level: 'A2',
          hint: {
            infinitive: 'ir',
            grammarRule: 'Test rule'
          },
          multipleChoiceOptions: ['fui', 'ia', 'vou', 'fosse'],
          explanations: {
            pt: 'Explicação em português',
            en: 'English explanation',
            uk: 'Українське пояснення'
          }
        }
      ];

      const processed = processGeneratedExercises(exercises);
      
      expect(processed[0]).toHaveProperty('id');
      expect(processed[0]).toHaveProperty('source', 'ai');
      expect(processed[0]).toHaveProperty('difficultyScore', 0.5);
      expect(processed[0]).toHaveProperty('usageCount', 0);
      expect(processed[0].explanations).toEqual({
        pt: 'Explicação em português',
        en: 'English explanation',
        uk: 'Українське пояснення'
      });
    });
  });
});