/**
 * Chatbot Service
 *
 * This service handles operations related to the AI Customer Service Assistant,
 * including conversation management, message processing, and integration with other systems.
 */

import {
  ChatbotConfig,
  Conversation,
  Message,
  ConversationStatus,
  ConversationSource
} from '@/models/chatbot';

// Use client-side repository for browser and server-side repository for server
const isServer = typeof window === 'undefined';

// Import repositories
let ChatbotConfigRepository, ConversationRepository, KnowledgeBaseRepository;

if (isServer) {
  // Server-side imports
  const serverRepo = require('@/repositories/chatbotRepositoryServer');
  ChatbotConfigRepository = serverRepo.ChatbotConfigRepository;
  ConversationRepository = serverRepo.ConversationRepository;
  KnowledgeBaseRepository = serverRepo.KnowledgeBaseRepository;
} else {
  // Client-side imports
  const clientRepo = require('@/repositories/chatbotRepository');
  ChatbotConfigRepository = clientRepo.ChatbotConfigRepository;
  ConversationRepository = clientRepo.ConversationRepository;
  KnowledgeBaseRepository = clientRepo.KnowledgeBaseRepository;
}

import {
  processMessage,
  generateWelcomeMessage,
  generateFallbackMessage,
  shouldTransferToHuman
} from './aiService';

import { trackEvent } from './analyticsService';

/**
 * Initialize a new conversation
 */
