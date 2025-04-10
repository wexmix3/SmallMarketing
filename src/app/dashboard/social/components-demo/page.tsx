'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import PostCreator from '@/components/social/PostCreator';
import MediaUploader from '@/components/social/MediaUploader';
import SchedulingCalendar from '@/components/social/SchedulingCalendar';
import AnalyticsDashboard from '@/components/social/AnalyticsDashboard';

export default function ComponentsDemoPage() {
  const [activeTab, setActiveTab] = useState<'postcreator' | 'mediauploader' | 'calendar' | 'analytics'>('postcreator');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link 
          href="/dashboard/social" 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Social Media Components</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('postcreator')}
              className={`
                w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'postcreator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              PostCreator
            </button>
            <button
              onClick={() => setActiveTab('mediauploader')}
              className={`
                w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'mediauploader'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              MediaUploader
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`
                w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              SchedulingCalendar
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`
                w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              AnalyticsDashboard
            </button>
          </nav>
        </div>
        
        {/* Component display */}
        <div className="p-6">
          {activeTab === 'postcreator' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Post Creator Component</h2>
              <p className="text-gray-500 mb-6">
                The PostCreator component allows users to create and schedule social media posts across multiple platforms.
                It includes platform selection, media uploads, emoji picker, hashtags, mentions, and scheduling options.
              </p>
              <PostCreator onPostCreated={() => alert('Post created!')} />
            </div>
          )}
          
          {activeTab === 'mediauploader' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Media Uploader Component</h2>
              <p className="text-gray-500 mb-6">
                The MediaUploader component provides a drag-and-drop interface for uploading images, videos, and other media files.
                It includes preview functionality, file type validation, and size limits.
              </p>
              <MediaUploader 
                onMediaChange={(media) => console.log('Media changed:', media)} 
                maxFiles={5}
                allowedTypes={['image', 'video', 'gif']}
              />
            </div>
          )}
          
          {activeTab === 'calendar' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Scheduling Calendar Component</h2>
              <p className="text-gray-500 mb-6">
                The SchedulingCalendar component provides a calendar view for scheduling and managing social media posts.
                It allows users to see posts scheduled for specific dates, create new posts, and edit or delete existing ones.
              </p>
              <SchedulingCalendar 
                onDateSelect={(date) => console.log('Date selected:', date)} 
              />
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics Dashboard Component</h2>
              <p className="text-gray-500 mb-6">
                The AnalyticsDashboard component displays engagement metrics, follower growth, platform performance,
                and top-performing posts. It includes filtering by platform and timeframe.
              </p>
              <AnalyticsDashboard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
