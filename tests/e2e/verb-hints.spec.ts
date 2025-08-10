import { test, expect } from '@playwright/test';

test.describe('Verb Hints and Grammar Explanations', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API to return exercises with hints
    await page.route('/api/exercises/batch', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            exercises: [
              {
                id: 'test-1',
                sentence: 'Eu ___ ao cinema ontem à noite.',
                correctAnswer: 'fui',
                gapIndex: 3,
                topic: 'preterito-perfeito-simples',
                level: 'A2',
                hint: {
                  infinitive: 'ir',
                  person: '(1ª pessoa)',
                  form: 'pretérito perfeito',
                  grammarRule: 'Pretérito perfeito: exprime ações completas no passado. Ir: eu fui, tu foste, ele foi...'
                },
                multipleChoiceOptions: ['fui', 'ia', 'vou', 'fosse'],
                explanations: {
                  pt: 'Usamos "fui" (pretérito perfeito do verbo "ir") para ações específicas e completas no passado.',
                  en: 'We use "fui" (simple past of "ir") for specific completed actions in the past.',
                  uk: 'Ми використовуємо "fui" (минулий час дієслова "ir") для конкретних завершених дій у минулому.'
                },
              }
            ],
            generatedCount: 1,
            sessionId: 'test-session'
          }
        })
      });
    });

    // Navigate to learning page
    await page.goto('/learning');
  });

  test('should display verb infinitive as hint in input placeholder', async ({ page }) => {
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Check that the input placeholder contains the verb infinitive
    const input = page.locator('[data-testid="exercise-input"]');
    await expect(input).toHaveAttribute('placeholder', 'ir (1ª pessoa)');
  });

  test('should show grammar explanation for incorrect answers', async ({ page }) => {
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Enter incorrect answer
    await page.fill('[data-testid="exercise-input"]', 'vou');
    
    // Check answer
    await page.click('text=Check Answer');
    
    // Wait for feedback
    await page.waitForSelector('text=✗ Incorrect');
    
    // Verify grammar explanation is shown
    await expect(page.locator('text=Grammar Rule')).toBeVisible();
    await expect(page.locator('text=Pretérito perfeito: exprime ações completas no passado')).toBeVisible();
  });

  test('should show enhanced multilingual explanation for incorrect answers', async ({ page }) => {
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Enter incorrect answer
    await page.fill('[data-testid="exercise-input"]', 'ia');
    
    // Check answer
    await page.click('text=Check Answer');
    
    // Wait for feedback
    await page.waitForSelector('text=✗ Incorrect');
    
    // Verify enhanced explanation is shown
    await expect(page.locator('text=💡 Explanation:')).toBeVisible();
    await expect(page.locator('text=We use "fui" (simple past of "ir") for specific completed actions in the past.')).toBeVisible();
    await expect(page.locator('text=EN')).toBeVisible();
  });

  test('should not show grammar explanation for correct answers', async ({ page }) => {
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Enter correct answer
    await page.fill('[data-testid="exercise-input"]', 'fui');
    
    // Check answer
    await page.click('text=Check Answer');
    
    // Wait for feedback
    await page.waitForSelector('text=✓ Correct!');
    
    // Verify grammar explanation is NOT shown
    await expect(page.locator('text=Grammar Rule')).not.toBeVisible();
  });

  test('should display hints in multiple choice mode', async ({ page }) => {
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Switch to multiple choice mode
    await page.click('text=Multiple Choice');
    
    // Wait for mode switch
    await page.waitForSelector('text=fui');
    
    // Verify that the gap shows "?" in multiple choice mode
    await expect(page.locator('text=?')).toBeVisible();
  });

  test('should work with Portuguese language interface', async ({ page }) => {
    // Mock configuration with Portuguese language
    await page.route('/api/config', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          selectedLevels: ['A2'],
          selectedTopics: ['preterito-perfeito-simples'],
          appLanguage: 'pt'
        })
      });
    });

    await page.goto('/learning');
    
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Enter incorrect answer
    await page.fill('[data-testid="exercise-input"]', 'vou');
    
    // Check answer (button text should be in Portuguese)
    await page.click('text=Verificar Resposta');
    
    // Wait for feedback
    await page.waitForSelector('text=✗ Incorreto');
    
    // Verify Portuguese explanation is shown
    await expect(page.locator('text=Usamos "fui" (pretérito perfeito do verbo "ir")')).toBeVisible();
    await expect(page.locator('text=PT')).toBeVisible();
  });

  test('should handle exercises without hints gracefully', async ({ page }) => {
    // Mock API with exercise without hints
    await page.route('/api/exercises/batch', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            exercises: [
              {
                id: 'test-2',
                sentence: 'A casa é ___.',
                correctAnswer: 'bonita',
                gapIndex: 10,
                topic: 'adjetivos',
                level: 'A1',
                multipleChoiceOptions: ['bonita', 'bonito', 'bonitas', 'bonitos'],
                explanations: {
                  pt: 'Adjetivo concorda em gênero e número.',
                  en: 'Adjective agrees in gender and number.',
                  uk: 'Прикметник узгоджується за родом і числом.'
                },
              }
            ],
            generatedCount: 1,
            sessionId: 'test-session'
          }
        })
      });
    });

    await page.goto('/learning');
    
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Check that placeholder shows "?" when no hint is available
    const input = page.locator('[data-testid="exercise-input"]');
    await expect(input).toHaveAttribute('placeholder', '?');
    
    // Enter incorrect answer
    await page.fill('[data-testid="exercise-input"]', 'bonito');
    
    // Check answer
    await page.click('text=Check Answer');
    
    // Wait for feedback
    await page.waitForSelector('text=✗ Incorrect');
    
    // Verify that enhanced explanation still works without grammar rule
    await expect(page.locator('text=💡 Explanation:')).toBeVisible();
    await expect(page.locator('text=Adjective agrees in gender and number.')).toBeVisible();
  });
});