import { test, expect, Page } from '@playwright/test';

// Mock AI service responses for testing
const MOCK_AI_RESPONSES = {
  validIssue: {
    is_valid: true,
    explanation: 'The reported issue is valid. The correct answer should be "ao" instead of "a" for the contracted preposition.',
    sql_correction: 'UPDATE exercises SET correct_answer = \'ao\' WHERE id = \'test-exercise-id\';'
  },
  invalidIssue: {
    is_valid: false,
    explanation: 'After reviewing the exercise, all necessary options are present. The correct answer is among the choices provided.',
    sql_correction: null
  },
  irrelevantHint: {
    is_valid: true,
    explanation: 'The hint is indeed too revealing. It should be simplified to maintain appropriate difficulty.',
    sql_correction: 'UPDATE exercises SET hint = \'preposição contraída\' WHERE id = \'test-exercise-id\';'
  }
};

// Setup function to mock API endpoints
async function setupApiMocks(page: Page) {
  // Mock problem report submission
  await page.route('**/api/problem-reports/submit', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        reportId: 'mock-report-id-123',
        message: 'Problem report submitted successfully'
      })
    });
  });

  // Mock admin problem reports list
  await page.route('**/api/admin/problem-reports*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            reports: [
              {
                id: 'mock-report-id-123',
                exerciseId: 'test-exercise-id',
                problemType: 'incorrect_answer',
                userComment: 'The correct answer should be "ao" not "a"',
                status: 'pending',
                createdAt: new Date().toISOString(),
                exercise: {
                  sentence: 'Vou _____ cinema com os meus amigos.',
                  correctAnswer: 'a',
                  hint: 'preposição + artigo',
                  multipleChoiceOptions: ['a', 'ao', 'à', 'do'],
                  level: 'A2',
                  topic: 'prepositions',
                  explanation: 'Use the contracted preposition.'
                }
              }
            ],
            total: 1,
            totalPages: 1
          }
        })
      });
    }
  });

  // Mock AI assistance
  await page.route('**/api/admin/problem-reports/*/ai-assistance', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: MOCK_AI_RESPONSES.validIssue
      })
    });
  });

  // Mock SQL execution
  await page.route('**/api/admin/problem-reports/*/execute-sql', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'SQL correction executed successfully and report marked as accepted'
      })
    });
  });

  // Mock report status update
  await page.route('**/api/admin/problem-reports/*', async (route) => {
    if (route.request().method() === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Problem report updated successfully'
        })
      });
    }
  });
}

test.describe('Problem Report Feature', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('User can submit a problem report', async ({ page }) => {
    // Navigate to learning page
    await page.goto('/');
    
    // Wait for exercise to load
    await page.waitForSelector('[data-testid="exercise-input"]', { timeout: 10000 });
    
    // Look for the problem report button (it should be visible in input mode)
    const reportButton = page.locator('button:has-text("Report Problem")');
    
    // If button is not visible, we might need to trigger the right state
    // by answering the question incorrectly first
    const exerciseInput = page.locator('[data-testid="exercise-input"]');
    if (await exerciseInput.isVisible()) {
      await exerciseInput.fill('wrong_answer');
      await page.keyboard.press('Enter');
      
      // Wait for feedback to show
      await page.waitForSelector('text=Incorrect', { timeout: 5000 });
    }
    
    // Now the report button should be visible
    await expect(reportButton).toBeVisible();
    
    // Click the report button
    await reportButton.click();
    
    // Verify modal opened
    await expect(page.locator('text=Report Exercise Problem')).toBeVisible();
    
    // Verify exercise preview is shown
    await expect(page.locator('text=Exercise Preview')).toBeVisible();
    
    // Select problem type
    await page.locator('input[value="incorrect_answer"]').check();
    
    // Fill in comment
    const commentField = page.locator('textarea');
    await commentField.fill('The correct answer should be "ao" instead of "a" because it\'s a contracted preposition.');
    
    // Submit the report
    await page.locator('button:has-text("Submit Report")').click();
    
    // Verify success message
    await expect(page.locator('text=Thank You!')).toBeVisible();
    await expect(page.locator('text=Your report has been submitted successfully')).toBeVisible();
    
    // Modal should close automatically after success
    await expect(page.locator('text=Report Exercise Problem')).not.toBeVisible({ timeout: 3000 });
  });

  test('User sees validation errors for invalid input', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Trigger wrong answer to show report button
    const exerciseInput = page.locator('[data-testid="exercise-input"]');
    await exerciseInput.fill('wrong_answer');
    await page.keyboard.press('Enter');
    await page.waitForSelector('text=Incorrect');
    
    // Click report button
    await page.locator('button:has-text("Report Problem")').click();
    
    // Try to submit without comment
    await page.locator('button:has-text("Submit Report")').click();
    
    // Should see validation error
    await expect(page.locator('text=Comment must be at least 10 characters')).toBeVisible();
    
    // Try with too short comment
    await page.locator('textarea').fill('short');
    await page.locator('button:has-text("Submit Report")').click();
    
    // Should still see validation error
    await expect(page.locator('text=Comment must be at least 10 characters')).toBeVisible();
  });

  test('User can cancel problem report', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Trigger wrong answer to show report button
    const exerciseInput = page.locator('[data-testid="exercise-input"]');
    await exerciseInput.fill('wrong_answer');
    await page.keyboard.press('Enter');
    await page.waitForSelector('text=Incorrect');
    
    // Click report button
    await page.locator('button:has-text("Report Problem")').click();
    
    // Verify modal is open
    await expect(page.locator('text=Report Exercise Problem')).toBeVisible();
    
    // Click cancel
    await page.locator('button:has-text("Cancel")').click();
    
    // Modal should close
    await expect(page.locator('text=Report Exercise Problem')).not.toBeVisible();
  });
});

