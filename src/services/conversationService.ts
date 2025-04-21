/**
 * Conversation Service
 * 
 * This service manages chat conversations, including message processing,
 * conversation state, and interaction with the AI service.
 */

import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { 
  Conversation, 
  Message, 
  ConversationStatus,
  ConversationContext,
  AIResponse
} from '../types/chatbot';
import { AIProcessingService } from './aiProcessingService';
import { AnalyticsService } from './analyticsService';

export class ConversationService {
  private db: Pool;
  private aiService: AIProcessingService;
  private analyticsService: AnalyticsService;
  
  constructor(
    dbConnection: Pool, 
    aiService: AIProcessingService,
    analyticsService: AnalyticsService
  ) {
    this.db = dbConnection;
    this.aiService = aiService;
    this.analyticsService = analyticsService;
  }
  
  /**
   * Create a new conversation
   */
  async createConversation(
    businessId: string,
    visitorId: string,
    source: string = 'website',
    visitorName?: string,
    visitorEmail?: string
  ): Promise<Conversation> {
    try {
      const conversationId = uuidv4();
      const now = new Date();
      
      // Insert conversation record
      await this.db.query(
        `INSERT INTO conversations 
         (id, business_id, visitor_id, visitor_name, visitor_email, source, status, start_time, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [conversationId, businessId, visitorId, visitorName, visitorEmail, source, 'active', now, now, now]
      );
      
      // Get business welcome message
      const welcomeMessage = await this.getWelcomeMessage(businessId);
      
      // Add welcome message
      await this.addMessage(conversationId, {
        content: welcomeMessage,
        sender: 'assistant',
        timestamp: now,
        isRead: false
      });
      
      // Track conversation start in analytics
      this.analyticsService.trackConversationStart(businessId, conversationId, source);
      
      // Return the new conversation
      return {
        id: conversationId,
        businessId,
        visitorId,
        visitorName,
        visitorEmail,
        startTime: now,
        status: 'active',
        source,
        messages: [
          {
            id: uuidv4(),
            conversationId,
            content: welcomeMessage,
            sender: 'assistant',
            timestamp: now,
            isRead: false
          }
        ],
        tags: []
      };
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Failed to create conversation');
    }
  }
  
  /**
   * Get a conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      // Get conversation details
      const conversationResult = await this.db.query(
        'SELECT * FROM conversations WHERE id = $1',
        [conversationId]
      );
      
      if (conversationResult.rows.length === 0) {
        return null;
      }
      
      const conversation = conversationResult.rows[0];
      
      // Get messages for this conversation
      const messagesResult = await this.db.query(
        'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY timestamp ASC',
        [conversationId]
      );
      
      const messages = messagesResult.rows.map(row => ({
        id: row.id,
        conversationId: row.conversation_id,
        content: row.content,
        sender: row.sender,
        timestamp: row.timestamp,
        isRead: row.is_read,
        metadata: row.metadata
      }));
      
      // Get tags for this conversation
      const tagsResult = await this.db.query(
        'SELECT tag FROM conversation_tags WHERE conversation_id = $1',
        [conversationId]
      );
      
      const tags = tagsResult.rows.map(row => row.tag);
      
      return {
        id: conversation.id,
        businessId: conversation.business_id,
        visitorId: conversation.visitor_id,
        visitorName: conversation.visitor_name,
        visitorEmail: conversation.visitor_email,
        startTime: conversation.start_time,
        endTime: conversation.end_time,
        status: conversation.status,
        source: conversation.source,
        messages,
        tags,
        assignedTo: conversation.assigned_to,
        metadata: conversation.metadata
      };
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }
  
  /**
   * Get recent conversations for a business
   */
  async getRecentConversations(
    businessId: string, 
    limit: number = 10, 
    offset: number = 0,
    status?: ConversationStatus
  ): Promise<Conversation[]> {
    try {
      let query = `
        SELECT c.*, 
               COUNT(m.id) as message_count,
               MAX(m.timestamp) as last_message_time
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        WHERE c.business_id = $1
      `;
      
      const queryParams = [businessId];
      
      if (status) {
        query += ` AND c.status = $2`;
        queryParams.push(status);
      }
      
      query += `
        GROUP BY c.id
        ORDER BY last_message_time DESC
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
      `;
      
      queryParams.push(limit, offset);
      
      const result = await this.db.query(query, queryParams);
      
      // Get all conversation IDs
      const conversationIds = result.rows.map(row => row.id);
      
      if (conversationIds.length === 0) {
        return [];
      }
      
      // Get all messages for these conversations
      const messagesResult = await this.db.query(
        `SELECT * FROM messages 
         WHERE conversation_id = ANY($1)
         ORDER BY timestamp ASC`,
        [conversationIds]
      );
      
      // Group messages by conversation ID
      const messagesByConversation = messagesResult.rows.reduce((acc, row) => {
        if (!acc[row.conversation_id]) {
          acc[row.conversation_id] = [];
        }
        
        acc[row.conversation_id].push({
          id: row.id,
          conversationId: row.conversation_id,
          content: row.content,
          sender: row.sender,
          timestamp: row.timestamp,
          isRead: row.is_read,
          metadata: row.metadata
        });
        
        return acc;
      }, {});
      
      // Get all tags for these conversations
      const tagsResult = await this.db.query(
        `SELECT conversation_id, tag FROM conversation_tags 
         WHERE conversation_id = ANY($1)`,
        [conversationIds]
      );
      
      // Group tags by conversation ID
      const tagsByConversation = tagsResult.rows.reduce((acc, row) => {
        if (!acc[row.conversation_id]) {
          acc[row.conversation_id] = [];
        }
        
        acc[row.conversation_id].push(row.tag);
        
        return acc;
      }, {});
      
      // Build conversation objects
      return result.rows.map(row => ({
        id: row.id,
        businessId: row.business_id,
        visitorId: row.visitor_id,
        visitorName: row.visitor_name,
        visitorEmail: row.visitor_email,
        startTime: row.start_time,
        endTime: row.end_time,
        status: row.status,
        source: row.source,
        messages: messagesByConversation[row.id] || [],
        tags: tagsByConversation[row.id] || [],
        assignedTo: row.assigned_to,
        metadata: row.metadata
      }));
    } catch (error) {
      console.error('Error getting recent conversations:', error);
      return [];
    }
  }
  
  /**
   * Add a message to a conversation
   */
  async addMessage(
    conversationId: string, 
    message: Omit<Message, 'id' | 'conversationId'>
  ): Promise<Message> {
    try {
      const messageId = uuidv4();
      const now = new Date();
      
      // Insert message record
      await this.db.query(
        `INSERT INTO messages 
         (id, conversation_id, content, sender, timestamp, is_read, metadata, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          messageId, 
          conversationId, 
          message.content, 
          message.sender, 
          message.timestamp || now, 
          message.isRead || false,
          message.metadata || {},
          now,
          now
        ]
      );
      
      // Update conversation's updated_at timestamp
      await this.db.query(
        'UPDATE conversations SET updated_at = $1 WHERE id = $2',
        [now, conversationId]
      );
      
      // Get conversation for analytics tracking
      const conversation = await this.getConversation(conversationId);
      
      if (conversation) {
        // Track message in analytics
        this.analyticsService.trackMessage(
          conversation.businessId,
          conversationId,
          messageId,
          message.sender,
          message.content.length
        );
      }
      
      return {
        id: messageId,
        conversationId,
        content: message.content,
        sender: message.sender,
        timestamp: message.timestamp || now,
        isRead: message.isRead || false,
        metadata: message.metadata
      };
    } catch (error) {
      console.error('Error adding message:', error);
      throw new Error('Failed to add message');
    }
  }
  
