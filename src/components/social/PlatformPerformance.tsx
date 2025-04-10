'use client';

import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { PlatformAnalytics } from '@/models/social';

interface PlatformPerformanceProps {
  analytics: PlatformAnalytics[];
}

export default function PlatformPerformance({ analytics }: PlatformPerformanceProps) {
  // Platform colors
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Facebook':
        return 'bg-blue-500';
      case 'Instagram':
        return 'bg-pink-500';
      case 'Twitter':
        return 'bg-blue-400';
      case 'LinkedIn':
        return 'bg-blue-700';
      case 'Pinterest':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Platform icons
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook':
      case 'Instagram':
      case 'Twitter':
      case 'LinkedIn':
      case 'Pinterest':
        return <div className={`h-8 w-8 rounded-full ${getPlatformColor(platform)} flex items-center justify-center text-white font-bold`}>{platform.charAt(0)}</div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">?</div>;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Platform Performance</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Followers
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posts
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reach
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.map((platform) => (
                <tr key={platform.platform}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPlatformIcon(platform.platform)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{platform.platform}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {platform.followers.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {platform.engagement}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <DocumentTextIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {platform.posts}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <EyeIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {platform.reach.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                      {platform.growth}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
