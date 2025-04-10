'use client';

import { 
  ChatBubbleLeftRightIcon, 
  HeartIcon, 
  UserPlusIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const activities = [
  {
    id: 1,
    type: 'comment',
    person: 'Sarah Johnson',
    content: 'Left a comment on your recent post',
    time: '5 minutes ago',
    icon: ChatBubbleLeftRightIcon,
    iconBackground: 'bg-blue-500',
  },
  {
    id: 2,
    type: 'like',
    person: 'Michael Chen',
    content: 'Liked your summer promotion post',
    time: '1 hour ago',
    icon: HeartIcon,
    iconBackground: 'bg-red-500',
  },
  {
    id: 3,
    type: 'follow',
    person: 'New Follower',
    content: 'Emily Wilson started following you',
    time: '3 hours ago',
    icon: UserPlusIcon,
    iconBackground: 'bg-green-500',
  },
  {
    id: 4,
    type: 'share',
    person: 'Robert Davis',
    content: 'Shared your post about new products',
    time: 'Yesterday',
    icon: ShareIcon,
    iconBackground: 'bg-purple-500',
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full ${activity.iconBackground} flex items-center justify-center`}>
                  <activity.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.person}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.content}</p>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              View all activity <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
