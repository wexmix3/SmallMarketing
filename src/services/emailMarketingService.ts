/**
 * Email Marketing Integration Service
 * 
 * This service provides integration with email marketing platforms for lead capture and campaigns.
 * It supports common email marketing platforms and a mock implementation for development.
 */

import { v4 as uuidv4 } from 'uuid';

// Define email marketing types
export interface EmailContact {
  id: string;
  businessId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  source?: string;
  subscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailList {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  contactCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  businessId: string;
  listId: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  scheduledAt?: Date;
  sentAt?: Date;
  openRate?: number;
  clickRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailProvider {
  name: string;
  id: string;
  type: 'mailchimp' | 'sendgrid' | 'convertkit' | 'mock';
  connected: boolean;
}

// Mock data for development
const mockContacts: EmailContact[] = [];
const mockLists: EmailList[] = [];
const mockCampaigns: EmailCampaign[] = [];
const mockProviders: Record<string, EmailProvider> = {
  'mock-provider': {
    name: 'Mock Email Provider',
    id: 'mock-provider',
    type: 'mock',
    connected: true
  }
};

/**
 * Get available email marketing providers for a business
 */
export async function getEmailProviders(businessId: string): Promise<EmailProvider[]> {
  try {
    // In a real implementation, this would fetch from the database
    // For now, return mock data
    return Object.values(mockProviders);
  } catch (error) {
    console.error('Error getting email providers:', error);
    return [];
  }
}

/**
 * Connect to an email marketing provider
 */
export async function connectEmailProvider(
  businessId: string,
  providerType: 'mailchimp' | 'sendgrid' | 'convertkit' | 'mock',
  apiKey?: string
): Promise<EmailProvider | null> {
  try {
    // In a real implementation, this would validate the API key
    // For now, create a mock provider
    const providerId = `${providerType}-${uuidv4()}`;
    
    const provider: EmailProvider = {
      name: providerType === 'mailchimp' ? 'Mailchimp' : 
            providerType === 'sendgrid' ? 'SendGrid' : 
            providerType === 'convertkit' ? 'ConvertKit' : 'Mock Email Provider',
      id: providerId,
      type: providerType,
      connected: true
    };
    
    // Store the provider
    mockProviders[providerId] = provider;
    
    // Create a default list
    await createEmailList(businessId, {
      name: 'Default List',
      description: 'Default list for new contacts'
    });
    
    return provider;
  } catch (error) {
    console.error('Error connecting email provider:', error);
    return null;
  }
}

/**
 * Disconnect from an email marketing provider
 */
export async function disconnectEmailProvider(
  businessId: string,
  providerId: string
): Promise<boolean> {
  try {
    // In a real implementation, this would revoke API keys
    // For now, just remove the mock provider
    if (mockProviders[providerId]) {
      delete mockProviders[providerId];
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error disconnecting email provider:', error);
    return false;
  }
}

/**
 * Create an email list
 */
export async function createEmailList(
  businessId: string,
  list: {
    name: string;
    description?: string;
  }
): Promise<EmailList | null> {
  try {
    // Create the list
    const now = new Date();
    const newList: EmailList = {
      id: uuidv4(),
      businessId,
      name: list.name,
      description: list.description,
      contactCount: 0,
      createdAt: now,
      updatedAt: now
    };
    
    // Store the list
    mockLists.push(newList);
    
    return newList;
  } catch (error) {
    console.error('Error creating email list:', error);
    return null;
  }
}

/**
 * Get email lists for a business
 */
export async function getEmailLists(businessId: string): Promise<EmailList[]> {
  try {
    // Filter lists by business ID
    return mockLists.filter(list => list.businessId === businessId);
  } catch (error) {
    console.error('Error getting email lists:', error);
    return [];
  }
}

/**
 * Add a contact to an email list
 */
export async function addContactToList(
  businessId: string,
  listId: string,
  contact: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tags?: string[];
    source?: string;
  }
): Promise<EmailContact | null> {
  try {
    // Check if list exists
    const list = mockLists.find(
      list => list.id === listId && list.businessId === businessId
    );
    
    if (!list) {
      throw new Error('Email list not found');
    }
    
    // Check if contact already exists
    let existingContact = mockContacts.find(
      c => c.businessId === businessId && c.email === contact.email
    );
    
    if (existingContact) {
      // Update existing contact
      const index = mockContacts.indexOf(existingContact);
      
      existingContact = {
        ...existingContact,
        ...contact,
        updatedAt: new Date()
      };
      
      mockContacts[index] = existingContact;
      
      return existingContact;
    }
    
    // Create new contact
    const now = new Date();
    const newContact: EmailContact = {
      id: uuidv4(),
      businessId,
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      tags: contact.tags || [],
      source: contact.source || 'manual',
      subscribed: true,
      createdAt: now,
      updatedAt: now
    };
    
    // Store the contact
    mockContacts.push(newContact);
    
    // Update list contact count
    const listIndex = mockLists.indexOf(list);
    mockLists[listIndex] = {
      ...list,
      contactCount: list.contactCount + 1,
      updatedAt: now
    };
    
    return newContact;
  } catch (error) {
    console.error('Error adding contact to list:', error);
    return null;
  }
}

/**
 * Get contacts for a business
 */
export async function getContacts(
  businessId: string,
  listId?: string
): Promise<EmailContact[]> {
  try {
    // Filter contacts by business ID
    let filteredContacts = mockContacts.filter(
      contact => contact.businessId === businessId
    );
    
    // Filter by list ID if provided
    if (listId) {
      // In a real implementation, this would filter by list membership
      // For now, we'll just return all contacts
    }
    
    return filteredContacts;
  } catch (error) {
    console.error('Error getting contacts:', error);
    return [];
  }
}

/**
 * Create an email campaign
 */
export async function createEmailCampaign(
  businessId: string,
  campaign: {
    listId: string;
    name: string;
    subject: string;
    content: string;
    scheduledAt?: Date;
  }
): Promise<EmailCampaign | null> {
  try {
    // Check if list exists
    const list = mockLists.find(
      list => list.id === campaign.listId && list.businessId === businessId
    );
    
    if (!list) {
      throw new Error('Email list not found');
    }
    
    // Create the campaign
    const now = new Date();
    const newCampaign: EmailCampaign = {
      id: uuidv4(),
      businessId,
      listId: campaign.listId,
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      status: campaign.scheduledAt ? 'scheduled' : 'draft',
      scheduledAt: campaign.scheduledAt,
      createdAt: now,
      updatedAt: now
    };
    
    // Store the campaign
    mockCampaigns.push(newCampaign);
    
    return newCampaign;
  } catch (error) {
    console.error('Error creating email campaign:', error);
    return null;
  }
}

/**
 * Get email campaigns for a business
 */
export async function getEmailCampaigns(businessId: string): Promise<EmailCampaign[]> {
  try {
    // Filter campaigns by business ID
    return mockCampaigns.filter(campaign => campaign.businessId === businessId);
  } catch (error) {
    console.error('Error getting email campaigns:', error);
    return [];
  }
}

/**
 * Send an email campaign
 */
export async function sendEmailCampaign(
  businessId: string,
  campaignId: string
): Promise<boolean> {
  try {
    // Find the campaign
    const index = mockCampaigns.findIndex(
      campaign => campaign.id === campaignId && campaign.businessId === businessId
    );
    
    if (index === -1) {
      throw new Error('Email campaign not found');
    }
    
    // Check if campaign is in draft or scheduled status
    if (mockCampaigns[index].status !== 'draft' && mockCampaigns[index].status !== 'scheduled') {
      throw new Error('Campaign cannot be sent');
    }
    
    // Update campaign status
    const now = new Date();
    mockCampaigns[index] = {
      ...mockCampaigns[index],
      status: 'sent',
      sentAt: now,
      updatedAt: now,
      openRate: Math.random() * 0.5, // Mock open rate (0-50%)
      clickRate: Math.random() * 0.2  // Mock click rate (0-20%)
    };
    
    return true;
  } catch (error) {
    console.error('Error sending email campaign:', error);
    return false;
  }
}

/**
 * Cancel an email campaign
 */
export async function cancelEmailCampaign(
  businessId: string,
  campaignId: string
): Promise<boolean> {
  try {
    // Find the campaign
    const index = mockCampaigns.findIndex(
      campaign => campaign.id === campaignId && campaign.businessId === businessId
    );
    
    if (index === -1) {
      throw new Error('Email campaign not found');
    }
    
    // Check if campaign is in draft or scheduled status
    if (mockCampaigns[index].status !== 'draft' && mockCampaigns[index].status !== 'scheduled') {
      throw new Error('Campaign cannot be cancelled');
    }
    
    // Update campaign status
    mockCampaigns[index] = {
      ...mockCampaigns[index],
      status: 'cancelled',
      updatedAt: new Date()
    };
    
    return true;
  } catch (error) {
    console.error('Error cancelling email campaign:', error);
    return false;
  }
}

/**
 * Capture lead from chatbot conversation
 */
export async function captureLeadFromConversation(
  businessId: string,
  conversationId: string,
  contactInfo: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }
): Promise<EmailContact | null> {
  try {
    // Get default list
    const lists = await getEmailLists(businessId);
    if (lists.length === 0) {
      throw new Error('No email lists found');
    }
    
    const defaultList = lists[0];
    
    // Add contact to list
    const contact = await addContactToList(businessId, defaultList.id, {
      ...contactInfo,
      source: 'chatbot',
      tags: ['chatbot-lead']
    });
    
    return contact;
  } catch (error) {
    console.error('Error capturing lead from conversation:', error);
    return null;
  }
}

/**
 * Format contact name
 */
export function formatContactName(contact: EmailContact): string {
  if (contact.firstName && contact.lastName) {
    return `${contact.firstName} ${contact.lastName}`;
  } else if (contact.firstName) {
    return contact.firstName;
  } else if (contact.lastName) {
    return contact.lastName;
  } else {
    return contact.email;
  }
}
