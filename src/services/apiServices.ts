/**
 * API Services
 * 
 * This file contains service functions for each module that use the API client.
 * In development/demo mode, it falls back to mock data when API calls fail.
 */

import api from './api';
import { 
  SocialPost, 
  PlatformConnection,
  getMockSocialPosts,
  getMockPlatformConnections
} from '@/models/social';

import {
  EmailCampaign,
  EmailTemplate,
  EmailAnalytics
} from '@/models/email';

import {
  WebsiteAnalytics,
  TrafficSource,
  PagePerformance
} from '@/models/analytics';

// Flag to enable/disable mock data fallback
const USE_MOCK_FALLBACK = true;

/**
 * Social Media API Service
 */
export const SocialMediaService = {
  /**
   * Get all social posts
   */
  async getPosts(): Promise<SocialPost[]> {
    try {
      return await api.get<SocialPost[]>('/api/social/posts');
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return getMockSocialPosts();
      }
      throw error;
    }
  },
  
  /**
   * Get a specific social post by ID
   */
  async getPostById(id: string): Promise<SocialPost | null> {
    try {
      return await api.get<SocialPost>(`/api/social/posts/${id}`);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        const posts = getMockSocialPosts();
        return posts.find(post => post.id === id) || null;
      }
      throw error;
    }
  },
  
  /**
   * Create a new social post
   */
  async createPost(postData: Partial<SocialPost>): Promise<SocialPost> {
    try {
      return await api.post<SocialPost>('/api/social/posts', postData);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return {
          id: `post-${Date.now()}`,
          content: postData.content || '',
          platform: postData.platform || 'twitter',
          mediaUrls: postData.mediaUrls,
          mediaType: postData.mediaUrls && postData.mediaUrls.length > 0 ? 'image' : 'text',
          status: postData.scheduledAt ? 'scheduled' : 'draft',
          scheduledAt: postData.scheduledAt,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: postData.authorId || 'user1',
          authorName: postData.authorName || 'John Smith',
          link: postData.link,
          tags: postData.tags
        };
      }
      throw error;
    }
  },
  
  /**
   * Update an existing social post
   */
  async updatePost(id: string, updates: Partial<SocialPost>): Promise<SocialPost | null> {
    try {
      return await api.put<SocialPost>(`/api/social/posts/${id}`, updates);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        const posts = getMockSocialPosts();
        const postIndex = posts.findIndex(post => post.id === id);
        
        if (postIndex === -1) return null;
        
        const updatedPost = {
          ...posts[postIndex],
          ...updates,
          updatedAt: new Date()
        };
        
        return updatedPost;
      }
      throw error;
    }
  },
  
  /**
   * Delete a social post
   */
  async deletePost(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/social/posts/${id}`);
      return true;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return true;
      }
      throw error;
    }
  },
  
  /**
   * Publish a social post immediately
   */
  async publishPost(id: string): Promise<SocialPost | null> {
    try {
      return await api.post<SocialPost>(`/api/social/posts/${id}/publish`, {});
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        const posts = getMockSocialPosts();
        const post = posts.find(p => p.id === id);
        
        if (!post) return null;
        
        const publishedPost: SocialPost = {
          ...post,
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date()
        };
        
        return publishedPost;
      }
      throw error;
    }
  },
  
  /**
   * Schedule a social post for later publication
   */
  async schedulePost(id: string, scheduledAt: Date): Promise<SocialPost | null> {
    try {
      return await api.post<SocialPost>(`/api/social/posts/${id}/schedule`, { scheduledAt });
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        const posts = getMockSocialPosts();
        const post = posts.find(p => p.id === id);
        
        if (!post) return null;
        
        const scheduledPost: SocialPost = {
          ...post,
          status: 'scheduled',
          scheduledAt,
          updatedAt: new Date()
        };
        
        return scheduledPost;
      }
      throw error;
    }
  },
  
  /**
   * Get all platform connections
   */
  async getPlatformConnections(): Promise<PlatformConnection[]> {
    try {
      return await api.get<PlatformConnection[]>('/api/social/platforms');
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return getMockPlatformConnections();
      }
      throw error;
    }
  },
  
  /**
   * Connect to a social media platform
   */
  async connectPlatform(platformData: Partial<PlatformConnection>): Promise<PlatformConnection> {
    try {
      return await api.post<PlatformConnection>('/api/social/platforms', platformData);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return {
          id: `conn-${Date.now()}`,
          platform: platformData.platform || 'twitter',
          accountId: platformData.accountId || 'account123',
          accountName: platformData.accountName || 'Account Name',
          accountImageUrl: platformData.accountImageUrl,
          connected: true,
          lastSyncedAt: new Date()
        };
      }
      throw error;
    }
  },
  
  /**
   * Disconnect from a social media platform
   */
  async disconnectPlatform(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/social/platforms/${id}`);
      return true;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return true;
      }
      throw error;
    }
  }
};

