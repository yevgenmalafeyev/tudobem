# Performance Testing Framework

Comprehensive performance testing setup for the Tudobem Portuguese Learning App, designed to measure and validate Core Web Vitals, load performance, and user experience metrics.

## Overview

This performance testing framework provides:

- **Core Web Vitals measurement** - LCP, FID, CLS metrics following Google's standards
- **Network condition simulation** - Test across different connection speeds
- **Load and stress testing** - Validate performance under high usage
- **Memory usage monitoring** - Detect memory leaks and optimization opportunities
- **Automated performance regression detection** - Catch performance degradation early

## Quick Start

```bash
# Run all performance tests
npm run test:performance

# Run with interactive UI
npm run test:performance:ui

# Run specific test suites
npm run test:performance:core    # Core Web Vitals tests
npm run test:performance:load    # Load and stress tests
```

## Test Structure

### Core Web Vitals Tests (`tests/performance/core-web-vitals.spec.ts`)

Tests Google's Core Web Vitals metrics across different conditions:

- **Desktop Performance**: Standard desktop browser conditions
- **Mobile Performance**: Mobile viewport with network throttling  
- **Network Conditions**: Slow 3G, Fast 3G, and custom network simulation
- **Progressive Enhancement**: Performance with all features enabled

**Key Metrics Tested:**
- **LCP (Largest Contentful Paint)**: < 2.5s (desktop), < 4s (mobile)
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s (desktop), < 3s (mobile)

### Load Testing (`tests/performance/load-testing.spec.ts`)

Validates application performance under various load conditions:

- **Rapid Interaction Testing**: High-frequency user inputs and mode switching
- **Extended Usage Testing**: Long learning sessions (20+ exercises)
- **Stress Testing**: Resource exhaustion and recovery scenarios
- **Memory Efficiency**: Memory leak detection and usage optimization

**Performance Thresholds:**
- Rapid input handling: < 5s for 100 rapid inputs
- Extended session: < 30% performance degradation over 20 exercises
- Memory growth: < 50% increase during extended usage
- Stress test success rate: > 80%

## Configuration

### Performance Testing Config (`playwright.performance.config.ts`)

Specialized Playwright configuration optimized for performance testing:

```typescript
{
  fullyParallel: false,        // Sequential execution for accurate measurements
  workers: 1,                  // Single worker for consistent results
  timeout: 60000,              // Extended timeout for performance tests
  
  // Performance-optimized browser settings
  launchOptions: {
    args: [
      '--enable-precise-memory-info',
      '--disable-background-timer-throttling',
      // ... additional performance flags
    ]
  }
}
```

### Test Projects

- **desktop-chrome-performance**: Standard desktop testing (1920x1080)
- **mobile-performance**: Mobile testing with Pixel 5 simulation
- **low-end-device**: Resource-constrained device simulation
- **slow-3g-simulation**: Network throttling simulation

## Utilities and Helpers

### PerformanceMeasurer Class

Comprehensive performance measurement utility:

```typescript
const measurer = new PerformanceMeasurer(page);

// Measure Core Web Vitals
const vitals = await measurer.measureCoreWebVitals();

// Get navigation timing
const timing = await measurer.getNavigationTiming();

// Monitor memory usage  
const memory = await measurer.getMemoryUsage();

// Get all metrics at once
const allMetrics = await measurer.getAllMetrics();
```

### NetworkSimulator Class

Network condition simulation:

```typescript
const networkSim = new NetworkSimulator(page);

await networkSim.simulateSlow3G();    // 500 Kbps, 400ms latency
await networkSim.simulateFast3G();    // 1.6 Mbps, 150ms latency
await networkSim.simulateCustomNetwork({
  downloadThroughput: 1000 * 1024,    // 1 Mbps
  uploadThroughput: 500 * 1024,       // 500 Kbps  
  latency: 200                        // 200ms
});
```

### PerformanceAssertions Class

