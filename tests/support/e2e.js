/**
 * Cypress Support File for E2E Tests
 * 
 * This file is loaded before all E2E tests.
 */

// Import commands.js
import './commands';

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Log test name before each test
beforeEach(() => {
  const testTitle = Cypress.currentTest.title;
  cy.log(`Running test: ${testTitle}`);
});
