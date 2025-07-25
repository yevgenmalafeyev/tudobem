// Jest setup for integration tests (Node.js environment)

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.POSTGRES_URL = process.env.POSTGRES_URL || 'postgresql://test:test@localhost:5432/test';

// Mock console to reduce noise in tests unless there are errors
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

console.log = (...args) => {
  // Only show logs that seem important for debugging
  const message = args.join(' ');
  if (message.includes('Error') || message.includes('FAIL') || message.includes('✅') || message.includes('❌')) {
    originalConsoleLog(...args);
  }
};

console.warn = (...args) => {
  // Always show warnings
  originalConsoleWarn(...args);
};

// Restore console for cleanup
afterAll(() => {
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
});