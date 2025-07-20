import { test, expect } from '@playwright/test';
import { 
  PerformanceMeasurer, 
  NetworkSimulator, 
  PerformanceAssertions,
  performanceHelpers 
} from './performance-utils';

/**
 * Core Web Vitals Performance Tests
 * 
 * Comprehensive testing of Core Web Vitals metrics across different
 * device types and network conditions, following Google's standards.
 */

test.describe('Core Web Vitals Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean state for each test
    await page.goto('/');
    await performanceHelpers.waitForStablePage(page);
  });

  test.describe('Desktop Performance', () => {
    test('should meet Core Web Vitals thresholds on desktop', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      // Mark test start
      await performanceHelpers.markPerformance(page, 'desktop-cwv-start');
      
      // Navigate and measure
      await page.goto('/');
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      // Get comprehensive metrics
      const metrics = await measurer.getAllMetrics();
      
      // Log metrics for analysis
      performanceHelpers.logMetrics(metrics, 'Desktop Core Web Vitals');
      
      // Assert Core Web Vitals meet thresholds
      PerformanceAssertions.assertCoreWebVitals(metrics.coreWebVitals);
      
      // Additional desktop-specific assertions
      expect(metrics.navigationTiming.firstContentfulPaint).toBeLessThan(1800); // FCP < 1.8s
      expect(metrics.navigationTiming.totalLoadTime).toBeLessThan(3000); // Total load < 3s
      
      // Memory usage should be reasonable on desktop
      if (metrics.memoryUsage) {
        PerformanceAssertions.assertMemoryUsage(metrics.memoryUsage, 100); // < 100MB
      }
    });

    test('should maintain performance during interactions', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      await page.goto('/');
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      // Measure performance during typical user interactions
      await performanceHelpers.markPerformance(page, 'interaction-start');
      
      // Simulate user workflow
      await page.fill('input[type="text"]', 'test');
      await page.click('text=Show options');
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 });
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all();
      if (options.length > 0) {
        await options[0].click();
        await page.click('text=Check Answer');
        await page.waitForSelector('.neo-inset', { timeout: 10000 });
      }
      
      await performanceHelpers.markPerformance(page, 'interaction-end');
      
      // Measure interaction timing
      const interactionTime = await measurer.measureCustomTiming('interaction-start', 'interaction-end');
      
      // Interactions should be responsive
      expect(interactionTime).toBeLessThan(2000); // < 2s for complete workflow
      
      // CLS should remain low during interactions
      const postInteractionMetrics = await measurer.measureCoreWebVitals(3000);
      expect(postInteractionMetrics.CLS).toBeLessThan(0.1);
    });
  });

  test.describe('Mobile Performance', () => {
    test('should meet Core Web Vitals thresholds on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      const measurer = new PerformanceMeasurer(page);
      const networkSim = new NetworkSimulator(page);
      
      // Simulate mobile network conditions
      await networkSim.simulateFast3G();
      
      await performanceHelpers.markPerformance(page, 'mobile-cwv-start');
      
      // Navigate and measure
      await page.goto('/');
      await page.waitForSelector('.neo-card-lg', { timeout: 20000 });
      
      const metrics = await measurer.getAllMetrics();
      
      performanceHelpers.logMetrics(metrics, 'Mobile Core Web Vitals');
      
      // Mobile-specific Core Web Vitals assertions (slightly more lenient)
      expect(metrics.coreWebVitals.LCP).toBeLessThan(4000); // LCP < 4s on mobile
      expect(metrics.coreWebVitals.CLS).toBeLessThan(0.1);  // CLS still strict
      
      // Mobile-specific performance expectations
      expect(metrics.navigationTiming.firstContentfulPaint).toBeLessThan(3000); // FCP < 3s
      expect(metrics.navigationTiming.totalLoadTime).toBeLessThan(6000); // Total load < 6s
      
      // Memory should be more constrained on mobile
      if (metrics.memoryUsage) {
        PerformanceAssertions.assertMemoryUsage(metrics.memoryUsage, 50); // < 50MB
      }
    });

    test('should handle touch interactions efficiently', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const measurer = new PerformanceMeasurer(page);
      
      await page.goto('/');
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      // Test touch interaction responsiveness
      await performanceHelpers.markPerformance(page, 'touch-start');
      
      await page.tap('text=Show options');
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 });
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all();
      if (options.length > 0) {
        await options[0].tap();
      }
      
      await performanceHelpers.markPerformance(page, 'touch-end');
      
      const touchResponseTime = await measurer.measureCustomTiming('touch-start', 'touch-end');
      
      // Touch interactions should be responsive
      expect(touchResponseTime).toBeLessThan(1000); // < 1s for touch workflow
      
      // Ensure no layout shifts during touch interactions
      const touchMetrics = await measurer.measureCoreWebVitals(2000);
      expect(touchMetrics.CLS).toBeLessThan(0.05); // Very strict for touch
    });
  });

  test.describe('Network Conditions', () => {
    test('should perform acceptably on slow 3G', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      const networkSim = new NetworkSimulator(page);
      
      // Simulate slow 3G conditions
      await networkSim.simulateSlow3G();
      
      await performanceHelpers.markPerformance(page, 'slow3g-start');
      
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForSelector('.neo-card-lg', { timeout: 30000 });
      const loadTime = Date.now() - startTime;
      
      const metrics = await measurer.getAllMetrics();
      
      performanceHelpers.logMetrics(metrics, 'Slow 3G Performance');
      
      // Slow 3G performance expectations (more lenient)
      expect(loadTime).toBeLessThan(15000); // Load within 15s
      expect(metrics.coreWebVitals.LCP).toBeLessThan(6000); // LCP < 6s
      expect(metrics.coreWebVitals.CLS).toBeLessThan(0.1);  // CLS still strict
      
      // Verify basic functionality still works
      await page.fill('input[type="text"]', 'test');
      await page.click('text=Check Answer');
      await page.waitForSelector('.neo-inset', { timeout: 20000 });
      
      await expect(page.locator('.neo-inset')).toBeVisible();
    });

    test('should optimize resource loading', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      await page.goto('/');
      await performanceHelpers.waitForStablePage(page);
      
      const metrics = await measurer.getAllMetrics();
      
      // Analyze resource loading efficiency
      const totalResources = metrics.resourceTiming.length;
      const totalSize = metrics.resourceTiming.reduce((sum, r) => sum + r.transferSize, 0);
      const cssResources = metrics.resourceTiming.filter(r => r.type === 'css');
      const jsResources = metrics.resourceTiming.filter(r => r.type === 'script');
      
      console.log(`📦 Resource Analysis:`);
      console.log(`  Total Resources: ${totalResources}`);
      console.log(`  Total Transfer Size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`  CSS Resources: ${cssResources.length}`);
      console.log(`  JS Resources: ${jsResources.length}`);
      
      // Resource optimization assertions
      expect(totalResources).toBeLessThan(50); // Reasonable resource count
      expect(totalSize).toBeLessThan(5 * 1024 * 1024); // < 5MB total transfer
      expect(cssResources.length).toBeLessThan(10); // Limit CSS files
      expect(jsResources.length).toBeLessThan(20); // Limit JS files
    });
  });

  test.describe('Progressive Enhancement', () => {
    test('should maintain performance with enhanced features', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      await page.goto('/');
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      
      // Test performance with all features enabled
      await performanceHelpers.markPerformance(page, 'enhanced-start');
      
      // Exercise various features
      await page.fill('input[type="text"]', 'falo');
      await page.click('text=Show options');
      await page.waitForSelector('[data-testid="multiple-choice-option"]', { timeout: 10000 });
      
      // Switch between modes
      await page.click('text=Type answer');
      await page.waitForTimeout(500);
      await page.click('text=Show options');
      await page.waitForTimeout(500);
      
      const options = await page.locator('[data-testid="multiple-choice-option"]').all();
      if (options.length > 0) {
        await options[0].click();
        await page.click('text=Check Answer');
        await page.waitForSelector('.neo-inset', { timeout: 10000 });
        await page.click('text=Next Exercise');
        await page.waitForSelector('input[type="text"]', { timeout: 10000 });
      }
      
      await performanceHelpers.markPerformance(page, 'enhanced-end');
      
      const enhancedTime = await measurer.measureCustomTiming('enhanced-start', 'enhanced-end');
      const finalMetrics = await measurer.getAllMetrics();
      
      performanceHelpers.logMetrics(finalMetrics, 'Enhanced Features Performance');
      
      // Performance should remain good with enhanced features
      expect(enhancedTime).toBeLessThan(5000); // Complete workflow < 5s
      expect(finalMetrics.coreWebVitals.CLS).toBeLessThan(0.1); // Stable layout
      
      // Memory usage should be controlled
      if (finalMetrics.memoryUsage) {
        PerformanceAssertions.assertMemoryUsage(finalMetrics.memoryUsage, 150); // < 150MB
      }
    });

    test('should handle performance regression detection', async ({ page }) => {
      const measurer = new PerformanceMeasurer(page);
      
      // Baseline measurement
      await page.goto('/');
      await page.waitForSelector('.neo-card-lg', { timeout: 15000 });
      const baselineMetrics = await measurer.getAllMetrics();
      
      // Simulate multiple usage cycles
      const cycleTimes: number[] = [];
      
      for (let i = 0; i < 5; i++) {
        const cycleStart = Date.now();
        
        await page.fill('input[type="text"]', `test${i}`);
        await page.click('text=Check Answer');
        await page.waitForSelector('.neo-inset', { timeout: 10000 });
        await page.click('text=Next Exercise');
        await page.waitForSelector('input[type="text"]', { timeout: 10000 });
        
        const cycleTime = Date.now() - cycleStart;
        cycleTimes.push(cycleTime);
        
        console.log(`Cycle ${i + 1}: ${cycleTime}ms`);
      }
      
      // Performance regression analysis
      const averageTime = cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length;
      const maxTime = Math.max(...cycleTimes);
      const minTime = Math.min(...cycleTimes);
      const variance = maxTime - minTime;
      
      console.log(`📊 Performance Consistency:`);
      console.log(`  Average: ${averageTime.toFixed(2)}ms`);
      console.log(`  Min: ${minTime}ms, Max: ${maxTime}ms`);
      console.log(`  Variance: ${variance}ms`);
      
      // Performance should be consistent
      expect(averageTime).toBeLessThan(3000); // Average cycle < 3s
      expect(variance).toBeLessThan(averageTime * 0.5); // Variance < 50% of average
      
      // Final metrics should not degrade significantly
      const finalMetrics = await measurer.getAllMetrics();
      
      if (baselineMetrics.memoryUsage && finalMetrics.memoryUsage) {
        const memoryIncrease = finalMetrics.memoryUsage.usedJSHeapSize - baselineMetrics.memoryUsage.usedJSHeapSize;
        const memoryIncreasePercent = (memoryIncrease / baselineMetrics.memoryUsage.usedJSHeapSize) * 100;
        
        console.log(`🧠 Memory Usage Change: ${memoryIncreasePercent.toFixed(2)}%`);
        
        // Memory should not increase significantly
        expect(memoryIncreasePercent).toBeLessThan(30); // < 30% increase
      }
    });
  });
});