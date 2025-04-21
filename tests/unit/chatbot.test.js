/**
 * Unit Tests for AI Customer Service Assistant
 * 
 * These tests verify the core functionality of the chatbot.js module.
 */

// Mock DOM elements
document.body.innerHTML = `
  <div id="chatMessages"></div>
  <textarea id="messageInput"></textarea>
  <button id="sendButton"></button>
  <select id="themeSelect"></select>
  <input type="color" id="primaryColor" value="#0071e3">
  <span id="primaryColorValue">#0071e3</span>
  <select id="fontSelect"></select>
  <button id="applyButton"></button>
`;

// Import the module to test
const originalModule = require('../../chatbot.js');

// Mock functions
const mockScrollToBottom = jest.fn();
global.scrollToBottom = mockScrollToBottom;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('Chatbot Core Functionality', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Reset DOM
    document.getElementById('chatMessages').innerHTML = '';
    document.getElementById('messageInput').value = '';
  });
  
  test('initChatbot initializes all required elements', () => {
    // Call the function to test
    initChatbot();
    
    // Verify DOM elements are initialized
    expect(chatMessages).toBeDefined();
    expect(messageInput).toBeDefined();
    expect(sendButton).toBeDefined();
    expect(themeSelect).toBeDefined();
    expect(primaryColor).toBeDefined();
    expect(primaryColorValue).toBeDefined();
    expect(fontSelect).toBeDefined();
    expect(applyButton).toBeDefined();
    
    // Verify mock data is initialized
    expect(businessId).toBeDefined();
    expect(visitorId).toBeDefined();
    expect(conversationId).toBeDefined();
    
    // Verify context is initialized
    expect(context).toBeDefined();
    expect(context.conversationId).toBe(conversationId);
    expect(context.businessId).toBe(businessId);
    expect(context.recentMessages).toEqual([]);
    expect(context.identifiedIntents).toEqual([]);
    
    // Verify business info is initialized
    expect(businessInfo).toBeDefined();
    expect(businessInfo.name).toBe('Acme Corporation');
    
    // Verify knowledge base is initialized
    expect(knowledgeBase).toBeDefined();
    expect(knowledgeBase.length).toBeGreaterThan(0);
  });
  
  test('sendMessage adds user message to chat', () => {
    // Setup
    initChatbot();
    document.getElementById('messageInput').value = 'Hello, world!';
    
    // Mock the showTypingIndicator and processMessage functions
    const originalShowTypingIndicator = showTypingIndicator;
    const originalProcessMessage = processMessage;
    global.showTypingIndicator = jest.fn();
    global.processMessage = jest.fn();
    
    // Call the function to test
    sendMessage();
    
    // Verify message was added to chat
    const messageElements = document.querySelectorAll('.user-message');
    expect(messageElements.length).toBe(1);
    expect(messageElements[0].querySelector('.message-content p').textContent).toBe('Hello, world!');
    
    // Verify input was cleared
    expect(document.getElementById('messageInput').value).toBe('');
    
    // Verify context was updated
    expect(context.recentMessages.length).toBe(1);
    expect(context.recentMessages[0].role).toBe('user');
    expect(context.recentMessages[0].content).toBe('Hello, world!');
    
    // Verify typing indicator was shown
    expect(showTypingIndicator).toHaveBeenCalled();
    
    // Verify processMessage was called
    setTimeout(() => {
      expect(processMessage).toHaveBeenCalledWith('Hello, world!');
    }, 2000);
    
    // Restore original functions
    global.showTypingIndicator = originalShowTypingIndicator;
    global.processMessage = originalProcessMessage;
  });
  
  test('processMessage generates appropriate response', () => {
    // Setup
    initChatbot();
    
    // Mock the hideTypingIndicator and addBotMessage functions
    const originalHideTypingIndicator = hideTypingIndicator;
    const originalAddBotMessage = addBotMessage;
    global.hideTypingIndicator = jest.fn();
    global.addBotMessage = jest.fn();
    
    // Call the function to test with a message about business hours
    processMessage('What are your hours?');
    
    // Verify typing indicator was hidden
    expect(hideTypingIndicator).toHaveBeenCalled();
    
    // Verify bot message was added with correct intent
    expect(addBotMessage).toHaveBeenCalled();
    const response = addBotMessage.mock.calls[0][0];
    expect(response.intent).toBe('business_hours');
    
    // Verify context was updated
    expect(context.recentMessages.length).toBe(1);
    expect(context.recentMessages[0].role).toBe('assistant');
    expect(context.identifiedIntents).toContain('business_hours');
    
    // Restore original functions
    global.hideTypingIndicator = originalHideTypingIndicator;
    global.addBotMessage = originalAddBotMessage;
  });
  
  test('findInKnowledgeBase returns matching entry', () => {
    // Setup
    initChatbot();
    
    // Add a test entry to the knowledge base
    knowledgeBase.push({
      id: 'test-kb',
      question: 'What is the meaning of life?',
      answer: 'The meaning of life is 42.',
      category: 'Philosophy'
    });
    
    // Call the function to test
    const result = findInKnowledgeBase('tell me about the meaning of life');
    
    // Verify result
    expect(result).toBeDefined();
    expect(result.id).toBe('test-kb');
    expect(result.answer).toBe('The meaning of life is 42.');
  });
  
  test('addUserMessage formats message correctly', () => {
    // Setup
    initChatbot();
    
    // Call the function to test
    addUserMessage('Hello with a link: https://example.com');
    
    // Verify message was added to chat
    const messageElements = document.querySelectorAll('.user-message');
    expect(messageElements.length).toBe(1);
    
    // Verify message content
    const messageContent = messageElements[0].querySelector('.message-content p').innerHTML;
    expect(messageContent).toContain('<a href="https://example.com"');
    
    // Verify scrollToBottom was called
    expect(mockScrollToBottom).toHaveBeenCalled();
  });
  
  test('addBotMessage adds suggested actions', () => {
    // Setup
    initChatbot();
    
    // Call the function to test
    addBotMessage({
      text: 'How can I help you?',
      confidence: 1.0,
      intent: 'greeting',
      suggestedActions: [
        'Business hours',
        'Contact information'
      ]
    });
    
    // Verify message was added to chat
    const messageElements = document.querySelectorAll('.bot-message');
    expect(messageElements.length).toBe(1);
    
    // Verify suggested actions
    const suggestedActions = document.querySelectorAll('.suggested-action');
    expect(suggestedActions.length).toBe(2);
    expect(suggestedActions[0].textContent).toBe('Business hours');
    expect(suggestedActions[1].textContent).toBe('Contact information');
    
    // Verify scrollToBottom was called
    expect(mockScrollToBottom).toHaveBeenCalled();
  });
  
  test('formatMessage converts URLs to links', () => {
    // Setup
    initChatbot();
    
    // Call the function to test
    const result = formatMessage('Check out https://example.com and http://test.org');
    
    // Verify result
    expect(result).toContain('<a href="https://example.com"');
    expect(result).toContain('<a href="http://test.org"');
  });
  
  test('formatMessage converts line breaks to <br>', () => {
    // Setup
    initChatbot();
    
    // Call the function to test
    const result = formatMessage('Line 1\nLine 2\nLine 3');
    
    // Verify result
    expect(result).toBe('Line 1<br>Line 2<br>Line 3');
  });
  
  test('showTypingIndicator adds typing indicator', () => {
    // Setup
    initChatbot();
    
    // Call the function to test
    showTypingIndicator();
    
    // Verify typing indicator was added
    const indicator = document.querySelector('.typing-indicator');
    expect(indicator).not.toBeNull();
    
    // Verify scrollToBottom was called
    expect(mockScrollToBottom).toHaveBeenCalled();
  });
  
  test('hideTypingIndicator removes typing indicator', () => {
    // Setup
    initChatbot();
    showTypingIndicator();
    
    // Call the function to test
    hideTypingIndicator();
    
    // Verify typing indicator was removed
    const indicator = document.querySelector('.typing-indicator');
    expect(indicator).toBeNull();
  });
  
  test('applyThemeChanges updates theme settings', () => {
    // Setup
    initChatbot();
    document.getElementById('themeSelect').value = 'dark';
    document.getElementById('primaryColor').value = '#ff0000';
    document.getElementById('fontSelect').value = 'Arial, sans-serif';
    
    // Mock document.body.appendChild for toast
    const originalAppendChild = document.body.appendChild;
    document.body.appendChild = jest.fn();
    
    // Call the function to test
    applyThemeChanges();
    
    // Verify localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith('chatbot-theme', 'dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('chatbot-color', '#ff0000');
    expect(localStorage.setItem).toHaveBeenCalledWith('chatbot-font', 'Arial, sans-serif');
    
    // Verify CSS variables were updated
    expect(document.documentElement.style.getPropertyValue('--primary-color')).toBe('#ff0000');
    expect(document.documentElement.style.getPropertyValue('--font-family')).toBe('Arial, sans-serif');
    
    // Verify body class was updated
    expect(document.body.className).toBe('dark');
    
    // Verify toast was shown
    expect(document.body.appendChild).toHaveBeenCalled();
    
    // Restore original function
    document.body.appendChild = originalAppendChild;
  });
  
  test('Knowledge base CRUD operations', () => {
    // Setup
    initChatbot();
    const initialLength = knowledgeBase.length;
    
    // Test addFAQ
    const newFAQ = {
      question: 'What is the capital of France?',
      answer: 'The capital of France is Paris.',
      category: 'Geography'
    };
    
    const addedFAQ = addFAQ(newFAQ);
    expect(knowledgeBase.length).toBe(initialLength + 1);
    expect(addedFAQ.id).toBeDefined();
    expect(addedFAQ.question).toBe('What is the capital of France?');
    
    // Test updateFAQ
    const updatedFAQ = {
      question: 'What is the capital of France?',
      answer: 'The capital of France is Paris, also known as the City of Light.',
      category: 'Geography'
    };
    
    const result = updateFAQ(addedFAQ.id, updatedFAQ);
    expect(result).not.toBeNull();
    expect(result.answer).toBe('The capital of France is Paris, also known as the City of Light.');
    
    // Test getFAQById
    const retrievedFAQ = getFAQById(addedFAQ.id);
    expect(retrievedFAQ).not.toBeNull();
    expect(retrievedFAQ.id).toBe(addedFAQ.id);
    
    // Test searchFAQs
    const searchResults = searchFAQs('capital');
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.some(faq => faq.id === addedFAQ.id)).toBe(true);
    
    // Test deleteFAQ
    const deletedFAQ = deleteFAQ(addedFAQ.id);
    expect(deletedFAQ).not.toBeNull();
    expect(deletedFAQ.id).toBe(addedFAQ.id);
    expect(knowledgeBase.length).toBe(initialLength);
    
    // Verify FAQ was deleted
    const shouldBeNull = getFAQById(addedFAQ.id);
    expect(shouldBeNull).toBeNull();
  });
});
