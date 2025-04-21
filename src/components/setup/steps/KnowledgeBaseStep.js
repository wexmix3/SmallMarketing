/**
 * Knowledge Base Step Component
 * Second step of the setup wizard for building the knowledge base
 */

import React, { useState, useEffect } from 'react';
import { getSchemaForBusinessType } from '../../../models/knowledgeBaseSchema';
import ContentExtractionService from '../../../services/contentExtractionService';

/**
 * Knowledge Base Step Component
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Submit handler
 * @param {Array} props.initialData - Initial knowledge base data
 * @param {string} props.businessType - Business type
 * @returns {JSX.Element} - Knowledge base step component
 */
export const KnowledgeBaseStep = ({ onSubmit, initialData, businessType }) => {
  // State for knowledge base items
  const [knowledgeItems, setKnowledgeItems] = useState(initialData || []);
  
  // State for new item form
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  
  // State for import options
  const [importSource, setImportSource] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [documentFiles, setDocumentFiles] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  
  // State for suggested questions
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  
  // Content extraction service
  const contentExtractor = new ContentExtractionService();
  
  // Load suggested questions based on business type
  useEffect(() => {
    if (businessType) {
      const schema = getSchemaForBusinessType(businessType);
      setSuggestedQuestions(schema.suggestedQuestions || []);
    }
  }, [businessType]);
  
  /**
   * Add a new knowledge base item
   * @param {Event} e - Form event
   */
  const handleAddItem = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newQuestion || !newAnswer) {
      alert('Please enter both a question and an answer.');
      return;
    }
    
    // Create new item
    const newItem = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
      category: newCategory,
      tags: [],
      businessType,
      lastUpdated: new Date()
    };
    
    // Add to knowledge items
    setKnowledgeItems([...knowledgeItems, newItem]);
    
    // Reset form
    setNewQuestion('');
    setNewAnswer('');
    setNewCategory('general');
  };
  
  /**
   * Remove a knowledge base item
   * @param {string} id - Item ID
   */
  const handleRemoveItem = (id) => {
    setKnowledgeItems(knowledgeItems.filter(item => item.id !== id));
  };
  
  /**
   * Edit a knowledge base item
   * @param {string} id - Item ID
   * @param {Object} updatedItem - Updated item data
   */
  const handleEditItem = (id, updatedItem) => {
    setKnowledgeItems(knowledgeItems.map(item => 
      item.id === id ? { ...item, ...updatedItem, lastUpdated: new Date() } : item
    ));
  };
  
  /**
   * Import content from external source
   * @param {Event} e - Form event
   */
  const handleImport = async (e) => {
    e.preventDefault();
    
    setIsImporting(true);
    
    try {
      let importedItems = [];
      
      // Import based on source type
      switch (importSource) {
        case 'website':
          if (!websiteUrl) {
            alert('Please enter a website URL.');
            setIsImporting(false);
            return;
          }
          
          importedItems = await contentExtractor.extractFromWebsite(websiteUrl, businessType);
          break;
          
        case 'document':
          if (!documentFiles.length) {
            alert('Please select at least one document.');
            setIsImporting(false);
            return;
          }
          
          importedItems = await contentExtractor.extractFromDocuments(documentFiles, businessType);
          break;
          
        default:
          alert('Please select an import source.');
          setIsImporting(false);
          return;
      }
      
      // Add imported items to knowledge base
      setKnowledgeItems([...knowledgeItems, ...importedItems]);
      
      // Reset import form
      setImportSource('');
      setWebsiteUrl('');
      setDocumentFiles([]);
      
      alert(`Successfully imported ${importedItems.length} items.`);
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing content. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };
  
  /**
   * Add a suggested question
   * @param {string} question - Suggested question
   */
  const handleAddSuggested = (question) => {
    setNewQuestion(question);
    // Focus on answer field
    document.getElementById('newAnswer').focus();
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = () => {
    // Submit knowledge base
    onSubmit(knowledgeItems);
  };
  
  return (
    <div className="knowledge-base-step">
      <h2>Build Your Knowledge Base</h2>
      <p className="step-description">
        Your knowledge base contains the information your AI assistant will use to answer customer questions.
        Add questions and answers manually or import them from your website or documents.
      </p>
      
      <div className="knowledge-base-content">
        <div className="knowledge-base-form">
          <div className="form-section">
            <h3>Add Questions & Answers</h3>
            
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label htmlFor="newQuestion">Question</label>
                <input
                  type="text"
                  id="newQuestion"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter a question your customers might ask"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newAnswer">Answer</label>
                <textarea
                  id="newAnswer"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={3}
                  placeholder="Enter the answer to this question"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newCategory">Category</label>
                <select
                  id="newCategory"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-control"
                >
                  <option value="general">General</option>
                  <option value="products">Products</option>
                  <option value="services">Services</option>
                  <option value="pricing">Pricing</option>
                  <option value="hours">Hours</option>
                  <option value="location">Location</option>
                  <option value="contact">Contact</option>
                  <option value="policies">Policies</option>
                </select>
              </div>
              
              <button type="submit" className="btn btn-secondary">
                Add Question
              </button>
            </form>
          </div>
          
          <div className="form-section">
            <h3>Import Content</h3>
            
            <form onSubmit={handleImport}>
              <div className="form-group">
                <label htmlFor="importSource">Import Source</label>
                <select
                  id="importSource"
                  value={importSource}
                  onChange={(e) => setImportSource(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select a source</option>
                  <option value="website">Website</option>
                  <option value="document">Documents</option>
                </select>
              </div>
              
              {importSource === 'website' && (
                <div className="form-group">
                  <label htmlFor="websiteUrl">Website URL</label>
                  <input
                    type="url"
                    id="websiteUrl"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourbusiness.com"
                    className="form-control"
                  />
                </div>
              )}
              
              {importSource === 'document' && (
                <div className="form-group">
                  <label htmlFor="documentFiles">Upload Documents</label>
                  <input
                    type="file"
                    id="documentFiles"
                    multiple
                    onChange={(e) => setDocumentFiles(Array.from(e.target.files))}
                    className="form-control"
                  />
                  <small className="form-text text-muted">
                    Supported formats: PDF, DOCX, TXT
                  </small>
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-secondary"
                disabled={isImporting}
              >
                {isImporting ? 'Importing...' : 'Import Content'}
              </button>
            </form>
          </div>
          
          <div className="form-section">
            <h3>Suggested Questions</h3>
            <p className="section-description">
              Based on your business type, here are some common questions you might want to add:
            </p>
            
            <div className="suggested-questions">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  className="suggested-question"
                  onClick={() => handleAddSuggested(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="knowledge-base-items">
          <h3>Knowledge Base Items ({knowledgeItems.length})</h3>
          
          {knowledgeItems.length === 0 ? (
            <div className="empty-state">
              <p>No items in your knowledge base yet. Add questions and answers to get started.</p>
            </div>
          ) : (
            <div className="items-list">
              {knowledgeItems.map((item) => (
                <div key={item.id} className="knowledge-item">
                  <div className="item-header">
                    <span className="item-category">{item.category}</span>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      &times;
                    </button>
                  </div>
                  
                  <h4 className="item-question">{item.question}</h4>
                  <p className="item-answer">{item.answer}</p>
                  
                  <div className="item-footer">
                    <span className="item-date">
                      Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => onSubmit([])}>
          Back
        </button>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={knowledgeItems.length === 0}
        >
          Next: Customization
        </button>
      </div>
    </div>
  );
};
