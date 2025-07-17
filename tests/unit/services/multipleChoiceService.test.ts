import { generateBasicDistractors, processMultipleChoiceOptions } from '@/services/multipleChoiceService'

describe('multipleChoiceService', () => {
  describe('generateBasicDistractors', () => {
    it('should generate different distractors for verb forms', () => {
      const distractors = generateBasicDistractors('falo')
      
      expect(distractors).toHaveLength(expect.any(Number))
      expect(distractors).not.toContain('falo')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })

    it('should generate distractors for different verb forms', () => {
      const distractors = generateBasicDistractors('sou')
      
      expect(distractors).toHaveLength(expect.any(Number))
      expect(distractors).not.toContain('sou')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })

    it('should generate distractors for articles', () => {
      const distractors = generateBasicDistractors('a')
      
      expect(distractors).toHaveLength(expect.any(Number))
      expect(distractors).not.toContain('a')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })

    it('should generate distractors for adjectives', () => {
      const distractors = generateBasicDistractors('bonito')
      
      expect(distractors).toHaveLength(expect.any(Number))
      expect(distractors).not.toContain('bonito')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })

    it('should handle unknown words', () => {
      const distractors = generateBasicDistractors('unknownword')
      
      expect(distractors).toHaveLength(expect.any(Number))
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
      
      expect(distractors).toHaveLength(expect.any(Number))
      expect(distractors).not.toContain('está')
      expect(distractors.every(d => typeof d === 'string')).toBe(true)
    })
  })

  describe('processMultipleChoiceOptions', () => {
    it('should include correct answer in options', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'falamos', 'falam']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options).toHaveLength(4)
    })

    it('should include all valid distractors', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'falamos', 'falam']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      distractors.forEach(distractor => {
        expect(options).toContain(distractor)
      })
    })

    it('should filter out invalid distractors', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', '', null, 'falamos', undefined, 'falam'] as string[]
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain('fala')
      expect(options).toContain('falamos')
      expect(options).toContain('falam')
      expect(options).not.toContain('')
      expect(options).not.toContain(null)
      expect(options).not.toContain(undefined)
    })

    it('should shuffle options', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'falamos', 'falam']
      
      const options1 = processMultipleChoiceOptions(correctAnswer, distractors)
      const options2 = processMultipleChoiceOptions(correctAnswer, distractors)
      
      // Due to randomness, they might be the same, but let's check multiple times
      let different = false
      for (let i = 0; i < 10; i++) {
        const opts1 = processMultipleChoiceOptions(correctAnswer, distractors)
        const opts2 = processMultipleChoiceOptions(correctAnswer, distractors)
        
        if (JSON.stringify(opts1) !== JSON.stringify(opts2)) {
          different = true
          break
        }
      }
      
      expect(different).toBe(true)
    })

    it('should handle case where distractors include correct answer', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'falo', 'falamos', 'falam']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      // Should only include correct answer once
      const correctAnswerCount = options.filter(opt => opt === correctAnswer).length
      expect(correctAnswerCount).toBe(1)
    })

    it('should handle empty distractors array', () => {
      const correctAnswer = 'falo'
      const distractors: string[] = []
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options).toHaveLength(1)
    })

    it('should handle fewer than 3 distractors', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options).toContain('fala')
      expect(options).toHaveLength(2)
    })

    it('should handle more than 3 distractors', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'falamos', 'falam', 'falava', 'falou']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options.length).toBeLessThanOrEqual(4) // correct answer + max 3 distractors
    })

    it('should remove duplicates from distractors', () => {
      const correctAnswer = 'falo'
      const distractors = ['fala', 'fala', 'falamos', 'falamos']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain(correctAnswer)
      expect(options).toContain('fala')
      expect(options).toContain('falamos')
      expect(options.length).toBe(3) // no duplicates
    })

    it('should handle Portuguese special characters', () => {
      const correctAnswer = 'está'
      const distractors = ['estão', 'estás', 'estamos']
      
      const options = processMultipleChoiceOptions(correctAnswer, distractors)
      
      expect(options).toContain('está')
      expect(options).toContain('estão')
      expect(options).toContain('estás')
      expect(options).toContain('estamos')
      expect(options).toHaveLength(4)
    })
  })
})