'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';
import Link from 'next/link';
import Logo from './Logo';

interface HeaderProps {
  currentView: 'learning' | 'configuration' | 'flashcards' | 'login' | 'irregular-verbs' | 'profile';
  onViewChange: (view: 'learning' | 'configuration' | 'flashcards' | 'login' | 'irregular-verbs' | 'profile') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const { isConfigured, configuration } = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.authenticated && result.user) {
          setIsLoggedIn(true);
          setUsername(result.user.username);
        } else {
          setIsLoggedIn(false);
          setUsername('');
        }
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    } catch {
      // Network error - user not logged in
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setIsLoggedIn(false);
      setUsername('');
      onViewChange('learning');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="neo-card-sm mx-2 my-2 sm:mx-4 sm:my-4 lg:mx-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Link 
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Logo className="hover:scale-105 transition-transform" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: 'var(--neo-text)' }}>
              {t('appTitle', configuration.appLanguage)}
            </h1>
          </Link>
          
          <nav className="flex flex-wrap gap-2 sm:gap-4">
            {isConfigured && (
              <>
                <button
                  onClick={() => onViewChange('learning')}
                  className={`neo-button text-xs sm:text-sm lg:text-base min-h-[44px] px-2 sm:px-3 lg:px-4 py-2 whitespace-nowrap ${
                    currentView === 'learning'
                      ? 'neo-button-primary'
                      : ''
                  }`}
                >
                  {t('learning', configuration.appLanguage)}
                </button>
                <button
                  onClick={() => onViewChange('irregular-verbs')}
                  className={`neo-button text-xs sm:text-sm lg:text-base min-h-[44px] px-2 sm:px-3 lg:px-4 py-2 whitespace-nowrap ${
                    currentView === 'irregular-verbs'
                      ? 'neo-button-primary'
                      : ''
                  }`}
                >
                  Verbos Irregulares
                </button>
                {/* Cards button temporarily hidden */}
                {false && (
                  <button
                    onClick={() => onViewChange('flashcards')}
                    className={`neo-button text-xs sm:text-sm lg:text-base min-h-[44px] px-2 sm:px-3 lg:px-4 py-2 whitespace-nowrap ${
                      currentView === 'flashcards'
                        ? 'neo-button-primary'
                        : ''
                    }`}
                  >
                    {t('flashcards', configuration.appLanguage)}
                  </button>
                )}
                <button
                  onClick={() => onViewChange('configuration')}
                  className={`neo-button text-xs sm:text-sm lg:text-base min-h-[44px] px-2 sm:px-3 lg:px-4 py-2 whitespace-nowrap ${
                    currentView === 'configuration'
                      ? 'neo-button-primary'
                      : ''
                  }`}
                >
                  {t('configuration', configuration.appLanguage)}
                </button>
              </>
            )}
            
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onViewChange('profile')}
                  className={`neo-button text-xs sm:text-sm lg:text-base min-h-[44px] px-2 sm:px-3 lg:px-4 py-2 whitespace-nowrap ${
                    currentView === 'profile'
                      ? 'neo-button-primary'
                      : ''
                  }`}
                >
                  👤 {username}
                </button>
                <button
                  onClick={handleLogout}
                  className="neo-button neo-button-secondary text-xs sm:text-sm lg:text-base min-h-[44px] px-2 sm:px-3 lg:px-4 py-2 whitespace-nowrap"
                >
                  {t('logout', configuration.appLanguage)}
                </button>
              </>
            ) : (
              <button
                onClick={() => onViewChange('login')}
                className={`neo-button text-xs sm:text-sm lg:text-base min-h-[44px] px-2 sm:px-3 lg:px-4 py-2 whitespace-nowrap ${
                  currentView === 'login'
                    ? 'neo-button-primary'
                    : ''
                }`}
              >
                {t('login', configuration.appLanguage)}
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}