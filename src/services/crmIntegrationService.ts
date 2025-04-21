/**
 * CRM Integration Service
 * 
 * This service provides integration with CRM systems for customer data management.
 * It supports common CRM platforms and a mock implementation for development.
 */

import { v4 as uuidv4 } from 'uuid';

// Define CRM types
export interface Customer {
  id: string;
  businessId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  tags?: string[];
  notes?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  businessId: string;
  type: 'conversation' | 'appointment' | 'purchase' | 'email' | 'note';
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface CRMProvider {
  name: string;
  id: string;
  type: 'hubspot' | 'salesforce' | 'zoho' | 'mock';
  connected: boolean;
}

// Mock data for development
const mockCustomers: Customer[] = [];
const mockActivities: CustomerActivity[] = [];
const mockProviders: Record<string, CRMProvider> = {
  'mock-provider': {
    name: 'Mock CRM',
    id: 'mock-provider',
    type: 'mock',
    connected: true
  }
};

/**
 * Get available CRM providers for a business
 */
export async function getCRMProviders(businessId: string): Promise<CRMProvider[]> {
  try {
    // In a real implementation, this would fetch from the database
    // For now, return mock data
    return Object.values(mockProviders);
  } catch (error) {
    console.error('Error getting CRM providers:', error);
    return [];
  }
}

/**
 * Connect to a CRM provider
 */
export async function connectCRMProvider(
  businessId: string,
  providerType: 'hubspot' | 'salesforce' | 'zoho' | 'mock',
  authCode?: string
): Promise<CRMProvider | null> {
  try {
    // In a real implementation, this would use OAuth to connect to the provider
    // For now, create a mock provider
    const providerId = `${providerType}-${uuidv4()}`;
    
    const provider: CRMProvider = {
      name: providerType === 'hubspot' ? 'HubSpot' : 
            providerType === 'salesforce' ? 'Salesforce' : 
            providerType === 'zoho' ? 'Zoho CRM' : 'Mock CRM',
      id: providerId,
      type: providerType,
      connected: true
    };
    
    // Store the provider
    mockProviders[providerId] = provider;
    
    return provider;
  } catch (error) {
    console.error('Error connecting CRM provider:', error);
    return null;
  }
}

/**
 * Disconnect from a CRM provider
 */
export async function disconnectCRMProvider(
  businessId: string,
  providerId: string
): Promise<boolean> {
  try {
    // In a real implementation, this would revoke access tokens
    // For now, just remove the mock provider
    if (mockProviders[providerId]) {
      delete mockProviders[providerId];
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error disconnecting CRM provider:', error);
    return false;
  }
}

/**
 * Create a customer
 */
export async function createCustomer(
  businessId: string,
  providerId: string,
  customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Customer | null> {
  try {
    // Check if provider exists
    if (!mockProviders[providerId]) {
      throw new Error('CRM provider not found');
    }
    
    // Check if customer already exists
    const existingCustomer = mockCustomers.find(
      c => c.businessId === businessId && c.email === customer.email
    );
    
    if (existingCustomer) {
      return existingCustomer;
    }
    
    // Create the customer
    const now = new Date();
    const newCustomer: Customer = {
      ...customer,
      id: uuidv4(),
      businessId,
      createdAt: now,
      updatedAt: now
    };
    
    // Store the customer
    mockCustomers.push(newCustomer);
    
    return newCustomer;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

/**
 * Update a customer
 */
export async function updateCustomer(
  businessId: string,
  customerId: string,
  updates: Partial<Customer>
): Promise<Customer | null> {
  try {
    // Find the customer
    const index = mockCustomers.findIndex(
      customer => customer.id === customerId && customer.businessId === businessId
    );
    
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    // Update the customer
    const updatedCustomer: Customer = {
      ...mockCustomers[index],
      ...updates,
      updatedAt: new Date()
    };
    
    mockCustomers[index] = updatedCustomer;
    
    return updatedCustomer;
  } catch (error) {
    console.error('Error updating customer:', error);
    return null;
  }
}

/**
 * Get a customer by ID
 */
export async function getCustomerById(
  businessId: string,
  customerId: string
): Promise<Customer | null> {
  try {
    // Find the customer
    const customer = mockCustomers.find(
      customer => customer.id === customerId && customer.businessId === businessId
    );
    
    return customer || null;
  } catch (error) {
    console.error('Error getting customer:', error);
    return null;
  }
}

/**
 * Get a customer by email
 */
export async function getCustomerByEmail(
  businessId: string,
  email: string
): Promise<Customer | null> {
  try {
    // Find the customer
    const customer = mockCustomers.find(
      customer => customer.businessId === businessId && customer.email === email
    );
    
    return customer || null;
  } catch (error) {
    console.error('Error getting customer by email:', error);
    return null;
  }
}

/**
 * Search for customers
 */
export async function searchCustomers(
  businessId: string,
  query: string,
  limit: number = 10
): Promise<Customer[]> {
  try {
    // Filter customers by business ID
    let filteredCustomers = mockCustomers.filter(
      customer => customer.businessId === businessId
    );
    
    // Search by name or email
    if (query) {
      const normalizedQuery = query.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.email.toLowerCase().includes(normalizedQuery) ||
        customer.firstName.toLowerCase().includes(normalizedQuery) ||
        customer.lastName.toLowerCase().includes(normalizedQuery) ||
        (customer.phone && customer.phone.includes(query))
      );
    }
    
    // Limit results
    return filteredCustomers.slice(0, limit);
  } catch (error) {
    console.error('Error searching customers:', error);
    return [];
  }
}

/**
 * Add customer activity
 */
export async function addCustomerActivity(
  businessId: string,
  customerId: string,
  activity: Omit<CustomerActivity, 'id' | 'businessId' | 'createdAt'>
): Promise<CustomerActivity | null> {
  try {
    // Check if customer exists
    const customer = await getCustomerById(businessId, customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    // Create the activity
    const newActivity: CustomerActivity = {
      ...activity,
      id: uuidv4(),
      businessId,
      customerId,
      createdAt: new Date()
    };
    
    // Store the activity
    mockActivities.push(newActivity);
    
    // Update customer's last contacted date
    await updateCustomer(businessId, customerId, {
      lastContactedAt: new Date()
    });
    
    return newActivity;
  } catch (error) {
    console.error('Error adding customer activity:', error);
    return null;
  }
}

/**
 * Get customer activities
 */
export async function getCustomerActivities(
  businessId: string,
  customerId: string,
  limit: number = 10
): Promise<CustomerActivity[]> {
  try {
    // Filter activities by business ID and customer ID
    const filteredActivities = mockActivities.filter(
      activity => activity.businessId === businessId && activity.customerId === customerId
    );
    
    // Sort by creation date (newest first)
    filteredActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Limit results
    return filteredActivities.slice(0, limit);
  } catch (error) {
    console.error('Error getting customer activities:', error);
    return [];
  }
}

/**
 * Create or update customer from conversation
 */
export async function syncCustomerFromConversation(
  businessId: string,
  providerId: string,
  conversationId: string,
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }
): Promise<Customer | null> {
  try {
    // Check if customer exists
    let customer = await getCustomerByEmail(businessId, customerInfo.email);
    
    if (customer) {
      // Update existing customer
      customer = await updateCustomer(businessId, customer.id, {
        ...customerInfo,
        lastContactedAt: new Date()
      });
    } else {
      // Create new customer
      customer = await createCustomer(businessId, providerId, {
        ...customerInfo,
        businessId,
        source: 'chatbot',
        lastContactedAt: new Date()
      });
    }
    
    if (customer) {
      // Add conversation activity
      await addCustomerActivity(businessId, customer.id, {
        customerId: customer.id,
        type: 'conversation',
        description: `Chatbot conversation ${conversationId}`,
        metadata: { conversationId }
      });
    }
    
    return customer;
  } catch (error) {
    console.error('Error syncing customer from conversation:', error);
    return null;
  }
}

/**
 * Format customer name
 */
export function formatCustomerName(customer: Customer): string {
  return `${customer.firstName} ${customer.lastName}`;
}
