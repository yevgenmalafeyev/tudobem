'use client';

import { useState } from 'react';
import Logo from '@/components/Logo';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await onLogin(username, password);
      
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="neo-card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="scale-150" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--neo-text)' }}>
            Tudobem Admin
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--neo-text-muted)' }}>
            Sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="neo-input w-full"
              placeholder="Enter username"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neo-input w-full"
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-sm text-center" style={{ color: 'var(--neo-error)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="neo-button neo-button-primary w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}