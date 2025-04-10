/**
 * Social Media Repository
 * 
 * This repository handles data persistence for social media entities.
 * In a real application, this would interact with a database.
 * For this demo, we're using localStorage for persistence.
 */

import { 
  Platform, 
  SocialPost, 
  EngagementMetrics,
  SocialPlatformType,
  getMockScheduledPosts,
  getMockPublishedPosts,
  getMockSocialAccounts
} from '@/models/social';

// Storage keys
const PLATFORMS_KEY = 'social_platforms';
const POSTS_KEY = 'social_posts';
const ENGAGEMENT_KEY = 'social_engagement';

/**
 * Platform Repository
 */
export const PlatformRepository = {
  /**
   * Get all platforms
   */
  getAll: async (): Promise<Platform[]> => {
    try {
      const data = localStorage.getItem(PLATFORMS_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockAccounts = getMockSocialAccounts();
        const platforms: Platform[] = mockAccounts.map(account => ({
          id: `platform-${account.id}`,
          platformType: account.name,
          name: account.name,
          icon: account.icon,
          connected: account.connected,
          connectionStatus: account.connected ? 'connected' : 'disconnected',
          username: account.username,
          credentials: {},
          metrics: account.metrics,
          settings: {
            autoPublish: false,
            defaultHashtags: [],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        
        localStorage.setItem(PLATFORMS_KEY, JSON.stringify(platforms));
        return platforms;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting platforms:', error);
      return [];
    }
  },
  
  /**
   * Get a platform by ID
   */
  getById: async (id: string): Promise<Platform | null> => {
    try {
      const platforms = await PlatformRepository.getAll();
      return platforms.find(platform => platform.id === id) || null;
    } catch (error) {
      console.error('Error getting platform by ID:', error);
      return null;
    }
  },
  
  /**
   * Get platforms by type
   */
  getByType: async (platformType: SocialPlatformType): Promise<Platform[]> => {
    try {
      const platforms = await PlatformRepository.getAll();
      return platforms.filter(platform => platform.platformType === platformType);
    } catch (error) {
      console.error('Error getting platforms by type:', error);
      return [];
    }
  },
  
  /**
   * Save a platform
   */
  save: async (platform: Platform): Promise<Platform> => {
    try {
      const platforms = await PlatformRepository.getAll();
      const index = platforms.findIndex(p => p.id === platform.id);
      
      if (index >= 0) {
        // Update existing platform
        platforms[index] = {
          ...platform,
          updatedAt: new Date()
        };
      } else {
        // Add new platform
        platforms.push({
          ...platform,
          id: platform.id || `platform-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      localStorage.setItem(PLATFORMS_KEY, JSON.stringify(platforms));
      return platform;
    } catch (error) {
      console.error('Error saving platform:', error);
      throw error;
    }
  },
  
  /**
   * Delete a platform
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const platforms = await PlatformRepository.getAll();
      const filteredPlatforms = platforms.filter(platform => platform.id !== id);
      
      if (filteredPlatforms.length === platforms.length) {
        return false; // No platform was removed
      }
      
      localStorage.setItem(PLATFORMS_KEY, JSON.stringify(filteredPlatforms));
      return true;
    } catch (error) {
      console.error('Error deleting platform:', error);
      return false;
    }
  }
};

/**
 * Post Repository
 */
export const PostRepository = {
  /**
   * Get all posts
   */
  getAll: async (): Promise<SocialPost[]> => {
    try {
      const data = localStorage.getItem(POSTS_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockScheduledPosts = getMockScheduledPosts();
        const mockPublishedPosts = getMockPublishedPosts();
        
        // Convert to new format
        const posts: SocialPost[] = [
          ...mockScheduledPosts.map(post => ({
            ...post,
            id: post.id.toString(),
            mediaAttachments: post.media || [],
            author: {
              id: 'user-1',
              name: 'John Doe'
            }
          })),
          ...mockPublishedPosts.map(post => ({
            ...post,
            id: post.id.toString(),
            mediaAttachments: post.media || [],
            author: {
              id: 'user-1',
              name: 'John Doe'
            }
          }))
        ];
        
        localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
        return posts;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },
  
  /**
   * Get a post by ID
   */
  getById: async (id: string): Promise<SocialPost | null> => {
    try {
      const posts = await PostRepository.getAll();
      return posts.find(post => post.id === id) || null;
    } catch (error) {
      console.error('Error getting post by ID:', error);
      return null;
    }
  },
  
  /**
   * Get posts by status
   */
  getByStatus: async (status: SocialPost['status']): Promise<SocialPost[]> => {
    try {
      const posts = await PostRepository.getAll();
      return posts.filter(post => post.status === status);
    } catch (error) {
      console.error('Error getting posts by status:', error);
      return [];
    }
  },
  
  /**
   * Get posts by platform
   */
  getByPlatform: async (platformType: SocialPlatformType): Promise<SocialPost[]> => {
    try {
      const posts = await PostRepository.getAll();
      return posts.filter(post => post.platforms.includes(platformType));
    } catch (error) {
      console.error('Error getting posts by platform:', error);
      return [];
    }
  },
  
  /**
   * Get posts scheduled for a specific date
   */
  getByScheduledDate: async (date: Date): Promise<SocialPost[]> => {
    try {
      const posts = await PostRepository.getAll();
      return posts.filter(post => {
        if (!post.scheduledTime) return false;
        
        const postDate = new Date(post.scheduledTime);
        return (
          postDate.getFullYear() === date.getFullYear() &&
          postDate.getMonth() === date.getMonth() &&
          postDate.getDate() === date.getDate()
        );
      });
    } catch (error) {
      console.error('Error getting posts by scheduled date:', error);
      return [];
    }
  },
  
  /**
   * Save a post
   */
  save: async (post: SocialPost): Promise<SocialPost> => {
    try {
      const posts = await PostRepository.getAll();
      const index = posts.findIndex(p => p.id === post.id);
      
      if (index >= 0) {
        // Update existing post
        posts[index] = {
          ...post,
          updatedAt: new Date()
        };
      } else {
        // Add new post
        posts.push({
          ...post,
          id: post.id || `post-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      return post;
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  },
  
  /**
   * Delete a post
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const posts = await PostRepository.getAll();
      const filteredPosts = posts.filter(post => post.id !== id);
      
      if (filteredPosts.length === posts.length) {
        return false; // No post was removed
      }
      
      localStorage.setItem(POSTS_KEY, JSON.stringify(filteredPosts));
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }
};

/**
 * Engagement Repository
 */
export const EngagementRepository = {
  /**
   * Get engagement metrics for a post
   */
  getByPostId: async (postId: string): Promise<EngagementMetrics | null> => {
    try {
      const data = localStorage.getItem(ENGAGEMENT_KEY);
      if (!data) return null;
      
      const engagementMap = JSON.parse(data);
      return engagementMap[postId] || null;
    } catch (error) {
      console.error('Error getting engagement metrics:', error);
      return null;
    }
  },
  
  /**
   * Save engagement metrics for a post
   */
  save: async (postId: string, metrics: EngagementMetrics): Promise<EngagementMetrics> => {
    try {
      const data = localStorage.getItem(ENGAGEMENT_KEY);
      const engagementMap = data ? JSON.parse(data) : {};
      
      engagementMap[postId] = {
        ...metrics,
        updatedAt: new Date()
      };
      
      localStorage.setItem(ENGAGEMENT_KEY, JSON.stringify(engagementMap));
      return metrics;
    } catch (error) {
      console.error('Error saving engagement metrics:', error);
      throw error;
    }
  }
};