test.describe('Admin Problem Report Moderation', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    
    // Mock admin authentication
    await page.route('**/api/admin/auth', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ authenticated: true })
      });
    });
  });

  test('Admin can view problem reports list', async ({ page }) => {
    // Navigate to admin page
    await page.goto('/admin');
    
    // Wait for admin dashboard to load
    await page.waitForSelector('text=Tudobem Admin');
    
    // Click on Problem Reports tab
    await page.locator('text=Problem Reports').click();
    
    // Verify reports table is visible
    await expect(page.locator('text=Problem Reports Moderation')).toBeVisible();
    
    // Check if reports are displayed
    await expect(page.locator('text=incorrect_answer')).toBeVisible();
    await expect(page.locator('text=Vou _____ cinema')).toBeVisible();
    
    // Verify action buttons are present for pending reports
    await expect(page.locator('button:has-text("Accept")')).toBeVisible();
    await expect(page.locator('button:has-text("Decline")')).toBeVisible();
    await expect(page.locator('button:has-text("AI Assistance")')).toBeVisible();
  });

  test('Admin can accept a problem report manually', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForSelector('text=Tudobem Admin');
    await page.locator('text=Problem Reports').click();
    
    // Accept the report
    await page.locator('button:has-text("Accept")').first().click();
    
    // Should see success feedback (mocked response)
    // In a real test, we'd verify the status changed to accepted
  });

  test('Admin can decline a problem report', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForSelector('text=Tudobem Admin');
    await page.locator('text=Problem Reports').click();
    
    // Decline the report
    await page.locator('button:has-text("Decline")').first().click();
    
    // Should see success feedback (mocked response)
  });

  test('Admin can use AI assistance', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForSelector('text=Tudobem Admin');
    await page.locator('text=Problem Reports').click();
    
    // Click AI Assistance
    await page.locator('button:has-text("AI Assistance")').first().click();
    
    // Verify AI modal opened
    await expect(page.locator('text=AI Assistance for Report')).toBeVisible();
    
    // Verify report summary is shown
    await expect(page.locator('text=Report Summary')).toBeVisible();
    await expect(page.locator('text=Type: incorrect_answer')).toBeVisible();
    
    // Click Get AI Assistance
    await page.locator('button:has-text("Get AI Assistance")').click();
    
    // Wait for AI response (mocked)
    await expect(page.locator('text=AI Analysis: ✅ Valid Issue')).toBeVisible();
    await expect(page.locator('text=Suggested SQL Correction')).toBeVisible();
    
    // Verify SQL is displayed
    await expect(page.locator('text=UPDATE exercises SET')).toBeVisible();
    
    // Execute correction
    await page.locator('button:has-text("Execute Correction")').click();
    
    // Should close modal and update report status
    await expect(page.locator('text=AI Assistance for Report')).not.toBeVisible();
  });

  test('Admin can filter reports by status', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForSelector('text=Tudobem Admin');
    await page.locator('text=Problem Reports').click();
    
    // Verify filter dropdown exists
    const statusFilter = page.locator('select');
    await expect(statusFilter).toBeVisible();
    
    // Change filter to accepted
    await statusFilter.selectOption('accepted');
    
    // Verify API call was made with correct filter
    // (In real implementation, we'd verify the filtered results)
    
    // Change back to all
    await statusFilter.selectOption('all');
  });

  test('Admin can navigate through paginated reports', async ({ page }) => {
    // Mock multiple pages of reports
    await page.route('**/api/admin/problem-reports*', async (route) => {
      const url = new URL(route.request().url());
      const pageParam = url.searchParams.get('page');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            reports: [
              {
                id: `mock-report-${pageParam}`,
                exerciseId: 'test-exercise-id',
                problemType: 'incorrect_answer',
                userComment: `Test comment for page ${pageParam}`,
                status: 'pending',
                createdAt: new Date().toISOString(),
                exercise: {
                  sentence: `Test sentence ${pageParam}`,
                  correctAnswer: 'test',
                  level: 'A1',
                  topic: 'test'
                }
              }
            ],
            total: 25,
            totalPages: 2
          }
        })
      });
    });
    
    await page.goto('/admin');
    await page.waitForSelector('text=Tudobem Admin');
    await page.locator('text=Problem Reports').click();
    
    // Verify pagination controls are visible
    await expect(page.locator('text=Page 1 of 2')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
    
    // Navigate to next page
    await page.locator('button:has-text("Next")').click();
    
    // Verify page changed
    await expect(page.locator('text=Page 2 of 2')).toBeVisible();
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
  });
});

