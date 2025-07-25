const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Custom config for integration tests
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.js'],
  testEnvironment: 'node', // Use node environment for database tests
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/', 
    '<rootDir>/node_modules/', 
    '<rootDir>/tests/e2e/', 
    '<rootDir>/tests/functional/',
    '<rootDir>/tests/performance/',
    '<rootDir>/tests/production/',
    '<rootDir>/debug-production.spec.ts'
    // Remove the integration test from ignore patterns
  ],
  // Only run the integration test
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.ts'
  ],
  maxWorkers: 1, // Run tests sequentially to avoid database conflicts
  forceExit: true, // Force exit after tests complete
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)