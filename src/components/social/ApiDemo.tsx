'use client';

import { useState, useEffect } from 'react';
import { SocialApi } from '@/utils/api';
import { SocialPost, SocialPlatformType } from '@/models/social';

export default function ApiDemo() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7days' | '30days' | '90days'>('30days');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
  // Load scheduled posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const scheduledPosts = await SocialApi.getScheduledPosts();
        setPosts(scheduledPosts);
      } catch (err) {
        console.error('Failed to load posts:', err);
        setError('Failed to load scheduled posts');
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);
  
  // Load analytics data
  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    
    try {
      const data = await SocialApi.getAnalytics(selectedTimeframe);
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };
  
  // Create a new post
  const createPost = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newPost = await SocialApi.createPost(
        'This is a test post created via the API',
        ['Facebook', 'Twitter'] as SocialPlatformType[],
        new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        [],
        false // Don't publish now
      );
      
      setPosts([...posts, newPost]);
      alert('Post created successfully!');
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a post
  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await SocialApi.deletePost(postId);
      
      if (result.success) {
        setPosts(posts.filter(post => post.id !== postId));
        alert('Post deleted successfully!');
      } else {
        setError('Failed to delete post');
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">API Demo</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Scheduled Posts API</h3>
            <button
              onClick={createPost}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Test Post
            </button>
            
            {loading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Scheduled Posts</h4>
              {posts.length === 0 ? (
                <p className="text-sm text-gray-500">No scheduled posts found.</p>
              ) : (
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                  {posts.map(post => (
                    <li key={post.id} className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-900">{post.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Scheduled for: {post.scheduledFor || new Date(post.scheduledTime).toLocaleString()}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.platforms.map(platform => (
                              <span
                                key={platform}
                                className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Analytics API</h3>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
              
              <button
                onClick={loadAnalytics}
                disabled={analyticsLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load Analytics
              </button>
            </div>
            
            {analyticsLoading && <p className="mt-2 text-sm text-gray-500">Loading analytics...</p>}
            
            {analyticsData && (
              <div className="mt-4 border border-gray-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Analytics Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Total Followers</p>
                    <p className="text-lg font-medium">{analyticsData.summary.totalFollowers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Follower Growth</p>
                    <p className="text-lg font-medium">{analyticsData.summary.followerGrowth}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Engagement</p>
                    <p className="text-lg font-medium">{analyticsData.summary.totalEngagement.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg. Engagement Rate</p>
                    <p className="text-lg font-medium">{analyticsData.summary.avgEngagementRate}</p>
                  </div>
                </div>
                
                {analyticsData.platforms && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Platform Performance</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Followers</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.platforms.map((platform: any) => (
                            <tr key={platform.platform}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{platform.platform}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{platform.followers.toLocaleString()}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{platform.engagement}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{platform.growth}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