Automated performance validation:

```typescript
// Assert Core Web Vitals meet thresholds
PerformanceAssertions.assertCoreWebVitals(vitals);

// Assert load time within limits
PerformanceAssertions.assertLoadTime(loadTime, 3000);

// Assert memory usage is reasonable
PerformanceAssertions.assertMemoryUsage(memory, 100); // < 100MB
```

## Global Setup and Teardown

### Global Setup (`tests/performance/global-setup.ts`)

- Warms up the application for consistent measurements
- Establishes performance monitoring baseline
- Pre-loads critical resources
- Sets up custom performance markers

### Global Teardown (`tests/performance/global-teardown.ts`)

- Generates performance summary reports
- Cleans up temporary files
- Calculates test session statistics

## Performance Thresholds

### Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| FID | ≤ 100ms | 100ms - 300ms | > 300ms |
| CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

### Application-Specific Thresholds

- **Initial Load Time**: < 3s (desktop), < 5s (mobile)
- **Time to Interactive**: < 3s
- **Exercise Completion**: < 8s average
- **Mode Switching**: < 3s
- **Memory Usage**: < 100MB (desktop), < 50MB (mobile)

## Performance Reports

### HTML Report

Generated in `performance-report/` directory with:
- Test execution timeline
- Screenshot captures on failures
- Detailed trace information
- Performance metric charts

### JSON Results

Generated as `performance-results.json` with:
- Structured test results
- Raw performance metrics
- Timing information
- Pass/fail status

### Performance Summary

Generated as `performance-summary.json` with:
- High-level test statistics
- Average performance metrics
- Regression detection alerts
- Trend analysis

## Best Practices

### Writing Performance Tests

1. **Isolate Tests**: Each test should be independent and not affect others
2. **Warm Up**: Allow time for application and browser to stabilize
3. **Multiple Measurements**: Take several measurements and average them
4. **Realistic Conditions**: Test under realistic network and device conditions
5. **Clear Metrics**: Focus on user-impacting metrics rather than synthetic ones

### Test Maintenance

1. **Regular Updates**: Update thresholds as application evolves
2. **Baseline Management**: Maintain performance baselines for regression detection
3. **Environment Consistency**: Ensure consistent test environments
4. **Monitoring Integration**: Integrate with CI/CD for continuous monitoring

## Troubleshooting

### Common Issues

**Tests timing out**:
- Increase timeout values for slower environments
- Check network conditions and server performance
- Verify test setup and warmup procedures

**Inconsistent results**:
- Ensure single worker configuration
- Check for background processes affecting performance
- Verify network stability during test execution

**Memory measurement unavailable**:
- Memory APIs only available in Chromium-based browsers
- Some measurements require specific browser flags
- Fallback gracefully when APIs not available

### Debug Mode

Run tests with additional debugging:

```bash
# Enable debug output
DEBUG=pw:api npm run test:performance

# Run with headed browser for visual debugging
npm run test:performance:ui

# Capture additional traces
PLAYWRIGHT_HTML_REPORT=performance-debug npm run test:performance
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Run Performance Tests
  run: |
    npm run test:performance
    
- name: Upload Performance Reports
  uses: actions/upload-artifact@v3
  with:
    name: performance-report
    path: performance-report/
    
- name: Performance Regression Check
  run: |
    # Compare with baseline metrics
    # Fail if performance degrades beyond threshold
```

### Performance Budgets

Set up automated performance budgets in CI:

```javascript
// In CI script
const results = JSON.parse(fs.readFileSync('performance-results.json'));
const budget = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  loadTime: 3000
};

// Fail build if budget exceeded
checkPerformanceBudget(results, budget);
```

## Future Enhancements

- **Real User Monitoring (RUM)** integration
- **Performance regression detection** with ML
- **Cross-browser performance comparison**
- **Mobile device testing** on real devices
- **Performance optimization recommendations**