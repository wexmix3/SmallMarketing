'use client';

import { useState, useEffect } from 'react';
import { 
  PaperAirplaneIcon,
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  UserGroupIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { EmailCampaign, EmailTemplate, ContactList } from '@/models/email';
import { useEmailMarketing } from '@/hooks/useEmailMarketing';

interface EmailCampaignCreatorProps {
  campaignId?: string;
  initialCampaign?: Partial<EmailCampaign>;
  onSave?: (campaign: EmailCampaign) => void;
  onCancel?: () => void;
}

export default function EmailCampaignCreator({
  campaignId,
  initialCampaign,
  onSave,
  onCancel
}: EmailCampaignCreatorProps) {
  const { 
    templates, 
    contactLists, 
    createEmailCampaign, 
    scheduleEmailCampaign,
    sendCampaignImmediately,
    loading, 
    error 
  } = useEmailMarketing();
  
  const [name, setName] = useState(initialCampaign?.name || '');
  const [subject, setSubject] = useState(initialCampaign?.subject || '');
  const [fromName, setFromName] = useState(initialCampaign?.fromName || '');
  const [fromEmail, setFromEmail] = useState(initialCampaign?.fromEmail || '');
  const [replyTo, setReplyTo] = useState(initialCampaign?.replyTo || '');
  const [templateId, setTemplateId] = useState(initialCampaign?.templateId || '');
  const [selectedListIds, setSelectedListIds] = useState<string[]>(initialCampaign?.listIds || []);
  const [schedulingMode, setSchedulingMode] = useState<'now' | 'later'>('later');
  const [scheduledDate, setScheduledDate] = useState<string>(
    initialCampaign?.scheduledAt 
      ? new Date(initialCampaign.scheduledAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState<string>(
    initialCampaign?.scheduledAt 
      ? new Date(initialCampaign.scheduledAt).toTimeString().split(' ')[0].substring(0, 5)
      : new Date().toTimeString().split(' ')[0].substring(0, 5)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);
  
  // Calculate recipient count when selected lists change
  useEffect(() => {
    if (selectedListIds.length === 0) {
      setRecipientCount(0);
      return;
    }
    
    // Get unique contacts from selected lists
    const uniqueContactIds = new Set<string>();
    
    selectedListIds.forEach(listId => {
      const list = contactLists.find(l => l.id === listId);
      if (list) {
        list.contacts.forEach(contactId => {
          uniqueContactIds.add(contactId);
        });
      }
    });
    
    setRecipientCount(uniqueContactIds.size);
  }, [selectedListIds, contactLists]);
  
  // Update subject when template changes
  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template && !subject) {
        setSubject(template.subject);
      }
    }
  }, [templateId, templates, subject]);
  
  // Handle template selection
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTemplateId = e.target.value;
    setTemplateId(newTemplateId);
    
    // Update preview template
    if (newTemplateId) {
      const template = templates.find(t => t.id === newTemplateId);
      if (template) {
        setPreviewTemplate(template);
      }
    } else {
      setPreviewTemplate(null);
    }
  };
  
  // Handle list selection
  const handleListSelection = (listId: string) => {
    if (selectedListIds.includes(listId)) {
      setSelectedListIds(selectedListIds.filter(id => id !== listId));
    } else {
      setSelectedListIds([...selectedListIds, listId]);
    }
  };
  
  // Handle preview
  const handlePreview = () => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setPreviewTemplate(template);
      setShowPreview(true);
    }
  };
  
  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Create scheduled date
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      // Create campaign
      const campaign = await createEmailCampaign(
        name,
        subject,
        fromName,
        fromEmail,
        templateId,
        selectedListIds,
        replyTo || undefined,
        schedulingMode === 'later' ? scheduledDateTime : undefined
      );
      
      // If sending now, send immediately
      if (schedulingMode === 'now') {
        await sendCampaignImmediately(campaign.id);
      }
      
      if (onSave) {
        onSave(campaign);
      }
    } catch (error) {
      console.error('Failed to save campaign:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Validate form
  const validateForm = () => {
    if (!name) {
      alert('Please enter a campaign name.');
      return false;
    }
    
    if (!subject) {
      alert('Please enter a subject line.');
      return false;
    }
    
    if (!fromName) {
      alert('Please enter a sender name.');
      return false;
    }
    
    if (!fromEmail) {
      alert('Please enter a sender email.');
      return false;
    }
    
    if (!templateId) {
      alert('Please select an email template.');
      return false;
    }
    
    if (selectedListIds.length === 0) {
      alert('Please select at least one contact list.');
      return false;
    }
    
    return true;
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {campaignId ? 'Edit Email Campaign' : 'Create Email Campaign'}
          </h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handlePreview}
              disabled={!templateId}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              Preview Template
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Campaign name */}
          <div>
            <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700">
              Campaign Name *
            </label>
            <input
              type="text"
              id="campaign-name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. July Newsletter"
              required
            />
          </div>
          
          {/* Email template */}
          <div>
            <label htmlFor="email-template" className="block text-sm font-medium text-gray-700">
              Email Template *
            </label>
            <select
              id="email-template"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={templateId}
              onChange={handleTemplateChange}
              required
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.category})
                </option>
              ))}
            </select>
          </div>
          
          {/* Subject line */}
          <div>
            <label htmlFor="subject-line" className="block text-sm font-medium text-gray-700">
              Subject Line *
            </label>
            <input
              type="text"
              id="subject-line"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          
          {/* Sender information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="from-name" className="block text-sm font-medium text-gray-700">
                From Name *
              </label>
              <input
                type="text"
                id="from-name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="e.g. John Smith"
                required
              />
            </div>
            <div>
              <label htmlFor="from-email" className="block text-sm font-medium text-gray-700">
                From Email *
              </label>
              <input
                type="email"
                id="from-email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="e.g. john@yourcompany.com"
                required
              />
            </div>
          </div>
          
          {/* Reply-to email */}
          <div>
            <label htmlFor="reply-to" className="block text-sm font-medium text-gray-700">
              Reply-To Email
            </label>
            <input
              type="email"
              id="reply-to"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              placeholder="Leave blank to use From Email"
            />
          </div>
          
          {/* Contact lists */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Lists *
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {contactLists.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No contact lists available. Create a contact list first.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {contactLists.map((list) => (
                      <li key={list.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`list-${list.id}`}
                            checked={selectedListIds.includes(list.id)}
                            onChange={() => handleListSelection(list.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`list-${list.id}`} className="ml-3 block">
                            <span className="text-sm font-medium text-gray-900">{list.name}</span>
                            <span className="text-sm text-gray-500 block">
                              {list.contacts.length} contacts
                              {list.description && ` • ${list.description}`}
                            </span>
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {selectedListIds.length === 0 
                      ? 'No lists selected' 
                      : `${selectedListIds.length} list${selectedListIds.length > 1 ? 's' : ''} selected`}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scheduling options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When to Send
            </label>
            <div className="flex space-x-4 mb-4">
              <div className="flex items-center">
                <input
                  id="send-now"
                  name="scheduling-mode"
                  type="radio"
                  checked={schedulingMode === 'now'}
                  onChange={() => setSchedulingMode('now')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="send-now" className="ml-2 block text-sm text-gray-700">
                  Send immediately
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="send-later"
                  name="scheduling-mode"
                  type="radio"
                  checked={schedulingMode === 'later'}
                  onChange={() => setSchedulingMode('later')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="send-later" className="ml-2 block text-sm text-gray-700">
                  Schedule for later
                </label>
              </div>
            </div>
            
            {schedulingMode === 'later' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scheduled-date" className="block text-sm font-medium text-gray-700">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    id="scheduled-date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label htmlFor="scheduled-time" className="block text-sm font-medium text-gray-700">
                    <ClockIcon className="h-4 w-4 inline mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    id="scheduled-time"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {recipientCount > 0 && (
            <span className="flex items-center">
              <UserGroupIcon className="h-4 w-4 mr-1" />
              {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : schedulingMode === 'now' ? (
              <>
                <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                Send Now
              </>
            ) : (
              <>
                <CalendarIcon className="h-4 w-4 mr-1" />
                Schedule Campaign
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Template preview modal */}
      {showPreview && previewTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Template Preview: {previewTemplate.name}
                      </h3>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShowPreview(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="mt-2">
                      <div className="bg-gray-100 p-2 mb-4 rounded">
                        <div className="text-sm font-medium text-gray-900">Subject: {previewTemplate.subject}</div>
                        {previewTemplate.previewText && (
                          <div className="text-sm text-gray-500">Preview: {previewTemplate.previewText}</div>
                        )}
                      </div>
                      
                      <div className="border border-gray-300 rounded-md overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-300">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="font-medium">From:</span>
                            <span className="ml-2">{fromName || 'Sender'} &lt;{fromEmail || 'sender@example.com'}&gt;</span>
                          </div>
                          {replyTo && (
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span className="font-medium">Reply-To:</span>
                              <span className="ml-2">{replyTo}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 max-h-96 overflow-auto">
                          <div dangerouslySetInnerHTML={{ __html: previewTemplate.content }} />
                        </div>
                      </div>
                      
                      {previewTemplate.variables.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Template Variables</h4>
                          <div className="flex flex-wrap gap-2">
                            {previewTemplate.variables.map((variable) => (
                              <span
                                key={variable}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {variable}
                              </span>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            These variables will be replaced with actual values when sending emails.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPreview(false)}
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
