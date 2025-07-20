import { NextRequest } from 'next/server'
import { POST } from '@/app/api/generate-multiple-choice/route'

// Mock the services
jest.mock('@/services/multipleChoiceService', () => ({
  generateBasicDistractors: jest.fn(() => ['fala', 'falamos', 'falam']),
  processMultipleChoiceOptions: jest.fn((correctAnswer, distractors) => {
    // Always include the correct answer plus the distractors
    return [correctAnswer, ...distractors].slice(0, 4)
  })
}))

// Mock the array shuffle utility
jest.mock('@/utils/arrays', () => ({
  shuffleArray: jest.fn((arr) => [...arr])
}))

describe('/api/generate-multiple-choice', () => {
  const mockExercise = {
    id: 'test-1',
    sentence: 'Eu ___ português.',
    gapIndex: 1,
    correctAnswer: 'falo',
    topic: 'present-indicative',
    level: 'A1',
    hint: {
      infinitive: 'falar',
      form: 'present indicative'
    }
  }

  it('should generate multiple choice options without API key', async () => {
    const requestBody = {
      exercise: mockExercise,
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost:3000/api/generate-multiple-choice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.options).toBeDefined()
    expect(Array.isArray(data.options)).toBe(true)
    expect(data.options.length).toBeGreaterThan(0)
    expect(data.options).toContain('falo') // Always includes correct answer
  })

  it('should generate multiple choice options with API key but fallback on error', async () => {
    const requestBody = {
      exercise: mockExercise,
      claudeApiKey: 'invalid-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost:3000/api/generate-multiple-choice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.options).toBeDefined()
    expect(Array.isArray(data.options)).toBe(true)
    expect(data.options.length).toBeGreaterThan(0)
    expect(data.options).toContain('falo') // Always includes correct answer
  })

  it('should handle different exercise types', async () => {
    const articleExercise = {
      ...mockExercise,
      correctAnswer: 'a',
      sentence: '___ casa é bonita.',
      topic: 'articles'
    }

    const requestBody = {
      exercise: articleExercise,
      explanationLanguage: 'pt'
    }

    const request = new NextRequest('http://localhost:3000/api/generate-multiple-choice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.options).toBeDefined()
    expect(data.options).toContain('a') // Always includes correct answer
  })

  it('should handle missing exercise data', async () => {
    const requestBody = {
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost:3000/api/generate-multiple-choice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toContain('Exercise data with correctAnswer is required')
  })

  it('should handle invalid JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate-multiple-choice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json'
    })

    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid JSON in request body')
  })

  it('should always return correct answer in options regardless of input', async () => {
    const testCases = [
      { correctAnswer: 'falo', expected: 'falo' },
      { correctAnswer: 'está', expected: 'está' },
      { correctAnswer: 'é', expected: 'é' },
      { correctAnswer: 'responsabilidade', expected: 'responsabilidade' }
    ]

    for (const testCase of testCases) {
      const exercise = {
        ...mockExercise,
        correctAnswer: testCase.correctAnswer
      }

      const requestBody = {
        exercise,
        explanationLanguage: 'en'
      }

      const request = new NextRequest('http://localhost:3000/api/generate-multiple-choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.options).toContain(testCase.expected)
    }
  })

  it('should handle special characters in correct answer', async () => {
    const exercise = {
      ...mockExercise,
      correctAnswer: 'não',
      sentence: 'Eu ___ falo português.',
      topic: 'negation'
    }

    const requestBody = {
      exercise,
      explanationLanguage: 'pt'
    }

    const request = new NextRequest('http://localhost:3000/api/generate-multiple-choice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.options).toContain('não')
  })

  it('should return unique options', async () => {
    const requestBody = {
      exercise: mockExercise,
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost:3000/api/generate-multiple-choice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    
    const uniqueOptions = [...new Set(data.options)]
    expect(data.options.length).toBe(uniqueOptions.length)
  })

  it('should handle empty strings and null values in exercise', async () => {
    const exercise = {
      ...mockExercise,
      correctAnswer: '',
      sentence: 'Test sentence ___.',
    }

    const requestBody = {
      exercise,
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost:3000/api/generate-multiple-choice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    
    // Should handle gracefully, even with empty correct answer
    expect(response.status).toBe(200)
  })
})