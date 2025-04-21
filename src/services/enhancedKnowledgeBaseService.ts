/**
 * Enhanced Knowledge Base Service
 * 
 * This service provides enhanced knowledge base functionality with semantic search
 * and structured data management for the AI Customer Service Assistant.
 */

import { 
  KnowledgeBase, 
  FAQ, 
  Product, 
  Service, 
  BusinessInfo 
} from '@/models/chatbot';
import { generateEmbedding, calculateSimilarity, findSimilarTexts } from './embeddingService';

// Use client-side repository for browser and server-side repository for server
const isServer = typeof window === 'undefined';

// Import repositories
let KnowledgeBaseRepository;

if (isServer) {
  // Server-side imports
  const serverRepo = require('@/repositories/chatbotRepositoryServer');
  KnowledgeBaseRepository = serverRepo.KnowledgeBaseRepository;
} else {
  // Client-side imports
  const clientRepo = require('@/repositories/chatbotRepository');
  KnowledgeBaseRepository = clientRepo.KnowledgeBaseRepository;
}

/**
 * Search the knowledge base for relevant information
 */
export async function searchKnowledgeBase(
  query: string,
  businessId: string,
  options: {
    searchFAQs?: boolean;
    searchProducts?: boolean;
    searchServices?: boolean;
    threshold?: number;
    limit?: number;
  } = {}
): Promise<{
  faqs: Array<FAQ & { similarity: number }>;
  products: Array<Product & { similarity: number }>;
  services: Array<Service & { similarity: number }>;
}> {
  const {
    searchFAQs = true,
    searchProducts = true,
    searchServices = true,
    threshold = 0.7,
    limit = 5
  } = options;

  // Get knowledge base
  const knowledgeBase = await KnowledgeBaseRepository.getByBusinessId(businessId);
  if (!knowledgeBase) {
    throw new Error('Knowledge base not found');
  }

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Initialize results
  const results = {
    faqs: [] as Array<FAQ & { similarity: number }>,
    products: [] as Array<Product & { similarity: number }>,
    services: [] as Array<Service & { similarity: number }>
  };

  // Search FAQs
  if (searchFAQs && knowledgeBase.faqs.length > 0) {
    results.faqs = await searchFAQsWithEmbeddings(query, knowledgeBase.faqs, { threshold, limit });
  }

  // Search products
  if (searchProducts && knowledgeBase.products.length > 0) {
    results.products = await searchProductsWithEmbeddings(query, knowledgeBase.products, { threshold, limit });
  }

  // Search services
  if (searchServices && knowledgeBase.services.length > 0) {
    results.services = await searchServicesWithEmbeddings(query, knowledgeBase.services, { threshold, limit });
  }

  return results;
}

/**
 * Search FAQs with embeddings
 */
