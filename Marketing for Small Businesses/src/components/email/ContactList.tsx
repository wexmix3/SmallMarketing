'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  TagIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Contact, ContactStatus } from '@/models/email';
import { useEmailMarketing } from '@/hooks/useEmailMarketing';

interface ContactListProps {
  onSelectContact?: (contact: Contact) => void;
  onCreateContact?: () => void;
  selectedContactIds?: string[];
  onSelectionChange?: (contactIds: string[]) => void;
  showSelection?: boolean;
}

export default function ContactList({
  onSelectContact,
  onCreateContact,
  selectedContactIds = [],
  onSelectionChange,
  showSelection = false
}: ContactListProps) {
  const { 
    contacts, 
    loading, 
    error, 
    deleteContact,
    updateContactStatus,
    exportContacts,
    importContacts
  } = useEmailMarketing();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string | 'all'>('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>(selectedContactIds);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  
  // Update filtered contacts when contacts, search query, or filters change
  useEffect(() => {
    let filtered = [...contacts];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }
    
    // Apply tag filter
    if (tagFilter !== 'all') {
      filtered = filtered.filter(contact => contact.tags.includes(tagFilter));
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.email.toLowerCase().includes(query) ||
        (contact.firstName && contact.firstName.toLowerCase().includes(query)) ||
        (contact.lastName && contact.lastName.toLowerCase().includes(query)) ||
        (contact.company && contact.company.toLowerCase().includes(query))
      );
    }
    
    setFilteredContacts(filtered);
  }, [contacts, searchQuery, statusFilter, tagFilter]);
  
  // Update selected contacts when selectedContactIds prop changes
  useEffect(() => {
    setSelectedContacts(selectedContactIds);
  }, [selectedContactIds]);
  
  // Get all unique tags from contacts
  const allTags = Array.from(new Set(
    contacts.flatMap(contact => contact.tags)
  )).sort();
  
  // Handle contact selection
  const handleSelectContact = (contactId: string) => {
    if (!showSelection) {
      const contact = contacts.find(c => c.id === contactId);
      if (contact && onSelectContact) {
        onSelectContact(contact);
      }
      return;
    }
    
    let newSelectedContacts: string[];
    
    if (selectedContacts.includes(contactId)) {
      newSelectedContacts = selectedContacts.filter(id => id !== contactId);
    } else {
      newSelectedContacts = [...selectedContacts, contactId];
    }
    
    setSelectedContacts(newSelectedContacts);
    
    if (onSelectionChange) {
      onSelectionChange(newSelectedContacts);
    }
  };
  
  // Handle select all contacts
  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      // Deselect all
      setSelectedContacts([]);
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    } else {
      // Select all
      const allIds = filteredContacts.map(contact => contact.id);
      setSelectedContacts(allIds);
      if (onSelectionChange) {
        onSelectionChange(allIds);
      }
    }
  };
  
  // Handle contact deletion
  const handleDeleteContact = async (contactId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(contactId);
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };
  
  // Handle contact status change
  const handleStatusChange = async (contactId: string, status: ContactStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await updateContactStatus(contactId, status);
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };
  
  // Handle export contacts
  const handleExportContacts = async () => {
    try {
      const csvContent = await exportContacts();
      
      // Create a blob and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export contacts:', error);
    }
  };
  
  // Handle import contacts
  const handleImportContacts = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsImporting(true);
    setImportError(null);
    setImportSuccess(null);
    
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (!event.target || typeof event.target.result !== 'string') return;
        
        try {
          const result = await importContacts(event.target.result);
          setImportSuccess(`Successfully imported ${result.imported} contacts. ${result.errors ? `Failed to import ${result.errors} contacts.` : ''}`);
        } catch (error) {
          console.error('Failed to import contacts:', error);
          setImportError('Failed to import contacts. Please check the file format and try again.');
        } finally {
          setIsImporting(false);
        }
      };
      
      reader.onerror = () => {
        setImportError('Failed to read the file. Please try again.');
        setIsImporting(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Failed to import contacts:', error);
      setImportError('Failed to import contacts. Please try again.');
      setIsImporting(false);
    }
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: ContactStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'unsubscribed':
        return 'bg-yellow-100 text-yellow-800';
      case 'bounced':
        return 'bg-red-100 text-red-800';
      case 'spam':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Contacts</h3>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleExportContacts}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              Export
            </button>
            
            <label className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
              <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
              Import
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImportContacts}
                disabled={isImporting}
              />
            </label>
            
            {onCreateContact && (
              <button
                type="button"
                onClick={onCreateContact}
                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Contact
              </button>
            )}
          </div>
        </div>
        
        {/* Import status messages */}
        {importError && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{importError}</p>
              </div>
            </div>
          </div>
        )}
        
        {importSuccess && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{importSuccess}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Search and filters */}
        <div className="mt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContactStatus | 'all')}
              className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
              <option value="spam">Spam</option>
            </select>
            
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Contact list */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {showSelection && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Contacted
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={showSelection ? 6 : 5} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={showSelection ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No contacts found.
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className={`hover:bg-gray-50 cursor-pointer ${selectedContacts.includes(contact.id) ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSelectContact(contact.id)}
                >
                  {showSelection && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleSelectContact(contact.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                        <span className="text-gray-500 font-medium">
                          {contact.firstName && contact.lastName
                            ? `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`
                            : contact.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.firstName && contact.lastName
                            ? `${contact.firstName} ${contact.lastName}`
                            : contact.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.email}
                        </div>
                        {contact.company && (
                          <div className="text-xs text-gray-500">
                            {contact.company}{contact.position ? `, ${contact.position}` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.lastContacted
                      ? new Date(contact.lastContacted).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle email action
                        }}
                        className="text-gray-400 hover:text-gray-500"
                        title="Send Email"
                      >
                        <EnvelopeIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit action
                        }}
                        className="text-gray-400 hover:text-gray-500"
                        title="Edit Contact"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteContact(contact.id, e)}
                        className="text-red-400 hover:text-red-500"
                        title="Delete Contact"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
