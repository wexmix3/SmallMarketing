/**
 * Fallback Service
 * Provides fallback mechanisms when integration fails
 */

import { BusinessType } from '../models/businessTypes.js';
import { KnowledgeBaseItem, getSchemaForBusinessType } from '../models/knowledgeBaseSchema.js';

class FallbackService {
  /**
   * Generate default knowledge base when integration fails
   * @param {string} businessType - Type of business
   * @param {Object} businessInfo - Business information
   * @returns {Promise<KnowledgeBaseItem[]>} - Array of knowledge base items
   */
  async generateDefaultKnowledgeBase(businessType, businessInfo) {
    try {
      // Get schema for business type
      const schema = getSchemaForBusinessType(businessType);
      
      // Generate basic knowledge items from business info
      return this.createBasicKnowledgeItems(schema, businessInfo);
    } catch (error) {
      console.error('Default knowledge base generation error:', error);
      // Return empty array if generation fails
      return [];
    }
  }
  
  /**
   * Handle integration failure during chatbot operation
   * @param {string} query - User query
   * @param {string} businessType - Type of business
   * @param {Object} businessInfo - Business information
   * @returns {Promise<string>} - Fallback response
   */
  async handleIntegrationFailure(query, businessType, businessInfo) {
    try {
      // Log the failure
      console.error(`Integration failure for query: ${query}`);
      
      // Generate a generic response based on business type
      return this.generateGenericResponse(query, businessType, businessInfo);
    } catch (error) {
      console.error('Fallback handling error:', error);
      // Return generic error message
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact us directly.";
    }
  }
  
  /**
   * Create basic knowledge base items
   * @param {Object} schema - Business schema
   * @param {Object} businessInfo - Business information
   * @returns {KnowledgeBaseItem[]} - Array of knowledge base items
   * @private
   */
  createBasicKnowledgeItems(schema, businessInfo) {
    try {
      const items = [];
      
      // Generate items for each required category
      schema.requiredCategories.forEach(category => {
        // Generate basic questions and answers from business info
        const categoryItems = this.generateItemsForCategory(category, businessInfo);
        items.push(...categoryItems);
      });
      
      // Add suggested questions with generic answers
      schema.suggestedQuestions.forEach(question => {
        items.push(new KnowledgeBaseItem({
          question,
          answer: "I don't have specific information about this yet. Please contact us directly for more details.",
          category: 'general',
          tags: ['default'],
          businessType: businessInfo.type
        }));
      });
      
      return items;
    } catch (error) {
      console.error('Knowledge item creation error:', error);
      return [];
    }
  }
  
  /**
   * Generate items for a specific category
   * @param {string} category - Category name
   * @param {Object} businessInfo - Business information
   * @returns {KnowledgeBaseItem[]} - Array of knowledge base items
   * @private
   */
  generateItemsForCategory(category, businessInfo) {
    try {
      const items = [];
      
      switch (category) {
        case 'general':
          items.push(new KnowledgeBaseItem({
            question: 'What does your business do?',
            answer: businessInfo.description || `${businessInfo.name} provides products and services to customers.`,
            category: 'general',
            tags: ['general', 'about'],
            businessType: businessInfo.type
          }));
          break;
        
        case 'contact':
          items.push(new KnowledgeBaseItem({
            question: 'How can I contact you?',
            answer: this.generateContactAnswer(businessInfo),
            category: 'contact',
            tags: ['contact', 'email', 'phone'],
            businessType: businessInfo.type
          }));
          break;
        
        case 'hours':
          items.push(new KnowledgeBaseItem({
            question: 'What are your hours?',
            answer: this.generateHoursAnswer(businessInfo),
            category: 'hours',
            tags: ['hours', 'schedule'],
            businessType: businessInfo.type
          }));
          break;
        
        case 'location':
          items.push(new KnowledgeBaseItem({
            question: 'Where are you located?',
            answer: businessInfo.contact?.address || "Please contact us for our location information.",
            category: 'location',
            tags: ['location', 'address'],
            businessType: businessInfo.type
          }));
          break;
        
        // Add more categories as needed
      }
      
      return items;
    } catch (error) {
      console.error('Category item generation error:', error);
      return [];
    }
  }
  
  /**
   * Generate contact answer from business info
   * @param {Object} businessInfo - Business information
   * @returns {string} - Contact answer
   * @private
   */
  generateContactAnswer(businessInfo) {
    try {
      const contactParts = [];
      
      if (businessInfo.contact?.phone) {
        contactParts.push(`Phone: ${businessInfo.contact.phone}`);
      }
      
      if (businessInfo.contact?.email) {
        contactParts.push(`Email: ${businessInfo.contact.email}`);
      }
      
      if (businessInfo.contact?.address) {
        contactParts.push(`Address: ${businessInfo.contact.address}`);
      }
      
      if (contactParts.length === 0) {
        return "Please check our website for contact information.";
      }
      
      return `You can reach ${businessInfo.name} through the following methods: ${contactParts.join(', ')}.`;
    } catch (error) {
      console.error('Contact answer generation error:', error);
      return "Please contact us for more information.";
    }
  }
  
  /**
   * Generate hours answer from business info
   * @param {Object} businessInfo - Business information
   * @returns {string} - Hours answer
   * @private
   */
  generateHoursAnswer(businessInfo) {
    try {
      if (!businessInfo.hours) {
        return "Please contact us for our current hours of operation.";
      }
      
      const hoursParts = [];
      
      // Process hours for each day
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      days.forEach(day => {
        if (businessInfo.hours[day]) {
          const dayHours = businessInfo.hours[day];
          
          if (dayHours.closed) {
            hoursParts.push(`${day.charAt(0).toUpperCase() + day.slice(1)}: Closed`);
          } else {
            hoursParts.push(`${day.charAt(0).toUpperCase() + day.slice(1)}: ${dayHours.open} - ${dayHours.close}`);
          }
        }
      });
      
      if (hoursParts.length === 0) {
        return "Please contact us for our current hours of operation.";
      }
      
      return `Our hours of operation are: ${hoursParts.join(', ')}.`;
    } catch (error) {
      console.error('Hours answer generation error:', error);
      return "Please contact us for our current hours of operation.";
    }
  }
  
  /**
   * Generate generic response for unknown queries
   * @param {string} query - User query
   * @param {string} businessType - Type of business
   * @param {Object} businessInfo - Business information
   * @returns {string} - Generic response
   * @private
   */
  generateGenericResponse(query, businessType, businessInfo) {
    try {
      // Generate a generic response when specific information is unavailable
      const contactInfo = businessInfo.contact?.phone || businessInfo.contact?.email || "our team";
      
      return `I'm sorry, I don't have specific information about "${query}". Please contact ${businessInfo.name} directly at ${contactInfo} for assistance.`;
    } catch (error) {
      console.error('Generic response generation error:', error);
      return "I'm sorry, I don't have that information. Please contact us directly for assistance.";
    }
  }
}

// Export the service
export default FallbackService;
