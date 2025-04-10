'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  CodeBracketIcon,
  PhotoIcon,
  LinkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { EmailTemplate } from '@/models/email';
import { useEmailMarketing } from '@/hooks/useEmailMarketing';

interface EmailTemplateEditorProps {
  templateId?: string;
  initialTemplate?: Partial<EmailTemplate>;
  onSave?: (template: EmailTemplate) => void;
  onCancel?: () => void;
}

export default function EmailTemplateEditor({
  templateId,
  initialTemplate,
  onSave,
  onCancel
}: EmailTemplateEditorProps) {
  const { 
    templates, 
    createEmailTemplate, 
    updateEmailTemplate,
    previewEmailTemplate,
    validateEmailContent,
    loading, 
    error 
  } = useEmailMarketing();
  
  const [name, setName] = useState(initialTemplate?.name || '');
  const [subject, setSubject] = useState(initialTemplate?.subject || '');
  const [content, setContent] = useState(initialTemplate?.content || '');
  const [previewText, setPreviewText] = useState(initialTemplate?.previewText || '');
  const [category, setCategory] = useState<EmailTemplate['category']>(
    initialTemplate?.category || 'promotional'
  );
  const [variables, setVariables] = useState<string[]>(initialTemplate?.variables || []);
  const [newVariable, setNewVariable] = useState('');
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; issues?: string[] } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  
  // Load template data if editing an existing template
  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setName(template.name);
        setSubject(template.subject);
        setContent(template.content);
        setPreviewText(template.previewText || '');
        setCategory(template.category);
        setVariables(template.variables);
      }
    }
  }, [templateId, templates]);
  
  // Handle variable addition
  const handleAddVariable = () => {
    if (newVariable && !variables.includes(newVariable)) {
      setVariables([...variables, newVariable]);
      setNewVariable('');
    }
  };
  
  // Handle variable removal
  const handleRemoveVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };
  
  // Handle preview
  const handlePreview = async () => {
    try {
      const html = await previewEmailTemplate(templateId || 'preview');
      setPreviewHtml(html);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to preview template:', error);
    }
  };
  
  // Handle validation
  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateEmailContent(content);
      setValidationResult(result);
    } catch (error) {
      console.error('Failed to validate template:', error);
    } finally {
      setIsValidating(false);
    }
  };
  
  // Handle save
  const handleSave = async () => {
    if (!name || !subject || !content) {
      alert('Please fill in all required fields.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      let savedTemplate: EmailTemplate;
      
      if (templateId) {
        // Update existing template
        savedTemplate = await updateEmailTemplate(templateId, {
          name,
          subject,
          content,
          previewText,
          category,
          variables
        });
      } else {
        // Create new template
        savedTemplate = await createEmailTemplate(
          name,
          subject,
          content,
          category,
          previewText,
          variables
        );
      }
      
      if (onSave) {
        onSave(savedTemplate);
      }
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Insert variable into content
  const insertVariable = (variable: string) => {
    const variableText = `{{${variable}}}`;
    
    // Get cursor position
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insert variable at cursor position
      const newContent = content.substring(0, start) + variableText + content.substring(end);
      setContent(newContent);
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableText.length, start + variableText.length);
      }, 0);
    } else {
      // If textarea not found, just append to the end
      setContent(content + ' ' + variableText);
    }
  };
  
  // Insert HTML element
  const insertHtmlElement = (element: string) => {
    let htmlToInsert = '';
    
    switch (element) {
      case 'heading':
        htmlToInsert = '<h2>Heading Text</h2>';
        break;
      case 'paragraph':
        htmlToInsert = '<p>Paragraph text goes here.</p>';
        break;
      case 'button':
        htmlToInsert = '<a href="{{buttonUrl}}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">Click Here</a>';
        break;
      case 'image':
        htmlToInsert = '<img src="https://example.com/image.jpg" alt="Image description" style="max-width: 100%; height: auto;" />';
        break;
      case 'divider':
        htmlToInsert = '<hr style="border: 0; height: 1px; background-color: #E5E7EB; margin: 20px 0;" />';
        break;
      case 'spacer':
        htmlToInsert = '<div style="height: 20px;"></div>';
        break;
    }
    
    // Get cursor position
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insert HTML at cursor position
      const newContent = content.substring(0, start) + htmlToInsert + content.substring(end);
      setContent(newContent);
      
      // Set cursor position after the inserted HTML
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + htmlToInsert.length, start + htmlToInsert.length);
      }, 0);
    } else {
      // If textarea not found, just append to the end
      setContent(content + '\n' + htmlToInsert);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {templateId ? 'Edit Email Template' : 'Create Email Template'}
          </h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              Preview
            </button>
            <button
              type="button"
              onClick={handleValidate}
              disabled={isValidating}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isValidating ? (
                <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <CheckIcon className="h-4 w-4 mr-1" />
              )}
              Validate
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {/* Validation result */}
        {validationResult && (
          <div className={`mb-4 p-4 rounded-md ${validationResult.valid ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {validationResult.valid ? (
                  <CheckIcon className="h-5 w-5 text-green-400" />
                ) : (
                  <XMarkIcon className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${validationResult.valid ? 'text-green-800' : 'text-red-800'}`}>
                  {validationResult.valid ? 'Template is valid!' : 'Template has issues:'}
                </h3>
                {!validationResult.valid && validationResult.issues && (
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {validationResult.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          {/* Template name */}
          <div>
            <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">
              Template Name *
            </label>
            <input
              type="text"
              id="template-name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          {/* Template category */}
          <div>
            <label htmlFor="template-category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="template-category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value as EmailTemplate['category'])}
              required
            >
              <option value="promotional">Promotional</option>
              <option value="newsletter">Newsletter</option>
              <option value="transactional">Transactional</option>
              <option value="cold-outreach">Cold Outreach</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
          
          {/* Subject line */}
          <div>
            <label htmlFor="template-subject" className="block text-sm font-medium text-gray-700">
              Subject Line *
            </label>
            <input
              type="text"
              id="template-subject"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          
          {/* Preview text */}
          <div>
            <label htmlFor="template-preview-text" className="block text-sm font-medium text-gray-700">
              Preview Text
            </label>
            <input
              type="text"
              id="template-preview-text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Brief text that appears in email clients"
            />
            <p className="mt-1 text-xs text-gray-500">
              This text appears in the inbox preview of most email clients.
            </p>
          </div>
          
          {/* Template content */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="template-content" className="block text-sm font-medium text-gray-700">
                Email Content *
              </label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setEditorMode('visual')}
                  className={`px-3 py-1 text-xs font-medium ${
                    editorMode === 'visual' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Visual
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('code')}
                  className={`px-3 py-1 text-xs font-medium ${
                    editorMode === 'code' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  HTML
                </button>
              </div>
            </div>
            
            {/* Editor toolbar */}
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                type="button"
                onClick={() => insertHtmlElement('heading')}
                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Heading
              </button>
              <button
                type="button"
                onClick={() => insertHtmlElement('paragraph')}
                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Paragraph
              </button>
              <button
                type="button"
                onClick={() => insertHtmlElement('button')}
                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Button
              </button>
              <button
                type="button"
                onClick={() => insertHtmlElement('image')}
                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <PhotoIcon className="h-3 w-3 mr-1" />
                Image
              </button>
              <button
                type="button"
                onClick={() => insertHtmlElement('divider')}
                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Divider
              </button>
              <button
                type="button"
                onClick={() => insertHtmlElement('spacer')}
                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Spacer
              </button>
            </div>
            
            <textarea
              id="template-content"
              rows={12}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono ${
                editorMode === 'code' ? 'bg-gray-50' : ''
              }`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {editorMode === 'code' 
                ? 'Edit HTML directly. Use {{variableName}} for dynamic content.' 
                : 'Use the toolbar to add elements. HTML is also supported.'}
            </p>
          </div>
          
          {/* Variables */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Variables
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {variables.map((variable) => (
                <div 
                  key={variable}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <span 
                    className="cursor-pointer hover:underline"
                    onClick={() => insertVariable(variable)}
                  >
                    {variable}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariable(variable)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove variable {variable}</span>
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {variables.length === 0 && (
                <span className="text-xs text-gray-500">
                  No variables defined. Add variables to use dynamic content.
                </span>
              )}
            </div>
            <div className="flex">
              <input
                type="text"
                className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Add a variable (e.g. firstName)"
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddVariable();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddVariable}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 shadow-sm text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Variables will be replaced with actual values when sending emails.
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
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
          disabled={isSaving || !name || !subject || !content}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Template'}
        </button>
      </div>
      
      {/* Preview modal */}
      {showPreview && (
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
                        Email Preview
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
                        <div className="text-sm font-medium text-gray-900">Subject: {subject}</div>
                        {previewText && (
                          <div className="text-sm text-gray-500">Preview: {previewText}</div>
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
