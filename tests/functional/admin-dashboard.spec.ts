import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin page and login
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Login with admin credentials
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'tudobem2024');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await expect(page.locator('button:has-text("Logout")')).toBeVisible({ timeout: 10000 });
  });

  test('displays dashboard header correctly', async ({ page }) => {
    // Check header elements
    await expect(page.locator('h1')).toContainText('Tudobem Admin');
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
    
    // Check logo is present
    await expect(page.locator('svg')).toBeVisible(); // Logo is an SVG
  });

  test('displays navigation tabs correctly', async ({ page }) => {
    // Check all navigation tabs are present
    await expect(page.locator('text=Data Management')).toBeVisible();
    await expect(page.locator('text=Question Stats')).toBeVisible();
    await expect(page.locator('text=Usage Analytics')).toBeVisible();
    
    // Check icons are present
    await expect(page.locator('text=📁')).toBeVisible(); // Data Management icon
    await expect(page.locator('text=📊')).toBeVisible(); // Question Stats icon
    await expect(page.locator('text=📈')).toBeVisible(); // Usage Analytics icon
  });

  test('navigation between tabs works correctly', async ({ page }) => {
    // Start on Data Management tab (default)
    await expect(page.locator('button:has-text("Data Management").neo-button-primary')).toBeVisible();
    
    // Click on Question Stats tab
    await page.click('text=Question Stats');
    await expect(page.locator('button:has-text("Question Stats").neo-button-primary')).toBeVisible();
    
    // Click on Usage Analytics tab
    await page.click('text=Usage Analytics');
    await expect(page.locator('button:has-text("Usage Analytics").neo-button-primary')).toBeVisible();
    
    // Go back to Data Management
    await page.click('text=Data Management');
    await expect(page.locator('button:has-text("Data Management").neo-button-primary')).toBeVisible();
  });

  test('data management section loads correctly', async ({ page }) => {
    // Should be on Data Management tab by default
    await expect(page.locator('button:has-text("Data Management").neo-button-primary')).toBeVisible();
    
    // Check for data management elements
    await expect(page.locator('text=Export Questions')).toBeVisible();
    await expect(page.locator('text=Import Questions')).toBeVisible();
    
    // Check for export/import buttons
    await expect(page.locator('button:has-text("Export All Questions")')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('question stats section loads correctly', async ({ page }) => {
    // Click on Question Stats tab
    await page.click('text=Question Stats');
    
    // Check for stats elements
    await expect(page.locator('text=Database Statistics')).toBeVisible();
    await expect(page.locator('text=Total Questions')).toBeVisible();
    
    // Should show some statistics (numbers)
    const statsNumbers = page.locator('text=/\\d+/');
    await expect(statsNumbers.first()).toBeVisible();
  });

  test('usage analytics section loads correctly', async ({ page }) => {
    // Click on Usage Analytics tab
    await page.click('text=Usage Analytics');
    
    // Check for analytics elements
    await expect(page.locator('text=Usage Analytics')).toBeVisible();
    
    // Should show analytics data or loading state
    const analyticsContent = page.locator('text=Total Users').or(page.locator('text=Loading analytics'));
    await expect(analyticsContent).toBeVisible();
  });

  test('logout functionality works correctly', async ({ page }) => {
    // Click logout button
    await page.click('button:has-text("Logout")');
    
    // Should redirect to login page
    await expect(page.locator('h1')).toContainText('Tudobem Admin');
    await expect(page.locator('text=Sign in to access the admin dashboard')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('maintains session across page refresh', async ({ page }) => {
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still be logged in
    await expect(page.locator('button:has-text("Logout")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Tudobem Admin');
  });

  test('responsive design works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Header should still be visible
    await expect(page.locator('h1')).toContainText('Tudobem Admin');
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
    
    // Navigation should still work
    await expect(page.locator('text=📁')).toBeVisible(); // Icons should be visible
    await expect(page.locator('text=📊')).toBeVisible();
    await expect(page.locator('text=📈')).toBeVisible();
  });

  test('unauthorized access redirects to login', async ({ page }) => {
    // Logout first
    await page.click('button:has-text("Logout")');
    
    // Try to access admin dashboard directly
    await page.goto('/admin');
    
    // Should show login form
    await expect(page.locator('text=Sign in to access the admin dashboard')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });
});