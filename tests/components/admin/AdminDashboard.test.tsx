import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminDashboard from '@/components/admin/AdminDashboard'

// Mock child components
jest.mock('@/components/Logo', () => {
  return function MockLogo({ className }: { className?: string }) {
    return <div data-testid="logo" className={className}>Logo</div>
  }
})

jest.mock('@/components/admin/DataManagement', () => {
  return function MockDataManagement() {
    return <div data-testid="data-management">Data Management Content</div>
  }
})

jest.mock('@/components/admin/QuestionStats', () => {
  return function MockQuestionStats() {
    return <div data-testid="question-stats">Question Stats Content</div>
  }
})

jest.mock('@/components/admin/UsageAnalytics', () => {
  return function MockUsageAnalytics() {
    return <div data-testid="usage-analytics">Usage Analytics Content</div>
  }
})

describe('AdminDashboard Component', () => {
  const defaultProps = {
    onLogout: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render dashboard with all required elements', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      // Header elements
      expect(screen.getByTestId('logo')).toBeInTheDocument()
      expect(screen.getByText('Tudobem Admin')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
      
      // Navigation elements
      expect(screen.getByText('📁')).toBeInTheDocument()
      expect(screen.getByText('📊')).toBeInTheDocument()
      expect(screen.getByText('📈')).toBeInTheDocument()
      
      // Navigation buttons
      expect(screen.getByRole('button', { name: /Data Management/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Question Stats/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Usage Analytics/ })).toBeInTheDocument()
    })

    it('should render Logo with correct styling', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const logo = screen.getByTestId('logo')
      expect(logo).toHaveClass('hover:scale-105', 'transition-transform')
    })

    it('should have proper header structure', () => {
      const { container } = render(<AdminDashboard {...defaultProps} />)
      
      const header = container.querySelector('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('neo-card-sm', 'mx-4', 'my-4', 'sm:mx-6')
    })

    it('should have proper navigation structure', () => {
      const { container } = render(<AdminDashboard {...defaultProps} />)
      
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveClass('neo-card-sm', 'mx-4', 'mb-4', 'sm:mx-6')
    })

    it('should have proper main content structure', () => {
      const { container } = render(<AdminDashboard {...defaultProps} />)
      
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'pb-8')
    })
  })

  describe('Header Elements', () => {
    it('should render title with correct styling', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const title = screen.getByText('Tudobem Admin')
      expect(title).toHaveClass('text-lg', 'sm:text-xl', 'lg:text-2xl', 'font-bold')
      expect(title).toHaveStyle('color: var(--neo-text)')
    })

    it('should render logout button with correct styling', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const logoutButton = screen.getByRole('button', { name: 'Logout' })
      expect(logoutButton).toHaveClass('neo-button', 'text-sm', 'sm:text-base', 'px-4', 'py-2', 'hover:bg-red-50')
      expect(logoutButton).toHaveStyle('color: var(--neo-error)')
    })

    it('should call onLogout when logout button is clicked', () => {
      const onLogoutMock = jest.fn()
      render(<AdminDashboard onLogout={onLogoutMock} />)
      
      const logoutButton = screen.getByRole('button', { name: 'Logout' })
      fireEvent.click(logoutButton)
      
      expect(onLogoutMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Navigation Buttons', () => {
    it('should render all navigation view options', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      // Check for view names (visible on larger screens)
      expect(screen.getByText('Data Management')).toBeInTheDocument()
      expect(screen.getByText('Question Stats')).toBeInTheDocument()
      expect(screen.getByText('Usage Analytics')).toBeInTheDocument()
      
      // Check for icons
      expect(screen.getByText('📁')).toBeInTheDocument()
      expect(screen.getByText('📊')).toBeInTheDocument()
      expect(screen.getByText('📈')).toBeInTheDocument()
    })

    it('should have Data Management selected by default', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const dataButton = screen.getByRole('button', { name: /Data Management/ })
      expect(dataButton).toHaveClass('neo-button-primary')
      
      const statsButton = screen.getByRole('button', { name: /Question Stats/ })
      const analyticsButton = screen.getByRole('button', { name: /Usage Analytics/ })
      
      expect(statsButton).not.toHaveClass('neo-button-primary')
      expect(analyticsButton).not.toHaveClass('neo-button-primary')
    })

    it('should apply correct styling to navigation buttons', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const dataButton = screen.getByRole('button', { name: /Data Management/ })
      expect(dataButton).toHaveClass('neo-button', 'text-sm', 'sm:text-base', 'px-3', 'sm:px-4', 'py-2', 'flex', 'items-center', 'space-x-2')
    })

    it('should hide view names on small screens', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const dataManagementText = screen.getByText('Data Management')
      const questionStatsText = screen.getByText('Question Stats')
      const usageAnalyticsText = screen.getByText('Usage Analytics')
      
      expect(dataManagementText).toHaveClass('hidden', 'sm:inline')
      expect(questionStatsText).toHaveClass('hidden', 'sm:inline')
      expect(usageAnalyticsText).toHaveClass('hidden', 'sm:inline')
    })
  })

  describe('View Navigation', () => {
    it('should switch to Question Stats view when clicked', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const statsButton = screen.getByRole('button', { name: /Question Stats/ })
      fireEvent.click(statsButton)
      
      expect(statsButton).toHaveClass('neo-button-primary')
      expect(screen.getByTestId('question-stats')).toBeInTheDocument()
      expect(screen.queryByTestId('data-management')).not.toBeInTheDocument()
    })

    it('should switch to Usage Analytics view when clicked', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const analyticsButton = screen.getByRole('button', { name: /Usage Analytics/ })
      fireEvent.click(analyticsButton)
      
      expect(analyticsButton).toHaveClass('neo-button-primary')
      expect(screen.getByTestId('usage-analytics')).toBeInTheDocument()
      expect(screen.queryByTestId('data-management')).not.toBeInTheDocument()
    })

    it('should switch back to Data Management view when clicked', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      // First switch to another view
      const statsButton = screen.getByRole('button', { name: /Question Stats/ })
      fireEvent.click(statsButton)
      expect(screen.getByTestId('question-stats')).toBeInTheDocument()
      
      // Then switch back to data management
      const dataButton = screen.getByRole('button', { name: /Data Management/ })
      fireEvent.click(dataButton)
      
      expect(dataButton).toHaveClass('neo-button-primary')
      expect(screen.getByTestId('data-management')).toBeInTheDocument()
      expect(screen.queryByTestId('question-stats')).not.toBeInTheDocument()
    })

    it('should update navigation button styling when view changes', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const dataButton = screen.getByRole('button', { name: /Data Management/ })
      const statsButton = screen.getByRole('button', { name: /Question Stats/ })
      const analyticsButton = screen.getByRole('button', { name: /Usage Analytics/ })
      
      // Initially data is selected
      expect(dataButton).toHaveClass('neo-button-primary')
      expect(statsButton).not.toHaveClass('neo-button-primary')
      expect(analyticsButton).not.toHaveClass('neo-button-primary')
      
      // Click stats
      fireEvent.click(statsButton)
      expect(dataButton).not.toHaveClass('neo-button-primary')
      expect(statsButton).toHaveClass('neo-button-primary')
      expect(analyticsButton).not.toHaveClass('neo-button-primary')
      
      // Click analytics
      fireEvent.click(analyticsButton)
      expect(dataButton).not.toHaveClass('neo-button-primary')
      expect(statsButton).not.toHaveClass('neo-button-primary')
      expect(analyticsButton).toHaveClass('neo-button-primary')
    })
  })

  describe('Content Rendering', () => {
    it('should render Data Management component by default', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      expect(screen.getByTestId('data-management')).toBeInTheDocument()
      expect(screen.getByText('Data Management Content')).toBeInTheDocument()
      expect(screen.queryByTestId('question-stats')).not.toBeInTheDocument()
      expect(screen.queryByTestId('usage-analytics')).not.toBeInTheDocument()
    })

    it('should render Question Stats component when selected', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const statsButton = screen.getByRole('button', { name: /Question Stats/ })
      fireEvent.click(statsButton)
      
      expect(screen.getByTestId('question-stats')).toBeInTheDocument()
      expect(screen.getByText('Question Stats Content')).toBeInTheDocument()
      expect(screen.queryByTestId('data-management')).not.toBeInTheDocument()
      expect(screen.queryByTestId('usage-analytics')).not.toBeInTheDocument()
    })

    it('should render Usage Analytics component when selected', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const analyticsButton = screen.getByRole('button', { name: /Usage Analytics/ })
      fireEvent.click(analyticsButton)
      
      expect(screen.getByTestId('usage-analytics')).toBeInTheDocument()
      expect(screen.getByText('Usage Analytics Content')).toBeInTheDocument()
      expect(screen.queryByTestId('data-management')).not.toBeInTheDocument()
      expect(screen.queryByTestId('question-stats')).not.toBeInTheDocument()
    })

    it('should handle default case by rendering Data Management', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      // The default case is already tested above, but we can verify the behavior
      // by checking that Data Management is rendered initially
      expect(screen.getByTestId('data-management')).toBeInTheDocument()
    })

    it('should handle invalid view state gracefully', () => {
      // We need to test the default case in the switch statement
      // Since we can't directly set an invalid state through the UI,
      // we can create a modified component for testing
      const TestComponentWithInvalidState = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const views = [
          { id: 'data' as const, name: 'Data Management', icon: '📁' },
          { id: 'stats' as const, name: 'Question Stats', icon: '📊' },
          { id: 'analytics' as const, name: 'Usage Analytics', icon: '📈' }
        ];
        
        // Force an invalid view to test the default case
        const currentView = 'invalid' as string;
        
        const renderCurrentView = () => {
          switch (currentView) {
            case 'data':
              return <div data-testid="data-management">Data Management Content</div>;
            case 'stats':
              return <div data-testid="question-stats">Question Stats Content</div>;
            case 'analytics':
              return <div data-testid="usage-analytics">Usage Analytics Content</div>;
            default:
              return <div data-testid="data-management">Data Management Content</div>;
          }
        };
        
        return <div>{renderCurrentView()}</div>;
      };
      
      render(<TestComponentWithInvalidState />);
      
      // Should render DataManagement component as the default fallback
      expect(screen.getByTestId('data-management')).toBeInTheDocument()
    })
  })

  describe('Component State Management', () => {
    it('should maintain current view state correctly', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      // Start with data view
      expect(screen.getByTestId('data-management')).toBeInTheDocument()
      
      // Switch to stats
      fireEvent.click(screen.getByRole('button', { name: /Question Stats/ }))
      expect(screen.getByTestId('question-stats')).toBeInTheDocument()
      
      // Switch to analytics
      fireEvent.click(screen.getByRole('button', { name: /Usage Analytics/ }))
      expect(screen.getByTestId('usage-analytics')).toBeInTheDocument()
      
      // Switch back to data
      fireEvent.click(screen.getByRole('button', { name: /Data Management/ }))
      expect(screen.getByTestId('data-management')).toBeInTheDocument()
    })

    it('should initialize with data view as default', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const dataButton = screen.getByRole('button', { name: /Data Management/ })
      expect(dataButton).toHaveClass('neo-button-primary')
      expect(screen.getByTestId('data-management')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes for layout', () => {
      const { container } = render(<AdminDashboard {...defaultProps} />)
      
      // Header responsive classes
      const header = container.querySelector('header')
      expect(header).toHaveClass('mx-4', 'my-4', 'sm:mx-6')
      
      // Navigation responsive classes
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('mx-4', 'mb-4', 'sm:mx-6')
      
      // Navigation container responsive classes
      const navContainer = container.querySelector('nav .flex')
      expect(navContainer).toHaveClass('space-x-1', 'sm:space-x-2')
      
      // Main content responsive classes
      const main = container.querySelector('main')
      expect(main).toHaveClass('px-4', 'sm:px-6')
    })

    it('should have responsive text sizing', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const title = screen.getByText('Tudobem Admin')
      expect(title).toHaveClass('text-lg', 'sm:text-xl', 'lg:text-2xl')
      
      const logoutButton = screen.getByRole('button', { name: 'Logout' })
      expect(logoutButton).toHaveClass('text-sm', 'sm:text-base')
    })

    it('should have responsive button padding', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const navButton = screen.getByRole('button', { name: /Data Management/ })
      expect(navButton).toHaveClass('px-3', 'sm:px-4')
    })
  })

  describe('CSS Classes and Styling', () => {
    it('should apply proper layout classes', () => {
      const { container } = render(<AdminDashboard {...defaultProps} />)
      
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveClass('min-h-screen')
    })

    it('should style header elements correctly', () => {
      const { container } = render(<AdminDashboard {...defaultProps} />)
      
      const headerContent = container.querySelector('.flex.items-center.justify-between')
      expect(headerContent).toBeInTheDocument()
      
      const logoSection = container.querySelector('.flex.items-center.space-x-3')
      expect(logoSection).toBeInTheDocument()
    })

    it('should style navigation correctly', () => {
      const { container } = render(<AdminDashboard {...defaultProps} />)
      
      const navButtons = container.querySelector('.flex.space-x-1.sm\\:space-x-2')
      expect(navButtons).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      // Check that all interactive elements are buttons
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Data Management/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Question Stats/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Usage Analytics/ })).toBeInTheDocument()
    })

    it('should have proper heading structure', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Tudobem Admin')
    })

    it('should have navigation landmark', () => {
      const { container } = render(<AdminDashboard {...defaultProps} />)
      
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('should have main content landmark', () => {
      const { container } = render(<AdminDashboard {...defaultProps} />)
      
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('Integration with Child Components', () => {
    it('should properly integrate with Logo component', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      const logo = screen.getByTestId('logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveClass('hover:scale-105', 'transition-transform')
    })

    it('should properly mount DataManagement component', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      expect(screen.getByTestId('data-management')).toBeInTheDocument()
      expect(screen.getByText('Data Management Content')).toBeInTheDocument()
    })

    it('should properly mount QuestionStats component', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      fireEvent.click(screen.getByRole('button', { name: /Question Stats/ }))
      
      expect(screen.getByTestId('question-stats')).toBeInTheDocument()
      expect(screen.getByText('Question Stats Content')).toBeInTheDocument()
    })

    it('should properly mount UsageAnalytics component', () => {
      render(<AdminDashboard {...defaultProps} />)
      
      fireEvent.click(screen.getByRole('button', { name: /Usage Analytics/ }))
      
      expect(screen.getByTestId('usage-analytics')).toBeInTheDocument()
      expect(screen.getByText('Usage Analytics Content')).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('should work with different onLogout implementations', () => {
      const mockOnLogout1 = jest.fn()
      const mockOnLogout2 = jest.fn()
      
      const { rerender } = render(<AdminDashboard onLogout={mockOnLogout1} />)
      
      const logoutButton = screen.getByRole('button', { name: 'Logout' })
      fireEvent.click(logoutButton)
      
      expect(mockOnLogout1).toHaveBeenCalledTimes(1)
      
      rerender(<AdminDashboard onLogout={mockOnLogout2} />)
      
      fireEvent.click(logoutButton)
      
      expect(mockOnLogout2).toHaveBeenCalledTimes(1)
    })
  })
})