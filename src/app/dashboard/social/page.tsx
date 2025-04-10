'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  CalendarIcon,
  PaperClipIcon,
  PhotoIcon,
  VideoCameraIcon,
  LinkIcon,
  FaceSmileIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { getMockSocialAccounts, getMockScheduledPosts } from '@/models/social';

// Get mock data
const socialAccounts = getMockSocialAccounts();
const scheduledPosts = getMockScheduledPosts();

// Feature cards for the dashboard
const featureCards = [
  {
    title: 'Post Scheduler',
    description: 'Create and schedule posts across multiple platforms',
    icon: ClockIcon,
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    link: '/dashboard/social/scheduler'
  },
  {
    title: 'Content Calendar',
    description: 'View and manage your content schedule in a calendar view',
    icon: CalendarIcon,
    color: 'bg-green-50',
    textColor: 'text-green-700',
    link: '/dashboard/social/calendar'
  },
  {
    title: 'Analytics',
    description: 'Track engagement and performance across platforms',
    icon: ChartBarIcon,
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    link: '/dashboard/social/analytics'
  },
  {
    title: 'API Demo',
    description: 'Explore the Social Media Management API endpoints',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    link: '/dashboard/social/api-demo'
  },
  {
    title: 'Components',
    description: 'Explore the Social Media Management UI components',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    color: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    link: '/dashboard/social/components-demo'
  },
]

export default function SocialMediaPage() {
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: true,
    instagram: true,
    twitter: true,
    linkedin: false,
  });

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms({
      ...selectedPlatforms,
      [platform]: !selectedPlatforms[platform as keyof typeof selectedPlatforms],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Social Media Management</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Connect Account
        </button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {featureCards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className={`${card.color} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center mb-4">
              <card.icon className={`h-8 w-8 ${card.textColor}`} />
              <h3 className={`ml-3 text-lg font-medium ${card.textColor}`}>{card.title}</h3>
            </div>
            <p className="text-gray-600">{card.description}</p>
          </Link>
        ))}
      </div>

      {/* Connected Accounts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Connected Accounts</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your social media accounts
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {socialAccounts.map((account) => (
              <li key={account.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {/* Placeholder for social media icon */}
                      <span className="text-lg font-bold">{account.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{account.name}</div>
                      {account.connected ? (
                        <div className="text-sm text-gray-500">{account.username}</div>
                      ) : (
                        <div className="text-sm text-gray-500">Not connected</div>
                      )}
                    </div>
                  </div>
                  <div>
                    {account.connected ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Connected
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Post</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="post-content" className="sr-only">
                Post content
              </label>
              <textarea
                id="post-content"
                name="post-content"
                rows={4}
                className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                placeholder="What would you like to share?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PhotoIcon className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Photo
              </button>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <VideoCameraIcon className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Video
              </button>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LinkIcon className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Link
              </button>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaceSmileIcon className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Emoji
              </button>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PaperClipIcon className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Attachment
              </button>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Post to:</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePlatformToggle('facebook')}
                  className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    selectedPlatforms.facebook
                      ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => handlePlatformToggle('instagram')}
                  className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    selectedPlatforms.instagram
                      ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Instagram
                </button>
                <button
                  type="button"
                  onClick={() => handlePlatformToggle('twitter')}
                  className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    selectedPlatforms.twitter
                      ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Twitter
                </button>
                <button
                  type="button"
                  onClick={() => handlePlatformToggle('linkedin')}
                  className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    selectedPlatforms.linkedin
                      ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  LinkedIn
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CalendarIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                Schedule
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Post Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Scheduled Posts</h3>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CalendarIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Calendar View
          </button>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {scheduledPosts.map((post) => (
              <li key={post.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 mb-2">{post.content}</div>
                    {post.media && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <PhotoIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span>{post.media}</span>
                      </div>
                    )}
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span>{post.scheduledFor}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
