import { Page } from '@playwright/test';

// Additional type definitions for performance measurements
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

/**
 * Performance Testing Utilities
 * 
 * Collection of utilities for measuring and analyzing performance metrics
 * in Playwright tests with focus on Core Web Vitals and user experience.
 */

export interface CoreWebVitals {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
}

export interface PerformanceMetrics {
  coreWebVitals: CoreWebVitals;
  navigationTiming: NavigationTiming;
  resourceTiming: ResourceTiming[];
  memoryUsage?: MemoryUsage;
  customMetrics: Record<string, number>;
}

export interface NavigationTiming {
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  totalLoadTime: number;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  transferSize: number;
  type: string;
}

export interface MemoryUsage {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export interface NetworkCondition {
  downloadThroughput: number;
  uploadThroughput: number;
  latency: number;
}

/**
 * Comprehensive performance measurement utility
 */
export class PerformanceMeasurer {
  private page: Page;
  private startTime: number;
  
  constructor(page: Page) {
    this.page = page;
    this.startTime = Date.now();
  }

  /**
   * Measure Core Web Vitals with timeout handling
   */
  async measureCoreWebVitals(timeout: number = 10000): Promise<CoreWebVitals> {
    return await this.page.evaluate((timeoutMs) => {
      return new Promise<CoreWebVitals>((resolve) => {
        const vitals: CoreWebVitals = {
          LCP: 0,
          FID: 0,
          CLS: 0
        };

        let lcpObserver: PerformanceObserver | null = null;
        let fidObserver: PerformanceObserver | null = null;
        let clsObserver: PerformanceObserver | null = null;

        // Measure LCP
        try {
          lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            if (entries.length > 0) {
              const lastEntry = entries[entries.length - 1] as PerformanceEntry;
              vitals.LCP = lastEntry.startTime;
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch {
          console.warn('LCP measurement not supported');
        }

        // Measure FID
        try {
          fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
              const eventEntry = entry as PerformanceEventTiming;
              if (eventEntry.processingStart) {
                vitals.FID = eventEntry.processingStart - eventEntry.startTime;
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch {
          console.warn('FID measurement not supported');
        }

        // Measure CLS
        try {
          clsObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
              const layoutEntry = entry as LayoutShift;
              if (layoutEntry.value !== undefined && !layoutEntry.hadRecentInput) {
                vitals.CLS += layoutEntry.value;
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch {
          console.warn('CLS measurement not supported');
        }

        // Resolve after timeout
        setTimeout(() => {
          // Clean up observers
          try {
            lcpObserver?.disconnect();
            fidObserver?.disconnect();
            clsObserver?.disconnect();
          } catch {
            // Ignore cleanup errors
          }
          resolve(vitals);
        }, timeoutMs);
      });
    }, timeout);
  }

  /**
   * Get navigation timing metrics
   */
  async getNavigationTiming(): Promise<NavigationTiming> {
    return await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        totalLoadTime: navigation.loadEventEnd - navigation.startTime
      };
    });
  }

  /**
   * Get resource timing information
   */
  async getResourceTiming(): Promise<ResourceTiming[]> {
    return await this.page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      return resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.decodedBodySize || 0,
        transferSize: resource.transferSize || 0,
        type: resource.initiatorType
      }));
    });
  }

  /**
   * Get memory usage (Chrome only)
   */
  async getMemoryUsage(): Promise<MemoryUsage | undefined> {
    return await this.page.evaluate(() => {
      const memory = (performance as { memory?: MemoryUsage }).memory;
      if (memory) {
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
      }
      return undefined;
    });
  }

  /**
   * Measure custom timing between two points
   */
  async measureCustomTiming(startMark: string, endMark: string): Promise<number> {
    return await this.page.evaluate((data: {start: string, end: string}) => {
      try {
        performance.mark(data.end);
        performance.measure(`${data.start}-to-${data.end}`, data.start, data.end);
        const measure = performance.getEntriesByName(`${data.start}-to-${data.end}`)[0];
        return measure.duration;
      } catch {
        return 0;
      }
    }, {start: startMark, end: endMark});
  }

  /**
   * Get comprehensive performance metrics
   */
  async getAllMetrics(): Promise<PerformanceMetrics> {
    const [coreWebVitals, navigationTiming, resourceTiming, memoryUsage] = await Promise.all([
      this.measureCoreWebVitals(),
      this.getNavigationTiming(),
      this.getResourceTiming(),
      this.getMemoryUsage()
    ]);

    return {
      coreWebVitals,
      navigationTiming,
      resourceTiming,
      memoryUsage,
      customMetrics: {
        testDuration: Date.now() - this.startTime
      }
    };
  }
}

/**
 * Network condition simulation utility
 */
