'use client';

import { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  StarIcon,
  CalendarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

// Tabs for the community page
const tabs = [
  { name: 'Reviews', icon: StarIcon },
  { name: 'Messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Events', icon: CalendarIcon },
  { name: 'Partnerships', icon: UserGroupIcon },
];

// Mock reviews data
const reviews = [
  {
    id: 1,
    platform: 'Google',
    author: 'Sarah Johnson',
    rating: 5,
    date: '2 days ago',
    content: 'Absolutely love this place! The staff is friendly and the service is excellent. Highly recommend to anyone looking for quality products and great customer service.',
    responded: true,
    response: 'Thank you for your kind words, Sarah! We're so glad you had a great experience with us. We look forward to serving you again soon!',
  },
  {
    id: 2,
    platform: 'Yelp',
    author: 'Michael Chen',
    rating: 4,
    date: '1 week ago',
    content: 'Great experience overall. The only reason I'm not giving 5 stars is because I had to wait a bit longer than expected. But the quality was worth it!',
    responded: false,
    response: '',
  },
  {
    id: 3,
    platform: 'Facebook',
    author: 'Emily Wilson',
    rating: 5,
    date: '2 weeks ago',
    content: 'I've been a regular customer for years and they never disappoint. The attention to detail and personalized service keeps me coming back!',
    responded: true,
    response: 'Emily, we truly appreciate your continued support! Customers like you make what we do worthwhile. Thank you for being such a loyal customer!',
  },
  {
    id: 4,
    platform: 'Google',
    author: 'Robert Davis',
    rating: 3,
    date: '3 weeks ago',
    content: 'Decent service but a bit pricey compared to other options in the area. The quality is good though.',
    responded: false,
    response: '',
  },
];

// Mock events data
const events = [
  {
    id: 1,
    title: 'Customer Appreciation Day',
    date: 'September 15, 2023',
    time: '12:00 PM - 6:00 PM',
    location: 'Main Store',
    description: 'Join us for a day of special discounts, refreshments, and giveaways as we celebrate our amazing customers!',
    status: 'Upcoming',
  },
  {
    id: 2,
    title: 'Holiday Shopping Event',
    date: 'November 25, 2023',
    time: '9:00 AM - 9:00 PM',
    location: 'Main Store',
    description: 'Get a head start on your holiday shopping with exclusive deals and extended hours.',
    status: 'Planning',
  },
  {
    id: 3,
    title: 'Summer Sidewalk Sale',
    date: 'July 10, 2023',
    time: '10:00 AM - 4:00 PM',
    location: 'Store Front & Sidewalk',
    description: 'Our biggest sale of the summer with up to 70% off select items!',
    status: 'Completed',
  },
];

// Mock messages data
const messages = [
  {
    id: 1,
    platform: 'Facebook',
    sender: 'John Smith',
    date: '1 day ago',
    content: 'Hi there! Do you have the new collection in stock yet?',
    read: true,
    replied: true,
  },
  {
    id: 2,
    platform: 'Instagram',
    sender: 'Lisa Wong',
    date: '2 days ago',
    content: 'What are your hours this weekend?',
    read: true,
    replied: false,
  },
  {
    id: 3,
    platform: 'Google Business',
    sender: 'Mark Johnson',
    date: '3 days ago',
    content: 'Do you offer delivery services?',
    read: false,
    replied: false,
  },
];

// Mock partnerships data
const partnerships = [
  {
    id: 1,
    business: 'Local Cafe',
    type: 'Cross-promotion',
    status: 'Active',
    startDate: 'January 15, 2023',
    description: 'Cross-promotional deal where customers get 10% off at the cafe with our receipt, and cafe customers get 10% off at our store.',
  },
  {
    id: 2,
    business: 'Community Center',
    type: 'Sponsorship',
    status: 'Active',
    startDate: 'March 5, 2023',
    description: 'Sponsoring the community center\'s youth program with monthly donations and volunteer hours.',
  },
  {
    id: 3,
    business: 'Local Newspaper',
    type: 'Advertising',
    status: 'Pending',
    startDate: 'TBD',
    description: 'Negotiating a special advertising package in the local newspaper\'s business section.',
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Reviews');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResponseForm, setShowResponseForm] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');
  
  // Filter function based on search term
  const filterItems = (items: any[], term: string) => {
    if (!term) return items;
    
    return items.filter(item => {
      // Different filtering logic based on the active tab
      if (activeTab === 'Reviews') {
        return (
          item.author.toLowerCase().includes(term.toLowerCase()) ||
          item.content.toLowerCase().includes(term.toLowerCase()) ||
          item.platform.toLowerCase().includes(term.toLowerCase())
        );
      } else if (activeTab === 'Events') {
        return (
          item.title.toLowerCase().includes(term.toLowerCase()) ||
          item.description.toLowerCase().includes(term.toLowerCase()) ||
          item.location.toLowerCase().includes(term.toLowerCase())
        );
      } else if (activeTab === 'Messages') {
        return (
          item.sender.toLowerCase().includes(term.toLowerCase()) ||
          item.content.toLowerCase().includes(term.toLowerCase()) ||
          item.platform.toLowerCase().includes(term.toLowerCase())
        );
      } else if (activeTab === 'Partnerships') {
        return (
          item.business.toLowerCase().includes(term.toLowerCase()) ||
          item.type.toLowerCase().includes(term.toLowerCase()) ||
          item.description.toLowerCase().includes(term.toLowerCase())
        );
      }
      
      return false;
    });
  };
  
  // Get the appropriate data based on the active tab
  const getActiveData = () => {
    switch (activeTab) {
      case 'Reviews':
        return filterItems(reviews, searchTerm);
      case 'Events':
        return filterItems(events, searchTerm);
      case 'Messages':
        return filterItems(messages, searchTerm);
      case 'Partnerships':
        return filterItems(partnerships, searchTerm);
      default:
        return [];
    }
  };
  
  // Handle responding to a review
  const handleRespond = (reviewId: number) => {
    setShowResponseForm(reviewId);
    
    // Find the review and pre-fill the response if it exists
    const review = reviews.find(r => r.id === reviewId);
    if (review && review.response) {
      setResponseText(review.response);
    } else {
      setResponseText('');
    }
  };
  
  // Handle submitting a response
  const handleSubmitResponse = (reviewId: number) => {
    // In a real app, this would send the response to the backend
    console.log(`Submitting response for review ${reviewId}: ${responseText}`);
    
    // Close the response form
    setShowResponseForm(null);
    setResponseText('');
  };
  
  // Render star ratings
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`h-5 w-5 ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          aria-hidden="true"
        />
      ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Community Engagement</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`${
                activeTab === tab.name
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon
                className={`${
                  activeTab === tab.name ? 'text-blue-500' : 'text-gray-400'
                } -ml-0.5 mr-2 h-5 w-5`}
                aria-hidden="true"
              />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Reviews Tab */}
      {activeTab === 'Reviews' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Reviews</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Average Rating:</span>
                <div className="flex">
                  {renderStars(4)}
                </div>
                <span className="text-sm font-medium text-gray-900">4.2/5</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {getActiveData().map((review: any) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{review.author}</span>
                        <span className="ml-2 text-sm text-gray-500">via {review.platform}</span>
                      </div>
                      <div className="flex mt-1">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleRespond(review.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {review.responded ? 'Edit Response' : 'Respond'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-700">
                    {review.content}
                  </div>
                  
                  {review.responded && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">Your Response</span>
                        <span className="ml-2 text-xs text-gray-500">as Business Owner</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-700">
                        {review.response}
                      </div>
                    </div>
                  )}
                  
                  {showResponseForm === review.id && (
                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <label htmlFor={`response-${review.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Your Response
                      </label>
                      <textarea
                        id={`response-${review.id}`}
                        rows={3}
                        className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Write your response..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                      />
                      <div className="mt-2 flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowResponseForm(null)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmitResponse(review.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Submit Response
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Events Tab */}
      {activeTab === 'Events' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Local Events</h3>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Create Event
              </button>
            </div>
            
            <div className="space-y-4">
              {getActiveData().map((event: any) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {event.date} • {event.time}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Location: {event.location}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          event.status === 'Upcoming'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'Planning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-700">
                    {event.description}
                  </div>
                  
                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Messages Tab */}
      {activeTab === 'Messages' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Messages</h3>
              <div>
                <span className="text-sm text-gray-500 mr-2">
                  {messages.filter(m => !m.read).length} unread messages
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {getActiveData().map((message: any) => (
                <div 
                  key={message.id} 
                  className={`border ${!message.read ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} rounded-lg p-4`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{message.sender}</span>
                        <span className="ml-2 text-sm text-gray-500">via {message.platform}</span>
                        {!message.read && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {message.date}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-700">
                    {message.content}
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <span className={`text-xs ${message.replied ? 'text-green-600' : 'text-gray-500'}`}>
                      {message.replied ? 'Replied' : 'Not replied yet'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Partnerships Tab */}
      {activeTab === 'Partnerships' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Local Partnerships</h3>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Add Partnership
              </button>
            </div>
            
            <div className="space-y-4">
              {getActiveData().map((partnership: any) => (
                <div key={partnership.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{partnership.business}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500">{partnership.type}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">Since {partnership.startDate}</span>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          partnership.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {partnership.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-700">
                    {partnership.description}
                  </div>
                  
                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
