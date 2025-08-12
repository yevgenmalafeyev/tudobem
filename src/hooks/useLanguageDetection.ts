'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { AppLanguage } from '@/types';

// Detect browser language preference
const detectBrowserLanguage = (): AppLanguage => {
  if (typeof window === 'undefined') return 'pt';
  
  const browserLang = navigator.language.toLowerCase();
  
  // Check for exact matches first
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('uk') || browserLang.startsWith('ua')) return 'uk';
  if (browserLang.startsWith('en')) return 'en';
  
  // Check secondary language preferences
  const languages = navigator.languages || [navigator.language];
  for (const lang of languages) {
    const lowercaseLang = lang.toLowerCase();
    if (lowercaseLang.startsWith('pt')) return 'pt';
    if (lowercaseLang.startsWith('uk') || lowercaseLang.startsWith('ua')) return 'uk';
    if (lowercaseLang.startsWith('en')) return 'en';
  }
  
  // Default to Portuguese
  return 'pt';
};

export const useLanguageDetection = () => {
  const { configuration, configurationSaved, setConfiguration } = useStore();

  useEffect(() => {
    // Only set browser language if user hasn't saved configuration yet
    if (!configurationSaved) {
      const browserLanguage = detectBrowserLanguage();
      
      // Only update if different from current language
      if (configuration.appLanguage !== browserLanguage) {
        setConfiguration({
          ...configuration,
          appLanguage: browserLanguage
        });
        // Reset configurationSaved to false since this is automatic detection
        useStore.setState({ configurationSaved: false });
      }
    }
  }, [configuration, configurationSaved, setConfiguration]);
};