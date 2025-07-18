import { generateBasicDistractors, processMultipleChoiceOptions } from '@/services/multipleChoiceService'

describe('multipleChoiceService', () => {
  describe('generateBasicDistractors', () => {
    it('should generate different distractors for verb forms', () => {
      const distractors = generateBasicDistractors('falo')
      
      expect(Array.isArray(distractors)).toBe(true)
      expect(distractors.length).toBeGreaterThan(0)
      expect(distractors).not.toContain('falo')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })

    it('should generate distractors for different verb forms', () => {
      const distractors = generateBasicDistractors('sou')
      
      expect(Array.isArray(distractors)).toBe(true)
      expect(distractors.length).toBeGreaterThan(0)
      expect(distractors).not.toContain('sou')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })

    it('should generate distractors for articles', () => {
      const distractors = generateBasicDistractors('a')
      
      expect(Array.isArray(distractors)).toBe(true)
      expect(distractors.length).toBeGreaterThan(0)
      expect(distractors).not.toContain('a')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })

    it('should generate distractors for adjectives', () => {
      const distractors = generateBasicDistractors('bonito')
      
      expect(Array.isArray(distractors)).toBe(true)
      expect(distractors.length).toBeGreaterThan(0)
      expect(distractors).not.toContain('bonito')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })

    it('should handle unknown words', () => {
      const distractors = generateBasicDistractors('unknownword')
      
      expect(Array.isArray(distractors)).toBe(true)
      expect(distractors.length).toBeGreaterThan(0)
      expect(distractors).not.toContain('unknownword')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })

    it('should not include correct answer in distractors', () => {
      const correctAnswer = 'falo'
      const distractors = generateBasicDistractors(correctAnswer)
      
      expect(distractors).not.toContain(correctAnswer)
      expect(distractors).not.toContain(correctAnswer.toUpperCase())
      expect(distractors).not.toContain(correctAnswer.toLowerCase())
    })

    it('should generate unique distractors', () => {
      const distractors = generateBasicDistractors('falo')
      const uniqueDistractors = [...new Set(distractors)]
      
      expect(distractors.length).toBe(uniqueDistractors.length)
    })

    it('should handle empty string', () => {
      const distractors = generateBasicDistractors('')
      
      expect(Array.isArray(distractors)).toBe(true)
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })

    it('should handle special characters', () => {
      const distractors = generateBasicDistractors('está')
      
      expect(Array.isArray(distractors)).toBe(true)
      expect(distractors.length).toBeGreaterThan(0)
      expect(distractors).not.toContain('está')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })
  })

  describe('processMultipleChoiceOptions', () => {
    it('should always include correct answer in options', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'falamos', 'falam']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options.length).toBeGreaterThan(0)
    })

    it('should include valid distractors when available', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'falamos', 'falam']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options.length).toBeGreaterThanOrEqual(4)
    })

    it('should filter out invalid distractors', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', '', null, 'falamos', undefined, 'falam'] as string[]
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options).not.toContain('')
      expect(options).not.toContain(null)
      expect(options).not.toContain(undefined)
      expect(options.every(opt => opt && typeof opt === 'string')).toBe(true)
    })

    it('should handle case where distractors include correct answer', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'falo', 'falamos', 'falam']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      // Should only include correct answer once
      const correctAnswerCount = options.filter(opt => opt === correctAnswer).length
      expect(correctAnswerCount).toBe(1)
      expect(options).toContain(correctAnswer)
    })

    it('should generate fallback options when no distractors provided', () => {
      const correctAnswer = 'falo'
      const distractors: string[] = []
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options.length).toBeGreaterThan(1) // Should generate fallback options
    })

    it('should generate fallback options when insufficient distractors', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options.length).toBeGreaterThan(2) // Should generate additional options
      
      // Should include valid distractors if they pass validation
      const validDistractors = options.filter(opt => opt !== correctAnswer)
      expect(validDistractors.length).toBeGreaterThan(0)
    })

    it('should limit to maximum 4 options', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'falamos', 'falam', 'falava', 'falou', 'falaram']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options.length).toBeLessThanOrEqual(4)
    })

    it('should remove duplicates from distractors', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'fala', 'falamos', 'falamos']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      const uniqueOptions = [...new Set(options)]
      expect(options.length).toBe(uniqueOptions.length)
    })

    it('should handle Portuguese special characters', () => {
      const correctAnswer = 'está'
      const distractors = ['estão', 'estás', 'estamos']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain('está')
      expect(options.length).toBeGreaterThanOrEqual(4)
    })

    it('should always return at least the correct answer', () => {
      const correctAnswer = 'xyz'
      const distractors = ['', null, undefined] as string[]
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options.length).toBeGreaterThanOrEqual(1)
    })

    it('should handle case-sensitive correct answers', () => {
      const correctAnswer = 'Falo'
      const distractors = ['fala', 'falamos', 'falam']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain('Falo')
      expect(options).not.toContain('falo')
    })

    it('should generate unique options', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'falamos', 'falam']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      const uniqueOptions = [...new Set(options)]
      expect(options.length).toBe(uniqueOptions.length)
    })

    it('should handle very short words', () => {
      const correctAnswer = 'é'
      const distractors = ['a', 'o', 'e']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain('é')
      expect(options.length).toBeGreaterThanOrEqual(1)
    })

    it('should handle very long words', () => {
      const correctAnswer = 'responsabilidade'
      const distractors = ['responsabilidades', 'responsável', 'responsáveis']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain('responsabilidade')
      expect(options.length).toBeGreaterThanOrEqual(4)
    })

    it('should generate fallback options that are different from correct answer', () => {
      const correctAnswer = 'falo'
      const distractors: string[] = []
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      const otherOptions = options.filter(opt => opt !== correctAnswer)
      expect(otherOptions.length).toBeGreaterThan(0)
      expect(otherOptions.every(opt => opt !== correctAnswer)).toBe(true)
    })
  })

  describe('generateFallbackDistractors integration', () => {
    it('should generate Portuguese-like transformations', () => {
      const correctAnswer = 'falo'
      const distractors: string[] = []
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      const fallbackOptions = options.filter(opt => opt !== correctAnswer)
      
      // Should generate Portuguese-like variations
      expect(fallbackOptions.some(opt => opt.includes('fal'))).toBe(true)
      expect(fallbackOptions.every(opt => opt.length > 0)).toBe(true)
    })

    it('should avoid infinite loops with difficult words', () => {
      const correctAnswer = 'xyz'
      const distractors: string[] = []
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options.length).toBeGreaterThanOrEqual(1)
      expect(options.length).toBeLessThanOrEqual(4)
    })

    it('should handle edge case with single character', () => {
      const correctAnswer = 'a'
      const distractors: string[] = []
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options.length).toBeGreaterThanOrEqual(1)
    })
  })
})