'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  PlusIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useEmailMarketing } from '@/hooks/useEmailMarketing';
import ContactList from '@/components/email/ContactList';
import { Contact } from '@/models/email';

export default function ContactsPage() {
  const { contactLists, createContactList } = useEmailMarketing();
  
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  
  // Handle contact selection
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactDetails(true);
  };
  
  // Handle create list
  const handleCreateList = async () => {
    if (!newListName) {
      alert('Please enter a list name');
      return;
    }
    
    try {
      await createContactList(newListName, newListDescription, selectedContactIds);
      setShowCreateList(false);
      setNewListName('');
      setNewListDescription('');
      setSelectedContactIds([]);
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link 
          href="/dashboard/email" 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Contact Management</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact lists */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Contact Lists</h2>
                <button
                  type="button"
                  onClick={() => setShowCreateList(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  New List
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-96">
              <ul className="divide-y divide-gray-200">
                <li className="px-4 py-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                      <UserGroupIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">All Contacts</div>
                      <div className="text-sm text-gray-500">View all your contacts</div>
                    </div>
                  </div>
                </li>
                {contactLists.map((list) => (
                  <li key={list.id} className="px-4 py-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                        <UserGroupIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{list.name}</div>
                        <div className="text-sm text-gray-500">
                          {list.contacts.length} contacts
                          {list.description && ` • ${list.description}`}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Contact list */}
        <div className="lg:col-span-2">
          <ContactList 
            onSelectContact={handleContactSelect}
            onCreateContact={() => {}}
            selectedContactIds={selectedContactIds}
            onSelectionChange={setSelectedContactIds}
            showSelection={showCreateList}
          />
        </div>
      </div>
      
      {/* Create list modal */}
      {showCreateList && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Create New Contact List
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="list-name" className="block text-sm font-medium text-gray-700">
                          List Name *
                        </label>
                        <input
                          type="text"
                          id="list-name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="list-description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="list-description"
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={newListDescription}
                          onChange={(e) => setNewListDescription(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Selected Contacts: {selectedContactIds.length}
                        </label>
                        <p className="mt-1 text-sm text-gray-500">
                          Select contacts from the list on the right to add them to this list.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateList}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Create List
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateList(false);
                    setSelectedContactIds([]);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Contact details modal */}
      {showContactDetails && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Contact Details
                      </h3>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShowContactDetails(false)}
                      >
                        <span className="sr-only">Close</span>
                        <ArrowLeftIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xl font-medium text-gray-600">
                            {selectedContact.firstName && selectedContact.lastName
                              ? `${selectedContact.firstName.charAt(0)}${selectedContact.lastName.charAt(0)}`
                              : selectedContact.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {selectedContact.firstName && selectedContact.lastName
                              ? `${selectedContact.firstName} ${selectedContact.lastName}`
                              : 'No Name'}
                          </h4>
                          <p className="text-sm text-gray-500">{selectedContact.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">First Name</p>
                        <p className="text-sm font-medium text-gray-900">{selectedContact.firstName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Name</p>
                        <p className="text-sm font-medium text-gray-900">{selectedContact.lastName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Company</p>
                        <p className="text-sm font-medium text-gray-900">{selectedContact.company || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Position</p>
                        <p className="text-sm font-medium text-gray-900">{selectedContact.position || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{selectedContact.phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-sm font-medium text-gray-900">{selectedContact.status}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedContact.tags.length > 0 ? (
                          selectedContact.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No tags</p>
                        )}
                      </div>
                    </div>
                    
                    {selectedContact.customFields && Object.keys(selectedContact.customFields).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Custom Fields</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(selectedContact.customFields).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-xs text-gray-500">{key}</p>
                              <p className="text-sm font-medium text-gray-900">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Lists</p>
                      <div className="flex flex-wrap gap-1">
                        {contactLists
                          .filter(list => list.contacts.includes(selectedContact.id))
                          .map(list => (
                            <span key={list.id} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              {list.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Edit Contact
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactDetails(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
