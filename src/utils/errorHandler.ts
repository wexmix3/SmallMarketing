import { NextApiResponse } from 'next';

/**
 * Standard error response format
 */
interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  code?: string;
  status?: number;
}

/**
 * Error types
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
  INTERNAL = 'INTERNAL_ERROR'
}

/**
 * Map error types to HTTP status codes
 */
const errorStatusCodes: Record<ErrorType, number> = {
  [ErrorType.VALIDATION]: 400,
  [ErrorType.AUTHENTICATION]: 401,
  [ErrorType.AUTHORIZATION]: 403,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.RATE_LIMIT]: 429,
  [ErrorType.DATABASE]: 500,
  [ErrorType.EXTERNAL_API]: 502,
  [ErrorType.INTERNAL]: 500
};

/**
 * Handle API errors and send appropriate response
 * @param res - Next.js API response
 * @param error - Error object or message
 * @param type - Type of error
 * @param message - Optional custom message
 */
export function handleApiError(
  res: NextApiResponse,
  error: Error | string,
  type: ErrorType = ErrorType.INTERNAL,
  message?: string
): void {
  // Get error message
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  // Get status code
  const statusCode = errorStatusCodes[type];
  
  // Log error (in production, you would use a proper logging service)
  console.error(`[${type}] ${message || errorMessage}`, typeof error === 'object' ? error : '');
  
  // Create error response
  const errorResponse: ErrorResponse = {
    success: false,
    message: message || errorMessage,
    error: errorMessage,
    code: type,
    status: statusCode
  };
  
  // Send response
  res.status(statusCode).json(errorResponse);
}

/**
 * Validate request data against a schema
 * @param data - Data to validate
 * @param schema - Validation schema
 * @returns Validation result
 */
export function validateRequest(data: any, schema: Record<string, any>): { 
  valid: boolean; 
  errors?: string[] 
} {
  const errors: string[] = [];
  
  // Simple validation for required fields
  for (const [field, config] of Object.entries(schema)) {
    // Check if field is required and missing
    if (config.required && (data[field] === undefined || data[field] === null || data[field] === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    // Skip further validation if field is not present
    if (data[field] === undefined || data[field] === null) {
      continue;
    }
    
    // Type validation
    if (config.type && typeof data[field] !== config.type) {
      errors.push(`${field} must be a ${config.type}`);
    }
    
    // Min/max validation for numbers
    if (config.type === 'number') {
      if (config.min !== undefined && data[field] < config.min) {
        errors.push(`${field} must be at least ${config.min}`);
      }
      if (config.max !== undefined && data[field] > config.max) {
        errors.push(`${field} must be at most ${config.max}`);
      }
    }
    
    // Min/max length validation for strings
    if (config.type === 'string') {
      if (config.minLength !== undefined && data[field].length < config.minLength) {
        errors.push(`${field} must be at least ${config.minLength} characters`);
      }
      if (config.maxLength !== undefined && data[field].length > config.maxLength) {
        errors.push(`${field} must be at most ${config.maxLength} characters`);
      }
    }
    
    // Enum validation
    if (config.enum && !config.enum.includes(data[field])) {
      errors.push(`${field} must be one of: ${config.enum.join(', ')}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}
