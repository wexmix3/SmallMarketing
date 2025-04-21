/**
 * Integration Tests for AI Customer Service Assistant
 * 
 * These tests verify the integration of all components in the chatbot.
 */

describe('AI Customer Service Assistant', () => {
  beforeEach(() => {
    // Visit the chatbot demo page
    cy.visit('chatbot-demo-enhanced.html');
    
    // Wait for the page to load
    cy.get('#try-widget-button').should('be.visible');
  });
  
  it('should open the widget when clicking the demo button', () => {
    // Click the demo button
    cy.get('#try-widget-button').click();
    
    // Verify the widget opens
    cy.get('.chatbot-widget').should('have.class', 'open');
    cy.get('.chatbot-toggle').should('have.class', 'open');
  });
  
  it('should show welcome message when widget opens', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Verify welcome message
    cy.get('.bot-message').should('exist');
    cy.get('.bot-message .message-content p').should('contain', 'Hello! Welcome to our website');
  });
  
  it('should show suggested actions with welcome message', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Verify suggested actions
    cy.get('.suggested-actions').should('exist');
    cy.get('.suggested-action').should('have.length.greaterThan', 0);
  });
  
  it('should send a message when clicking send button', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Type a message
    cy.get('#messageInput').type('Hello, I have a question');
    
    // Click send button
    cy.get('#sendButton').click();
    
    // Verify user message appears
    cy.get('.user-message').should('exist');
    cy.get('.user-message .message-content p').should('contain', 'Hello, I have a question');
    
    // Verify bot responds
    cy.get('.bot-message').should('have.length.greaterThan', 1);
  });
  
  it('should send a message when pressing Enter', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Type a message and press Enter
    cy.get('#messageInput').type('What are your business hours?{enter}');
    
    // Verify user message appears
    cy.get('.user-message').should('exist');
    cy.get('.user-message .message-content p').should('contain', 'What are your business hours?');
    
    // Verify bot responds with business hours
    cy.get('.bot-message').should('have.length.greaterThan', 1);
    cy.get('.bot-message .message-content p').should('contain', 'business hours');
  });
  
  it('should use suggested actions when clicked', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Wait for suggested actions to appear
    cy.get('.suggested-action').first().should('be.visible');
    
    // Get the text of the first suggested action
    cy.get('.suggested-action').first().invoke('text').then((text) => {
      // Click the suggested action
      cy.get('.suggested-action').first().click();
      
      // Verify the text was sent as a message
      cy.get('.user-message .message-content p').should('contain', text);
      
      // Verify bot responds
      cy.get('.bot-message').should('have.length.greaterThan', 1);
    });
  });
  
  it('should show typing indicator while waiting for response', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Type a message
    cy.get('#messageInput').type('Tell me about your products{enter}');
    
    // Verify typing indicator appears
    cy.get('.typing-indicator').should('exist');
    
    // Verify typing indicator disappears after response
    cy.get('.typing-indicator').should('not.exist');
  });
  
  it('should close the widget when clicking close button', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Click the close button
    cy.get('#close-widget').click();
    
    // Verify the widget closes
    cy.get('.chatbot-widget').should('not.have.class', 'open');
    cy.get('.chatbot-toggle').should('not.have.class', 'open');
  });
  
  it('should apply theme changes', () => {
    // Select dark theme
    cy.get('#theme-select').select('dark');
    
    // Change primary color
    cy.get('#primary-color').invoke('val', '#ff0000').trigger('input');
    
    // Select different font
    cy.get('#font-select').select('Roboto, Arial, sans-serif');
    
    // Apply settings
    cy.get('#apply-settings').click();
    
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Verify theme changes were applied
    cy.get('body').should('have.class', 'dark');
    
    // Verify toast message appears
    cy.get('.toast').should('exist');
    cy.get('.toast').should('contain', 'Settings applied');
    
    // Verify toast disappears after a few seconds
    cy.get('.toast').should('not.exist');
  });
  
  it('should persist conversation across widget open/close', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Send a message
    cy.get('#messageInput').type('Hello, this is a test message{enter}');
    
    // Wait for response
    cy.get('.bot-message').should('have.length.greaterThan', 1);
    
    // Close the widget
    cy.get('#close-widget').click();
    
    // Reopen the widget
    cy.get('.chatbot-toggle').click();
    
    // Verify previous messages are still there
    cy.get('.user-message .message-content p').should('contain', 'Hello, this is a test message');
  });
  
  it('should handle knowledge base queries correctly', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Ask about returns
    cy.get('#messageInput').type('What is your return policy?{enter}');
    
    // Verify response contains return information
    cy.get('.bot-message').should('have.length.greaterThan', 1);
    cy.get('.bot-message .message-content p').should('contain', 'return');
    
    // Ask about shipping
    cy.get('#messageInput').type('Do you offer free shipping?{enter}');
    
    // Verify response contains shipping information
    cy.get('.bot-message').should('have.length.greaterThan', 2);
    cy.get('.bot-message .message-content p').should('contain', 'shipping');
  });
  
  it('should be responsive on mobile viewport', () => {
    // Set viewport to mobile size
    cy.viewport('iphone-x');
    
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Verify widget adapts to mobile size
    cy.get('.chatbot-widget').should('have.css', 'width').and('match', /100%|100vw/);
    
    // Send a message
    cy.get('#messageInput').type('Hello from mobile{enter}');
    
    // Verify message is sent and response received
    cy.get('.user-message .message-content p').should('contain', 'Hello from mobile');
    cy.get('.bot-message').should('have.length.greaterThan', 1);
  });
  
  it('should handle special characters in messages', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Send message with special characters
    cy.get('#messageInput').type('Test with special chars: !@#$%^&*()_+<>?{};\':",./{enter}');
    
    // Verify message is displayed correctly
    cy.get('.user-message .message-content p').should('contain', 'Test with special chars: !@#$%^&*()_+<>?{};\':",./')
    
    // Verify bot responds
    cy.get('.bot-message').should('have.length.greaterThan', 1);
  });
  
  it('should handle URLs in messages', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Send message with URL
    cy.get('#messageInput').type('Check out this website: https://example.com{enter}');
    
    // Verify URL is converted to a link
    cy.get('.user-message .message-content p a').should('have.attr', 'href', 'https://example.com');
    
    // Verify bot responds
    cy.get('.bot-message').should('have.length.greaterThan', 1);
  });
  
  it('should handle long messages with scrolling', () => {
    // Open the widget
    cy.get('#try-widget-button').click();
    
    // Send a very long message
    const longMessage = 'This is a very long message that should cause the chat window to scroll. '.repeat(10);
    cy.get('#messageInput').type(longMessage + '{enter}');
    
    // Verify message is displayed
    cy.get('.user-message .message-content p').should('contain', 'This is a very long message');
    
    // Verify bot responds
    cy.get('.bot-message').should('have.length.greaterThan', 1);
    
    // Verify chat has scrolled to bottom
    cy.get('.chat-messages').then($el => {
      const scrollTop = $el[0].scrollTop;
      const scrollHeight = $el[0].scrollHeight;
      const clientHeight = $el[0].clientHeight;
      
      // Check if scrolled to bottom (with small tolerance)
      expect(scrollTop + clientHeight).to.be.closeTo(scrollHeight, 5);
    });
  });
  
  it('should switch to full page demo', () => {
    // Click the full page demo button
    cy.get('#try-fullpage-button').click();
    
    // Verify we're on the full page demo
    cy.url().should('include', 'chatbot-fullpage.html');
    
    // Verify chat interface is visible
    cy.get('.chat-container').should('be.visible');
    cy.get('.chat-messages').should('be.visible');
    cy.get('#messageInput').should('be.visible');
    
    // Send a test message
    cy.get('#messageInput').type('Hello from full page demo{enter}');
    
    // Verify message is sent and response received
    cy.get('.user-message .message-content p').should('contain', 'Hello from full page demo');
    cy.get('.bot-message').should('have.length.greaterThan', 0);
  });
});
