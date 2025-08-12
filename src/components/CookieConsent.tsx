'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function CookieConsent() {
  const { configuration } = useStore();
  const [showBanner, setShowBanner] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Don't show cookie banner during E2E tests
    if (typeof window !== 'undefined' && window.location.search.includes('e2e-test')) {
      return;
    }

    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include'
        });
        if (response.ok) {
          const result = await response.json();
          setIsLoggedIn(result.authenticated);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Show cookie banner only for non-logged users who haven't accepted cookies
    const hasAcceptedCookies = localStorage.getItem('tudobem-cookies-accepted');
    if (!hasAcceptedCookies && !isLoggedIn) {
      setShowBanner(true);
    }
  }, [isLoggedIn]);

  const acceptCookies = () => {
    localStorage.setItem('tudobem-cookies-accepted', 'true');
    setShowBanner(false);
  };

  const declineCookies = () => {
    // Still set the flag to not show again, but don't set tracking cookies
    localStorage.setItem('tudobem-cookies-accepted', 'essential-only');
    setShowBanner(false);
  };

  if (!showBanner || isLoggedIn) {
    return null;
  }

  const content = configuration.appLanguage === 'pt' ? {
    title: '🍪 Este site usa cookies',
    description: 'Usamos cookies essenciais para o funcionamento do site e cookies de preferência para melhorar sua experiência. Seus dados são protegidos conforme nossa Política de Privacidade.',
    acceptAll: 'Aceitar todos',
    essentialOnly: 'Apenas essenciais',
    learnMore: 'Saiba mais'
  } : {
    title: '🍪 This site uses cookies',
    description: 'We use essential cookies for site functionality and preference cookies to improve your experience. Your data is protected according to our Privacy Policy.',
    acceptAll: 'Accept all',
    essentialOnly: 'Essential only',
    learnMore: 'Learn more'
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div 
          className="neo-card shadow-lg border-2"
          style={{ 
            backgroundColor: 'var(--neo-bg)',
            borderColor: 'var(--neo-accent)'
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--neo-text)' }}>
                {content.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--neo-text-muted)' }}>
                {content.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
              <button
                onClick={acceptCookies}
                className="neo-button neo-button-primary px-4 py-2 text-sm"
              >
                {content.acceptAll}
              </button>
              
              <button
                onClick={declineCookies}
                className="neo-button neo-button-secondary px-4 py-2 text-sm"
              >
                {content.essentialOnly}
              </button>
              
              <a
                href="/privacy"
                className="neo-button neo-button-ghost px-4 py-2 text-sm text-center"
                style={{ color: 'var(--neo-accent)' }}
              >
                {content.learnMore}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}