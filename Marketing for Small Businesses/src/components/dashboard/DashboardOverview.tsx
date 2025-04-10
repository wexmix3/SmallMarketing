'use client';

import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Followers',
    stat: '1,245',
    change: '+12%',
    changeType: 'increase',
    icon: UsersIcon,
    iconBg: 'bg-blue-500',
  },
  {
    name: 'Engagement Rate',
    stat: '4.3%',
    change: '+2.5%',
    changeType: 'increase',
    icon: ChatBubbleLeftRightIcon,
    iconBg: 'bg-green-500',
  },
  {
    name: 'Email Open Rate',
    stat: '24.8%',
    change: '-0.5%',
    changeType: 'decrease',
    icon: EnvelopeIcon,
    iconBg: 'bg-purple-500',
  },
  {
    name: 'Website Visits',
    stat: '3,456',
    change: '+18%',
    changeType: 'increase',
    icon: EyeIcon,
    iconBg: 'bg-yellow-500',
  },
];

export default function DashboardOverview() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <div className="absolute rounded-md p-3" style={{ backgroundColor: item.iconBg }}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-16 pt-1">
                <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                <dd className="mt-1">
                  <div className="text-lg font-semibold text-gray-900">{item.stat}</div>
                  <div className="flex items-baseline">
                    <p
                      className={`text-sm font-semibold ${
                        item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.change}
                    </p>
                    <p className="ml-2 text-xs text-gray-500">from last month</p>
                  </div>
                </dd>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
