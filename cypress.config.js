/**
 * Cypress Configuration for AI Customer Service Assistant
 */

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // Base URL for tests
  baseUrl: 'http://localhost:8000',
  
  // Test files pattern
  e2e: {
    specPattern: 'tests/integration/**/*.spec.js',
    supportFile: 'tests/support/e2e.js',
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
  },
  
  // Component testing
  component: {
    specPattern: 'tests/components/**/*.spec.js',
    supportFile: 'tests/support/component.js',
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
  
  // Viewport configuration
  viewportWidth: 1280,
  viewportHeight: 800,
  
  // Screenshots and videos
  screenshotOnRunFailure: true,
  video: true,
  videoCompression: 32,
  
  // Timeouts
  defaultCommandTimeout: 5000,
  requestTimeout: 10000,
  responseTimeout: 10000,
  
  // Retries
  retries: {
    runMode: 2,
    openMode: 0,
  },
  
  // Environment variables
  env: {
    testMode: 'integration',
  },
});
