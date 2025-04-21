/**
 * Enhanced Knowledge Base Service Tests
 * 
 * This file contains tests for the enhanced knowledge base service.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  searchKnowledgeBase,
  getBusinessHoursText,
  getProductInfo,
  getServiceInfo,
  getBusinessContactInfo
} from '@/services/enhancedKnowledgeBaseService';
import { mockKnowledgeBase } from '../mocks/mockData';

// Mock the dependencies
vi.mock('@/services/embeddingService', () => ({
  generateEmbedding: vi.fn().mockResolvedValue(Array(1536).fill(0).map(() => Math.random() * 2 - 1)),
  calculateSimilarity: vi.fn().mockReturnValue(0.85),
  findSimilarTexts: vi.fn().mockResolvedValue([
    { text: 'Mock Product 1', similarity: 0.85 }
  ])
}));

// Mock the repositories
vi.mock('@/repositories/chatbotRepository', () => ({
  KnowledgeBaseRepository: {
    getByBusinessId: vi.fn().mockResolvedValue(mockKnowledgeBase)
  }
}));

vi.mock('@/repositories/chatbotRepositoryServer', () => ({
  KnowledgeBaseRepository: {
    getByBusinessId: vi.fn().mockResolvedValue(mockKnowledgeBase)
  }
}));

describe('Enhanced Knowledge Base Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchKnowledgeBase', () => {
    it('should search the knowledge base and return relevant results', async () => {
      const query = 'product information';
      const businessId = 'mock-business-id';
      
      const results = await searchKnowledgeBase(query, businessId);
      
      expect(results).toBeDefined();
      expect(results.faqs).toBeDefined();
      expect(results.products).toBeDefined();
      expect(results.services).toBeDefined();
    });
    
    it('should respect search options', async () => {
      const query = 'product information';
      const businessId = 'mock-business-id';
      const options = {
        searchFAQs: false,
        searchProducts: true,
        searchServices: false,
        threshold: 0.8,
        limit: 2
      };
      
      const results = await searchKnowledgeBase(query, businessId, options);
      
      expect(results).toBeDefined();
      expect(results.faqs).toHaveLength(0);
      expect(results.products).toBeDefined();
      expect(results.services).toHaveLength(0);
    });
    
    it('should throw an error if knowledge base is not found', async () => {
      const query = 'product information';
      const businessId = 'non-existent-business-id';
      
      // Override the mock for this test
      const getByBusinessIdMock = vi.requireMock('@/repositories/chatbotRepository').KnowledgeBaseRepository.getByBusinessId;
      getByBusinessIdMock.mockResolvedValueOnce(null);
      
      await expect(searchKnowledgeBase(query, businessId)).rejects.toThrow('Knowledge base not found');
    });
  });

  describe('getBusinessHoursText', () => {
    it('should format business hours correctly', () => {
      const businessInfo = mockKnowledgeBase.businessInfo;
      
      const hoursText = getBusinessHoursText(businessInfo);
      
      expect(hoursText).toBeDefined();
      expect(hoursText).toContain('Monday');
      expect(hoursText).toContain('Sunday: Closed');
    });
    
    it('should handle missing hours', () => {
      const businessInfo = {
        ...mockKnowledgeBase.businessInfo,
        hours: []
      };
      
      const hoursText = getBusinessHoursText(businessInfo);
      
      expect(hoursText).toBe('Business hours not available.');
    });
  });

  describe('getProductInfo', () => {
    it('should format product information correctly', () => {
      const product = mockKnowledgeBase.products[0];
      
      const productInfo = getProductInfo(product);
      
      expect(productInfo).toBeDefined();
      expect(productInfo).toContain('Product: Mock Product 1');
      expect(productInfo).toContain('Price: 29.99 USD');
      expect(productInfo).toContain('In Stock: Yes');
    });
  });

  describe('getServiceInfo', () => {
    it('should format service information correctly', () => {
      const service = mockKnowledgeBase.services[0];
      
      const serviceInfo = getServiceInfo(service);
      
      expect(serviceInfo).toBeDefined();
      expect(serviceInfo).toContain('Service: Mock Service 1');
      expect(serviceInfo).toContain('Price: 99.99 USD');
      expect(serviceInfo).toContain('Duration: 60 minutes');
    });
  });

  describe('getBusinessContactInfo', () => {
    it('should format business contact information correctly', () => {
      const businessInfo = mockKnowledgeBase.businessInfo;
      
      const contactInfo = getBusinessContactInfo(businessInfo);
      
      expect(contactInfo).toBeDefined();
      expect(contactInfo).toContain('Business: Mock Business');
      expect(contactInfo).toContain('Email: info@mockbusiness.com');
      expect(contactInfo).toContain('Phone: 123-456-7890');
    });
  });
});
