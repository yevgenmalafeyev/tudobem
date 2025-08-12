import { AppLanguage } from '@/types';

export const translations = {
  // Header
  appTitle: {
    pt: 'Tudobem',
    en: 'Tudobem',
    uk: 'Tudobem'
  },
  learning: {
    pt: 'Aprender Gramática',
    en: 'Learn Grammar',
    uk: 'Вивчення Граматики'
  },
  flashcards: {
    pt: 'Cartões',
    en: 'Flashcards',
    uk: 'Картки'
  },
  configuration: {
    pt: 'Configurar',
    en: 'Configure',
    uk: 'Налаштувати'
  },

  // Configuration
  configTitle: {
    pt: 'Configure a Sua Aprendizagem de Português',
    en: 'Configure Your Portuguese Learning',
    uk: 'Налаштуйте Вивчення Португальської'
  },
  selectLevels: {
    pt: 'Selecione os Seus Níveis de Idioma',
    en: 'Select Your Language Levels',
    uk: 'Оберіть Рівні Мови'
  },
  selectTopics: {
    pt: 'Selecione Tópicos',
    en: 'Select Topics',
    uk: 'Оберіть Теми'
  },
  appLanguageTitle: {
    pt: 'Idioma da Interface e Explicações',
    en: 'Interface and Explanation Language',
    uk: 'Мова Інтерфейсу та Пояснень'
  },
  installApp: {
    pt: 'Instalar Aplicação',
    en: 'Install App',
    uk: 'Встановити Додаток'
  },
  claudeApiKey: {
    pt: 'Chave API Claude AI (Opcional)',
    en: 'Claude AI API Key (Optional)',
    uk: 'Ключ API Claude AI (Опціонально)'
  },
  apiKeyPlaceholder: {
    pt: 'Insira a sua chave API Claude para exercícios com IA',
    en: 'Enter your Claude API key for AI-powered exercises',
    uk: 'Введіть ваш ключ API Claude для вправ з ШІ'
  },
  apiKeyHelp: {
    pt: 'Pode obter a sua chave API na',
    en: 'You can get your API key from',
    uk: 'Ви можете отримати ваш ключ API з'
  },
  apiKeyLocalHint: {
    pt: 'A chave API é armazenada apenas localmente no seu computador',
    en: 'API key is stored locally on your computer only',
    uk: 'Ключ API зберігається лише локально на вашому комп\'ютері'
  },
  anthropicConsole: {
    pt: 'Consola Anthropic',
    en: 'Anthropic Console',
    uk: 'Консоль Anthropic'
  },
  optional: {
    pt: 'opcional',
    en: 'optional',
    uk: 'опціонально'
  },
  readyToStart: {
    pt: 'Pronto para começar!',
    en: 'Ready to start!',
    uk: 'Готовий почати!'
  },
  databaseExercisesAvailable: {
    pt: 'Pode começar a aprender imediatamente com exercícios da base de dados.',
    en: 'You can start learning immediately with database exercises.',
    uk: 'Ви можете негайно почати навчання з вправами з бази даних.'
  },
  apiKeyOptionalNote: {
    pt: 'A chave API só é necessária para administradores gerarem novos exercícios.',
    en: 'API key is only needed for administrators to generate new exercises.',
    uk: 'Ключ API потрібен лише адміністраторам для генерації нових вправ.'
  },
  saveAndStart: {
    pt: 'Guardar Configuração e Começar a Aprender',
    en: 'Save Configuration & Start Learning',
    uk: 'Зберегти Конфігурацію і Почати Навчання'
  },

  // Learning
  loadingExercise: {
    pt: 'A carregar exercício...',
    en: 'Loading exercise...',
    uk: 'Завантаження вправи...'
  },
  loadingError: {
    pt: 'Erro ao carregar exercício',
    en: 'Error loading exercise',
    uk: 'Помилка завантаження вправи'
  },
  tryAgain: {
    pt: 'Tentar novamente',
    en: 'Try again',
    uk: 'Спробувати знову'
  },
  correct: {
    pt: 'Correto!',
    en: 'Correct!',
    uk: 'Правильно!'
  },
  incorrect: {
    pt: 'Incorreto',
    en: 'Incorrect',
    uk: 'Неправильно'
  },
  checking: {
    pt: 'A verificar...',
    en: 'Checking...',
    uk: 'Перевірка...'
  },
  checkAnswer: {
    pt: 'Verificar Resposta',
    en: 'Check Answer',
    uk: 'Перевірити Відповідь'
  },
  enterToCheck: {
    pt: 'Prima Enter para verificar a resposta',
    en: 'Press Enter to check your answer',
    uk: 'Натисніть Enter для перевірки відповіді'
  },
  selectOption: {
    pt: 'Selecione uma opção',
    en: 'Select an option',
    uk: 'Оберіть варіант'
  },
  loading: {
    pt: 'A carregar...',
    en: 'Loading...',
    uk: 'Завантаження...'
  },
  nextExercise: {
    pt: 'Próximo Exercício',
    en: 'Next Exercise',
    uk: 'Наступна Вправа'
  },
  grammarRule: {
    pt: 'Regra Gramatical',
    en: 'Grammar Rule',
    uk: 'Граматичне Правило'
  },
  grammarForm: {
    pt: 'Forma Gramatical',
    en: 'Grammar Form',
    uk: 'Граматична Форма'
  },
  enterForNext: {
    pt: 'Prima Enter para a próxima pergunta',
    en: 'Press Enter for next question',
    uk: 'Натисніть Enter для наступного питання'
  },
  clickToShowTopic: {
    pt: 'Clique para mostrar o tópico',
    en: 'Click to show topic',
    uk: 'Клацніть, щоб показати тему'
  },
  
  // Learning modes
  inputMode: {
    pt: 'Digitar Resposta',
    en: 'Type Answer',
    uk: 'Ввести Відповідь'
  },
  multipleChoiceMode: {
    pt: 'Mostrar Opções',
    en: 'Show Options',
    uk: 'Показати Варіанти'
  },
  learningMode: {
    pt: 'Modo de Aprendizagem',
    en: 'Learning Mode',
    uk: 'Режим Навчання'
  },

  // Flashcards
  flashcardCollections: {
    pt: 'Coleções de Cartões',
    en: 'Flashcard Collections',
    uk: 'Колекції Карток'
  },
  newCollection: {
    pt: 'Nova Coleção',
    en: 'New Collection',
    uk: 'Нова Колекція'
  },
  import: {
    pt: 'Importar',
    en: 'Import',
    uk: 'Імпорт'
  },
  export: {
    pt: 'Exportar',
    en: 'Export',
    uk: 'Експорт'
  },
  study: {
    pt: 'Estudar',
    en: 'Study',
    uk: 'Вивчати'
  },
  manage: {
    pt: 'Gerir',
    en: 'Manage',
    uk: 'Керувати'
  },
  cards: {
    pt: 'cartões',
    en: 'cards',
    uk: 'карток'
  },
  cancel: {
    pt: 'Cancelar',
    en: 'Cancel',
    uk: 'Скасувати'
  },
  create: {
    pt: 'Criar',
    en: 'Create',
    uk: 'Створити'
  },
  save: {
    pt: 'Guardar',
    en: 'Save',
    uk: 'Зберегти'
  },
  edit: {
    pt: 'Editar',
    en: 'Edit',
    uk: 'Редагувати'
  },
  delete: {
    pt: 'Eliminar',
    en: 'Delete',
    uk: 'Видалити'
  },
  back: {
    pt: 'Voltar',
    en: 'Back',
    uk: 'Назад'
  },

  // Language names
  portuguese: {
    pt: 'Português',
    en: 'Portuguese',
    uk: 'Португальська'
  },
  english: {
    pt: 'English',
    en: 'English',
    uk: 'Англійська'
  },
  ukrainian: {
    pt: 'Ucraniano',
    en: 'Ukrainian',
    uk: 'Українська'
  },

  // Authentication
  login: {
    pt: 'Entrar',
    en: 'Login',
    uk: 'Вхід'
  },
  logout: {
    pt: 'Sair',
    en: 'Logout',
    uk: 'Вихід'
  },
  createAccount: {
    pt: 'Criar Conta',
    en: 'Create Account',
    uk: 'Створити Обліковий Запис'
  },
  resetPassword: {
    pt: 'Redefinir Senha',
    en: 'Reset Password',
    uk: 'Скинути Пароль'
  },
  name: {
    pt: 'Nome',
    en: 'Name',
    uk: 'Ім\'я'
  },
  email: {
    pt: 'Email',
    en: 'Email',
    uk: 'Електронна пошта'
  },
  password: {
    pt: 'Senha',
    en: 'Password',
    uk: 'Пароль'
  },
  enterName: {
    pt: 'Digite o seu nome',
    en: 'Enter your name',
    uk: 'Введіть ваше ім\'я'
  },
  enterEmail: {
    pt: 'Digite o seu email',
    en: 'Enter your email',
    uk: 'Введіть вашу електронну пошту'
  },
  enterPassword: {
    pt: 'Digite a sua senha',
    en: 'Enter your password',
    uk: 'Введіть ваш пароль'
  },
  passwordRequirement: {
    pt: 'A senha deve ter pelo menos 8 caracteres',
    en: 'Password must be at least 8 characters',
    uk: 'Пароль повинен містити щонайменше 8 символів'
  },
  loginButton: {
    pt: 'Entrar',
    en: 'Login',
    uk: 'Увійти'
  },
  signupButton: {
    pt: 'Criar Conta',
    en: 'Create Account',
    uk: 'Створити Обліковий Запис'
  },
  sendResetLink: {
    pt: 'Enviar Link de Redefinição',
    en: 'Send Reset Link',
    uk: 'Надіслати Посилання для Скидання'
  },
  forgotPassword: {
    pt: 'Esqueceu a senha?',
    en: 'Forgot password?',
    uk: 'Забули пароль?'
  },
  noAccount: {
    pt: 'Não tem conta?',
    en: 'Don\'t have an account?',
    uk: 'Немає облікового запису?'
  },
  haveAccount: {
    pt: 'Já tem conta?',
    en: 'Already have an account?',
    uk: 'Уже маєте обліковий запис?'
  },
  signupLink: {
    pt: 'Criar conta',
    en: 'Sign up',
    uk: 'Зареєструватися'
  },
  loginLink: {
    pt: 'Entrar',
    en: 'Log in',
    uk: 'Увійти'
  },
  backToLogin: {
    pt: 'Voltar ao login',
    en: 'Back to login',
    uk: 'Назад до входу'
  },
  loginFailed: {
    pt: 'Falha no login. Verifique as suas credenciais.',
    en: 'Login failed. Please check your credentials.',
    uk: 'Помилка входу. Перевірте ваші облікові дані.'
  },
  signupFailed: {
    pt: 'Falha ao criar conta. Tente novamente.',
    en: 'Failed to create account. Please try again.',
    uk: 'Не вдалося створити обліковий запис. Спробуйте ще раз.'
  },
  unexpectedError: {
    pt: 'Erro inesperado. Tente novamente.',
    en: 'Unexpected error. Please try again.',
    uk: 'Неочікувана помилка. Спробуйте ще раз.'
  },
  accountCreated: {
    pt: 'Conta criada com sucesso! Agora pode fazer login.',
    en: 'Account created successfully! You can now log in.',
    uk: 'Обліковий запис успішно створено! Тепер ви можете увійти.'
  },
  passwordResetSent: {
    pt: 'Link de redefinição enviado para o seu email.',
    en: 'Reset link sent to your email.',
    uk: 'Посилання для скидання надіслано на вашу електронну пошту.'
  },
  orContinueWith: {
    pt: 'ou continuar com',
    en: 'or continue with',
    uk: 'або продовжити з'
  },
  passwordsDoNotMatch: {
    pt: 'As senhas não coincidem',
    en: 'Passwords do not match',
    uk: 'Паролі не збігаються'
  },

  // Common
  wellDone: {
    pt: 'Muito bem.',
    en: 'Well done.',
    uk: 'Молодець.'
  },
  correctAnswer: {
    pt: 'A resposta correta é',
    en: 'The correct answer is',
    uk: 'Правильна відповідь'
  },
  explanation: {
    pt: 'Explicação',
    en: 'Explanation',
    uk: 'Пояснення'
  },

  // User Profile
  userProfile: {
    pt: 'Perfil do Utilizador',
    en: 'User Profile',
    uk: 'Профіль Користувача'
  },
  accountInformation: {
    pt: 'Informações da Conta',
    en: 'Account Information',
    uk: 'Інформація про Обліковий Запис'
  },
  username: {
    pt: 'Nome de Utilizador',
    en: 'Username',
    uk: 'Ім\'я Користувача'
  },
  memberSince: {
    pt: 'Membro Desde',
    en: 'Member Since',
    uk: 'Учасник З'
  },
  lastActive: {
    pt: 'Última Atividade',
    en: 'Last Active',
    uk: 'Остання Активність'
  },
  verified: {
    pt: 'Verificado',
    en: 'Verified',
    uk: 'Підтверджено'
  },
  pending: {
    pt: 'Pendente',
    en: 'Pending',
    uk: 'Очікує'
  },
  overallPerformance: {
    pt: 'Desempenho Geral',
    en: 'Overall Performance',
    uk: 'Загальні Результати'
  },
  totalAttempts: {
    pt: 'Total de Tentativas',
    en: 'Total Attempts',
    uk: 'Загальних Спроб'
  },
  correctAnswers: {
    pt: 'Respostas Corretas',
    en: 'Correct Answers',
    uk: 'Правильних Відповідей'
  },
  accuracyRate: {
    pt: 'Taxa de Acerto',
    en: 'Accuracy Rate',
    uk: 'Точність'
  },
  progressByLevel: {
    pt: 'Progresso por Nível',
    en: 'Progress by Level',
    uk: 'Прогрес за Рівнями'
  },
  attempts: {
    pt: 'tentativas',
    en: 'attempts',
    uk: 'спроб'
  },
  topicPerformance: {
    pt: 'Desempenho por Tópico',
    en: 'Topic Performance',
    uk: 'Результати за Темами'
  },
  correctCount: {
    pt: 'corretas',
    en: 'correct',
    uk: 'правильних'
  },
  userDataNotAvailable: {
    pt: 'Dados do utilizador não disponíveis',
    en: 'User data not available',
    uk: 'Дані користувача недоступні'
  },
  authenticationRequired: {
    pt: 'Autenticação necessária',
    en: 'Authentication required',
    uk: 'Потрібна автентифікація'
  },
  failedToLoadUserData: {
    pt: 'Falha ao carregar dados do utilizador',
    en: 'Failed to load user data',
    uk: 'Не вдалося завантажити дані користувача'
  },

  // Privacy Policy
  privacyPolicy: {
    pt: 'Política de Privacidade',
    en: 'Privacy Policy',
    uk: 'Політика Конфіденційності'
  },
  termsOfService: {
    pt: 'Termos de Uso',
    en: 'Terms of Service',
    uk: 'Умови Використання'
  },
  lastUpdated: {
    pt: 'Última atualização',
    en: 'Last updated',
    uk: 'Останнє оновлення'
  },

  // Privacy sections
  introduction: {
    pt: 'Introdução',
    en: 'Introduction',
    uk: 'Вступ'
  },
  dataCollection: {
    pt: 'Informações que Coletamos',
    en: 'Information We Collect',
    uk: 'Інформація, яку ми Збираємо'
  },
  dataUse: {
    pt: 'Como Usamos Suas Informações',
    en: 'How We Use Your Information',
    uk: 'Як ми Використовуємо вашу Інформацію'
  },
  dataSharing: {
    pt: 'Compartilhamento de Dados',
    en: 'Data Sharing',
    uk: 'Обмін Даними'
  },
  cookies: {
    pt: 'Cookies',
    en: 'Cookies',
    uk: 'Файли Cookie'
  },
  yourRights: {
    pt: 'Seus Direitos (GDPR)',
    en: 'Your Rights (GDPR)',
    uk: 'Ваші Права (GDPR)'
  },
  security: {
    pt: 'Segurança',
    en: 'Security',
    uk: 'Безпека'
  },
  contact: {
    pt: 'Contato',
    en: 'Contact',
    uk: 'Контакт'
  },

  // Terms sections
  acceptanceOfTerms: {
    pt: 'Aceitação dos Termos',
    en: 'Acceptance of Terms',
    uk: 'Прийняття Умов'
  },
  serviceDescription: {
    pt: 'Descrição do Serviço',
    en: 'Service Description',
    uk: 'Опис Сервісу'
  },
  userAccounts: {
    pt: 'Contas de Usuário',
    en: 'User Accounts',
    uk: 'Облікові Записи Користувачів'
  },
  acceptableUse: {
    pt: 'Uso Aceitável',
    en: 'Acceptable Use',
    uk: 'Допустиме Використання'
  },
  intellectualProperty: {
    pt: 'Propriedade Intelectual',
    en: 'Intellectual Property',
    uk: 'Інтелектуальна Власність'
  },
  privacy: {
    pt: 'Privacidade',
    en: 'Privacy',
    uk: 'Конфіденційність'
  },
  termination: {
    pt: 'Encerramento',
    en: 'Termination',
    uk: 'Припинення'
  },
  disclaimers: {
    pt: 'Isenções de Responsabilidade',
    en: 'Disclaimers',
    uk: 'Відмови від Відповідальності'
  },
  changesToTerms: {
    pt: 'Alterações nos Termos',
    en: 'Changes to Terms',
    uk: 'Зміни в Умовах'
  },

  // Problem Report
  problemReport: {
    pt: 'Reportar Problema',
    en: 'Report Problem',
    uk: 'Повідомити про Проблему'
  },
  button: {
    pt: 'Reportar Problema',
    en: 'Report Problem',
    uk: 'Повідомити про Проблему'
  },
  buttonTitle: {
    pt: 'Reportar um problema com este exercício',
    en: 'Report a problem with this exercise',
    uk: 'Повідомити про проблему з цією вправою'
  },
  title: {
    pt: 'Reportar Problema com Exercício',
    en: 'Report Exercise Problem',
    uk: 'Повідомити про Проблему з Вправою'
  },
  exercisePreview: {
    pt: 'Pré-visualização do Exercício',
    en: 'Exercise Preview',
    uk: 'Попередній Перегляд Вправи'
  },
  sentence: {
    pt: 'Frase',
    en: 'Sentence',
    uk: 'Речення'
  },
  hint: {
    pt: 'Dica',
    en: 'Hint',
    uk: 'Підказка'
  },
  options: {
    pt: 'Opções',
    en: 'Options',
    uk: 'Варіанти'
  },
  selectProblem: {
    pt: 'Selecione o tipo de problema:',
    en: 'Select the type of problem:',
    uk: 'Оберіть тип проблеми:'
  },
  detailsLabel: {
    pt: 'Descreva detalhadamente o que está errado',
    en: 'Describe in detail what is wrong',
    uk: 'Детально опишіть, що не так'
  },
  detailsPlaceholder: {
    pt: 'Por favor, explique o problema que encontrou com este exercício...',
    en: 'Please explain the problem you found with this exercise...',
    uk: 'Будь ласка, поясніть проблему, яку ви знайшли з цією вправою...'
  },
  required: {
    pt: 'obrigatório',
    en: 'required',
    uk: 'обов\'язково'
  },
  submit: {
    pt: 'Enviar Relatório',
    en: 'Submit Report',
    uk: 'Надіслати Звіт'
  },
  submitting: {
    pt: 'A enviar...',
    en: 'Submitting...',
    uk: 'Надсилання...'
  },
  thankYou: {
    pt: 'Obrigado!',
    en: 'Thank You!',
    uk: 'Дякуємо!'
  },
  submitted: {
    pt: 'O seu relatório foi enviado com sucesso. Agradecemos a sua ajuda para tornar o Tudobem melhor!',
    en: 'Your report has been submitted successfully. Thank you for helping to make Tudobem better!',
    uk: 'Ваш звіт було успішно надіслано. Дякуємо за допомогу в покращенні Tudobem!'
  },
  commentTooShort: {
    pt: 'O comentário deve ter pelo menos 10 caracteres',
    en: 'Comment must be at least 10 characters long',
    uk: 'Коментар повинен містити щонайменше 10 символів'
  },
  submitError: {
    pt: 'Erro ao enviar o relatório. Tente novamente.',
    en: 'Error submitting report. Please try again.',
    uk: 'Помилка під час надсилання звіту. Спробуйте ще раз.'
  },
  networkError: {
    pt: 'Erro de conexão. Verifique a sua ligação à internet.',
    en: 'Network error. Please check your internet connection.',
    uk: 'Помилка мережі. Перевірте підключення до інтернету.'
  },

  // Problem Types
  'problemType.irrelevantHint': {
    pt: 'A dica é irrelevante ou torna a solução muito simples',
    en: 'The hint is irrelevant or makes the solution too simple',
    uk: 'Підказка нерелевантна або робить рішення занадто простим'
  },
  'problemType.incorrectAnswer': {
    pt: 'A resposta correta apresentada pelo Tudobem está incorreta',
    en: 'The correct answer claimed by Tudobem is incorrect',
    uk: 'Правильна відповідь, заявлена Tudobem, неправильна'
  },
  'problemType.missingOption': {
    pt: 'A opção correta está ausente entre as sugeridas',
    en: 'The correct option is absent among the suggested',
    uk: 'Правильний варіант відсутній серед запропонованих'
  },
  'problemType.other': {
    pt: 'Outro',
    en: 'Other',
    uk: 'Інше'
  }
};

export const getTranslation = (key: keyof typeof translations, language: AppLanguage): string => {
  return translations[key][language] || translations[key]['pt'];
};

export const t = (key: keyof typeof translations, language: AppLanguage): string => {
  return getTranslation(key, language);
};