/**
 * Jest Setup File for AI Customer Service Assistant
 * 
 * This file is run before each test file.
 */

// Mock browser APIs
global.scrollToBottom = jest.fn();
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

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

// Mock chatbot functions
global.initChatbot = jest.fn();
global.sendMessage = jest.fn();
global.processMessage = jest.fn();
global.addUserMessage = jest.fn();
global.addBotMessage = jest.fn();
global.showTypingIndicator = jest.fn();
global.hideTypingIndicator = jest.fn();
global.formatMessage = jest.fn();
global.scrollToBottom = jest.fn();
global.applyThemeChanges = jest.fn();
global.findInKnowledgeBase = jest.fn();
global.addFAQ = jest.fn();
global.updateFAQ = jest.fn();
global.deleteFAQ = jest.fn();
global.getFAQById = jest.fn();
global.searchFAQs = jest.fn();

// Mock data
global.businessId = 'test-business-id';
global.visitorId = 'test-visitor-id';
global.conversationId = 'test-conversation-id';
global.context = {
  conversationId: 'test-conversation-id',
  businessId: 'test-business-id',
  recentMessages: [],
  identifiedIntents: []
};
global.businessInfo = {
  name: 'Acme Corporation',
  description: 'A fictional company for testing',
  businessHours: {
    monday: { open: '9:00 AM', close: '5:00 PM', isClosed: false },
    tuesday: { open: '9:00 AM', close: '5:00 PM', isClosed: false },
    wednesday: { open: '9:00 AM', close: '5:00 PM', isClosed: false },
    thursday: { open: '9:00 AM', close: '5:00 PM', isClosed: false },
    friday: { open: '9:00 AM', close: '5:00 PM', isClosed: false },
    saturday: { open: '10:00 AM', close: '3:00 PM', isClosed: false },
    sunday: { open: '', close: '', isClosed: true }
  },
  contactInfo: {
    email: 'info@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA'
  }
};
global.knowledgeBase = [
  {
    id: 'kb-1',
    question: 'What are your business hours?',
    answer: 'Our business hours are Monday to Friday from 9:00 AM to 5:00 PM, Saturday from 10:00 AM to 3:00 PM, and we are closed on Sunday.',
    category: 'General',
    alternativeQuestions: [
      'When are you open?',
      'What time do you close?',
      'Are you open on weekends?'
    ]
  },
  {
    id: 'kb-2',
    question: 'How do I contact customer support?',
    answer: 'You can contact our customer support team by email at support@example.com or by phone at (555) 123-4567 during our business hours.',
    category: 'Support',
    alternativeQuestions: [
      'How do I get help?',
      'What is your support email?',
      'What is your phone number?'
    ]
  }
];

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
