/**
 * Test Data Generator
 * 
 * This module provides functions to generate test data for the AI Customer Service Assistant.
 */

// Import required modules
const fs = require('fs');
const path = require('path');

/**
 * Generate a random string of specified length
 * @param {number} length - Length of the string to generate
 * @returns {string} - Random string
 */
function generateRandomString(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate a random email address
 * @returns {string} - Random email address
 */
function generateRandomEmail() {
  const domains = ['example.com', 'test.com', 'acme.org', 'mail.co', 'domain.net'];
  const username = generateRandomString(8).toLowerCase();
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
}

/**
 * Generate a random date within a range
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Date} - Random date within the range
 */
function generateRandomDate(start = new Date(2020, 0, 1), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate a random number within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random number within the range
 */
function generateRandomNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random boolean with specified probability of being true
 * @param {number} probability - Probability of returning true (0-1)
 * @returns {boolean} - Random boolean
 */
function generateRandomBoolean(probability = 0.5) {
  return Math.random() < probability;
}

/**
 * Generate a random item from an array
 * @param {Array} array - Array to pick from
 * @returns {*} - Random item from the array
 */
function generateRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random user
 * @returns {Object} - Random user object
 */
function generateUser() {
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  
  const firstName = generateRandomItem(firstNames);
  const lastName = generateRandomItem(lastNames);
  
  return {
    id: generateRandomString(8),
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    createdAt: generateRandomDate().toISOString(),
    isActive: generateRandomBoolean(0.9)
  };
}

/**
 * Generate multiple random users
 * @param {number} count - Number of users to generate
 * @returns {Array} - Array of random user objects
 */
function generateUsers(count = 10) {
  return Array.from({ length: count }, () => generateUser());
}

/**
 * Generate a random conversation message
 * @param {string} role - Role of the message sender ('user' or 'assistant')
 * @returns {Object} - Random message object
 */
function generateMessage(role = 'user') {
  const userMessages = [
    'What are your business hours?',
    'Do you offer free shipping?',
    'How can I return an item?',
    'Do you have this in stock?',
    'Can I speak to a human?',
    'What is your refund policy?',
    'How long does shipping take?',
    'Do you ship internationally?',
    'What payment methods do you accept?',
    'Is there a warranty on this product?'
  ];
  
  const assistantMessages = [
    'Our business hours are Monday to Friday, 9am to 5pm.',
    'Yes, we offer free shipping on orders over $50.',
    'You can return items within 30 days of purchase with the original receipt.',
    'Let me check that for you. Could you provide the item number?',
    'I\'d be happy to connect you with a human agent. Please hold.',
    'Our refund policy allows returns within 30 days for a full refund.',
    'Standard shipping takes 3-5 business days.',
    'Yes, we ship to most countries. Shipping fees vary by location.',
    'We accept Visa, Mastercard, American Express, and PayPal.',
    'Yes, all our products come with a 1-year manufacturer warranty.'
  ];
  
  return {
    id: generateRandomString(10),
    role,
    content: role === 'user' ? generateRandomItem(userMessages) : generateRandomItem(assistantMessages),
    timestamp: generateRandomDate().toISOString()
  };
}

/**
 * Generate a random conversation
 * @param {number} messageCount - Number of messages in the conversation
 * @returns {Object} - Random conversation object
 */
function generateConversation(messageCount = 6) {
  const messages = [];
  let currentRole = 'user';
  
  for (let i = 0; i < messageCount; i++) {
    messages.push(generateMessage(currentRole));
    currentRole = currentRole === 'user' ? 'assistant' : 'user';
  }
  
  return {
    id: generateRandomString(10),
    userId: generateRandomString(8),
    startedAt: generateRandomDate().toISOString(),
    endedAt: messageCount > 0 ? new Date(new Date(messages[messages.length - 1].timestamp).getTime() + 60000).toISOString() : null,
    messages
  };
}

/**
 * Generate multiple random conversations
 * @param {number} count - Number of conversations to generate
 * @param {number} maxMessages - Maximum number of messages per conversation
 * @returns {Array} - Array of random conversation objects
 */
function generateConversations(count = 5, maxMessages = 10) {
  return Array.from({ length: count }, () => {
    const messageCount = generateRandomNumber(2, maxMessages);
    return generateConversation(messageCount);
  });
}

/**
 * Generate a random knowledge base entry
 * @returns {Object} - Random knowledge base entry
 */
function generateKnowledgeBaseEntry() {
  const questions = [
    'What are your business hours?',
    'Do you offer free shipping?',
    'What is your return policy?',
    'Do you have a loyalty program?',
    'How can I track my order?',
    'Do you ship internationally?',
    'What payment methods do you accept?',
    'Do you offer gift wrapping?',
    'How do I create an account?',
    'Can I change my order after it\'s placed?'
  ];
  
  const answers = [
    'Our business hours are Monday to Friday, 9am to 5pm, and Saturday from 10am to 2pm.',
    'Yes, we offer free standard shipping on all orders over $50. Orders under $50 have a flat shipping fee of $5.99.',
    'We accept returns within 30 days of purchase with original receipt. Items must be unused and in original packaging.',
    'Yes, our Rewards Club is free to join and gives you 1 point for every dollar spent. 100 points can be redeemed for a $5 discount.',
    'You can track your order by clicking the tracking link in your shipping confirmation email or by logging into your account.',
    'Yes, we ship to most countries. International shipping rates vary by location and order size.',
    'We accept Visa, Mastercard, American Express, PayPal, and Apple Pay.',
    'Yes, we offer gift wrapping for $5 per item. You can select this option during checkout.',
    'To create an account, click the "Sign Up" button in the top right corner of our website and follow the instructions.',
    'Orders can be modified within 1 hour of placement. Please contact customer service as soon as possible.'
  ];
  
  const categories = ['General', 'Shipping', 'Returns', 'Account', 'Payment', 'Products'];
  
  const questionIndex = generateRandomNumber(0, questions.length - 1);
  
  return {
    id: generateRandomString(8),
    question: questions[questionIndex],
    answer: answers[questionIndex],
    alternatives: [
      questions[questionIndex].replace('?', ''),
      questions[questionIndex].toLowerCase(),
      'Tell me about ' + questions[questionIndex].toLowerCase().replace('?', '')
    ],
    category: generateRandomItem(categories),
    createdAt: generateRandomDate().toISOString(),
    updatedAt: generateRandomDate().toISOString()
  };
}

/**
 * Generate multiple random knowledge base entries
 * @param {number} count - Number of entries to generate
 * @returns {Array} - Array of random knowledge base entries
 */
function generateKnowledgeBase(count = 10) {
  return Array.from({ length: count }, () => generateKnowledgeBaseEntry());
}

/**
 * Generate test data for a specific industry
 * @param {string} industry - Industry name
 * @returns {Object} - Industry-specific test data
 */
function generateIndustryData(industry = 'Retail') {
  const industries = {
    'Retail': {
      questions: [
        'What are your store hours?',
        'Do you offer free shipping?',
        'What is your return policy?',
        'Do you have a loyalty program?',
        'How can I track my order?'
      ],
      answers: [
        'Our store is open Monday to Friday from 9am to 8pm, Saturday from 10am to 6pm, and Sunday from 12pm to 5pm.',
        'Yes, we offer free standard shipping on all orders over $50. Orders under $50 have a flat shipping fee of $5.99.',
        'We accept returns within 30 days of purchase with original receipt. Items must be unused and in original packaging.',
        'Yes, our Rewards Club is free to join and gives you 1 point for every dollar spent. 100 points can be redeemed for a $5 discount.',
        'You can track your order by clicking the tracking link in your shipping confirmation email or by logging into your account.'
      ]
    },
    'Restaurant': {
      questions: [
        'Do you take reservations?',
        'Do you have vegetarian options?',
        'Do you deliver?',
        'Do you have outdoor seating?',
        'Are you open on holidays?'
      ],
      answers: [
        'Yes, we accept reservations up to 30 days in advance. You can book online through our website or by calling (555) 123-4567.',
        'Yes, we offer several vegetarian dishes on our menu. These items are marked with a (V) symbol.',
        'Yes, we offer delivery within a 5-mile radius of the restaurant. There is a $3 delivery fee, and the minimum order amount is $20.',
        'Yes, we have a patio with 10 tables available for outdoor dining, weather permitting. Outdoor seating is first-come, first-served.',
        'Our holiday hours vary. We are closed on Thanksgiving and Christmas Day. On other holidays, we may have reduced hours.'
      ]
    },
    'Healthcare': {
      questions: [
        'What insurance do you accept?',
        'How do I schedule an appointment?',
        'What are your office hours?',
        'Do you offer telehealth services?',
        'How do I refill a prescription?'
      ],
      answers: [
        'We accept most major insurance plans, including Aetna, Blue Cross Blue Shield, Cigna, and UnitedHealthcare. Please call our office to verify your specific plan.',
        'You can schedule an appointment by calling our office at (555) 987-6543 or by using our online booking system on our website.',
        'Our office is open Monday to Friday from 8am to 5pm. We offer extended hours on Tuesdays until 7pm.',
        'Yes, we offer telehealth services for certain types of appointments. Please call our office to determine if your visit is eligible for telehealth.',
        'You can request a prescription refill by calling our office, using our patient portal, or contacting your pharmacy directly.'
      ]
    }
  };
  
  const selectedIndustry = industries[industry] || industries['Retail'];
  
  const knowledgeBase = selectedIndustry.questions.map((question, index) => {
    return {
      id: generateRandomString(8),
      question,
      answer: selectedIndustry.answers[index],
      alternatives: [
        question.replace('?', ''),
        question.toLowerCase(),
        'Tell me about ' + question.toLowerCase().replace('?', '')
      ],
      category: 'General',
      createdAt: generateRandomDate().toISOString(),
      updatedAt: generateRandomDate().toISOString()
    };
  });
  
  return {
    industry,
    knowledgeBase
  };
}

/**
 * Generate test data for all supported industries
 * @returns {Object} - Test data for all industries
 */
function generateAllIndustryData() {
  return {
    Retail: generateIndustryData('Retail'),
    Restaurant: generateIndustryData('Restaurant'),
    Healthcare: generateIndustryData('Healthcare')
  };
}

/**
 * Generate test widget configuration
 * @returns {Object} - Test widget configuration
 */
function generateWidgetConfig() {
  const themes = ['light', 'dark', 'system'];
  const positions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
  const icons = ['chat', 'message', 'help', 'support'];
  
  return {
    theme: generateRandomItem(themes),
    primaryColor: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
    secondaryColor: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: generateRandomItem(['12px', '14px', '16px']),
    borderRadius: generateRandomItem(['4px', '8px', '10px', '12px']),
    position: generateRandomItem(positions),
    buttonText: generateRandomItem(['Chat with us', 'Need help?', 'Support', 'Ask us']),
    buttonIcon: generateRandomItem(icons),
    headerText: 'Customer Support',
    placeholderText: 'Type your message...',
    welcomeMessage: 'Hello! How can I help you today?',
    offlineMessage: 'We\'re currently offline. Please leave a message and we\'ll get back to you soon.',
    showAvatar: generateRandomBoolean(0.7),
    showTimestamp: generateRandomBoolean(0.8),
    showTypingIndicator: generateRandomBoolean(0.9),
    enableEmoji: generateRandomBoolean(0.6),
    enableAttachments: generateRandomBoolean(0.5),
    enableHistory: generateRandomBoolean(0.8)
  };
}

/**
 * Generate test performance metrics
 * @returns {Object} - Test performance metrics
 */
function generatePerformanceMetrics() {
  return {
    widgetLoadTime: generateRandomNumber(500, 1200),
    chatOpenTime: generateRandomNumber(150, 400),
    initialResponseTime: generateRandomNumber(700, 1500),
    averageResponseTime: generateRandomNumber(1200, 2500),
    p95ResponseTime: generateRandomNumber(2000, 4000),
    concurrentUsers: generateRandomNumber(800, 1500),
    memoryUsage: generateRandomNumber(30, 60),
    cpuUsage: generateRandomNumber(8, 20),
    networkRequests: generateRandomNumber(5, 25),
    totalBundleSize: generateRandomNumber(300, 700)
  };
}

/**
 * Generate test AI response quality metrics
 * @returns {Object} - Test AI response quality metrics
 */
function generateAIQualityMetrics() {
  return {
    responseAccuracy: generateRandomNumber(85, 98),
    contextMaintenance: generateRandomNumber(80, 95),
    fallbackRate: generateRandomNumber(5, 15),
    humanHandoffRate: generateRandomNumber(8, 20),
    customerSatisfaction: generateRandomNumber(35, 50) / 10, // 3.5 - 5.0
    firstResponseResolution: generateRandomNumber(70, 90)
  };
}

/**
 * Generate test accessibility metrics
 * @returns {Object} - Test accessibility metrics
 */
function generateAccessibilityMetrics() {
  return {
    aLevel: {
      issues: generateRandomNumber(0, 3),
      status: generateRandomNumber(0, 3) === 0 ? 'PASS' : 'FAIL'
    },
    aaLevel: {
      issues: generateRandomNumber(0, 5),
      status: generateRandomNumber(0, 5) <= 2 ? 'PASS' : 'FAIL'
    },
    aaaLevel: {
      issues: generateRandomNumber(2, 8),
      status: generateRandomNumber(0, 8) <= 4 ? 'PASS' : 'FAIL'
    }
  };
}

/**
 * Generate test security metrics
 * @returns {Object} - Test security metrics
 */
function generateSecurityMetrics() {
  return {
    critical: generateRandomNumber(0, 1),
    high: generateRandomNumber(0, 3),
    medium: generateRandomNumber(1, 5),
    low: generateRandomNumber(3, 10)
  };
}

/**
 * Generate complete test data set
 * @returns {Object} - Complete test data set
 */
function generateCompleteTestData() {
  return {
    users: generateUsers(5),
    conversations: generateConversations(3),
    knowledgeBase: generateKnowledgeBase(10),
    industryData: generateAllIndustryData(),
    widgetConfig: generateWidgetConfig(),
    performanceMetrics: generatePerformanceMetrics(),
    aiQualityMetrics: generateAIQualityMetrics(),
    accessibilityMetrics: generateAccessibilityMetrics(),
    securityMetrics: generateSecurityMetrics()
  };
}

/**
 * Save test data to a file
 * @param {Object} data - Data to save
 * @param {string} filePath - Path to save the file
 */
function saveTestData(data, filePath) {
  const dirPath = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Write data to file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Test data saved to ${filePath}`);
}

// Export functions
module.exports = {
  generateRandomString,
  generateRandomEmail,
  generateRandomDate,
  generateRandomNumber,
  generateRandomBoolean,
  generateRandomItem,
  generateUser,
  generateUsers,
  generateMessage,
  generateConversation,
  generateConversations,
  generateKnowledgeBaseEntry,
  generateKnowledgeBase,
  generateIndustryData,
  generateAllIndustryData,
  generateWidgetConfig,
  generatePerformanceMetrics,
  generateAIQualityMetrics,
  generateAccessibilityMetrics,
  generateSecurityMetrics,
  generateCompleteTestData,
  saveTestData
};
