import { getFallbackExercise, fallbackExercises } from '@/services/exerciseService'
import { LanguageLevel } from '@/types'

describe('Level Validation Service', () => {
  describe('fallbackExercises level consistency', () => {
    it('should have exercises only in their designated level categories', () => {
      Object.entries(fallbackExercises).forEach(([level, exercises]) => {
        exercises.forEach(exercise => {
          expect(exercise.level).toBe(level)
        })
      })
    })

    it('should have valid level keys', () => {
      const validLevels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
      const fallbackLevels = Object.keys(fallbackExercises)
      
      fallbackLevels.forEach(level => {
        expect(validLevels).toContain(level as LanguageLevel)
      })
    })

    it('should have appropriate content complexity for each level', () => {
      // A1 exercises should be simple
      const a1Exercises = fallbackExercises['A1'] || []
      a1Exercises.forEach(exercise => {
        expect(exercise.level).toBe('A1')
        // A1 should have basic topics
        expect(['present-indicative', 'ser-estar', 'articles']).toContain(exercise.topic)
      })

      // B1+ exercises should be more complex
      const b1Exercises = fallbackExercises['B1'] || []
      b1Exercises.forEach(exercise => {
        expect(exercise.level).toBe('B1')
        // B1 should have more advanced topics
        expect(['present-subjunctive', 'conditional-simple', 'imperative-mood']).toContain(exercise.topic)
      })

      // B2 exercises should be complex
      const b2Exercises = fallbackExercises['B2'] || []
      b2Exercises.forEach(exercise => {
        expect(exercise.level).toBe('B2')
        // B2 should have advanced topics
        expect(['imperfect-subjunctive', 'future-subjunctive', 'passive-voice', 'present-subjunctive', 'pluperfect-subjunctive']).toContain(exercise.topic)
      })
    })

    it('should not have level mixing within single exercises', () => {
      Object.values(fallbackExercises).flat().forEach(exercise => {
        // Each exercise should have exactly one level
        expect(exercise.level).toBeDefined()
        expect(typeof exercise.level).toBe('string')
        expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(exercise.level)
      })
    })

    it('should have progressive difficulty between levels', () => {
      // A1 should be simplest
      const a1Topics = (fallbackExercises['A1'] || []).map(ex => ex.topic)
      expect(a1Topics).toContain('present-indicative') // Basic tense
      
      // A2 should introduce past/future
      const a2Topics = (fallbackExercises['A2'] || []).map(ex => ex.topic)
      expect(a2Topics.some(topic => 
        ['preterite-perfect', 'imperfect', 'future-simple'].includes(topic)
      )).toBe(true)
      
      // B1 should introduce subjunctive
      const b1Topics = (fallbackExercises['B1'] || []).map(ex => ex.topic)
      expect(b1Topics).toContain('present-subjunctive')
      
      // B2 should have advanced subjunctive and passive
      const b2Topics = (fallbackExercises['B2'] || []).map(ex => ex.topic)
      expect(b2Topics.some(topic => 
        ['imperfect-subjunctive', 'future-subjunctive', 'passive-voice'].includes(topic)
      )).toBe(true)
    })
  })

  describe('getFallbackExercise level filtering', () => {
    it('should return exercise matching single requested level', () => {
      const exercise = getFallbackExercise(['A1'])
      expect(exercise).toBeTruthy()
      expect(exercise?.level).toBe('A1')
    })

    it('should return exercise from one of multiple requested levels', () => {
      const requestedLevels: LanguageLevel[] = ['B1', 'B2']
      const exercise = getFallbackExercise(requestedLevels)
      
      expect(exercise).toBeTruthy()
      expect(requestedLevels).toContain(exercise?.level as LanguageLevel)
    })

    it('should not return exercises from excluded levels', () => {
      // Test multiple times to ensure consistency
      for (let i = 0; i < 20; i++) {
        const exercise = getFallbackExercise(['A2', 'B1'])
        expect(exercise).toBeTruthy()
        expect(['A2', 'B1']).toContain(exercise?.level)
        expect(['A1', 'B2', 'C1', 'C2']).not.toContain(exercise?.level)
      }
    })

    it('should handle level filtering with missing levels gracefully', () => {
      // Request levels that don't exist in fallback exercises
      const exercise = getFallbackExercise(['C1', 'C2'] as LanguageLevel[])
      
      // Should return null since C1/C2 don't exist in fallback
      expect(exercise).toBeNull()
    })

    it('should handle mixed valid and invalid levels', () => {
      const exercise = getFallbackExercise(['A1', 'INVALID_LEVEL'] as LanguageLevel[])
      
      expect(exercise).toBeTruthy()
      expect(exercise?.level).toBe('A1') // Should get the valid level
    })

    it('should maintain level consistency across multiple calls', () => {
      const levels: LanguageLevel[] = ['A1', 'A2']
      const generatedLevels: string[] = []
      
      // Generate multiple exercises
      for (let i = 0; i < 10; i++) {
        const exercise = getFallbackExercise(levels)
        if (exercise) {
          generatedLevels.push(exercise.level)
        }
      }
      
      // All should be from requested levels
      generatedLevels.forEach(level => {
        expect(levels).toContain(level as LanguageLevel)
      })
      
      // Should have generated some exercises
      expect(generatedLevels.length).toBe(10)
    })

    it('should distribute exercises across available levels', () => {
      const levels: LanguageLevel[] = ['A1', 'A2', 'B1']
      const levelCounts: Record<string, number> = {}
      
      // Generate many exercises to test distribution
      for (let i = 0; i < 100; i++) {
        const exercise = getFallbackExercise(levels)
        if (exercise) {
          levelCounts[exercise.level] = (levelCounts[exercise.level] || 0) + 1
        }
      }
      
      // Should have exercises from multiple levels
      const generatedLevels = Object.keys(levelCounts)
      expect(generatedLevels.length).toBeGreaterThan(1)
      
      // All generated levels should be from requested levels
      generatedLevels.forEach(level => {
        expect(levels).toContain(level as LanguageLevel)
      })
    })

    it('should respect level order and availability', () => {
      // Test with levels in different order
      const exercise1 = getFallbackExercise(['B1', 'A1'])
      const exercise2 = getFallbackExercise(['A1', 'B1'])
      
      expect(exercise1).toBeTruthy()
      expect(exercise2).toBeTruthy()
      expect(['A1', 'B1']).toContain(exercise1?.level)
      expect(['A1', 'B1']).toContain(exercise2?.level)
    })
  })

  describe('level-specific content validation', () => {
    it('should have appropriate vocabulary complexity for each level', () => {
      // A1 should use basic, common words
      const a1Exercises = fallbackExercises['A1'] || []
      a1Exercises.forEach(exercise => {
        const sentence = exercise.sentence.toLowerCase()
        // Should contain basic Portuguese words
        const hasBasicWords = [
          'eu', 'ela', 'nós', 'português', 'casa', 'muito', 'bonita', 'professora', 'menino', 'alto', 'grande'
        ].some(word => sentence.includes(word))
        expect(hasBasicWords).toBe(true)
      })

      // B2 should use more complex vocabulary and structures
      const b2Exercises = fallbackExercises['B2'] || []
      b2Exercises.forEach(exercise => {
        // B2 exercises should have more complex structures
        expect(exercise.sentence.length).toBeGreaterThan(15) // Longer sentences
        
        // Should have complex grammatical hints
        if (exercise.hint?.form) {
          const complexForms = [
            'imperfect subjunctive', 'future subjunctive', 'passive voice', 'present subjunctive', 'pluperfect subjunctive'
          ]
          const hasComplexForm = complexForms.some(form => 
            exercise.hint!.form!.includes(form)
          )
          expect(hasComplexForm).toBe(true)
        }
      })
    })

    it('should have appropriate grammatical complexity progression', () => {
      // A1: Present tense, basic verbs
      const a1Topics = (fallbackExercises['A1'] || []).map(ex => ex.topic)
      expect(a1Topics).toEqual(
        expect.arrayContaining(['present-indicative', 'ser-estar', 'articles'])
      )

      // A2: Past and future tenses
      const a2Topics = (fallbackExercises['A2'] || []).map(ex => ex.topic)
      expect(a2Topics).toEqual(
        expect.arrayContaining(['preterite-perfect', 'imperfect', 'future-simple'])
      )

      // B1: Subjunctive introduction
      const b1Topics = (fallbackExercises['B1'] || []).map(ex => ex.topic)
      expect(b1Topics).toEqual(
        expect.arrayContaining(['present-subjunctive', 'conditional-simple', 'imperative-mood'])
      )

      // B2: Advanced subjunctive and passive voice
      const b2Topics = (fallbackExercises['B2'] || []).map(ex => ex.topic)
      expect(b2Topics).toEqual(
        expect.arrayContaining(['imperfect-subjunctive', 'future-subjunctive', 'passive-voice'])
      )
    })

    it('should not have advanced topics in beginner levels', () => {
      // A1 should not have subjunctive or complex tenses
      const a1Topics = (fallbackExercises['A1'] || []).map(ex => ex.topic)
      const advancedTopics = [
        'subjunctive', 'conditional', 'passive', 'gerund', 'participle'
      ]
      
      a1Topics.forEach(topic => {
        const hasAdvancedElement = advancedTopics.some(advanced => 
          topic.includes(advanced)
        )
        expect(hasAdvancedElement).toBe(false)
      })
    })

    it('should have consistent hint complexity for each level', () => {
      // A1 hints should be simple
      const a1Exercises = fallbackExercises['A1'] || []
      a1Exercises.forEach(exercise => {
        if (exercise.hint?.form) {
          // Should use simple grammatical terms
          const simpleTerms = ['present', 'indicative', 'article']
          const hasSimpleTerm = simpleTerms.some(term => 
            exercise.hint!.form!.includes(term)
          )
          expect(hasSimpleTerm).toBe(true)
        }
      })

      // B2 hints should be detailed
      const b2Exercises = fallbackExercises['B2'] || []
      b2Exercises.forEach(exercise => {
        if (exercise.hint?.form) {
          // Should use complex grammatical terms
          expect(exercise.hint.form.length).toBeGreaterThan(10)
        }
      })
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle empty level arrays', () => {
      const exercise = getFallbackExercise([])
      expect(exercise).toBeNull()
    })

    it('should handle undefined level parameter', () => {
      const exercise = getFallbackExercise(undefined as unknown)
      expect(exercise).toBeNull()
    })

    it('should handle null level parameter', () => {
      const exercise = getFallbackExercise(null as unknown)
      expect(exercise).toBeNull()
    })

    it('should handle invalid level strings', () => {
      const exercise = getFallbackExercise(['INVALID', 'ALSO_INVALID'] as LanguageLevel[])
      expect(exercise).toBeNull()
    })

    it('should handle case sensitivity in levels', () => {
      // Our system should be case sensitive
      const exercise = getFallbackExercise(['a1', 'a2'] as LanguageLevel[])
      expect(exercise).toBeNull() // lowercase should not match
    })

    it('should handle extra whitespace in levels', () => {
      const exercise = getFallbackExercise([' A1 ', ' A2 '] as LanguageLevel[])
      expect(exercise).toBeNull() // whitespace should not match
    })
  })
})