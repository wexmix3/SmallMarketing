'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Content', href: '/dashboard/content', icon: DocumentTextIcon },
  { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
  { name: 'Social Media', href: '/dashboard/social', icon: ChatBubbleLeftRightIcon },
  { name: 'Email', href: '/dashboard/email', icon: EnvelopeIcon },
  { name: 'Community', href: '/dashboard/community', icon: UserGroupIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, business } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-blue-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-white font-bold text-xl">Local Marketing</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:bg-blue-700'}
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 flex-shrink-0 h-6 w-6
                      ${isActive ? 'text-white' : 'text-blue-300'}
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-blue-700 p-4">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {business ? getInitials(business.name) : user ? getInitials(user.name) : 'LB'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {business ? business.name : 'Your Business'}
              </p>
              <p className="text-xs font-medium text-blue-200">
                {user ? user.name : 'View Profile'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
