const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
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
    '<rootDir>/debug-production.spec.ts',
    '<rootDir>/tests/integration/enhanced-exercise-system.test.ts',
    '<rootDir>/src/lib/__tests__/userDatabase.test.ts',
    '<rootDir>/src/lib/__tests__/userDatabase.unit.test.ts',
    '<rootDir>/src/lib/__tests__/databaseMigration.test.ts',
    '<rootDir>/src/app/api/admin/__tests__/admin.api.test.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/page.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)