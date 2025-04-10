'use client';

import { useState } from 'react';
import {
  CalendarIcon,
  PaperAirplaneIcon,
  ClockIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { SocialPlatformType, MediaAttachment } from '@/models/social';
import { useSocialMedia } from '@/hooks/useSocialMedia';
import MediaUploader from './MediaUploader';

interface PostSchedulerProps {
  onSchedule?: (post: {
    content: string;
    platforms: SocialPlatformType[];
    scheduledDate: Date;
    mediaAttachments: MediaAttachment[];
  }) => void;
}

export default function PostScheduler({ onSchedule }: PostSchedulerProps) {
  const { createPost, platforms, loading } = useSocialMedia();

  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatformType[]>(['Facebook']);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [schedulingMode, setSchedulingMode] = useState<'now' | 'later'>('now');
  const [mediaAttachments, setMediaAttachments] = useState<MediaAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Handle platform selection
  const togglePlatform = (platform: SocialPlatformType) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(scheduledDate);
    newDate.setFullYear(
      ...e.target.value.split('-').map(Number) as [number, number, number]
    );
    setScheduledDate(newDate);
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(scheduledDate);
    const [hours, minutes] = e.target.value.split(':').map(Number);
    newDate.setHours(hours, minutes);
    setScheduledDate(newDate);
  };

  // Handle media change
  const handleMediaChange = (media: MediaAttachment[]) => {
    setMediaAttachments(media);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim() === '') {
      alert('Please enter some content for your post');
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    const postData = {
      content,
      platforms: selectedPlatforms,
      scheduledDate: schedulingMode === 'now' ? new Date() : scheduledDate,
      mediaAttachments
    };

    try {
      setSubmitting(true);

      // If onSchedule prop is provided, use it
      if (onSchedule) {
        onSchedule(postData);
      } else {
        // Otherwise use the hook to create the post
        await createPost(
          content,
          selectedPlatforms,
          schedulingMode === 'now' ? new Date() : scheduledDate,
          mediaAttachments
        );
      }

      // Reset form
      setContent('');
      setSelectedPlatforms(['Facebook']);
      setSchedulingMode('now');
      setMediaAttachments([]);

    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Format time for input
  const formatTimeForInput = (date: Date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Get connected platforms
  const connectedPlatforms = platforms
    .filter(p => p.connected)
    .map(p => p.platformType);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Post</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content input */}
        <div>
          <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-1">
            Post Content
          </label>
          <textarea
            id="post-content"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="What would you like to share?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="mt-1 text-xs text-gray-500 flex justify-end">
            <span>{content.length} characters</span>
          </div>
        </div>

        {/* Media uploader */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <PhotoIcon className="h-4 w-4 inline mr-1" />
            Media Attachments
          </label>
          <MediaUploader
            onMediaChange={handleMediaChange}
            initialMedia={mediaAttachments}
          />
        </div>

        {/* Platform selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Platforms
          </label>
          <div className="flex flex-wrap gap-2">
            {(connectedPlatforms.length > 0 ? connectedPlatforms : ['Facebook', 'Twitter', 'Instagram'] as SocialPlatformType[]).map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => togglePlatform(platform)}
                className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  selectedPlatforms.includes(platform)
                    ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Scheduling options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            When to Post
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                id="post-now"
                name="scheduling-mode"
                type="radio"
                checked={schedulingMode === 'now'}
                onChange={() => setSchedulingMode('now')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="post-now" className="ml-2 block text-sm text-gray-700">
                Post now
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="post-later"
                name="scheduling-mode"
                type="radio"
                checked={schedulingMode === 'later'}
                onChange={() => setSchedulingMode('later')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="post-later" className="ml-2 block text-sm text-gray-700">
                Schedule for later
              </label>
            </div>
          </div>
        </div>

        {/* Date and time selection */}
        {schedulingMode === 'later' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="post-date" className="block text-sm font-medium text-gray-700 mb-1">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                id="post-date"
                name="post-date"
                value={formatDateForInput(scheduledDate)}
                onChange={handleDateChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="post-time" className="block text-sm font-medium text-gray-700 mb-1">
                <ClockIcon className="h-4 w-4 inline mr-1" />
                Time
              </label>
              <input
                type="time"
                id="post-time"
                name="post-time"
                value={formatTimeForInput(scheduledDate)}
                onChange={handleTimeChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            {submitting ? 'Submitting...' : schedulingMode === 'now' ? 'Post Now' : 'Schedule Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