/**
 * Email Marketing API Service
 */
export const EmailService = {
  /**
   * Get all email campaigns
   */
  async getCampaigns(): Promise<EmailCampaign[]> {
    try {
      return await api.get<EmailCampaign[]>('/api/email/campaigns');
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return []; // Would return mock data in a real implementation
      }
      throw error;
    }
  },
  
  /**
   * Get a specific email campaign by ID
   */
  async getCampaignById(id: string): Promise<EmailCampaign | null> {
    try {
      return await api.get<EmailCampaign>(`/api/email/campaigns/${id}`);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return null; // Would return mock data in a real implementation
      }
      throw error;
    }
  },
  
  /**
   * Create a new email campaign
   */
  async createCampaign(campaignData: Partial<EmailCampaign>): Promise<EmailCampaign> {
    try {
      return await api.post<EmailCampaign>('/api/email/campaigns', campaignData);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return {
          id: `campaign-${Date.now()}`,
          name: campaignData.name || 'New Campaign',
          subject: campaignData.subject || '',
          content: campaignData.content || '',
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
          // Add other properties as needed
        } as EmailCampaign;
      }
      throw error;
    }
  },
  
  /**
   * Get all email templates
   */
  async getTemplates(): Promise<EmailTemplate[]> {
    try {
      return await api.get<EmailTemplate[]>('/api/email/templates');
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return []; // Would return mock data in a real implementation
      }
      throw error;
    }
  },
  
  /**
   * Get email analytics
   */
  async getAnalytics(campaignId?: string): Promise<EmailAnalytics> {
    try {
      const endpoint = campaignId 
        ? `/api/email/analytics?campaignId=${campaignId}`
        : '/api/email/analytics';
      return await api.get<EmailAnalytics>(endpoint);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return {} as EmailAnalytics; // Would return mock data in a real implementation
      }
      throw error;
    }
  }
};

/**
 * Analytics API Service
 */
export const AnalyticsService = {
  /**
   * Get website analytics overview
   */
  async getOverview(timeframe: string = '30d'): Promise<WebsiteAnalytics> {
    try {
      return await api.get<WebsiteAnalytics>(`/api/analytics/overview?timeframe=${timeframe}`);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return {} as WebsiteAnalytics; // Would return mock data in a real implementation
      }
      throw error;
    }
  },
  
  /**
   * Get traffic sources
   */
  async getTrafficSources(timeframe: string = '30d'): Promise<TrafficSource[]> {
    try {
      return await api.get<TrafficSource[]>(`/api/analytics/traffic-sources?timeframe=${timeframe}`);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return []; // Would return mock data in a real implementation
      }
      throw error;
    }
  },
  
  /**
   * Get page performance
   */
  async getPagePerformance(timeframe: string = '30d'): Promise<PagePerformance[]> {
    try {
      return await api.get<PagePerformance[]>(`/api/analytics/page-performance?timeframe=${timeframe}`);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return []; // Would return mock data in a real implementation
      }
      throw error;
    }
  },
  
  /**
   * Get real-time analytics
   */
  async getRealTimeAnalytics(): Promise<any> {
    try {
      return await api.get<any>('/api/analytics/real-time');
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        console.warn('API call failed, using mock data:', error);
        return {}; // Would return mock data in a real implementation
      }
      throw error;
    }
  }
};
