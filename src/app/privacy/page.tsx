'use client';

import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';

export default function PrivacyPolicy() {
  const { configuration } = useStore();

  const content = configuration.appLanguage === 'pt' ? {
    title: 'Política de Privacidade',
    lastUpdated: 'Última atualização: 12 de agosto de 2025',
    sections: {
      introduction: {
        title: '1. Introdução',
        content: 'A TudoBem está comprometida com a proteção da sua privacidade. Esta Política de Privacidade explica como coletamos, usamos e protegemos as suas informações pessoais quando você usa nossa plataforma de aprendizagem de português.'
      },
      dataCollection: {
        title: '2. Informações que Coletamos',
        content: `Coletamos as seguintes informações:
        • Informações de conta: nome de usuário, email, senha (criptografada)
        • Dados de progresso: respostas aos exercícios, pontuações, níveis completados
        • Dados técnicos: endereço IP, tipo de navegador, páginas visitadas
        • Cookies: para manter sua sessão e preferências`
      },
      dataUse: {
        title: '3. Como Usamos Suas Informações',
        content: `Usamos suas informações para:
        • Fornecer e melhorar nossos serviços educacionais
        • Acompanhar seu progresso de aprendizagem
        • Personalizar sua experiência
        • Comunicar sobre atualizações (apenas se você consentir)
        • Garantir a segurança da plataforma`
      },
      dataSharing: {
        title: '4. Compartilhamento de Dados',
        content: 'Não vendemos nem compartilhamos suas informações pessoais com terceiros, exceto quando necessário para operar nossos serviços ou quando exigido por lei.'
      },
      cookies: {
        title: '5. Cookies',
        content: 'Usamos cookies essenciais para o funcionamento do site e cookies de preferências para lembrar suas configurações. Você pode gerenciar suas preferências de cookies nas configurações do navegador.'
      },
      rights: {
        title: '6. Seus Direitos (GDPR)',
        content: `Você tem o direito de:
        • Acessar seus dados pessoais
        • Corrigir informações incorretas
        • Solicitar a exclusão de seus dados
        • Portabilidade de dados
        • Retirar consentimento a qualquer momento`
      },
      security: {
        title: '7. Segurança',
        content: 'Implementamos medidas de segurança adequadas para proteger suas informações, incluindo criptografia de senhas e conexões seguras.'
      },
      contact: {
        title: '8. Contato',
        content: 'Para questões sobre privacidade, entre em contato conosco em: privacy@tudobem.app'
      }
    }
  } : {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: August 12, 2025',
    sections: {
      introduction: {
        title: '1. Introduction',
        content: 'TudoBem is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our Portuguese learning platform.'
      },
      dataCollection: {
        title: '2. Information We Collect',
        content: `We collect the following information:
        • Account information: username, email, password (encrypted)
        • Progress data: exercise answers, scores, completed levels
        • Technical data: IP address, browser type, pages visited
        • Cookies: to maintain your session and preferences`
      },
      dataUse: {
        title: '3. How We Use Your Information',
        content: `We use your information to:
        • Provide and improve our educational services
        • Track your learning progress
        • Personalize your experience
        • Communicate about updates (only if you consent)
        • Ensure platform security`
      },
      dataSharing: {
        title: '4. Data Sharing',
        content: 'We do not sell or share your personal information with third parties, except as necessary to operate our services or when required by law.'
      },
      cookies: {
        title: '5. Cookies',
        content: 'We use essential cookies for site functionality and preference cookies to remember your settings. You can manage cookie preferences in your browser settings.'
      },
      rights: {
        title: '6. Your Rights (GDPR)',
        content: `You have the right to:
        • Access your personal data
        • Correct inaccurate information
        • Request deletion of your data
        • Data portability
        • Withdraw consent at any time`
      },
      security: {
        title: '7. Security',
        content: 'We implement appropriate security measures to protect your information, including password encryption and secure connections.'
      },
      contact: {
        title: '8. Contact',
        content: 'For privacy questions, contact us at: privacy@tudobem.app'
      }
    }
  };

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