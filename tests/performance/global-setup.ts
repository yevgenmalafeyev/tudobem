import { chromium, FullConfig } from '@playwright/test';

/**
 * Global Setup for Performance Testing
 * 
 * Prepares the testing environment for consistent performance measurements
 * by warming up the application and establishing baseline conditions.
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting performance testing global setup...');
  
  const browser = await chromium.launch({
    args: [
      '--enable-precise-memory-info',
      '--enable-extension-activity-logging',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--no-default-browser-check',
      '--disable-default-apps'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    // Warm up the application
    console.log('🔥 Warming up application...');
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    
    // Make initial request to wake up the server
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    
    // Pre-load critical resources
    await page.waitForSelector('.neo-card-lg', { timeout: 30000 });
    
    // Trigger initial API calls to warm up the backend
    await page.fill('input[type="text"]', 'test');
    await page.click('text=Check Answer');
    await page.waitForSelector('.neo-inset', { timeout: 15000 });
    
    // Clear any cached performance data
    await page.evaluate(() => {
      if ('performance' in window) {
        performance.clearResourceTimings();
        performance.clearMarks();
        performance.clearMeasures();
      }
    });
    
    console.log('✅ Application warmed up successfully');
    
    // Set up performance monitoring baseline
    await page.evaluate(() => {
      // Store baseline timestamp for relative measurements
      (window as { __perfBaseline?: number }).__perfBaseline = performance.now();
      
      // Set up custom performance markers
      if ('performance' in window && performance.mark) {
        performance.mark('test-session-start');
      }
    });
    
    console.log('📊 Performance monitoring baseline established');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await page.close();
    await browser.close();
  }
  
  console.log('🎯 Performance testing environment ready');
}

export default globalSetup;