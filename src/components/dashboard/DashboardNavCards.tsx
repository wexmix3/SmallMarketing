'use client';

import Link from 'next/link';
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ArrowsPointingOutIcon,
  DocumentTextIcon,
  CalendarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const navCards = [
  {
    title: 'Email Marketing',
    description: 'Create and manage email campaigns',
    icon: EnvelopeIcon,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    href: '/dashboard/email'
  },
  {
    title: 'Cold Email Outreach',
    description: 'Personalized outreach campaigns',
    icon: DocumentTextIcon,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    href: '/dashboard/email/cold-outreach'
  },
  {
    title: 'Social Media',
    description: 'Manage posts across platforms',
    icon: ChatBubbleLeftRightIcon,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    href: '/dashboard/social'
  },
  {
    title: 'Content Calendar',
    description: 'Schedule and plan your content',
    icon: CalendarIcon,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    href: '/dashboard/social/calendar'
  },
  {
    title: 'Sports Gambling',
    description: 'Daily sports betting picks',
    icon: TrophyIcon,
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    href: '/dashboard/sports'
  },
  {
    title: 'Website Analytics',
    description: 'Track website performance',
    icon: ChartBarIcon,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    href: '/dashboard/analytics'
  },
  {
    title: 'Integrated Marketing',
    description: 'Cross-channel performance',
    icon: ArrowsPointingOutIcon,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    href: '/dashboard/integration'
  }
];

export default function DashboardNavCards() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Marketing Tools</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {navCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`${card.bgColor} hover:bg-opacity-80 rounded-lg p-5 transition-colors`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.icon className={`h-8 w-8 ${card.iconColor}`} aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
