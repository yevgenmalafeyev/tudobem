'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { topics } from '@/data/topics';
import { LanguageLevel, AppLanguage } from '@/types';
import { t } from '@/utils/translations';
import { isMobileDevice, checkPWASupport } from '@/utils/pwaDetection';
import { getPWAButtonText } from '@/utils/pwaInstructions';
import PWAInstallModal from './PWAInstallModal';

const levels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const allTenses: string[] = [
  'presente_indicativo', 'pps', 'preterito_imperfeito',
  'imperativo_positivo', 'imperativo_negativo', 'infinitivo_pessoal',
  'futuro_imperfeito', 'condicional_presente', 'conjuntivo_presente',
  'conjuntivo_passado', 'conjuntivo_futuro', 'participio_passado'
];

const TENSE_DISPLAY_NAMES: Record<string, string> = {
  'presente_indicativo': 'Presente Indicativo',
  'pps': 'Pretérito Perfeito Simples',
  'preterito_imperfeito': 'Pretérito Imperfeito',
  'imperativo_positivo': 'Imperativo Positivo',
  'imperativo_negativo': 'Imperativo Negativo',
  'infinitivo_pessoal': 'Infinitivo Pessoal',
  'futuro_imperfeito': 'Futuro Imperfeito',
  'condicional_presente': 'Condicional Presente',
  'conjuntivo_presente': 'Conjuntivo Presente',
  'conjuntivo_passado': 'Conjuntivo Passado',
  'conjuntivo_futuro': 'Conjuntivo Futuro',
  'participio_passado': 'Particípio Passado'
};

interface ConfigurationProps {
  onSave?: () => void;
}

