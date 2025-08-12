import { test, expect, Page } from '@playwright/test';

// Test user data
const TEST_USER = {
  username: `testuser_${Date.now()}`,
  email: `testuser_${Date.now()}@test.com`,
  password: 'TestPassword123!'
};

// Helper function to clean up test data
async function cleanupTestUser(page: Page) {
  try {
    // Call cleanup API endpoint
    const response = await page.request.post('/api/test-cleanup', {
      data: {
        action: 'cleanup_user_data',
        email: TEST_USER.email,
        username: TEST_USER.username
      }
    });
    
    if (response.ok()) {
      console.log('✅ Test user cleaned up successfully');
    } else {
      console.log('⚠️ Failed to cleanup test user:', await response.text());
    }
  } catch (error) {
    console.log('⚠️ Error during cleanup:', error);
  }
}

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set Portuguese locale for consistent testing
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        get() { return 'pt-PT'; }
      });
      Object.defineProperty(navigator, 'languages', {
        get() { return ['pt-PT', 'pt', 'en']; }
      });
    });
    
    await page.goto('/?e2e-test=true');
    
    // Wait for page to load and ensure Portuguese language
    await page.waitForTimeout(1000);
  });

  test.afterEach(async ({ page }) => {
    // Always attempt cleanup after each test
    await cleanupTestUser(page);
  });

  test('should complete full authentication flow', async ({ page }) => {
    // 1. Navigate to login page (should be in Portuguese)
    await page.click('button:has-text("Entrar")');
    await expect(page.locator('h1:has-text("Entrar")')).toBeVisible();

    // 2. Switch to signup mode
    await page.click('button:has-text("Criar conta")');
    await expect(page.locator('h1:has-text("Criar Conta")')).toBeVisible();

    // 3. Fill signup form
    await page.fill('input[id="name"]', TEST_USER.username);
    await page.fill('input[id="email"]', TEST_USER.email);
    await page.fill('input[id="password"]', TEST_USER.password);
    
    // Check required privacy policy checkbox
    await page.check('input[id="privacyPolicy"]');

    // Mock the email sending by intercepting the API call
    await page.route('**/api/auth/signup', async (route) => {
      const request = route.request();
      const postData = await request.postDataJSON();
      
      // Simulate successful signup without actually sending email
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'User registered successfully. Please check your email to verify your account.',
          user: {
            id: 'test-user-id',
            username: postData.name,
            email: postData.email,
            created_at: new Date().toISOString(),
            email_verified: false
          },
          emailSent: true
        })
      });
    });

    // 4. Submit signup form
    await page.click('button:has-text("Criar Conta")');
    
    // 5. Verify success message
    await expect(page.locator('text=/User registered successfully|Usuário registrado com sucesso/')).toBeVisible({ timeout: 10000 });

    // 6. Simulate email verification (bypass actual email)
    await page.route('**/api/auth/verify*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Email verified successfully',
          user: {
            id: 'test-user-id',
            username: TEST_USER.username,
            email: TEST_USER.email
          },
          token: 'mock-jwt-token',
          verified: true
        })
      });
    });

    // Navigate directly to verification URL (simulating email click)
    await page.goto('/api/auth/verify?token=mock-verification-token&e2e-test=true');
    
    // 7. Now try to login with the verified account
    await page.goto('/?e2e-test=true');
    await page.click('button:has-text("Entrar")');
    
    // Mock the login API
    await page.route('**/api/auth/login', async (route) => {
      const request = route.request();
      const postData = await request.postDataJSON();
      
      if (postData.email === TEST_USER.email && postData.password === TEST_USER.password) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'mock-jwt-token',
            user: {
              id: 'test-user-id',
              username: TEST_USER.username,
              email: TEST_USER.email,
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
              is_active: true,
              email_verified: true
            }
          })
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Invalid credentials'
          })
        });
      }
    });

    // Fill login form
    await page.fill('input[id="email"]', TEST_USER.email);
    await page.fill('input[id="password"]', TEST_USER.password);
    await page.click('button[type="submit"]:has-text("Entrar")');

    // 8. Verify user is logged in (should see learning page)
    await expect(page.locator('button:has-text("Aprender Gramática")')).toBeVisible({ timeout: 10000 });
  });

  test('should handle password recovery flow', async ({ page }) => {
    // 1. Navigate to login page
    await page.click('button:has-text("Entrar")');
    
    // 2. Click forgot password
    await page.click('button:has-text("Esqueceu a senha?")');
    await expect(page.locator('h1:has-text("Redefinir Senha")')).toBeVisible();

    // Mock the password reset API
    await page.route('**/api/auth/reset-password', async (route) => {
      const method = route.request().method();
      
      if (method === 'POST') {
        // Request password reset
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'If an account with this email exists, a password reset link has been sent.'
          })
        });
      } else if (method === 'PUT') {
        // Reset password with token
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Password reset successfully. You can now log in with your new password.'
          })
        });
      }
    });

    // 3. Enter email for password reset
    await page.fill('input[id="email"]', TEST_USER.email);
    await page.click('button:has-text("Enviar Link de Redefinição")');

    // 4. Verify success message
    await expect(page.locator('text=/reset link|Link de redefinição/')).toBeVisible({ timeout: 10000 });

    // 5. Simulate clicking reset link in email
    await page.goto('/auth/reset-password?token=mock-reset-token&e2e-test=true');
    
    // 6. Enter new password
    const newPassword = 'NewTestPassword123!';
    await page.fill('input[id="newPassword"]', newPassword);
    await page.fill('input[id="confirmPassword"]', newPassword);
    await page.click('button:has-text("Reset Password")');

    // 7. Verify success message
    await expect(page.locator('text=/Password reset successfully/')).toBeVisible({ timeout: 10000 });
  });

  test('should display user profile after login', async ({ page }) => {
    // Mock authentication state
    await page.route('**/api/progress/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: 'test-user-id',
            username: TEST_USER.username,
            email: TEST_USER.email,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            email_verified: true,
            is_active: true
          },
          progress: {
            totalAttempts: 42,
            correctAttempts: 35,
            accuracyRate: 83.3,
            levelProgress: {
              A1: { total: 10, correct: 8 },
              A2: { total: 12, correct: 10 },
              B1: { total: 8, correct: 7 },
              B2: { total: 6, correct: 5 },
              C1: { total: 4, correct: 3 },
              C2: { total: 2, correct: 2 }
            },
            topicProgress: {
              'Present Tense': { total: 15, correct: 13 },
              'Past Tense': { total: 10, correct: 8 },
              'Future Tense': { total: 8, correct: 6 },
              'Subjunctive': { total: 9, correct: 8 }
            },
            recentAttempts: []
          },
          correctlyAnsweredExercises: []
        })
      });
    });

    // Mock the new auth status endpoint
    await page.route('**/api/auth/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          authenticated: true,
          user: {
            id: 'test-user-id',
            username: TEST_USER.username,
            email: TEST_USER.email,
            email_verified: true
          }
        })
      });
    });

    // Set cookie to simulate logged-in state
    await page.context().addCookies([{
      name: 'session-token',
      value: 'mock-jwt-token',
      domain: 'localhost',
      path: '/'
    }]);

    // Navigate to home page
    await page.goto('/?e2e-test=true');
    
    // Wait for header to update with user info
    await page.waitForTimeout(500);

    // Check if user profile button is visible
    await expect(page.locator(`button:has-text("👤 ${TEST_USER.username}")`)).toBeVisible({ timeout: 10000 });

    // Click on profile button
    await page.click(`button:has-text("👤 ${TEST_USER.username}")`);

    // Verify profile page is displayed (should be in Portuguese)
    await expect(page.locator('h1:has-text("Perfil do Utilizador")')).toBeVisible();
    await expect(page.locator('text=/Informações da Conta/')).toBeVisible();
    await expect(page.locator('text=/Desempenho Geral/')).toBeVisible();
    // Check for accuracy rate - use first() since there might be multiple
    await expect(page.locator('text=/83.3%/').first()).toBeVisible();
  });

  test('should handle logout correctly', async ({ page }) => {
    // Set cookie to simulate logged-in state
    await page.context().addCookies([{
      name: 'session-token',
      value: 'mock-jwt-token',
      domain: 'localhost',
      path: '/'
    }]);

    // Mock the stats API to return logged-in user
    await page.route('**/api/progress/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: 'test-user-id',
            username: TEST_USER.username,
            email: TEST_USER.email
          },
          progress: {
            totalAttempts: 0,
            correctAttempts: 0,
            accuracyRate: 0,
            levelProgress: {},
            topicProgress: {},
            recentAttempts: []
          }
        })
      });
    });

    // Mock the logout API
    await page.route('**/api/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Logged out successfully'
        })
      });
    });

    // Mock the new auth status endpoint  
    await page.route('**/api/auth/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          authenticated: true,
          user: {
            id: 'test-user-id',
            username: TEST_USER.username,
            email: TEST_USER.email,
            email_verified: true
          }
        })
      });
    });

    // Navigate to home page
    await page.goto('/?e2e-test=true');
    
    // Wait for header to update
    await page.waitForTimeout(500);

    // Verify user is logged in
    await expect(page.locator(`button:has-text("👤 ${TEST_USER.username}")`)).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Sair")')).toBeVisible();

    // Click logout button
    await page.click('button:has-text("Sair")');

    // Wait for logout to complete
    await page.waitForTimeout(500);

    // Verify user is logged out
    await expect(page.locator('button:has-text("Entrar")')).toBeVisible();
    await expect(page.locator(`button:has-text("👤 ${TEST_USER.username}")`)).not.toBeVisible();
    await expect(page.locator('button:has-text("Sair")')).not.toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    // Navigate to login page
    await page.click('button:has-text("Entrar")');
    
    // Switch to signup mode
    await page.click('button:has-text("Criar conta")');
    
    // Try to submit empty form
    await page.click('button[type="submit"]:has-text("Criar Conta")');
    
    // Check HTML5 validation (required fields)
    const nameInput = page.locator('input[id="name"]');
    await expect(nameInput).toHaveAttribute('required', '');
    
    // Enter invalid email
    await page.fill('input[id="name"]', 'Test User');
    await page.fill('input[id="email"]', 'invalid-email');
    await page.fill('input[id="password"]', 'short');
    
    // Password should show it's too short
    const passwordInput = page.locator('input[id="password"]');
    await expect(passwordInput).toHaveAttribute('minlength', '8');
    
    // Verify password requirement text is visible
    await expect(page.locator('text=/deve ter pelo menos 8 caracteres|must be at least 8 characters/')).toBeVisible();
  });
});