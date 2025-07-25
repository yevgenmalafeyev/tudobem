# AI Integration Testing Guide

This guide covers the comprehensive end-to-end testing of AI integration functionality in the TudoBem Portuguese learning application.

## Overview

The AI Integration test suite validates that:
1. ✅ Real Claude API keys are properly configured and validated
2. ✅ AI-generated questions are successfully delivered through the UI
3. ✅ Complete user interaction flow works with AI-generated content
4. ✅ Performance benchmarks are met for AI generation
5. ✅ Fallback systems work when API keys are invalid

## Test Files

### 🧪 Main Test Suite
- **File**: `tests/e2e/ai-integration-full-flow.spec.ts`
- **Type**: Playwright E2E Test
- **Purpose**: Comprehensive AI integration validation

### 🚀 Test Runner Script
- **File**: `scripts/test-ai-integration.js`
- **Type**: Node.js utility script
- **Purpose**: Automated test execution with prerequisite validation

## Prerequisites

### 1. API Key Configuration
Create `local-config.json` in project root:
```json
{
  "anthropicApiKey": "sk-ant-api03-your-actual-key-here"
}
```

### 2. Development Server
Ensure the application is running:
```bash
npm run dev
# Server should be accessible at http://localhost:3000
```

### 3. Dependencies
All required dependencies installed:
```bash
npm install
npx playwright install
```

## Running the Tests

### 🎯 Quick Start (Recommended)
```bash
npm run test:ai:setup
```
This command:
- ✅ Validates all prerequisites
- ✅ Checks API key format and server availability
- ✅ Runs the complete test suite with detailed reporting
- ✅ Provides troubleshooting guidance on failure

### 🔧 Manual Execution Options

#### Basic Test (Headed Mode)
```bash
npm run test:ai
```

#### CI/Headless Mode
```bash
npm run test:ai:ci
```

#### Direct Playwright Execution
```bash
npx playwright test tests/e2e/ai-integration-full-flow.spec.ts --headed --reporter=line
```

## Test Scenarios

### 🔄 Test 1: Complete AI-Powered Learning Flow
**Duration**: ~60 seconds
**Validates**:
- API key acceptance and validation
- Learning configuration with real AI key
- AI exercise generation and delivery
- User interaction with AI-generated content
- Exercise continuity (multiple AI generations)

**Test Steps**:
1. Navigate to application
2. Configure learning settings with real API key
3. Wait for AI-generated exercise (up to 30s)
4. Verify exercise quality and interaction
5. Test exercise continuity with next exercise
6. Validate performance metrics

### 🛡️ Test 2: API Key Validation & Error Handling
**Duration**: ~30 seconds
**Validates**:
- Invalid API key format handling
- Graceful fallback to database exercises
- Error message display and user guidance

### ⚡ Test 3: Performance Benchmark
**Duration**: ~45 seconds
**Validates**:
- Configuration save time < 15s
- Exercise generation time < 30s
- Total time to first exercise < 45s
- Performance metrics logging

## Success Criteria

### ✅ Passing Test Indicators
- API key successfully validates with Claude API
- Fresh AI exercises generate within 30 seconds
- User can interact with exercises (text input or multiple choice)
- Exercise feedback system responds correctly
- Performance benchmarks are met
- No JavaScript errors in browser console

### ❌ Common Failure Scenarios

#### API Key Issues
```
❌ Invalid API key format. Should start with sk-ant-
```
**Solution**: Verify API key in `local-config.json`

#### Server Issues
```
❌ Development server not accessible at localhost:3000
```
**Solution**: Start development server with `npm run dev`

#### Timeout Issues
```
❌ Exercise generation timeout (>30s)
```
**Possible Causes**:
- Network connectivity issues
- Claude API rate limiting
- API key quota exceeded
- Server overload

#### Exercise Detection Issues
```
❌ No recognizable exercise type found
```
**Possible Causes**:
- UI components not loading correctly
- Test selectors out of date
- JavaScript errors preventing render

## Performance Expectations

### 📊 Benchmark Targets
- **Configuration Time**: < 15 seconds
- **Exercise Generation**: < 30 seconds
- **Total Flow Time**: < 45 seconds
- **API Response Time**: < 10 seconds

### 📈 Performance Monitoring
The test suite automatically captures:
- Configuration save duration
- Exercise generation time
- Total user journey time
- API response times

## Integration with CI/CD

### GitHub Actions Integration
Add to your GitHub Actions workflow:
```yaml
- name: AI Integration Test
  run: |
    echo '{"anthropicApiKey":"${{ secrets.ANTHROPIC_API_KEY }}"}' > local-config.json
    npm run test:ai:ci
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Local Development
For regular development testing:
```bash
# Quick daily AI integration check
npm run test:ai:setup

# Include in comprehensive test suite
npm run test:e2e && npm run test:ai:ci
```

## Troubleshooting

### 🔍 Debug Mode
Run with additional debugging:
```bash
DEBUG=pw:api npx playwright test tests/e2e/ai-integration-full-flow.spec.ts --headed --reporter=line
```

### 📋 Common Solutions

#### Rate Limiting
If you encounter rate limiting, wait a few minutes or check your API quota.

#### Network Issues
Verify internet connectivity and Claude API service status.

#### UI Element Changes
If selectors fail, update test selectors in the spec file to match current UI.

#### Memory Issues
For long test runs, consider increasing Node.js memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run test:ai
```

## Maintenance

### Regular Updates Needed
1. **API Key Rotation**: Update `local-config.json` when keys change
2. **UI Selector Updates**: Update test selectors when UI components change
3. **Performance Benchmarks**: Adjust timeouts as AI performance changes
4. **Error Message Updates**: Update expected error messages as they change

### Version Compatibility
- **Node.js**: >= 18.x
- **Playwright**: >= 1.40.x
- **Claude API**: Latest Anthropic SDK
- **Browser**: Chrome/Firefox/Safari latest

## Related Documentation
- [Main Testing Guide](TESTING_GUIDE.md)
- [Performance Testing](PERFORMANCE_TESTING.md)
- [Production Testing](PRODUCTION_TESTING.md)
- [Test Plan](TEST_PLAN.md)