export default function Configuration({ onSave }: ConfigurationProps) {
  const { configuration, setConfiguration } = useStore();
  const [selectedLevels, setSelectedLevels] = useState<LanguageLevel[]>(configuration.selectedLevels);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(configuration.selectedTopics);
  const [appLanguage, setAppLanguage] = useState<AppLanguage>(configuration.appLanguage);
  const [showPWAModal, setShowPWAModal] = useState(false);
  const [showPWAButton, setShowPWAButton] = useState(false);
  const [selectedTenses, setSelectedTenses] = useState<string[]>(
    configuration.irregularVerbsEnabledTenses?.length > 0 
      ? configuration.irregularVerbsEnabledTenses as string[]
      : allTenses
  );
  const [includeVos, setIncludeVos] = useState<boolean>(
    configuration.irregularVerbsIncludeVos ?? false
  );

  const availableTopics = topics.filter(topic => 
    topic.levels.some(level => selectedLevels.includes(level))
  );

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
    // Auto-select topics when levels change
    // Debounce to prevent updates during component unmounting
    timeoutId = setTimeout(() => {
      if (isMounted) {
        setSelectedTopics(prev => {
          const availableTopicIds = availableTopics.map(topic => topic.id);
          
          // If no topics are selected yet (initial state), select all available
          if (prev.length === 0) {
            return availableTopicIds;
          }
          
          // Get currently valid topics that are already selected
          const validExistingTopics = prev.filter(id => availableTopicIds.includes(id));
          
          // Get new topics that became available but aren't selected yet
          const newTopics = availableTopicIds.filter(id => !prev.includes(id));
          
          // Auto-select all available topics (existing + new)
          return [...validExistingTopics, ...newTopics];
        });
      }
    }, 50);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [selectedLevels, availableTopics]);

  useEffect(() => {
    let isMounted = true;
    
    // Check if PWA button should be shown
    // Use setTimeout to avoid blocking and allow cleanup if unmounted
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        const shouldShowPWA = isMobileDevice() && checkPWASupport();
        setShowPWAButton(shouldShowPWA);
      }
    }, 0);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleLevelToggle = (level: LanguageLevel) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId)
        ? prev.filter(t => t !== topicId)
        : [...prev, topicId]
    );
  };

  const handleTenseToggle = (tense: string) => {
    setSelectedTenses(prev => 
      prev.includes(tense)
        ? prev.filter(t => t !== tense)
        : [...prev, tense]
    );
  };

  const handleSelectAllTenses = () => {
    setSelectedTenses(allTenses);
  };

  const handleDeselectAllTenses = () => {
    setSelectedTenses([]);
  };

  const handleSave = () => {
    const configToSave = {
      selectedLevels,
      selectedTopics,
      appLanguage,
      irregularVerbsEnabledTenses: selectedTenses,
      irregularVerbsIncludeVos: includeVos
    };
    
    console.log('⚙️ [DEBUG] Configuration handleSave called:', {
      selectedLevels: configToSave.selectedLevels,
      selectedTopicsCount: configToSave.selectedTopics.length,
      appLanguage: configToSave.appLanguage
    });
    
    setConfiguration(configToSave);
    
    console.log('⚙️ [DEBUG] Configuration saved, calling onSave...');
    
    // Automatically switch to learning view after saving
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center" style={{ color: 'var(--neo-text)' }}>
        {t('configTitle', appLanguage)}
      </h1>
      
      {/* Language Levels */}
      <div className="neo-card mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: 'var(--neo-text)' }}>
          {t('selectLevels', appLanguage)}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {levels.map(level => (
            <button
              key={level}
              onClick={() => handleLevelToggle(level)}
              className={`neo-button text-sm sm:text-base min-h-[44px] p-2 sm:p-3 ${
                selectedLevels.includes(level)
                  ? 'neo-button-primary'
                  : ''
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="neo-card mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: 'var(--neo-text)' }}>
          {t('selectTopics', appLanguage)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {availableTopics.map(topic => (
            <label key={topic.id} className="neo-card-sm cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic.id)}
                  onChange={() => handleTopicToggle(topic.id)}
                  className="neo-checkbox mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm sm:text-base font-medium block" style={{ color: 'var(--neo-text)' }}>{topic.namePt}</span>
                  <span className="text-xs sm:text-sm block" style={{ color: 'var(--neo-text-muted)' }}>({topic.levels.join(', ')})</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>


      {/* PWA Install Button */}
      {showPWAButton && (
        <div className="neo-card mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: 'var(--neo-text)' }}>
            {t('installApp', appLanguage)}
          </h2>
          <button
            onClick={() => setShowPWAModal(true)}
            className="neo-button neo-button-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] w-full"
          >
            {getPWAButtonText(appLanguage)}
          </button>
        </div>
      )}

      {/* Irregular Verbs Tenses */}
      <div className="neo-card mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--neo-text)' }}>
            Verbos Irregulares - Tempos Verbais
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAllTenses}
              className="neo-button neo-button-secondary text-xs px-2 py-1"
            >
              Todos
            </button>
            <button
              onClick={handleDeselectAllTenses}
              className="neo-button neo-button-secondary text-xs px-2 py-1"
            >
              Nenhum
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allTenses.map(tense => (
            <label key={tense} className="flex items-start space-x-3 cursor-pointer neo-card-sm hover-lift">
              <input
                type="checkbox"
                checked={selectedTenses.includes(tense)}
                onChange={() => handleTenseToggle(tense)}
                className="neo-checkbox mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium" style={{ color: 'var(--neo-text)' }}>
                  {TENSE_DISPLAY_NAMES[tense as keyof typeof TENSE_DISPLAY_NAMES] || tense}
                </span>
              </div>
            </label>
          ))}
        </div>
        
        {/* Include Vós Toggle */}
        <div className="mt-4 p-3 neo-inset-sm rounded-lg">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeVos}
              onChange={(e) => setIncludeVos(e.target.checked)}
              className="neo-checkbox"
            />
            <div className="flex-1">
              <span className="text-sm font-medium" style={{ color: 'var(--neo-text)' }}>
                Incluir formas de &quot;vós&quot;
              </span>
              <p className="text-xs mt-1" style={{ color: 'var(--neo-text-muted)' }}>
                Incluir as formas de segunda pessoa do plural (vós) nos exercícios
              </p>
            </div>
          </label>
        </div>
        
        <p className="text-xs mt-4" style={{ color: 'var(--neo-text-muted)' }}>
          Selecione os tempos verbais que deseja praticar nos exercícios de verbos irregulares.
        </p>
      </div>

      {/* App Language */}
      <div className="neo-card mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: 'var(--neo-text)' }}>
          {t('appLanguageTitle', appLanguage)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="neo-card-sm cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="appLanguage"
                value="pt"
                checked={appLanguage === 'pt'}
                onChange={(e) => setAppLanguage(e.target.value as AppLanguage)}
                className="w-5 h-5"
              />
              <span className="text-sm sm:text-base font-medium" style={{ color: 'var(--neo-text)' }}>
                {t('portuguese', appLanguage)}
              </span>
            </div>
          </label>
          <label className="neo-card-sm cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="appLanguage"
                value="en"
                checked={appLanguage === 'en'}
                onChange={(e) => setAppLanguage(e.target.value as AppLanguage)}
                className="w-5 h-5"
              />
              <span className="text-sm sm:text-base font-medium" style={{ color: 'var(--neo-text)' }}>
                {t('english', appLanguage)}
              </span>
            </div>
          </label>
          <label className="neo-card-sm cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="appLanguage"
                value="uk"
                checked={appLanguage === 'uk'}
                onChange={(e) => setAppLanguage(e.target.value as AppLanguage)}
                className="w-5 h-5"
              />
              <span className="text-sm sm:text-base font-medium" style={{ color: 'var(--neo-text)' }}>
                {t('ukrainian', appLanguage)}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSave}
          disabled={selectedLevels.length === 0 || selectedTopics.length === 0 || selectedTenses.length === 0}
          className="neo-button neo-button-success w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base min-h-[44px]"
        >
          {t('saveAndStart', appLanguage)}
        </button>
      </div>

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={showPWAModal}
        onClose={() => setShowPWAModal(false)}
        language={appLanguage}
      />
    </div>
  );
}