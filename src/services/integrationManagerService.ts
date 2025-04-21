/**
 * Integration Manager Service
 * 
 * This service coordinates all integrations for the AI Customer Service Assistant.
 * It provides a unified interface for managing calendar, CRM, and email marketing integrations.
 */

import * as calendarService from './calendarIntegrationService';
import * as crmService from './crmIntegrationService';
import * as emailService from './emailMarketingService';

// Define integration types
export interface Integration {
  id: string;
  businessId: string;
  type: 'calendar' | 'crm' | 'email';
  providerId: string;
  providerName: string;
  providerType: string;
  status: 'active' | 'inactive' | 'error';
  config?: Record<string, any>;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for development
const mockIntegrations: Integration[] = [];

/**
 * Get all integrations for a business
 */
export async function getIntegrations(businessId: string): Promise<Integration[]> {
  try {
    // Filter integrations by business ID
    return mockIntegrations.filter(integration => integration.businessId === businessId);
  } catch (error) {
    console.error('Error getting integrations:', error);
    return [];
  }
}

/**
 * Get integration by ID
 */
export async function getIntegrationById(
  businessId: string,
  integrationId: string
): Promise<Integration | null> {
  try {
    // Find the integration
    const integration = mockIntegrations.find(
      integration => integration.id === integrationId && integration.businessId === businessId
    );
    
    return integration || null;
  } catch (error) {
    console.error('Error getting integration:', error);
    return null;
  }
}

/**
 * Connect calendar integration
 */
export async function connectCalendarIntegration(
  businessId: string,
  providerType: 'google' | 'microsoft' | 'mock',
  authCode?: string
): Promise<Integration | null> {
  try {
    // Connect to the calendar provider
    const provider = await calendarService.connectCalendarProvider(
      businessId,
      providerType,
      authCode
    );
    
    if (!provider) {
      throw new Error('Failed to connect calendar provider');
    }
    
    // Create the integration
    const now = new Date();
    const integration: Integration = {
      id: `calendar-${provider.id}`,
      businessId,
      type: 'calendar',
      providerId: provider.id,
      providerName: provider.name,
      providerType: provider.type,
      status: 'active',
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now
    };
    
    // Store the integration
    mockIntegrations.push(integration);
    
    return integration;
  } catch (error) {
    console.error('Error connecting calendar integration:', error);
    return null;
  }
}

/**
 * Connect CRM integration
 */
export async function connectCRMIntegration(
  businessId: string,
  providerType: 'hubspot' | 'salesforce' | 'zoho' | 'mock',
  authCode?: string
): Promise<Integration | null> {
  try {
    // Connect to the CRM provider
    const provider = await crmService.connectCRMProvider(
      businessId,
      providerType,
      authCode
    );
    
    if (!provider) {
      throw new Error('Failed to connect CRM provider');
    }
    
    // Create the integration
    const now = new Date();
    const integration: Integration = {
      id: `crm-${provider.id}`,
      businessId,
      type: 'crm',
      providerId: provider.id,
      providerName: provider.name,
      providerType: provider.type,
      status: 'active',
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now
    };
    
    // Store the integration
    mockIntegrations.push(integration);
    
    return integration;
  } catch (error) {
    console.error('Error connecting CRM integration:', error);
    return null;
  }
}

/**
 * Connect email marketing integration
 */
export async function connectEmailIntegration(
  businessId: string,
  providerType: 'mailchimp' | 'sendgrid' | 'convertkit' | 'mock',
  apiKey?: string
): Promise<Integration | null> {
  try {
    // Connect to the email provider
    const provider = await emailService.connectEmailProvider(
      businessId,
      providerType,
      apiKey
    );
    
    if (!provider) {
      throw new Error('Failed to connect email provider');
    }
    
    // Create the integration
    const now = new Date();
    const integration: Integration = {
      id: `email-${provider.id}`,
      businessId,
      type: 'email',
      providerId: provider.id,
      providerName: provider.name,
      providerType: provider.type,
      status: 'active',
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now
    };
    
    // Store the integration
    mockIntegrations.push(integration);
    
    return integration;
  } catch (error) {
    console.error('Error connecting email integration:', error);
    return null;
  }
}

/**
 * Disconnect integration
 */
export async function disconnectIntegration(
  businessId: string,
  integrationId: string
): Promise<boolean> {
  try {
    // Find the integration
    const integration = await getIntegrationById(businessId, integrationId);
    
    if (!integration) {
      throw new Error('Integration not found');
    }
    
    // Disconnect from the provider
    let success = false;
    
    switch (integration.type) {
      case 'calendar':
        success = await calendarService.disconnectCalendarProvider(
          businessId,
          integration.providerId
        );
        break;
      case 'crm':
        success = await crmService.disconnectCRMProvider(
          businessId,
          integration.providerId
        );
        break;
      case 'email':
        success = await emailService.disconnectEmailProvider(
          businessId,
          integration.providerId
        );
        break;
    }
    
    if (!success) {
      throw new Error('Failed to disconnect provider');
    }
    
    // Remove the integration
    const index = mockIntegrations.findIndex(i => i.id === integrationId);
    if (index !== -1) {
      mockIntegrations.splice(index, 1);
    }
    
    return true;
  } catch (error) {
    console.error('Error disconnecting integration:', error);
    return false;
  }
}

/**
 * Process conversation for integrations
 * 
 * This function processes a conversation and updates all connected integrations.
 * It captures leads, creates customer records, and schedules appointments.
 */
export async function processConversationForIntegrations(
  businessId: string,
  conversationId: string,
  conversationData: {
    customerInfo?: {
      email: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    };
    appointmentInfo?: {
      serviceId?: string;
      serviceName?: string;
      startTime: Date;
      endTime: Date;
      notes?: string;
    };
    leadCapture?: boolean;
  }
): Promise<{
  crmCustomer?: any;
  emailContact?: any;
  appointment?: any;
}> {
  try {
    const result: {
      crmCustomer?: any;
      emailContact?: any;
      appointment?: any;
    } = {};
    
    // Get all integrations for the business
    const integrations = await getIntegrations(businessId);
    
    // Process CRM integration
    if (conversationData.customerInfo) {
      const crmIntegration = integrations.find(
        integration => integration.type === 'crm' && integration.status === 'active'
      );
      
      if (crmIntegration) {
        // Sync customer to CRM
        const customer = await crmService.syncCustomerFromConversation(
          businessId,
          crmIntegration.providerId,
          conversationId,
          conversationData.customerInfo
        );
        
        if (customer) {
          result.crmCustomer = customer;
        }
      }
    }
    
    // Process email marketing integration
    if (conversationData.customerInfo && conversationData.leadCapture) {
      const emailIntegration = integrations.find(
        integration => integration.type === 'email' && integration.status === 'active'
      );
      
      if (emailIntegration) {
        // Capture lead
        const contact = await emailService.captureLeadFromConversation(
          businessId,
          conversationId,
          conversationData.customerInfo
        );
        
        if (contact) {
          result.emailContact = contact;
        }
      }
    }
    
    // Process calendar integration
    if (conversationData.customerInfo && conversationData.appointmentInfo) {
      const calendarIntegration = integrations.find(
        integration => integration.type === 'calendar' && integration.status === 'active'
      );
      
      if (calendarIntegration) {
        // Create appointment
        const appointment = await calendarService.createAppointment(
          businessId,
          calendarIntegration.providerId,
          {
            businessId,
            serviceId: conversationData.appointmentInfo.serviceId,
            serviceName: conversationData.appointmentInfo.serviceName,
            customerName: `${conversationData.customerInfo.firstName || ''} ${conversationData.customerInfo.lastName || ''}`.trim(),
            customerEmail: conversationData.customerInfo.email,
            customerPhone: conversationData.customerInfo.phone,
            startTime: conversationData.appointmentInfo.startTime,
            endTime: conversationData.appointmentInfo.endTime,
            status: 'confirmed',
            notes: conversationData.appointmentInfo.notes,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        );
        
        if (appointment) {
          result.appointment = appointment;
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error processing conversation for integrations:', error);
    return {};
  }
}

/**
 * Get available time slots for appointments
 */
export async function getAvailableAppointmentSlots(
  businessId: string,
  startDate: Date,
  endDate: Date,
  duration: number = 60
): Promise<calendarService.AvailableTimeSlot[]> {
  try {
    // Get calendar integration
    const calendarIntegration = mockIntegrations.find(
      integration => integration.type === 'calendar' && 
                    integration.status === 'active' && 
                    integration.businessId === businessId
    );
    
    if (!calendarIntegration) {
      throw new Error('No active calendar integration found');
    }
    
    // Get available time slots
    return await calendarService.getAvailableTimeSlots(
      businessId,
      calendarIntegration.providerId,
      startDate,
      endDate,
      duration
    );
  } catch (error) {
    console.error('Error getting available appointment slots:', error);
    return [];
  }
}

/**
 * Schedule appointment from conversation
 */
export async function scheduleAppointmentFromConversation(
  businessId: string,
  conversationId: string,
  appointmentData: {
    customerInfo: {
      email: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    };
    serviceId?: string;
    serviceName?: string;
    startTime: Date;
    endTime: Date;
    notes?: string;
  }
): Promise<calendarService.Appointment | null> {
  try {
    // Process the conversation for integrations
    const result = await processConversationForIntegrations(
      businessId,
      conversationId,
      {
        customerInfo: appointmentData.customerInfo,
        appointmentInfo: {
          serviceId: appointmentData.serviceId,
          serviceName: appointmentData.serviceName,
          startTime: appointmentData.startTime,
          endTime: appointmentData.endTime,
          notes: appointmentData.notes
        }
      }
    );
    
    return result.appointment || null;
  } catch (error) {
    console.error('Error scheduling appointment from conversation:', error);
    return null;
  }
}

/**
 * Capture lead from conversation
 */
export async function captureLeadFromConversation(
  businessId: string,
  conversationId: string,
  leadData: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }
): Promise<{
  crmCustomer?: any;
  emailContact?: any;
}> {
  try {
    // Process the conversation for integrations
    const result = await processConversationForIntegrations(
      businessId,
      conversationId,
      {
        customerInfo: leadData,
        leadCapture: true
      }
    );
    
    return {
      crmCustomer: result.crmCustomer,
      emailContact: result.emailContact
    };
  } catch (error) {
    console.error('Error capturing lead from conversation:', error);
    return {};
  }
}
