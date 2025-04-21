/**
 * Cypress Support File for Component Tests
 * 
 * This file is loaded before all component tests.
 */

// Import commands.js
import './commands';

// Mount function for React components
import { mount } from 'cypress/react';

Cypress.Commands.add('mount', mount);

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});
