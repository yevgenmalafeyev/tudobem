import { AppLanguage } from '@/types';

export interface LegalSection {
  title: string;
  content: string;
}

export interface LegalContent {
  title: string;
  lastUpdated: string;
  sections: Record<string, LegalSection>;
}

export const getPrivacyContent = (language: AppLanguage): LegalContent => {
  const contents: Record<AppLanguage, LegalContent> = {
    pt: {
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
    },
    en: {
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
    },
    uk: {
      title: 'Політика Конфіденційності',
      lastUpdated: 'Останнє оновлення: 12 серпня 2025',
      sections: {
        introduction: {
          title: '1. Вступ',
          content: 'TudoBem зобов\'язується захищати вашу конфіденційність. Ця Політика Конфіденційності пояснює, як ми збираємо, використовуємо та захищаємо вашу особисту інформацію, коли ви користуєтеся нашою платформою для вивчення португальської мови.'
        },
        dataCollection: {
          title: '2. Інформація, яку ми Збираємо',
          content: `Ми збираємо наступну інформацію:
        • Інформація про обліковий запис: ім\'я користувача, електронна пошта, пароль (зашифрований)
        • Дані про прогрес: відповіді на вправи, оцінки, завершені рівні
        • Технічні дані: IP-адреса, тип браузера, відвідані сторінки
        • Файли cookie: для підтримки вашої сесії та налаштувань`
        },
        dataUse: {
          title: '3. Як ми Використовуємо вашу Інформацію',
          content: `Ми використовуємо вашу інформацію для:
        • Надання та покращення наших освітніх послуг
        • Відстеження вашого прогресу в навчанні
        • Персоналізації вашого досвіду
        • Повідомлення про оновлення (лише за вашою згодою)
        • Забезпечення безпеки платформи`
        },
        dataSharing: {
          title: '4. Обмін Даними',
          content: 'Ми не продаємо та не ділимося вашою особистою інформацією з третіми сторонами, за винятком випадків, необхідних для роботи наших послуг або коли цього вимагає закон.'
        },
        cookies: {
          title: '5. Файли Cookie',
          content: 'Ми використовуємо основні файли cookie для функціонування сайту та файли cookie налаштувань для запам\'ятовування ваших настройок. Ви можете керувати налаштуваннями файлів cookie в налаштуваннях браузера.'
        },
        rights: {
          title: '6. Ваші Права (GDPR)',
          content: `Ви маєте право:
        • Отримувати доступ до своїх особистих даних
        • Виправляти неточну інформацію
        • Запитувати видалення ваших даних
        • Переносимість даних
        • Відкликати згоду в будь-який час`
        },
        security: {
          title: '7. Безпека',
          content: 'Ми застосовуємо відповідні заходи безпеки для захисту вашої інформації, включаючи шифрування паролів та безпечні з\'єднання.'
        },
        contact: {
          title: '8. Контакт',
          content: 'З питань конфіденційності звертайтеся до нас: privacy@tudobem.app'
        }
      }
    }
  };

  return contents[language];
};

export const getTermsContent = (language: AppLanguage): LegalContent => {
  const contents: Record<AppLanguage, LegalContent> = {
    pt: {
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
    },
    en: {
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
    },
    uk: {
      title: 'Умови Використання',
      lastUpdated: 'Останнє оновлення: 12 серпня 2025',
      sections: {
        acceptance: {
          title: '1. Прийняття Умов',
          content: 'Використовуючи платформу TudoBem, ви погоджуєтесь з цими Умовами Використання. Якщо ви не погоджуєтесь, будь ласка, не використовуйте наші послуги.'
        },
        description: {
          title: '2. Опис Сервісу',
          content: 'TudoBem - це безкоштовна онлайн-платформа для вивчення португальської мови, яка пропонує інтерактивні вправи, відстеження прогресу та освітні ресурси.'
        },
        userAccounts: {
          title: '3. Облікові Записи Користувачів',
          content: `• Ви несете відповідальність за безпеку вашого облікового запису
        • Надавайте точну інформацію під час реєстрації
        • Не ділитесь вашими обліковими даними
        • Повідомляйте нас про будь-яке несанкціоноване використання`
        },
        acceptableUse: {
          title: '4. Допустиме Використання',
          content: `Ви погоджуєтесь НЕ:
        • Використовувати сервіс для незаконних цілей
        • Намагатися зламати або завдати шкоди платформі
        • Створювати кілька облікових записів для обходу обмежень
        • Ділитися неприйнятним або образливим контентом`
        },
        intellectualProperty: {
          title: '5. Інтелектуальна Власність',
          content: 'Контент платформи TudoBem (вправи, пояснення, інтерфейс) захищений авторським правом. Ви можете використовувати його для особистого навчання, але не розповсюджувати комерційно.'
        },
        privacy: {
          title: '6. Конфіденційність',
          content: 'Наше використання вашої інформації регулюється нашою Політикою Конфіденційності, яка є частиною цих умов.'
        },
        termination: {
          title: '7. Припинення',
          content: 'Ми можемо припинити або призупинити ваш обліковий запис, якщо ви порушите ці умови. Ви можете припинити використання вашого облікового запису в будь-який час.'
        },
        disclaimers: {
          title: '8. Відмови від Відповідальності',
          content: 'Сервіс надається "як є". Ми не гарантуємо, що він завжди буде доступним або безпомилковим. Використовуйте на власний ризик.'
        },
        changes: {
          title: '9. Зміни в Умовах',
          content: 'Ми можемо час від часу оновлювати ці умови. Продовжуючи використовувати сервіс після змін, ви приймаєте нові умови.'
        },
        contact: {
          title: '10. Контакт',
          content: 'З питань про ці умови звертайтесь до нас: legal@tudobem.app'
        }
      }
    }
  };

  return contents[language];
};