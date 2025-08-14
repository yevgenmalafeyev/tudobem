'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';

interface AuthFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

export default function AuthForm({ onSuccess, onBack }: AuthFormProps) {
  const { configuration } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    privacyPolicyAgreed: false,
    emailMarketingConsent: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const benefits = configuration.appLanguage === 'pt' ? {
    title: '🚀 Por que criar uma conta?',
    items: [
      '📊 Acompanhe seu progresso e estatísticas',
      '⭐ Salve suas configurações pessoais',
      '🏆 Veja sua evolução por nível e tópico',
      '📱 Sincronize entre dispositivos',
      '🎯 Exercícios personalizados',
      '💫 Totalmente gratuito, sempre!'
    ],
    fastAndFree: '⚡ Cadastro rápido - apenas 1 minuto e é gratuito!',
    privacyInfo: 'Seus dados são protegidos conforme nossa',
    privacyLink: 'Política de Privacidade',
    termsLink: 'Termos de Uso'
  } : {
    title: '🚀 Why create an account?',
    items: [
      '📊 Track your progress and statistics',
      '⭐ Save your personal settings',
      '🏆 See your evolution by level and topic',
      '📱 Sync across devices',
      '🎯 Personalized exercises',
      '💫 Completely free, always!'
    ],
    fastAndFree: '⚡ Quick signup - just 1 minute and it\'s free!',
    privacyInfo: 'Your data is protected according to our',
    privacyLink: 'Privacy Policy',
    termsLink: 'Terms of Service'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (showForgotPassword) {
        // Password reset flow
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });

        const result = await response.json();

        if (response.ok) {
          setSuccess(result.message || 'Password reset link sent to your email');
          setShowForgotPassword(false);
        } else {
          setError(result.error || 'Failed to send reset link');
        }
      } else if (isSignUp) {
        // Sign up flow
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
          setSuccess(result.message || 'Account created successfully! Check your email to verify.');
          setIsSignUp(false);
          setFormData({ name: '', email: '', password: '', privacyPolicyAgreed: false, emailMarketingConsent: false });
        } else {
          setError(result.error || 'Failed to create account');
        }
      } else {
        // Login flow
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
          credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
          // Set session cookie
          document.cookie = `session-token=${result.token}; path=/; max-age=${30 * 24 * 60 * 60}; secure; samesite=strict`;
          setSuccess('Login successful!');
          if (onSuccess) onSuccess();
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google') => {
    try {
      setLoading(true);
      const result = await signIn(provider, { 
        callbackUrl: '/',
        redirect: false 
      });
      
      if (result?.ok) {
        if (onSuccess) onSuccess();
      } else if (result?.error) {
        setError(`OAuth login failed: ${result.error}`);
      }
    } catch (err) {
      console.error('OAuth error:', err);
      setError('OAuth login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForgotPassword(false);
    setIsSignUp(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Benefits Panel - Always Show */}
        <div className="order-2 lg:order-1">
          <div className="neo-card h-full">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--neo-text)' }}>
              {benefits.title}
            </h2>
            
            <div className="space-y-4 mb-6">
              {benefits.items.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-lg">{benefit.split(' ')[0]}</span>
                  <span style={{ color: 'var(--neo-text-muted)' }}>
                    {benefit.split(' ').slice(1).join(' ')}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center p-4 rounded-lg mb-6" style={{ backgroundColor: 'var(--neo-bg-secondary)' }}>
              <p className="font-semibold text-green-600">
                {benefits.fastAndFree}
              </p>
            </div>

            <div className="text-center text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              {benefits.privacyInfo}{' '}
              <a href="/privacy" className="underline" style={{ color: 'var(--neo-accent)' }}>
                {benefits.privacyLink}
              </a>{' '}
              e{' '}
              <a href="/terms" className="underline" style={{ color: 'var(--neo-accent)' }}>
                {benefits.termsLink}
              </a>
            </div>
          </div>
        </div>

        {/* Auth Form Panel */}
        <div className="order-1 lg:order-2">
          <div className="neo-card">
            {onBack && (
              <button
                onClick={onBack}
                className="neo-button neo-button-secondary mb-4"
              >
                {t('back', configuration.appLanguage)}
              </button>
            )}

            <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--neo-text)' }}>
              {showForgotPassword ? 
                (configuration.appLanguage === 'pt' ? 'Redefinir Senha' : 'Reset Password') :
                isSignUp ? 
                  (configuration.appLanguage === 'pt' ? 'Criar Conta' : 'Create Account') : 
                  (configuration.appLanguage === 'pt' ? 'Entrar' : 'Login')
              }
            </h1>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-200">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                    {configuration.appLanguage === 'pt' ? 'Nome completo' : 'Full name'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="neo-input w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    minLength={2}
                    maxLength={100}
                    placeholder={configuration.appLanguage === 'pt' ? 'Seu nome completo' : 'Your full name'}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="neo-input w-full"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {!showForgotPassword && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                    {configuration.appLanguage === 'pt' ? 'Senha' : 'Password'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    minLength={8}
                    className="neo-input w-full"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  {isSignUp && (
                    <p className="text-xs mt-1" style={{ color: 'var(--neo-text-muted)' }}>
                      {configuration.appLanguage === 'pt' 
                        ? 'A senha deve ter pelo menos 8 caracteres'
                        : 'Password must be at least 8 characters'
                      }
                    </p>
                  )}
                </div>
              )}

              {isSignUp && (
                <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--neo-border)' }}>
                  {/* Privacy Policy Agreement - Required */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacyPolicy"
                      required
                      className="mt-1"
                      checked={formData.privacyPolicyAgreed}
                      onChange={(e) => setFormData({ ...formData, privacyPolicyAgreed: e.target.checked })}
                    />
                    <label htmlFor="privacyPolicy" className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                      {configuration.appLanguage === 'pt' ? (
                        <>Concordo com a <a href="/privacy" target="_blank" className="underline" style={{ color: 'var(--neo-accent)' }}>Política de Privacidade</a> e os <a href="/terms" target="_blank" className="underline" style={{ color: 'var(--neo-accent)' }}>Termos de Uso</a> <span className="text-red-500">*</span></>
                      ) : (
                        <>I agree to the <a href="/privacy" target="_blank" className="underline" style={{ color: 'var(--neo-accent)' }}>Privacy Policy</a> and <a href="/terms" target="_blank" className="underline" style={{ color: 'var(--neo-accent)' }}>Terms of Service</a> <span className="text-red-500">*</span></>
                      )}
                    </label>
                  </div>

                  {/* Marketing Consent - Optional */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="emailMarketing"
                      className="mt-1"
                      checked={formData.emailMarketingConsent}
                      onChange={(e) => setFormData({ ...formData, emailMarketingConsent: e.target.checked })}
                    />
                    <label htmlFor="emailMarketing" className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                      {configuration.appLanguage === 'pt' 
                        ? 'Quero receber por email novidades sobre recursos e oportunidades de aprendizado (opcional)'
                        : 'I want to receive email updates about new features and learning opportunities (optional)'
                      }
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="neo-button neo-button-primary w-full"
              >
                {loading ? '...' : showForgotPassword ? 
                  (configuration.appLanguage === 'pt' ? 'Enviar Link de Redefinição' : 'Send Reset Link') :
                  isSignUp ? 
                    (configuration.appLanguage === 'pt' ? 'Criar Conta' : 'Create Account') : 
                    (configuration.appLanguage === 'pt' ? 'Entrar' : 'Login')
                }
              </button>
            </form>

            {/* OAuth Section - Only show for login/signup, not password reset */}
            {!showForgotPassword && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: 'var(--neo-border)' }}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2" style={{ backgroundColor: 'var(--neo-bg)', color: 'var(--neo-text-muted)' }}>
                      {configuration.appLanguage === 'pt' ? 'ou continue com' : 'or continue with'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading}
                    className="neo-button neo-button-secondary w-full flex items-center justify-center gap-3 py-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {configuration.appLanguage === 'pt' ? 'Continuar com Google' : 'Continue with Google'}
                  </button>


                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4 text-sm">
                {!showForgotPassword && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                        setSuccess('');
                      }}
                      className="neo-button neo-button-ghost"
                    >
                      {isSignUp 
                        ? (configuration.appLanguage === 'pt' ? 'Já tem conta?' : 'Already have an account?')
                        : (configuration.appLanguage === 'pt' ? 'Criar conta' : 'Create account')
                      }
                    </button>
                    
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="neo-button neo-button-ghost"
                      >
                        {configuration.appLanguage === 'pt' ? 'Esqueceu a senha?' : 'Forgot password?'}
                      </button>
                    )}
                  </>
                )}

                {showForgotPassword && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="neo-button neo-button-ghost"
                  >
                    {configuration.appLanguage === 'pt' ? 'Voltar ao login' : 'Back to login'}
                  </button>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}