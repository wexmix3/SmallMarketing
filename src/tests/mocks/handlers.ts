/**
 * MSW Handlers
 * 
 * This file defines the request handlers for the mock server.
 */

import { http, HttpResponse } from 'msw';
import { mockKnowledgeBase, mockChatbotConfig, mockConversation } from './mockData';

export const handlers = [
  // Knowledge Base API
  http.get('/api/chatbot/knowledge-base', () => {
    return HttpResponse.json(mockKnowledgeBase);
  }),
  
  // Chatbot Config API
  http.get('/api/chatbot/config', () => {
    return HttpResponse.json(mockChatbotConfig);
  }),
  
  // Conversations API
  http.get('/api/chatbot/conversations', () => {
    return HttpResponse.json([mockConversation]);
  }),
  
  http.post('/api/chatbot/conversations', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      ...mockConversation,
      id: 'new-conversation-id',
      ...data
    });
  }),
  
  // Messages API
  http.post('/api/chatbot/messages', async () => {
    return HttpResponse.json({
      id: 'message-id',
      text: 'This is a mock response from the AI assistant.',
      intent: 'general_inquiry',
      confidence: 0.9,
      suggestedActions: ['Tell me more', 'Contact support'],
      requiresHumanIntervention: false
    });
  }),
  
  // OpenAI API Mock
  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json({
      id: 'mock-completion-id',
      object: 'chat.completion',
      created: Date.now(),
      model: 'gpt-3.5-turbo',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'This is a mock response from the OpenAI API.'
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150
      }
    });
  }),
  
  // OpenAI Embeddings API Mock
  http.post('https://api.openai.com/v1/embeddings', () => {
    // Generate a mock embedding vector with 1536 dimensions (same as OpenAI's ada-002)
    const mockEmbedding = Array(1536).fill(0).map(() => Math.random() * 2 - 1);
    
    return HttpResponse.json({
      object: 'list',
      data: [
        {
          object: 'embedding',
          embedding: mockEmbedding,
          index: 0
        }
      ],
      model: 'text-embedding-ada-002',
      usage: {
        prompt_tokens: 8,
        total_tokens: 8
      }
    });
  })
];
