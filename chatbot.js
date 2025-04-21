/**
 * AI Customer Service Assistant
 * Chatbot Functionality
 */

// DOM Elements
let chatMessages;
let messageInput;
let sendButton;
let themeSelect;
let primaryColor;
let primaryColorValue;
let fontSelect;
let applyButton;
let messagesContainer;

// Mock data
let businessId;
let visitorId;
let conversationId;

// Conversation context
let context;

// Business information
let businessInfo;

// Knowledge base
let knowledgeBase;

/**
 * Initialize the chatbot
 */
function initChatbot() {
  console.log('Initializing chatbot...');
  
  // Get DOM elements
  chatMessages = document.getElementById('chatMessages');
  messageInput = document.getElementById('messageInput');
  sendButton = document.getElementById('sendButton');
  themeSelect = document.getElementById('themeSelect');
  primaryColor = document.getElementById('primaryColor');
  primaryColorValue = document.getElementById('primaryColorValue');
  fontSelect = document.getElementById('fontSelect');
  applyButton = document.getElementById('applyButton');
  messagesContainer = document.querySelector('.chat-messages');
  
  // Initialize mock data
  businessId = 'business-1';
  visitorId = 'visitor-' + Date.now();
  conversationId = 'conv-' + Date.now();
  
  // Initialize conversation context
  context = {
    conversationId,
    businessId,
    recentMessages: [],
    identifiedIntents: []
  };
  
  // Initialize business information
  businessInfo = {
    name: 'Acme Corporation',
    industry: 'Retail',
    description: 'We provide high-quality products and services for all your needs.',
    website: 'https://www.acmecorp.com',
    phone: '(555) 123-4567',
    email: 'support@acmecorp.com',
    address: '123 Main St, Anytown, USA',
    hours: [
      { day: 'monday', open: '9:00 AM', close: '5:00 PM', isClosed: false },
      { day: 'tuesday', open: '9:00 AM', close: '5:00 PM', isClosed: false },
      { day: 'wednesday', open: '9:00 AM', close: '5:00 PM', isClosed: false },
      { day: 'thursday', open: '9:00 AM', close: '5:00 PM', isClosed: false },
      { day: 'friday', open: '9:00 AM', close: '5:00 PM', isClosed: false },
      { day: 'saturday', open: '10:00 AM', close: '3:00 PM', isClosed: false },
      { day: 'sunday', open: '', close: '', isClosed: true }
    ]
  };
  
  // Initialize knowledge base
  knowledgeBase = [
    {
      id: 'kb-1',
      question: 'What are your business hours?',
      answer: 'Our business hours are Monday to Friday from 9:00 AM to 5:00 PM, Saturday from 10:00 AM to 3:00 PM, and we are closed on Sunday.',
      category: 'General'
    },
    {
      id: 'kb-2',
      question: 'How can I return a product?',
      answer: 'You can return a product within 30 days of purchase with the original receipt. Please bring the item to our store or contact our customer service for a return shipping label.',
      category: 'Returns'
    },
    {
      id: 'kb-3',
      question: 'Do you offer free shipping?',
      answer: 'Yes, we offer free shipping on all orders over $50. For orders under $50, shipping costs $5.99.',
      category: 'Shipping'
    },
    {
      id: 'kb-4',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay.',
      category: 'Payment'
    },
    {
      id: 'kb-5',
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account on our website or by using the tracking number provided in your shipping confirmation email.',
      category: 'Orders'
    }
  ];
  
  // Add event listeners
  initEventListeners();
  
  // Show welcome message
  showWelcomeMessage();
  
  console.log('Chatbot initialized');
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
  // Send message on button click
  sendButton.addEventListener('click', sendMessage);
  
  // Send message on Enter key
  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Update color value display
  primaryColor.addEventListener('input', function() {
    primaryColorValue.textContent = primaryColor.value;
    document.documentElement.style.setProperty('--primary-color', primaryColor.value);
  });
  
  // Apply theme changes
  applyButton.addEventListener('click', applyThemeChanges);
  
  // Handle scroll indicator
  messagesContainer.addEventListener('scroll', updateScrollIndicator);
  
  // Update when messages change
  const observer = new MutationObserver(updateScrollIndicator);
  observer.observe(messagesContainer, { childList: true, subtree: true });
  
  // Initial update
  updateScrollIndicator();
}

