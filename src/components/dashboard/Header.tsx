'use client';

import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import {
  BellIcon,
  Bars3Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const { user, business, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <span className="border-transparent text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                {business ? `Welcome to ${business.name}'s Dashboard` : 'Welcome to your Marketing Dashboard'}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {user ? getInitials(user.name) : 'U'}
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {user && (
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'flex px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Your Profile
                      </a>
                    )}
                  </Menu.Item>
                  {business && (
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'flex px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          <BuildingStorefrontIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          Business Settings
                        </a>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'flex px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Account Settings
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'flex w-full px-4 py-2 text-sm text-gray-700 text-left'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}
