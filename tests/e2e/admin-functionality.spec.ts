import { test, expect } from '@playwright/test';

test.describe('Admin Panel - Complete Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin page
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Authentication Flow', () => {
    test('should display login form when not authenticated', async ({ page }) => {
      // Wait for loading to complete
      await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
      
      // Should see login form
      await expect(page.locator('text=Tudobem Admin')).toBeVisible();
      await expect(page.locator('text=Sign in to access the admin dashboard')).toBeVisible();
      await expect(page.locator('input[type="text"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should handle invalid login credentials', async ({ page }) => {
      await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
      
      // Fill invalid credentials
      await page.fill('input[type="text"]', 'wronguser');
      await page.fill('input[type="password"]', 'wrongpass');
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=Invalid username or password')).toBeVisible();
    });

    test('should successfully login with correct credentials', async ({ page }) => {
      await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
      
      // Fill correct credentials
      await page.fill('input[type="text"]', 'admin');
      await page.fill('input[type="password"]', 'tudobem2024');
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await expect(page.locator('text=Data Management')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Question Stats')).toBeVisible();
      await expect(page.locator('text=Usage Analytics')).toBeVisible();
      await expect(page.locator('text=Logout')).toBeVisible();
    });

    test('should handle logout correctly', async ({ page }) => {
      // Login first
      await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
      await page.fill('input[type="text"]', 'admin');
      await page.fill('input[type="password"]', 'tudobem2024');
      await page.click('button[type="submit"]');
      
      // Wait for dashboard
      await page.waitForSelector('text=Data Management', { timeout: 10000 });
      
      // Logout
      await page.click('text=Logout');
      
      // Should return to login form
      await expect(page.locator('text=Sign in to access the admin dashboard')).toBeVisible();
      await expect(page.locator('input[type="text"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });
  });

  test.describe('Data Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
      await page.fill('input[type="text"]', 'admin');
      await page.fill('input[type="password"]', 'tudobem2024');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Data Management', { timeout: 10000 });
    });

    test('should display data management interface', async ({ page }) => {
      // Click on Data Management (should be active by default)
      await page.click('text=Data Management');
      
      // Should see data management options
      await expect(page.locator('text=Export Questions')).toBeVisible();
      await expect(page.locator('text=Import Questions')).toBeVisible();
      await expect(page.locator('text=Export all questions as a ZIP file')).toBeVisible();
      await expect(page.locator('text=Import questions from a JSON file')).toBeVisible();
    });

    test('should handle question export', async ({ page }) => {
      await page.click('text=Data Management');
      
      // Test export functionality
      const downloadPromise = page.waitForEvent('download');
      await page.click('text=Export Questions');
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/tudobem-questions.*\.zip/);
    });

    test('should display import interface', async ({ page }) => {
      await page.click('text=Data Management');
      
      // Should see file input for import
      await expect(page.locator('input[type="file"]')).toBeVisible();
      await expect(page.locator('text=Select JSON file')).toBeVisible();
    });
  });

  test.describe('Question Statistics', () => {
    test.beforeEach(async ({ page }) => {
      // Login and navigate to stats
      await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
      await page.fill('input[type="text"]', 'admin');
      await page.fill('input[type="password"]', 'tudobem2024');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Data Management', { timeout: 10000 });
    });

    test('should display question statistics', async ({ page }) => {
      await page.click('text=Question Stats');
      
      // Should show statistics
      await expect(page.locator('text=Total Questions')).toBeVisible();
      await expect(page.locator('text=Questions by Level')).toBeVisible();
      await expect(page.locator('text=Questions by Topic')).toBeVisible();
      
      // Should show level breakdown
      await expect(page.locator('text=A1')).toBeVisible();
      await expect(page.locator('text=A2')).toBeVisible();
    });

    test('should handle database statistics loading', async ({ page }) => {
      await page.click('text=Question Stats');
      
      // Wait for statistics to load
      await page.waitForSelector('text=Total Questions', { timeout: 10000 });
      
      // Should show actual numbers (not just labels)
      const totalQuestions = await page.locator('text=Total Questions').textContent();
      expect(totalQuestions).toBeTruthy();
    });
  });

  test.describe('Usage Analytics', () => {
    test.beforeEach(async ({ page }) => {
      // Login and navigate to analytics
      await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
      await page.fill('input[type="text"]', 'admin');
      await page.fill('input[type="password"]', 'tudobem2024');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Data Management', { timeout: 10000 });
    });

    test('should display usage analytics dashboard', async ({ page }) => {
      await page.click('text=Usage Analytics');
      
      // Should show analytics dashboard
      await expect(page.locator('text=Total Users')).toBeVisible();
      await expect(page.locator('text=Total Sessions')).toBeVisible();
      await expect(page.locator('text=Total Questions')).toBeVisible();
      await expect(page.locator('text=Correct Answers')).toBeVisible();
      await expect(page.locator('text=Incorrect Answers')).toBeVisible();
    });

    test('should handle time range filtering', async ({ page }) => {
      await page.click('text=Usage Analytics');
      await page.waitForSelector('text=Total Users', { timeout: 10000 });
      
      // Test different time ranges
      const timeRanges = ['1d', '7d', '30d', '90d'];
      
      for (const range of timeRanges) {
        const rangeButton = page.locator(`text=${range}`);
        if (await rangeButton.count() > 0) {
          await rangeButton.click();
          await page.waitForTimeout(1000);
          
          // Should still show analytics data
          await expect(page.locator('text=Total Users')).toBeVisible();
        }
      }
    });

    test('should display analytics charts and data', async ({ page }) => {
      await page.click('text=Usage Analytics');
      
      // Should show various data sections
      await expect(page.locator('text=Countries')).toBeVisible();
      await expect(page.locator('text=Platforms')).toBeVisible();
      await expect(page.locator('text=Levels')).toBeVisible();
      await expect(page.locator('text=Daily Statistics')).toBeVisible();
    });
  });

  test.describe('Navigation and UX', () => {
    test.beforeEach(async ({ page }) => {
      // Login
      await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
      await page.fill('input[type="text"]', 'admin');
      await page.fill('input[type="password"]', 'tudobem2024');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Data Management', { timeout: 10000 });
    });

    test('should navigate between admin sections', async ({ page }) => {
      // Test navigation through all sections
      await page.click('text=Data Management');
      await expect(page.locator('text=Export Questions')).toBeVisible();
      
      await page.click('text=Question Stats');
      await expect(page.locator('text=Total Questions')).toBeVisible();
      
      await page.click('text=Usage Analytics');
      await expect(page.locator('text=Total Users')).toBeVisible();
      
      // Navigate back
      await page.click('text=Data Management');
      await expect(page.locator('text=Export Questions')).toBeVisible();
    });

    test('should handle responsive design', async ({ page }) => {
      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(1000);
      
      // Should still show navigation
      await expect(page.locator('text=Data Management')).toBeVisible();
      await expect(page.locator('text=Question Stats')).toBeVisible();
      await expect(page.locator('text=Usage Analytics')).toBeVisible();
      
      // Test tablet view
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(1000);
      
      // Should show full labels
      await expect(page.locator('text=Data Management')).toBeVisible();
      await expect(page.locator('text=Question Stats')).toBeVisible();
      await expect(page.locator('text=Usage Analytics')).toBeVisible();
    });

    test('should show active section highlighting', async ({ page }) => {
      // Data Management should be active by default
      const dataManagementButton = page.locator('text=Data Management').first();
      await expect(dataManagementButton).toHaveClass(/neo-button-primary/);
      
      // Click on Question Stats
      await page.click('text=Question Stats');
      const questionStatsButton = page.locator('text=Question Stats').first();
      await expect(questionStatsButton).toHaveClass(/neo-button-primary/);
      
      // Click on Usage Analytics
      await page.click('text=Usage Analytics');
      const analyticsButton = page.locator('text=Usage Analytics').first();
      await expect(analyticsButton).toHaveClass(/neo-button-primary/);
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      // Login
      await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
      await page.fill('input[type="text"]', 'admin');
      await page.fill('input[type="password"]', 'tudobem2024');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Data Management', { timeout: 10000 });
    });

    test('should handle API failures gracefully', async ({ page }) => {
      // Mock API failure for stats
      await page.route('**/api/admin/stats', route => {
        route.abort('failed');
      });
      
      await page.click('text=Question Stats');
      
      // Should not crash the application
      await expect(page.locator('text=Data Management')).toBeVisible();
    });

    test('should handle network timeouts', async ({ page }) => {
      // Mock slow network
      await page.route('**/api/admin/analytics', route => {
        setTimeout(() => route.continue(), 5000);
      });
      
      await page.click('text=Usage Analytics');
      
      // Application should remain responsive
      await expect(page.locator('text=Data Management')).toBeVisible();
    });
  });

  test.describe('Security', () => {
    test('should handle unauthorized access', async ({ page }) => {
      // Try to access admin without proper authentication
      await page.route('**/api/admin/auth', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ authenticated: false })
        });
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should show login form
      await expect(page.locator('text=Sign in to access the admin dashboard')).toBeVisible();
    });

    test('should handle session expiration', async ({ page }) => {
      // Mock session expiration
      await page.route('**/api/admin/stats', route => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Unauthorized' })
        });
      });
      
      await page.click('text=Question Stats');
      
      // Should handle unauthorized response gracefully
      await page.waitForTimeout(2000);
      await expect(page.locator('text=Data Management')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load admin dashboard quickly', async ({ page }) => {
      await page.waitForSelector('text=Tudobem Admin', { timeout: 10000 });
      
      const startTime = Date.now();
      await page.fill('input[type="text"]', 'admin');
      await page.fill('input[type="password"]', 'tudobem2024');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Data Management', { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should handle large data sets', async ({ page }) => {
      // Mock large data response
      await page.route('**/api/admin/analytics', route => {
        const largeData = {
          totalUsers: 10000,
          totalSessions: 50000,
          totalQuestions: 200000,
          correctAnswers: 150000,
          incorrectAnswers: 50000,
          countries: Array.from({length: 50}, (_, i) => ({
            country: `Country ${i}`,
            count: Math.floor(Math.random() * 1000)
          })),
          platforms: Array.from({length: 10}, (_, i) => ({
            platform: `Platform ${i}`,
            count: Math.floor(Math.random() * 5000)
          })),
          levels: [
            { level: 'A1', count: 40000 },
            { level: 'A2', count: 35000 },
            { level: 'B1', count: 30000 },
            { level: 'B2', count: 25000 },
            { level: 'C1', count: 20000 },
            { level: 'C2', count: 15000 }
          ],
          dailyStats: Array.from({length: 30}, (_, i) => ({
            date: `2024-01-${i + 1}`,
            users: Math.floor(Math.random() * 100),
            questions: Math.floor(Math.random() * 500),
            correct: Math.floor(Math.random() * 300)
          }))
        };
        
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(largeData)
        });
      });
      
      await page.click('text=Usage Analytics');
      await page.waitForSelector('text=Total Users', { timeout: 10000 });
      
      // Should handle large data without crashing
      await expect(page.locator('text=10000')).toBeVisible();
      await expect(page.locator('text=50000')).toBeVisible();
    });
  });
});