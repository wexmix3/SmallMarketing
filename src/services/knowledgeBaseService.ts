/**
 * Knowledge Base Service
 * 
 * This service manages the storage and retrieval of business information,
 * FAQs, and other knowledge used by the AI Customer Service Assistant.
 */

import { Pool } from 'pg';
import { FAQ, BusinessInfo, Product, Service } from '../types/chatbot';

export class KnowledgeBaseService {
  private db: Pool;
  
  constructor(dbConnection: Pool) {
    this.db = dbConnection;
  }
  
  /**
   * Get all FAQs for a business
   */
  async getAllFAQs(businessId: string): Promise<FAQ[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM faqs WHERE business_id = $1 ORDER BY created_at DESC',
        [businessId]
      );
      
      return result.rows.map(row => ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        category: row.category,
        tags: row.tags,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error getting FAQs:', error);
      return [];
    }
  }
  
  /**
   * Get a specific FAQ by ID
   */
  async getFAQById(businessId: string, faqId: string): Promise<FAQ | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM faqs WHERE business_id = $1 AND id = $2',
        [businessId, faqId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        question: row.question,
        answer: row.answer,
        category: row.category,
        tags: row.tags,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      console.error('Error getting FAQ by ID:', error);
      return null;
    }
  }
  
  /**
   * Create a new FAQ
   */
  async createFAQ(businessId: string, faq: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>): Promise<FAQ | null> {
    try {
      const result = await this.db.query(
        `INSERT INTO faqs (business_id, question, answer, category, tags, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        [businessId, faq.question, faq.answer, faq.category, faq.tags]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        question: row.question,
        answer: row.answer,
        category: row.category,
        tags: row.tags,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return null;
    }
  }
  
  /**
   * Update an existing FAQ
   */
  async updateFAQ(businessId: string, faqId: string, faq: Partial<FAQ>): Promise<FAQ | null> {
    try {
      // Build the SET clause dynamically based on provided fields
      const updates = [];
      const values = [businessId, faqId];
      let paramIndex = 3;
      
      if (faq.question !== undefined) {
        updates.push(`question = $${paramIndex++}`);
        values.push(faq.question);
      }
      
      if (faq.answer !== undefined) {
        updates.push(`answer = $${paramIndex++}`);
        values.push(faq.answer);
      }
      
      if (faq.category !== undefined) {
        updates.push(`category = $${paramIndex++}`);
        values.push(faq.category);
      }
      
      if (faq.tags !== undefined) {
        updates.push(`tags = $${paramIndex++}`);
        values.push(faq.tags);
      }
      
      updates.push(`updated_at = NOW()`);
      
      if (updates.length === 1) {
        // Only updated_at was added, nothing else to update
        return await this.getFAQById(businessId, faqId);
      }
      
      const result = await this.db.query(
        `UPDATE faqs
         SET ${updates.join(', ')}
         WHERE business_id = $1 AND id = $2
         RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        question: row.question,
        answer: row.answer,
        category: row.category,
        tags: row.tags,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return null;
    }
  }
  
  /**
   * Delete an FAQ
   */
  async deleteFAQ(businessId: string, faqId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'DELETE FROM faqs WHERE business_id = $1 AND id = $2 RETURNING id',
        [businessId, faqId]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  }
  
  /**
   * Get business information
   */
  async getBusinessInfo(businessId: string): Promise<BusinessInfo | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM businesses WHERE id = $1',
        [businessId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        industry: row.industry,
        description: row.description,
        hours: row.hours,
        contact: row.contact,
        logo: row.logo,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      console.error('Error getting business info:', error);
      return null;
    }
  }
  
  /**
   * Update business information
   */
  async updateBusinessInfo(businessId: string, info: Partial<BusinessInfo>): Promise<BusinessInfo | null> {
    try {
      // Build the SET clause dynamically based on provided fields
      const updates = [];
      const values = [businessId];
      let paramIndex = 2;
      
      if (info.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(info.name);
      }
      
      if (info.industry !== undefined) {
        updates.push(`industry = $${paramIndex++}`);
        values.push(info.industry);
      }
      
      if (info.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(info.description);
      }
      
      if (info.hours !== undefined) {
        updates.push(`hours = $${paramIndex++}`);
        values.push(info.hours);
      }
      
      if (info.contact !== undefined) {
        updates.push(`contact = $${paramIndex++}`);
        values.push(info.contact);
      }
      
      if (info.logo !== undefined) {
        updates.push(`logo = $${paramIndex++}`);
        values.push(info.logo);
      }
      
      updates.push(`updated_at = NOW()`);
      
      if (updates.length === 1) {
        // Only updated_at was added, nothing else to update
        return await this.getBusinessInfo(businessId);
      }
      
      const result = await this.db.query(
        `UPDATE businesses
         SET ${updates.join(', ')}
         WHERE id = $1
         RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        industry: row.industry,
        description: row.description,
        hours: row.hours,
        contact: row.contact,
        logo: row.logo,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      console.error('Error updating business info:', error);
      return null;
    }
  }
  
  /**
   * Get all products for a business
   */
  async getProducts(businessId: string): Promise<Product[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM products WHERE business_id = $1 ORDER BY name',
        [businessId]
      );
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        currency: row.currency,
        imageUrl: row.image_url,
        category: row.category,
        tags: row.tags,
        inStock: row.in_stock,
        attributes: row.attributes,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }
  
  /**
   * Get all services for a business
   */
  async getServices(businessId: string): Promise<Service[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM services WHERE business_id = $1 ORDER BY name',
        [businessId]
      );
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        currency: row.currency,
        duration: row.duration,
        imageUrl: row.image_url,
        category: row.category,
        tags: row.tags,
        availability: row.availability,
        attributes: row.attributes,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error getting services:', error);
      return [];
    }
  }
  
  /**
   * Import FAQs from a template
   */
  async importFAQsFromTemplate(businessId: string, templateId: string): Promise<number> {
    try {
      // Get template FAQs
      const result = await this.db.query(
        'SELECT * FROM faq_templates WHERE template_id = $1',
        [templateId]
      );
      
      if (result.rows.length === 0) {
        return 0;
      }
      
      // Insert each template FAQ for the business
      let importedCount = 0;
      
      for (const templateFaq of result.rows) {
        await this.db.query(
          `INSERT INTO faqs (business_id, question, answer, category, tags, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
          [businessId, templateFaq.question, templateFaq.answer, templateFaq.category, templateFaq.tags]
        );
        
        importedCount++;
      }
      
      return importedCount;
    } catch (error) {
      console.error('Error importing FAQs from template:', error);
      return 0;
    }
  }
  
  /**
   * Search FAQs by keyword
   */
  async searchFAQs(businessId: string, query: string): Promise<FAQ[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM faqs 
         WHERE business_id = $1 
         AND (question ILIKE $2 OR answer ILIKE $2)
         ORDER BY created_at DESC`,
        [businessId, `%${query}%`]
      );
      
      return result.rows.map(row => ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        category: row.category,
        tags: row.tags,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error searching FAQs:', error);
      return [];
    }
  }
}
