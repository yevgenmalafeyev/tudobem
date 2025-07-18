import { NextRequest } from 'next/server'
import { POST } from '@/app/api/generate-exercise/route'
import { server } from '../../src/__mocks__/server'

// Mock the getFallbackExercise function
jest.mock('@/services/exerciseService', () => ({
  getFallbackExercise: jest.fn(() => ({
    id: 'fallback-1',
    sentence: 'Eu ___ português.',
    gapIndex: 1,
    correctAnswer: 'falo',
    topic: 'present-indicative',
    level: 'A1',
    hint: {
      infinitive: 'falar',
      form: 'present indicative'
    }
  }))
}))

// Mock the generateExercisePrompt function
jest.mock('@/utils/prompts', () => ({
  generateExercisePrompt: jest.fn(() => 'Mock prompt for exercise generation')
}))

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => ({
  Anthropic: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{
          text: JSON.stringify({
            sentence: 'Eu ___ português.',
            correctAnswer: 'falo',
            topic: 'present-indicative',
            level: 'A1',
            hint: {
              infinitive: 'falar',
              form: 'present indicative'
            }
          })
        }]
      })
    }
  }))
}))

// Start MSW server
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})
afterAll(() => server.close())

describe('/api/generate-exercise', () => {
  it('should generate exercise with valid request', async () => {
    const requestBody = {
      levels: ['A1', 'A2'],
      selectedTopics: ['present-indicative'],
      topicNames: ['Present Indicative'],
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('sentence')
    expect(data).toHaveProperty('correctAnswer')
    expect(data).toHaveProperty('topic')
    expect(data).toHaveProperty('level')
    expect(data).toHaveProperty('gapIndex')
  })

  it('should return fallback exercise when API fails', async () => {
    // Mock Anthropic to throw error
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockRejectedValue(new Error('API Error'))
      }
    }))

    const requestBody = {
      levels: ['A1'],
      selectedTopics: ['present-indicative'],
      topicNames: ['Present Indicative'],
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('id', 'fallback-1')
    expect(data).toHaveProperty('sentence', 'Eu ___ português.')
    expect(data).toHaveProperty('correctAnswer', 'falo')
  })

  it('should return error for invalid request body', async () => {
    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: 'invalid json'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return error for missing required fields', async () => {
    const requestBody = {
      levels: ['A1'],
      // Missing other required fields
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return error for empty levels array', async () => {
    const requestBody = {
      levels: [],
      selectedTopics: ['present-indicative'],
      topicNames: ['Present Indicative'],
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return error for empty selectedTopics array', async () => {
    const requestBody = {
      levels: ['A1'],
      selectedTopics: [],
      topicNames: ['Present Indicative'],
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return error for missing API key', async () => {
    const requestBody = {
      levels: ['A1'],
      selectedTopics: ['present-indicative'],
      topicNames: ['Present Indicative'],
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should handle invalid API key', async () => {
    // Mock Anthropic to throw authentication error
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockRejectedValue(new Error('Authentication failed'))
      }
    }))

    const requestBody = {
      levels: ['A1'],
      selectedTopics: ['present-indicative'],
      topicNames: ['Present Indicative'],
      claudeApiKey: 'invalid-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('id', 'fallback-1')
  })

  it('should handle malformed AI response', async () => {
    // Mock Anthropic to return invalid JSON
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{
            text: 'Invalid JSON response'
          }]
        })
      }
    }))

    const requestBody = {
      levels: ['A1'],
      selectedTopics: ['present-indicative'],
      topicNames: ['Present Indicative'],
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('id', 'fallback-1')
  })

  it('should process multiple levels correctly', async () => {
    const requestBody = {
      levels: ['A1', 'A2', 'B1'],
      selectedTopics: ['present-indicative', 'ser-estar'],
      topicNames: ['Present Indicative', 'Ser vs Estar'],
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('level')
    expect(['A1', 'A2', 'B1']).toContain(data.level)
  })

  it('should handle different explanation languages', async () => {
    const requestBody = {
      levels: ['A1'],
      selectedTopics: ['present-indicative'],
      topicNames: ['Present Indicative'],
      claudeApiKey: 'test-key',
      explanationLanguage: 'pt'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('id')
  })

  it('should handle network timeout', async () => {
    // Mock Anthropic to simulate timeout
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockImplementation(() => 
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 100)
          )
        )
      }
    }))

    const requestBody = {
      levels: ['A1'],
      selectedTopics: ['present-indicative'],
      topicNames: ['Present Indicative'],
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('id', 'fallback-1')
  })

  it('should validate exercise structure from AI', async () => {
    // Mock Anthropic to return valid but incomplete exercise
    const { Anthropic } = require('@anthropic-ai/sdk')
    Anthropic.mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{
            text: JSON.stringify({
              sentence: 'Eu ___ português.',
              correctAnswer: 'falo',
              // Missing topic, level, etc.
            })
          }]
        })
      }
    }))

    const requestBody = {
      levels: ['A1'],
      selectedTopics: ['present-indicative'],
      topicNames: ['Present Indicative'],
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200) // Should still return 200 with fallback
    expect(data).toHaveProperty('id', 'fallback-1')
  })

  it('should handle large request payloads', async () => {
    const requestBody = {
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      selectedTopics: Array(50).fill('present-indicative'),
      topicNames: Array(50).fill('Present Indicative'),
      claudeApiKey: 'test-key',
      explanationLanguage: 'en'
    }

    const request = new NextRequest('http://localhost/api/generate-exercise', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('id')
  })
})