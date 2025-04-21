/**
 * Chatbot Repository (Server-side)
 * 
 * This repository handles data persistence for the AI Customer Service Assistant.
 * It uses the database connection to interact with the PostgreSQL database.
 * In development mode with USE_MOCK_DB=true, it uses the mock database service.
 */

import { query, transaction } from '@/db/connection';
import { v4 as uuidv4 } from 'uuid';

/**
 * Chatbot Configuration Repository
 */
export const ChatbotConfigRepository = {
  /**
   * Get chatbot configuration by business ID
   */
  getByBusinessId: async (businessId: string) => {
    try {
      const result = await query(
        'SELECT * FROM chatbot_config WHERE business_id = $1',
        [businessId]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting chatbot config:', error);
      return null;
    }
  },
  
  /**
   * Get chatbot configuration by ID
   */
  getById: async (id: string) => {
    try {
      const result = await query(
        'SELECT * FROM chatbot_config WHERE id = $1',
        [id]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting chatbot config:', error);
      return null;
    }
  },
  
  /**
   * Save chatbot configuration
   */
  save: async (config: any) => {
    try {
      // Check if config already exists
      const existingConfig = config.id 
        ? await ChatbotConfigRepository.getById(config.id)
        : null;
      
      if (existingConfig) {
        // Update existing config
        const result = await query(
          `UPDATE chatbot_config SET
            name = $1,
            welcome_message = $2,
            fallback_message = $3,
            transfer_message = $4,
            offline_message = $5,
            appearance = $6,
            behavior = $7,
            integrations = $8,
            ai_settings = $9,
            updated_at = NOW()
          WHERE id = $10
          RETURNING *`,
          [
            config.name,
            config.welcomeMessage,
            config.fallbackMessage,
            config.transferMessage,
            config.offlineMessage,
            JSON.stringify(config.appearance),
            JSON.stringify(config.behavior),
            JSON.stringify(config.integrations),
            JSON.stringify(config.aiSettings),
            config.id
          ]
        );
        
        return result.rows[0];
      } else {
        // Create new config
        const result = await query(
          `INSERT INTO chatbot_config (
            id,
            business_id,
            name,
            welcome_message,
            fallback_message,
            transfer_message,
            offline_message,
            appearance,
            behavior,
            integrations,
            ai_settings,
            created_at,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
          RETURNING *`,
          [
            config.id || uuidv4(),
            config.businessId,
            config.name,
            config.welcomeMessage,
            config.fallbackMessage,
            config.transferMessage,
            config.offlineMessage,
            JSON.stringify(config.appearance),
            JSON.stringify(config.behavior),
            JSON.stringify(config.integrations),
            JSON.stringify(config.aiSettings)
          ]
        );
        
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error saving chatbot config:', error);
      throw error;
    }
  },
  
  /**
   * Delete chatbot configuration
   */
  delete: async (id: string) => {
    try {
      const result = await query(
        'DELETE FROM chatbot_config WHERE id = $1 RETURNING id',
        [id]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting chatbot config:', error);
      return false;
    }
  }
};

/**
 * Knowledge Base Repository
 */
export const KnowledgeBaseRepository = {
  /**
   * Get knowledge base by business ID
   */
  getByBusinessId: async (businessId: string) => {
    try {
      // Get FAQs
      const faqsResult = await query(
        'SELECT * FROM faqs WHERE business_id = $1',
        [businessId]
      );
      
      // Get products
      const productsResult = await query(
        'SELECT * FROM products WHERE business_id = $1',
        [businessId]
      );
      
      // Get services
      const servicesResult = await query(
        'SELECT * FROM services WHERE business_id = $1',
        [businessId]
      );
      
      // Get business info
      const businessResult = await query(
        'SELECT * FROM businesses WHERE id = $1',
        [businessId]
      );
      
      if (businessResult.rows.length === 0) {
        return null;
      }
      
      return {
        id: `kb-${businessId}`,
        businessId,
        faqs: faqsResult.rows,
        products: productsResult.rows,
        services: servicesResult.rows,
        businessInfo: businessResult.rows[0],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error getting knowledge base:', error);
      return null;
    }
  },
  
  /**
   * Add FAQ to knowledge base
   */
  addFAQ: async (businessId: string, faq: any) => {
    try {
      const result = await query(
        `INSERT INTO faqs (
          id,
          business_id,
          question,
          answer,
          category,
          tags,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *`,
        [
          faq.id || uuidv4(),
          businessId,
          faq.question,
          faq.answer,
          faq.category,
          faq.tags
        ]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error adding FAQ:', error);
      throw error;
    }
  },
  
  /**
   * Update FAQ in knowledge base
   */
  updateFAQ: async (businessId: string, faq: any) => {
    try {
      const result = await query(
        `UPDATE faqs SET
          question = $1,
          answer = $2,
          category = $3,
          tags = $4,
          updated_at = NOW()
        WHERE id = $5 AND business_id = $6
        RETURNING *`,
        [
          faq.question,
          faq.answer,
          faq.category,
          faq.tags,
          faq.id,
          businessId
        ]
      );
      
      if (result.rows.length === 0) {
        throw new Error('FAQ not found');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  },
  
  /**
   * Delete FAQ from knowledge base
   */
  deleteFAQ: async (businessId: string, faqId: string) => {
    try {
      const result = await query(
        'DELETE FROM faqs WHERE id = $1 AND business_id = $2 RETURNING id',
        [faqId, businessId]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  }
};

/**
 * Conversation Repository
 */
export const ConversationRepository = {
  /**
   * Get all conversations for a business
   */
  getByBusinessId: async (businessId: string) => {
    try {
      const result = await query(
        `SELECT c.*, 
          (SELECT json_agg(m.*) FROM messages m WHERE m.conversation_id = c.id) as messages
        FROM conversations c
        WHERE c.business_id = $1
        ORDER BY c.start_time DESC`,
        [businessId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  },
  
  /**
   * Get conversation by ID
   */
  getById: async (id: string) => {
    try {
      const result = await query(
        `SELECT c.*, 
          (SELECT json_agg(m.*) FROM messages m WHERE m.conversation_id = c.id ORDER BY m.timestamp) as messages
        FROM conversations c
        WHERE c.id = $1`,
        [id]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  },
  
  /**
   * Create a new conversation
   */
  create: async (conversation: any) => {
    try {
      return await transaction(async (client) => {
        // Create conversation
        const conversationResult = await client.query(
          `INSERT INTO conversations (
            id,
            business_id,
            visitor_id,
            visitor_name,
            visitor_email,
            start_time,
            status,
            source,
            tags,
            created_at,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, NOW(), NOW())
          RETURNING *`,
          [
            conversation.id || uuidv4(),
            conversation.businessId,
            conversation.visitorId,
            conversation.visitorName,
            conversation.visitorEmail,
            conversation.status || 'active',
            conversation.source || 'website',
            conversation.tags || []
          ]
        );
        
        const newConversation = conversationResult.rows[0];
        
        // Add welcome message
        const config = await ChatbotConfigRepository.getByBusinessId(conversation.businessId);
        
        if (config && config.welcome_message) {
          await client.query(
            `INSERT INTO messages (
              id,
              conversation_id,
              content,
              sender,
              timestamp,
              is_read,
              created_at,
              updated_at
            ) VALUES ($1, $2, $3, $4, NOW(), $5, NOW(), NOW())`,
            [
              uuidv4(),
              newConversation.id,
              config.welcome_message,
              'assistant',
              false
            ]
          );
        }
        
        // Get conversation with messages
        const result = await client.query(
          `SELECT c.*, 
            (SELECT json_agg(m.*) FROM messages m WHERE m.conversation_id = c.id ORDER BY m.timestamp) as messages
          FROM conversations c
          WHERE c.id = $1`,
          [newConversation.id]
        );
        
        return result.rows[0];
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },
  
  /**
   * Update conversation status
   */
  updateStatus: async (id: string, status: string) => {
    try {
      const result = await query(
        `UPDATE conversations SET
          status = $1,
          ${status === 'closed' ? 'end_time = NOW(),' : ''}
          updated_at = NOW()
        WHERE id = $2
        RETURNING *`,
        [status, id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      // Get conversation with messages
      const conversation = await ConversationRepository.getById(id);
      
      return conversation;
    } catch (error) {
      console.error('Error updating conversation status:', error);
      return null;
    }
  },
  
  /**
   * Add message to conversation
   */
  addMessage: async (conversationId: string, message: any) => {
    try {
      const result = await query(
        `INSERT INTO messages (
          id,
          conversation_id,
          content,
          sender,
          timestamp,
          is_read,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, NOW(), $5, NOW(), NOW())
        RETURNING *`,
        [
          message.id || uuidv4(),
          conversationId,
          message.content,
          message.sender,
          message.isRead || false
        ]
      );
      
      // Update conversation updated_at
      await query(
        `UPDATE conversations SET
          updated_at = NOW()
        WHERE id = $1`,
        [conversationId]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  },
  
  /**
   * Mark messages as read
   */
  markMessagesAsRead: async (conversationId: string, messageIds: string[]) => {
    try {
      if (messageIds.length === 0) {
        return false;
      }
      
      const result = await query(
        `UPDATE messages SET
          is_read = true,
          updated_at = NOW()
        WHERE conversation_id = $1 AND id = ANY($2)
        RETURNING id`,
        [conversationId, messageIds]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }
};

/**
 * Analytics Repository
 */
export const AnalyticsRepository = {
  /**
   * Get analytics for a business
   */
  getByBusinessId: async (businessId: string, period: string) => {
    try {
      // Get conversation metrics
      const conversationsResult = await query(
        `SELECT
          COUNT(*) as total_conversations,
          COUNT(*) FILTER (WHERE status = 'active') as active_conversations,
          COUNT(*) FILTER (WHERE status = 'closed') as closed_conversations,
          COUNT(*) FILTER (WHERE status = 'transferred') as transferred_conversations,
          AVG(EXTRACT(EPOCH FROM (COALESCE(end_time, NOW()) - start_time))) as avg_duration
        FROM conversations
        WHERE business_id = $1
        AND start_time >= NOW() - INTERVAL '1 ${period}'`,
        [businessId]
      );
      
      // Get message metrics
      const messagesResult = await query(
        `SELECT
          COUNT(*) as total_messages,
          COUNT(*) FILTER (WHERE sender = 'user') as user_messages,
          COUNT(*) FILTER (WHERE sender = 'assistant') as assistant_messages,
          COUNT(*) FILTER (WHERE sender = 'human-agent') as agent_messages
        FROM messages m
        JOIN conversations c ON m.conversation_id = c.id
        WHERE c.business_id = $1
        AND m.timestamp >= NOW() - INTERVAL '1 ${period}'`,
        [businessId]
      );
      
      // Calculate resolution rate
      const resolutionRate = conversationsResult.rows[0].closed_conversations / 
        (conversationsResult.rows[0].total_conversations || 1);
      
      // Calculate transfer rate
      const transferRate = conversationsResult.rows[0].transferred_conversations / 
        (conversationsResult.rows[0].total_conversations || 1);
      
      return {
        id: `analytics-${businessId}-${period}`,
        businessId,
        period,
        totalConversations: parseInt(conversationsResult.rows[0].total_conversations),
        activeConversations: parseInt(conversationsResult.rows[0].active_conversations),
        avgConversationDuration: parseFloat(conversationsResult.rows[0].avg_duration) || 0,
        messageCount: {
          total: parseInt(messagesResult.rows[0].total_messages),
          fromUsers: parseInt(messagesResult.rows[0].user_messages),
          fromBot: parseInt(messagesResult.rows[0].assistant_messages),
          fromAgents: parseInt(messagesResult.rows[0].agent_messages)
        },
        resolutionRate,
        transferRate,
        timeframe: {
          start: new Date(Date.now() - getPeriodInMilliseconds(period)),
          end: new Date()
        },
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  }
};

// Helper function to convert period to milliseconds
function getPeriodInMilliseconds(period: string): number {
  switch (period) {
    case 'day':
      return 24 * 60 * 60 * 1000;
    case 'week':
      return 7 * 24 * 60 * 60 * 1000;
    case 'month':
      return 30 * 24 * 60 * 60 * 1000;
    case 'year':
      return 365 * 24 * 60 * 60 * 1000;
    default:
      return 30 * 24 * 60 * 60 * 1000; // Default to month
  }
}
