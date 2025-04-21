/**
 * Integration Manager Service Tests
 * 
 * This file contains tests for the integration manager service.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getIntegrations,
  connectCalendarIntegration,
  connectCRMIntegration,
  connectEmailIntegration,
  disconnectIntegration,
  processConversationForIntegrations
} from '@/services/integrationManagerService';

// Mock the dependencies
vi.mock('@/services/calendarIntegrationService', () => ({
  connectCalendarProvider: vi.fn().mockResolvedValue({
    id: 'mock-calendar-provider',
    name: 'Mock Calendar',
    type: 'google',
    connected: true
  }),
  disconnectCalendarProvider: vi.fn().mockResolvedValue(true),
  createAppointment: vi.fn().mockResolvedValue({
    id: 'mock-appointment-id',
    businessId: 'mock-business-id',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    startTime: new Date('2025-01-01T10:00:00Z'),
    endTime: new Date('2025-01-01T11:00:00Z'),
    status: 'confirmed'
  }),
  getAvailableTimeSlots: vi.fn().mockResolvedValue([
    {
      startTime: new Date('2025-01-01T10:00:00Z'),
      endTime: new Date('2025-01-01T11:00:00Z'),
      available: true
    }
  ])
}));

vi.mock('@/services/crmIntegrationService', () => ({
  connectCRMProvider: vi.fn().mockResolvedValue({
    id: 'mock-crm-provider',
    name: 'Mock CRM',
    type: 'hubspot',
    connected: true
  }),
  disconnectCRMProvider: vi.fn().mockResolvedValue(true),
  syncCustomerFromConversation: vi.fn().mockResolvedValue({
    id: 'mock-customer-id',
    businessId: 'mock-business-id',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe'
  })
}));

vi.mock('@/services/emailMarketingService', () => ({
  connectEmailProvider: vi.fn().mockResolvedValue({
    id: 'mock-email-provider',
    name: 'Mock Email Provider',
    type: 'mailchimp',
    connected: true
  }),
  disconnectEmailProvider: vi.fn().mockResolvedValue(true),
  captureLeadFromConversation: vi.fn().mockResolvedValue({
    id: 'mock-contact-id',
    businessId: 'mock-business-id',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    subscribed: true
  })
}));

describe('Integration Manager Service', () => {
  const businessId = 'mock-business-id';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getIntegrations', () => {
    it('should return integrations for a business', async () => {
      const integrations = await getIntegrations(businessId);
      
      expect(integrations).toBeDefined();
      expect(Array.isArray(integrations)).toBe(true);
    });
  });

  describe('connectCalendarIntegration', () => {
    it('should connect a calendar integration', async () => {
      const providerType = 'google';
      const authCode = 'mock-auth-code';
      
      const integration = await connectCalendarIntegration(businessId, providerType, authCode);
      
      expect(integration).toBeDefined();
      expect(integration?.type).toBe('calendar');
      expect(integration?.providerId).toBe('mock-calendar-provider');
      expect(integration?.status).toBe('active');
    });
  });

  describe('connectCRMIntegration', () => {
    it('should connect a CRM integration', async () => {
      const providerType = 'hubspot';
      const authCode = 'mock-auth-code';
      
      const integration = await connectCRMIntegration(businessId, providerType, authCode);
      
      expect(integration).toBeDefined();
      expect(integration?.type).toBe('crm');
      expect(integration?.providerId).toBe('mock-crm-provider');
      expect(integration?.status).toBe('active');
    });
  });

  describe('connectEmailIntegration', () => {
    it('should connect an email marketing integration', async () => {
      const providerType = 'mailchimp';
      const apiKey = 'mock-api-key';
      
      const integration = await connectEmailIntegration(businessId, providerType, apiKey);
      
      expect(integration).toBeDefined();
      expect(integration?.type).toBe('email');
      expect(integration?.providerId).toBe('mock-email-provider');
      expect(integration?.status).toBe('active');
    });
  });

  describe('disconnectIntegration', () => {
    it('should disconnect an integration', async () => {
      // First connect an integration
      const integration = await connectCalendarIntegration(businessId, 'google');
      expect(integration).toBeDefined();
      
      if (integration) {
        const result = await disconnectIntegration(businessId, integration.id);
        expect(result).toBe(true);
      }
    });
    
    it('should return false if integration is not found', async () => {
      const result = await disconnectIntegration(businessId, 'non-existent-integration-id');
      expect(result).toBe(false);
    });
  });

  describe('processConversationForIntegrations', () => {
    it('should process a conversation for all integrations', async () => {
      // Connect all integrations first
      await connectCalendarIntegration(businessId, 'google');
      await connectCRMIntegration(businessId, 'hubspot');
      await connectEmailIntegration(businessId, 'mailchimp');
      
      const conversationId = 'mock-conversation-id';
      const conversationData = {
        customerInfo: {
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '123-456-7890'
        },
        appointmentInfo: {
          serviceName: 'Mock Service',
          startTime: new Date('2025-01-01T10:00:00Z'),
          endTime: new Date('2025-01-01T11:00:00Z')
        },
        leadCapture: true
      };
      
      const result = await processConversationForIntegrations(
        businessId,
        conversationId,
        conversationData
      );
      
      expect(result).toBeDefined();
      expect(result.crmCustomer).toBeDefined();
      expect(result.emailContact).toBeDefined();
      expect(result.appointment).toBeDefined();
    });
    
    it('should handle missing customer info', async () => {
      const conversationId = 'mock-conversation-id';
      const conversationData = {
        leadCapture: true
      };
      
      const result = await processConversationForIntegrations(
        businessId,
        conversationId,
        conversationData
      );
      
      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBe(0);
    });
  });
});
