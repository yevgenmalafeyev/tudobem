import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '@/components/Header'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock the store
const mockConfiguration = {
  selectedLevels: ['A1'],
  selectedTopics: ['present-indicative'],
  claudeApiKey: 'test-key',
  appLanguage: 'en' as const
}

const mockStore = {
  isConfigured: true,
  configuration: mockConfiguration
}

jest.mock('@/store/useStore', () => ({
  useStore: () => mockStore
}))

// Mock translations
jest.mock('@/utils/translations', () => ({
  t: (key: string, lang?: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        appTitle: 'Tudobem',
        learning: 'Learning',
        flashcards: 'Flashcards',
        configuration: 'Configuration'
      },
      pt: {
        appTitle: 'Tudobem',
        learning: 'Aprendizagem',
        flashcards: 'Cartões',
        configuration: 'Configuração'
      }
    }
    return translations[lang || 'en']?.[key] || key
  }
}))

// Mock Logo component
jest.mock('@/components/Logo', () => {
  return function MockLogo({ className }: { className?: string }) {
    return <div data-testid="logo" className={className}>Logo</div>
  }
})

describe('Header Component', () => {
  const mockOnViewChange = jest.fn()
  
  const defaultProps = {
    currentView: 'learning' as const,
    onViewChange: mockOnViewChange
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset store to configured state
    mockStore.isConfigured = true
  })

  it('should render without crashing', () => {
    render(<Header {...defaultProps} />)
    
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByText('Tudobem')).toBeInTheDocument()
  })

  it('should render logo and app title', () => {
    render(<Header {...defaultProps} />)
    
    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByText('Tudobem')).toBeInTheDocument()
  })

  it('should render app title as a link', () => {
    render(<Header {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')
    expect(link).toContainElement(screen.getByTestId('logo'))
    expect(link).toContainElement(screen.getByText('Tudobem'))
  })

  it('should render navigation when configured', () => {
    render(<Header {...defaultProps} />)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Learning' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configuration' })).toBeInTheDocument()
  })

  it('should only show login button when not configured', () => {
    mockStore.isConfigured = false
    
    render(<Header {...defaultProps} />)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Learning' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Configuration' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'login' })).toBeInTheDocument()
  })

  it('should highlight the current view button', () => {
    render(<Header {...defaultProps} />)
    
    const learningButton = screen.getByRole('button', { name: 'Learning' })
    const configurationButton = screen.getByRole('button', { name: 'Configuration' })
    
    expect(learningButton).toHaveClass('neo-button-primary')
    expect(configurationButton).not.toHaveClass('neo-button-primary')
  })

  it('should highlight configuration button when configuration view is active', () => {
    render(<Header {...defaultProps} currentView="configuration" />)
    
    const learningButton = screen.getByRole('button', { name: 'Learning' })
    const configurationButton = screen.getByRole('button', { name: 'Configuration' })
    
    expect(learningButton).not.toHaveClass('neo-button-primary')
    expect(configurationButton).toHaveClass('neo-button-primary')
  })

  it('should call onViewChange when learning button is clicked', () => {
    render(<Header {...defaultProps} currentView="configuration" />)
    
    const learningButton = screen.getByRole('button', { name: 'Learning' })
    fireEvent.click(learningButton)
    
    expect(mockOnViewChange).toHaveBeenCalledWith('learning')
  })

  it('should call onViewChange when configuration button is clicked', () => {
    render(<Header {...defaultProps} currentView="learning" />)
    
    const configurationButton = screen.getByRole('button', { name: 'Configuration' })
    fireEvent.click(configurationButton)
    
    expect(mockOnViewChange).toHaveBeenCalledWith('configuration')
  })

  it('should not render flashcards button (temporarily hidden)', () => {
    render(<Header {...defaultProps} />)
    
    expect(screen.queryByRole('button', { name: 'Flashcards' })).not.toBeInTheDocument()
  })

  it('should use correct language for translations', () => {
    mockConfiguration.appLanguage = 'pt'
    
    render(<Header {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: 'Aprendizagem' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Configuração' })).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<Header {...defaultProps} />)
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    
    const navigation = screen.getByRole('navigation')
    expect(navigation).toBeInTheDocument()
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeInTheDocument()
    })
  })

  it('should have proper responsive classes', () => {
    render(<Header {...defaultProps} />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('neo-card-sm', 'mx-2', 'my-2', 'sm:mx-4', 'sm:my-4', 'lg:mx-6')
    
    const title = screen.getByText('Tudobem')
    expect(title).toHaveClass('text-lg', 'sm:text-xl', 'lg:text-2xl')
  })

  it('should handle logo hover effects', () => {
    render(<Header {...defaultProps} />)
    
    const logo = screen.getByTestId('logo')
    expect(logo).toHaveClass('hover:scale-105', 'transition-transform')
  })

  it('should handle link hover effects', () => {
    render(<Header {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('hover:opacity-80', 'transition-opacity')
  })
})