export async function initializeConversation(
  businessId: string,
  visitorId: string,
  visitorName?: string,
  visitorEmail?: string,
  source: ConversationSource = 'website'
): Promise<Conversation> {
  try {
    // Create a new conversation
    const conversation = await ConversationRepository.create({
      businessId,
      visitorId,
      visitorName,
      visitorEmail,
      startTime: new Date(),
      status: 'active',
      source,
      tags: []
    });

    // Generate welcome message
    const welcomeMessage = await generateWelcomeMessage(businessId);

    // Add welcome message to conversation
    await ConversationRepository.addMessage(conversation.id, {
      content: welcomeMessage,
      sender: 'assistant',
      timestamp: new Date(),
      isRead: false
    });

    // Track conversation start event
    trackEvent(
      'conversation_start',
      'Conversation Started',
      'chatbot',
      source,
      undefined,
      visitorId,
      conversation.id
    );

    // Get updated conversation with welcome message
    const updatedConversation = await ConversationRepository.getById(conversation.id);
    return updatedConversation || conversation;
  } catch (error) {
    console.error('Error initializing conversation:', error);
    throw error;
  }
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(
  conversationId: string,
  content: string,
  sender: 'user' | 'assistant' | 'human-agent',
  attachments?: any[]
): Promise<Message | null> {
  try {
    // Add message to conversation
    const message = await ConversationRepository.addMessage(conversationId, {
      content,
      sender,
      timestamp: new Date(),
      attachments,
      isRead: sender !== 'user', // Messages from user start as unread
    });

    // If it's a user message, process it and generate a response
    if (sender === 'user' && message) {
      await processUserMessage(conversationId, message);
    }

    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

/**
 * Process a user message and generate a response
 */
async function processUserMessage(conversationId: string, message: Message): Promise<void> {
  try {
    // Get the conversation
    const conversation = await ConversationRepository.getById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Don't process if conversation is not active
    if (conversation.status !== 'active') {
      return;
    }

    // Create conversation context from recent messages
    const recentMessages = conversation.messages
      .slice(-10) // Get last 10 messages
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    // Process the message with AI service
    const aiResponse = await processMessage(
      conversation.businessId,
      conversationId,
      message.content,
      {
        conversationId,
        businessId: conversation.businessId,
        visitorInfo: {
          name: conversation.visitorName,
          email: conversation.visitorEmail
        },
        recentMessages,
        identifiedIntents: []
      }
    );

    // Check if we should transfer to a human
    if (shouldTransferToHuman(aiResponse)) {
      // Add transfer message
      await ConversationRepository.addMessage(conversationId, {
        content: aiResponse.text,
        sender: 'assistant',
        timestamp: new Date(),
        isRead: false
      });

      // Update conversation status
      await ConversationRepository.updateStatus(conversationId, 'transferred');

      // Track transfer event
      trackEvent(
        'conversation_transferred',
        'Conversation Transferred to Human',
        'chatbot',
        conversation.source,
        undefined,
        conversation.visitorId,
        conversationId
      );

      return;
    }

    // Add AI response to conversation
    await ConversationRepository.addMessage(conversationId, {
      content: aiResponse.text,
      sender: 'assistant',
      timestamp: new Date(),
      isRead: false,
      metadata: {
        intent: aiResponse.intent,
        confidence: aiResponse.confidence,
        suggestedActions: aiResponse.suggestedActions
      }
    });

    // Track message processed event
    trackEvent(
      'message_processed',
      'Message Processed',
      'chatbot',
      aiResponse.intent || 'unknown',
      aiResponse.confidence,
      conversation.visitorId,
      conversationId
    );
  } catch (error) {
    console.error('Error processing user message:', error);

    // Add fallback message in case of error
    const fallbackMessage = await generateFallbackMessage(conversation.businessId);

    await ConversationRepository.addMessage(conversationId, {
      content: fallbackMessage,
      sender: 'assistant',
      timestamp: new Date(),
      isRead: false
    });
  }
}

/**
 * Close a conversation
 */
export async function closeConversation(conversationId: string): Promise<Conversation | null> {
  try {
    const conversation = await ConversationRepository.updateStatus(conversationId, 'closed');

    if (conversation) {
      // Track conversation end event
      trackEvent(
        'conversation_ended',
        'Conversation Ended',
        'chatbot',
        conversation.source,
        undefined,
        conversation.visitorId,
        conversationId
      );
    }

    return conversation;
  } catch (error) {
    console.error('Error closing conversation:', error);
    return null;
  }
}

/**
 * Transfer a conversation to a human agent
 */
export async function transferToHuman(
  conversationId: string,
  agentId?: string
): Promise<Conversation | null> {
  try {
    // Get the conversation
    const conversation = await ConversationRepository.getById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Update conversation status
    const updatedConversation = await ConversationRepository.updateStatus(conversationId, 'transferred');

    if (updatedConversation) {
      // Add transfer message
      await ConversationRepository.addMessage(conversationId, {
        content: "I'm transferring you to a human agent who will assist you shortly.",
        sender: 'assistant',
        timestamp: new Date(),
        isRead: false
      });

      // Assign to agent if provided
      if (agentId && updatedConversation) {
        // In a real implementation, this would update the conversation in the database
        updatedConversation.assignedTo = agentId;
      }

      // Track transfer event
      trackEvent(
        'conversation_transferred',
        'Conversation Transferred to Human',
        'chatbot',
        conversation.source,
        undefined,
        conversation.visitorId,
        conversationId
      );
    }

    return updatedConversation;
  } catch (error) {
    console.error('Error transferring conversation:', error);
    return null;
  }
}

/**
 * Get recent conversations for a business
 */
export async function getRecentConversations(
  businessId: string,
  limit: number = 10
): Promise<Conversation[]> {
  try {
    const conversations = await ConversationRepository.getByBusinessId(businessId);

    // Sort by start time (newest first) and limit
    return conversations
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent conversations:', error);
    return [];
  }
}

/**
 * Get active conversations for a business
 */
export async function getActiveConversations(businessId: string): Promise<Conversation[]> {
  try {
    const conversations = await ConversationRepository.getByBusinessId(businessId);

    // Filter active conversations and sort by start time
    return conversations
      .filter(conv => conv.status === 'active' || conv.status === 'transferred')
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  } catch (error) {
    console.error('Error getting active conversations:', error);
    return [];
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  conversationId: string,
  messageIds: string[]
): Promise<boolean> {
  try {
    return await ConversationRepository.markMessagesAsRead(conversationId, messageIds);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }
}

/**
 * Get unread message count for a business
 */
export async function getUnreadMessageCount(businessId: string): Promise<number> {
  try {
    const conversations = await ConversationRepository.getByBusinessId(businessId);

    // Count unread messages across all conversations
    return conversations.reduce((total, conv) => {
      const unreadCount = conv.messages.filter(msg => !msg.isRead && msg.sender === 'user').length;
      return total + unreadCount;
    }, 0);
  } catch (error) {
    console.error('Error getting unread message count:', error);
    return 0;
  }
}
