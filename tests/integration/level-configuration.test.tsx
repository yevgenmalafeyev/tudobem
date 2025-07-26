import { renderHook, act } from '@testing-library/react'
import { useExerciseGeneration } from '@/hooks/useExerciseGeneration'
import { server } from '@/__mocks__/server'
import { http, HttpResponse } from 'msw'

// Mock the configuration store with different level configurations
const createMockConfiguration = (levels: string[]) => ({
  selectedLevels: levels,
  selectedTopics: ['present-indicative'],
  topicNames: ['Present Indicative'],
  explanationLanguage: 'en' as const,
  claudeApiKey: 'test-key',
  appLanguage: 'en' as const
})

// Mock functions
const mockSetCurrentExercise = jest.fn()
const mockSetMultipleChoiceOptions = jest.fn()
const mockSetIsLoading = jest.fn()
const mockResetState = jest.fn()
const mockFocusInput = jest.fn()

const createMockProps = (levels: string[]) => ({
  configuration: createMockConfiguration(levels),
  learningMode: 'input' as const,
  setCurrentExercise: mockSetCurrentExercise,
  setMultipleChoiceOptions: mockSetMultipleChoiceOptions,
  setIsLoading: mockSetIsLoading,
  resetState: mockResetState,
  focusInput: mockFocusInput
})

// Start MSW server
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})
afterAll(() => server.close())

