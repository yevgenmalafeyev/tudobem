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
    const targetView = !isConfigured ? 'configuration' : 'learning';
    
    console.log('🏠 [DEBUG] Home useEffect triggered:', {
      isConfigured,
      currentView,
      willSetTo: targetView,
      needsChange: currentView !== targetView
    });
    
    // Only change view if it's actually different to prevent unnecessary unmount/remount cycles
    if (currentView !== targetView) {
      console.log('🏠 [DEBUG] Changing view from', currentView, 'to', targetView);
      setCurrentView(targetView);
    }
  }, [isConfigured, currentView]);

  const handleConfigurationSave = () => {
    console.log('🏠 [DEBUG] handleConfigurationSave called, switching to learning view');
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
