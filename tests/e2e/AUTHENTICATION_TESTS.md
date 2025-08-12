# Authentication E2E Tests Documentation

## Overview
Comprehensive E2E tests for the authentication system covering signup, login, password recovery, user profile, and logout functionality.

## Test File
- **Location**: `tests/e2e/authentication-flow.spec.ts`
- **Config**: `playwright.auth.config.ts`
- **Command**: `npm run test:auth`

## Test Coverage

### 1. Full Authentication Flow ✅
- User signup with form validation
- Email verification (mocked)
- Login with credentials
- Session management

### 2. Password Recovery Flow ✅
- Request password reset
- Email notification (mocked)
- Reset password with token
- Success confirmation

### 3. User Profile Display ✅
- Authenticated user detection
- Profile page rendering
- Statistics display
- Account information

### 4. Logout Functionality ✅
- Session termination
- UI state update
- Navigation to public area

### 5. Form Validation ✅
- Required field validation
- Email format validation
- Password length validation
- Error message display

## Mocking Strategy

### API Mocking
All API calls are intercepted and mocked to avoid:
- Real database writes
- Email sending
- OAuth provider connections

### Mocked Endpoints
- `/api/auth/signup` - User registration
- `/api/auth/login` - User authentication
- `/api/auth/verify` - Email verification
- `/api/auth/reset-password` - Password recovery
- `/api/auth/logout` - Session termination
- `/api/progress/stats` - User statistics

### Test Data
Uses timestamp-based test user to ensure uniqueness:
```javascript
const TEST_USER = {
  username: `testuser_${Date.now()}`,
  email: `testuser_${Date.now()}@test.com`,
  password: 'TestPassword123!'
};
```

## Database Cleanup

### Automatic Cleanup
After each test, the cleanup function:
1. Deletes test user from `users` table
2. Removes orphaned sessions
3. Cleans NextAuth tables (if present)
4. Resets test-affected data

### Cleanup Endpoint
- **URL**: `/api/test-cleanup`
- **Protection**: Only available in non-production
- **Actions**: Removes test data, resets counters

## Running Tests

### Local Development
```bash
# Run all authentication tests
npm run test:auth

# Run with UI mode for debugging
npm run test:auth:ui

# Run specific test
npx playwright test authentication-flow.spec.ts --grep "should complete full authentication flow"
```

### Test Results
- **Total Tests**: 5
- **Passing**: 5
- **Duration**: ~11 seconds

## Configuration

### Environment Variables (Optional)
For OAuth testing, add to `.env.local`:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

### NextAuth Configuration
- Strategy: JWT (for testing)
- Session: 30 days with auto-renewal
- Providers: Google, Facebook (when configured)

## Security Considerations

### Test Environment Only
- Cleanup endpoint disabled in production
- Mock tokens used for testing
- No real email sending
- No actual OAuth connections

### Data Isolation
- Unique test users per run
- Complete cleanup after tests
- No interference with real data

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure port 3000 is available
2. **Database connection**: Check PostgreSQL is running
3. **NextAuth warnings**: Normal in test environment
4. **JWT errors**: Mock tokens expected in tests

### Debug Mode
Use Playwright UI for visual debugging:
```bash
npm run test:auth:ui
```

## Future Enhancements
- [ ] Add tests for email sending (when configured)
- [ ] Test real OAuth flow (requires test accounts)
- [ ] Add performance benchmarks
- [ ] Test rate limiting
- [ ] Test 2FA when implemented