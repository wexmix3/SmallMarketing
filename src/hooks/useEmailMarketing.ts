'use client';

import { useState, useEffect } from 'react';
import { 
  Contact, 
  ContactList, 
  EmailTemplate, 
  EmailCampaign,
  EmailEvent,
  ContactStatus
} from '@/models/email';
import { 
  createContact,
  updateContact,
  changeContactStatus,
  createContactList,
  addContactsToList,
  removeContactsFromList,
  createEmailTemplate,
  updateEmailTemplate,
  createEmailCampaign,
  scheduleCampaign,
  sendCampaignNow,
  cancelCampaign,
  getCampaignStats,
  getCampaignEvents,
  previewEmail,
  validateEmail,
  importContactsFromCSV,
  exportContactsToCSV
} from '@/services/emailService';
import { 
  ContactRepository, 
  ContactListRepository, 
  EmailTemplateRepository, 
  EmailCampaignRepository, 
  EmailEventRepository 
} from '@/repositories/emailRepository';

/**
 * Hook for managing email marketing functionality
 */
export function useEmailMarketing() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [contactsData, listsData, templatesData, campaignsData] = await Promise.all([
          ContactRepository.getAll(),
          ContactListRepository.getAll(),
          EmailTemplateRepository.getAll(),
          EmailCampaignRepository.getAll()
        ]);
        
        setContacts(contactsData);
        setContactLists(listsData);
        setTemplates(templatesData);
        setCampaigns(campaignsData);
      } catch (err) {
        setError('Failed to load email marketing data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Contact Management
  
  /**
   * Create a new contact
   */
  const createNewContact = async (
    email: string,
    firstName?: string,
    lastName?: string,
    company?: string,
    position?: string,
    phone?: string,
    tags: string[] = [],
    customFields?: Record<string, string>
  ) => {
    try {
      setLoading(true);
      
      // Create contact
      const contact = await createContact(
        email,
        firstName,
        lastName,
        company,
        position,
        phone,
        tags,
        customFields
      );
      
      // Save contact
      await ContactRepository.save(contact);
      
      // Update state
      setContacts(prev => [...prev, contact]);
      return contact;
    } catch (err) {
      setError('Failed to create contact');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Update an existing contact
   */
  const updateExistingContact = async (
    contactId: string,
    updates: Partial<Contact>
  ) => {
    try {
      setLoading(true);
      
      // Get the contact
      const contact = await ContactRepository.getById(contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      // Update contact
      const updatedContact = await updateContact(contactId, updates);
      
      // Save updated contact
      await ContactRepository.save(updatedContact);
      
      // Update state
      setContacts(prev => prev.map(c => c.id === contactId ? updatedContact : c));
      return updatedContact;
    } catch (err) {
      setError('Failed to update contact');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Change contact status
   */
  const updateContactStatus = async (
    contactId: string,
    status: ContactStatus
  ) => {
    try {
      setLoading(true);
      
      // Get the contact
      const contact = await ContactRepository.getById(contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      // Update contact status
      const updatedContact = await changeContactStatus(contactId, status);
      
      // Save updated contact
      await ContactRepository.save(updatedContact);
      
      // Update state
      setContacts(prev => prev.map(c => c.id === contactId ? updatedContact : c));
      return updatedContact;
    } catch (err) {
      setError('Failed to update contact status');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Delete a contact
   */
  const deleteContact = async (contactId: string) => {
    try {
      setLoading(true);
      const success = await ContactRepository.delete(contactId);
      
      if (success) {
        // Update state
        setContacts(prev => prev.filter(c => c.id !== contactId));
      }
      
      return success;
    } catch (err) {
      setError('Failed to delete contact');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Import contacts from CSV
   */
  const importContacts = async (fileContent: string) => {
    try {
      setLoading(true);
      
      // Import contacts
      const result = await importContactsFromCSV(fileContent);
      
      // Reload contacts
      const updatedContacts = await ContactRepository.getAll();
      setContacts(updatedContacts);
      
      return result;
    } catch (err) {
      setError('Failed to import contacts');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Export contacts to CSV
   */
  const exportContacts = async (listId?: string) => {
    try {
      setLoading(true);
      
      // Export contacts
      const csvContent = await exportContactsToCSV(listId);
      return csvContent;
    } catch (err) {
      setError('Failed to export contacts');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Contact List Management
  
  /**
   * Create a new contact list
   */
  const createNewContactList = async (
    name: string,
    description?: string,
    contactIds: string[] = []
  ) => {
    try {
      setLoading(true);
      
      // Create contact list
      const list = await createContactList(name, description, contactIds);
      
      // Save contact list
      await ContactListRepository.save(list);
      
      // Update state
      setContactLists(prev => [...prev, list]);
      return list;
    } catch (err) {
      setError('Failed to create contact list');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Update a contact list
   */
  const updateContactList = async (
    listId: string,
    updates: Partial<ContactList>
  ) => {
    try {
      setLoading(true);
      
      // Get the list
      const list = await ContactListRepository.getById(listId);
      if (!list) {
        throw new Error('Contact list not found');
      }
      
      // Update list
      const updatedList: ContactList = {
        ...list,
        ...updates,
        updatedAt: new Date()
      };
      
      // Save updated list
      await ContactListRepository.save(updatedList);
      
      // Update state
      setContactLists(prev => prev.map(l => l.id === listId ? updatedList : l));
      return updatedList;
    } catch (err) {
      setError('Failed to update contact list');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Delete a contact list
   */
  const deleteContactList = async (listId: string) => {
    try {
      setLoading(true);
      const success = await ContactListRepository.delete(listId);
      
      if (success) {
        // Update state
        setContactLists(prev => prev.filter(l => l.id !== listId));
      }
      
      return success;
    } catch (err) {
      setError('Failed to delete contact list');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Add contacts to a list
   */
  const addContactsToContactList = async (
    listId: string,
    contactIds: string[]
  ) => {
    try {
      setLoading(true);
      
      // Add contacts to list
      const updatedList = await addContactsToList(listId, contactIds);
      
      if (updatedList) {
        // Update state
        setContactLists(prev => prev.map(l => l.id === listId ? updatedList : l));
      }
      
      return updatedList;
    } catch (err) {
      setError('Failed to add contacts to list');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Remove contacts from a list
   */
  const removeContactsFromContactList = async (
    listId: string,
    contactIds: string[]
  ) => {
    try {
      setLoading(true);
      
      // Remove contacts from list
      const updatedList = await removeContactsFromList(listId, contactIds);
      
      if (updatedList) {
        // Update state
        setContactLists(prev => prev.map(l => l.id === listId ? updatedList : l));
      }
      
      return updatedList;
    } catch (err) {
      setError('Failed to remove contacts from list');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Email Template Management
  
  /**
   * Create a new email template
   */
  const createNewEmailTemplate = async (
    name: string,
    subject: string,
    content: string,
    category: EmailTemplate['category'],
    previewText?: string,
    variables: string[] = []
  ) => {
    try {
      setLoading(true);
      
      // Create email template
      const template = await createEmailTemplate(
        name,
        subject,
        content,
        category,
        previewText,
        variables
      );
      
      // Save email template
      await EmailTemplateRepository.save(template);
      
      // Update state
      setTemplates(prev => [...prev, template]);
      return template;
    } catch (err) {
      setError('Failed to create email template');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Update an email template
   */
  const updateEmailTemplateContent = async (
    templateId: string,
    updates: Partial<EmailTemplate>
  ) => {
    try {
      setLoading(true);
      
      // Get the template
      const template = await EmailTemplateRepository.getById(templateId);
      if (!template) {
        throw new Error('Email template not found');
      }
      
      // Update template
      const updatedTemplate = await updateEmailTemplate(templateId, updates);
      
      // Save updated template
      await EmailTemplateRepository.save(updatedTemplate);
      
      // Update state
      setTemplates(prev => prev.map(t => t.id === templateId ? updatedTemplate : t));
      return updatedTemplate;
    } catch (err) {
      setError('Failed to update email template');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Delete an email template
   */
  const deleteEmailTemplate = async (templateId: string) => {
    try {
      setLoading(true);
      const success = await EmailTemplateRepository.delete(templateId);
      
      if (success) {
        // Update state
        setTemplates(prev => prev.filter(t => t.id !== templateId));
      }
      
      return success;
    } catch (err) {
      setError('Failed to delete email template');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Preview an email template
   */
  const previewEmailTemplate = async (
    templateId: string,
    contactId?: string
  ) => {
    try {
      setLoading(true);
      
      // Preview email
      const previewHtml = await previewEmail(templateId, contactId);
      return previewHtml;
    } catch (err) {
      setError('Failed to preview email template');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Validate email content
   */
  const validateEmailContent = async (content: string) => {
    try {
      setLoading(true);
      
      // Validate email
      const result = await validateEmail(content);
      return result;
    } catch (err) {
      setError('Failed to validate email content');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Campaign Management
  
  /**
   * Create a new email campaign
   */
  const createNewEmailCampaign = async (
    name: string,
    subject: string,
    fromName: string,
    fromEmail: string,
    templateId: string,
    listIds: string[],
    replyTo?: string,
    scheduledAt?: Date
  ) => {
    try {
      setLoading(true);
      
      // Create email campaign
      const campaign = await createEmailCampaign(
        name,
        subject,
        fromName,
        fromEmail,
        templateId,
        listIds,
        replyTo,
        scheduledAt
      );
      
      // Save email campaign
      await EmailCampaignRepository.save(campaign);
      
      // Update state
      setCampaigns(prev => [...prev, campaign]);
      return campaign;
    } catch (err) {
      setError('Failed to create email campaign');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Schedule a campaign
   */
  const scheduleEmailCampaign = async (
    campaignId: string,
    scheduledAt: Date
  ) => {
    try {
      setLoading(true);
      
      // Schedule campaign
      const campaign = await scheduleCampaign(campaignId, scheduledAt);
      
      // Save campaign
      await EmailCampaignRepository.save(campaign);
      
      // Update state
      setCampaigns(prev => prev.map(c => c.id === campaignId ? campaign : c));
      return campaign;
    } catch (err) {
      setError('Failed to schedule campaign');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Send a campaign immediately
   */
  const sendCampaignImmediately = async (campaignId: string) => {
    try {
      setLoading(true);
      
      // Send campaign
      const campaign = await sendCampaignNow(campaignId);
      
      // Save campaign
      await EmailCampaignRepository.save(campaign);
      
      // Update state
      setCampaigns(prev => prev.map(c => c.id === campaignId ? campaign : c));
      return campaign;
    } catch (err) {
      setError('Failed to send campaign');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Cancel a campaign
   */
  const cancelEmailCampaign = async (campaignId: string) => {
    try {
      setLoading(true);
      
      // Cancel campaign
      const campaign = await cancelCampaign(campaignId);
      
      // Save campaign
      await EmailCampaignRepository.save(campaign);
      
      // Update state
      setCampaigns(prev => prev.map(c => c.id === campaignId ? campaign : c));
      return campaign;
    } catch (err) {
      setError('Failed to cancel campaign');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Delete a campaign
   */
  const deleteEmailCampaign = async (campaignId: string) => {
    try {
      setLoading(true);
      const success = await EmailCampaignRepository.delete(campaignId);
      
      if (success) {
        // Update state
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      }
      
      return success;
    } catch (err) {
      setError('Failed to delete campaign');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Get campaign statistics
   */
  const getCampaignStatistics = async (campaignId: string) => {
    try {
      setLoading(true);
      
      // Get campaign stats
      const stats = await getCampaignStats(campaignId);
      
      // Update campaign in state
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaignId) {
          return {
            ...c,
            stats
          };
        }
        return c;
      }));
      
      return stats;
    } catch (err) {
      setError('Failed to get campaign statistics');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Get campaign events
   */
  const getCampaignEventHistory = async (campaignId: string) => {
    try {
      setLoading(true);
      
      // Get campaign events
      const events = await getCampaignEvents(campaignId);
      return events;
    } catch (err) {
      setError('Failed to get campaign events');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Query functions
  
  /**
   * Get contacts by status
   */
  const getContactsByStatus = async (status: ContactStatus) => {
    try {
      return await ContactRepository.getByStatus(status);
    } catch (err) {
      setError('Failed to get contacts');
      console.error(err);
      return [];
    }
  };
  
  /**
   * Get contacts by tag
   */
  const getContactsByTag = async (tag: string) => {
    try {
      return await ContactRepository.getByTag(tag);
    } catch (err) {
      setError('Failed to get contacts');
      console.error(err);
      return [];
    }
  };
  
  /**
   * Search contacts
   */
  const searchContacts = async (query: string) => {
    try {
      return await ContactRepository.search(query);
    } catch (err) {
      setError('Failed to search contacts');
      console.error(err);
      return [];
    }
  };
  
  /**
   * Get templates by category
   */
  const getTemplatesByCategory = async (category: EmailTemplate['category']) => {
    try {
      return await EmailTemplateRepository.getByCategory(category);
    } catch (err) {
      setError('Failed to get templates');
      console.error(err);
      return [];
    }
  };
  
  /**
   * Get campaigns by status
   */
  const getCampaignsByStatus = async (status: EmailCampaign['status']) => {
    try {
      return await EmailCampaignRepository.getByStatus(status);
    } catch (err) {
      setError('Failed to get campaigns');
      console.error(err);
      return [];
    }
  };
  
  return {
    // State
    contacts,
    contactLists,
    templates,
    campaigns,
    loading,
    error,
    
    // Contact operations
    createContact: createNewContact,
    updateContact: updateExistingContact,
    updateContactStatus,
    deleteContact,
    importContacts,
    exportContacts,
    
    // Contact list operations
    createContactList: createNewContactList,
    updateContactList,
    deleteContactList,
    addContactsToList: addContactsToContactList,
    removeContactsFromList: removeContactsFromContactList,
    
    // Template operations
    createEmailTemplate: createNewEmailTemplate,
    updateEmailTemplate: updateEmailTemplateContent,
    deleteEmailTemplate,
    previewEmailTemplate,
    validateEmailContent,
    
    // Campaign operations
    createEmailCampaign: createNewEmailCampaign,
    scheduleEmailCampaign,
    sendCampaignImmediately,
    cancelEmailCampaign,
    deleteEmailCampaign,
    getCampaignStatistics,
    getCampaignEventHistory,
    
    // Query operations
    getContactsByStatus,
    getContactsByTag,
    searchContacts,
    getTemplatesByCategory,
    getCampaignsByStatus,
  };
}