  /**
   * Process a user message and generate a response
   */
  async processUserMessage(conversationId: string, message: string): Promise<AIResponse> {
    try {
      // Get the conversation
      const conversation = await this.getConversation(conversationId);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      // Don't process if conversation is not active
      if (conversation.status !== 'active') {
        throw new Error('Conversation is not active');
      }
      
      // Add user message to conversation
      await this.addMessage(conversationId, {
        content: message,
        sender: 'user',
        timestamp: new Date(),
        isRead: false
      });
      
      // Create conversation context from recent messages
      const context: ConversationContext = {
        conversationId,
        messages: conversation.messages.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        visitorInfo: {
          name: conversation.visitorName,
          email: conversation.visitorEmail
        }
      };
      
      // Process the message with AI service
      const aiResponse = await this.aiService.processMessage(
        conversation.businessId,
        message,
        context
      );
      
      // Add AI response to conversation
      await this.addMessage(conversationId, {
        content: aiResponse.text,
        sender: 'assistant',
        timestamp: new Date(),
        isRead: false,
        metadata: {
          intent: aiResponse.intent,
          confidence: aiResponse.confidence,
          source: aiResponse.source,
          suggestedActions: aiResponse.suggestedActions
        }
      });
      
      // Check if we should transfer to a human
      if (aiResponse.requiresHumanIntervention) {
        await this.updateConversationStatus(conversationId, 'transferred');
      }
      
      // Track AI response in analytics
      this.analyticsService.trackAIResponse(
        conversation.businessId,
        conversationId,
        aiResponse.intent.type,
        aiResponse.confidence,
        aiResponse.source,
        aiResponse.requiresHumanIntervention
      );
      
      return aiResponse;
    } catch (error) {
      console.error('Error processing user message:', error);
      throw new Error('Failed to process message');
    }
  }
  
