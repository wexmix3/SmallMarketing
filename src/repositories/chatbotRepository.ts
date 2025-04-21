/**
 * Chatbot Repository
 * 
 * This repository handles data persistence for the AI Customer Service Assistant.
 * In a real application, this would interact with a database.
 * For this demo, we're using localStorage for persistence.
 */

import { 
  ChatbotConfig, 
  KnowledgeBase, 
  Conversation, 
  Message,
  FAQ,
  Product,
  Service,
  CustomEntity,
  ChatbotAnalytics,
  getMockChatbotConfig,
  getMockKnowledgeBase,
  getMockConversation,
  getMockChatbotAnalytics
} from '@/models/chatbot';

// Storage keys
const CHATBOT_CONFIG_KEY = 'chatbot_config';
const KNOWLEDGE_BASE_KEY = 'chatbot_knowledge_base';
const CONVERSATIONS_KEY = 'chatbot_conversations';
const MESSAGES_KEY = 'chatbot_messages';
const ANALYTICS_KEY = 'chatbot_analytics';

/**
 * Chatbot Configuration Repository
 */
export const ChatbotConfigRepository = {
  /**
   * Get chatbot configuration by business ID
   */
  getByBusinessId: async (businessId: string): Promise<ChatbotConfig | null> => {
    try {
      // In a real app, this would query the database
      const data = localStorage.getItem(CHATBOT_CONFIG_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockConfig = getMockChatbotConfig();
        localStorage.setItem(CHATBOT_CONFIG_KEY, JSON.stringify(mockConfig));
        return mockConfig;
      }
      
      const configs = JSON.parse(data) as ChatbotConfig[];
      return configs.find(config => config.businessId === businessId) || null;
    } catch (error) {
      console.error('Error getting chatbot config:', error);
      return null;
    }
  },
  
  /**
   * Get chatbot configuration by ID
   */
  getById: async (id: string): Promise<ChatbotConfig | null> => {
    try {
      const data = localStorage.getItem(CHATBOT_CONFIG_KEY);
      if (!data) {
        return null;
      }
      
      const configs = JSON.parse(data) as ChatbotConfig[];
      return configs.find(config => config.id === id) || null;
    } catch (error) {
      console.error('Error getting chatbot config:', error);
      return null;
    }
  },
  
  /**
   * Save chatbot configuration
   */
  save: async (config: ChatbotConfig): Promise<ChatbotConfig> => {
    try {
      const data = localStorage.getItem(CHATBOT_CONFIG_KEY);
      let configs: ChatbotConfig[] = [];
      
      if (data) {
        configs = JSON.parse(data);
      }
      
      const index = configs.findIndex(c => c.id === config.id);
      
      if (index >= 0) {
        // Update existing config
        configs[index] = {
          ...config,
          updatedAt: new Date()
        };
      } else {
        // Add new config
        configs.push({
          ...config,
          id: config.id || `chatbot-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      localStorage.setItem(CHATBOT_CONFIG_KEY, JSON.stringify(configs));
      return config;
    } catch (error) {
      console.error('Error saving chatbot config:', error);
      throw error;
    }
  },
  
  /**
   * Delete chatbot configuration
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const data = localStorage.getItem(CHATBOT_CONFIG_KEY);
      if (!data) {
        return false;
      }
      
      const configs = JSON.parse(data) as ChatbotConfig[];
      const filteredConfigs = configs.filter(config => config.id !== id);
      
      if (filteredConfigs.length === configs.length) {
        return false; // No config was removed
      }
      
      localStorage.setItem(CHATBOT_CONFIG_KEY, JSON.stringify(filteredConfigs));
      return true;
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
  getByBusinessId: async (businessId: string): Promise<KnowledgeBase | null> => {
    try {
      const data = localStorage.getItem(KNOWLEDGE_BASE_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockKB = getMockKnowledgeBase();
        localStorage.setItem(KNOWLEDGE_BASE_KEY, JSON.stringify([mockKB]));
        return mockKB;
      }
      
      const knowledgeBases = JSON.parse(data) as KnowledgeBase[];
      return knowledgeBases.find(kb => kb.businessId === businessId) || null;
    } catch (error) {
      console.error('Error getting knowledge base:', error);
      return null;
    }
  },
  
  /**
   * Save knowledge base
   */
  save: async (knowledgeBase: KnowledgeBase): Promise<KnowledgeBase> => {
    try {
      const data = localStorage.getItem(KNOWLEDGE_BASE_KEY);
      let knowledgeBases: KnowledgeBase[] = [];
      
      if (data) {
        knowledgeBases = JSON.parse(data);
      }
      
      const index = knowledgeBases.findIndex(kb => kb.id === knowledgeBase.id);
      
      if (index >= 0) {
        // Update existing knowledge base
        knowledgeBases[index] = {
          ...knowledgeBase,
          updatedAt: new Date()
        };
      } else {
        // Add new knowledge base
        knowledgeBases.push({
          ...knowledgeBase,
          id: knowledgeBase.id || `kb-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      localStorage.setItem(KNOWLEDGE_BASE_KEY, JSON.stringify(knowledgeBases));
      return knowledgeBase;
    } catch (error) {
      console.error('Error saving knowledge base:', error);
      throw error;
    }
  },
  
  /**
   * Add FAQ to knowledge base
   */
  addFAQ: async (businessId: string, faq: FAQ): Promise<FAQ> => {
    try {
      const kb = await KnowledgeBaseRepository.getByBusinessId(businessId);
      if (!kb) {
        throw new Error('Knowledge base not found');
      }
      
      const newFAQ = {
        ...faq,
        id: faq.id || `faq-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      kb.faqs.push(newFAQ);
      await KnowledgeBaseRepository.save(kb);
      
      return newFAQ;
    } catch (error) {
      console.error('Error adding FAQ:', error);
      throw error;
    }
  },
  
  /**
   * Update FAQ in knowledge base
   */
  updateFAQ: async (businessId: string, faq: FAQ): Promise<FAQ> => {
    try {
      const kb = await KnowledgeBaseRepository.getByBusinessId(businessId);
      if (!kb) {
        throw new Error('Knowledge base not found');
      }
      
      const index = kb.faqs.findIndex(f => f.id === faq.id);
      if (index === -1) {
        throw new Error('FAQ not found');
      }
      
      const updatedFAQ = {
        ...faq,
        updatedAt: new Date()
      };
      
      kb.faqs[index] = updatedFAQ;
      await KnowledgeBaseRepository.save(kb);
      
      return updatedFAQ;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  },
  
  /**
   * Delete FAQ from knowledge base
   */
  deleteFAQ: async (businessId: string, faqId: string): Promise<boolean> => {
    try {
      const kb = await KnowledgeBaseRepository.getByBusinessId(businessId);
      if (!kb) {
        throw new Error('Knowledge base not found');
      }
      
      const initialLength = kb.faqs.length;
      kb.faqs = kb.faqs.filter(f => f.id !== faqId);
      
      if (kb.faqs.length === initialLength) {
        return false; // No FAQ was removed
      }
      
      await KnowledgeBaseRepository.save(kb);
      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  },
  
  // Similar methods for products, services, and custom entities
  // ...
};

/**
 * Conversation Repository
 */
export const ConversationRepository = {
  /**
   * Get all conversations for a business
   */
  getByBusinessId: async (businessId: string): Promise<Conversation[]> => {
    try {
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockConversation = getMockConversation();
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify([mockConversation]));
        return [mockConversation];
      }
      
      const conversations = JSON.parse(data) as Conversation[];
      return conversations.filter(conv => conv.businessId === businessId);
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  },
  
  /**
   * Get conversation by ID
   */
  getById: async (id: string): Promise<Conversation | null> => {
    try {
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      if (!data) {
        return null;
      }
      
      const conversations = JSON.parse(data) as Conversation[];
      return conversations.find(conv => conv.id === id) || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  },
  
  /**
   * Create a new conversation
   */
  create: async (conversation: Omit<Conversation, 'id' | 'messages'>): Promise<Conversation> => {
    try {
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      let conversations: Conversation[] = [];
      
      if (data) {
        conversations = JSON.parse(data);
      }
      
      const newConversation: Conversation = {
        ...conversation,
        id: `conv-${Date.now()}`,
        messages: [],
      };
      
      conversations.push(newConversation);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
      
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },
  
  /**
   * Update conversation status
   */
  updateStatus: async (id: string, status: Conversation['status']): Promise<Conversation | null> => {
    try {
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      if (!data) {
        return null;
      }
      
      const conversations = JSON.parse(data) as Conversation[];
      const index = conversations.findIndex(conv => conv.id === id);
      
      if (index === -1) {
        return null;
      }
      
      conversations[index].status = status;
      
      if (status === 'closed') {
        conversations[index].endTime = new Date();
      }
      
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
      return conversations[index];
    } catch (error) {
      console.error('Error updating conversation status:', error);
      return null;
    }
  },
  
  /**
   * Add message to conversation
   */
  addMessage: async (conversationId: string, message: Omit<Message, 'id' | 'conversationId'>): Promise<Message | null> => {
    try {
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      if (!data) {
        return null;
      }
      
      const conversations = JSON.parse(data) as Conversation[];
      const index = conversations.findIndex(conv => conv.id === conversationId);
      
      if (index === -1) {
        return null;
      }
      
      const newMessage: Message = {
        ...message,
        id: `msg-${Date.now()}`,
        conversationId,
      };
      
      conversations[index].messages.push(newMessage);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
      
      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  },
  
  /**
   * Mark messages as read
   */
  markMessagesAsRead: async (conversationId: string, messageIds: string[]): Promise<boolean> => {
    try {
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      if (!data) {
        return false;
      }
      
      const conversations = JSON.parse(data) as Conversation[];
      const index = conversations.findIndex(conv => conv.id === conversationId);
      
      if (index === -1) {
        return false;
      }
      
      let updated = false;
      
      conversations[index].messages = conversations[index].messages.map(msg => {
        if (messageIds.includes(msg.id) && !msg.isRead) {
          updated = true;
          return { ...msg, isRead: true };
        }
        return msg;
      });
      
      if (updated) {
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
      }
      
      return updated;
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
  getByBusinessId: async (businessId: string, period: ChatbotAnalytics['period']): Promise<ChatbotAnalytics | null> => {
    try {
      const data = localStorage.getItem(ANALYTICS_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockAnalytics = getMockChatbotAnalytics();
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify([mockAnalytics]));
        return mockAnalytics;
      }
      
      const analytics = JSON.parse(data) as ChatbotAnalytics[];
      return analytics.find(a => a.businessId === businessId && a.period === period) || null;
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  },
  
  /**
   * Save analytics
   */
  save: async (analytics: ChatbotAnalytics): Promise<ChatbotAnalytics> => {
    try {
      const data = localStorage.getItem(ANALYTICS_KEY);
      let allAnalytics: ChatbotAnalytics[] = [];
      
      if (data) {
        allAnalytics = JSON.parse(data);
      }
      
      const index = allAnalytics.findIndex(a => 
        a.businessId === analytics.businessId && 
        a.period === analytics.period
      );
      
      if (index >= 0) {
        // Update existing analytics
        allAnalytics[index] = {
          ...analytics,
          createdAt: new Date()
        };
      } else {
        // Add new analytics
        allAnalytics.push({
          ...analytics,
          id: analytics.id || `analytics-${Date.now()}`,
          createdAt: new Date()
        });
      }
      
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(allAnalytics));
      return analytics;
    } catch (error) {
      console.error('Error saving analytics:', error);
      throw error;
    }
  }
};
