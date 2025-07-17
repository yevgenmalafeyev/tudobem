import { renderHook, act, waitFor } from '@testing-library/react'
import { useExerciseGeneration } from '@/hooks/useExerciseGeneration'
import { server } from '@/src/__mocks__/server'

// Mock the configuration
const mockConfiguration = {
  levels: ['A1', 'A2'],
  selectedTopics: ['present-indicative'],
  topicNames: ['Present Indicative'],
  explanationLanguage: 'en' as const,
  claudeApiKey: 'test-key',
  appLanguage: 'en' as const
}

// Mock functions
const mockSetCurrentExercise = jest.fn()
const mockSetMultipleChoiceOptions = jest.fn()
const mockSetIsLoading = jest.fn()
const mockResetState = jest.fn()
const mockFocusInput = jest.fn()

const mockProps = {
  configuration: mockConfiguration,
  learningMode: 'input' as const,
  setCurrentExercise: mockSetCurrentExercise,
  setMultipleChoiceOptions: mockSetMultipleChoiceOptions,
  setIsLoading: mockSetIsLoading,
  resetState: mockResetState,
  focusInput: mockFocusInput
}

// Start MSW server
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})
afterAll(() => server.close())

describe('useExerciseGeneration hook', () => {
  it('should generate new exercise successfully', async () => {
    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    await act(async () => {
      await result.current.generateNewExercise()
    })

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      expect(mockResetState).toHaveBeenCalled()
      expect(mockSetCurrentExercise).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          sentence: expect.any(String),
          correctAnswer: expect.any(String),
          topic: expect.any(String),
          level: expect.any(String)
        })
      )
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
      expect(mockFocusInput).toHaveBeenCalled()
    })
  })

  it('should handle API error and fallback to offline exercise', async () => {
    // Mock API error
    server.use(
      rest.post('/api/generate-exercise', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'API Error' }))
      })
    )

    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    await act(async () => {
      await result.current.generateNewExercise()
    })

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      expect(mockResetState).toHaveBeenCalled()
      expect(mockSetCurrentExercise).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          sentence: expect.any(String),
          correctAnswer: expect.any(String),
          topic: expect.any(String),
          level: expect.any(String)
        })
      )
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
      expect(mockFocusInput).toHaveBeenCalled()
    })
  })

  it('should generate multiple choice options successfully', async () => {
    const mockExercise = {
      id: '1',
      sentence: 'Eu ___ português.',
      gapIndex: 1,
      correctAnswer: 'falo',
      topic: 'present-indicative',
      level: 'A1' as const,
      hint: {
        infinitive: 'falar',
        form: 'present indicative'
      }
    }

    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    await act(async () => {
      await result.current.generateMultipleChoiceOptions(mockExercise)
    })

    await waitFor(() => {
      expect(mockSetMultipleChoiceOptions).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.any(String)
        ])
      )
    })
  })

  it('should handle multiple choice generation error with fallback', async () => {
    // Mock API error
    server.use(
      rest.post('/api/generate-multiple-choice', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'API Error' }))
      })
    )

    const mockExercise = {
      id: '1',
      sentence: 'Eu ___ português.',
      gapIndex: 1,
      correctAnswer: 'falo',
      topic: 'present-indicative',
      level: 'A1' as const,
      hint: {
        infinitive: 'falar',
        form: 'present indicative'
      }
    }

    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    await act(async () => {
      await result.current.generateMultipleChoiceOptions(mockExercise)
    })

    await waitFor(() => {
      expect(mockSetMultipleChoiceOptions).toHaveBeenCalledWith(
        expect.arrayContaining([
          'falo', // Should include correct answer
          expect.any(String)
        ])
      )
    })
  })

  it('should use correct API parameters', async () => {
    let requestBody: any
    
    server.use(
      rest.post('/api/generate-exercise', async (req, res, ctx) => {
        requestBody = await req.json()
        return res(ctx.json({
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
        }))
      })
    )

    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    await act(async () => {
      await result.current.generateNewExercise()
    })

    await waitFor(() => {
      expect(requestBody).toEqual({
        levels: ['A1', 'A2'],
        selectedTopics: ['present-indicative'],
        topicNames: ['Present Indicative'],
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })
  })

  it('should handle multiple choice API parameters correctly', async () => {
    let requestBody: any
    
    server.use(
      rest.post('/api/generate-multiple-choice', async (req, res, ctx) => {
        requestBody = await req.json()
        return res(ctx.json({
          options: ['falo', 'fala', 'falamos', 'falam']
        }))
      })
    )

    const mockExercise = {
      id: '1',
      sentence: 'Eu ___ português.',
      gapIndex: 1,
      correctAnswer: 'falo',
      topic: 'present-indicative',
      level: 'A1' as const,
      hint: {
        infinitive: 'falar',
        form: 'present indicative'
      }
    }

    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    await act(async () => {
      await result.current.generateMultipleChoiceOptions(mockExercise)
    })

    await waitFor(() => {
      expect(requestBody).toEqual({
        exercise: mockExercise,
        claudeApiKey: 'test-key',
        explanationLanguage: 'en'
      })
    })
  })

  it('should handle loading states correctly', async () => {
    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    const generatePromise = act(async () => {
      await result.current.generateNewExercise()
    })

    // Should set loading to true initially
    expect(mockSetIsLoading).toHaveBeenCalledWith(true)

    await generatePromise

    // Should set loading to false after completion
    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
    })
  })

  it('should reset state before generating new exercise', async () => {
    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    await act(async () => {
      await result.current.generateNewExercise()
    })

    await waitFor(() => {
      expect(mockResetState).toHaveBeenCalled()
    })
  })

  it('should focus input after generating exercise', async () => {
    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    await act(async () => {
      await result.current.generateNewExercise()
    })

    await waitFor(() => {
      expect(mockFocusInput).toHaveBeenCalled()
    })
  })

  it('should handle network errors gracefully', async () => {
    // Mock network error
    server.use(
      rest.post('/api/generate-exercise', (req, res, ctx) => {
        return res.networkError('Network error')
      })
    )

    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    await act(async () => {
      await result.current.generateNewExercise()
    })

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
      expect(mockSetCurrentExercise).toHaveBeenCalled()
    })
  })

  it('should handle invalid API response gracefully', async () => {
    // Mock invalid response
    server.use(
      rest.post('/api/generate-exercise', (req, res, ctx) => {
        return res(ctx.json({ invalid: 'response' }))
      })
    )

    const { result } = renderHook(() => useExerciseGeneration(mockProps))

    await act(async () => {
      await result.current.generateNewExercise()
    })

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true)
      expect(mockSetIsLoading).toHaveBeenCalledWith(false)
      expect(mockSetCurrentExercise).toHaveBeenCalled()
    })
  })
})

// Need to import rest for the test
import { rest } from 'msw'