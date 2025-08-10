'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';
// Import removed - will use API calls instead

interface LoginProps {
  onSuccess?: () => void;
}

type LoginMode = 'login' | 'signup' | 'forgot-password';

export default function Login({ onSuccess }: LoginProps) {
  const { configuration } = useStore();
  const [mode, setMode] = useState<LoginMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        
        if (result.success) {
          // Set cookie for session
          document.cookie = `session-token=${result.token}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days
          if (onSuccess) onSuccess();
        } else {
          setError(result.error || t('loginFailed', configuration.appLanguage));
        }
      } else if (mode === 'signup') {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role: 'user' })
        });
        const result = await response.json();
        
        if (result.success) {
          setSuccessMessage(t('accountCreated', configuration.appLanguage));
          setMode('login');
          // Clear form
          setPassword('');
        } else {
          setError(result.error || t('signupFailed', configuration.appLanguage));
        }
      } else if (mode === 'forgot-password') {
        // In a real app, this would send a password reset email
        setSuccessMessage(t('passwordResetSent', configuration.appLanguage));
        setTimeout(() => {
          setMode('login');
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      setError(t('unexpectedError', configuration.appLanguage));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <div className="neo-card">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: 'var(--neo-text)' }}>
          {mode === 'login' && t('login', configuration.appLanguage)}
          {mode === 'signup' && t('createAccount', configuration.appLanguage)}
          {mode === 'forgot-password' && t('resetPassword', configuration.appLanguage)}
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--neo-error-bg)', border: '1px solid var(--neo-error)' }}>
            <p className="text-sm" style={{ color: 'var(--neo-error-text)' }}>
              {error}
            </p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--neo-success-bg)', border: '1px solid var(--neo-success)' }}>
            <p className="text-sm" style={{ color: 'var(--neo-success-text)' }}>
              {successMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium" style={{ color: 'var(--neo-text)' }}>
                {t('name', configuration.appLanguage)}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="neo-input w-full"
                placeholder={t('enterName', configuration.appLanguage)}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium" style={{ color: 'var(--neo-text)' }}>
              {t('email', configuration.appLanguage)}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="neo-input w-full"
              placeholder={t('enterEmail', configuration.appLanguage)}
            />
          </div>

          {mode !== 'forgot-password' && (
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium" style={{ color: 'var(--neo-text)' }}>
                {t('password', configuration.appLanguage)}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="neo-input w-full"
                placeholder={t('enterPassword', configuration.appLanguage)}
                minLength={mode === 'signup' ? 8 : undefined}
              />
              {mode === 'signup' && (
                <p className="text-xs mt-1" style={{ color: 'var(--neo-text-muted)' }}>
                  {t('passwordRequirement', configuration.appLanguage)}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="neo-button neo-button-primary w-full py-3 text-base min-h-[44px]"
          >
            {loading ? t('loading', configuration.appLanguage) : (
              <>
                {mode === 'login' && t('loginButton', configuration.appLanguage)}
                {mode === 'signup' && t('signupButton', configuration.appLanguage)}
                {mode === 'forgot-password' && t('sendResetLink', configuration.appLanguage)}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center">
          {mode === 'login' && (
            <>
              <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="hover:underline"
                  style={{ color: 'var(--neo-accent-text)' }}
                >
                  {t('forgotPassword', configuration.appLanguage)}
                </button>
              </p>
              <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                {t('noAccount', configuration.appLanguage)}{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="hover:underline font-semibold"
                  style={{ color: 'var(--neo-accent-text)' }}
                >
                  {t('signupLink', configuration.appLanguage)}
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              {t('haveAccount', configuration.appLanguage)}{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="hover:underline font-semibold"
                style={{ color: 'var(--neo-accent-text)' }}
              >
                {t('loginLink', configuration.appLanguage)}
              </button>
            </p>
          )}

          {mode === 'forgot-password' && (
            <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="hover:underline font-semibold"
                style={{ color: 'var(--neo-accent-text)' }}
              >
                {t('backToLogin', configuration.appLanguage)}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}