/**
 * Jest Configuration for AI Customer Service Assistant
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Test files pattern
  testMatch: [
    '**/tests/unit/**/*.test.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/public/**',
    '!jest.config.js',
    '!cypress.config.js',
    '!playwright.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.js'
  ],
  
  // Module transformations
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Module name mapper for CSS/image imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/mocks/fileMock.js'
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true
};
