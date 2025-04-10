'use client';

import { useState, useEffect } from 'react';
import {
  SocialPost,
  SocialPlatform,
  EngagementMetrics,
  PostStatus,
  getMockSocialPosts,
  getMockPlatformConnections,
  getMockContentCalendar,
  getMockSocialAnalytics
} from '@/models/social';

import {
  getSocialPosts,
  createSocialPost,
  updateSocialPost,
  publishSocialPost,
  scheduleSocialPost,
  deleteSocialPost,
  getPlatformConnections,
  connectPlatform,
  disconnectPlatform
} from '@/services/socialMediaService';

/**
 * Hook for managing social media functionality
 */
export function useSocialMedia() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // In a real app, these would be API calls
        const postsData = await getSocialPosts();
        const platformsData = await getPlatformConnections();

        setPosts(postsData);
        setPlatforms(platformsData);
      } catch (err) {
        setError('Failed to load social media data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Create a new social media post
   */
  const handleCreatePost = async (
    content: string,
    platform: string,
    mediaUrls?: string[],
    scheduledAt?: Date
  ) => {
    try {
      setLoading(true);
      const post = await createSocialPost(
        content,
        platform as any,
        'user1',
        'John Doe',
        mediaUrls,
        scheduledAt
      );

      setPosts(prev => [...prev, post]);
      return post;
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Schedule a post for publishing
   */
  const handleSchedulePost = async (postId: string, scheduledAt: Date) => {
    try {
      setLoading(true);
      const post = await scheduleSocialPost(postId, scheduledAt);

      if (post) {
        setPosts(prev => prev.map(p => p.id === postId ? post : p));
      }

      return post;
    } catch (err) {
      setError('Failed to schedule post');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Publish a post immediately
   */
  const handlePublishPost = async (postId: string) => {
    try {
      setLoading(true);
      const post = await publishSocialPost(postId);

      if (post) {
        setPosts(prev => prev.map(p => p.id === postId ? post : p));
      }

      return post;
    } catch (err) {
      setError('Failed to publish post');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connect to a social platform
   */
  const handleConnectPlatform = async (platform: string, accountName: string) => {
    try {
      setLoading(true);
      const connection = await connectPlatform(platform as any, accountName, accountName);

      setPlatforms(prev => [...prev, connection]);
      return connection;
    } catch (err) {
      setError('Failed to connect platform');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    posts,
    platforms,
    loading,
    error,

    // Actions
    createPost: handleCreatePost,
    schedulePost: handleSchedulePost,
    publishPost: handlePublishPost,
    connectPlatform: handleConnectPlatform,
    disconnectPlatform
  };
}
