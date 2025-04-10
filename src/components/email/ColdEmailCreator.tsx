'use client';

import { useState } from 'react';
import { 
  PaperAirplaneIcon, 
  UserPlusIcon,
  DocumentDuplicateIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function ColdEmailCreator() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [recipients, setRecipients] = useState<{name: string; email: string; company: string}[]>([
    { name: '', email: '', company: '' }
  ]);
  const [personalizationFields, setPersonalizationFields] = useState<{field: string; values: string[]}[]>([
    { field: 'firstName', values: [] },
    { field: 'companyName', values: [] }
  ]);
  const [followUpEnabled, setFollowUpEnabled] = useState(false);
  const [followUpDays, setFollowUpDays] = useState(3);
  const [followUpContent, setFollowUpContent] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle recipient changes
  const handleRecipientChange = (index: number, field: string, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index] = { ...newRecipients[index], [field]: value };
    setRecipients(newRecipients);
    
    // Update personalization field values
    if (field === 'name') {
      updatePersonalizationValues('firstName', index, value.split(' ')[0]);
    } else if (field === 'company') {
      updatePersonalizationValues('companyName', index, value);
    }
  };
  
  // Update personalization field values
  const updatePersonalizationValues = (field: string, index: number, value: string) => {
    const fieldIndex = personalizationFields.findIndex(f => f.field === field);
    if (fieldIndex !== -1) {
      const newFields = [...personalizationFields];
      const newValues = [...newFields[fieldIndex].values];
      newValues[index] = value;
      newFields[fieldIndex] = { ...newFields[fieldIndex], values: newValues };
      setPersonalizationFields(newFields);
    }
  };
  
  // Add recipient
  const addRecipient = () => {
    setRecipients([...recipients, { name: '', email: '', company: '' }]);
    
    // Add empty values to personalization fields
    setPersonalizationFields(personalizationFields.map(field => ({
      ...field,
      values: [...field.values, '']
    })));
  };
  
  // Remove recipient
  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      const newRecipients = [...recipients];
      newRecipients.splice(index, 1);
      setRecipients(newRecipients);
      
      // Remove values from personalization fields
      setPersonalizationFields(personalizationFields.map(field => {
        const newValues = [...field.values];
        newValues.splice(index, 1);
        return { ...field, values: newValues };
      }));
    }
  };
  
  // Add personalization field
  const addPersonalizationField = () => {
    setPersonalizationFields([
      ...personalizationFields,
      { field: '', values: Array(recipients.length).fill('') }
    ]);
  };
  
  // Remove personalization field
  const removePersonalizationField = (index: number) => {
    const newFields = [...personalizationFields];
    newFields.splice(index, 1);
    setPersonalizationFields(newFields);
  };
  
  // Handle personalization field change
  const handlePersonalizationFieldChange = (index: number, field: string, value: string) => {
    const newFields = [...personalizationFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setPersonalizationFields(newFields);
  };
  
  // Handle personalization value change
  const handlePersonalizationValueChange = (fieldIndex: number, valueIndex: number, value: string) => {
    const newFields = [...personalizationFields];
    const newValues = [...newFields[fieldIndex].values];
    newValues[valueIndex] = value;
    newFields[fieldIndex] = { ...newFields[fieldIndex], values: newValues };
    setPersonalizationFields(newFields);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !content || !fromName || !fromEmail) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (recipients.some(r => !r.email)) {
      alert('Please provide email addresses for all recipients');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would send the data to an API
      console.log('Sending cold emails:', {
        subject,
        content,
        fromName,
        fromEmail,
        replyTo,
        recipients,
        personalizationFields,
        followUp: followUpEnabled ? {
          days: followUpDays,
          content: followUpContent
        } : null
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Cold emails scheduled successfully!');
      
      // Reset form
      setSubject('');
      setContent('');
      setFollowUpContent('');
      setRecipients([{ name: '', email: '', company: '' }]);
      setPersonalizationFields([
        { field: 'firstName', values: [''] },
        { field: 'companyName', values: [''] }
      ]);
    } catch (error) {
      console.error('Error sending cold emails:', error);
      alert('Failed to send cold emails. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Cold Email Outreach</h3>
        <p className="mt-1 text-sm text-gray-500">Create personalized cold email campaigns</p>
      </div>
      
      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
        {/* Sender Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="from-name" className="block text-sm font-medium text-gray-700">
              From Name *
            </label>
            <input
              type="text"
              id="from-name"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="reply-to" className="block text-sm font-medium text-gray-700">
            Reply-To Email (if different)
          </label>
          <input
            type="email"
            id="reply-to"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={replyTo}
            onChange={(e) => setReplyTo(e.target.value)}
          />
        </div>
        
        {/* Email Content */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject Line *
          </label>
          <input
            type="text"
            id="subject"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Use {{firstName}}, {{companyName}}, etc. for personalization
          </p>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Email Content *
          </label>
          <textarea
            id="content"
            rows={6}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Use {{firstName}}, {{companyName}}, etc. for personalization
          </p>
        </div>
        
        {/* Recipients */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Recipients *
            </label>
            <button
              type="button"
              onClick={addRecipient}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Recipient
            </button>
          </div>
          
          <div className="space-y-3">
            {recipients.map((recipient, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={recipient.name}
                    onChange={(e) => handleRecipientChange(index, 'name', e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={recipient.email}
                    onChange={(e) => handleRecipientChange(index, 'email', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={recipient.company}
                    onChange={(e) => handleRecipientChange(index, 'company', e.target.value)}
                  />
                </div>
                {recipients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRecipient(index)}
                    className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Remove</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={() => document.getElementById('csv-upload')?.click()}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlusIcon className="h-4 w-4 mr-1" />
              Import CSV
            </button>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="sr-only"
              onChange={() => alert('CSV import would be implemented here')}
            />
            
            <span className="text-sm text-gray-500">
              {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* Advanced Options */}
        <div>
          <button
            type="button"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? (
              <ChevronUpIcon className="h-5 w-5 mr-1" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 mr-1" />
            )}
            Advanced Options
          </button>
          
          {showAdvanced && (
            <div className="mt-4 space-y-4">
              {/* Personalization Fields */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Personalization Fields
                  </label>
                  <button
                    type="button"
                    onClick={addPersonalizationField}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Field
                  </button>
                </div>
                
                <div className="space-y-3">
                  {personalizationFields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Field Name"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={field.field}
                            onChange={(e) => handlePersonalizationFieldChange(fieldIndex, 'field', e.target.value)}
                          />
                        </div>
                        {personalizationFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePersonalizationField(fieldIndex)}
                            className="ml-2 inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <span className="sr-only">Remove</span>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        {field.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="flex items-center">
                            <span className="text-xs text-gray-500 w-24 truncate">
                              {recipients[valueIndex]?.email || `Recipient ${valueIndex + 1}`}:
                            </span>
                            <input
                              type="text"
                              className="ml-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={value}
                              onChange={(e) => handlePersonalizationValueChange(fieldIndex, valueIndex, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Follow-up Email */}
              <div>
                <div className="flex items-center">
                  <input
                    id="follow-up"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={followUpEnabled}
                    onChange={() => setFollowUpEnabled(!followUpEnabled)}
                  />
                  <label htmlFor="follow-up" className="ml-2 block text-sm text-gray-700">
                    Enable follow-up email
                  </label>
                </div>
                
                {followUpEnabled && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label htmlFor="follow-up-days" className="block text-sm font-medium text-gray-700">
                        Days after initial email
                      </label>
                      <input
                        type="number"
                        id="follow-up-days"
                        min="1"
                        max="30"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={followUpDays}
                        onChange={(e) => setFollowUpDays(parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="follow-up-content" className="block text-sm font-medium text-gray-700">
                        Follow-up Content
                      </label>
                      <textarea
                        id="follow-up-content"
                        rows={4}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={followUpContent}
                        onChange={(e) => setFollowUpContent(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Submit buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              // Save as draft logic would go here
              alert('Draft saved!');
            }}
          >
            <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
            Save as Draft
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Sending...' : 'Send Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
}