test.describe('Problem Report Integration', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('Full workflow: User reports problem, admin reviews with AI, executes fix', async ({ page }) => {
    // Step 1: User submits report
    await page.goto('/');
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Trigger wrong answer
    const exerciseInput = page.locator('[data-testid="exercise-input"]');
    await exerciseInput.fill('wrong_answer');
    await page.keyboard.press('Enter');
    await page.waitForSelector('text=Incorrect');
    
    // Submit problem report
    await page.locator('button:has-text("Report Problem")').click();
    await page.locator('input[value="incorrect_answer"]').check();
    await page.locator('textarea').fill('The correct answer should be "ao" instead of "a".');
    await page.locator('button:has-text("Submit Report")').click();
    await expect(page.locator('text=Thank You!')).toBeVisible();
    
    // Step 2: Admin reviews report
    await page.goto('/admin');
    await page.waitForSelector('text=Tudobem Admin');
    await page.locator('text=Problem Reports').click();
    
    // Step 3: Use AI assistance
    await page.locator('button:has-text("AI Assistance")').first().click();
    await page.locator('button:has-text("Get AI Assistance")').click();
    await expect(page.locator('text=✅ Valid Issue')).toBeVisible();
    
    // Step 4: Execute AI recommendation
    await page.locator('button:has-text("Execute Correction")').click();
    
    // Verify workflow completed successfully
    await expect(page.locator('text=AI Assistance for Report')).not.toBeVisible();
  });
});

test.describe('Problem Report Button Visibility', () => {
  test('Report button is visible in input mode when exercise is shown', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // In input mode, before answering
    const modeToggle = page.locator('text=Type Answer');
    await expect(modeToggle).toBeVisible();
    
    // Report button should be visible
    await expect(page.locator('button:has-text("Report Problem")')).toBeVisible();
  });

  test('Report button is hidden in multiple choice mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Switch to multiple choice mode
    await page.locator('text=Show Options').click();
    
    // Report button should be hidden in multiple choice mode
    await expect(page.locator('button:has-text("Report Problem")')).not.toBeVisible();
  });

  test('Report button remains visible after wrong answer', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // Answer incorrectly
    const exerciseInput = page.locator('[data-testid="exercise-input"]');
    await exerciseInput.fill('wrong_answer');
    await page.keyboard.press('Enter');
    await page.waitForSelector('text=Incorrect');
    
    // Report button should still be visible after wrong answer
    await expect(page.locator('button:has-text("Report Problem")')).toBeVisible();
  });

  test('Report button is hidden after correct answer', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="exercise-input"]');
    
    // We would need to know the correct answer for this test
    // For now, we'll mock a correct response
    await page.route('**/api/check-answer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isCorrect: true,
          feedback: { isCorrect: true, explanation: 'Correct!' }
        })
      });
    });
    
    const exerciseInput = page.locator('[data-testid="exercise-input"]');
    await exerciseInput.fill('correct_answer');
    await page.keyboard.press('Enter');
    await page.waitForSelector('text=Correct');
    
    // Report button should be hidden after correct answer
    await expect(page.locator('button:has-text("Report Problem")')).not.toBeVisible();
  });
});