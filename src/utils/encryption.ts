/**
 * Encryption Utilities
 * 
 * This module provides utilities for encrypting and decrypting sensitive data.
 */

import crypto from 'crypto';

// Get encryption key from environment or generate one
// In production, this should be set in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 
  crypto.randomBytes(32).toString('hex');

// Initialization vector length
const IV_LENGTH = 16;

/**
 * Encrypt a string
 * 
 * @param text - The text to encrypt
 * @returns The encrypted text as a base64 string
 */
export function encrypt(text: string): string {
  // Generate a random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Create cipher
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Combine IV and encrypted text
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt a string
 * 
 * @param encryptedText - The encrypted text to decrypt
 * @returns The decrypted text
 */
export function decrypt(encryptedText: string): string {
  try {
    // Split IV and encrypted text
    const [ivHex, encrypted] = encryptedText.split(':');
    
    if (!ivHex || !encrypted) {
      throw new Error('Invalid encrypted text format');
    }
    
    // Convert IV from hex to buffer
    const iv = Buffer.from(ivHex, 'hex');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv
    );
    
    // Decrypt the text
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash a string using SHA-256
 * 
 * @param text - The text to hash
 * @returns The hashed text
 */
export function hash(text: string): string {
  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex');
}

/**
 * Generate a secure random token
 * 
 * @param length - The length of the token in bytes (default: 32)
 * @returns The random token as a hex string
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Encrypt sensitive fields in an object
 * 
 * @param data - The object containing data to encrypt
 * @param sensitiveFields - Array of field names to encrypt
 * @returns A new object with encrypted sensitive fields
 */
export function encryptSensitiveData<T extends Record<string, any>>(
  data: T,
  sensitiveFields: string[]
): T {
  const result = { ...data };
  
  for (const field of sensitiveFields) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = encrypt(result[field]);
    }
  }
  
  return result;
}

/**
 * Decrypt sensitive fields in an object
 * 
 * @param data - The object containing encrypted data
 * @param sensitiveFields - Array of field names to decrypt
 * @returns A new object with decrypted sensitive fields
 */
export function decryptSensitiveData<T extends Record<string, any>>(
  data: T,
  sensitiveFields: string[]
): T {
  const result = { ...data };
  
  for (const field of sensitiveFields) {
    if (result[field] && typeof result[field] === 'string') {
      try {
        result[field] = decrypt(result[field]);
      } catch (error) {
        // If decryption fails, leave the field as is
        console.error(`Failed to decrypt field ${field}:`, error);
      }
    }
  }
  
  return result;
}
