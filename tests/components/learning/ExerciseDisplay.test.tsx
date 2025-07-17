import { render, screen, fireEvent } from '@testing-library/react'
import { createRef } from 'react'
import ExerciseDisplay from '@/components/learning/ExerciseDisplay'

describe('ExerciseDisplay', () => {
  const mockExercise = {
    id: '1',
    sentence: 'Eu ___ português.',
    gapIndex: 1,
    correctAnswer: 'falo',
    topic: 'present-indicative',
    level: 'A1' as const,
    hint: {
      infinitive: 'falar',
      person: '1ª pessoa',
      form: 'present indicative'
    }
  }

  const mockSetUserAnswer = jest.fn()
  const mockInputRef = createRef<HTMLInputElement>()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render exercise sentence with input field', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByText('Eu')).toBeInTheDocument()
    expect(screen.getByText('português.')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render exercise sentence with question mark for multiple choice', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="multiple-choice"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByText('Eu')).toBeInTheDocument()
    expect(screen.getByText('português.')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('should display user answer in input field', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer="falo"
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('falo')
  })

  it('should call setUserAnswer when input value changes', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'falo' } })

    expect(mockSetUserAnswer).toHaveBeenCalledWith('falo')
  })

  it('should display correct answer when showAnswer is true and feedback is correct', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer="falo"
        selectedOption=""
        showAnswer={true}
        feedback={{ isCorrect: true, explanation: 'Correct!' }}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByText('falo')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('should display correct answer when showAnswer is true and feedback is incorrect', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer="fala"
        selectedOption=""
        showAnswer={true}
        feedback={{ isCorrect: false, explanation: 'Incorrect!' }}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByText('falo')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('should display selected option when showAnswer is true in multiple choice mode', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="multiple-choice"
        userAnswer=""
        selectedOption="falo"
        showAnswer={true}
        feedback={{ isCorrect: true, explanation: 'Correct!' }}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByText('falo')).toBeInTheDocument()
  })

  it('should render hint with infinitive and person', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByText('(falar, 1ª pessoa)')).toBeInTheDocument()
  })

  it('should render hint with only infinitive', () => {
    const exerciseWithoutPerson = {
      ...mockExercise,
      hint: {
        infinitive: 'falar',
        form: 'present indicative'
      }
    }

    render(
      <ExerciseDisplay
        exercise={exerciseWithoutPerson}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByText('(falar)')).toBeInTheDocument()
  })

  it('should not render hint when no infinitive or person', () => {
    const exerciseWithoutHint = {
      ...mockExercise,
      hint: {
        form: 'present indicative'
      }
    }

    render(
      <ExerciseDisplay
        exercise={exerciseWithoutHint}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.queryByText(/\(/)).not.toBeInTheDocument()
  })

  it('should disable input when showAnswer is true', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer="falo"
        selectedOption=""
        showAnswer={true}
        feedback={{ isCorrect: true, explanation: 'Correct!' }}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    // Input should not be present when showAnswer is true
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('should apply correct styling for correct answer', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer="falo"
        selectedOption=""
        showAnswer={true}
        feedback={{ isCorrect: true, explanation: 'Correct!' }}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    const answerSpan = screen.getByText('falo')
    expect(answerSpan).toHaveStyle('color: var(--neo-success)')
  })

  it('should apply correct styling for incorrect answer', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer="fala"
        selectedOption=""
        showAnswer={true}
        feedback={{ isCorrect: false, explanation: 'Incorrect!' }}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    const answerSpan = screen.getByText('falo')
    expect(answerSpan).toHaveStyle('color: var(--neo-error)')
  })

  it('should handle exercise without hint', () => {
    const exerciseWithoutHint = {
      ...mockExercise,
      hint: undefined
    }

    render(
      <ExerciseDisplay
        exercise={exerciseWithoutHint}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByText('Eu')).toBeInTheDocument()
    expect(screen.getByText('português.')).toBeInTheDocument()
    expect(screen.queryByText(/\(/)).not.toBeInTheDocument()
  })

  it('should handle exercise with gap at the beginning', () => {
    const exerciseWithGapAtStart = {
      ...mockExercise,
      sentence: '___ falo português.',
      gapIndex: 0
    }

    render(
      <ExerciseDisplay
        exercise={exerciseWithGapAtStart}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('falo português.')).toBeInTheDocument()
  })

  it('should handle exercise with gap at the end', () => {
    const exerciseWithGapAtEnd = {
      ...mockExercise,
      sentence: 'Eu falo ___.',
      gapIndex: 2
    }

    render(
      <ExerciseDisplay
        exercise={exerciseWithGapAtEnd}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByText('Eu falo')).toBeInTheDocument()
    expect(screen.getByText('.')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should have proper input placeholder', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('placeholder', '?')
  })

  it('should apply responsive classes', () => {
    render(
      <ExerciseDisplay
        exercise={mockExercise}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    const container = screen.getByText('Eu').parentElement
    expect(container).toHaveClass('text-lg', 'sm:text-xl', 'lg:text-2xl')
  })

  it('should handle complex hint information', () => {
    const exerciseWithComplexHint = {
      ...mockExercise,
      hint: {
        infinitive: 'falar',
        person: '1ª pessoa singular',
        form: 'presente do indicativo'
      }
    }

    render(
      <ExerciseDisplay
        exercise={exerciseWithComplexHint}
        learningMode="input"
        userAnswer=""
        selectedOption=""
        showAnswer={false}
        feedback={null}
        inputRef={mockInputRef}
        setUserAnswer={mockSetUserAnswer}
      />
    )

    expect(screen.getByText('(falar, 1ª pessoa singular)')).toBeInTheDocument()
  })
})