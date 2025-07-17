'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Configuration from '@/components/Configuration';
import Learning from '@/components/Learning';
import Flashcards from '@/components/Flashcards';
import Header from '@/components/Header';

export default function Home() {
  const { isConfigured } = useStore();
  const [currentView, setCurrentView] = useState<'learning' | 'configuration' | 'flashcards'>('learning');
  
  useEffect(() => {
    if (!isConfigured) {
      setCurrentView('configuration');
    } else {
      setCurrentView('learning');
    }
  }, [isConfigured]);

  const handleConfigurationSave = () => {
    setCurrentView('learning');
  };

  return (
    <div className="min-h-screen safe-area-inset" style={{ background: 'var(--neo-bg)', color: 'var(--neo-text)' }}>
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-8 pb-safe">
        {currentView === 'configuration' ? (
          <Configuration onSave={handleConfigurationSave} />
        ) : currentView === 'flashcards' ? (
          <Flashcards />
        ) : (
          <Learning />
        )}
      </main>
    </div>
  );
}
