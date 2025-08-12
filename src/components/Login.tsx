'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';
import { signIn, getProviders } from 'next-auth/react';
// Import removed - will use API calls instead

interface LoginProps {
  onSuccess?: () => void;
}

type LoginMode = 'login' | 'signup' | 'forgot-password';

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function Login({ onSuccess }: LoginProps) {
  const { configuration } = useStore();
  const [mode, setMode] = useState<LoginMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

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
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const result = await response.json();
        
        if (result.success) {
          setSuccessMessage(result.message || t('passwordResetSent', configuration.appLanguage));
          setTimeout(() => {
            setMode('login');
            setSuccessMessage('');
          }, 5000);
        } else {
          setError(result.error || t('unexpectedError', configuration.appLanguage));
        }
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

        {/* OAuth Providers Section */}
        {providers && Object.keys(providers).length > 0 && (
          <>
            <div className="mt-6 flex items-center">
              <div className="flex-1 border-t" style={{ borderColor: 'var(--neo-border)' }}></div>
              <span className="px-3 text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                {t('orContinueWith', configuration.appLanguage)}
              </span>
              <div className="flex-1 border-t" style={{ borderColor: 'var(--neo-border)' }}></div>
            </div>
            
            <div className="mt-4 space-y-3">
              {Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                  className="w-full flex items-center justify-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium transition-colors"
                  style={{
                    borderColor: 'var(--neo-border)',
                    backgroundColor: 'var(--neo-bg)',
                    color: 'var(--neo-text)'
                  }}
                >
                  {provider.id === 'google' && (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {provider.id === 'facebook' && (
                    <svg className="w-5 h-5 mr-3" fill="#1877f2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  Continue with {provider.name}
                </button>
              ))}
            </div>
          </>
        )}

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