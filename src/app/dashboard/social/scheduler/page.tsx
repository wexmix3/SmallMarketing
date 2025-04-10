'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import PostScheduler from '@/components/social/PostScheduler';
import ScheduledPosts from '@/components/social/ScheduledPosts';
import { SocialPost, MediaAttachment, SocialPlatformType } from '@/models/social';
import { useSocialMedia } from '@/hooks/useSocialMedia';

export default function SocialMediaSchedulerPage() {
  const {
    posts,
    createPost,
    deletePost,
    getPostsByStatus,
    loading
  } = useSocialMedia();

  const [scheduledPosts, setScheduledPosts] = useState<SocialPost[]>([]);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);

  // Load scheduled posts
  useEffect(() => {
    const loadPosts = async () => {
      const posts = await getPostsByStatus('scheduled');
      setScheduledPosts(posts);
    };

    loadPosts();
  }, [getPostsByStatus]);

  // Handle scheduling a new post
  const handleSchedulePost = async (post: {
    content: string;
    platforms: SocialPlatformType[];
    scheduledDate: Date;
    mediaAttachments: MediaAttachment[];
  }) => {
    try {
      // If we're editing an existing post
      if (editingPost) {
        // In a real app, you would update the post in the database
        console.log('Updating post:', editingPost.id, post);

        // For now, just update the local state
        const updatedPosts = scheduledPosts.map(p =>
          p.id === editingPost.id
            ? {
                ...p,
                content: post.content,
                platforms: post.platforms,
                scheduledTime: post.scheduledDate,
                scheduledFor: formatScheduledDate(post.scheduledDate),
                mediaAttachments: post.mediaAttachments,
                updatedAt: new Date()
              }
            : p
        );

        setScheduledPosts(updatedPosts);
        setEditingPost(null);
      } else {
        // Create a new post using the hook
        const newPost = await createPost(
          post.content,
          post.platforms,
          post.scheduledDate,
          post.mediaAttachments
        );

        // Update local state
        setScheduledPosts(prev => [...prev, newPost]);
      }
    } catch (error) {
      console.error('Failed to schedule post:', error);
      alert('Failed to schedule post. Please try again.');
    }
  };

  // Format scheduled date for display
  const formatScheduledDate = (date: Date) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
        `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  // Handle editing a post
  const handleEditPost = (post: SocialPost) => {
    setEditingPost(post);
    // In a real app, you would populate the form with the post data
    console.log('Editing post:', post);
  };

  // Handle deleting a post
  const handleDeletePost = async (postId: string) => {
    try {
      // Delete the post using the hook
      await deletePost(postId);

      // Update local state
      setScheduledPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/dashboard/social"
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Social Media Scheduler</h1>
        </div>
        <Link
          href="/dashboard/social/calendar"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <CalendarIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
          Calendar View
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PostScheduler onSchedule={handleSchedulePost} />
        </div>
        <div>
          <ScheduledPosts
            posts={scheduledPosts}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        </div>
      </div>
    </div>
  );
}
