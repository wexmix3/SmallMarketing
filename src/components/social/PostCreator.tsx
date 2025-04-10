'use client';

import { useState, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  CalendarIcon,
  PhotoIcon,
  HashtagIcon,
  MapPinIcon,
  FaceSmileIcon,
  AtSymbolIcon
} from '@heroicons/react/24/outline';
import { SocialPlatformType, MediaAttachment, Platform } from '@/models/social';
import { useSocialMedia } from '@/hooks/useSocialMedia';
import MediaUploader from './MediaUploader';

interface PostCreatorProps {
  onPostCreated?: () => void;
  initialContent?: string;
  initialPlatforms?: SocialPlatformType[];
  initialMedia?: MediaAttachment[];
  mode?: 'create' | 'edit';
  postId?: string;
}

export default function PostCreator({
  onPostCreated,
  initialContent = '',
  initialPlatforms = [],
  initialMedia = [],
  mode = 'create',
  postId
}: PostCreatorProps) {
  const { 
    platforms, 
    createPost, 
    publishPost, 
    loading,
    getPostsByStatus,
    updatePost
  } = useSocialMedia();
  
  // State
  const [content, setContent] = useState(initialContent);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatformType[]>(
    initialPlatforms.length > 0 ? initialPlatforms : ['Facebook']
  );
  const [mediaAttachments, setMediaAttachments] = useState<MediaAttachment[]>(initialMedia);
  const [schedulingMode, setSchedulingMode] = useState<'now' | 'later'>('now');
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  
  // Get connected platforms
  const connectedPlatforms = platforms
    .filter(p => p.connected)
    .map(p => p.platformType);
  
  // Default platforms if none are connected
  const availablePlatforms = connectedPlatforms.length > 0 
    ? connectedPlatforms 
    : ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'] as SocialPlatformType[];
  
  // Update character count and extract hashtags/mentions when content changes
  useEffect(() => {
    setCharacterCount(content.length);
    
    // Extract hashtags
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const extractedHashtags = content.match(hashtagRegex) || [];
    setHashtags(extractedHashtags.map(tag => tag.substring(1)));
    
    // Extract mentions
    const mentionRegex = /@[a-zA-Z0-9_]+/g;
    const extractedMentions = content.match(mentionRegex) || [];
    setMentions(extractedMentions.map(mention => mention.substring(1)));
  }, [content]);
  
  // Handle platform selection
  const togglePlatform = (platform: SocialPlatformType) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };
  
  // Handle media change
  const handleMediaChange = (media: MediaAttachment[]) => {
    setMediaAttachments(media);
  };
  
  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(scheduledDate);
    const [year, month, day] = e.target.value.split('-').map(Number);
    newDate.setFullYear(year, month - 1, day);
    setScheduledDate(newDate);
  };
  
  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(scheduledDate);
    const [hours, minutes] = e.target.value.split(':').map(Number);
    newDate.setHours(hours, minutes);
    setScheduledDate(newDate);
  };
  
  // Format date for input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Format time for input
  const formatTimeForInput = (date: Date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  // Add emoji to content
  const addEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  // Add hashtag to content
  const addHashtag = (tag: string) => {
    if (!tag) return;
    setContent(prev => `${prev} #${tag}`);
  };
  
  // Add mention to content
  const addMention = (username: string) => {
    if (!username) return;
    setContent(prev => `${prev} @${username}`);
  };
  
  // Set location
  const setLocationName = (name: string) => {
    setLocation(name);
    setShowLocationPicker(false);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (content.trim() === '') {
      setError('Please enter content for your post');
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      if (mode === 'edit' && postId) {
        // Update existing post
        await updatePost(postId, {
          content,
          platforms: selectedPlatforms,
          mediaAttachments,
          scheduledTime: schedulingMode === 'now' ? new Date() : scheduledDate
        });
      } else {
        // Create new post
        await createPost(
          content,
          selectedPlatforms,
          schedulingMode === 'now' ? new Date() : scheduledDate,
          mediaAttachments
        );
        
        // If posting now, publish immediately
        if (schedulingMode === 'now') {
          // In a real app, you would get the post ID from createPost and use it here
          // For now, we'll just simulate the publish action
          console.log('Post created and published immediately');
        }
      }
      
      // Reset form
      setContent('');
      setSelectedPlatforms(['Facebook']);
      setMediaAttachments([]);
      setSchedulingMode('now');
      setScheduledDate(new Date());
      setLocation(null);
      
      // Notify parent component
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Get character limit based on selected platforms
  const getCharacterLimit = () => {
    if (selectedPlatforms.includes('Twitter')) {
      return 280;
    }
    return 5000; // Default limit
  };
  
  const characterLimit = getCharacterLimit();
  const isOverLimit = characterCount > characterLimit;
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {mode === 'edit' ? 'Edit Post' : 'Create New Post'}
      </h3>
      
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content input */}
        <div>
          <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-1">
            Post Content
          </label>
          <textarea
            id="post-content"
            rows={4}
            className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              isOverLimit ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="What would you like to share?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-1 flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaceSmileIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const tag = prompt('Enter hashtag (without #):');
                  if (tag) addHashtag(tag);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <HashtagIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const username = prompt('Enter username (without @):');
                  if (username) addMention(username);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <AtSymbolIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MapPinIcon className="h-5 w-5" />
              </button>
            </div>
            <span className={`text-xs ${isOverLimit ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
              {characterCount}/{characterLimit} characters
            </span>
          </div>
          
          {/* Emoji picker (simplified) */}
          {showEmojiPicker && (
            <div className="mt-2 p-2 border border-gray-200 rounded-md bg-white shadow-sm">
              <div className="grid grid-cols-8 gap-2">
                {['😀', '😂', '😍', '🥰', '😎', '🙌', '👍', '🎉', 
                  '❤️', '🔥', '✨', '🌟', '💯', '🤔', '😊', '🙏'].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:bg-gray-100 rounded p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Location picker (simplified) */}
          {showLocationPicker && (
            <div className="mt-2 p-2 border border-gray-200 rounded-md bg-white shadow-sm">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Select a location:</p>
                {['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Custom location...'].map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      if (loc === 'Custom location...') {
                        const custom = prompt('Enter location:');
                        if (custom) setLocationName(custom);
                      } else {
                        setLocationName(loc);
                      }
                    }}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Display selected location */}
          {location && (
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{location}</span>
              <button
                type="button"
                onClick={() => setLocation(null)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
          )}
          
          {/* Display hashtags and mentions */}
          {(hashtags.length > 0 || mentions.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {hashtags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                  #{tag}
                </span>
              ))}
              {mentions.map(mention => (
                <span key={mention} className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                  @{mention}
                </span>
              ))}
            </div>
          )}
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
            {availablePlatforms.map((platform) => (
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
                <CalendarIcon className="h-4 w-4 inline mr-1" />
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
            disabled={submitting || loading || isOverLimit}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            {submitting 
              ? 'Submitting...' 
              : mode === 'edit' 
                ? 'Update Post' 
                : schedulingMode === 'now' 
                  ? 'Post Now' 
                  : 'Schedule Post'
            }
          </button>
        </div>
      </form>
    </div>
  );
}
