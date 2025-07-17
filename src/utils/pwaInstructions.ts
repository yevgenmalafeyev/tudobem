import { AppLanguage } from '@/types';

export interface PWAInstruction {
  platform: string;
  browser: string;
  steps: string[];
  icon?: string;
}

export function getPWAInstructions(language: AppLanguage): {
  [key: string]: PWAInstruction[];
} {
  const instructions = {
    pt: {
      ios: [
        {
          platform: 'iOS',
          browser: 'Safari',
          steps: [
            '1. Abra este site no Safari',
            '2. Toque no botão "Partilhar" (ícone de seta para cima) na parte inferior',
            '3. Deslize para baixo e toque em "Adicionar ao Ecrã Principal"',
            '4. Toque em "Adicionar" no canto superior direito',
            '5. A aplicação será adicionada ao seu ecrã principal'
          ],
          icon: '📱'
        }
      ],
      android: [
        {
          platform: 'Android',
          browser: 'Chrome',
          steps: [
            '1. Abra este site no Chrome',
            '2. Toque no menu (três pontos) no canto superior direito',
            '3. Toque em "Adicionar ao ecrã principal" ou "Instalar aplicação"',
            '4. Toque em "Adicionar" ou "Instalar"',
            '5. A aplicação será adicionada ao seu ecrã principal'
          ],
          icon: '🤖'
        },
        {
          platform: 'Android',
          browser: 'Firefox',
          steps: [
            '1. Abra este site no Firefox',
            '2. Toque no menu (três pontos) no canto superior direito',
            '3. Toque em "Adicionar ao ecrã principal"',
            '4. Toque em "Adicionar"',
            '5. A aplicação será adicionada ao seu ecrã principal'
          ],
          icon: '🦊'
        },
        {
          platform: 'Android',
          browser: 'Edge',
          steps: [
            '1. Abra este site no Microsoft Edge',
            '2. Toque no menu (três pontos) na parte inferior',
            '3. Toque em "Adicionar ao ecrã principal"',
            '4. Toque em "Adicionar"',
            '5. A aplicação será adicionada ao seu ecrã principal'
          ],
          icon: '🌐'
        }
      ],
      desktop: [
        {
          platform: 'Desktop',
          browser: 'Chrome',
          steps: [
            '1. Abra este site no Chrome',
            '2. Clique no ícone de instalação na barra de endereços (ou use Ctrl+Shift+A)',
            '3. Clique em "Instalar" na janela pop-up',
            '4. A aplicação será adicionada ao seu sistema'
          ],
          icon: '💻'
        },
        {
          platform: 'Desktop',
          browser: 'Firefox',
          steps: [
            '1. Abra este site no Firefox',
            '2. Clique no menu (três linhas) no canto superior direito',
            '3. Clique em "Instalar esta aplicação"',
            '4. Clique em "Instalar"',
            '5. A aplicação será adicionada ao seu sistema'
          ],
          icon: '🦊'
        },
        {
          platform: 'Desktop',
          browser: 'Edge',
          steps: [
            '1. Abra este site no Microsoft Edge',
            '2. Clique no ícone de instalação na barra de endereços',
            '3. Clique em "Instalar" na janela pop-up',
            '4. A aplicação será adicionada ao seu sistema'
          ],
          icon: '🌐'
        }
      ]
    },
    en: {
      ios: [
        {
          platform: 'iOS',
          browser: 'Safari',
          steps: [
            '1. Open this site in Safari',
            '2. Tap the "Share" button (arrow up icon) at the bottom',
            '3. Scroll down and tap "Add to Home Screen"',
            '4. Tap "Add" in the top right corner',
            '5. The app will be added to your home screen'
          ],
          icon: '📱'
        }
      ],
      android: [
        {
          platform: 'Android',
          browser: 'Chrome',
          steps: [
            '1. Open this site in Chrome',
            '2. Tap the menu (three dots) in the top right corner',
            '3. Tap "Add to home screen" or "Install app"',
            '4. Tap "Add" or "Install"',
            '5. The app will be added to your home screen'
          ],
          icon: '🤖'
        },
        {
          platform: 'Android',
          browser: 'Firefox',
          steps: [
            '1. Open this site in Firefox',
            '2. Tap the menu (three dots) in the top right corner',
            '3. Tap "Add to home screen"',
            '4. Tap "Add"',
            '5. The app will be added to your home screen'
          ],
          icon: '🦊'
        },
        {
          platform: 'Android',
          browser: 'Edge',
          steps: [
            '1. Open this site in Microsoft Edge',
            '2. Tap the menu (three dots) at the bottom',
            '3. Tap "Add to home screen"',
            '4. Tap "Add"',
            '5. The app will be added to your home screen'
          ],
          icon: '🌐'
        }
      ],
      desktop: [
        {
          platform: 'Desktop',
          browser: 'Chrome',
          steps: [
            '1. Open this site in Chrome',
            '2. Click the install icon in the address bar (or use Ctrl+Shift+A)',
            '3. Click "Install" in the popup window',
            '4. The app will be added to your system'
          ],
          icon: '💻'
        },
        {
          platform: 'Desktop',
          browser: 'Firefox',
          steps: [
            '1. Open this site in Firefox',
            '2. Click the menu (three lines) in the top right corner',
            '3. Click "Install this site as an app"',
            '4. Click "Install"',
            '5. The app will be added to your system'
          ],
          icon: '🦊'
        },
        {
          platform: 'Desktop',
          browser: 'Edge',
          steps: [
            '1. Open this site in Microsoft Edge',
            '2. Click the install icon in the address bar',
            '3. Click "Install" in the popup window',
            '4. The app will be added to your system'
          ],
          icon: '🌐'
        }
      ]
    },
    uk: {
      ios: [
        {
          platform: 'iOS',
          browser: 'Safari',
          steps: [
            '1. Відкрийте цей сайт у Safari',
            '2. Натисніть кнопку "Поділитися" (стрілка вгору) внизу',
            '3. Прокрутіть вниз і натисніть "Додати на головний екран"',
            '4. Натисніть "Додати" у верхньому правому куті',
            '5. Додаток буде додано на ваш головний екран'
          ],
          icon: '📱'
        }
      ],
      android: [
        {
          platform: 'Android',
          browser: 'Chrome',
          steps: [
            '1. Відкрийте цей сайт у Chrome',
            '2. Натисніть меню (три крапки) у верхньому правому куті',
            '3. Натисніть "Додати на головний екран" або "Встановити додаток"',
            '4. Натисніть "Додати" або "Встановити"',
            '5. Додаток буде додано на ваш головний екран'
          ],
          icon: '🤖'
        },
        {
          platform: 'Android',
          browser: 'Firefox',
          steps: [
            '1. Відкрийте цей сайт у Firefox',
            '2. Натисніть меню (три крапки) у верхньому правому куті',
            '3. Натисніть "Додати на головний екран"',
            '4. Натисніть "Додати"',
            '5. Додаток буде додано на ваш головний екран'
          ],
          icon: '🦊'
        },
        {
          platform: 'Android',
          browser: 'Edge',
          steps: [
            '1. Відкрийте цей сайт у Microsoft Edge',
            '2. Натисніть меню (три крапки) внизу',
            '3. Натисніть "Додати на головний екран"',
            '4. Натисніть "Додати"',
            '5. Додаток буде додано на ваш головний екран'
          ],
          icon: '🌐'
        }
      ],
      desktop: [
        {
          platform: 'Desktop',
          browser: 'Chrome',
          steps: [
            '1. Відкрийте цей сайт у Chrome',
            '2. Натисніть іконку встановлення в адресному рядку (або Ctrl+Shift+A)',
            '3. Натисніть "Встановити" у спливаючому вікні',
            '4. Додаток буде додано у вашу систему'
          ],
          icon: '💻'
        },
        {
          platform: 'Desktop',
          browser: 'Firefox',
          steps: [
            '1. Відкрийте цей сайт у Firefox',
            '2. Натисніть меню (три лінії) у верхньому правому куті',
            '3. Натисніть "Встановити цей сайт як додаток"',
            '4. Натисніть "Встановити"',
            '5. Додаток буде додано у вашу систему'
          ],
          icon: '🦊'
        },
        {
          platform: 'Desktop',
          browser: 'Edge',
          steps: [
            '1. Відкрийте цей сайт у Microsoft Edge',
            '2. Натисніть іконку встановлення в адресному рядку',
            '3. Натисніть "Встановити" у спливаючому вікні',
            '4. Додаток буде додано у вашу систему'
          ],
          icon: '🌐'
        }
      ]
    }
  };

  return instructions[language] || instructions.en;
}