/**
 * Show welcome message
 */
function showWelcomeMessage() {
  const welcomeMessage = {
    text: `Hello! Welcome to ${businessInfo.name}. How can I assist you today?`,
    confidence: 1.0,
    intent: 'welcome',
    suggestedActions: [
      'What are your business hours?',
      'How do I return a product?',
      'Do you offer free shipping?',
      'What payment methods do you accept?'
    ]
  };
  
  addBotMessage(welcomeMessage);
}

/**
 * Send a message
 */
function sendMessage() {
  const message = messageInput.value.trim();
  
  if (message) {
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    messageInput.value = '';
    
    // Add to context
    context.recentMessages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message (mock implementation)
    setTimeout(() => {
      processMessage(message);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }
}

/**
 * Process message function (mock implementation)
 * @param {string} message - The user's message
 */
function processMessage(message) {
  // Hide typing indicator
  hideTypingIndicator();
  
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
    const hoursText = businessInfo.hours.map(h => {
      if (h.isClosed) return `${h.day.charAt(0).toUpperCase() + h.day.slice(1)}: Closed`;
      return `${h.day.charAt(0).toUpperCase() + h.day.slice(1)}: ${h.open} - ${h.close}`;
    }).join('\n');
    
    response = {
      text: `Our business hours are:\n${hoursText}`,
      confidence: 0.95,
      intent: 'business_hours',
      suggestedActions: [
        'What is your address?',
        'How can I contact you?',
        'Do you have parking?'
      ]
    };
  } else if (normalizedMessage.includes('return') || normalizedMessage.includes('refund')) {
    response = {
      text: 'You can return a product within 30 days of purchase with the original receipt. Please bring the item to our store or contact our customer service for a return shipping label.',
      confidence: 0.9,
      intent: 'returns',
      suggestedActions: [
        'What is your return policy?',
        'How do I get a shipping label?',
        'Can I return without a receipt?'
      ]
    };
  } else if (normalizedMessage.includes('shipping') || normalizedMessage.includes('delivery')) {
    response = {
      text: 'We offer free shipping on all orders over $50. For orders under $50, shipping costs $5.99. Most orders are delivered within 3-5 business days.',
      confidence: 0.9,
      intent: 'shipping',
      suggestedActions: [
        'How do I track my order?',
        'Do you ship internationally?',
        'What are the shipping options?'
      ]
    };
  } else if (normalizedMessage.includes('payment') || normalizedMessage.includes('pay')) {
    response = {
      text: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay.',
      confidence: 0.9,
      intent: 'payment',
      suggestedActions: [
        'Do you offer financing?',
        'Can I pay in installments?',
        'Is there a discount for cash payment?'
      ]
    };
  } else if (normalizedMessage.includes('track') || normalizedMessage.includes('order status')) {
    response = {
      text: 'You can track your order by logging into your account on our website or by using the tracking number provided in your shipping confirmation email.',
      confidence: 0.9,
      intent: 'order_tracking',
      suggestedActions: [
        'I lost my tracking number',
        'My order is delayed',
        'I want to change my shipping address'
      ]
    };
  } else if (normalizedMessage.includes('contact') || normalizedMessage.includes('phone') || normalizedMessage.includes('email')) {
    response = {
      text: `You can contact us by phone at ${businessInfo.phone}, by email at ${businessInfo.email}, or by visiting our store at ${businessInfo.address}.`,
      confidence: 0.9,
      intent: 'contact',
      suggestedActions: [
        'What are your business hours?',
        'Do you have a customer service chat?',
        'Can I schedule a call?'
      ]
    };
  } else if (normalizedMessage.includes('product') || normalizedMessage.includes('item')) {
    response = {
      text: 'We offer a wide range of high-quality products. Could you specify which product category you are interested in?',
      confidence: 0.8,
      intent: 'products',
      suggestedActions: [
        'Electronics',
        'Clothing',
        'Home goods',
        'Outdoor equipment'
      ]
    };
  } else if (normalizedMessage.includes('thank')) {
    response = {
      text: "You're welcome! Is there anything else I can help you with?",
      confidence: 0.95,
      intent: 'thanks',
      suggestedActions: [
        'Yes, I have another question',
        'No, that\'s all for now'
      ]
    };
  } else if (normalizedMessage.includes('bye') || normalizedMessage.includes('goodbye')) {
    response = {
      text: "Thank you for chatting with us today! If you have any more questions, feel free to come back anytime.",
      confidence: 0.95,
      intent: 'goodbye',
      suggestedActions: []
    };
  } else {
    // Check knowledge base for similar questions
    const matchedKnowledge = findInKnowledgeBase(normalizedMessage);
    if (matchedKnowledge) {
      response = {
        text: matchedKnowledge.answer,
        confidence: 0.85,
        intent: 'knowledge_base',
        suggestedActions: [
          'Tell me more about this',
          'I need additional information',
          'This doesn\'t answer my question'
        ]
      };
    }
  }
  
  // Add to context
  context.recentMessages.push({
    role: 'assistant',
    content: response.text,
    timestamp: new Date().toISOString()
  });
  
  if (response.intent) {
    context.identifiedIntents.push(response.intent);
  }
  
  // Add bot message to chat
  addBotMessage(response);
}

/**
 * Find a matching answer in the knowledge base
 * @param {string} query - The user's query
 * @returns {Object|null} - The matching knowledge base entry or null
 */
function findInKnowledgeBase(query) {
  // Simple keyword matching (in a real app, this would use more sophisticated NLP)
  for (const entry of knowledgeBase) {
    const keywords = entry.question.toLowerCase().split(' ');
    const queryWords = query.split(' ');
    
    // Count matching words
    const matchCount = keywords.filter(word => queryWords.includes(word)).length;
    const matchRatio = matchCount / keywords.length;
    
    // If more than 30% of words match, return this entry
    if (matchRatio > 0.3) {
      return entry;
    }
  }
  
  return null;
}

/**
 * Add a user message to the chat
 * @param {string} message - The user's message
 */
function addUserMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'message user-message';
  messageElement.innerHTML = `
    <div class="message-content">
      <p>${formatMessage(message)}</p>
    </div>
    <div class="message-time">${formatTime(new Date())}</div>
  `;
  
  chatMessages.appendChild(messageElement);
  scrollToBottom();
}

