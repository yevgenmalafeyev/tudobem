# Production Testing Guide

## Overview
This guide covers testing your Portuguese Learning App against the deployed Vercel instance at `https://portuguese-learning-app-theta.vercel.app`.

## Test Configurations

### Local Development Testing
```bash
npm run test:e2e          # Test against local server (localhost:3000)
npm run test:e2e:ui       # With interactive UI
```

### Production Testing
```bash
npm run test:e2e:prod     # Test against Vercel deployment
npm run test:e2e:prod:ui  # With interactive UI
npm run test:smoke        # Quick smoke tests only
```

## Production Test Types

### 1. Smoke Tests (`test:smoke`)
**Purpose**: Quick verification that critical functionality works after deployment

**What it tests**:
- ✅ App loads without errors
- ✅ Basic exercise flow works
- ✅ Mode switching functions
- ✅ Mobile responsiveness
- ✅ Network error handling
- ✅ Page reload handling
- ✅ Load time performance

**Runtime**: ~2-3 minutes

### 2. Full Production Tests (`test:e2e:prod`)
**Purpose**: Comprehensive testing across all browsers and scenarios

**What it tests**:
- ✅ All smoke test scenarios
- ✅ Complete learning workflows
- ✅ Accessibility compliance
- ✅ Performance benchmarks
- ✅ Cross-browser compatibility
- ✅ Concurrent user simulation

**Runtime**: ~15-20 minutes

## Key Differences from Local Testing

### Production Configuration
- **Real API calls** to your deployed backend
- **Real network conditions** and latency
- **Actual deployment environment** (Vercel Edge Functions)
- **Production optimizations** (minified code, CDN, etc.)

### Enhanced Settings
- **Longer timeouts** for network requests
- **More retries** for flaky network conditions
- **Cross-browser testing** (Chrome, Firefox, Safari)
- **Mobile device simulation**
- **Error reporting** and artifacts

## Browser Coverage

### Desktop
- ✅ Chrome (latest)
- ✅ Firefox (latest)  
- ✅ Safari (latest)

### Mobile
- ✅ iPhone 12 (Safari)
- ✅ Pixel 5 (Chrome)
- ✅ iPad Pro (Safari)

## Automated Production Testing

### GitHub Actions Workflow
The production tests run automatically:

1. **After successful deployment** - Verifies deployment didn't break anything
2. **Daily at 9 AM UTC** - Monitors ongoing production health  
3. **Manual trigger** - Run tests on-demand

### Test Results
- **Artifacts saved** for 7 days (screenshots, videos, reports)
- **GitHub Issues created** automatically on failure
- **Detailed HTML reports** with step-by-step execution

## Running Production Tests Locally

### Prerequisites
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Quick Smoke Test
```bash
npm run test:smoke
```

### Full Production Test Suite
```bash
npm run test:e2e:prod
```

### Interactive Debugging
```bash
npm run test:e2e:prod:ui
```

### Specific Browser
```bash
npx playwright test --config=playwright.config.production.ts --project="Desktop Chrome"
```

## Production Test Scenarios

### Critical Path Verification
1. **App Loading**
   - Page loads within 10 seconds
   - No console errors
   - Basic UI elements present

2. **Exercise Flow**
   - Exercise displays correctly
   - User can input answers
   - Feedback appears after checking
   - Next exercise loads properly

3. **Mode Switching**
   - Input ↔ Multiple choice works
   - Options load correctly
   - Selection persists

4. **Error Handling**
   - API failures handled gracefully
   - Fallback exercises work
   - Network timeouts recovered

### Performance Monitoring
- **Page load time**: < 10 seconds
- **API response time**: < 15 seconds  
- **Interactive delay**: < 3 seconds
- **Mode switching**: < 5 seconds

### Accessibility Compliance
- **Keyboard navigation** works
- **Screen reader compatibility**
- **Focus management** proper
- **Color contrast** sufficient

## Troubleshooting Production Tests

### Common Issues

#### Timeout Errors
```bash
# Increase timeout for slow network
npx playwright test --timeout=60000 --config=playwright.config.production.ts
```

#### API Rate Limiting
```bash
# Reduce parallel workers
npx playwright test --workers=1 --config=playwright.config.production.ts
```

#### Network Failures
- Check if Vercel app is accessible in browser
- Verify API endpoints are responding
- Check for CORS issues

### Debug Commands
```bash
# Run with debug info
npx playwright test --debug --config=playwright.config.production.ts

# Run specific test
npx playwright test "should load the application" --config=playwright.config.production.ts

# Generate trace
npx playwright test --trace=on --config=playwright.config.production.ts
```

## Monitoring Production Health

### Key Metrics Tracked
- **Uptime**: App availability
- **Performance**: Load times and responsiveness  
- **Functionality**: Core features working
- **Cross-browser**: Compatibility maintained
- **Mobile**: Responsive design intact

### Alerting
- **GitHub Issues** created on test failures
- **Detailed reports** with screenshots and videos
- **Email notifications** (if configured)

### Historical Data
- **Test results** saved as artifacts
- **Performance trends** tracked over time
- **Failure patterns** identified

## Best Practices

### When to Run Production Tests

#### Always Run
- ✅ After deploying new features
- ✅ After configuration changes
- ✅ Before major releases

#### Regularly Run  
- ✅ Daily automated checks
- ✅ Weekly full test suite
- ✅ Monthly cross-browser verification

#### On-Demand Run
- ✅ When users report issues
- ✅ After third-party service updates
- ✅ During incident investigation

### Test Data Management
- **Use realistic test data** that matches production
- **Avoid hardcoded assumptions** about specific exercises
- **Handle dynamic content** gracefully
- **Test edge cases** that occur in production

### Performance Considerations
- **Limit concurrent tests** to avoid overwhelming the server
- **Use appropriate timeouts** for production latency
- **Monitor resource usage** during test execution
- **Clean up test artifacts** regularly

## Integration with Monitoring

### Complement Other Tools
- **Vercel Analytics** - Real user metrics
- **Uptime monitors** - Basic availability
- **Error tracking** - Runtime exceptions
- **Performance monitoring** - Core Web Vitals

### Production Testing Advantages
- **User journey validation** - Complete workflows
- **Cross-browser verification** - Compatibility assurance
- **Proactive issue detection** - Find problems before users
- **Regression prevention** - Ensure changes don't break existing features

This production testing setup ensures your Portuguese Learning App maintains high quality and reliability for real users while providing early warning of any issues that might affect the user experience.