import { render, screen, fireEvent } from '@testing-library/react'
import ActionButtons from '@/components/learning/ActionButtons'

describe('ActionButtons', () => {
  const mockOnCheckAnswer = jest.fn()
  const mockOnNextExercise = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render check answer button when not showing answer', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Check Answer')).toBeInTheDocument()
    expect(screen.queryByText('Next Exercise')).not.toBeInTheDocument()
  })

  it('should render next exercise button when showing answer', () => {
    render(
      <ActionButtons
        showAnswer={true}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Next Exercise')).toBeInTheDocument()
    expect(screen.queryByText('Check Answer')).not.toBeInTheDocument()
  })

  it('should call onCheckAnswer when check answer button is clicked', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const checkButton = screen.getByText('Check Answer')
    fireEvent.click(checkButton)

    expect(mockOnCheckAnswer).toHaveBeenCalledTimes(1)
  })

  it('should call onNextExercise when next exercise button is clicked', () => {
    render(
      <ActionButtons
        showAnswer={true}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const nextButton = screen.getByText('Next Exercise')
    fireEvent.click(nextButton)

    expect(mockOnNextExercise).toHaveBeenCalledTimes(1)
  })

  it('should disable check answer button when no valid answer', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={false}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const checkButton = screen.getByText('Check Answer')
    expect(checkButton).toBeDisabled()
  })

  it('should disable buttons when loading', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={true}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const checkButton = screen.getByText('Check Answer')
    expect(checkButton).toBeDisabled()
  })

  it('should show loading text when loading', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={true}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render Portuguese labels', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="pt"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Verificar Resposta')).toBeInTheDocument()
  })

  it('should render Ukrainian labels', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="uk"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Перевірити відповідь')).toBeInTheDocument()
  })

  it('should render next exercise button with correct language', () => {
    render(
      <ActionButtons
        showAnswer={true}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="pt"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Próximo Exercício')).toBeInTheDocument()
  })

  it('should apply correct CSS classes', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const button = screen.getByText('Check Answer')
    expect(button).toHaveClass('neo-outset', 'text-lg', 'sm:text-xl', 'px-6', 'sm:px-8', 'py-3', 'sm:py-4')
  })

  it('should handle keyboard navigation', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const button = screen.getByText('Check Answer')
    
    button.focus()
    expect(button).toHaveFocus()

    fireEvent.keyDown(button, { key: 'Enter' })
    expect(mockOnCheckAnswer).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(button, { key: ' ' })
    expect(mockOnCheckAnswer).toHaveBeenCalledTimes(2)
  })

  it('should not call handlers when disabled', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={false}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const button = screen.getByText('Check Answer')
    fireEvent.click(button)

    expect(mockOnCheckAnswer).not.toHaveBeenCalled()
  })

  it('should handle rapid clicking', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const button = screen.getByText('Check Answer')
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockOnCheckAnswer).toHaveBeenCalledTimes(3)
  })

  it('should handle state transitions correctly', () => {
    const { rerender } = render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Check Answer')).toBeInTheDocument()

    rerender(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={true}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    rerender(
      <ActionButtons
        showAnswer={true}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Next Exercise')).toBeInTheDocument()
  })

  it('should have proper button type attributes', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const button = screen.getByText('Check Answer')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('should handle loading state in different languages', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={true}
        appLanguage="pt"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should handle Ukrainian loading state', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={true}
        appLanguage="uk"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    expect(screen.getByText('Завантаження...')).toBeInTheDocument()
  })

  it('should maintain button styling when disabled', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={false}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const button = screen.getByText('Check Answer')
    expect(button).toHaveClass('neo-outset')
    expect(button).toBeDisabled()
  })

  it('should handle edge case where both showAnswer and hasValidAnswer are false', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={false}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const button = screen.getByText('Check Answer')
    expect(button).toBeDisabled()
    expect(screen.queryByText('Next Exercise')).not.toBeInTheDocument()
  })

  it('should be responsive', () => {
    render(
      <ActionButtons
        showAnswer={false}
        hasValidAnswer={true}
        isLoading={false}
        appLanguage="en"
        onCheckAnswer={mockOnCheckAnswer}
        onNextExercise={mockOnNextExercise}
      />
    )

    const button = screen.getByText('Check Answer')
    expect(button).toHaveClass('text-lg', 'sm:text-xl')
    expect(button).toHaveClass('px-6', 'sm:px-8')
    expect(button).toHaveClass('py-3', 'sm:py-4')
  })
})