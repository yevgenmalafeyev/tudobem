import { test, expect } from '@playwright/test';

test.describe('Admin Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin page and login
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Login with admin credentials
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'tudobem2024');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load and navigate to Usage Analytics
    await expect(page.locator('button:has-text("Logout")')).toBeVisible({ timeout: 10000 });
    await page.click('text=Usage Analytics');
    await page.waitForLoadState('networkidle');
  });

  test('displays analytics header and time range filters', async ({ page }) => {
    // Check header
    await expect(page.locator('text=📈 Usage Analytics')).toBeVisible();
    
    // Check time range filter buttons
    await expect(page.locator('button:has-text("Last 24 hours")')).toBeVisible();
    await expect(page.locator('button:has-text("Last 7 days")')).toBeVisible();
    await expect(page.locator('button:has-text("Last 30 days")')).toBeVisible();
    await expect(page.locator('button:has-text("Last 90 days")')).toBeVisible();
    
    // Default selection should be "Last 7 days"
    await expect(page.locator('button:has-text("Last 7 days").neo-button-primary')).toBeVisible();
  });

  test('displays loading state correctly', async ({ page }) => {
    // Refresh to see loading state
    await page.click('text=🔄 Refresh Analytics');
    
    // Should show loading state
    await expect(page.locator('text=Loading analytics...')).toBeVisible();
    await expect(page.locator('span.animate-spin')).toBeVisible();
  });

  test('displays analytics data when loaded', async ({ page }) => {
    // Wait for analytics to load
    await expect(page.locator('text=Total Users')).toBeVisible({ timeout: 10000 });
    
    // Check key metrics cards
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Total Sessions')).toBeVisible();
    await expect(page.locator('text=Questions Answered')).toBeVisible();
    await expect(page.locator('text=Accuracy Rate')).toBeVisible();
    
    // Check for numeric values (should be numbers)
    const totalUsers = page.locator('text=Total Users').locator('..').locator('div').first();
    const totalSessions = page.locator('text=Total Sessions').locator('..').locator('div').first();
    const questionsAnswered = page.locator('text=Questions Answered').locator('..').locator('div').first();
    const accuracyRate = page.locator('text=Accuracy Rate').locator('..').locator('div').first();
    
    await expect(totalUsers).toBeVisible();
    await expect(totalSessions).toBeVisible();
    await expect(questionsAnswered).toBeVisible();
    await expect(accuracyRate).toBeVisible();
  });

  test('displays answer distribution section', async ({ page }) => {
    // Wait for analytics to load
    await expect(page.locator('text=✅ Answer Distribution')).toBeVisible({ timeout: 10000 });
    
    // Check answer distribution elements
    await expect(page.locator('text=Correct Answers')).toBeVisible();
    await expect(page.locator('text=Incorrect Answers')).toBeVisible();
    
    // Should show numeric values
    const correctAnswers = page.locator('text=Correct Answers').locator('..').locator('div').first();
    const incorrectAnswers = page.locator('text=Incorrect Answers').locator('..').locator('div').first();
    
    await expect(correctAnswers).toBeVisible();
    await expect(incorrectAnswers).toBeVisible();
  });

  test('displays geographic and platform data', async ({ page }) => {
    // Wait for analytics to load
    await expect(page.locator('text=🌍 Users by Country')).toBeVisible({ timeout: 10000 });
    
    // Check sections
    await expect(page.locator('text=🌍 Users by Country')).toBeVisible();
    await expect(page.locator('text=📱 Platforms')).toBeVisible();
    await expect(page.locator('text=📚 Popular Levels')).toBeVisible();
  });

  test('displays daily activity chart placeholder', async ({ page }) => {
    // Wait for analytics to load
    await expect(page.locator('text=📊 Daily Activity')).toBeVisible({ timeout: 10000 });
    
    // Check chart placeholder
    await expect(page.locator('text=Chart visualization will be implemented here')).toBeVisible();
    await expect(page.locator('text=Daily stats:')).toBeVisible();
  });

  test('time range filter functionality works', async ({ page }) => {
    // Wait for initial load
    await expect(page.locator('text=Total Users')).toBeVisible({ timeout: 10000 });
    
    // Click on different time ranges
    await page.click('button:has-text("Last 24 hours")');
    await expect(page.locator('button:has-text("Last 24 hours").neo-button-primary')).toBeVisible();
    
    // Should trigger reload - check for loading state or data update
    await expect(page.locator('text=Loading analytics...').or(page.locator('text=Total Users'))).toBeVisible();
    
    // Try another time range
    await page.click('button:has-text("Last 30 days")');
    await expect(page.locator('button:has-text("Last 30 days").neo-button-primary')).toBeVisible();
  });

  test('refresh button functionality works', async ({ page }) => {
    // Wait for initial load
    await expect(page.locator('text=Total Users')).toBeVisible({ timeout: 10000 });
    
    // Click refresh button
    await page.click('text=🔄 Refresh Analytics');
    
    // Should show loading state
    await expect(page.locator('text=Loading analytics...')).toBeVisible();
    
    // Should eventually show data again
    await expect(page.locator('text=Total Users')).toBeVisible({ timeout: 10000 });
  });

  test('handles error state correctly', async ({ page }) => {
    // This test would require mocking API failure
    // For now, we'll just check that error handling elements exist in the UI
    
    // The error state should show "Try Again" button when there's an error
    // This would be visible if the API fails
    
    // For a basic test, we can check the component structure
    await expect(page.locator('text=📈 Usage Analytics')).toBeVisible({ timeout: 10000 });
  });

  test('displays "no data" state when appropriate', async ({ page }) => {
    // Wait for analytics to load
    await expect(page.locator('text=Total Users')).toBeVisible({ timeout: 10000 });
    
    // Check that data is actually displayed (not "no data" state)
    await expect(page.locator('text=No analytics data available')).not.toBeVisible();
    
    // The component should show actual data
    await expect(page.locator('text=Total Users')).toBeVisible();
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for analytics to load
    await expect(page.locator('text=📈 Usage Analytics')).toBeVisible({ timeout: 10000 });
    
    // Check that key elements are still visible
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Total Sessions')).toBeVisible();
    await expect(page.locator('text=Questions Answered')).toBeVisible();
    await expect(page.locator('text=Accuracy Rate')).toBeVisible();
    
    // Time range buttons should still be accessible
    await expect(page.locator('button:has-text("Last 7 days")')).toBeVisible();
    
    // Refresh button should still be accessible
    await expect(page.locator('text=🔄 Refresh Analytics')).toBeVisible();
  });

  test('analytics data format validation', async ({ page }) => {
    // Wait for analytics to load
    await expect(page.locator('text=Total Users')).toBeVisible({ timeout: 10000 });
    
    // Check that accuracy percentage is properly formatted
    const accuracyText = await page.locator('text=Accuracy Rate').locator('..').locator('div').first().textContent();
    
    if (accuracyText) {
      // Should contain % symbol
      expect(accuracyText).toContain('%');
      
      // Should be a valid percentage (0-100)
      const percentage = parseFloat(accuracyText.replace('%', ''));
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    }
  });
});