import { render, screen } from '@testing-library/react'
import FeedbackDisplay from '@/components/learning/FeedbackDisplay'

describe('FeedbackDisplay', () => {
  it('should render nothing when feedback is null', () => {
    const { container } = render(
      <FeedbackDisplay feedback={null} appLanguage="en" />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render correct feedback with green styling', () => {
    const feedback = {
      isCorrect: true,
      explanation: 'Correct! You used the right form.'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText('Correct! You used the right form.')
    expect(feedbackElement).toBeInTheDocument()
    expect(feedbackElement).toHaveStyle('color: var(--neo-success)')
  })

  it('should render incorrect feedback with red styling', () => {
    const feedback = {
      isCorrect: false,
      explanation: 'Incorrect. The correct answer is "falo".'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText('Incorrect. The correct answer is "falo".')
    expect(feedbackElement).toBeInTheDocument()
    expect(feedbackElement).toHaveStyle('color: var(--neo-error)')
  })

  it('should apply correct CSS classes', () => {
    const feedback = {
      isCorrect: true,
      explanation: 'Correct!'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText('Correct!')
    expect(feedbackElement).toHaveClass('neo-inset', 'text-lg', 'sm:text-xl', 'p-3', 'sm:p-4', 'mb-4', 'sm:mb-6')
  })

  it('should handle empty explanation', () => {
    const feedback = {
      isCorrect: true,
      explanation: ''
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText('')
    expect(feedbackElement).toBeInTheDocument()
  })

  it('should handle long explanations', () => {
    const feedback = {
      isCorrect: false,
      explanation: 'This is a very long explanation that goes into detail about why the answer is incorrect and provides comprehensive guidance on how to improve. It includes multiple sentences and detailed grammatical explanations.'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText(feedback.explanation)
    expect(feedbackElement).toBeInTheDocument()
  })

  it('should handle explanations with special characters', () => {
    const feedback = {
      isCorrect: true,
      explanation: 'Correto! Você usou a forma correta do presente do indicativo: "está".'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="pt" />)

    const feedbackElement = screen.getByText(feedback.explanation)
    expect(feedbackElement).toBeInTheDocument()
  })

  it('should handle explanations with HTML entities', () => {
    const feedback = {
      isCorrect: false,
      explanation: 'The answer should be "está" not "esta" - note the accent!'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText(feedback.explanation)
    expect(feedbackElement).toBeInTheDocument()
  })

  it('should handle different app languages', () => {
    const feedback = {
      isCorrect: true,
      explanation: 'Правильно! Ви використали правильну форму.'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="uk" />)

    const feedbackElement = screen.getByText('Правильно! Ви використали правильну форму.')
    expect(feedbackElement).toBeInTheDocument()
  })

  it('should handle feedback with newlines', () => {
    const feedback = {
      isCorrect: false,
      explanation: 'Incorrect.\nThe correct answer is "falo".\nThis is the first person singular form.'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText(feedback.explanation)
    expect(feedbackElement).toBeInTheDocument()
  })

  it('should handle feedback with quotes', () => {
    const feedback = {
      isCorrect: true,
      explanation: 'Correct! You used "falo" which is the correct form.'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText(feedback.explanation)
    expect(feedbackElement).toBeInTheDocument()
  })

  it('should be responsive with different screen sizes', () => {
    const feedback = {
      isCorrect: true,
      explanation: 'Correct!'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText('Correct!')
    expect(feedbackElement).toHaveClass('text-lg', 'sm:text-xl')
    expect(feedbackElement).toHaveClass('p-3', 'sm:p-4')
    expect(feedbackElement).toHaveClass('mb-4', 'sm:mb-6')
  })

  it('should handle feedback object with additional properties', () => {
    const feedback = {
      isCorrect: true,
      explanation: 'Correct!',
      additionalInfo: 'This is extra info',
      timestamp: new Date().toISOString()
    } as any

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText('Correct!')
    expect(feedbackElement).toBeInTheDocument()
    // Should ignore additional properties
    expect(screen.queryByText('This is extra info')).not.toBeInTheDocument()
  })

  it('should handle boolean values correctly', () => {
    const correctFeedback = {
      isCorrect: true,
      explanation: 'Correct!'
    }

    const incorrectFeedback = {
      isCorrect: false,
      explanation: 'Incorrect!'
    }

    const { rerender } = render(
      <FeedbackDisplay feedback={correctFeedback} appLanguage="en" />
    )

    let feedbackElement = screen.getByText('Correct!')
    expect(feedbackElement).toHaveStyle('color: var(--neo-success)')

    rerender(<FeedbackDisplay feedback={incorrectFeedback} appLanguage="en" />)

    feedbackElement = screen.getByText('Incorrect!')
    expect(feedbackElement).toHaveStyle('color: var(--neo-error)')
  })

  it('should handle explanation with markup-like content', () => {
    const feedback = {
      isCorrect: false,
      explanation: 'The answer should be <strong>falo</strong> not <em>fala</em>.'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    // Should render as plain text, not HTML
    const feedbackElement = screen.getByText(feedback.explanation)
    expect(feedbackElement).toBeInTheDocument()
  })

  it('should handle very short explanations', () => {
    const feedback = {
      isCorrect: true,
      explanation: 'OK'
    }

    render(<FeedbackDisplay feedback={feedback} appLanguage="en" />)

    const feedbackElement = screen.getByText('OK')
    expect(feedbackElement).toBeInTheDocument()
  })

  it('should handle feedback state changes', () => {
    const correctFeedback = {
      isCorrect: true,
      explanation: 'Correct!'
    }

    const incorrectFeedback = {
      isCorrect: false,
      explanation: 'Incorrect!'
    }

    const { rerender } = render(
      <FeedbackDisplay feedback={correctFeedback} appLanguage="en" />
    )

    expect(screen.getByText('Correct!')).toBeInTheDocument()

    rerender(<FeedbackDisplay feedback={incorrectFeedback} appLanguage="en" />)

    expect(screen.getByText('Incorrect!')).toBeInTheDocument()
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument()

    rerender(<FeedbackDisplay feedback={null} appLanguage="en" />)

    expect(screen.queryByText('Incorrect!')).not.toBeInTheDocument()
  })
})