export function getPWAButtonText(language: AppLanguage): string {
  const texts = {
    pt: 'Instalar como Aplicação',
    en: 'Install as App',
    uk: 'Встановити як Додаток'
  };
  
  return texts[language] || texts.en;
}

export function getPWAModalTitle(language: AppLanguage): string {
  const texts = {
    pt: 'Instalar Aplicação',
    en: 'Install App',
    uk: 'Встановити Додаток'
  };
  
  return texts[language] || texts.en;
}

export function getPWADetectionText(platform: string, browser: string, language: AppLanguage): string {
  const texts = {
    pt: `Parece que está a usar ${platform} com ${browser}.`,
    en: `Looks like you're using ${platform} with ${browser}.`,
    uk: `Схоже, ви використовуєте ${platform} з ${browser}.`
  };
  
  return texts[language] || texts.en;
}

export function getPWAOtherPlatformsText(language: AppLanguage): string {
  const texts = {
    pt: 'Ver instruções para outras plataformas',
    en: 'View instructions for other platforms',
    uk: 'Переглянути інструкції для інших платформ'
  };
  
  return texts[language] || texts.en;
}

export function getPWACloseText(language: AppLanguage): string {
  const texts = {
    pt: 'Fechar',
    en: 'Close',
    uk: 'Закрити'
  };
  
  return texts[language] || texts.en;
}