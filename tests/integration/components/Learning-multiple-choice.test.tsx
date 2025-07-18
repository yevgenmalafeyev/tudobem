import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Learning from '@/components/Learning'
import { useStore } from '@/store/useStore'

// Mock the store
jest.mock('@/store/useStore')
const mockUseStore = useStore as jest.MockedFunction<typeof useStore>

// Mock the analytics hook
jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackExerciseGenerated: jest.fn(),
    trackQuestionAnswered: jest.fn(),
    trackModeChanged: jest.fn(),
    startResponseTimer: jest.fn()
  })
}))

// Mock PWA detection
jest.mock('@/utils/pwaDetection', () => ({
  isMobileDevice: () => false
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('Learning Component - Multiple Choice Options', () => {
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

  const mockConfiguration = {
    selectedLevels: ['A1'],
    selectedTopics: ['present-indicative'],
    claudeApiKey: 'test-key',
    appLanguage: 'en'
  }

  const mockProgress = {
    masteredWords: {}
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseStore.mockReturnValue({
      currentExercise: mockExercise,
      setCurrentExercise: jest.fn(),
      addIncorrectAnswer: jest.fn(),
      addMasteredWord: jest.fn(),
      configuration: mockConfiguration,
      progress: mockProgress
    })
  })

  it('should always include correct answer in multiple choice options', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        options: ['falo', 'fala', 'falamos', 'falam']
      })
    } as Response)

    render(<Learning />)

    // Switch to multiple choice mode
    const multipleChoiceButton = screen.getByText('Show options')
    fireEvent.click(multipleChoiceButton)

    await waitFor(() => {
      expect(screen.getByText('falo')).toBeInTheDocument()
    })

    // Check that correct answer is available as an option
    const correctOption = screen.getByText('falo')
    expect(correctOption).toBeInTheDocument()
    expect(correctOption.closest('button')).toBeInTheDocument()
  })

  it('should handle API failure and still provide correct answer', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockRejectedValueOnce(new Error('API failed'))

    render(<Learning />)

    // Switch to multiple choice mode
    const multipleChoiceButton = screen.getByText('Show options')
    fireEvent.click(multipleChoiceButton)

    await waitFor(() => {
      // Should still show options even when API fails
      expect(screen.getByText('falo')).toBeInTheDocument()
    })

    // Check that correct answer is still available
    const correctOption = screen.getByText('falo')
    expect(correctOption).toBeInTheDocument()
  })

  it('should handle empty API response and generate fallback options', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        options: []
      })
    } as Response)

    render(<Learning />)

    // Switch to multiple choice mode
    const multipleChoiceButton = screen.getByText('Show options')
    fireEvent.click(multipleChoiceButton)

    await waitFor(() => {
      // Should generate fallback options that include correct answer
      expect(screen.getByText('falo')).toBeInTheDocument()
    })
  })

  it('should handle different exercise types correctly', async () => {
    const articleExercise = {
      ...mockExercise,
      correctAnswer: 'a',
      sentence: '___ casa é bonita.',
      topic: 'articles'
    }

    mockUseStore.mockReturnValue({
      currentExercise: articleExercise,
      setCurrentExercise: jest.fn(),
      addIncorrectAnswer: jest.fn(),
      addMasteredWord: jest.fn(),
      configuration: mockConfiguration,
      progress: mockProgress
    })

    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        options: ['a', 'o', 'as', 'os']
      })
    } as Response)

    render(<Learning />)

    // Switch to multiple choice mode
    const multipleChoiceButton = screen.getByText('Show options')
    fireEvent.click(multipleChoiceButton)

    await waitFor(() => {
      expect(screen.getByText('a')).toBeInTheDocument()
    })
  })

  it('should handle special characters in correct answer', async () => {
    const specialExercise = {
      ...mockExercise,
      correctAnswer: 'não',
      sentence: 'Eu ___ falo português.',
      topic: 'negation'
    }

    mockUseStore.mockReturnValue({
      currentExercise: specialExercise,
      setCurrentExercise: jest.fn(),
      addIncorrectAnswer: jest.fn(),
      addMasteredWord: jest.fn(),
      configuration: mockConfiguration,
      progress: mockProgress
    })

    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        options: ['não', 'sim', 'talvez', 'nunca']
      })
    } as Response)

    render(<Learning />)

    // Switch to multiple choice mode
    const multipleChoiceButton = screen.getByText('Show options')
    fireEvent.click(multipleChoiceButton)

    await waitFor(() => {
      expect(screen.getByText('não')).toBeInTheDocument()
    })
  })

  it('should allow selecting the correct answer', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        options: ['falo', 'fala', 'falamos', 'falam']
      })
    } as Response)

    render(<Learning />)

    // Switch to multiple choice mode
    const multipleChoiceButton = screen.getByText('Show options')
    fireEvent.click(multipleChoiceButton)

    await waitFor(() => {
      expect(screen.getByText('falo')).toBeInTheDocument()
    })

    // Select the correct answer
    const correctOption = screen.getByText('falo')
    fireEvent.click(correctOption)

    // Should be selectable
    expect(correctOption.closest('button')).toHaveAttribute('aria-selected', 'true')
  })

  it('should handle long words correctly', async () => {
    const longWordExercise = {
      ...mockExercise,
      correctAnswer: 'responsabilidade',
      sentence: 'A ___ é importante.',
      topic: 'nouns'
    }

    mockUseStore.mockReturnValue({
      currentExercise: longWordExercise,
      setCurrentExercise: jest.fn(),
      addIncorrectAnswer: jest.fn(),
      addMasteredWord: jest.fn(),
      configuration: mockConfiguration,
      progress: mockProgress
    })

    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        options: ['responsabilidade', 'responsabilidades', 'responsável', 'responsáveis']
      })
    } as Response)

    render(<Learning />)

    // Switch to multiple choice mode
    const multipleChoiceButton = screen.getByText('Show options')
    fireEvent.click(multipleChoiceButton)

    await waitFor(() => {
      expect(screen.getByText('responsabilidade')).toBeInTheDocument()
    })
  })

  it('should handle single character answers', async () => {
    const singleCharExercise = {
      ...mockExercise,
      correctAnswer: 'é',
      sentence: 'Ele ___ professor.',
      topic: 'verbs'
    }

    mockUseStore.mockReturnValue({
      currentExercise: singleCharExercise,
      setCurrentExercise: jest.fn(),
      addIncorrectAnswer: jest.fn(),
      addMasteredWord: jest.fn(),
      configuration: mockConfiguration,
      progress: mockProgress
    })

    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        options: ['é', 'são', 'está', 'estava']
      })
    } as Response)

    render(<Learning />)

    // Switch to multiple choice mode
    const multipleChoiceButton = screen.getByText('Show options')
    fireEvent.click(multipleChoiceButton)

    await waitFor(() => {
      expect(screen.getByText('é')).toBeInTheDocument()
    })
  })

  it('should not show duplicate options', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        options: ['falo', 'falo', 'fala', 'fala'] // Duplicates
      })
    } as Response)

    render(<Learning />)

    // Switch to multiple choice mode
    const multipleChoiceButton = screen.getByText('Show options')
    fireEvent.click(multipleChoiceButton)

    await waitFor(() => {
      expect(screen.getByText('falo')).toBeInTheDocument()
    })

    // Count occurrences of 'falo' buttons
    const faloButtons = screen.getAllByText('falo')
    expect(faloButtons).toHaveLength(1) // Should only appear once
  })

  it('should handle network timeout gracefully', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockImplementationOnce(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 100)
      )
    )

    render(<Learning />)

    // Switch to multiple choice mode
    const multipleChoiceButton = screen.getByText('Show options')
    fireEvent.click(multipleChoiceButton)

    await waitFor(() => {
      // Should still show fallback options including correct answer
      expect(screen.getByText('falo')).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})