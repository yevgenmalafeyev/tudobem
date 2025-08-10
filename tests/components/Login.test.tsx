import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '@/components/Login';
import { UserDatabase } from '@/lib/userDatabase';

// Mock the store
const mockConfiguration = {
  selectedLevels: ['A1'],
  selectedTopics: ['verbo-estar'],
  appLanguage: 'en' as const
};

jest.mock('@/store/useStore', () => ({
  useStore: () => ({
    configuration: mockConfiguration
  })
}));

// Mock translations
jest.mock('@/utils/translations', () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      'login': 'Login',
      'createAccount': 'Create Account',
      'resetPassword': 'Reset Password',
      'name': 'Name',
      'email': 'Email',
      'password': 'Password',
      'enterName': 'Enter your name',
      'enterEmail': 'Enter your email',
      'enterPassword': 'Enter your password',
      'passwordRequirement': 'Password must be at least 8 characters',
      'loginButton': 'Login',
      'signupButton': 'Create Account',
      'sendResetLink': 'Send Reset Link',
      'forgotPassword': 'Forgot password?',
      'noAccount': 'Don\'t have an account?',
      'haveAccount': 'Already have an account?',
      'signupLink': 'Sign up',
      'loginLink': 'Log in',
      'backToLogin': 'Back to login',
      'loading': 'Loading...',
      'loginFailed': 'Login failed. Please check your credentials.',
      'signupFailed': 'Failed to create account. Please try again.',
      'unexpectedError': 'Unexpected error. Please try again.',
      'accountCreated': 'Account created successfully! You can now log in.',
      'passwordResetSent': 'Reset link sent to your email.'
    };
    return translations[key] || key;
  }
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Login Component', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: ''
    });
  });

  it('should render login form by default', () => {
    render(<Login onSuccess={mockOnSuccess} />);
    
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should switch to signup mode when signup link is clicked', () => {
    render(<Login onSuccess={mockOnSuccess} />);
    
    fireEvent.click(screen.getByText('Sign up'));
    
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  it('should switch to forgot password mode when forgot password link is clicked', () => {
    render(<Login onSuccess={mockOnSuccess} />);
    
    fireEvent.click(screen.getByText('Forgot password?'));
    
    expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        token: 'test-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'user' }
      })
    } as Response);

    render(<Login onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should handle login failure', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        error: 'Invalid credentials'
      })
    } as Response);

    render(<Login onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it('should handle successful signup', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'user' }
      })
    } as Response);

    render(<Login onSuccess={mockOnSuccess} />);
    
    // Switch to signup mode
    fireEvent.click(screen.getByText('Sign up'));
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123', name: 'Test User', role: 'user' })
      });
      expect(screen.getByText('Account created successfully! You can now log in.')).toBeInTheDocument();
    });
  });

  it('should handle signup failure', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        error: 'Email already exists'
      })
    } as Response);

    render(<Login onSuccess={mockOnSuccess} />);
    
    // Switch to signup mode
    fireEvent.click(screen.getByText('Sign up'));
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('should handle forgot password flow', async () => {
    render(<Login onSuccess={mockOnSuccess} />);
    
    // Switch to forgot password mode
    fireEvent.click(screen.getByText('Forgot password?'));
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    await waitFor(() => {
      expect(screen.getByText('Reset link sent to your email.')).toBeInTheDocument();
    });

    // Should automatically switch back to login mode after 3 seconds
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('should show loading state during login', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      ok: true,
      json: async () => ({ success: true, token: 'test-token', user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'user' } })
    } as Response), 100)));

    render(<Login onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should validate required fields', () => {
    render(<Login onSuccess={mockOnSuccess} />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('should enforce password minimum length in signup mode', () => {
    render(<Login onSuccess={mockOnSuccess} />);
    
    // Switch to signup mode
    fireEvent.click(screen.getByText('Sign up'));
    
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('minLength', '8');
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('should work without onSuccess prop', () => {
    render(<Login />);
    
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('should navigate between different modes correctly', () => {
    render(<Login onSuccess={mockOnSuccess} />);
    
    // Start in login mode
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    
    // Go to signup
    fireEvent.click(screen.getByText('Sign up'));
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    
    // Go back to login
    fireEvent.click(screen.getByText('Log in'));
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    
    // Go to forgot password
    fireEvent.click(screen.getByText('Forgot password?'));
    expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
    
    // Go back to login
    fireEvent.click(screen.getByText('Back to login'));
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });
});