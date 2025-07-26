/**
 * Error Monitoring Utilities for E2E Tests
 * 
 * Provides comprehensive error detection and reporting for Playwright tests
 * including React state errors, JavaScript errors, network failures, and more.
 */

import { Page } from '@playwright/test';

export interface ErrorReport {
  timestamp: Date;
  type: 'console' | 'network' | 'page' | 'react';
  level: 'error' | 'warning' | 'info';
  message: string;
  source?: string;
  stack?: string;
  url?: string;
  status?: number;
}

export class E2EErrorMonitor {
  private errors: ErrorReport[] = [];
  private warnings: ErrorReport[] = [];
  private page: Page;
  private isMonitoring = false;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Start monitoring for errors on the page
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🔍 Starting comprehensive error monitoring...');

    // Monitor console errors and warnings
    this.page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        this.addError({
          timestamp: new Date(),
          type: 'console',
          level: 'error',
          message: text,
          source: 'browser-console'
        });
      } else if (type === 'warning' && this.isReactWarning(text)) {
        this.addWarning({
          timestamp: new Date(),
          type: 'react',
          level: 'warning',
          message: text,
          source: 'react'
        });
      }
    });

    // Monitor page errors
    this.page.on('pageerror', (error) => {
      this.addError({
        timestamp: new Date(),
        type: 'page',
        level: 'error',
        message: error.message,
        stack: error.stack,
        source: 'page-error'
      });
    });

    // Monitor network failures
    this.page.on('response', (response) => {
      if (response.status() >= 400) {
        this.addError({
          timestamp: new Date(),
          type: 'network',
          level: 'error',
          message: `HTTP ${response.status()} ${response.statusText()}`,
          url: response.url(),
          status: response.status(),
          source: 'network'
        });
      }
    });

    // Monitor request failures
    this.page.on('requestfailed', (request) => {
      this.addError({
        timestamp: new Date(),
        type: 'network',
        level: 'error',
        message: `Request failed: ${request.failure()?.errorText || 'Unknown error'}`,
        url: request.url(),
        source: 'request-failed'
      });
    });
  }

  /**
   * Stop monitoring for errors
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('⏹️  Stopped error monitoring');
  }

  /**
   * Check for specific React state update errors
   */
  async checkForReactStateErrors(): Promise<void> {
    const consoleErrors = await this.page.evaluate(() => {
      // Check for React-specific error patterns in console
      
      // Override console.error to capture React warnings
      const originalError = console.error;
      const capturedErrors: string[] = [];
      
      console.error = (...args) => {
        const message = args.join(' ');
        capturedErrors.push(message);
        originalError.apply(console, args);
      };
      
      // Restore original after a brief moment
      setTimeout(() => {
        console.error = originalError;
      }, 100);
      
      return capturedErrors;
    });

    consoleErrors.forEach(error => {
      if (this.isReactStateError(error)) {
        this.addError({
          timestamp: new Date(),
          type: 'react',
          level: 'error',
          message: error,
          source: 'react-state-update'
        });
      }
    });
  }

  /**
   * Check for specific error patterns and fail test if found
   */
  async assertNoReactStateErrors(): Promise<void> {
    const reactErrors = this.errors.filter(error => 
      error.type === 'react' && 
      this.isReactStateError(error.message)
    );

    if (reactErrors.length > 0) {
      const errorDetails = reactErrors.map(error => 
        `- ${error.timestamp.toISOString()}: ${error.message}`
      ).join('\n');
      
      throw new Error(`React state update errors detected:\n${errorDetails}`);
    }
  }

  /**
   * Get all collected errors
   */
  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  /**
   * Get all collected warnings
   */
  getWarnings(): ErrorReport[] {
    return [...this.warnings];
  }

  /**
   * Check if there are any critical errors (excluding AbortErrors)
   */
  hasCriticalErrors(): boolean {
    return this.errors.some(error => 
      error.level === 'error' && 
      (error.type === 'page' || error.type === 'react') &&
      // Exclude AbortErrors as they're expected during component unmounting
      !error.message.includes('AbortError') &&
      !error.message.includes('signal is aborted') &&
      !(error.message.includes('Failed to load initial batch') && error.message.includes('AbortError'))
    );
  }

  /**
   * Generate a comprehensive error report
   */
  generateReport(): string {
    let report = '\n📊 E2E Error Monitoring Report\n';
    report += '================================\n\n';

    if (this.errors.length === 0 && this.warnings.length === 0) {
      report += '✅ No errors or warnings detected!\n';
      return report;
    }

    if (this.errors.length > 0) {
      report += `❌ Errors Found: ${this.errors.length}\n`;
      report += '------------------------\n';
      this.errors.forEach((error, index) => {
        report += `${index + 1}. [${error.type.toUpperCase()}] ${error.message}\n`;
        if (error.source) report += `   Source: ${error.source}\n`;
        if (error.url) report += `   URL: ${error.url}\n`;
        if (error.status) report += `   Status: ${error.status}\n`;
        if (error.stack) report += `   Stack: ${error.stack.substring(0, 200)}...\n`;
        report += `   Time: ${error.timestamp.toISOString()}\n\n`;
      });
    }

    if (this.warnings.length > 0) {
      report += `⚠️  Warnings Found: ${this.warnings.length}\n`;
      report += '-------------------------\n';
      this.warnings.forEach((warning, index) => {
        report += `${index + 1}. [${warning.type.toUpperCase()}] ${warning.message}\n`;
        if (warning.source) report += `   Source: ${warning.source}\n`;
        report += `   Time: ${warning.timestamp.toISOString()}\n\n`;
      });
    }

    return report;
  }

  /**
   * Log a summary of errors to console
   */
  logSummary(): void {
    if (this.errors.length > 0) {
      console.log(`❌ ${this.errors.length} errors detected during test`);
      this.errors.forEach(error => {
        console.log(`  - ${error.type}: ${error.message.substring(0, 100)}...`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️  ${this.warnings.length} warnings detected during test`);
      this.warnings.forEach(warning => {
        console.log(`  - ${warning.type}: ${warning.message.substring(0, 100)}...`);
      });
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ No errors or warnings detected');
    }
  }

  private addError(error: ErrorReport): void {
    this.errors.push(error);
    console.log(`❌ Error detected: ${error.type} - ${error.message.substring(0, 100)}...`);
  }

  private addWarning(warning: ErrorReport): void {
    this.warnings.push(warning);
    console.log(`⚠️  Warning detected: ${warning.type} - ${warning.message.substring(0, 100)}...`);
  }

  private isReactWarning(message: string): boolean {
    const reactWarningPatterns = [
      'Warning: ',
      'React.createElement',
      'componentDidMount',
      'componentWillUnmount',
      'useEffect',
      'setState'
    ];

    return reactWarningPatterns.some(pattern => message.includes(pattern));
  }

  private isReactStateError(message: string): boolean {
    const reactStateErrorPatterns = [
      'Cannot update a component',
      'setState',
      'useEffect',
      'dispatchSetState',
      'getRootForUpdatedFiber',
      'handleLevelToggle',
      'Configuration.useEffect',
      'state update on an unmounted component',
      'memory leak'
    ];

    return reactStateErrorPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  }
}

/**
 * Helper function to setup error monitoring for a test
 */
export async function setupErrorMonitoring(page: Page): Promise<E2EErrorMonitor> {
  const monitor = new E2EErrorMonitor(page);
  await monitor.startMonitoring();
  return monitor;
}

/**
 * Helper function to check for errors and fail test if critical errors found
 */
export async function validateNoErrors(monitor: E2EErrorMonitor, options?: {
  allowWarnings?: boolean;
  allowNetworkErrors?: boolean;
  allowAbortErrors?: boolean;
  customPatterns?: string[];
}): Promise<void> {
  const opts = {
    allowWarnings: false,
    allowNetworkErrors: false,
    allowAbortErrors: true, // Allow AbortErrors by default as they're expected during component unmounting
    customPatterns: [],
    ...options
  };

  // Check for React state errors specifically
  await monitor.checkForReactStateErrors();

  // Generate and log report
  const report = monitor.generateReport();
  console.log(report);
  monitor.logSummary();

  // Fail test if critical errors found
  if (monitor.hasCriticalErrors()) {
    throw new Error(`Critical errors detected during test execution. See report above.`);
  }

  // Check for React state errors specifically
  await monitor.assertNoReactStateErrors();

  // Check for custom error patterns
  if (opts.customPatterns && opts.customPatterns.length > 0) {
    const customErrors = monitor.getErrors().filter(error =>
      opts.customPatterns!.some(pattern => error.message.includes(pattern))
    );

    if (customErrors.length > 0) {
      throw new Error(`Custom error patterns detected: ${customErrors.map(e => e.message).join(', ')}`);
    }
  }

  // Optionally fail on warnings
  if (!opts.allowWarnings && monitor.getWarnings().length > 0) {
    const warningMessages = monitor.getWarnings().map(w => w.message).join(', ');
    throw new Error(`Warnings detected: ${warningMessages}`);
  }

  // Optionally fail on network errors (excluding AbortErrors if allowed)
  if (!opts.allowNetworkErrors) {
    let networkErrors = monitor.getErrors().filter(e => e.type === 'network');
    
    // Filter out AbortErrors if they're allowed
    if (opts.allowAbortErrors) {
      networkErrors = networkErrors.filter(e => 
        !e.message.includes('AbortError') && 
        !e.message.includes('ERR_ABORTED') &&
        !e.message.includes('NS_BINDING_ABORTED') &&
        !e.message.includes('signal is aborted')
      );
    }
    
    if (networkErrors.length > 0) {
      const networkMessages = networkErrors.map(e => `${e.status} ${e.message}`).join(', ');
      throw new Error(`Network errors detected: ${networkMessages}`);
    }
  }

  // Also filter out AbortErrors from console errors if allowed
  if (opts.allowAbortErrors) {
    const abortErrors = monitor.getErrors().filter(e => 
      e.type === 'console' && (
        e.message.includes('AbortError') ||
        e.message.includes('signal is aborted') ||
        e.message.includes('Failed to load initial batch') && e.message.includes('AbortError')
      )
    );
    
    if (abortErrors.length > 0) {
      console.log(`ℹ️ Ignoring ${abortErrors.length} AbortError(s) as they are expected during component unmounting`);
    }
  }
}