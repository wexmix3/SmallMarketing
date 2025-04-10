'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { SocialPost } from '@/models/social';

// Mock data for the calendar
const mockPosts: SocialPost[] = [
  {
    id: '1',
    content: 'Check out our latest product launch! #NewProduct',
    platform: 'twitter',
    status: 'scheduled',
    scheduledAt: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 10, 0),
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'user1',
    authorName: 'John Smith'
  },
  {
    id: '2',
    content: 'We\'re excited to announce our summer sale! 🔥 Get up to 50% off on all products.',
    platform: 'facebook',
    status: 'scheduled',
    scheduledAt: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 14, 30),
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'user1',
    authorName: 'John Smith'
  },
  {
    id: '3',
    content: 'Meet our team! We\'re a group of passionate individuals dedicated to providing the best service.',
    platform: 'linkedin',
    status: 'scheduled',
    scheduledAt: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 9, 0),
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'user2',
    authorName: 'Jane Doe'
  }
];

// Platform colors for visual distinction
const platformColors: Record<string, string> = {
  facebook: 'bg-blue-100 text-blue-800 border-blue-200',
  twitter: 'bg-sky-100 text-sky-800 border-sky-200',
  instagram: 'bg-pink-100 text-pink-800 border-pink-200',
  linkedin: 'bg-indigo-100 text-indigo-800 border-indigo-200'
};

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  posts: SocialPost[];
}

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Generate calendar days for the current month
  useEffect(() => {
    const days: CalendarDay[] = [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Get the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Add days from the previous month to fill the first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        posts: getPostsForDay(date, mockPosts)
      });
    }
    
    // Add days of the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        posts: getPostsForDay(date, mockPosts)
      });
    }
    
    // Add days from the next month to complete the last week
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        posts: getPostsForDay(date, mockPosts)
      });
    }
    
    setCalendarDays(days);
  }, [currentDate]);
  
  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  // Get posts scheduled for a specific day
  const getPostsForDay = (date: Date, posts: SocialPost[]) => {
    return posts.filter(post => 
      post.scheduledAt && 
      isSameDay(post.scheduledAt, date)
    );
  };
  
  // Navigate to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to the next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Navigate to the current month
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Format time (e.g., "10:00 AM")
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle post click
  const handlePostClick = (post: SocialPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };
  
  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Content Calendar</h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={goToToday}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Today
            </button>
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNextMonth}
              className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <h2 className="mt-2 text-xl font-semibold text-gray-900">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-2 ${
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
              } ${day.isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${day.isToday ? 'text-blue-600' : ''}`}>
                  {day.date.getDate()}
                </span>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-500"
                  onClick={() => {
                    // Add post logic would go here
                    alert(`Add post for ${day.date.toLocaleDateString()}`);
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              
              {/* Posts for this day */}
              <div className="mt-1 space-y-1">
                {day.posts.map((post) => (
                  <div
                    key={post.id}
                    className={`px-2 py-1 text-xs rounded border cursor-pointer hover:shadow-sm transition-shadow ${platformColors[post.platform] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="font-medium">{formatTime(post.scheduledAt!)}</div>
                    <div className="truncate">{post.content}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Post details modal */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Post Details
                    </h3>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${platformColors[selectedPost.platform] || 'bg-gray-100 text-gray-800'}`}>
                            {selectedPost.platform.charAt(0).toUpperCase() + selectedPost.platform.slice(1)}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {selectedPost.scheduledAt?.toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-700">
                          {selectedPost.content}
                        </div>
                        
                        {selectedPost.mediaUrls && selectedPost.mediaUrls.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {selectedPost.mediaUrls.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Media ${index + 1}`}
                                className="h-24 w-full object-cover rounded-md"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>Created by {selectedPost.authorName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Edit post logic would go here
                    alert(`Edit post ${selectedPost.id}`);
                    closeModal();
                  }}
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Delete post logic would go here
                    if (confirm('Are you sure you want to delete this post?')) {
                      alert(`Delete post ${selectedPost.id}`);
                      closeModal();
                    }
                  }}
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