/**
 * Add a bot message to the chat
 * @param {Object} response - The bot's response
 */
function addBotMessage(response) {
  const messageElement = document.createElement('div');
  messageElement.className = 'message bot-message';
  
  let suggestedActionsHTML = '';
  if (response.suggestedActions && response.suggestedActions.length > 0) {
    suggestedActionsHTML = `
      <div class="suggested-actions">
        ${response.suggestedActions.map(action => `
          <button class="suggested-action" onclick="handleSuggestedAction(this)">${action}</button>
        `).join('')}
      </div>
    `;
  }
  
  messageElement.innerHTML = `
    <div class="message-avatar">
      <div class="avatar-icon">
        <i class="fas fa-robot"></i>
      </div>
    </div>
    <div class="message-content">
      <p>${formatMessage(response.text)}</p>
      ${suggestedActionsHTML}
    </div>
    <div class="message-time">${formatTime(new Date())}</div>
  `;
  
  chatMessages.appendChild(messageElement);
  scrollToBottom();
}

/**
 * Handle a suggested action click
 * @param {HTMLElement} button - The clicked button
 */
function handleSuggestedAction(button) {
  const action = button.textContent;
  messageInput.value = action;
  sendMessage();
}

/**
 * Show the typing indicator
 */
function showTypingIndicator() {
  // Remove existing indicator if any
  hideTypingIndicator();
  
  const indicatorElement = document.createElement('div');
  indicatorElement.className = 'message bot-message typing-indicator';
  indicatorElement.innerHTML = `
    <div class="message-avatar">
      <div class="avatar-icon">
        <i class="fas fa-robot"></i>
      </div>
    </div>
    <div class="message-content">
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(indicatorElement);
  scrollToBottom();
}

/**
 * Hide the typing indicator
 */
function hideTypingIndicator() {
  const indicator = document.querySelector('.typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

/**
 * Format a message with line breaks and links
 * @param {string} text - The message text
 * @returns {string} - The formatted message
 */
function formatMessage(text) {
  // Convert line breaks to <br>
  let formatted = text.replace(/\n/g, '<br>');
  
  // Convert URLs to links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  formatted = formatted.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
  
  return formatted;
}

/**
 * Format a time
 * @param {Date} date - The date to format
 * @returns {string} - The formatted time
 */
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Scroll to the bottom of the chat
 */
function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  updateScrollIndicator();
}

/**
 * Apply theme changes
 */
function applyThemeChanges() {
  const theme = themeSelect.value;
  const color = primaryColor.value;
  const font = fontSelect.value;
  
  // Apply theme
  document.body.className = theme;
  
  // Apply color
  document.documentElement.style.setProperty('--primary-color', color);
  
  // Apply font
  document.documentElement.style.setProperty('--font-family', font);
  
  // Save preferences (in a real app, this would be saved to a database)
  localStorage.setItem('chatbot-theme', theme);
  localStorage.setItem('chatbot-color', color);
  localStorage.setItem('chatbot-font', font);
  
  // Show confirmation
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = 'Theme settings applied!';
  document.body.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

/**
 * Update scroll indicator
 */
function updateScrollIndicator() {
  if (messagesContainer.scrollHeight > messagesContainer.clientHeight) {
    const isScrolledToBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 10;
    
    if (!isScrolledToBottom) {
      messagesContainer.classList.add('can-scroll');
    } else {
      messagesContainer.classList.remove('can-scroll');
    }
  } else {
    messagesContainer.classList.remove('can-scroll');
  }
}

/**
 * Add a new FAQ to the knowledge base
 * @param {Object} faq - The FAQ to add
 */
function addFAQ(faq) {
  // Generate ID
  faq.id = 'kb-' + (knowledgeBase.length + 1);
  
  // Add to knowledge base
  knowledgeBase.push(faq);
  
  // In a real app, this would be saved to a database
  console.log('Added FAQ:', faq);
  
  return faq;
}

/**
 * Update an existing FAQ in the knowledge base
 * @param {string} id - The ID of the FAQ to update
 * @param {Object} updatedFAQ - The updated FAQ
 */
function updateFAQ(id, updatedFAQ) {
  // Find the FAQ
  const index = knowledgeBase.findIndex(faq => faq.id === id);
  
  if (index !== -1) {
    // Update the FAQ
    knowledgeBase[index] = { ...knowledgeBase[index], ...updatedFAQ };
    
    // In a real app, this would be saved to a database
    console.log('Updated FAQ:', knowledgeBase[index]);
    
    return knowledgeBase[index];
  }
  
  return null;
}

/**
 * Delete an FAQ from the knowledge base
 * @param {string} id - The ID of the FAQ to delete
 */
function deleteFAQ(id) {
  // Find the FAQ
  const index = knowledgeBase.findIndex(faq => faq.id === id);
  
  if (index !== -1) {
    // Delete the FAQ
    const deletedFAQ = knowledgeBase.splice(index, 1)[0];
    
    // In a real app, this would be saved to a database
    console.log('Deleted FAQ:', deletedFAQ);
    
    return deletedFAQ;
  }
  
  return null;
}

/**
 * Get all FAQs in the knowledge base
 * @returns {Array} - The knowledge base
 */
function getAllFAQs() {
  return knowledgeBase;
}

/**
 * Get an FAQ by ID
 * @param {string} id - The ID of the FAQ to get
 * @returns {Object|null} - The FAQ or null if not found
 */
function getFAQById(id) {
  return knowledgeBase.find(faq => faq.id === id) || null;
}

/**
 * Search FAQs by query
 * @param {string} query - The search query
 * @returns {Array} - The matching FAQs
 */
function searchFAQs(query) {
  if (!query) return knowledgeBase;
  
  const normalizedQuery = query.toLowerCase();
  
  return knowledgeBase.filter(faq => {
    return faq.question.toLowerCase().includes(normalizedQuery) || 
           faq.answer.toLowerCase().includes(normalizedQuery) ||
           faq.category.toLowerCase().includes(normalizedQuery);
  });
}

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', initChatbot);
