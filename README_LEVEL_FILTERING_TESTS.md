# Level Filtering Tests Documentation

## Overview
This document describes the comprehensive test suite for validating that exercises are properly filtered by selected difficulty levels (A1, A2, B1, B2, C1, C2) in the Portuguese Learning App.

## Why Level Filtering is Critical

### User Experience Impact
- **Inappropriate Difficulty**: A1 users getting B2 exercises would be frustrating and demotivating
- **Learning Progression**: Users expect exercises matching their selected proficiency level
- **Personalization**: Level filtering is core to the app's personalized learning experience

### Technical Challenges
- **API Integration**: Exercise generation must respect level parameters
- **Fallback Logic**: When AI fails, fallback exercises must match selected levels
- **State Management**: Level preferences must persist across sessions
- **Content Validation**: Returned exercises must actually match requested complexity

## Test Architecture

### 1. Unit Tests (`tests/unit/services/levelValidation.test.ts`)
**Purpose**: Validate core level filtering logic in isolation

**Coverage**:
- ✅ Fallback exercise level consistency
- ✅ `getFallbackExercise()` level filtering
- ✅ Content complexity validation by level
- ✅ Edge cases (empty levels, invalid levels)

**Key Test Cases**:
```typescript
// Ensures A1 exercises don't appear when requesting B1-B2
it('should not return exercises from excluded levels', () => {
  for (let i = 0; i < 20; i++) {
    const exercise = getFallbackExercise(['A2', 'B1'])
    expect(['A2', 'B1']).toContain(exercise?.level)
    expect(['A1', 'B2', 'C1', 'C2']).not.toContain(exercise?.level)
  }
})
```

### 2. Integration Tests (`tests/integration/level-configuration.test.tsx`)
**Purpose**: Verify level filtering works with hooks and API integration

**Coverage**:
- ✅ API requests contain correct level parameters
- ✅ Responses are validated against requested levels
- ✅ Configuration changes trigger proper updates
- ✅ Fallback behavior when API fails

**Key Test Cases**:
```typescript
// Verifies API gets the right level parameters
it('should send only selected levels in API requests', async () => {
  const { result } = renderHook(() => 
    useExerciseGeneration(createMockProps(['B1', 'B2']))
  )
  
  await act(async () => {
    await result.current.generateNewExercise()
  })
  
  expect(capturedRequestBody.levels).toEqual(['B1', 'B2'])
})
```

### 3. E2E Tests - Local (`tests/e2e/level-filtering.spec.ts`)
**Purpose**: Test complete level filtering workflows in development environment

**Coverage**:
- ✅ Level display consistency across exercises
- ✅ Mixed level selection handling
- ✅ Fallback exercise level validation
- ✅ Mode switching preserves level filtering
- ✅ Content complexity matches level

**Key Test Cases**:
```typescript
// Ensures no level mixing within single exercises
test('should prevent level mixing in single exercise', async ({ page }) => {
  const exerciseContent = await page.locator('.neo-card-lg').textContent()
  const levelMatches = exerciseContent?.match(/\b(A1|A2|B1|B2|C1|C2)\b/g) || []
  
  // Each exercise should show exactly one level
  const uniqueLevelsInExercise = [...new Set(levelMatches)]
  expect(uniqueLevelsInExercise.length).toBe(1)
})
```

### 4. E2E Tests - Production (`tests/e2e/production-level-filtering.spec.ts`)
**Purpose**: Validate level filtering against deployed Vercel app

**Coverage**:
- ✅ Real API response level validation
- ✅ Network error handling with level consistency
- ✅ Performance with level filtering
- ✅ Concurrent user level isolation
- ✅ Cross-browser level display

## Test Scenarios

### Core Level Filtering Scenarios

#### Single Level Selection
```bash
# Test A1-only selection
npm run test:levels -- --grep "A1 exercises when A1 is selected"
```
**Validates**: Only A1 exercises appear, no B1/B2/C1/C2 content

#### Multiple Level Selection  
```bash
# Test B1-B2 selection
npm run test:levels -- --grep "mixed level selection"
```
**Validates**: Only B1 and B2 exercises appear, no A1/A2/C1/C2 content

#### Level Progression Validation
```bash
# Test content complexity progression
npm run test:levels -- --grep "content complexity"
```
**Validates**: A1 has simple vocabulary, B2 has complex grammar structures

### Production Validation Scenarios

#### Real API Integration
```bash
# Test against deployed app
npm run test:levels:prod
```
**Validates**: Actual API responses respect level filtering

#### Performance Under Load
```bash
# Test concurrent level filtering
npm run test:levels:prod -- --grep "concurrent"
```
**Validates**: Level filtering works under concurrent user load

