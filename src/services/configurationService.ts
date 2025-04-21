/**
 * Configuration Service
 * 
 * This service manages chatbot configuration settings, including appearance,
 * behavior, and integration settings.
 */

import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { ChatbotConfig, AppearanceSettings, BehaviorSettings, IntegrationSettings } from '../types/chatbot';

export class ConfigurationService {
  private db: Pool;
  
  constructor(dbConnection: Pool) {
    this.db = dbConnection;
  }
  
  /**
   * Get chatbot configuration for a business
   */
  async getConfiguration(businessId: string): Promise<ChatbotConfig | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM chatbot_config WHERE business_id = $1',
        [businessId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const config = result.rows[0];
      return {
        id: config.id,
        businessId: config.business_id,
        name: config.name,
        welcomeMessage: config.welcome_message,
        fallbackMessage: config.fallback_message,
        transferMessage: config.transfer_message,
        offlineMessage: config.offline_message,
        appearance: config.appearance,
        behavior: config.behavior,
        integrations: config.integrations,
        aiSettings: config.ai_settings,
        createdAt: config.created_at,
        updatedAt: config.updated_at
      };
    } catch (error) {
      console.error('Error getting chatbot configuration:', error);
      return null;
    }
  }
  
  /**
   * Create or update chatbot configuration
   */
  async saveConfiguration(
    businessId: string,
    config: Partial<ChatbotConfig>
  ): Promise<ChatbotConfig> {
    try {
      // Check if configuration exists
      const existingConfig = await this.getConfiguration(businessId);
      
      if (existingConfig) {
        // Update existing configuration
        return await this.updateConfiguration(businessId, config);
      } else {
        // Create new configuration
        return await this.createConfiguration(businessId, config);
      }
    } catch (error) {
      console.error('Error saving chatbot configuration:', error);
      throw error;
    }
  }
  
  /**
   * Create new chatbot configuration
   */
  private async createConfiguration(
    businessId: string,
    config: Partial<ChatbotConfig>
  ): Promise<ChatbotConfig> {
    try {
      const configId = uuidv4();
      const now = new Date();
      
      // Set default values
      const defaultConfig: ChatbotConfig = {
        id: configId,
        businessId,
        name: config.name || 'Customer Service Assistant',
        welcomeMessage: config.welcomeMessage || 'Hello! How can I help you today?',
        fallbackMessage: config.fallbackMessage || "I'm sorry, I didn't understand that. Could you please rephrase your question?",
        transferMessage: config.transferMessage || "I'll connect you with a human agent who can better assist you.",
        offlineMessage: config.offlineMessage || "We're currently offline. Please leave a message and we'll get back to you soon.",
        appearance: config.appearance || this.getDefaultAppearance(),
        behavior: config.behavior || this.getDefaultBehavior(),
        integrations: config.integrations || this.getDefaultIntegrations(),
        aiSettings: config.aiSettings || {
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 150,
          topP: 1,
          presencePenalty: 0,
          frequencyPenalty: 0
        },
        createdAt: now,
        updatedAt: now
      };
      
      // Insert into database
      await this.db.query(
        `INSERT INTO chatbot_config 
         (id, business_id, name, welcome_message, fallback_message, transfer_message, offline_message, 
          appearance, behavior, integrations, ai_settings, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          defaultConfig.id,
          defaultConfig.businessId,
          defaultConfig.name,
          defaultConfig.welcomeMessage,
          defaultConfig.fallbackMessage,
          defaultConfig.transferMessage,
          defaultConfig.offlineMessage,
          defaultConfig.appearance,
          defaultConfig.behavior,
          defaultConfig.integrations,
          defaultConfig.aiSettings,
          defaultConfig.createdAt,
          defaultConfig.updatedAt
        ]
      );
      
      return defaultConfig;
    } catch (error) {
      console.error('Error creating chatbot configuration:', error);
      throw error;
    }
  }
  
  /**
   * Update existing chatbot configuration
   */
  private async updateConfiguration(
    businessId: string,
    config: Partial<ChatbotConfig>
  ): Promise<ChatbotConfig> {
    try {
      const now = new Date();
      
      // Build the SET clause dynamically based on provided fields
      const updates = [];
      const values = [businessId];
      let paramIndex = 2;
      
      if (config.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(config.name);
      }
      
      if (config.welcomeMessage !== undefined) {
        updates.push(`welcome_message = $${paramIndex++}`);
        values.push(config.welcomeMessage);
      }
      
      if (config.fallbackMessage !== undefined) {
        updates.push(`fallback_message = $${paramIndex++}`);
        values.push(config.fallbackMessage);
      }
      
      if (config.transferMessage !== undefined) {
        updates.push(`transfer_message = $${paramIndex++}`);
        values.push(config.transferMessage);
      }
      
      if (config.offlineMessage !== undefined) {
        updates.push(`offline_message = $${paramIndex++}`);
        values.push(config.offlineMessage);
      }
      
      if (config.appearance !== undefined) {
        updates.push(`appearance = $${paramIndex++}`);
        values.push(config.appearance);
      }
      
      if (config.behavior !== undefined) {
        updates.push(`behavior = $${paramIndex++}`);
        values.push(config.behavior);
      }
      
      if (config.integrations !== undefined) {
        updates.push(`integrations = $${paramIndex++}`);
        values.push(config.integrations);
      }
      
      if (config.aiSettings !== undefined) {
        updates.push(`ai_settings = $${paramIndex++}`);
        values.push(config.aiSettings);
      }
      
      updates.push(`updated_at = $${paramIndex++}`);
      values.push(now);
      
      if (updates.length === 1) {
        // Only updated_at was added, nothing else to update
        return (await this.getConfiguration(businessId))!;
      }
      
      // Update the configuration
      await this.db.query(
        `UPDATE chatbot_config
         SET ${updates.join(', ')}
         WHERE business_id = $1`,
        values
      );
      
      // Get the updated configuration
      return (await this.getConfiguration(businessId))!;
    } catch (error) {
      console.error('Error updating chatbot configuration:', error);
      throw error;
    }
  }
  
  /**
   * Update appearance settings
   */
  async updateAppearance(
    businessId: string,
    appearance: Partial<AppearanceSettings>
  ): Promise<ChatbotConfig | null> {
    try {
      // Get current configuration
      const config = await this.getConfiguration(businessId);
      
      if (!config) {
        return null;
      }
      
      // Merge with existing appearance settings
      const updatedAppearance = {
        ...config.appearance,
        ...appearance
      };
      
      // Update configuration
      return await this.saveConfiguration(businessId, {
        appearance: updatedAppearance
      });
    } catch (error) {
      console.error('Error updating appearance settings:', error);
      return null;
    }
  }
  
  /**
   * Update behavior settings
   */
  async updateBehavior(
    businessId: string,
    behavior: Partial<BehaviorSettings>
  ): Promise<ChatbotConfig | null> {
    try {
      // Get current configuration
      const config = await this.getConfiguration(businessId);
      
      if (!config) {
        return null;
      }
      
      // Merge with existing behavior settings
      const updatedBehavior = {
        ...config.behavior,
        ...behavior
      };
      
      // Update configuration
      return await this.saveConfiguration(businessId, {
        behavior: updatedBehavior
      });
    } catch (error) {
      console.error('Error updating behavior settings:', error);
      return null;
    }
  }
  
  /**
   * Update integration settings
   */
  async updateIntegrations(
    businessId: string,
    integrations: Partial<IntegrationSettings>
  ): Promise<ChatbotConfig | null> {
    try {
      // Get current configuration
      const config = await this.getConfiguration(businessId);
      
      if (!config) {
        return null;
      }
      
      // Merge with existing integration settings
      const updatedIntegrations = {
        ...config.integrations,
        ...integrations
      };
      
      // Update configuration
      return await this.saveConfiguration(businessId, {
        integrations: updatedIntegrations
      });
    } catch (error) {
      console.error('Error updating integration settings:', error);
      return null;
    }
  }
  
  /**
   * Update AI settings
   */
  async updateAISettings(
    businessId: string,
    aiSettings: Partial<any>
  ): Promise<ChatbotConfig | null> {
    try {
      // Get current configuration
      const config = await this.getConfiguration(businessId);
      
      if (!config) {
        return null;
      }
      
      // Merge with existing AI settings
      const updatedAISettings = {
        ...config.aiSettings,
        ...aiSettings
      };
      
      // Update configuration
      return await this.saveConfiguration(businessId, {
        aiSettings: updatedAISettings
      });
    } catch (error) {
      console.error('Error updating AI settings:', error);
      return null;
    }
  }
  
  /**
   * Get default appearance settings
   */
  private getDefaultAppearance(): AppearanceSettings {
    return {
      theme: 'light',
      position: 'right',
      primaryColor: '#0070f3',
      secondaryColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      logoUrl: '',
      avatarUrl: ''
    };
  }
  
  /**
   * Get default behavior settings
   */
  private getDefaultBehavior(): BehaviorSettings {
    return {
      autoShowDelay: 5,
      collectEmail: true,
      collectName: true,
      requireContactInfo: false,
      showTypingIndicator: true,
      enableFileUploads: false,
      maxAttachmentSize: 5 * 1024 * 1024 // 5MB
    };
  }
  
  /**
   * Get default integration settings
   */
  private getDefaultIntegrations(): IntegrationSettings {
    return {
      calendarType: undefined,
      calendarId: undefined,
      crmType: undefined,
      crmId: undefined,
      emailMarketing: false,
      emailMarketingProvider: undefined
    };
  }
}
