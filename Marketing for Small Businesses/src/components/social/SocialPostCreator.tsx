'use client';

import { useState } from 'react';
import {
  PaperAirplaneIcon,
  CalendarIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { SocialPlatform } from '@/models/social';

export default function SocialPostCreator() {
  // Mock function for creating posts
  const createPost = async (content: string, platform: string, mediaUrls?: string[], scheduledAt?: Date) => {
    console.log('Creating post:', { content, platform, mediaUrls, scheduledAt });
    return { id: 'mock-post-id', content, platform };
  };

  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle platform selection
  const handlePlatformToggle = (platform: SocialPlatform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(prev => prev.filter(p => p !== platform));
    } else {
      setSelectedPlatforms(prev => [...prev, platform]);
    }
  };

  // Handle media upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, we would upload these files to a server
    // For now, we'll just create object URLs
    const newMediaUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setMediaUrls(prev => [...prev, ...newMediaUrls]);
  };

  // Handle media removal
  const handleRemoveMedia = (url: string) => {
    setMediaUrls(prev => prev.filter(mediaUrl => mediaUrl !== url));
  };

  // Handle post submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) {
      setError('Please enter some content for your post');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let scheduledAt: Date | undefined;

      if (isScheduling && scheduledDate && scheduledTime) {
        scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
      }

      // Create post for each selected platform
      for (const platform of selectedPlatforms) {
        await createPost(
          content,
          platform,
          mediaUrls,
          scheduledAt
        );
      }

      setSuccess(isScheduling ? 'Post scheduled successfully!' : 'Post created successfully!');

      // Reset form
      setContent('');
      setSelectedPlatforms([]);
      setMediaUrls([]);
      setIsScheduling(false);
      setScheduledDate('');
      setScheduledTime('');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Create Post</h3>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-4">
        {/* Content input */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Post Content
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              name="content"
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* Platform selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Platforms
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePlatformToggle('facebook')}
              className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                selectedPlatforms.includes('facebook')
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Facebook
            </button>
            <button
              type="button"
              onClick={() => handlePlatformToggle('twitter')}
              className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                selectedPlatforms.includes('twitter')
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Twitter
            </button>
            <button
              type="button"
              onClick={() => handlePlatformToggle('instagram')}
              className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                selectedPlatforms.includes('instagram')
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Instagram
            </button>
            <button
              type="button"
              onClick={() => handlePlatformToggle('linkedin')}
              className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                selectedPlatforms.includes('linkedin')
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              LinkedIn
            </button>
          </div>
        </div>

        {/* Media upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Media Attachments
          </label>
          <div className="mt-2">
            <div className="flex items-center">
              <label
                htmlFor="media-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <PhotoIcon className="h-5 w-5 mr-2 text-gray-500" />
                Add Media
              </label>
              <input
                id="media-upload"
                name="media-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                multiple
                onChange={handleMediaUpload}
              />
            </div>

            {mediaUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(url)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scheduling */}
        <div>
          <div className="flex items-center">
            <input
              id="schedule"
              name="schedule"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={isScheduling}
              onChange={() => setIsScheduling(!isScheduling)}
            />
            <label htmlFor="schedule" className="ml-2 block text-sm text-gray-700">
              Schedule for later
            </label>
          </div>

          {isScheduling && (
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Error and success messages */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit buttons */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isScheduling ? (
              <>
                <CalendarIcon className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Scheduling...' : 'Schedule Post'}
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