export class NetworkSimulator {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Simulate slow 3G network conditions
   */
  async simulateSlow3G(): Promise<void> {
    const client = await this.page.context().newCDPSession(this.page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 500 * 1024 / 8, // 500 Kbps
      uploadThroughput: 500 * 1024 / 8,   // 500 Kbps
      latency: 400 // 400ms
    });
  }

  /**
   * Simulate fast 3G network conditions
   */
  async simulateFast3G(): Promise<void> {
    const client = await this.page.context().newCDPSession(this.page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6 Mbps
      uploadThroughput: 750 * 1024 / 8,           // 750 Kbps
      latency: 150 // 150ms
    });
  }

  /**
   * Simulate custom network conditions
   */
  async simulateCustomNetwork(condition: NetworkCondition): Promise<void> {
    const client = await this.page.context().newCDPSession(this.page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: condition.downloadThroughput / 8, // Convert to bytes
      uploadThroughput: condition.uploadThroughput / 8,     // Convert to bytes
      latency: condition.latency
    });
  }

  /**
   * Disable network throttling
   */
  async disableThrottling(): Promise<void> {
    const client = await this.page.context().newCDPSession(this.page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0
    });
  }
}

/**
 * Performance assertion helpers
 */
export class PerformanceAssertions {
  /**
   * Assert Core Web Vitals meet Google's thresholds
   */
  static assertCoreWebVitals(vitals: CoreWebVitals): void {
    const LCP_THRESHOLD = 2500; // 2.5 seconds
    const FID_THRESHOLD = 100;  // 100 milliseconds
    const CLS_THRESHOLD = 0.1;  // 0.1

    if (vitals.LCP > LCP_THRESHOLD) {
      throw new Error(`LCP (${vitals.LCP}ms) exceeds threshold (${LCP_THRESHOLD}ms)`);
    }

    if (vitals.FID > FID_THRESHOLD) {
      throw new Error(`FID (${vitals.FID}ms) exceeds threshold (${FID_THRESHOLD}ms)`);
    }

    if (vitals.CLS > CLS_THRESHOLD) {
      throw new Error(`CLS (${vitals.CLS}) exceeds threshold (${CLS_THRESHOLD})`);
    }
  }

  /**
   * Assert load time is within acceptable range
   */
  static assertLoadTime(loadTime: number, threshold: number): void {
    if (loadTime > threshold) {
      throw new Error(`Load time (${loadTime}ms) exceeds threshold (${threshold}ms)`);
    }
  }

  /**
   * Assert memory usage is reasonable
   */
  static assertMemoryUsage(memory: MemoryUsage, maxMB: number): void {
    const usedMB = memory.usedJSHeapSize / (1024 * 1024);
    if (usedMB > maxMB) {
      throw new Error(`Memory usage (${usedMB.toFixed(2)}MB) exceeds threshold (${maxMB}MB)`);
    }
  }
}

/**
 * Performance test helpers
 */
export const performanceHelpers = {
  /**
   * Wait for page to be fully loaded and stable
   */
  async waitForStablePage(page: Page, timeout: number = 10000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
    
    // Additional stability check - wait for no layout shifts
    await page.waitForFunction(() => {
      return new Promise(resolve => {
        let lastLayoutShift = 0;
        const observer = new PerformanceObserver(() => {
          lastLayoutShift = Date.now();
        });
        
        try {
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch {
          // Layout shift not supported, assume stable
          resolve(true);
          return;
        }
        
        // Check if no layout shifts for 1 second
        setTimeout(() => {
          const stable = Date.now() - lastLayoutShift > 1000;
          observer.disconnect();
          resolve(stable);
        }, 1000);
      });
    }, { timeout });
  },

  /**
   * Create performance mark for timing measurements
   */
  async markPerformance(page: Page, markName: string): Promise<void> {
    await page.evaluate((name) => {
      if (performance.mark) {
        performance.mark(name);
      }
    }, markName);
  },

  /**
   * Log performance metrics to console
   */
  logMetrics(metrics: PerformanceMetrics, testName: string): void {
    console.log(`\n📊 Performance Metrics for: ${testName}`);
    console.log('─'.repeat(50));
    
    console.log('🎯 Core Web Vitals:');
    console.log(`  LCP: ${metrics.coreWebVitals.LCP.toFixed(2)}ms`);
    console.log(`  FID: ${metrics.coreWebVitals.FID.toFixed(2)}ms`);
    console.log(`  CLS: ${metrics.coreWebVitals.CLS.toFixed(3)}`);
    
    console.log('\n⏱️  Navigation Timing:');
    console.log(`  DOM Content Loaded: ${metrics.navigationTiming.domContentLoaded.toFixed(2)}ms`);
    console.log(`  Load Complete: ${metrics.navigationTiming.loadComplete.toFixed(2)}ms`);
    console.log(`  First Paint: ${metrics.navigationTiming.firstPaint.toFixed(2)}ms`);
    console.log(`  First Contentful Paint: ${metrics.navigationTiming.firstContentfulPaint.toFixed(2)}ms`);
    console.log(`  Total Load Time: ${metrics.navigationTiming.totalLoadTime.toFixed(2)}ms`);
    
    if (metrics.memoryUsage) {
      console.log('\n🧠 Memory Usage:');
      console.log(`  Used JS Heap: ${(metrics.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`  Total JS Heap: ${(metrics.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    }
    
    console.log('\n📦 Resource Summary:');
    console.log(`  Total Resources: ${metrics.resourceTiming.length}`);
    const totalSize = metrics.resourceTiming.reduce((sum, r) => sum + r.size, 0);
    console.log(`  Total Size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    
    console.log('─'.repeat(50));
  }
};