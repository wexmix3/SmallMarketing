'use client';

import { useState, useEffect } from 'react';
import {
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { SocialPost, SocialPlatformType } from '@/models/social';
import { useSocialMedia } from '@/hooks/useSocialMedia';

interface ScheduledPostsProps {
  posts?: SocialPost[];
  onEdit?: (post: SocialPost) => void;
  onDelete?: (postId: string) => void;
}

export default function ScheduledPosts({ posts: propPosts, onEdit, onDelete }: ScheduledPostsProps) {
  const { posts: hookPosts, getPostsByStatus, deletePost, loading } = useSocialMedia();
  const [localPosts, setLocalPosts] = useState<SocialPost[]>([]);
  const [filter, setFilter] = useState<SocialPlatformType | 'all'>('all');
  const [isDeleting, setIsDeleting] = useState(false);

  // Use posts from props if provided, otherwise use posts from hook
  useEffect(() => {
    if (propPosts) {
      setLocalPosts(propPosts);
    } else {
      // Load scheduled posts from the hook
      const loadPosts = async () => {
        const scheduledPosts = await getPostsByStatus('scheduled');
        setLocalPosts(scheduledPosts);
      };

      loadPosts();
    }
  }, [propPosts, getPostsByStatus, hookPosts]);

  // Filter posts by platform
  const filteredPosts = filter === 'all'
    ? localPosts
    : localPosts.filter(post => post.platforms.includes(filter as SocialPlatformType));

  // Sort posts by scheduled date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (!a.scheduledTime || !b.scheduledTime) return 0;

    // Convert string dates to Date objects if needed
    const dateA = a.scheduledTime instanceof Date ? a.scheduledTime : new Date(a.scheduledTime);
    const dateB = b.scheduledTime instanceof Date ? b.scheduledTime : new Date(b.scheduledTime);

    return dateA.getTime() - dateB.getTime();
  });

  // Format date for display
  const formatDate = (dateStr: string | undefined, date: Date) => {
    if (!date) return dateStr || 'Unknown date';

    // Convert string date to Date object if needed
    const dateObj = date instanceof Date ? date : new Date(date);

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateObj.toDateString() === now.toDateString()) {
      return `Today, ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) +
        `, ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  // Get platform badge color
  const getPlatformColor = (platform: SocialPlatformType) => {
    switch (platform) {
      case 'Facebook':
        return 'bg-blue-100 text-blue-800';
      case 'Instagram':
        return 'bg-pink-100 text-pink-800';
      case 'Twitter':
        return 'bg-blue-100 text-blue-800';
      case 'LinkedIn':
        return 'bg-blue-100 text-blue-800';
      case 'Pinterest':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle edit post
  const handleEditPost = (post: SocialPost) => {
    if (onEdit) {
      onEdit(post);
    } else {
      // Default edit behavior if no onEdit prop
      console.log('Edit post:', post.id);
      // In a real app, you might navigate to an edit page or open a modal
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);

      try {
        if (onDelete) {
          onDelete(postId);
        } else {
          // Use the hook's delete function
          await deletePost(postId);

          // Update local state
          setLocalPosts(prev => prev.filter(p => p.id !== postId));
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Scheduled Posts</h3>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as SocialPlatformType | 'all')}
            className="block rounded-md border-gray-300 py-1 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Pinterest">Pinterest</option>
          </select>
        </div>
      </div>
      <div className="border-t border-gray-200">
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading posts...</p>
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No scheduled posts found.
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {sortedPosts.map((post) => (
              <li key={post.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 mb-2">{post.content}</div>
                    {post.mediaAttachments && post.mediaAttachments.length > 0 && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <EyeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span>{post.mediaAttachments.length} media attachment{post.mediaAttachments.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span>{formatDate(post.scheduledFor, post.scheduledTime)}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.platforms.map((platform) => (
                        <span
                          key={platform}
                          className={`px-2 py-1 text-xs rounded ${getPlatformColor(platform)}`}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditPost(post)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={isDeleting}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
