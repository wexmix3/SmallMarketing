/**
 * Mock Data
 * 
 * This file provides mock data for testing the AI Customer Service Assistant.
 */

// Mock Knowledge Base
export const mockKnowledgeBase = {
  id: 'mock-kb-id',
  businessId: 'mock-business-id',
  businessInfo: {
    id: 'mock-business-id',
    name: 'Mock Business',
    industry: 'Technology',
    description: 'A mock business for testing purposes',
    hours: [
      { day: 'monday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'tuesday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'wednesday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'thursday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'friday', open: '09:00', close: '17:00', isClosed: false },
      { day: 'saturday', open: '10:00', close: '15:00', isClosed: false },
      { day: 'sunday', open: '00:00', close: '00:00', isClosed: true }
    ],
    contact: {
      email: 'info@mockbusiness.com',
      phone: '123-456-7890',
      address: {
        street: '123 Mock St',
        city: 'Mockville',
        state: 'MK',
        zipCode: '12345',
        country: 'USA'
      },
      website: 'https://mockbusiness.com',
      socialMedia: {
        facebook: 'https://facebook.com/mockbusiness',
        twitter: 'https://twitter.com/mockbusiness',
        instagram: 'https://instagram.com/mockbusiness'
      }
    },
    logo: 'https://mockbusiness.com/logo.png',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  faqs: [
    {
      id: 'faq-1',
      question: 'What are your business hours?',
      answer: 'We are open Monday through Friday from 9 AM to 5 PM, Saturday from 10 AM to 3 PM, and closed on Sunday.',
      category: 'General',
      tags: ['hours', 'schedule'],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    },
    {
      id: 'faq-2',
      question: 'Do you offer free shipping?',
      answer: 'Yes, we offer free shipping on all orders over $50 within the continental United States.',
      category: 'Shipping',
      tags: ['shipping', 'delivery'],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    },
    {
      id: 'faq-3',
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase. Items must be in original condition with tags attached.',
      category: 'Returns',
      tags: ['returns', 'refunds'],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }
  ],
  products: [
    {
      id: 'product-1',
      name: 'Mock Product 1',
      description: 'This is a mock product for testing purposes.',
      price: 29.99,
      currency: 'USD',
      imageUrl: 'https://mockbusiness.com/product1.jpg',
      category: 'Electronics',
      tags: ['gadget', 'tech'],
      inStock: true,
      attributes: {
        color: 'Black',
        weight: '200g',
        dimensions: '10 x 5 x 2 cm'
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    },
    {
      id: 'product-2',
      name: 'Mock Product 2',
      description: 'Another mock product for testing purposes.',
      price: 49.99,
      currency: 'USD',
      imageUrl: 'https://mockbusiness.com/product2.jpg',
      category: 'Electronics',
      tags: ['gadget', 'tech', 'premium'],
      inStock: true,
      attributes: {
        color: 'Silver',
        weight: '300g',
        dimensions: '12 x 6 x 2 cm'
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }
  ],
  services: [
    {
      id: 'service-1',
      name: 'Mock Service 1',
      description: 'This is a mock service for testing purposes.',
      price: 99.99,
      currency: 'USD',
      duration: 60,
      imageUrl: 'https://mockbusiness.com/service1.jpg',
      category: 'Consultation',
      tags: ['consultation', 'expert'],
      availability: [
        { day: 'monday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'tuesday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'wednesday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'thursday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'friday', open: '09:00', close: '17:00', isClosed: false }
      ],
      attributes: {
        location: 'Online',
        prerequisites: 'None'
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }
  ],
  customEntities: [],
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
};

// Mock Chatbot Config
export const mockChatbotConfig = {
  id: 'mock-config-id',
  businessId: 'mock-business-id',
  name: 'Mock Chatbot',
  welcomeMessage: 'Welcome to Mock Business! How can I help you today?',
  appearance: {
    theme: 'light',
    primaryColor: '#0070f3',
    fontFamily: 'Arial, sans-serif',
    logoUrl: 'https://mockbusiness.com/logo.png',
    position: 'right',
    width: 350,
    height: 500
  },
  behaviors: {
    autoShowDelay: 5,
    collectEmail: true,
    collectName: true,
    requireContactInfo: false,
    showTypingIndicator: true,
    enableFileUploads: true,
    maxAttachmentSize: 5 * 1024 * 1024 // 5MB
  },
  integrations: {
    calendarType: 'google',
    calendarId: 'primary',
    crmType: 'hubspot',
    crmId: 'default',
    emailMarketing: true,
    emailMarketingProvider: 'mailchimp'
  },
  aiSettings: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 150,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0
  },
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
};

// Mock Conversation
export const mockConversation = {
  id: 'mock-conversation-id',
  businessId: 'mock-business-id',
  status: 'active',
  source: 'website',
  visitorId: 'mock-visitor-id',
  visitorName: 'Mock Visitor',
  visitorEmail: 'visitor@example.com',
  startTime: new Date('2025-01-01T10:00:00Z'),
  endTime: null,
  messages: [
    {
      id: 'message-1',
      conversationId: 'mock-conversation-id',
      content: 'Hello, I have a question about your products.',
      sender: 'user',
      timestamp: new Date('2025-01-01T10:00:00Z'),
      isRead: true,
      metadata: {},
      intent: 'general_inquiry',
      confidence: 0.8
    },
    {
      id: 'message-2',
      conversationId: 'mock-conversation-id',
      content: 'Hi there! I\'d be happy to help with your product questions. What would you like to know?',
      sender: 'assistant',
      timestamp: new Date('2025-01-01T10:00:05Z'),
      isRead: true,
      metadata: {
        source: 'ai',
        model: 'gpt-3.5-turbo'
      }
    }
  ],
  tags: ['product-inquiry'],
  metadata: {
    browser: 'Chrome',
    os: 'Windows',
    device: 'Desktop',
    referrer: 'https://mockbusiness.com/products'
  },
  createdAt: new Date('2025-01-01T10:00:00Z'),
  updatedAt: new Date('2025-01-01T10:00:05Z')
};
