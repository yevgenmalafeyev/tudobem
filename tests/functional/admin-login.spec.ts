import { test, expect } from '@playwright/test';

test.describe('Admin Login Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin page
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });

  test('displays login form correctly', async ({ page }) => {
    // Check that login form is displayed
    await expect(page.locator('h1')).toContainText('Tudobem Admin');
    await expect(page.locator('text=Sign in to access the admin dashboard')).toBeVisible();
    
    // Check form elements
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
    
    // Check labels
    await expect(page.locator('label[for="username"]')).toContainText('Username');
    await expect(page.locator('label[for="password"]')).toContainText('Password');
  });

  test('shows error message for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[type="text"]', 'invalid_user');
    await page.fill('input[type="password"]', 'wrong_password');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=Invalid username or password')).toBeVisible({ timeout: 5000 });
    
    // Should still be on login page
    await expect(page.locator('h1')).toContainText('Tudobem Admin');
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('shows loading state during authentication', async ({ page }) => {
    // Fill in credentials
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    
    // Submit form and check loading state
    await page.click('button[type="submit"]');
    
    // Should show loading text briefly
    const loadingButton = page.locator('button[type="submit"]:has-text("Signing in...")');
    
    // Either we see loading state or we get redirected quickly
    const isLoadingVisible = await loadingButton.isVisible();
    const isLoginFormVisible = await page.locator('text=Sign in to access the admin dashboard').isVisible();
    
    expect(isLoadingVisible || !isLoginFormVisible).toBe(true);
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    // Fill in valid credentials (assuming default admin credentials)
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'tudobem2024');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page.locator('h1')).toContainText('Tudobem Admin', { timeout: 10000 });
    await expect(page.locator('button:has-text("Logout")')).toBeVisible({ timeout: 5000 });
    
    // Should see navigation tabs
    await expect(page.locator('text=Data Management')).toBeVisible();
    await expect(page.locator('text=Question Stats')).toBeVisible();
    await expect(page.locator('text=Usage Analytics')).toBeVisible();
  });

  test('form validation prevents empty submission', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should stay on login page (HTML5 validation will prevent submission)
    await expect(page.locator('h1')).toContainText('Tudobem Admin');
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('form fields are disabled during loading', async ({ page }) => {
    // Fill in credentials
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check if fields are disabled during loading (if loading state is visible)
    const loadingButton = page.locator('button[type="submit"]:has-text("Signing in...")');
    if (await loadingButton.isVisible()) {
      await expect(page.locator('input[type="text"]')).toBeDisabled();
      await expect(page.locator('input[type="password"]')).toBeDisabled();
      await expect(page.locator('button[type="submit"]')).toBeDisabled();
    }
  });
});