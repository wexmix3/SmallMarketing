/**
 * Cypress Custom Commands
 * 
 * This file defines custom commands for Cypress tests.
 */

// Open the chatbot widget
Cypress.Commands.add('openChatbotWidget', () => {
  cy.get('#try-widget-button').click();
  cy.get('.chatbot-widget').should('have.class', 'open');
});

// Send a message in the chatbot
Cypress.Commands.add('sendChatbotMessage', (message) => {
  cy.get('#messageInput').type(message);
  cy.get('#sendButton').click();
  cy.get('.user-message .message-content p').should('contain', message);
});

// Wait for bot response
Cypress.Commands.add('waitForBotResponse', () => {
  cy.get('.typing-indicator').should('exist');
  cy.get('.typing-indicator').should('not.exist');
  cy.get('.bot-message').should('have.length.greaterThan', 1);
});

// Apply theme settings
Cypress.Commands.add('applyChatbotTheme', (theme, color, font) => {
  cy.get('#theme-select').select(theme);
  cy.get('#primary-color').invoke('val', color).trigger('input');
  cy.get('#font-select').select(font);
  cy.get('#apply-settings').click();
  cy.get('.toast').should('exist');
});

// Check if element is in viewport
Cypress.Commands.add('isInViewport', (element) => {
  cy.get(element).then($el => {
    const windowHeight = Cypress.config('viewportHeight');
    const rect = $el[0].getBoundingClientRect();
    
    expect(rect.top).to.be.lessThan(windowHeight);
    expect(rect.bottom).to.be.greaterThan(0);
  });
});

// Take a screenshot with a custom name
Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(`${Cypress.currentTest.title} - ${name}`);
});
