import { describe, it, expect } from '@jest/globals';
import { generateBatchExercisePrompt } from '@/utils/prompts'
import { ExplanationLanguage } from '@/types'

describe('prompts utils', () => {
  describe('generateBatchExercisePrompt', () => {
    it('should generate prompt with correct levels', () => {
      const prompt = generateBatchExercisePrompt(['A1', 'A2'], ['present-indicative'], ['Present Indicative'])
      
      expect(prompt).toContain('A1, A2')
      expect(prompt).toContain('present-indicative')
      expect(prompt).toContain('Present Indicative')
    })

    it('should include all required components', () => {
      const prompt = generateBatchExercisePrompt(['B1'], ['ser-estar'], ['Ser vs Estar'])
      
      expect(prompt).toContain('sentence')
      expect(prompt).toContain('correctAnswer')
      expect(prompt).toContain('topic')
      expect(prompt).toContain('level')
      expect(prompt).toContain('hint')
    })

    it('should handle multiple topics', () => {
      const prompt = generateBatchExercisePrompt(
        ['A1', 'A2'], 
        ['present-indicative', 'ser-estar'], 
        ['Present Indicative', 'Ser vs Estar']
      )
      
      expect(prompt).toContain('present-indicative, ser-estar')
      expect(prompt).toContain('Present Indicative, Ser vs Estar')
    })

    it('should include Portuguese European instruction', () => {
      const prompt = generateBatchExercisePrompt(['A1'], ['present-indicative'], ['Present Indicative'])
      
      expect(prompt).toContain('português europeu')
    })

    it('should include person rules', () => {
      const prompt = generateBatchExercisePrompt(['A1'], ['present-indicative'], ['Present Indicative'])
      
      expect(prompt).toContain('REGRAS DE SELEÇÃO')
    })
  })
})