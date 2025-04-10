'use client';

import { SocialPost, SocialPlatformType } from '@/models/social';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon, 
  EyeIcon 
} from '@heroicons/react/24/outline';

interface PostWithEngagement {
  id: string;
  content: string;
  platforms: SocialPlatformType[];
  publishedAt: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    impressions: number;
    reach: number;
    engagementRate: number;
  };
}

interface TopPostsTableProps {
  posts: PostWithEngagement[];
}

export default function TopPostsTable({ posts }: TopPostsTableProps) {
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
  
  // Format date
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="overflow-hidden">
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No posts data available</p>
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.id} className="py-5">
                <div className="relative focus-within:ring-2 focus-within:ring-blue-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.content}
                      </p>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="mx-1 text-gray-400">•</span>
                        <div className="flex flex-wrap gap-1">
                          {post.platforms.map((platform) => (
                            <span
                              key={platform}
                              className={`px-2 py-0.5 text-xs rounded ${getPlatformColor(platform)}`}
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {post.engagement.engagementRate.toFixed(1)}% Engagement
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <HeartIcon className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">
                        {post.engagement.likes.toLocaleString()} Likes
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">
                        {post.engagement.comments.toLocaleString()} Comments
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ShareIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">
                        {post.engagement.shares.toLocaleString()} Shares
                      </span>
                    </div>
                    <div className="flex items-center">
                      <EyeIcon className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">
                        {post.engagement.reach.toLocaleString()} Reach
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
