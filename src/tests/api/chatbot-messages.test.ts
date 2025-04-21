/**
 * Chatbot Messages API Tests
 * 
 * This file contains tests for the chatbot messages API.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/chatbot/messages/route';
import { mockKnowledgeBase, mockChatbotConfig, mockConversation } from '../mocks/mockData';

// Mock the repositories
vi.mock('@/repositories/chatbotRepository', () => ({
  KnowledgeBaseRepository: {
    getByBusinessId: vi.fn().mockResolvedValue(mockKnowledgeBase)
  },
  ChatbotConfigRepository: {
    getByBusinessId: vi.fn().mockResolvedValue(mockChatbotConfig)
  },
  ConversationRepository: {
    getById: vi.fn().mockResolvedValue(mockConversation),
    update: vi.fn().mockResolvedValue(mockConversation)
  },
  MessageRepository: {
    create: vi.fn().mockResolvedValue({
      id: 'new-message-id',
      conversationId: 'mock-conversation-id',
      content: 'Test message',
      sender: 'user',
      timestamp: new Date(),
      isRead: false
    }),
    getByConversationId: vi.fn().mockResolvedValue(mockConversation.messages)
  }
}));

// Mock the AI service
vi.mock('@/services/aiService', () => ({
  processMessage: vi.fn().mockResolvedValue({
    text: 'This is a mock response from the AI assistant.',
    intent: 'general_inquiry',
    entities: { product: 'Mock Product 1' },
    confidence: 0.9,
    suggestedActions: ['Tell me more', 'Contact support'],
    requiresHumanIntervention: false
  })
}));

describe('Chatbot Messages API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/chatbot/messages', () => {
    it('should process a message and return a response', async () => {
      const requestBody = {
        message: 'Tell me about your products',
        conversationId: 'mock-conversation-id'
      };
      
      const request = new NextRequest('http://localhost:3000/api/chatbot/messages?businessId=mock-business-id', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const response = await POST(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toBeDefined();
      expect(data.text).toBeDefined();
      expect(data.intent).toBeDefined();
      expect(data.confidence).toBeDefined();
    });
    
    it('should return 400 if message is missing', async () => {
      const requestBody = {
        conversationId: 'mock-conversation-id'
      };
      
      const request = new NextRequest('http://localhost:3000/api/chatbot/messages?businessId=mock-business-id', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const response = await POST(request);
      expect(response.status).toBe(400);
    });
    
    it('should return 400 if businessId is missing', async () => {
      const requestBody = {
        message: 'Tell me about your products',
        conversationId: 'mock-conversation-id'
      };
      
      const request = new NextRequest('http://localhost:3000/api/chatbot/messages', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const response = await POST(request);
      expect(response.status).toBe(400);
    });
    
    it('should create a new conversation if conversationId is not provided', async () => {
      const requestBody = {
        message: 'Tell me about your products'
      };
      
      // Mock the conversation creation
      const createMock = vi.fn().mockResolvedValue({
        id: 'new-conversation-id',
        businessId: 'mock-business-id',
        status: 'active',
        messages: []
      });
      
      vi.requireMock('@/repositories/chatbotRepository').ConversationRepository.create = createMock;
      
      const request = new NextRequest('http://localhost:3000/api/chatbot/messages?businessId=mock-business-id', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const response = await POST(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toBeDefined();
      expect(data.conversationId).toBe('new-conversation-id');
    });
  });

  describe('GET /api/chatbot/messages', () => {
    it('should return messages for a conversation', async () => {
      const request = new NextRequest('http://localhost:3000/api/chatbot/messages?conversationId=mock-conversation-id', {
        method: 'GET'
      });
      
      const response = await GET(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
    
    it('should return 400 if conversationId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/chatbot/messages', {
        method: 'GET'
      });
      
      const response = await GET(request);
      expect(response.status).toBe(400);
    });
    
    it('should return 404 if conversation is not found', async () => {
      // Override the mock for this test
      const getByIdMock = vi.requireMock('@/repositories/chatbotRepository').ConversationRepository.getById;
      getByIdMock.mockResolvedValueOnce(null);
      
      const request = new NextRequest('http://localhost:3000/api/chatbot/messages?conversationId=non-existent-id', {
        method: 'GET'
      });
      
      const response = await GET(request);
      expect(response.status).toBe(404);
    });
  });
});
