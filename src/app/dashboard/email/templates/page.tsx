'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  PlusIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useEmailMarketing } from '@/hooks/useEmailMarketing';
import EmailTemplateEditor from '@/components/email/EmailTemplateEditor';
import { EmailTemplate } from '@/models/email';

export default function TemplatesPage() {
  const { 
    templates, 
    deleteEmailTemplate,
    previewEmailTemplate,
    loading, 
    error 
  } = useEmailMarketing();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewingTemplate, setPreviewingTemplate] = useState<EmailTemplate | null>(null);
  
  // Filter templates by category
  const [categoryFilter, setCategoryFilter] = useState<EmailTemplate['category'] | 'all'>('all');
  
  const filteredTemplates = categoryFilter === 'all'
    ? templates
    : templates.filter(template => template.category === categoryFilter);
  
  // Handle template edit
  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };
  
  // Handle template duplicate
  const handleDuplicateTemplate = (template: EmailTemplate) => {
    setEditingTemplate({
      ...template,
      id: '',
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    setShowEditor(true);
  };
  
  // Handle template delete
  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteEmailTemplate(templateId);
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };
  
  // Handle template preview
  const handlePreviewTemplate = async (template: EmailTemplate) => {
    try {
      const html = await previewEmailTemplate(template.id);
      setPreviewHtml(html);
      setPreviewingTemplate(template);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to preview template:', error);
    }
  };
  
  // Handle template save
  const handleTemplateSave = (template: EmailTemplate) => {
    setShowEditor(false);
    setEditingTemplate(null);
  };
  
  // Get category badge color
  const getCategoryBadgeColor = (category: EmailTemplate['category']) => {
    switch (category) {
      case 'promotional':
        return 'bg-blue-100 text-blue-800';
      case 'newsletter':
        return 'bg-green-100 text-green-800';
      case 'transactional':
        return 'bg-yellow-100 text-yellow-800';
      case 'cold-outreach':
        return 'bg-purple-100 text-purple-800';
      case 'follow-up':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-semibold text-gray-900">Email Templates</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-lg font-medium text-gray-900">Templates</h2>
            
            <div className="flex space-x-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as EmailTemplate['category'] | 'all')}
                className="block rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Categories</option>
                <option value="promotional">Promotional</option>
                <option value="newsletter">Newsletter</option>
                <option value="transactional">Transactional</option>
                <option value="cold-outreach">Cold Outreach</option>
                <option value="follow-up">Follow-up</option>
              </select>
              
              <button
                type="button"
                onClick={() => {
                  setEditingTemplate(null);
                  setShowEditor(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                New Template
              </button>
            </div>
          </div>
        </div>
        
        {/* Templates grid */}
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-4">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {categoryFilter === 'all'
                  ? 'Get started by creating a new email template.'
                  : `No templates found in the "${categoryFilter}" category.`}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTemplate(null);
                    setShowEditor(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  New Template
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryBadgeColor(template.category)}`}>
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{template.subject}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {template.variables.map((variable) => (
                        <span key={variable} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                          {variable}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handlePreviewTemplate(template)}
                        className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Preview"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditTemplate(template)}
                        className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateTemplate(template)}
                        className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Duplicate"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add new template card */}
              <div 
                className="border border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center h-64 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setEditingTemplate(null);
                  setShowEditor(true);
                }}
              >
                <div className="text-center">
                  <PlusIcon className="h-10 w-10 text-gray-400 mx-auto" />
                  <p className="mt-2 text-sm font-medium text-gray-900">Create New Template</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Template editor modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <EmailTemplateEditor
                      templateId={editingTemplate?.id}
                      initialTemplate={editingTemplate || undefined}
                      onSave={handleTemplateSave}
                      onCancel={() => {
                        setShowEditor(false);
                        setEditingTemplate(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Template preview modal */}
      {showPreview && previewingTemplate && (
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
                        Template Preview: {previewingTemplate.name}
                      </h3>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShowPreview(false)}
                      >
                        <span className="sr-only">Close</span>
                        <ArrowLeftIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="mt-2">
                      <div className="bg-gray-100 p-2 mb-4 rounded">
                        <div className="text-sm font-medium text-gray-900">Subject: {previewingTemplate.subject}</div>
                        {previewingTemplate.previewText && (
                          <div className="text-sm text-gray-500">Preview: {previewingTemplate.previewText}</div>
                        )}
                      </div>
                      
                      <div className="border border-gray-300 rounded-md overflow-hidden">
                        {previewHtml ? (
                          <iframe
                            srcDoc={previewHtml}
                            className="w-full h-96"
                            title="Email Preview"
                          />
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400" />
                            <p className="mt-2">Preview not available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleEditTemplate(previewingTemplate)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Edit Template
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
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