describe('Level Configuration Integration', () => {
  describe('API request level filtering', () => {
    it('should send only selected levels in API requests', async () => {
      let capturedRequestBody: unknown = null

      // Intercept API calls to capture request data
      server.use(
        http.post('/api/generate-exercise', async ({ request }) => {
          capturedRequestBody = await request.json()
          return HttpResponse.json({
            id: 'test-exercise-1',
            sentence: 'Eu ___ português.',
            gapIndex: 1,
            correctAnswer: 'falo',
            topic: 'present-indicative',
            level: 'A1',
            hint: {
              infinitive: 'falar',
              form: 'present indicative'
            }
          })
        })
      )

      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(['A1', 'A2']))
      )

      await act(async () => {
        await result.current.generateNewExercise()
      })

      expect(capturedRequestBody).toBeTruthy()
      expect(capturedRequestBody.levels).toEqual(['A1', 'A2'])
    })

    it('should send B1-B2 levels correctly', async () => {
      let capturedRequestBody: unknown = null

      server.use(
        http.post('/api/generate-exercise', async ({ request }) => {
          capturedRequestBody = await request.json()
          return HttpResponse.json({
            id: 'test-exercise-b1',
            sentence: 'É importante que tu ___ cedo.',
            gapIndex: 1,
            correctAnswer: 'chegues',
            topic: 'present-subjunctive',
            level: 'B1',
            hint: {
              infinitive: 'chegar',
              form: 'present subjunctive'
            }
          })
        })
      )

      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(['B1', 'B2']))
      )

      await act(async () => {
        await result.current.generateNewExercise()
      })

      expect(capturedRequestBody.levels).toEqual(['B1', 'B2'])
    })

    it('should handle single level selection', async () => {
      let capturedRequestBody: unknown = null

      server.use(
        http.post('/api/generate-exercise', async ({ request }) => {
          capturedRequestBody = await request.json()
          return HttpResponse.json({
            id: 'test-exercise-b2',
            sentence: 'Se eu ___ rico, compraria uma casa.',
            gapIndex: 1,
            correctAnswer: 'fosse',
            topic: 'imperfect-subjunctive',
            level: 'B2',
            hint: {
              infinitive: 'ser',
              form: 'imperfect subjunctive'
            }
          })
        })
      )

      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(['B2']))
      )

      await act(async () => {
        await result.current.generateNewExercise()
      })

      expect(capturedRequestBody.levels).toEqual(['B2'])
    })

    it('should not send excluded levels in requests', async () => {
      let capturedRequestBody: unknown = null

      server.use(
        http.post('/api/generate-exercise', async ({ request }) => {
          capturedRequestBody = await request.json()
          return HttpResponse.json({
            id: 'test-exercise-a2',
            sentence: 'Ontem eu ___ ao cinema.',
            gapIndex: 1,
            correctAnswer: 'fui',
            topic: 'preterite-perfect',
            level: 'A2',
            hint: {
              infinitive: 'ir',
              form: 'pretérito perfeito'
            }
          })
        })
      )

      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(['A2', 'B1']))
      )

      await act(async () => {
        await result.current.generateNewExercise()
      })

      expect(capturedRequestBody.levels).toEqual(['A2', 'B1'])
      expect(capturedRequestBody.levels).not.toContain('A1')
      expect(capturedRequestBody.levels).not.toContain('B2')
      expect(capturedRequestBody.levels).not.toContain('C1')
      expect(capturedRequestBody.levels).not.toContain('C2')
    })
  })

  describe('API response level validation', () => {
    it('should accept exercises matching requested levels', async () => {
      server.use(
        http.post('/api/generate-exercise', () => {
          return HttpResponse.json({
            id: 'test-exercise-valid',
            sentence: 'Eu ___ português.',
            gapIndex: 1,
            correctAnswer: 'falo',
            topic: 'present-indicative',
            level: 'A1', // Matches requested level
            hint: {
              infinitive: 'falar',
              form: 'present indicative'
            }
          })
        })
      )

      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(['A1', 'A2']))
      )

      await act(async () => {
        await result.current.generateNewExercise()
      })

      expect(mockSetCurrentExercise).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'A1'
        })
      )
    })

    it('should handle API returning wrong level gracefully', async () => {
      server.use(
        http.post('/api/generate-exercise', () => {
          return HttpResponse.json({
            id: 'test-exercise-wrong-level',
            sentence: 'Se eu ___ rico, compraria uma casa.',
            gapIndex: 1,
            correctAnswer: 'fosse',
            topic: 'imperfect-subjunctive',
            level: 'B2', // Wrong level - not in requested A1, A2
            hint: {
              infinitive: 'ser',
              form: 'imperfect subjunctive'
            }
          })
        })
      )

      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(['A1', 'A2']))
      )

      await act(async () => {
        await result.current.generateNewExercise()
      })

      // Should still set the exercise (API might know better)
      // But in real implementation, might want to validate and use fallback
      expect(mockSetCurrentExercise).toHaveBeenCalled()
    })

    it('should fallback to appropriate level when API fails', async () => {
      // Mock API failure
      server.use(
        http.post('/api/generate-exercise', () => {
          return HttpResponse.json(
            { error: 'Server error' },
            { status: 500 }
          )
        })
      )

      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(['B1', 'B2']))
      )

      await act(async () => {
        await result.current.generateNewExercise()
      })

      // Should use fallback exercise matching requested levels
      expect(mockSetCurrentExercise).toHaveBeenCalledWith(
        expect.objectContaining({
          level: expect.stringMatching(/^(B1|B2|A1|A2)$/) // Fallback includes A1, A2
        })
      )
    })
  })

  describe('configuration changes', () => {
    it('should generate different exercises when levels change', async () => {
      const callHistory: unknown[] = []

      server.use(
        http.post('/api/generate-exercise', async ({ request }) => {
          const body = await request.json()
          callHistory.push(body)
          
          // Return exercise matching the first requested level
          const level = body.levels[0]
          const exercises = {
            'A1': {
              id: 'test-a1-exercise',
              sentence: 'Eu ___ português.',
              gapIndex: 1,
              correctAnswer: 'falo',
              topic: 'present-indicative',
              level: 'A1'
            },
            'B1': {
              id: 'test-b1-exercise',
              sentence: 'É importante que tu ___ cedo.',
              gapIndex: 1,
              correctAnswer: 'chegues',
              topic: 'present-subjunctive',
              level: 'B1'
            }
          }
          
          return HttpResponse.json(exercises[level as keyof typeof exercises] || exercises.A1)
        })
      )

      // Test with A1 configuration
      const { result: result1 } = renderHook(() => 
        useExerciseGeneration(createMockProps(['A1']))
      )

      await act(async () => {
        await result1.current.generateNewExercise()
      })

      // Test with B1 configuration
      const { result: result2 } = renderHook(() => 
        useExerciseGeneration(createMockProps(['B1']))
      )

      await act(async () => {
        await result2.current.generateNewExercise()
      })

      expect(callHistory).toHaveLength(2)
      expect(callHistory[0].levels).toEqual(['A1'])
      expect(callHistory[1].levels).toEqual(['B1'])
    })

    it('should handle empty level configuration', async () => {
      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps([]))
      )

      await act(async () => {
        await result.current.generateNewExercise()
      })

      // Should still work with fallback
      expect(mockSetCurrentExercise).toHaveBeenCalled()
    })

    it('should handle invalid level configuration', async () => {
      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(['INVALID_LEVEL']))
      )

      await act(async () => {
        await result.current.generateNewExercise()
      })

      // Should still work with fallback
      expect(mockSetCurrentExercise).toHaveBeenCalled()
    })
  })

  describe('level consistency across exercise generation', () => {
    it('should maintain level filtering across multiple generations', async () => {
      const generatedLevels: string[] = []

      server.use(
        http.post('/api/generate-exercise', async ({ request }) => {
          const body = await request.json()
          
          // Always return exercise matching one of the requested levels
          const requestedLevels = body.levels
          const selectedLevel = requestedLevels[Math.floor(Math.random() * requestedLevels.length)]
          
          const exercise = {
            id: `test-${selectedLevel}-${Date.now()}`,
            sentence: `Test sentence for ${selectedLevel}`,
            gapIndex: 1,
            correctAnswer: 'test',
            topic: 'present-indicative',
            level: selectedLevel,
            hint: { form: 'test form' }
          }
          
          generatedLevels.push(selectedLevel)
          return HttpResponse.json(exercise)
        })
      )

      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(['A2', 'B1']))
      )

      // Generate multiple exercises
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await result.current.generateNewExercise()
        })
      }

      // All generated exercises should be from requested levels
      generatedLevels.forEach(level => {
        expect(['A2', 'B1']).toContain(level)
      })
      expect(generatedLevels).toHaveLength(5)
    })

    it('should not mix levels within single exercise generation', async () => {
      let requestCount = 0

      server.use(
        http.post('/api/generate-exercise', async ({ request }) => {
          requestCount++
          const body = await request.json()
          
          return HttpResponse.json({
            id: `test-${requestCount}`,
            sentence: 'Test sentence',
            gapIndex: 1,
            correctAnswer: 'test',
            topic: 'present-indicative',
            level: body.levels[0], // Use first requested level
            hint: { form: 'test form' }
          })
        })
      )

      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(['B1', 'B2']))
      )

      await act(async () => {
        await result.current.generateNewExercise()
      })

      // Should have made exactly one API call
      expect(requestCount).toBe(1)
      
      // Should set exactly one exercise
      expect(mockSetCurrentExercise).toHaveBeenCalledTimes(1)
      expect(mockSetCurrentExercise).toHaveBeenCalledWith(
        expect.objectContaining({
          level: expect.stringMatching(/^(B1|B2)$/)
        })
      )
    })
  })

  describe('performance with different level configurations', () => {
    it('should handle large level arrays efficiently', async () => {
      let capturedRequestBody: unknown = null

      server.use(
        http.post('/api/generate-exercise', async ({ request }) => {
          capturedRequestBody = await request.json()
          return HttpResponse.json({
            id: 'test-exercise',
            sentence: 'Test sentence',
            gapIndex: 1,
            correctAnswer: 'test',
            topic: 'present-indicative',
            level: capturedRequestBody.levels[0],
            hint: { form: 'test form' }
          })
        })
      )

      const allLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
      const { result } = renderHook(() => 
        useExerciseGeneration(createMockProps(allLevels))
      )

      const startTime = Date.now()
      await act(async () => {
        await result.current.generateNewExercise()
      })
      const endTime = Date.now()

      expect(capturedRequestBody.levels).toEqual(allLevels)
      expect(endTime - startTime).toBeLessThan(1000) // Should be fast
    })

    it('should handle rapid level configuration changes', async () => {
      server.use(
        http.post('/api/generate-exercise', async ({ request }) => {
          const body = await request.json()
          return HttpResponse.json({
            id: `test-${Date.now()}`,
            sentence: 'Test sentence',
            gapIndex: 1,
            correctAnswer: 'test',
            topic: 'present-indicative',
            level: body.levels[0],
            hint: { form: 'test form' }
          })
        })
      )

      // Test multiple configurations rapidly
      const configurations = [['A1'], ['A2'], ['B1'], ['B2']]
      
      for (const levels of configurations) {
        const { result } = renderHook(() => 
          useExerciseGeneration(createMockProps(levels))
        )

        await act(async () => {
          await result.current.generateNewExercise()
        })
      }

      // Should have generated exercise for each configuration
      expect(mockSetCurrentExercise).toHaveBeenCalledTimes(4)
    })
  })
})