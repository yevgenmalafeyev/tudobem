import { generateExercisePrompt, generateMultipleChoicePrompt } from '@/utils/prompts'
import { ExplanationLanguage } from '@/types'

describe('prompts utils', () => {
  describe('generateExercisePrompt', () => {
    it('should generate prompt with correct levels', () => {
      const prompt = generateExercisePrompt(['A1', 'A2'], ['present-indicative'], ['Present Indicative'])
      
      expect(prompt).toContain('A1, A2')
      expect(prompt).toContain('present-indicative')
      expect(prompt).toContain('Present Indicative')
    })

    it('should include all required components', () => {
      const prompt = generateExercisePrompt(['B1'], ['ser-estar'], ['Ser vs Estar'])
      
      expect(prompt).toContain('sentence')
      expect(prompt).toContain('correctAnswer')
      expect(prompt).toContain('topic')
      expect(prompt).toContain('level')
      expect(prompt).toContain('hint')
    })

    it('should handle multiple topics', () => {
      const prompt = generateExercisePrompt(
        ['A1', 'A2'], 
        ['present-indicative', 'ser-estar'], 
        ['Present Indicative', 'Ser vs Estar']
      )
      
      expect(prompt).toContain('present-indicative, ser-estar')
      expect(prompt).toContain('Present Indicative, Ser vs Estar')
    })

    it('should include Portuguese European instruction', () => {
      const prompt = generateExercisePrompt(['A1'], ['present-indicative'], ['Present Indicative'])
      
      expect(prompt).toContain('português europeu')
    })

    it('should include person rules', () => {
      const prompt = generateExercisePrompt(['A1'], ['present-indicative'], ['Present Indicative'])
      
      expect(prompt).toContain('REGRAS PARA A PESSOA')
      expect(prompt).toContain('NÃO incluas "person" se o sujeito está explícito')
    })

    it('should include examples', () => {
      const prompt = generateExercisePrompt(['A1'], ['present-indicative'], ['Present Indicative'])
      
      expect(prompt).toContain('Exemplo 1')
      expect(prompt).toContain('Exemplo 2')
      expect(prompt).toContain('O menino ___ alto')
    })
  })

  describe('generateMultipleChoicePrompt', () => {
    const mockExercise = {
      sentence: 'Eu ___ português.',
      correctAnswer: 'falo',
      level: 'A1',
      topic: 'present-indicative',
      hint: {
        infinitive: 'falar',
        form: 'present indicative'
      }
    }

    it('should generate Portuguese prompt', () => {
      const prompt = generateMultipleChoicePrompt(mockExercise, 'pt' as ExplanationLanguage)
      
      expect(prompt).toContain('És um professor de português europeu')
      expect(prompt).toContain('Eu ___ português.')
      expect(prompt).toContain('falo')
      expect(prompt).toContain('A1')
      expect(prompt).toContain('present-indicative')
    })

    it('should generate English prompt', () => {
      const prompt = generateMultipleChoicePrompt(mockExercise, 'en' as ExplanationLanguage)
      
      expect(prompt).toContain('You are a European Portuguese teacher')
      expect(prompt).toContain('Eu ___ português.')
      expect(prompt).toContain('falo')
      expect(prompt).toContain('A1')
      expect(prompt).toContain('present-indicative')
    })

    it('should generate Ukrainian prompt', () => {
      const prompt = generateMultipleChoicePrompt(mockExercise, 'uk' as ExplanationLanguage)
      
      expect(prompt).toContain('Ти викладач європейської португальської мови')
      expect(prompt).toContain('Eu ___ português.')
      expect(prompt).toContain('falo')
      expect(prompt).toContain('A1')
      expect(prompt).toContain('present-indicative')
    })

    it('should include distractor rules', () => {
      const prompt = generateMultipleChoicePrompt(mockExercise, 'en' as ExplanationLanguage)
      
      expect(prompt).toContain('same grammatical category')
      expect(prompt).toContain('plausible but wrong')
      expect(prompt).toContain('common mistakes')
      expect(prompt).toContain('COMPLETELY DIFFERENT')
    })

    it('should include case sensitivity warning', () => {
      const prompt = generateMultipleChoicePrompt(mockExercise, 'en' as ExplanationLanguage)
      
      expect(prompt).toContain('DO NOT use "falo"')
      expect(prompt).toContain('different case')
    })

    it('should handle exercise without hint', () => {
      const exerciseWithoutHint = {
        sentence: 'Eu ___ português.',
        correctAnswer: 'falo',
        level: 'A1',
        topic: 'present-indicative'
      }
      
      const prompt = generateMultipleChoicePrompt(exerciseWithoutHint, 'en' as ExplanationLanguage)
      
      expect(prompt).toContain('Hint: None')
    })

    it('should include JSON response format', () => {
      const prompt = generateMultipleChoicePrompt(mockExercise, 'en' as ExplanationLanguage)
      
      expect(prompt).toContain('JSON array of strings')
      expect(prompt).toContain('["distractor1", "distractor2", "distractor3"]')
    })

    it('should handle partial hint information', () => {
      const exerciseWithPartialHint = {
        sentence: 'Eu ___ português.',
        correctAnswer: 'falo',
        level: 'A1',
        topic: 'present-indicative',
        hint: {
          infinitive: 'falar'
        }
      }
      
      const prompt = generateMultipleChoicePrompt(exerciseWithPartialHint, 'en' as ExplanationLanguage)
      
      expect(prompt).toContain('falar')
      expect(prompt).not.toContain('undefined')
    })
  })
})