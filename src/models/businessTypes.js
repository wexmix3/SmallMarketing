/**
 * Business Types
 * Defines the different types of businesses supported by the AI Customer Service Assistant
 */

// Business type enum
const BusinessType = {
  RESTAURANT: 'restaurant',
  RETAIL: 'retail',
  SERVICE: 'service',
  PROFESSIONAL: 'professional',
  OTHER: 'other'
};

// Business type display names
const BusinessTypeNames = {
  [BusinessType.RESTAURANT]: 'Restaurant',
  [BusinessType.RETAIL]: 'Retail Store',
  [BusinessType.SERVICE]: 'Service Business',
  [BusinessType.PROFESSIONAL]: 'Professional Services',
  [BusinessType.OTHER]: 'Other Business'
};

// Business type descriptions
const BusinessTypeDescriptions = {
  [BusinessType.RESTAURANT]: 'Restaurants, cafes, bars, and food service businesses',
  [BusinessType.RETAIL]: 'Retail stores, e-commerce, and product-based businesses',
  [BusinessType.SERVICE]: 'Service providers like cleaning, repairs, and maintenance',
  [BusinessType.PROFESSIONAL]: 'Professional services like consulting, legal, or accounting',
  [BusinessType.OTHER]: 'Other business types not listed above'
};

// Export the business type definitions
export {
  BusinessType,
  BusinessTypeNames,
  BusinessTypeDescriptions
};