  /**
   * Update conversation status
   */
  async updateConversationStatus(
    conversationId: string, 
    status: ConversationStatus
  ): Promise<boolean> {
    try {
      const now = new Date();
      let query = 'UPDATE conversations SET status = $1, updated_at = $2';
      const values = [status, now];
      
      // If closing the conversation, set end_time
      if (status === 'closed') {
        query += ', end_time = $3';
        values.push(now);
      }
      
      query += ' WHERE id = $' + (values.length + 1) + ' RETURNING id';
      values.push(conversationId);
      
      const result = await this.db.query(query, values);
      
      if (result.rows.length === 0) {
        return false;
      }
      
      // Get conversation for analytics tracking
      const conversation = await this.getConversation(conversationId);
      
      if (conversation) {
        // Track status change in analytics
        this.analyticsService.trackConversationStatusChange(
          conversation.businessId,
          conversationId,
          status
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error updating conversation status:', error);
      return false;
    }
  }
  
  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId: string, messageIds: string[]): Promise<boolean> {
    try {
      if (messageIds.length === 0) {
        return true;
      }
      
      await this.db.query(
        `UPDATE messages 
         SET is_read = true, updated_at = $1
         WHERE conversation_id = $2 AND id = ANY($3)`,
        [new Date(), conversationId, messageIds]
      );
      
      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }
  
  /**
   * Assign conversation to a human agent
   */
  async assignConversation(conversationId: string, agentId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        `UPDATE conversations 
         SET assigned_to = $1, updated_at = $2
         WHERE id = $3
         RETURNING id`,
        [agentId, new Date(), conversationId]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error assigning conversation:', error);
      return false;
    }
  }
  
  /**
   * Add a tag to a conversation
   */
  async addTag(conversationId: string, tag: string): Promise<boolean> {
    try {
      // Check if tag already exists for this conversation
      const checkResult = await this.db.query(
        'SELECT 1 FROM conversation_tags WHERE conversation_id = $1 AND tag = $2',
        [conversationId, tag]
      );
      
      if (checkResult.rows.length > 0) {
        return true; // Tag already exists
      }
      
      // Add the tag
      await this.db.query(
        'INSERT INTO conversation_tags (conversation_id, tag, created_at) VALUES ($1, $2, $3)',
        [conversationId, tag, new Date()]
      );
      
      return true;
    } catch (error) {
      console.error('Error adding tag:', error);
      return false;
    }
  }
  
  /**
   * Remove a tag from a conversation
   */
  async removeTag(conversationId: string, tag: string): Promise<boolean> {
    try {
      await this.db.query(
        'DELETE FROM conversation_tags WHERE conversation_id = $1 AND tag = $2',
        [conversationId, tag]
      );
      
      return true;
    } catch (error) {
      console.error('Error removing tag:', error);
      return false;
    }
  }
  
  /**
   * Get welcome message for a business
   */
  private async getWelcomeMessage(businessId: string): Promise<string> {
    try {
      const result = await this.db.query(
        'SELECT welcome_message FROM chatbot_config WHERE business_id = $1',
        [businessId]
      );
      
      if (result.rows.length > 0 && result.rows[0].welcome_message) {
        return result.rows[0].welcome_message;
      }
      
      // Default welcome message
      return "Hello! Welcome to our customer service chat. How can I assist you today?";
    } catch (error) {
      console.error('Error getting welcome message:', error);
      return "Hello! How can I help you today?";
    }
  }
}
