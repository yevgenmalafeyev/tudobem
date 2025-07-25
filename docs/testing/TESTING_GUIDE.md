# Testing Guide for Portuguese Learning App

## Overview
This document provides comprehensive guidance on testing the Portuguese Learning App, including how to run tests, understand test structure, and contribute new tests.

## Test Structure

### Directory Organization
```
tests/
├── unit/                     # Unit tests for individual functions
│   ├── utils/               # Utility function tests
│   └── services/            # Service layer tests
├── integration/             # Integration tests for connected components
│   └── hooks/               # Custom hook tests
├── components/              # Component tests
│   └── learning/            # Learning component tests
├── api/                     # API route tests
└── e2e/                     # End-to-end tests
```

## Running Tests

### Prerequisites
```bash
npm install
```

### Available Test Commands

#### Unit and Integration Tests
```bash
# Run all Jest tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

#### End-to-End Tests
```bash
# Run all Playwright tests
npm run test:e2e

# Run Playwright tests with UI
npm run test:e2e:ui

# Install Playwright browsers (first time setup)
npx playwright install
```

### Running Specific Test Suites
```bash
# Run only unit tests
npm test tests/unit

# Run only component tests
npm test tests/components

# Run only API tests
npm test tests/api

# Run specific test file
npm test validation.test.ts

# Run tests matching pattern
npm test --testNamePattern="should validate answers"
```

## Test Categories

### 1. Unit Tests (`tests/unit/`)
Test individual functions and utilities in isolation.

**Coverage includes:**
- Utility functions (validation, arrays, prompts)
- Service functions (exercise generation, multiple choice)
- Constants and type definitions

**Example:**
```typescript
describe('levenshteinDistance', () => {
  it('should calculate correct distance for identical strings', () => {
    expect(levenshteinDistance('hello', 'hello')).toBe(0)
  })
})
```

### 2. Integration Tests (`tests/integration/`)
Test how different parts of the application work together.

**Coverage includes:**
- Custom hooks with state management
- API integration with hooks
- Component integration with services

**Example:**
```typescript
describe('useLearning hook', () => {
  it('should update user answer', () => {
    const { result } = renderHook(() => useLearning())
    act(() => {
      result.current.setUserAnswer('falo')
    })
    expect(result.current.userAnswer).toBe('falo')
  })
})
```

### 3. Component Tests (`tests/components/`)
Test React components and their user interactions.

**Coverage includes:**
- Component rendering
- User interactions (clicks, input)
- Props handling
- State changes
- Accessibility features

**Example:**
```typescript
describe('ModeToggle', () => {
  it('should call setLearningMode when button is clicked', () => {
    render(<ModeToggle learningMode="input" setLearningMode={mockFn} />)
    fireEvent.click(screen.getByText('Multiple Choice'))
    expect(mockFn).toHaveBeenCalledWith('multiple-choice')
  })
})
```

### 4. API Tests (`tests/api/`)
Test API routes and their responses.

**Coverage includes:**
- Request/response handling
- Error scenarios
- Input validation
- Fallback mechanisms
- Authentication

**Example:**
```typescript
describe('/api/generate-exercise', () => {
  it('should generate exercise with valid request', async () => {
    const response = await POST(request)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('sentence')
  })
})
```

### 5. End-to-End Tests (`tests/e2e/`)
Test complete user workflows and scenarios.

**Coverage includes:**
- Complete learning flows
- User interactions across components
- Performance testing
- Accessibility testing
- Error handling

**Example:**
```typescript
test('should complete input mode exercise flow', async ({ page }) => {
  await page.fill('input[type="text"]', 'falo')
  await page.click('text=Check Answer')
  await expect(page.locator('.neo-inset')).toBeVisible()
})
```

## Test Data and Mocking

### Mock Service Worker (MSW)
API calls are mocked using MSW for consistent testing.

**Setup:**
- Handlers defined in `src/__mocks__/handlers.ts`
- Server setup in `src/__mocks__/server.ts`
- Automatically started in `jest.setup.js`

### Test Data
Consistent test data is used across all tests:
- Mock exercises with various difficulty levels
- Mock API responses for different scenarios
- Edge cases and error conditions

## Writing New Tests

### Best Practices

1. **Test Structure (AAA Pattern)**
   ```typescript
   test('should do something', () => {
     // Arrange - Set up test data
     const input = 'test input'
     
     // Act - Perform the action
     const result = functionUnderTest(input)
     
     // Assert - Verify the outcome
     expect(result).toBe(expectedOutput)
   })
   ```

2. **Clear Test Names**
   - Use descriptive test names that explain the expected behavior
   - Include the condition and expected outcome
   - Example: `should return error when API key is missing`

3. **Test Independence**
   - Each test should be independent and not rely on other tests
   - Use `beforeEach` and `afterEach` for setup and cleanup
   - Clear mocks between tests

4. **Edge Cases**
   - Test both happy path and error scenarios
   - Include boundary conditions and invalid inputs
   - Test network failures and timeouts

### Adding Unit Tests
```typescript
// tests/unit/utils/newUtility.test.ts
import { newUtilityFunction } from '@/utils/newUtility'

