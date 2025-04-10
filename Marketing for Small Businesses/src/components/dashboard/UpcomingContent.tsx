'use client';

import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const upcomingContent = [
  {
    id: 1,
    title: 'Summer Sale Announcement',
    type: 'Social Media Post',
    platform: 'Facebook, Instagram',
    scheduledFor: 'Tomorrow, 10:00 AM',
    status: 'Scheduled',
  },
  {
    id: 2,
    title: 'Weekly Newsletter',
    type: 'Email Campaign',
    platform: 'Email',
    scheduledFor: 'Friday, 9:00 AM',
    status: 'Draft',
  },
  {
    id: 3,
    title: 'New Product Launch',
    type: 'Social Media Post',
    platform: 'All Platforms',
    scheduledFor: 'Next Monday, 12:00 PM',
    status: 'Scheduled',
  },
  {
    id: 4,
    title: 'Customer Appreciation Day',
    type: 'Event Promotion',
    platform: 'Facebook, Local Ads',
    scheduledFor: 'In 2 weeks',
    status: 'Planning',
  },
];

export default function UpcomingContent() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Content</h3>
        <button
          type="button"
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create New
        </button>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {upcomingContent.map((item) => (
            <li key={item.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.type} • {item.platform}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <span>{item.scheduledFor}</span>
                  </div>
                  <span
                    className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'Scheduled'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'Draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              View all content <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
