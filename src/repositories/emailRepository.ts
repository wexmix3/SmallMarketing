/**
 * Email Repository
 * 
 * This repository handles data persistence for email marketing entities.
 * In a real application, this would interact with a database.
 * For this demo, we're using localStorage for persistence.
 */

import { 
  Contact, 
  ContactList, 
  EmailTemplate, 
  EmailCampaign,
  EmailEvent,
  getMockContacts,
  getMockContactLists,
  getMockEmailTemplates,
  getMockEmailCampaigns,
  getMockEmailEvents
} from '@/models/email';

// Storage keys
const CONTACTS_KEY = 'email_contacts';
const LISTS_KEY = 'email_lists';
const TEMPLATES_KEY = 'email_templates';
const CAMPAIGNS_KEY = 'email_campaigns';
const EVENTS_KEY = 'email_events';

/**
 * Contact Repository
 */
export const ContactRepository = {
  /**
   * Get all contacts
   */
  getAll: async (): Promise<Contact[]> => {
    try {
      const data = localStorage.getItem(CONTACTS_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockContacts = getMockContacts();
        localStorage.setItem(CONTACTS_KEY, JSON.stringify(mockContacts));
        return mockContacts;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting contacts:', error);
      return [];
    }
  },
  
  /**
   * Get a contact by ID
   */
  getById: async (id: string): Promise<Contact | null> => {
    try {
      const contacts = await ContactRepository.getAll();
      return contacts.find(contact => contact.id === id) || null;
    } catch (error) {
      console.error('Error getting contact by ID:', error);
      return null;
    }
  },
  
  /**
   * Get contacts by status
   */
  getByStatus: async (status: Contact['status']): Promise<Contact[]> => {
    try {
      const contacts = await ContactRepository.getAll();
      return contacts.filter(contact => contact.status === status);
    } catch (error) {
      console.error('Error getting contacts by status:', error);
      return [];
    }
  },
  
  /**
   * Get contacts by tag
   */
  getByTag: async (tag: string): Promise<Contact[]> => {
    try {
      const contacts = await ContactRepository.getAll();
      return contacts.filter(contact => contact.tags.includes(tag));
    } catch (error) {
      console.error('Error getting contacts by tag:', error);
      return [];
    }
  },
  
  /**
   * Search contacts
   */
  search: async (query: string): Promise<Contact[]> => {
    try {
      const contacts = await ContactRepository.getAll();
      const lowerQuery = query.toLowerCase();
      
      return contacts.filter(contact => 
        contact.email.toLowerCase().includes(lowerQuery) ||
        (contact.firstName && contact.firstName.toLowerCase().includes(lowerQuery)) ||
        (contact.lastName && contact.lastName.toLowerCase().includes(lowerQuery)) ||
        (contact.company && contact.company.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching contacts:', error);
      return [];
    }
  },
  
  /**
   * Save a contact
   */
  save: async (contact: Contact): Promise<Contact> => {
    try {
      const contacts = await ContactRepository.getAll();
      const index = contacts.findIndex(c => c.id === contact.id);
      
      if (index >= 0) {
        // Update existing contact
        contacts[index] = {
          ...contact,
          updatedAt: new Date()
        };
      } else {
        // Add new contact
        contacts.push({
          ...contact,
          id: contact.id || `contact-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
      return contact;
    } catch (error) {
      console.error('Error saving contact:', error);
      throw error;
    }
  },
  
  /**
   * Delete a contact
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const contacts = await ContactRepository.getAll();
      const filteredContacts = contacts.filter(contact => contact.id !== id);
      
      if (filteredContacts.length === contacts.length) {
        return false; // No contact was removed
      }
      
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(filteredContacts));
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      return false;
    }
  },
  
  /**
   * Bulk save contacts
   */
  bulkSave: async (newContacts: Contact[]): Promise<number> => {
    try {
      const contacts = await ContactRepository.getAll();
      let savedCount = 0;
      
      newContacts.forEach(newContact => {
        const index = contacts.findIndex(c => c.id === newContact.id);
        
        if (index >= 0) {
          // Update existing contact
          contacts[index] = {
            ...newContact,
            updatedAt: new Date()
          };
        } else {
          // Add new contact
          contacts.push({
            ...newContact,
            id: newContact.id || `contact-${Date.now()}-${savedCount}`,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        savedCount++;
      });
      
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
      return savedCount;
    } catch (error) {
      console.error('Error bulk saving contacts:', error);
      throw error;
    }
  }
};

/**
 * Contact List Repository
 */
export const ContactListRepository = {
  /**
   * Get all contact lists
   */
  getAll: async (): Promise<ContactList[]> => {
    try {
      const data = localStorage.getItem(LISTS_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockLists = getMockContactLists();
        localStorage.setItem(LISTS_KEY, JSON.stringify(mockLists));
        return mockLists;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting contact lists:', error);
      return [];
    }
  },
  
  /**
   * Get a contact list by ID
   */
  getById: async (id: string): Promise<ContactList | null> => {
    try {
      const lists = await ContactListRepository.getAll();
      return lists.find(list => list.id === id) || null;
    } catch (error) {
      console.error('Error getting contact list by ID:', error);
      return null;
    }
  },
  
  /**
   * Get contact lists containing a specific contact
   */
  getByContactId: async (contactId: string): Promise<ContactList[]> => {
    try {
      const lists = await ContactListRepository.getAll();
      return lists.filter(list => list.contacts.includes(contactId));
    } catch (error) {
      console.error('Error getting lists by contact ID:', error);
      return [];
    }
  },
  
  /**
   * Save a contact list
   */
  save: async (list: ContactList): Promise<ContactList> => {
    try {
      const lists = await ContactListRepository.getAll();
      const index = lists.findIndex(l => l.id === list.id);
      
      if (index >= 0) {
        // Update existing list
        lists[index] = {
          ...list,
          updatedAt: new Date()
        };
      } else {
        // Add new list
        lists.push({
          ...list,
          id: list.id || `list-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
      return list;
    } catch (error) {
      console.error('Error saving contact list:', error);
      throw error;
    }
  },
  
  /**
   * Delete a contact list
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const lists = await ContactListRepository.getAll();
      const filteredLists = lists.filter(list => list.id !== id);
      
      if (filteredLists.length === lists.length) {
        return false; // No list was removed
      }
      
      localStorage.setItem(LISTS_KEY, JSON.stringify(filteredLists));
      return true;
    } catch (error) {
      console.error('Error deleting contact list:', error);
      return false;
    }
  },
  
  /**
   * Add contacts to a list
   */
  addContacts: async (listId: string, contactIds: string[]): Promise<ContactList | null> => {
    try {
      const list = await ContactListRepository.getById(listId);
      if (!list) return null;
      
      // Add contacts to the list (avoiding duplicates)
      const updatedContacts = [...new Set([...list.contacts, ...contactIds])];
      
      const updatedList: ContactList = {
        ...list,
        contacts: updatedContacts,
        updatedAt: new Date()
      };
      
      await ContactListRepository.save(updatedList);
      return updatedList;
    } catch (error) {
      console.error('Error adding contacts to list:', error);
      return null;
    }
  },
  
  /**
   * Remove contacts from a list
   */
  removeContacts: async (listId: string, contactIds: string[]): Promise<ContactList | null> => {
    try {
      const list = await ContactListRepository.getById(listId);
      if (!list) return null;
      
      // Remove contacts from the list
      const updatedContacts = list.contacts.filter(id => !contactIds.includes(id));
      
      const updatedList: ContactList = {
        ...list,
        contacts: updatedContacts,
        updatedAt: new Date()
      };
      
      await ContactListRepository.save(updatedList);
      return updatedList;
    } catch (error) {
      console.error('Error removing contacts from list:', error);
      return null;
    }
  }
};

/**
 * Email Template Repository
 */
export const EmailTemplateRepository = {
  /**
   * Get all email templates
   */
  getAll: async (): Promise<EmailTemplate[]> => {
    try {
      const data = localStorage.getItem(TEMPLATES_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockTemplates = getMockEmailTemplates();
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(mockTemplates));
        return mockTemplates;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting email templates:', error);
      return [];
    }
  },
  
  /**
   * Get an email template by ID
   */
  getById: async (id: string): Promise<EmailTemplate | null> => {
    try {
      const templates = await EmailTemplateRepository.getAll();
      return templates.find(template => template.id === id) || null;
    } catch (error) {
      console.error('Error getting email template by ID:', error);
      return null;
    }
  },
  
  /**
   * Get email templates by category
   */
  getByCategory: async (category: EmailTemplate['category']): Promise<EmailTemplate[]> => {
    try {
      const templates = await EmailTemplateRepository.getAll();
      return templates.filter(template => template.category === category);
    } catch (error) {
      console.error('Error getting templates by category:', error);
      return [];
    }
  },
  
  /**
   * Save an email template
   */
  save: async (template: EmailTemplate): Promise<EmailTemplate> => {
    try {
      const templates = await EmailTemplateRepository.getAll();
      const index = templates.findIndex(t => t.id === template.id);
      
      if (index >= 0) {
        // Update existing template
        templates[index] = {
          ...template,
          updatedAt: new Date()
        };
      } else {
        // Add new template
        templates.push({
          ...template,
          id: template.id || `template-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
      return template;
    } catch (error) {
      console.error('Error saving email template:', error);
      throw error;
    }
  },
  
  /**
   * Delete an email template
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const templates = await EmailTemplateRepository.getAll();
      const filteredTemplates = templates.filter(template => template.id !== id);
      
      if (filteredTemplates.length === templates.length) {
        return false; // No template was removed
      }
      
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filteredTemplates));
      return true;
    } catch (error) {
      console.error('Error deleting email template:', error);
      return false;
    }
  }
};

/**
 * Email Campaign Repository
 */
export const EmailCampaignRepository = {
  /**
   * Get all email campaigns
   */
  getAll: async (): Promise<EmailCampaign[]> => {
    try {
      const data = localStorage.getItem(CAMPAIGNS_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockCampaigns = getMockEmailCampaigns();
        localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(mockCampaigns));
        return mockCampaigns;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting email campaigns:', error);
      return [];
    }
  },
  
  /**
   * Get an email campaign by ID
   */
  getById: async (id: string): Promise<EmailCampaign | null> => {
    try {
      const campaigns = await EmailCampaignRepository.getAll();
      return campaigns.find(campaign => campaign.id === id) || null;
    } catch (error) {
      console.error('Error getting email campaign by ID:', error);
      return null;
    }
  },
  
  /**
   * Get email campaigns by status
   */
  getByStatus: async (status: EmailCampaign['status']): Promise<EmailCampaign[]> => {
    try {
      const campaigns = await EmailCampaignRepository.getAll();
      return campaigns.filter(campaign => campaign.status === status);
    } catch (error) {
      console.error('Error getting campaigns by status:', error);
      return [];
    }
  },
  
  /**
   * Get email campaigns by list ID
   */
  getByListId: async (listId: string): Promise<EmailCampaign[]> => {
    try {
      const campaigns = await EmailCampaignRepository.getAll();
      return campaigns.filter(campaign => campaign.listIds.includes(listId));
    } catch (error) {
      console.error('Error getting campaigns by list ID:', error);
      return [];
    }
  },
  
  /**
   * Save an email campaign
   */
  save: async (campaign: EmailCampaign): Promise<EmailCampaign> => {
    try {
      const campaigns = await EmailCampaignRepository.getAll();
      const index = campaigns.findIndex(c => c.id === campaign.id);
      
      if (index >= 0) {
        // Update existing campaign
        campaigns[index] = {
          ...campaign,
          updatedAt: new Date()
        };
      } else {
        // Add new campaign
        campaigns.push({
          ...campaign,
          id: campaign.id || `campaign-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
      return campaign;
    } catch (error) {
      console.error('Error saving email campaign:', error);
      throw error;
    }
  },
  
  /**
   * Delete an email campaign
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const campaigns = await EmailCampaignRepository.getAll();
      const filteredCampaigns = campaigns.filter(campaign => campaign.id !== id);
      
      if (filteredCampaigns.length === campaigns.length) {
        return false; // No campaign was removed
      }
      
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(filteredCampaigns));
      return true;
    } catch (error) {
      console.error('Error deleting email campaign:', error);
      return false;
    }
  }
};

/**
 * Email Event Repository
 */
export const EmailEventRepository = {
  /**
   * Get all email events
   */
  getAll: async (): Promise<EmailEvent[]> => {
    try {
      const data = localStorage.getItem(EVENTS_KEY);
      if (!data) {
        // Initialize with mock data if empty
        const mockEvents = getMockEmailEvents();
        localStorage.setItem(EVENTS_KEY, JSON.stringify(mockEvents));
        return mockEvents;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting email events:', error);
      return [];
    }
  },
  
  /**
   * Get email events by campaign ID
   */
  getByCampaignId: async (campaignId: string): Promise<EmailEvent[]> => {
    try {
      const events = await EmailEventRepository.getAll();
      return events.filter(event => event.campaignId === campaignId);
    } catch (error) {
      console.error('Error getting events by campaign ID:', error);
      return [];
    }
  },
  
  /**
   * Get email events by contact ID
   */
  getByContactId: async (contactId: string): Promise<EmailEvent[]> => {
    try {
      const events = await EmailEventRepository.getAll();
      return events.filter(event => event.contactId === contactId);
    } catch (error) {
      console.error('Error getting events by contact ID:', error);
      return [];
    }
  },
  
  /**
   * Get email events by type
   */
  getByType: async (type: EmailEvent['type']): Promise<EmailEvent[]> => {
    try {
      const events = await EmailEventRepository.getAll();
      return events.filter(event => event.type === type);
    } catch (error) {
      console.error('Error getting events by type:', error);
      return [];
    }
  },
  
  /**
   * Save an email event
   */
  save: async (event: EmailEvent): Promise<EmailEvent> => {
    try {
      const events = await EmailEventRepository.getAll();
      const index = events.findIndex(e => e.id === event.id);
      
      if (index >= 0) {
        // Update existing event
        events[index] = event;
      } else {
        // Add new event
        events.push({
          ...event,
          id: event.id || `event-${Date.now()}`
        });
      }
      
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      return event;
    } catch (error) {
      console.error('Error saving email event:', error);
      throw error;
    }
  },
  
  /**
   * Bulk save email events
   */
  bulkSave: async (newEvents: EmailEvent[]): Promise<number> => {
    try {
      const events = await EmailEventRepository.getAll();
      let savedCount = 0;
      
      newEvents.forEach(newEvent => {
        const index = events.findIndex(e => e.id === newEvent.id);
        
        if (index >= 0) {
          // Update existing event
          events[index] = newEvent;
        } else {
          // Add new event
          events.push({
            ...newEvent,
            id: newEvent.id || `event-${Date.now()}-${savedCount}`
          });
        }
        
        savedCount++;
      });
      
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      return savedCount;
    } catch (error) {
      console.error('Error bulk saving email events:', error);
      throw error;
    }
  }
};
