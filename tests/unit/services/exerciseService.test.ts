import { getFallbackExercise, createExercise, fallbackExercises } from '@/services/exerciseService'
import { LanguageLevel } from '@/types'

describe('exerciseService', () => {
  describe('fallbackExercises', () => {
    it('should have exercises for all levels', () => {
      const levels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2']
      
      levels.forEach(level => {
        expect(fallbackExercises[level]).toBeDefined()
        expect(fallbackExercises[level].length).toBeGreaterThan(0)
      })
    })

    it('should have valid exercise structure', () => {
      Object.values(fallbackExercises).forEach(exercises => {
        exercises.forEach(exercise => {
          expect(exercise).toHaveProperty('id')
          expect(exercise).toHaveProperty('sentence')
          expect(exercise).toHaveProperty('correctAnswer')
          expect(exercise).toHaveProperty('topic')
          expect(exercise).toHaveProperty('level')
          expect(exercise).toHaveProperty('hint')
          
          expect(typeof exercise.id).toBe('string')
          expect(typeof exercise.sentence).toBe('string')
          expect(typeof exercise.correctAnswer).toBe('string')
          expect(typeof exercise.topic).toBe('string')
          expect(typeof exercise.level).toBe('string')
          expect(typeof exercise.hint).toBe('object')
        })
      })
    })

    it('should have sentences with gaps', () => {
      Object.values(fallbackExercises).forEach(exercises => {
        exercises.forEach(exercise => {
          expect(exercise.sentence).toContain('___')
        })
      })
    })

    it('should have non-empty correct answers', () => {
      Object.values(fallbackExercises).forEach(exercises => {
        exercises.forEach(exercise => {
          expect(exercise.correctAnswer.trim()).toBeTruthy()
        })
      })
    })

    it('should have appropriate level assignments', () => {
      Object.entries(fallbackExercises).forEach(([level, exercises]) => {
        exercises.forEach(exercise => {
          expect(exercise.level).toBe(level)
        })
      })
    })
  })

  describe('getFallbackExercise', () => {
    it('should return exercise for single level', () => {
      const exercise = getFallbackExercise(['A1'])
      
      expect(exercise).toBeDefined()
      expect(exercise?.level).toBe('A1')
    })

    it('should return exercise for multiple levels', () => {
      const exercise = getFallbackExercise(['A1', 'A2'])
      
      expect(exercise).toBeDefined()
      expect(['A1', 'A2']).toContain(exercise?.level)
    })

    it('should return null for invalid levels', () => {
      const exercise = getFallbackExercise(['Z1'] as LanguageLevel[])
      
      expect(exercise).toBeNull()
    })

    it('should return null for empty levels array', () => {
      const exercise = getFallbackExercise([])
      
      expect(exercise).toBeNull()
    })

    it('should return different exercises on multiple calls', () => {
      const exercises = new Set()
      
      // Call multiple times to test randomness
      for (let i = 0; i < 50; i++) {
        const exercise = getFallbackExercise(['A1', 'A2'])
        if (exercise) {
          exercises.add(exercise.id)
        }
      }
      
      // Should get more than one unique exercise
      expect(exercises.size).toBeGreaterThan(1)
    })

    it('should handle mixed valid and invalid levels', () => {
      const exercise = getFallbackExercise(['A1', 'INVALID'] as LanguageLevel[])
      
      expect(exercise).toBeDefined()
      expect(exercise?.level).toBe('A1')
    })
  })

  describe('createExercise', () => {
    it('should create exercise with all required properties', () => {
      const exerciseData = {
        sentence: 'Eu ___ português.',
        correctAnswer: 'falo',
        topic: 'present-indicative',
        level: 'A1',
        hint: {
          infinitive: 'falar',
          form: 'present indicative'
        }
      }
      
      const exercise = createExercise(exerciseData)
      
      expect(exercise).toHaveProperty('id')
      expect(exercise).toHaveProperty('sentence', exerciseData.sentence)
      expect(exercise).toHaveProperty('correctAnswer', exerciseData.correctAnswer)
      expect(exercise).toHaveProperty('topic', exerciseData.topic)
      expect(exercise).toHaveProperty('level', exerciseData.level)
      expect(exercise).toHaveProperty('hint', exerciseData.hint)
    })

    it('should calculate correct gap index', () => {
      const exerciseData = {
        sentence: 'A casa ___ muito bonita.',
        correctAnswer: 'é',
        topic: 'ser-estar',
        level: 'A1'
      }
      
      const exercise = createExercise(exerciseData)
      
    })

    it('should handle sentence without gap', () => {
      const exerciseData = {
        sentence: 'Eu falo português.',
        correctAnswer: 'falo',
        topic: 'present-indicative',
        level: 'A1'
      }
      
      const exercise = createExercise(exerciseData)
      
    })

    it('should generate unique IDs', () => {
      const exerciseData = {
        sentence: 'Eu ___ português.',
        correctAnswer: 'falo',
        topic: 'present-indicative',
        level: 'A1'
      }
      
      const exercise1 = createExercise(exerciseData)
      const exercise2 = createExercise(exerciseData)
      
      expect(exercise1.id).not.toBe(exercise2.id)
    })

    it('should handle optional hint', () => {
      const exerciseDataWithoutHint = {
        sentence: 'Eu ___ português.',
        correctAnswer: 'falo',
        topic: 'present-indicative',
        level: 'A1'
      }
      
      const exercise = createExercise(exerciseDataWithoutHint)
      
      expect(exercise.hint).toBeUndefined()
    })

    it('should handle partial hint', () => {
      const exerciseData = {
        sentence: 'Eu ___ português.',
        correctAnswer: 'falo',
        topic: 'present-indicative',
        level: 'A1',
        hint: {
          infinitive: 'falar'
        }
      }
      
      const exercise = createExercise(exerciseData)
      
      expect(exercise.hint).toEqual({ infinitive: 'falar' })
    })

    it('should cast level to LanguageLevel type', () => {
      const exerciseData = {
        sentence: 'Eu ___ português.',
        correctAnswer: 'falo',
        topic: 'present-indicative',
        level: 'A1'
      }
      
      const exercise = createExercise(exerciseData)
      
      expect(exercise.level).toBe('A1')
      expect(typeof exercise.level).toBe('string')
    })
  })
})