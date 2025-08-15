'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useAuthSync } from '@/hooks/useAuthSync';
import Configuration from '@/components/Configuration';
import Learning from '@/components/Learning';
import Flashcards from '@/components/Flashcards';
import IrregularVerbsLearning from '@/components/IrregularVerbsLearning';
import UserProfile from '@/components/UserProfile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';

export default function HomeClient() {
  const { isConfigured, configuration } = useStore();
  const [currentView, setCurrentView] = useState<'learning' | 'configuration' | 'flashcards' | 'login' | 'irregular-verbs' | 'profile'>('learning');
  
  // Initialize authentication sync
  useAuthSync();
  
  useEffect(() => {
    console.log('🏠 [DEBUG] useEffect triggered:', { isConfigured, currentView });
    // Only auto-redirect to configuration if not configured
    // Don't auto-redirect from configuration back to learning
    if (!isConfigured && currentView !== 'configuration') {
      console.log('🏠 [DEBUG] Redirecting to configuration - not configured');
      setCurrentView('configuration');
    }
  }, [isConfigured, currentView]);

  const handleConfigurationSave = () => {
    console.log('🏠 [DEBUG] handleConfigurationSave called, switching to learning view');
    setCurrentView('learning');
  };

  const handleViewChange = (view: 'learning' | 'configuration' | 'flashcards' | 'login' | 'irregular-verbs' | 'profile') => {
    console.log('🏠 [DEBUG] handleViewChange called:', { from: currentView, to: view, isConfigured });
    setCurrentView(view);
  };

  const handleLoginSuccess = () => {
    console.log('🏠 [DEBUG] Login successful, redirecting to learning');
    setCurrentView('learning');
  };

  return (
    <div className="min-h-screen safe-area-inset" style={{ background: 'var(--neo-bg)', color: 'var(--neo-text)' }}>
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-8 pb-safe">
        {currentView === 'configuration' ? (
          <Configuration onSave={handleConfigurationSave} />
        ) : currentView === 'flashcards' ? (
          <Flashcards />
        ) : currentView === 'login' ? (
          <AuthForm onSuccess={handleLoginSuccess} onBack={() => setCurrentView('learning')} />
        ) : currentView === 'irregular-verbs' ? (
          <IrregularVerbsLearning userConfig={configuration} onViewChange={handleViewChange} />
        ) : currentView === 'profile' ? (
          <UserProfile onBack={() => setCurrentView('learning')} />
        ) : (
          <Learning onViewChange={handleViewChange} />
        )}
      </main>

      <Footer />
    </div>
  );
}