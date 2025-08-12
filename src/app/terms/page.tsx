'use client';

import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';

export default function TermsOfService() {
  const { configuration } = useStore();

  const content = configuration.appLanguage === 'pt' ? {
    title: 'Termos de Uso',
    lastUpdated: 'Última atualização: 12 de agosto de 2025',
    sections: {
      acceptance: {
        title: '1. Aceitação dos Termos',
        content: 'Ao usar a plataforma TudoBem, você concorda com estes Termos de Uso. Se não concordar, não use nossos serviços.'
      },
      description: {
        title: '2. Descrição do Serviço',
        content: 'TudoBem é uma plataforma online gratuita para aprendizagem da língua portuguesa, oferecendo exercícios interativos, acompanhamento de progresso e recursos educacionais.'
      },
      userAccounts: {
        title: '3. Contas de Usuário',
        content: `• Você é responsável pela segurança da sua conta
        • Forneça informações precisas durante o cadastro
        • Não compartilhe suas credenciais de acesso
        • Notifique-nos sobre qualquer uso não autorizado`
      },
      acceptableUse: {
        title: '4. Uso Aceitável',
        content: `Você concorda em NÃO:
        • Usar o serviço para fins ilegais
        • Tentar hackear ou prejudicar a plataforma
        • Criar múltiplas contas para contornar limitações
        • Compartilhar conteúdo inappropriate ou ofensivo`
      },
      intellectualProperty: {
        title: '5. Propriedade Intelectual',
        content: 'O conteúdo da plataforma TudoBem (exercícios, explicações, interface) é protegido por direitos autorais. Você pode usar para aprendizagem pessoal, mas não redistribuir comercialmente.'
      },
      privacy: {
        title: '6. Privacidade',
        content: 'Nosso uso de suas informações é regido pela nossa Política de Privacidade, que faz parte destes termos.'
      },
      termination: {
        title: '7. Encerramento',
        content: 'Podemos encerrar ou suspender sua conta se você violar estes termos. Você pode encerrar sua conta a qualquer momento.'
      },
      disclaimers: {
        title: '8. Isenções de Responsabilidade',
        content: 'O serviço é fornecido "como está". Não garantimos que será sempre disponível ou livre de erros. Use por sua conta e risco.'
      },
      changes: {
        title: '9. Alterações nos Termos',
        content: 'Podemos atualizar estes termos ocasionalmente. Continuando a usar o serviço após alterações, você aceita os novos termos.'
      },
      contact: {
        title: '10. Contato',
        content: 'Para questões sobre estes termos, entre em contato: legal@tudobem.app'
      }
    }
  } : {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: August 12, 2025',
    sections: {
      acceptance: {
        title: '1. Acceptance of Terms',
        content: 'By using the TudoBem platform, you agree to these Terms of Service. If you do not agree, please do not use our services.'
      },
      description: {
        title: '2. Service Description',
        content: 'TudoBem is a free online platform for learning Portuguese, offering interactive exercises, progress tracking, and educational resources.'
      },
      userAccounts: {
        title: '3. User Accounts',
        content: `• You are responsible for your account security
        • Provide accurate information during registration
        • Do not share your login credentials
        • Notify us of any unauthorized use`
      },
      acceptableUse: {
        title: '4. Acceptable Use',
        content: `You agree NOT to:
        • Use the service for illegal purposes
        • Attempt to hack or harm the platform
        • Create multiple accounts to circumvent limitations
        • Share inappropriate or offensive content`
      },
      intellectualProperty: {
        title: '5. Intellectual Property',
        content: 'TudoBem platform content (exercises, explanations, interface) is protected by copyright. You may use it for personal learning but not redistribute commercially.'
      },
      privacy: {
        title: '6. Privacy',
        content: 'Our use of your information is governed by our Privacy Policy, which is part of these terms.'
      },
      termination: {
        title: '7. Termination',
        content: 'We may terminate or suspend your account if you violate these terms. You may terminate your account at any time.'
      },
      disclaimers: {
        title: '8. Disclaimers',
        content: 'The service is provided "as is". We do not guarantee it will always be available or error-free. Use at your own risk.'
      },
      changes: {
        title: '9. Changes to Terms',
        content: 'We may update these terms occasionally. By continuing to use the service after changes, you accept the new terms.'
      },
      contact: {
        title: '10. Contact',
        content: 'For questions about these terms, contact us at: legal@tudobem.app'
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