#### Error Recovery
```bash
# Test level consistency during API failures
npm run test:levels:prod -- --grep "API errors"
```
**Validates**: Fallback exercises still match selected levels

## Running Level Filtering Tests

### Development Environment
```bash
# Run all level filtering tests locally
npm run test:levels

# Run with UI for debugging
npm run test:levels -- --ui

# Run specific test
npm run test:levels -- --grep "should not display exercises from excluded levels"
```

### Production Environment
```bash
# Run against Vercel deployment
npm run test:levels:prod

# Run with verbose output
npm run test:levels:prod -- --reporter=verbose

# Run single production test
npm run test:levels:prod -- --grep "consistent levels in production"
```

### Unit/Integration Tests
```bash
# Run level validation unit tests
npm test tests/unit/services/levelValidation.test.ts

# Run integration tests
npm test tests/integration/level-configuration.test.tsx

# Run with coverage
npm run test:coverage -- --testNamePattern="level"
```

## Expected Behaviors

### ✅ Correct Level Filtering

#### API Requests
- Request body includes only selected levels: `["B1", "B2"]`
- No requests made for excluded levels
- Fallback triggers when API returns wrong level

#### Exercise Display
- Level badge shows only requested levels
- Exercise content matches complexity for displayed level
- Multiple exercises maintain level consistency

#### Content Complexity
- **A1**: Simple present tense, basic vocabulary
- **A2**: Past/future tenses, common vocabulary  
- **B1**: Subjunctive introduction, intermediate vocabulary
- **B2**: Complex subjunctive, advanced vocabulary

### ❌ Incorrect Behaviors (Test Should Catch)

#### Level Mixing
- A1 exercise appearing when B1-B2 selected
- Multiple levels shown in single exercise
- Content complexity not matching displayed level

#### API Issues
- Wrong levels in API requests
- No fallback when API returns invalid level
- Level inconsistency across exercise generations

## Debugging Level Filtering Issues

### Investigation Steps

1. **Check Unit Tests First**
   ```bash
   npm test tests/unit/services/levelValidation.test.ts
   ```
   If unit tests fail, the core logic is broken

2. **Verify Integration Layer**
   ```bash
   npm test tests/integration/level-configuration.test.tsx
   ```
   If integration tests fail, check hook/API integration

3. **Test E2E Locally**
   ```bash
   npm run test:levels -- --headed --debug
   ```
   Watch the browser to see actual behavior

4. **Verify Production**
   ```bash
   npm run test:levels:prod -- --trace=on
   ```
   Check if issue exists in deployed environment

### Common Issues and Solutions

#### Issue: Wrong Levels in API Requests
**Debug**: Check integration test for API parameters
**Solution**: Verify level configuration is passed correctly to hooks

#### Issue: Fallback Exercises Wrong Level  
**Debug**: Check unit tests for `getFallbackExercise()`
**Solution**: Verify fallback exercise data structure

#### Issue: UI Shows Wrong Level
**Debug**: Check E2E tests for level badge display
**Solution**: Verify level badge gets data from correct source

#### Issue: Content Doesn't Match Level
**Debug**: Check content complexity validation tests
**Solution**: Review exercise generation logic and prompts

## Monitoring Level Filtering

### Automated Monitoring
- **CI/CD**: Level filtering tests run on every deployment
- **Daily**: Production level consistency checks
- **Performance**: Level filtering speed monitoring

### Manual Verification
```bash
# Quick production check
npm run test:smoke

# Comprehensive level validation
npm run test:levels:prod

# Performance analysis
npm run test:levels:prod -- --grep "performance"
```

### Metrics to Track
- **Level Accuracy**: % of exercises matching requested levels
- **API Consistency**: % of API responses with correct levels  
- **Fallback Quality**: % of fallback exercises matching levels
- **Performance**: Time to display level-filtered exercises

## Best Practices

### When Adding New Levels
1. Update unit tests with new level validation
2. Add fallback exercises for new levels
3. Update E2E tests to handle new level options
4. Verify content complexity is appropriate

### When Modifying Level Logic
1. Run full test suite: `npm test && npm run test:levels`
2. Test against production: `npm run test:levels:prod`
3. Verify performance hasn't degraded
4. Update test documentation if needed

### When Debugging Level Issues
1. Start with unit tests (fastest feedback)
2. Use E2E tests with `--headed` for visual debugging
3. Check production with trace enabled
4. Monitor API requests/responses in browser DevTools

This comprehensive test suite ensures that users always receive exercises appropriate for their selected difficulty level, maintaining the quality and personalization that makes the Portuguese Learning App effective for language learners at all proficiency levels.