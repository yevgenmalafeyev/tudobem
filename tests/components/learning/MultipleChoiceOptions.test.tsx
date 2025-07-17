import { render, screen, fireEvent } from '@testing-library/react'
import MultipleChoiceOptions from '@/components/learning/MultipleChoiceOptions'

describe('MultipleChoiceOptions', () => {
  const mockSetSelectedOption = jest.fn()
  const mockOptions = ['falo', 'fala', 'falamos', 'falam']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all options as buttons', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    mockOptions.forEach(option => {
      expect(screen.getByRole('button', { name: option })).toBeInTheDocument()
    })
  })

  it('should call setSelectedOption when option is clicked', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const firstOption = screen.getByRole('button', { name: 'falo' })
    fireEvent.click(firstOption)

    expect(mockSetSelectedOption).toHaveBeenCalledWith('falo')
  })

  it('should highlight selected option', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const selectedButton = screen.getByRole('button', { name: 'falo' })
    const unselectedButton = screen.getByRole('button', { name: 'fala' })

    expect(selectedButton).toHaveClass('neo-inset')
    expect(unselectedButton).toHaveClass('neo-outset')
  })

  it('should disable all buttons when showAnswer is true', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={true}
      />
    )

    mockOptions.forEach(option => {
      const button = screen.getByRole('button', { name: option })
      expect(button).toBeDisabled()
    })
  })

  it('should not call setSelectedOption when disabled', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={true}
      />
    )

    const button = screen.getByRole('button', { name: 'fala' })
    fireEvent.click(button)

    expect(mockSetSelectedOption).not.toHaveBeenCalled()
  })

  it('should handle empty options array', () => {
    render(
      <MultipleChoiceOptions
        options={[]}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should handle single option', () => {
    render(
      <MultipleChoiceOptions
        options={['falo']}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    expect(screen.getByRole('button', { name: 'falo' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('should handle option selection change', () => {
    const { rerender } = render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    let faloButton = screen.getByRole('button', { name: 'falo' })
    let falaButton = screen.getByRole('button', { name: 'fala' })

    expect(faloButton).toHaveClass('neo-inset')
    expect(falaButton).toHaveClass('neo-outset')

    rerender(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="fala"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    faloButton = screen.getByRole('button', { name: 'falo' })
    falaButton = screen.getByRole('button', { name: 'fala' })

    expect(faloButton).toHaveClass('neo-outset')
    expect(falaButton).toHaveClass('neo-inset')
  })

  it('should apply correct styling classes', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const container = screen.getByRole('button', { name: 'falo' }).parentElement
    expect(container).toHaveClass('grid', 'grid-cols-2', 'gap-2', 'sm:gap-3', 'mb-4', 'sm:mb-6')

    const button = screen.getByRole('button', { name: 'falo' })
    expect(button).toHaveClass('neo-outset', 'text-lg', 'sm:text-xl', 'lg:text-2xl', 'py-2', 'sm:py-3')
  })

  it('should handle keyboard navigation', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const firstButton = screen.getByRole('button', { name: 'falo' })
    
    firstButton.focus()
    expect(firstButton).toHaveFocus()

    fireEvent.keyDown(firstButton, { key: 'Enter' })
    expect(mockSetSelectedOption).toHaveBeenCalledWith('falo')

    fireEvent.keyDown(firstButton, { key: ' ' })
    expect(mockSetSelectedOption).toHaveBeenCalledWith('falo')
  })

  it('should handle options with special characters', () => {
    const specialOptions = ['está', 'são', 'coração', 'nação']
    
    render(
      <MultipleChoiceOptions
        options={specialOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    specialOptions.forEach(option => {
      expect(screen.getByRole('button', { name: option })).toBeInTheDocument()
    })
  })

  it('should handle long options', () => {
    const longOptions = ['falo', 'estava falando', 'terei falado', 'falaria']
    
    render(
      <MultipleChoiceOptions
        options={longOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    longOptions.forEach(option => {
      expect(screen.getByRole('button', { name: option })).toBeInTheDocument()
    })
  })

  it('should handle rapid clicking', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const faloButton = screen.getByRole('button', { name: 'falo' })
    const falaButton = screen.getByRole('button', { name: 'fala' })

    fireEvent.click(faloButton)
    fireEvent.click(falaButton)
    fireEvent.click(faloButton)

    expect(mockSetSelectedOption).toHaveBeenCalledTimes(3)
    expect(mockSetSelectedOption).toHaveBeenNthCalledWith(1, 'falo')
    expect(mockSetSelectedOption).toHaveBeenNthCalledWith(2, 'fala')
    expect(mockSetSelectedOption).toHaveBeenNthCalledWith(3, 'falo')
  })

  it('should maintain selection when showAnswer changes', () => {
    const { rerender } = render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    let selectedButton = screen.getByRole('button', { name: 'falo' })
    expect(selectedButton).toHaveClass('neo-inset')

    rerender(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption="falo"
        setSelectedOption={mockSetSelectedOption}
        showAnswer={true}
      />
    )

    selectedButton = screen.getByRole('button', { name: 'falo' })
    expect(selectedButton).toHaveClass('neo-inset')
    expect(selectedButton).toBeDisabled()
  })

  it('should handle duplicate options', () => {
    const duplicateOptions = ['falo', 'falo', 'fala', 'fala']
    
    render(
      <MultipleChoiceOptions
        options={duplicateOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    // Should render all options, even duplicates
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('should have proper button type attributes', () => {
    render(
      <MultipleChoiceOptions
        options={mockOptions}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    mockOptions.forEach(option => {
      const button = screen.getByRole('button', { name: option })
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  it('should handle empty string options', () => {
    const optionsWithEmpty = ['falo', '', 'fala', 'falamos']
    
    render(
      <MultipleChoiceOptions
        options={optionsWithEmpty}
        selectedOption=""
        setSelectedOption={mockSetSelectedOption}
        showAnswer={false}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })
})