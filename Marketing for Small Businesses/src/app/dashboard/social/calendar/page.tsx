'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { SocialPost, getMockScheduledPosts, getMockPublishedPosts, SocialPlatform } from '@/models/social';

export default function SocialMediaCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [posts, setPosts] = useState<SocialPost[]>([
    ...getMockScheduledPosts(),
    ...getMockPublishedPosts()
  ]);
  
  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week for first day of month
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Get posts for a specific date
  const getPostsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return posts.filter(post => {
      if (!post.scheduledTime) return false;
      return formatDate(post.scheduledTime) === dateStr;
    });
  };
  
  // Handle month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Get platform badge color
  const getPlatformColor = (platform: SocialPlatform) => {
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
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-200"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const postsForDay = getPostsForDate(date);
      const isToday = formatDate(date) === formatDate(new Date());
      
      days.push(
        <div 
          key={day} 
          className={`min-h-24 p-2 border border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-white'}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            <Link
              href="/dashboard/social/scheduler"
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <PlusIcon className="h-4 w-4 text-gray-500" />
            </Link>
          </div>
          
          <div className="mt-1 space-y-1">
            {postsForDay.map((post) => (
              <div 
                key={post.id} 
                className={`p-1 rounded text-xs ${
                  post.status === 'published' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <div className="truncate">{post.content.substring(0, 30)}...</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {post.platforms.slice(0, 2).map((platform) => (
                    <span
                      key={platform}
                      className={`px-1 py-0.5 text-xs rounded ${getPlatformColor(platform)}`}
                    >
                      {platform.substring(0, 2)}
                    </span>
                  ))}
                  {post.platforms.length > 2 && (
                    <span className="px-1 py-0.5 text-xs rounded bg-gray-100 text-gray-800">
                      +{post.platforms.length - 2}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  // Get month name
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  
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
          <h1 className="text-2xl font-semibold text-gray-900">Content Calendar</h1>
        </div>
        <Link
          href="/dashboard/social/scheduler"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          New Post
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {monthName} {currentMonth.getFullYear()}
          </h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={prevMonth}
              className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-7 gap-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="h-10 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px">
            {generateCalendarDays()}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Legend</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Scheduled Post</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Published Post</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-50 rounded mr-2"></div>
              <span className="text-sm text-gray-700">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
