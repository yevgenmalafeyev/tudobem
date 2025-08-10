import { test, expect } from '@playwright/test';

test.describe('Login Navigation and Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login button in header', async ({ page }) => {
    await expect(page.locator('text=Login').or(page.locator('text=Entrar'))).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to login page when login button is clicked', async ({ page }) => {
    // Click the login button
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Should see login form
    await expect(page.locator('text=Email')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should display login form correctly', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Check form elements
    await expect(page.locator('text=Login').or(page.locator('text=Entrar')).first()).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")').or(page.locator('label:has-text("Senha")'))).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should switch to signup mode', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Click signup link
    await page.locator('text=Sign up').or(page.locator('text=Criar conta')).click();
    
    // Should see signup form
    await expect(page.locator('text=Create Account').or(page.locator('text=Criar Conta'))).toBeVisible();
    await expect(page.locator('label:has-text("Name")').or(page.locator('label:has-text("Nome")'))).toBeVisible();
  });

  test('should switch to forgot password mode', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Click forgot password link
    await page.locator('text=Forgot password?').or(page.locator('text=Esqueceu a senha?')).click();
    
    // Should see forgot password form
    await expect(page.locator('text=Reset Password').or(page.locator('text=Redefinir Senha'))).toBeVisible();
    await expect(page.locator('text=Send Reset Link').or(page.locator('text=Enviar Link'))).toBeVisible();
    
    // Password field should not be visible
    await expect(page.locator('input[type="password"]')).not.toBeVisible();
  });

  test('should navigate back from signup to login', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Go to signup
    await page.locator('text=Sign up').or(page.locator('text=Criar conta')).click();
    
    // Go back to login
    await page.locator('text=Log in').or(page.locator('text=Entrar')).click();
    
    // Should be back in login mode
    await expect(page.locator('text=Login').or(page.locator('text=Entrar')).first()).toBeVisible();
    await expect(page.locator('label:has-text("Name")').or(page.locator('label:has-text("Nome")'))).not.toBeVisible();
  });

  test('should navigate back from forgot password to login', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Go to forgot password
    await page.locator('text=Forgot password?').or(page.locator('text=Esqueceu a senha?')).click();
    
    // Go back to login
    await page.locator('text=Back to login').or(page.locator('text=Voltar ao login')).click();
    
    // Should be back in login mode
    await expect(page.locator('text=Login').or(page.locator('text=Entrar')).first()).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Try to submit without filling fields
    await page.locator('button[type="submit"]').click();
    
    // Should show validation (browser native validation)
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should show password requirements in signup mode', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Switch to signup
    await page.locator('text=Sign up').or(page.locator('text=Criar conta')).click();
    
    // Should show password requirement text
    await expect(page.locator('text=Password must be at least 8 characters').or(page.locator('text=pelo menos 8 caracteres'))).toBeVisible();
    
    // Password field should have minlength attribute
    await expect(page.locator('input[type="password"]')).toHaveAttribute('minlength', '8');
  });

  test('should handle form submission without errors', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Fill out form
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    
    // Submit form (will likely fail in test environment, but should not crash)
    await page.locator('button[type="submit"]').click();
    
    // Should show loading state
    await expect(page.locator('text=Loading').or(page.locator('text=Carregando'))).toBeVisible({ timeout: 1000 });
  });

  test('should maintain form state when switching between modes', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Fill email field
    await page.locator('input[type="email"]').fill('test@example.com');
    
    // Switch to signup
    await page.locator('text=Sign up').or(page.locator('text=Criar conta')).click();
    
    // Email should be preserved
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    
    // Switch back to login
    await page.locator('text=Log in').or(page.locator('text=Entrar')).click();
    
    // Email should still be preserved
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Tab through form elements
    await page.keyboard.press('Tab'); // Email field
    await expect(page.locator('input[type="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Password field
    await expect(page.locator('input[type="password"]')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Submit button
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('should handle admin login scenario', async ({ page }) => {
    // Navigate to login
    await page.locator('text=Login').or(page.locator('text=Entrar')).click();
    
    // Fill out admin credentials (will fail but should not crash)
    await page.locator('input[type="email"]').fill('admin@tudobem.com');
    await page.locator('input[type="password"]').fill('adminpassword');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Should show loading state
    await expect(page.locator('text=Loading').or(page.locator('text=Carregando'))).toBeVisible({ timeout: 1000 });
  });
});