'use client';

import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';
import { getTermsContent } from '@/utils/legalContent';

export default function TermsOfService() {
  const { configuration } = useStore();
  
  const content = getTermsContent(configuration.appLanguage);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--neo-bg)' }}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="neo-card">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--neo-text)' }}>
              {content.title}
            </h1>
            <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              {content.lastUpdated}
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(content.sections).map(([key, section]) => (
              <section key={key}>
                <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--neo-text)' }}>
                  {section.title}
                </h2>
                <div 
                  className="whitespace-pre-line leading-relaxed" 
                  style={{ color: 'var(--neo-text-muted)' }}
                >
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t" style={{ borderColor: 'var(--neo-border)' }}>
            <button
              onClick={() => window.history.back()}
              className="neo-button neo-button-secondary"
            >
              {t('back', configuration.appLanguage)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}