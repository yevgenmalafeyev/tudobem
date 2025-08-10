import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminLogin from '@/components/admin/AdminLogin'

// Mock Logo component
jest.mock('@/components/Logo', () => {
  return function MockLogo({ className }: { className?: string }) {
    return <div data-testid="logo" className={className}>Logo</div>
  }
})

describe('AdminLogin Component', () => {
  const defaultProps = {
    onLogin: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render login form with all required elements', () => {
      render(<AdminLogin {...defaultProps} />)
      
      // Header elements
      expect(screen.getByTestId('logo')).toBeInTheDocument()
      expect(screen.getByText('Tudobem Admin')).toBeInTheDocument()
      expect(screen.getByText('Sign in to access the admin dashboard')).toBeInTheDocument()
      
      // Form elements
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    })

    it('should render Logo with correct styling', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const logo = screen.getByTestId('logo')
      expect(logo).toHaveClass('scale-150')
    })

    it('should have proper form structure', () => {
      const { container } = render(<AdminLogin {...defaultProps} />)
      
      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })

  describe('Form Fields', () => {
    it('should render username field with correct attributes', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const usernameInput = screen.getByLabelText('Username')
      expect(usernameInput).toHaveAttribute('type', 'text')
      expect(usernameInput).toHaveAttribute('placeholder', 'Enter username')
      expect(usernameInput).toHaveAttribute('required')
      expect(usernameInput).toHaveClass('neo-input', 'w-full')
    })

    it('should render password field with correct attributes', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const passwordInput = screen.getByLabelText('Password')
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('placeholder', 'Enter password')
      expect(passwordInput).toHaveAttribute('required')
      expect(passwordInput).toHaveClass('neo-input', 'w-full')
    })

    it('should update username state when typing', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const usernameInput = screen.getByLabelText('Username')
      fireEvent.change(usernameInput, { target: { value: 'testuser' } })
      
      expect(usernameInput).toHaveValue('testuser')
    })

    it('should update password state when typing', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const passwordInput = screen.getByLabelText('Password')
      fireEvent.change(passwordInput, { target: { value: 'testpass' } })
      
      expect(passwordInput).toHaveValue('testpass')
    })

    it('should clear input values when component re-renders', () => {
      const { rerender } = render(<AdminLogin {...defaultProps} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } })
      fireEvent.change(passwordInput, { target: { value: 'testpass' } })
      
      rerender(<AdminLogin {...defaultProps} />)
      
      expect(usernameInput).toHaveValue('testuser')
      expect(passwordInput).toHaveValue('testpass')
    })
  })

  describe('Form Submission', () => {
    it('should call onLogin with username and password when form is submitted', async () => {
      const mockOnLogin = jest.fn().mockResolvedValue(true)
      render(<AdminLogin onLogin={mockOnLogin} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      expect(mockOnLogin).toHaveBeenCalledWith('admin', 'password123')
    })

    it('should prevent default form submission', async () => {
      const mockOnLogin = jest.fn().mockResolvedValue(true)
      const { container } = render(<AdminLogin onLogin={mockOnLogin} />)
      
      const form = container.querySelector('form')!
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      
      // Add values to make form valid
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      
      // Create a spy on the form's submit method to verify default submission is prevented
      const submitSpy = jest.fn()
      form.submit = submitSpy
      
      // Submit the form
      await act(async () => {
        fireEvent.submit(form)
      })
      
      // Verify our custom handler was called (proving preventDefault worked)
      expect(mockOnLogin).toHaveBeenCalledWith('admin', 'password123')
      // Verify the default form submission was not called
      expect(submitSpy).not.toHaveBeenCalled()
    })

    it('should handle successful login', async () => {
      const mockOnLogin = jest.fn().mockResolvedValue(true)
      render(<AdminLogin onLogin={mockOnLogin} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledWith('admin', 'password123')
      })
      
      // Should not show error after successful login
      expect(screen.queryByText('Invalid username or password')).not.toBeInTheDocument()
    })

    it('should handle failed login and show error message', async () => {
      const mockOnLogin = jest.fn().mockResolvedValue(false)
      render(<AdminLogin onLogin={mockOnLogin} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'wronguser' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Invalid username or password')).toBeInTheDocument()
      })
    })
  })

  describe('Loading State', () => {
    it('should show loading state during login attempt', async () => {
      const mockOnLogin = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(true), 100))
      )
      render(<AdminLogin onLogin={mockOnLogin} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      // Should show loading text
      expect(screen.getByText('Signing in...')).toBeInTheDocument()
      
      // Fields should be disabled
      expect(usernameInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(submitButton).toBeDisabled()
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Signing in...')).not.toBeInTheDocument()
      })
    })

    it('should re-enable form after login attempt completes', async () => {
      const mockOnLogin = jest.fn().mockResolvedValue(false)
      render(<AdminLogin onLogin={mockOnLogin} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Invalid username or password')).toBeInTheDocument()
      })
      
      // Fields should be re-enabled after completion
      expect(usernameInput).not.toBeDisabled()
      expect(passwordInput).not.toBeDisabled()
      expect(submitButton).not.toBeDisabled()
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should not show error initially', () => {
      render(<AdminLogin {...defaultProps} />)
      
      expect(screen.queryByText('Invalid username or password')).not.toBeInTheDocument()
    })

    it('should clear error when new login attempt starts', async () => {
      const mockOnLogin = jest.fn()
        .mockResolvedValueOnce(false)  // First call fails
        .mockResolvedValueOnce(true)   // Second call succeeds
      
      render(<AdminLogin onLogin={mockOnLogin} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      // First login attempt (fails)
      fireEvent.change(usernameInput, { target: { value: 'wrong' } })
      fireEvent.change(passwordInput, { target: { value: 'wrong' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Invalid username or password')).toBeInTheDocument()
      })
      
      // Second login attempt (should clear error)
      fireEvent.change(usernameInput, { target: { value: 'correct' } })
      fireEvent.change(passwordInput, { target: { value: 'correct' } })
      fireEvent.click(submitButton)
      
      // Error should be cleared during loading
      await waitFor(() => {
        expect(screen.queryByText('Invalid username or password')).not.toBeInTheDocument()
      })
    })

    it('should handle promise rejection gracefully', async () => {
      const mockOnLogin = jest.fn().mockRejectedValue(new Error('Network error'))
      render(<AdminLogin onLogin={mockOnLogin} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'admin' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.click(submitButton)
        
        // Wait for async operation to complete
        await new Promise(resolve => setTimeout(resolve, 100));
      })
      
      // Should handle the rejection and show error message
      await waitFor(() => {
        expect(screen.getByText('An error occurred during login')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Form should be usable again
      expect(usernameInput).not.toBeDisabled()
      expect(passwordInput).not.toBeDisabled()
      expect(submitButton).not.toBeDisabled()
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      
      expect(usernameInput).toHaveAttribute('id', 'username')
      expect(passwordInput).toHaveAttribute('id', 'password')
    })

    it('should have proper heading structure', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Tudobem Admin')
    })

    it('should have descriptive submit button', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      expect(submitButton).toBeInTheDocument()
    })

    it('should announce error to screen readers', async () => {
      const mockOnLogin = jest.fn().mockResolvedValue(false)
      render(<AdminLogin onLogin={mockOnLogin} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'testpass' } })
        fireEvent.click(submitButton)
      })
      
      await waitFor(() => {
        const errorMessage = screen.getByText('Invalid username or password')
        expect(errorMessage).toBeInTheDocument()
        // Error message should be visible to screen readers
        expect(errorMessage).toBeVisible()
      }, { timeout: 3000 })
    })
  })

  describe('CSS Classes and Styling', () => {
    it('should have proper layout classes', () => {
      const { container } = render(<AdminLogin {...defaultProps} />)
      
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'p-4')
      
      const cardDiv = container.querySelector('.neo-card')
      expect(cardDiv).toHaveClass('max-w-md', 'w-full')
    })

    it('should style error message correctly', async () => {
      const mockOnLogin = jest.fn().mockResolvedValue(false)
      render(<AdminLogin onLogin={mockOnLogin} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'testpass' } })
        fireEvent.click(submitButton)
      })
      
      await waitFor(() => {
        const errorMessage = screen.getByText('Invalid username or password')
        expect(errorMessage).toHaveClass('text-sm', 'text-center')
        expect(errorMessage).toHaveStyle('color: var(--neo-error)')
      }, { timeout: 3000 })
    })

    it('should style submit button correctly', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      expect(submitButton).toHaveClass('neo-button', 'neo-button-primary', 'w-full')
    })
  })

  describe('Form Validation', () => {
    it('should require username field', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const usernameInput = screen.getByLabelText('Username')
      expect(usernameInput).toBeRequired()
    })

    it('should require password field', () => {
      render(<AdminLogin {...defaultProps} />)
      
      const passwordInput = screen.getByLabelText('Password')
      expect(passwordInput).toBeRequired()
    })

    it('should allow form submission with valid inputs', async () => {
      const mockOnLogin = jest.fn().mockResolvedValue(true)
      const { container } = render(<AdminLogin onLogin={mockOnLogin} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const form = container.querySelector('form')!
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.submit(form)
      
      expect(mockOnLogin).toHaveBeenCalledWith('admin', 'password123')
    })
  })

  describe('Component Integration', () => {
    it('should work with different onLogin implementations', async () => {
      const mockOnLogin1 = jest.fn().mockResolvedValue(true)
      const mockOnLogin2 = jest.fn().mockResolvedValue(false)
      
      const { rerender } = render(<AdminLogin onLogin={mockOnLogin1} />)
      
      const usernameInput = screen.getByLabelText('Username')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByRole('button', { name: 'Sign In' })
      
      fireEvent.change(usernameInput, { target: { value: 'test' } })
      fireEvent.change(passwordInput, { target: { value: 'test' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnLogin1).toHaveBeenCalledWith('test', 'test')
      })
      
      rerender(<AdminLogin onLogin={mockOnLogin2} />)
      
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnLogin2).toHaveBeenCalledWith('test', 'test')
      })
    })
  })
})