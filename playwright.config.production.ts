import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for testing against the deployed Vercel instance
 * Usage: npx playwright test --config=playwright.config.production.ts
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1, // More retries for production testing
  workers: process.env.CI ? 2 : 1, // Reduced workers for production to avoid rate limiting
  reporter: [
    ['html', { outputFolder: 'playwright-report-production' }],
    ['json', { outputFile: 'test-results-production.json' }]
  ],
  
  use: {
    // Test against the deployed production instance
    baseURL: 'https://tudobem.blaster.app',
    
    // More conservative settings for production testing
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Longer timeouts for production environment
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  // Test against multiple browsers in production
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        // Disable web security for production testing if needed
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
        }
      },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Production-specific test configuration
  timeout: 60000, // 1 minute timeout for production tests
  
  // No local server needed - testing against deployed instance
  // webServer config is omitted
});