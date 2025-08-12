'use client';

import { useStore } from '@/store/useStore';

export default function Footer() {
  const { configuration } = useStore();

  const content = configuration.appLanguage === 'pt' ? {
    copyright: '© 2025 TudoBem. Todos os direitos reservados.',
    privacy: 'Política de Privacidade',
    terms: 'Termos de Uso',
    contact: 'Contato'
  } : {
    copyright: '© 2025 TudoBem. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact'
  };

  return (
    <footer className="mt-16 py-8 border-t" style={{ borderColor: 'var(--neo-border)', backgroundColor: 'var(--neo-bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
            {content.copyright}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <a 
              href="/privacy"
              className="hover:underline transition-all"
              style={{ color: 'var(--neo-text-muted)' }}
            >
              {content.privacy}
            </a>
            <a 
              href="/terms"
              className="hover:underline transition-all"
              style={{ color: 'var(--neo-text-muted)' }}
            >
              {content.terms}
            </a>
            <a 
              href="mailto:hello@tudobem.app"
              className="hover:underline transition-all"
              style={{ color: 'var(--neo-text-muted)' }}
            >
              {content.contact}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}