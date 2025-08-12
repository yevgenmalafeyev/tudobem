'use client'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';
import Logo from '@/components/Logo';

export default function ResetPassword() {
  const { configuration } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing reset token');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('passwordsDoNotMatch', configuration.appLanguage));
      return;
    }

    if (newPassword.length < 8) {
      setError(t('passwordRequirement', configuration.appLanguage));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError(result.error || t('unexpectedError', configuration.appLanguage));
      }
    } catch (err) {
      setError(t('unexpectedError', configuration.appLanguage));
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--neo-bg)' }}>
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8" style={{ background: 'var(--neo-card-bg)', border: '1px solid var(--neo-border)' }}>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Logo className="w-16 h-16" />
              </div>
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--neo-success-bg)', border: '1px solid var(--neo-success)' }}>
                <p className="text-sm" style={{ color: 'var(--neo-success-text)' }}>
                  Password reset successfully! You can now log in with your new password.
                </p>
              </div>
              <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                Redirecting to home page in a few seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--neo-bg)' }}>
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8" style={{ background: 'var(--neo-card-bg)', border: '1px solid var(--neo-border)' }}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo className="w-16 h-16" />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--neo-text)' }}>
              {t('resetPassword', configuration.appLanguage)}
            </h1>
            <p className="text-gray-600" style={{ color: 'var(--neo-text-secondary)' }}>
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--neo-error-bg)', border: '1px solid var(--neo-error)' }}>
              <p className="text-sm" style={{ color: 'var(--neo-error-text)' }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block mb-2 text-sm font-medium" style={{ color: 'var(--neo-text)' }}>
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="neo-input w-full"
                placeholder="Enter your new password"
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium" style={{ color: 'var(--neo-text)' }}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="neo-input w-full"
                placeholder="Confirm your new password"
                minLength={8}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--neo-text-muted)' }}>
                {t('passwordRequirement', configuration.appLanguage)}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('loading', configuration.appLanguage) : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-green-600 hover:text-green-500 underline"
              style={{ color: 'var(--neo-accent)' }}
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}