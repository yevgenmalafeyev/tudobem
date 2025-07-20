import { defineConfig, devices } from '@playwright/test';

/**
 * Performance Testing Configuration for Tudobem
 * 
 * This configuration is optimized for comprehensive performance testing
 * including Core Web Vitals, runtime performance, and user experience metrics.
 */
export default defineConfig({
  testDir: './tests/performance',
  fullyParallel: false, // Sequential for accurate performance measurements
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // Minimal retries for performance consistency
  workers: 1, // Single worker for consistent measurements
  reporter: [
    ['html', { outputFolder: 'performance-report' }],
    ['json', { outputFile: 'performance-results.json' }],
    ['line']
  ],
  
  timeout: 60000, // Extended timeout for performance tests
  expect: {
    timeout: 30000
  },

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Performance-optimized settings
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Extended timeouts for performance measurements
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // Browser context settings for performance testing
    launchOptions: {
      args: [
        '--enable-precise-memory-info',
        '--enable-extension-activity-logging',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--no-default-browser-check',
        '--disable-default-apps'
      ]
    }
  },

  projects: [
    // Desktop Performance Testing
    {
      name: 'desktop-chrome-performance',
      use: { 
        ...devices['Desktop Chrome'],
        // Override for performance testing
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    // Mobile Performance Testing  
    {
      name: 'mobile-performance',
      use: { 
        ...devices['Pixel 5'],
        // Simulate realistic mobile conditions
        launchOptions: {
          args: [
            '--enable-precise-memory-info',
            '--simulate-outdated-no-au="Tue, 31 Dec 2099 23:59:59 GMT"'
          ]
        }
      },
    },
    
    // Low-end Device Simulation
    {
      name: 'low-end-device',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        // Simulate low-end device constraints
        launchOptions: {
          args: [
            '--enable-precise-memory-info',
            '--memory-pressure-off',
            '--max_old_space_size=512' // Simulate low memory
          ]
        }
      }
    },

    // Network Conditions Testing
    {
      name: 'slow-3g-simulation',
      use: {
        ...devices['Desktop Chrome'],
        // Will be configured per test for network throttling
      }
    }
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Global test setup
  globalSetup: './tests/performance/global-setup.ts',
  globalTeardown: './tests/performance/global-teardown.ts',
});