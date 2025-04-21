/**
 * Mock Database Service
 * 
 * This service provides a mock implementation of database operations
 * using JSON files for development and testing purposes.
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the base path for mock data
const mockDataDir = path.join(process.cwd(), 'src', 'mock-data');

// Ensure the directory exists
if (!fs.existsSync(mockDataDir)) {
  fs.mkdirSync(mockDataDir, { recursive: true });
}

// Helper function to read a JSON file
const readJsonFile = <T>(filename: string): T[] => {
  const filePath = path.join(mockDataDir, filename);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as T[];
};

// Helper function to write a JSON file
const writeJsonFile = <T>(filename: string, data: T[]): void => {
  const filePath = path.join(mockDataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Generic CRUD operations
export class MockRepository<T extends { id: string }> {
  private filename: string;
  
  constructor(filename: string) {
    this.filename = filename;
  }
  
  async findAll(): Promise<T[]> {
    return readJsonFile<T>(this.filename);
  }
  
  async findById(id: string): Promise<T | null> {
    const items = await this.findAll();
    return items.find(item => item.id === id) || null;
  }
  
  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.findAll();
    return items.filter(predicate);
  }
  
  async create(data: Omit<T, 'id'>): Promise<T> {
    const items = await this.findAll();
    const newItem = { ...data, id: uuidv4() } as T;
    
    items.push(newItem);
    writeJsonFile(this.filename, items);
    
    return newItem;
  }
  
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const items = await this.findAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedItem = { ...items[index], ...data };
    items[index] = updatedItem;
    
    writeJsonFile(this.filename, items);
    
    return updatedItem;
  }
  
  async delete(id: string): Promise<boolean> {
    const items = await this.findAll();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) {
      return false;
    }
    
    writeJsonFile(this.filename, filteredItems);
    
    return true;
  }
}

// Specific repositories
export const BusinessRepository = new MockRepository<any>('businesses.json');
export const ChatbotConfigRepository = new MockRepository<any>('chatbot-configs.json');
export const FAQRepository = new MockRepository<any>('faqs.json');
export const ProductRepository = new MockRepository<any>('products.json');
export const ServiceRepository = new MockRepository<any>('services.json');
export const ConversationRepository = new MockRepository<any>('conversations.json');

// Export a mock query function that can be used as a drop-in replacement for the real database
export async function query(text: string, params?: any[]) {
  console.log('Mock query:', text, params);
  
  // This is a very simplified mock implementation
  // In a real implementation, you would parse the SQL and perform the appropriate operations
  
  if (text.includes('SELECT') && text.includes('FROM businesses')) {
    return { rows: await BusinessRepository.findAll(), rowCount: (await BusinessRepository.findAll()).length };
  }
  
  if (text.includes('SELECT') && text.includes('FROM chatbot_config')) {
    return { rows: await ChatbotConfigRepository.findAll(), rowCount: (await ChatbotConfigRepository.findAll()).length };
  }
  
  if (text.includes('SELECT') && text.includes('FROM faqs')) {
    return { rows: await FAQRepository.findAll(), rowCount: (await FAQRepository.findAll()).length };
  }
  
  // Default response
  return { rows: [], rowCount: 0 };
}

// Export a mock transaction function
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  // In a mock implementation, we just call the callback directly
  return callback({ query });
}

export default {
  query,
  transaction,
  BusinessRepository,
  ChatbotConfigRepository,
  FAQRepository,
  ProductRepository,
  ServiceRepository,
  ConversationRepository
};
