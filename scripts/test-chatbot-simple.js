/**
 * Simple Test Script for the AI Customer Service Assistant
 * 
 * This script tests the core functionality of the chatbot without requiring TypeScript compilation.
 */

// Set environment variables for testing
process.env.USE_MOCK_DB = 'true';
process.env.NODE_ENV = 'test';

// Import required modules
const fs = require('fs');
const path = require('path');
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

// Mock AI service
const mockAIService = {
  generateWelcomeMessage: async () => {
    return "Hello! Welcome to our customer service chat. How can I assist you today?";
  },
  
  processMessage: async (businessId, conversationId, message) => {
    console.log(`Processing message: "${message}" for business ${businessId} in conversation ${conversationId}`);
    
    // Simple keyword-based responses
    const normalizedMessage = message.toLowerCase();
    let response = {
      text: "I'm here to help! What would you like to know about our products or services?",
      confidence: 0.7,
      intent: 'general_inquiry',
      suggestedActions: [
        'Tell me about your products',
        'What are your business hours?',
        'I need help with a return',
        'I want to schedule an appointment'
      ]
    };
    
    if (normalizedMessage.includes('hour') || normalizedMessage.includes('open')) {
      response = {
        text: "We are open Monday to Friday from 9 AM to 5 PM, and Saturday from 10 AM to 2 PM. We are closed on Sundays.",
        confidence: 0.9,
        intent: 'business_hours',
        suggestedActions: ['Do you need directions to our location?', 'Would you like to schedule an appointment?']
      };
    } else if (normalizedMessage.includes('return') || normalizedMessage.includes('refund')) {
      response = {
        text: "We accept returns within 30 days of purchase. Items must be unused and in original packaging. For standard returns, customers are responsible for return shipping costs. However, if you received a defective item, we'll provide a prepaid shipping label.",
        confidence: 0.9,
        intent: 'return_policy',
        suggestedActions: ['Do you need to initiate a return?', 'Would you like information about our exchange policy?']
      };
    } else if (normalizedMessage.includes('ship') || normalizedMessage.includes('delivery')) {
      response = {
        text: "We offer standard shipping (3-5 business days), expedited shipping (2-3 business days), and overnight shipping. Free standard shipping is available on all orders over $50 within the continental United States.",
        confidence: 0.9,
        intent: 'shipping_info',
        suggestedActions: ['Do you need to track an existing order?', 'Would you like to place a new order?']
      };
    } else if (normalizedMessage.includes('price') || normalizedMessage.includes('cost')) {
      response = {
        text: "Our pricing varies by product. Is there a specific item you're interested in?",
        confidence: 0.8,
        intent: 'pricing',
        suggestedActions: ['View our product catalog', 'Ask about current promotions']
      };
    } else if (normalizedMessage.includes('appointment') || normalizedMessage.includes('schedule')) {
      response = {
        text: "I'd be happy to help you schedule an appointment. What day and time works best for you?",
        confidence: 0.85,
        intent: 'appointment_scheduling',
        suggestedActions: ['View available times', 'Learn about our services']
      };
    } else if (normalizedMessage.includes('speak') && normalizedMessage.includes('human') || 
               normalizedMessage.includes('agent') || normalizedMessage.includes('representative')) {
      response = {
        text: "I'll connect you with a human customer service representative right away. Please hold for a moment while I transfer you.",
        confidence: 0.95,
        intent: 'human_handoff',
        requiresHumanIntervention: true
      };
    } else if (normalizedMessage.includes('product') || normalizedMessage.includes('item')) {
      response = {
        text: "We offer a variety of high-quality products. Our most popular items include our Premium T-shirts, Wireless Earbuds, and Hoodies.",
        confidence: 0.85,
        intent: 'product_information',
        suggestedActions: ['Tell me more about T-shirts', 'Tell me more about Earbuds', 'Tell me more about Hoodies']
      };
    } else if (normalizedMessage.includes('thank')) {
      response = {
        text: "You're welcome! Is there anything else I can help you with today?",
        confidence: 0.95,
        intent: 'gratitude',
        suggestedActions: ['Yes, I have another question', 'No, that's all for now']
      };
    } else if (normalizedMessage.includes('help')) {
      response = {
        text: "I can help with information about our products, services, business hours, shipping, returns, or scheduling an appointment. What would you like to know?",
        confidence: 0.9,
        intent: 'help',
        suggestedActions: ['Tell me about your products', 'What are your business hours?', 'I need help with a return']
      };
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return response;
  }
};

// Main test function
async function testChatbot() {
  console.log('=== AI Customer Service Assistant Test ===');
  console.log('This script tests the core functionality of the chatbot.');
  console.log('Type "exit" to quit the test.\n');
  
  // Create a test conversation
  const businessId = 'business-1';
  const conversationId = 'test-conversation-' + Date.now();
  
  // Generate welcome message
  const welcomeMessage = await mockAIService.generateWelcomeMessage(businessId);
  console.log('Bot: ' + welcomeMessage);
  
  // Main conversation loop
  let running = true;
  let context = {
    conversationId,
    businessId,
    recentMessages: [],
    identifiedIntents: []
  };
  
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
      const response = await mockAIService.processMessage(
        businessId,
        conversationId,
        userMessage,
        context
      );
      
      // Update context
      context.recentMessages.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response.text }
      );
      
      // Keep only the last 10 messages
      if (context.recentMessages.length > 10) {
        context.recentMessages = context.recentMessages.slice(-10);
      }
      
      context.identifiedIntents.push(response.intent);
      
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

// Run the test
testChatbot().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
