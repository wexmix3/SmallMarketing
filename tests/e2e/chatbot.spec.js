/**
 * End-to-End Tests for AI Customer Service Assistant
 * 
 * These tests verify the complete user experience across different browsers.
 */

const { test, expect } = require('@playwright/test');

test.describe('AI Customer Service Assistant E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page
    await page.goto('landing-page.html');
    
    // Wait for the page to load
    await page.waitForSelector('.hero-content');
  });
  
  test('should navigate from landing page to chatbot demo', async ({ page }) => {
    // Click the demo button on the landing page
    await page.click('.demo-content a.btn-primary');
    
    // Verify we're on the chatbot demo page
    await expect(page).toHaveURL(/chatbot-demo-enhanced.html/);
    
    // Verify the demo page loaded correctly
    await expect(page.locator('.demo-header h1')).toBeVisible();
    await expect(page.locator('#try-widget-button')).toBeVisible();
  });
  
  test('should complete a full conversation flow', async ({ page }) => {
    // Navigate to the chatbot demo page
    await page.goto('chatbot-demo-enhanced.html');
    
    // Open the widget
    await page.click('#try-widget-button');
    
    // Verify the widget opens
    await expect(page.locator('.chatbot-widget')).toHaveClass(/open/);
    
    // Verify welcome message
    await expect(page.locator('.bot-message .message-content p')).toContainText('Hello! Welcome to');
    
    // Ask about business hours
    await page.fill('#messageInput', 'What are your business hours?');
    await page.click('#sendButton');
    
    // Verify response about business hours
    await expect(page.locator('.bot-message .message-content p')).toContainText('business hours');
    
    // Ask about returns
    await page.fill('#messageInput', 'How do I return a product?');
    await page.click('#sendButton');
    
    // Verify response about returns
    await expect(page.locator('.bot-message .message-content p')).toContainText('return');
    
    // Ask about shipping
    await page.fill('#messageInput', 'Do you offer free shipping?');
    await page.click('#sendButton');
    
    // Verify response about shipping
    await expect(page.locator('.bot-message .message-content p')).toContainText('shipping');
    
    // Thank the bot
    await page.fill('#messageInput', 'Thank you for your help!');
    await page.click('#sendButton');
    
    // Verify thank you response
    await expect(page.locator('.bot-message .message-content p')).toContainText('You\'re welcome');
    
    // Say goodbye
    await page.fill('#messageInput', 'Goodbye');
    await page.click('#sendButton');
    
    // Verify goodbye response
    await expect(page.locator('.bot-message .message-content p')).toContainText('Thank you for chatting');
  });
  
  test('should customize and apply theme settings', async ({ page }) => {
    // Navigate to the chatbot demo page
    await page.goto('chatbot-demo-enhanced.html');
    
    // Select dark theme
    await page.selectOption('#theme-select', 'dark');
    
    // Change primary color
    await page.fill('#primary-color', '#ff0000');
    
    // Select different font
    await page.selectOption('#font-select', 'Roboto, Arial, sans-serif');
    
    // Apply settings
    await page.click('#apply-settings');
    
    // Verify toast message appears
    await expect(page.locator('.toast')).toBeVisible();
    await expect(page.locator('.toast')).toContainText('Settings applied');
    
    // Open the widget
    await page.click('#try-widget-button');
    
    // Verify theme changes were applied
    await expect(page.locator('body')).toHaveClass(/dark/);
    
    // Send a test message
    await page.fill('#messageInput', 'Testing with custom theme');
    await page.click('#sendButton');
    
    // Verify message is sent and displayed with custom styling
    await expect(page.locator('.user-message .message-content p')).toContainText('Testing with custom theme');
  });
  
  test('should handle suggested actions', async ({ page }) => {
    // Navigate to the chatbot demo page
    await page.goto('chatbot-demo-enhanced.html');
    
    // Open the widget
    await page.click('#try-widget-button');
    
    // Wait for suggested actions to appear
    await page.waitForSelector('.suggested-action');
    
    // Get text of first suggested action
    const actionText = await page.textContent('.suggested-action:first-child');
    
    // Click the suggested action
    await page.click('.suggested-action:first-child');
    
    // Verify the action text was sent as a message
    await expect(page.locator('.user-message .message-content p')).toContainText(actionText);
    
    // Verify bot responds
    await page.waitForSelector('.bot-message:nth-child(3)');
    await expect(page.locator('.bot-message')).toHaveCount(2);
  });
  
  test('should persist conversation state', async ({ page }) => {
    // Navigate to the chatbot demo page
    await page.goto('chatbot-demo-enhanced.html');
    
    // Open the widget
    await page.click('#try-widget-button');
    
    // Send a unique message
    const uniqueMessage = `Test message ${Date.now()}`;
    await page.fill('#messageInput', uniqueMessage);
    await page.click('#sendButton');
    
    // Verify message is sent
    await expect(page.locator('.user-message .message-content p')).toContainText(uniqueMessage);
    
    // Wait for response
    await page.waitForSelector('.bot-message:nth-child(3)');
    
    // Close the widget
    await page.click('#close-widget');
    
    // Reopen the widget
    await page.click('.chatbot-toggle');
    
    // Verify the previous message is still there
    await expect(page.locator('.user-message .message-content p')).toContainText(uniqueMessage);
  });
  
  test('should work on mobile viewport', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the chatbot demo page
    await page.goto('chatbot-demo-enhanced.html');
    
    // Verify responsive layout
    await expect(page.locator('.demo-content')).toHaveCSS('grid-template-columns', /1fr/);
    
    // Open the widget
    await page.click('#try-widget-button');
    
    // Verify widget adapts to mobile size
    await expect(page.locator('.chatbot-widget')).toHaveCSS('width', /100%|100vw/);
    
    // Send a test message
    await page.fill('#messageInput', 'Testing on mobile');
    await page.click('#sendButton');
    
    // Verify message is sent and response received
    await expect(page.locator('.user-message .message-content p')).toContainText('Testing on mobile');
    await page.waitForSelector('.bot-message:nth-child(3)');
  });
  
  test('should navigate to full page chatbot', async ({ page }) => {
    // Navigate to the chatbot demo page
    await page.goto('chatbot-demo-enhanced.html');
    
    // Click the full page demo button
    await page.click('#try-fullpage-button');
    
    // Verify we're on the full page demo
    await expect(page).toHaveURL(/chatbot-fullpage.html/);
    
    // Verify chat interface is visible
    await expect(page.locator('.chat-container')).toBeVisible();
    await expect(page.locator('.chat-messages')).toBeVisible();
    await expect(page.locator('#messageInput')).toBeVisible();
    
    // Send a test message
    await page.fill('#messageInput', 'Hello from full page demo');
    await page.click('#sendButton');
    
    // Verify message is sent and response received
    await expect(page.locator('.user-message .message-content p')).toContainText('Hello from full page demo');
    await page.waitForSelector('.bot-message:nth-child(2)');
    
    // Test theme toggle
    await page.click('#theme-toggle');
    
    // Verify theme changes
    await expect(page.locator('body')).toHaveClass(/dark/);
    
    // Test back to demo button
    await page.click('#back-to-demo');
    
    // Verify we're back on the demo page
    await expect(page).toHaveURL(/chatbot-demo-enhanced.html/);
  });
  
  test('should handle edge cases and errors gracefully', async ({ page }) => {
    // Navigate to the chatbot demo page
    await page.goto('chatbot-demo-enhanced.html');
    
    // Open the widget
    await page.click('#try-widget-button');
    
    // Try to send an empty message
    await page.click('#sendButton');
    
    // Verify no message is sent (count should still be 1 - the welcome message)
    await expect(page.locator('.bot-message')).toHaveCount(1);
    
    // Send a very long message
    const longMessage = 'This is a very long message that should be handled properly. '.repeat(50);
    await page.fill('#messageInput', longMessage);
    await page.click('#sendButton');
    
    // Verify message is sent and response received
    await expect(page.locator('.user-message .message-content p')).toContainText('This is a very long message');
    await page.waitForSelector('.bot-message:nth-child(3)');
    
    // Send a message with special characters
    await page.fill('#messageInput', '!@#$%^&*()_+<>?:"{}|~`');
    await page.click('#sendButton');
    
    // Verify message is sent and response received
    await expect(page.locator('.user-message .message-content p')).toContainText('!@#$%^&*()_+<>?:"{}|~`');
    await page.waitForSelector('.bot-message:nth-child(5)');
    
    // Send a message with HTML tags
    await page.fill('#messageInput', '<script>alert("test")</script><b>Bold text</b>');
    await page.click('#sendButton');
    
    // Verify message is sanitized and response received
    const messageContent = await page.textContent('.user-message:nth-child(6) .message-content p');
    expect(messageContent).not.toContain('<script>');
    await page.waitForSelector('.bot-message:nth-child(7)');
  });
  
  test('should load and function on all pages of the site', async ({ page }) => {
    // Test on landing page
    await page.goto('landing-page.html');
    
    // Click the demo button in the CTA section
    await page.click('.cta-content a.btn-primary');
    
    // Verify we're on the demo page
    await expect(page).toHaveURL(/chatbot-demo-enhanced.html/);
    
    // Open the widget
    await page.click('#try-widget-button');
    
    // Send a test message
    await page.fill('#messageInput', 'Testing from demo page');
    await page.click('#sendButton');
    
    // Verify message is sent
    await expect(page.locator('.user-message .message-content p')).toContainText('Testing from demo page');
    
    // Navigate to full page demo
    await page.goto('chatbot-fullpage.html');
    
    // Send a test message
    await page.fill('#messageInput', 'Testing from full page');
    await page.click('#sendButton');
    
    // Verify message is sent
    await expect(page.locator('.user-message .message-content p')).toContainText('Testing from full page');
    
    // Navigate back to landing page
    await page.goto('landing-page.html');
    
    // Verify page loaded
    await expect(page.locator('.hero-content h1')).toBeVisible();
  });
  
  test('should handle network conditions gracefully', async ({ page }) => {
    // Enable offline mode
    await page.context().setOffline(true);
    
    // Navigate to the chatbot demo page
    await page.goto('chatbot-demo-enhanced.html', { waitUntil: 'domcontentloaded' });
    
    // Try to open the widget
    await page.click('#try-widget-button');
    
    // Verify widget still opens
    await expect(page.locator('.chatbot-widget')).toHaveClass(/open/);
    
    // Try to send a message
    await page.fill('#messageInput', 'Testing offline mode');
    await page.click('#sendButton');
    
    // Verify message is sent
    await expect(page.locator('.user-message .message-content p')).toContainText('Testing offline mode');
    
    // Re-enable online mode
    await page.context().setOffline(false);
    
    // Reload the page
    await page.reload();
    
    // Open the widget
    await page.click('#try-widget-button');
    
    // Send a test message
    await page.fill('#messageInput', 'Testing online mode');
    await page.click('#sendButton');
    
    // Verify message is sent and response received
    await expect(page.locator('.user-message .message-content p')).toContainText('Testing online mode');
    await page.waitForSelector('.bot-message:nth-child(3)');
  });
});