async function searchFAQsWithEmbeddings(
  query: string,
  faqs: FAQ[],
  options: { threshold?: number; limit?: number } = {}
): Promise<Array<FAQ & { similarity: number }>> {
  const { threshold = 0.7, limit = 5 } = options;

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Calculate similarity for each FAQ
  const results: Array<FAQ & { similarity: number }> = [];

  for (const faq of faqs) {
    // In a real implementation, we would pre-compute and store embeddings for FAQs
    // For this demo, we'll generate embeddings on the fly
    
    // Generate embedding for the FAQ question
    const faqEmbedding = await generateEmbedding(faq.question);
    
    // Calculate similarity
    const similarity = calculateCosineSimilarity(queryEmbedding, faqEmbedding);
    
    if (similarity >= threshold) {
      results.push({
        ...faq,
        similarity
      });
    }
  }

  // Sort by similarity (descending) and limit results
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Search products with embeddings
 */
async function searchProductsWithEmbeddings(
  query: string,
  products: Product[],
  options: { threshold?: number; limit?: number } = {}
): Promise<Array<Product & { similarity: number }>> {
  const { threshold = 0.7, limit = 5 } = options;

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Calculate similarity for each product
  const results: Array<Product & { similarity: number }> = [];

  for (const product of products) {
    // Create a combined text representation of the product
    const productText = `${product.name}. ${product.description}. Category: ${product.category}. Tags: ${product.tags.join(', ')}. ${JSON.stringify(product.attributes)}`;
    
    // Generate embedding for the product text
    const productEmbedding = await generateEmbedding(productText);
    
    // Calculate similarity
    const similarity = calculateCosineSimilarity(queryEmbedding, productEmbedding);
    
    if (similarity >= threshold) {
      results.push({
        ...product,
        similarity
      });
    }
  }

  // Sort by similarity (descending) and limit results
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Search services with embeddings
 */
async function searchServicesWithEmbeddings(
  query: string,
  services: Service[],
  options: { threshold?: number; limit?: number } = {}
): Promise<Array<Service & { similarity: number }>> {
  const { threshold = 0.7, limit = 5 } = options;

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Calculate similarity for each service
  const results: Array<Service & { similarity: number }> = [];

  for (const service of services) {
    // Create a combined text representation of the service
    const serviceText = `${service.name}. ${service.description}. Category: ${service.category}. Tags: ${service.tags.join(', ')}. ${JSON.stringify(service.attributes)}`;
    
    // Generate embedding for the service text
    const serviceEmbedding = await generateEmbedding(serviceText);
    
    // Calculate similarity
    const similarity = calculateCosineSimilarity(queryEmbedding, serviceEmbedding);
    
    if (similarity >= threshold) {
      results.push({
        ...service,
        similarity
      });
    }
  }

  // Sort by similarity (descending) and limit results
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Calculate cosine similarity between two embeddings
 */
function calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same dimensions');
  }
  
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Get business hours in a human-readable format
 */
export function getBusinessHoursText(businessInfo: BusinessInfo): string {
  if (!businessInfo.hours || businessInfo.hours.length === 0) {
    return 'Business hours not available.';
  }

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // Sort hours by day of week
  const sortedHours = [...businessInfo.hours].sort((a, b) => {
    return daysOfWeek.indexOf(a.day.toLowerCase()) - daysOfWeek.indexOf(b.day.toLowerCase());
  });

  // Format each day's hours
  const hoursText = sortedHours.map(h => {
    const day = h.day.charAt(0).toUpperCase() + h.day.slice(1);
    if (h.isClosed) {
      return `${day}: Closed`;
    }
    return `${day}: ${h.open} - ${h.close}`;
  }).join('\n');

  return hoursText;
}

/**
 * Get product information in a structured format
 */
export function getProductInfo(product: Product): string {
  let info = `Product: ${product.name}\n`;
  info += `Description: ${product.description}\n`;
  info += `Price: ${product.price} ${product.currency}\n`;
  info += `Category: ${product.category}\n`;
  
  if (product.tags && product.tags.length > 0) {
    info += `Tags: ${product.tags.join(', ')}\n`;
  }
  
  info += `In Stock: ${product.inStock ? 'Yes' : 'No'}\n`;
  
  if (product.attributes) {
    info += 'Attributes:\n';
    for (const [key, value] of Object.entries(product.attributes)) {
      info += `  ${key}: ${value}\n`;
    }
  }
  
  return info;
}

/**
 * Get service information in a structured format
 */
export function getServiceInfo(service: Service): string {
  let info = `Service: ${service.name}\n`;
  info += `Description: ${service.description}\n`;
  info += `Price: ${service.price} ${service.currency}\n`;
  
  if (service.duration) {
    info += `Duration: ${service.duration} minutes\n`;
  }
  
  info += `Category: ${service.category}\n`;
  
  if (service.tags && service.tags.length > 0) {
    info += `Tags: ${service.tags.join(', ')}\n`;
  }
  
  if (service.availability) {
    info += 'Availability:\n';
    service.availability.forEach(a => {
      const day = a.day.charAt(0).toUpperCase() + a.day.slice(1);
      if (a.isClosed) {
        info += `  ${day}: Closed\n`;
      } else {
        info += `  ${day}: ${a.open} - ${a.close}\n`;
      }
    });
  }
  
  if (service.attributes) {
    info += 'Additional Information:\n';
    for (const [key, value] of Object.entries(service.attributes)) {
      info += `  ${key}: ${value}\n`;
    }
  }
  
  return info;
}

/**
 * Get business contact information in a structured format
 */
export function getBusinessContactInfo(businessInfo: BusinessInfo): string {
  let info = `Business: ${businessInfo.name}\n`;
  
  if (businessInfo.contact) {
    if (businessInfo.contact.email) {
      info += `Email: ${businessInfo.contact.email}\n`;
    }
    
    if (businessInfo.contact.phone) {
      info += `Phone: ${businessInfo.contact.phone}\n`;
    }
    
    if (businessInfo.contact.address) {
      const address = businessInfo.contact.address;
      info += `Address: ${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}\n`;
    }
    
    if (businessInfo.contact.website) {
      info += `Website: ${businessInfo.contact.website}\n`;
    }
    
    if (businessInfo.contact.socialMedia) {
      info += 'Social Media:\n';
      for (const [platform, url] of Object.entries(businessInfo.contact.socialMedia)) {
        info += `  ${platform}: ${url}\n`;
      }
    }
  }
  
  return info;
}
