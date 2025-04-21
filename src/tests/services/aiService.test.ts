/**
 * AI Service Tests
 * 
 * This file contains tests for the AI service.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processMessage, generateResponse } from '@/services/aiService';
import { mockKnowledgeBase, mockChatbotConfig } from '../mocks/mockData';

// Mock the dependencies
vi.mock('@/services/intentClassificationService', () => ({
  identifyIntent: vi.fn().mockResolvedValue({
    name: 'general_inquiry',
    confidence: 0.8
  }),
  extractEntities: vi.fn().mockResolvedValue({
    product: 'Mock Product 1'
  })
}));

vi.mock('@/services/embeddingService', () => ({
  generateEmbedding: vi.fn().mockResolvedValue(Array(1536).fill(0).map(() => Math.random() * 2 - 1)),
  calculateSimilarity: vi.fn().mockReturnValue(0.85),
  findSimilarTexts: vi.fn().mockResolvedValue([
    { text: 'Mock Product 1', similarity: 0.85 }
  ])
}));

vi.mock('@/services/enhancedKnowledgeBaseService', () => ({
  searchKnowledgeBase: vi.fn().mockResolvedValue({
    faqs: [
      {
        id: 'faq-1',
        question: 'What are your business hours?',
        answer: 'We are open Monday through Friday from 9 AM to 5 PM.',
        similarity: 0.85
      }
    ],
    products: [
      {
        id: 'product-1',
        name: 'Mock Product 1',
        description: 'This is a mock product.',
        similarity: 0.9
      }
    ],
    services: []
  }),
  getBusinessHoursText: vi.fn().mockReturnValue('Monday-Friday: 9 AM - 5 PM'),
  getProductInfo: vi.fn().mockReturnValue('Product: Mock Product 1\nPrice: $29.99'),
  getServiceInfo: vi.fn().mockReturnValue('Service: Mock Service 1\nPrice: $99.99'),
  getBusinessContactInfo: vi.fn().mockReturnValue('Email: info@mockbusiness.com\nPhone: 123-456-7890')
}));

// Mock OpenAI API
vi.mock('@/services/openaiService', () => ({
  generateChatCompletion: vi.fn().mockResolvedValue({
    text: 'This is a mock response from the AI assistant.',
    usage: { total_tokens: 150 }
  })
}));

describe('AI Service', () => {
  const context = {
    conversationId: 'mock-conversation-id',
    businessId: 'mock-business-id',
    recentMessages: [
      { role: 'user', content: 'Hello, I have a question.' },
      { role: 'assistant', content: 'Hi there! How can I help you?' }
    ],
    identifiedIntents: [],
    sessionData: {
      conversationState: 'conversation',
      messageCount: 2
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processMessage', () => {
    it('should process a message and return a response with intent and entities', async () => {
      const message = 'Tell me about Mock Product 1';
      
      const response = await processMessage(
        message,
        mockKnowledgeBase,
        mockChatbotConfig,
        context
      );
      
      expect(response).toBeDefined();
      expect(response.text).toBeDefined();
      expect(response.intent).toBe('general_inquiry');
      expect(response.entities).toBeDefined();
      expect(response.confidence).toBeGreaterThan(0);
    });
    
    it('should handle FAQ intents correctly', async () => {
      // Override the mock for this test
      const identifyIntentMock = vi.requireMock('@/services/intentClassificationService').identifyIntent;
      identifyIntentMock.mockResolvedValueOnce({
        name: 'faq_1',
        confidence: 0.95
      });
      
      const message = 'What are your business hours?';
      
      const response = await processMessage(
        message,
        {
          ...mockKnowledgeBase,
          faqs: [
            {
              id: '1',
              question: 'What are your business hours?',
              answer: 'We are open Monday through Friday from 9 AM to 5 PM.',
              category: 'General',
              tags: ['hours'],
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        },
        mockChatbotConfig,
        context
      );
      
      expect(response).toBeDefined();
      expect(response.intent).toBe('faq_1');
      expect(response.confidence).toBeGreaterThan(0.9);
    });
  });

  describe('generateResponse', () => {
    it('should generate a response based on intent and context', async () => {
      const message = 'Tell me about your products';
      const intent = 'product_information';
      const entities = { product: 'Mock Product 1' };
      
      const response = await generateResponse(
        message,
        intent,
        mockKnowledgeBase,
        mockChatbotConfig,
        context,
        entities
      );
      
      expect(response).toBeDefined();
      expect(response.text).toBeDefined();
    });
    
    it('should handle human handoff intent', async () => {
      const message = 'I want to speak to a human';
      const intent = 'human_handoff';
      
      const response = await generateResponse(
        message,
        intent,
        mockKnowledgeBase,
        mockChatbotConfig,
        context
      );
      
      expect(response).toBeDefined();
      expect(response.requiresHumanIntervention).toBe(true);
    });
  });
});
