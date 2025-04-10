/**
 * API utility functions for making requests to the backend
 */

import { 
  SocialPost, 
  MediaAttachment, 
  SocialPlatformType,
  EngagementMetrics
} from '@/models/social';

/**
 * Base API request function
 */
async function apiRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

/**
 * Social Media API functions
 */
export const SocialApi = {
  /**
   * Create a new social media post
   */
  createPost: async (
    content: string,
    platforms: SocialPlatformType[],
    scheduledTime: Date,
    mediaAttachments: MediaAttachment[] = [],
    publishNow: boolean = false
  ): Promise<SocialPost> => {
    return apiRequest<SocialPost>('/api/social/post', 'POST', {
      content,
      platforms,
      scheduledTime: scheduledTime.toISOString(),
      mediaAttachments,
      publishNow,
      authorId: 'user-1', // In a real app, this would come from auth context
      authorName: 'John Doe', // In a real app, this would come from auth context
    });
  },

  /**
   * Get a specific social media post
   */
  getPost: async (postId: string): Promise<SocialPost> => {
    return apiRequest<SocialPost>(`/api/social/post/${postId}`);
  },

  /**
   * Update a social media post
   */
  updatePost: async (
    postId: string,
    updates: Partial<SocialPost>
  ): Promise<SocialPost> => {
    return apiRequest<SocialPost>(`/api/social/post/${postId}`, 'PUT', updates);
  },

  /**
   * Delete a social media post
   */
  deletePost: async (postId: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/api/social/post/${postId}`, 'DELETE');
  },

  /**
   * Get all scheduled posts
   */
  getScheduledPosts: async (
    platform?: SocialPlatformType,
    startDate?: Date,
    endDate?: Date
  ): Promise<SocialPost[]> => {
    let url = '/api/social/scheduled';
    const params = new URLSearchParams();

    if (platform) {
      params.append('platform', platform);
    }

    if (startDate) {
      params.append('startDate', startDate.toISOString());
    }

    if (endDate) {
      params.append('endDate', endDate.toISOString());
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return apiRequest<SocialPost[]>(url);
  },

  /**
   * Get analytics data
   */
  getAnalytics: async (
    timeframe: '7days' | '30days' | '90days' | 'custom',
    options?: {
      platform?: SocialPlatformType;
      startDate?: Date;
      endDate?: Date;
      metrics?: ('engagement' | 'followers' | 'platforms' | 'posts')[];
    }
  ): Promise<any> => {
    let url = `/api/social/analytics/${timeframe}`;
    const params = new URLSearchParams();

    if (options?.platform) {
      params.append('platform', options.platform);
    }

    if (timeframe === 'custom') {
      if (!options?.startDate || !options?.endDate) {
        throw new Error('startDate and endDate are required for custom timeframe');
      }

      params.append('startDate', options.startDate.toISOString().split('T')[0]);
      params.append('endDate', options.endDate.toISOString().split('T')[0]);
    }

    if (options?.metrics && options.metrics.length > 0) {
      params.append('metrics', options.metrics.join(','));
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return apiRequest<any>(url);
  },

  /**
   * Publish a scheduled post immediately
   */
  publishPost: async (postId: string): Promise<SocialPost> => {
    return apiRequest<SocialPost>(`/api/social/post/${postId}`, 'PUT', {
      status: 'published'
    });
  },

  /**
   * Get engagement metrics for a post
   */
  getPostEngagement: async (postId: string): Promise<EngagementMetrics> => {
    const post = await apiRequest<SocialPost>(`/api/social/post/${postId}`);
    return post.engagement as EngagementMetrics;
  }
};
