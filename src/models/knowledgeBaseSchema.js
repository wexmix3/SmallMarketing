/**
 * Knowledge Base Schema
 * Defines the structure for the knowledge base and business-specific schemas
 */

import { BusinessType } from './businessTypes.js';

/**
 * Knowledge Base Item
 * Represents a single question-answer pair in the knowledge base
 */
class KnowledgeBaseItem {
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.question = data.question || '';
    this.answer = data.answer || '';
    this.category = data.category || 'general';
    this.tags = data.tags || [];
    this.businessType = data.businessType || BusinessType.OTHER;
    this.lastUpdated = data.lastUpdated || new Date();
  }
  
  // Validate the knowledge base item
  validate() {
    if (!this.question) return false;
    if (!this.answer) return false;
    return true;
  }
}

/**
 * Business-specific schemas with required categories and suggested questions
 */

// Restaurant schema
const restaurantSchema = {
  requiredCategories: ['menu', 'hours', 'reservations', 'location', 'dietary'],
  suggestedQuestions: [
    'What are your hours?',
    'Do you take reservations?',
    'Do you have vegetarian options?',
    'Is there parking available?',
    'Do you deliver?',
    'Do you cater events?',
    'Are you open on holidays?',
    'Do you have a kids menu?',
    'What forms of payment do you accept?',
    'Do you have outdoor seating?'
  ]
};

// Retail schema
const retailSchema = {
  requiredCategories: ['products', 'returns', 'shipping', 'store-locations', 'sales'],
  suggestedQuestions: [
    'What is your return policy?',
    'Do you ship internationally?',
    'How can I check my order status?',
    'Do you offer gift wrapping?',
    'Are there any current promotions?',
    'Do you have a loyalty program?',
    'What payment methods do you accept?',
    'How long does shipping take?',
    'Do you have physical store locations?',
    'Can I buy online and pick up in store?'
  ]
};

// Service schema
const serviceSchema = {
  requiredCategories: ['services', 'pricing', 'booking', 'cancellation', 'qualifications'],
  suggestedQuestions: [
    'How do I book an appointment?',
    'What are your rates?',
    'What is your cancellation policy?',
    'What areas do you serve?',
    'Are you licensed and insured?',
    'Do you offer emergency services?',
    'How long does a typical service take?',
    'Do you provide free estimates?',
    'What payment methods do you accept?',
    'Do you offer any guarantees on your work?'
  ]
};

// Professional services schema
const professionalSchema = {
  requiredCategories: ['expertise', 'consultation', 'fees', 'process', 'credentials'],
  suggestedQuestions: [
    'How do I schedule a consultation?',
    'What are your fees?',
    'What is your area of expertise?',
    'What credentials do you have?',
    'How long have you been in business?',
    'Do you offer virtual consultations?',
    'What is your process like?',
    'How long does it typically take to complete a project?',
    'Do you require a retainer?',
    'Can you provide references or case studies?'
  ]
};

// Default schema for other business types
const defaultSchema = {
  requiredCategories: ['general', 'contact', 'hours', 'location', 'services'],
  suggestedQuestions: [
    'What services do you offer?',
    'What are your hours?',
    'How can I contact you?',
    'Where are you located?',
    'Do you have a website?',
    'What payment methods do you accept?',
    'How long have you been in business?',
    'Do you offer any guarantees?',
    'Are you hiring?',
    'How can I provide feedback?'
  ]
};

// Get schema based on business type
function getSchemaForBusinessType(businessType) {
  switch (businessType) {
    case BusinessType.RESTAURANT:
      return restaurantSchema;
    case BusinessType.RETAIL:
      return retailSchema;
    case BusinessType.SERVICE:
      return serviceSchema;
    case BusinessType.PROFESSIONAL:
      return professionalSchema;
    default:
      return defaultSchema;
  }
}

// Export the knowledge base schema
export {
  KnowledgeBaseItem,
  getSchemaForBusinessType,
  restaurantSchema,
  retailSchema,
  serviceSchema,
  professionalSchema,
  defaultSchema
};