describe('newUtilityFunction', () => {
  it('should handle normal case', () => {
    // Test implementation
  })
  
  it('should handle edge case', () => {
    // Test implementation
  })
  
  it('should throw error for invalid input', () => {
    // Test implementation
  })
})
```

### Adding Component Tests
```typescript
// tests/components/NewComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import NewComponent from '@/components/NewComponent'

describe('NewComponent', () => {
  const mockProps = {
    // Define required props
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    render(<NewComponent {...mockProps} />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
  
  it('should handle user interaction', () => {
    render(<NewComponent {...mockProps} />)
    fireEvent.click(screen.getByRole('button'))
    // Assert expected behavior
  })
})
```

### Adding E2E Tests
```typescript
// tests/e2e/new-feature.spec.ts
import { test, expect } from '@playwright/test'

test.describe('New Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete new feature workflow', async ({ page }) => {
    // Test complete user workflow
  })
})
```

## Debugging Tests

### Failed Unit/Integration Tests
1. Check test output for specific assertion failures
2. Use `console.log` for debugging (remove before committing)
3. Use Jest's `--verbose` flag for detailed output
4. Check mock implementations

### Failed E2E Tests
1. Use `--headed` flag to see browser actions
2. Add `await page.pause()` to stop execution
3. Use `--debug` flag for step-by-step debugging
4. Check screenshot/video artifacts

### Common Issues
- **Mock not working**: Check mock setup in `jest.setup.js`
- **Component not rendering**: Check required props and context
- **E2E test timeout**: Increase timeout or check selectors
- **API test failing**: Verify request body and headers

## Coverage Reports

### Viewing Coverage
```bash
npm run test:coverage
```

Coverage reports are generated in `coverage/` directory:
- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format for CI

### Coverage Goals
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **Component Tests**: 85%+ coverage
- **Critical Paths**: 100% E2E coverage

## Continuous Integration

### GitHub Actions
Tests run automatically on:
- Pull requests
- Pushes to main branch
- Release branches

### Test Environments
- **Unit/Integration**: Node.js environment
- **E2E**: Chromium, Firefox, and WebKit browsers
- **Mobile**: Simulated mobile devices

## Performance Testing

### Metrics Tracked
- Page load times
- API response times
- User interaction responsiveness
- Memory usage
- Network optimization

### Performance Thresholds
- Initial page load: < 3 seconds
- API responses: < 5 seconds
- User interactions: < 100ms
- Mode switching: < 3 seconds

## Accessibility Testing

### Manual Testing
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus management

### Automated Testing
- ARIA attributes validation
- Semantic HTML structure
- Focus trap testing
- High contrast mode support

## Contributing Tests

### Before Submitting
1. Run full test suite: `npm test && npm run test:e2e`
2. Check coverage: `npm run test:coverage`
3. Follow naming conventions
4. Include both positive and negative test cases
5. Update documentation if needed

### Code Review Checklist
- [ ] Tests are comprehensive and cover edge cases
- [ ] Test names are descriptive and clear
- [ ] Mocks are properly configured
- [ ] Tests are independent and don't rely on each other
- [ ] Performance considerations are addressed
- [ ] Accessibility is tested where applicable

## Troubleshooting

### Common Commands
```bash
# Clear Jest cache
npx jest --clearCache

# Update Playwright browsers
npx playwright install

# Run tests with debug info
npm test -- --verbose

# Run single test file
npm test -- validation.test.ts

# Run E2E tests in debug mode
npx playwright test --debug
```

### Getting Help
- Check test output messages carefully
- Review similar existing tests for patterns
- Use Jest and Playwright documentation
- Ask for help in code reviews

This comprehensive testing setup ensures the Portuguese Learning App maintains high quality, performance, and reliability across all features and user scenarios.