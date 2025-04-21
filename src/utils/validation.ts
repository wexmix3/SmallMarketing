/**
 * Validation Utilities
 * 
 * This module provides utilities for validating user input.
 */

/**
 * Validate an email address
 * 
 * @param email - The email address to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate a phone number
 * 
 * @param phone - The phone number to validate
 * @returns Whether the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  // Allow various formats with optional country code
  const phoneRegex = /^(\+\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate a URL
 * 
 * @param url - The URL to validate
 * @returns Whether the URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Sanitize a string to prevent XSS attacks
 * 
 * @param input - The string to sanitize
 * @returns The sanitized string
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\\/g, '&#92;');
}

/**
 * Validate required fields in an object
 * 
 * @param data - The object to validate
 * @param requiredFields - Array of required field names
 * @returns An array of missing field names, empty if all required fields are present
 */
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: string[]
): string[] {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(field);
    }
  }
  
  return missingFields;
}

/**
 * Validate field types in an object
 * 
 * @param data - The object to validate
 * @param fieldTypes - Object mapping field names to expected types
 * @returns An array of invalid field names, empty if all fields have the correct type
 */
export function validateFieldTypes<T extends Record<string, any>>(
  data: T,
  fieldTypes: Record<string, 'string' | 'number' | 'boolean' | 'object' | 'array'>
): string[] {
  const invalidFields: string[] = [];
  
  for (const [field, expectedType] of Object.entries(fieldTypes)) {
    if (data[field] !== undefined && data[field] !== null) {
      let isValid = false;
      
      switch (expectedType) {
        case 'string':
          isValid = typeof data[field] === 'string';
          break;
        case 'number':
          isValid = typeof data[field] === 'number';
          break;
        case 'boolean':
          isValid = typeof data[field] === 'boolean';
          break;
        case 'object':
          isValid = typeof data[field] === 'object' && !Array.isArray(data[field]);
          break;
        case 'array':
          isValid = Array.isArray(data[field]);
          break;
      }
      
      if (!isValid) {
        invalidFields.push(field);
      }
    }
  }
  
  return invalidFields;
}

/**
 * Validate a password
 * 
 * @param password - The password to validate
 * @param options - Validation options
 * @returns Whether the password is valid
 */
export function isValidPassword(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): boolean {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options;
  
  // Check length
  if (password.length < minLength) {
    return false;
  }
  
  // Check for uppercase letters
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return false;
  }
  
  // Check for lowercase letters
  if (requireLowercase && !/[a-z]/.test(password)) {
    return false;
  }
  
  // Check for numbers
  if (requireNumbers && !/[0-9]/.test(password)) {
    return false;
  }
  
  // Check for special characters
  if (requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
    return false;
  }
  
  return true;
}

/**
 * Validate a date string
 * 
 * @param dateStr - The date string to validate
 * @returns Whether the date is valid
 */
export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validate a time string (HH:MM format)
 * 
 * @param timeStr - The time string to validate
 * @returns Whether the time is valid
 */
export function isValidTime(timeStr: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return timeRegex.test(timeStr);
}
