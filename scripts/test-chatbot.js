/**
 * Test script for the AI Customer Service Assistant
 * 
 * This script tests the core functionality of the chatbot without requiring a running server.
 */

// Set environment variables for testing
process.env.USE_MOCK_DB = 'true';
process.env.NODE_ENV = 'test';

// Import required modules
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readline = require('readline');

// Create mock data directory if it doesn't exist
const mockDataDir = path.join(__dirname, '..', 'src', 'mock-data');
if (!fs.existsSync(mockDataDir)) {
  fs.mkdirSync(mockDataDir, { recursive: true });
  console.log('Created mock data directory:', mockDataDir);
  
  // Run setup-mock-db.js to create mock data
  require('./setup-mock-db');
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline.question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Main test function
async function testChatbot() {
  console.log('=== AI Customer Service Assistant Test ===');
  console.log('This script tests the core functionality of the chatbot.');
  console.log('Type "exit" to quit the test.\n');
  
  // Create a test conversation
  const businessId = 'business-1';
  const conversationId = 'test-conversation-' + Date.now();
  
  // Import the required services
  // Note: We need to use dynamic imports for ESM modules
  const { default: aiService } = await import('../dist/services/aiService.js');
  const { default: chatbotService } = await import('../dist/services/chatbotService.js');
  
  // Generate welcome message
  const welcomeMessage = await aiService.generateWelcomeMessage(businessId);
  console.log('Bot: ' + welcomeMessage);
  
  // Main conversation loop
  let running = true;
  let context = null;
  
  while (running) {
    // Get user input
    const userMessage = await question('You: ');
    
    // Check for exit command
    if (userMessage.toLowerCase() === 'exit') {
      running = false;
      continue;
    }
    
    try {
      // Process the message
      const response = await aiService.processMessage(
        businessId,
        conversationId,
        userMessage,
        context
      );
      
      // Update context
      context = {
        conversationId,
        businessId,
        recentMessages: [
          ...(context?.recentMessages || []),
          { role: 'user', content: userMessage },
          { role: 'assistant', content: response.text }
        ],
        identifiedIntents: [
          ...(context?.identifiedIntents || []),
          response.intent
        ]
      };
      
      // Display bot response
      console.log('Bot: ' + response.text);
      
      // Display suggested actions if available
      if (response.suggestedActions && response.suggestedActions.length > 0) {
        console.log('Suggested actions:');
        response.suggestedActions.forEach((action, index) => {
          console.log(`  ${index + 1}. ${action}`);
        });
      }
      
      // Check if human intervention is required
      if (response.requiresHumanIntervention) {
        console.log('(This would transfer to a human agent in the real application)');
        running = false;
      }
    } catch (error) {
      console.error('Error processing message:', error);
      console.log('Bot: I apologize, but I encountered an error. Please try again.');
    }
  }
  
  console.log('\nTest completed. Thank you for testing the AI Customer Service Assistant!');
  rl.close();
}

// Build TypeScript files before running the test
const { execSync } = require('child_process');

try {
  console.log('Building TypeScript files...');
  execSync('npm run build:ts', { stdio: 'inherit' });
  
  // Run the test
  testChatbot().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('Failed to build TypeScript files:', error);
  process.exit(1);
}
