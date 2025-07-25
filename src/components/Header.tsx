'use client';

import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';
import Link from 'next/link';
import Logo from './Logo';

interface HeaderProps {
  currentView: 'learning' | 'configuration' | 'flashcards';
  onViewChange: (view: 'learning' | 'configuration' | 'flashcards') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const { isConfigured, configuration } = useStore();

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
          
          {isConfigured && (
            <nav className="flex flex-wrap gap-2 sm:gap-4">
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
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}