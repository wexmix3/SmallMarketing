/**
 * Intent Classification Service
 * 
 * This service provides advanced intent classification for the AI Customer Service Assistant.
 * It uses a combination of techniques to identify the user's intent:
 * 1. Keyword matching for common intents
 * 2. FAQ matching using semantic similarity
 * 3. Fallback to general intent classification
 */

import { KnowledgeBase, FAQ } from '@/models/chatbot';
import { generateEmbedding } from './embeddingService';

// Define intent types
export interface Intent {
  name: string;
  confidence: number;
  entities?: Record<string, any>;
  metadata?: Record<string, any>;
}

// Define intent patterns
interface IntentPattern {
  intent: string;
  patterns: string[];
  extractEntities?: (message: string) => Record<string, any>;
}

// Common intent patterns
const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: 'business_hours',
    patterns: ['hour', 'open', 'close', 'when are you open', 'opening time', 'closing time', 'schedule']
  },
  {
    intent: 'return_policy',
    patterns: ['return', 'refund', 'money back', 'exchange', 'send back', 'return policy']
  },
  {
    intent: 'shipping_info',
    patterns: ['ship', 'delivery', 'shipping', 'deliver', 'how long', 'when will', 'tracking', 'shipped']
  },
  {
    intent: 'pricing',
    patterns: ['price', 'cost', 'how much', 'pricing', 'discount', 'offer', 'deal', 'sale'],
    extractEntities: (message: string) => {
      // Extract product mentions
      const productRegex = /(?:price|cost|how much|pricing) (?:of|for|on) (?:the|your|a)? ?(.+?)(?:\?|$|\s)/i;
      const match = message.match(productRegex);
      return match ? { product: match[1].trim() } : {};
    }
  },
  {
    intent: 'appointment_scheduling',
    patterns: ['appointment', 'schedule', 'book', 'reserve', 'consultation', 'meeting', 'slot'],
    extractEntities: (message: string) => {
      // Extract date and time mentions
      const dateRegex = /(?:on|for) (?:the)? ?(\d{1,2}(?:st|nd|rd|th)? (?:of)? (?:january|february|march|april|may|june|july|august|september|october|november|december)|tomorrow|next (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)|(?:this|next) week)/i;
      const timeRegex = /(?:at|around|by) (\d{1,2}(?::\d{2})? ?(?:am|pm)?)/i;
      
      const entities: Record<string, any> = {};
      
      const dateMatch = message.match(dateRegex);
      if (dateMatch) {
        entities.date = dateMatch[1];
      }
      
      const timeMatch = message.match(timeRegex);
      if (timeMatch) {
        entities.time = timeMatch[1];
      }
      
      return entities;
    }
  },
  {
    intent: 'human_handoff',
    patterns: ['speak to human', 'talk to person', 'real person', 'agent', 'representative', 'speak to someone', 'human agent', 'manager']
  },
  {
    intent: 'product_information',
    patterns: ['product', 'item', 'tell me about', 'information on', 'details about', 'specs', 'features'],
    extractEntities: (message: string) => {
      // Extract product mentions
      const productRegex = /(?:about|on|regarding|for) (?:the|your|a)? ?(.+?)(?:\?|$|\s)/i;
      const match = message.match(productRegex);
      return match ? { product: match[1].trim() } : {};
    }
  },
  {
    intent: 'order_status',
    patterns: ['order status', 'my order', 'track order', 'where is my order', 'package', 'delivery status'],
    extractEntities: (message: string) => {
      // Extract order number mentions
      const orderRegex = /order (?:number|#)? ?([A-Za-z0-9-]+)/i;
      const match = message.match(orderRegex);
      return match ? { orderNumber: match[1] } : {};
    }
  },
  {
    intent: 'contact_info',
    patterns: ['contact', 'email', 'phone', 'address', 'location', 'reach you', 'call you']
  },
  {
    intent: 'gratitude',
    patterns: ['thank', 'thanks', 'appreciate', 'grateful', 'awesome', 'great', 'helpful']
  },
  {
    intent: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings']
  },
  {
    intent: 'farewell',
    patterns: ['bye', 'goodbye', 'see you', 'talk to you later', 'have a good day', 'have a nice day', 'until next time']
  }
];

/**
 * Identify the intent of a user message
 */
export async function identifyIntent(
  message: string,
  knowledgeBase: KnowledgeBase,
  conversationContext?: any
): Promise<Intent> {
  const normalizedMessage = message.toLowerCase();
  
  // Check for exact intent matches first (highest confidence)
  const exactMatch = findExactIntentMatch(normalizedMessage);
  if (exactMatch && exactMatch.confidence > 0.9) {
    return exactMatch;
  }
  
  // Check if the message matches any FAQ (high confidence)
  const faqMatch = await findMatchingFAQ(normalizedMessage, knowledgeBase.faqs);
  if (faqMatch) {
    return {
      name: `faq_${faqMatch.id}`,
      confidence: faqMatch.confidence,
      metadata: { faqId: faqMatch.id }
    };
  }
  
  // Use pattern matching for common intents (medium confidence)
  const patternMatch = findPatternMatch(normalizedMessage);
  if (patternMatch && patternMatch.confidence > 0.7) {
    return patternMatch;
  }
  
  // Consider conversation context for multi-turn intents
  if (conversationContext && conversationContext.recentIntents && conversationContext.recentIntents.length > 0) {
    const contextualIntent = inferFromContext(normalizedMessage, conversationContext);
    if (contextualIntent && contextualIntent.confidence > 0.6) {
      return contextualIntent;
    }
  }
  
  // Fallback to general inquiry with low confidence
  return {
    name: 'general_inquiry',
    confidence: 0.5
  };
}

/**
 * Find exact matches for intents based on specific phrases
 */
function findExactIntentMatch(message: string): Intent | null {
  // Exact matches for specific intents
  const exactMatches: Record<string, string[]> = {
    'business_hours': [
      'what are your hours',
      'when are you open',
      'what time do you open',
      'what time do you close',
      'are you open today',
      'business hours'
    ],
    'human_handoff': [
      'i want to speak to a human',
      'connect me with an agent',
      'talk to a representative',
      'speak to a person',
      'i need a human'
    ],
    'greeting': [
      'hello',
      'hi there',
      'hey',
      'good morning',
      'good afternoon',
      'good evening'
    ]
  };
  
  for (const [intent, phrases] of Object.entries(exactMatches)) {
    if (phrases.some(phrase => message.includes(phrase))) {
      return {
        name: intent,
        confidence: 0.95
      };
    }
  }
  
  return null;
}

/**
 * Find pattern matches for intents based on keywords
 */
function findPatternMatch(message: string): Intent | null {
  let bestMatch: Intent | null = null;
  let highestScore = 0;
  
  for (const pattern of INTENT_PATTERNS) {
    // Calculate how many pattern keywords are in the message
    const matchingPatterns = pattern.patterns.filter(p => message.includes(p));
    const score = matchingPatterns.length / pattern.patterns.length;
    
    if (score > 0 && score > highestScore) {
      highestScore = score;
      
      // Extract entities if available
      const entities = pattern.extractEntities ? pattern.extractEntities(message) : {};
      
      bestMatch = {
        name: pattern.intent,
        confidence: 0.5 + (score * 0.4), // Scale confidence between 0.5 and 0.9
        entities
      };
    }
  }
  
  return bestMatch;
}

/**
 * Find a matching FAQ for the user's message using semantic similarity
 */
async function findMatchingFAQ(message: string, faqs: FAQ[]): Promise<{ id: string; confidence: number } | null> {
  if (faqs.length === 0) {
    return null;
  }
  
  try {
    // Generate embedding for the user message
    const messageEmbedding = await generateEmbedding(message);
    
    // Find the FAQ with the highest similarity
    let bestMatch: { id: string; similarity: number } | null = null;
    
    for (const faq of faqs) {
      // In a real implementation, we would pre-compute and store embeddings for FAQs
      // For this demo, we'll use a simplified approach
      const faqEmbedding = await generateEmbedding(faq.question);
      
      // Calculate cosine similarity
      const similarity = calculateCosineSimilarity(messageEmbedding, faqEmbedding);
      
      if (similarity > 0.7 && (!bestMatch || similarity > bestMatch.similarity)) {
        bestMatch = {
          id: faq.id,
          similarity
        };
      }
    }
    
    if (bestMatch) {
      return {
        id: bestMatch.id,
        confidence: bestMatch.similarity
      };
    }
  } catch (error) {
    console.error('Error finding matching FAQ:', error);
  }
  
  return null;
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
 * Infer intent from conversation context
 */
function inferFromContext(message: string, context: any): Intent | null {
  const recentIntents = context.recentIntents || [];
  
  if (recentIntents.length === 0) {
    return null;
  }
  
  const lastIntent = recentIntents[recentIntents.length - 1];
  
  // Handle follow-up questions based on previous intent
  switch (lastIntent) {
    case 'pricing':
      // If previous intent was about pricing and user responds with a product
      if (message.length < 30 && !message.includes('?')) {
        return {
          name: 'product_pricing',
          confidence: 0.75,
          entities: { product: message.trim() }
        };
      }
      break;
      
    case 'appointment_scheduling':
      // If previous intent was about scheduling and user responds with a date/time
      if (message.match(/\d{1,2}(?::\d{2})? ?(?:am|pm)?/) || 
          message.match(/(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)/) ||
          message.match(/tomorrow|next week/)) {
        return {
          name: 'confirm_appointment',
          confidence: 0.8,
          entities: { dateTime: message.trim() }
        };
      }
      break;
      
    case 'product_information':
      // If previous intent was about products and user asks a follow-up
      if (message.includes('how much') || message.includes('price') || message.includes('cost')) {
        return {
          name: 'product_pricing',
          confidence: 0.75,
          entities: { product: context.entities?.product }
        };
      }
      break;
  }
  
  return null;
}

/**
 * Extract entities from a message
 */
export function extractEntities(message: string, intent: string): Record<string, any> {
  const pattern = INTENT_PATTERNS.find(p => p.intent === intent);
  
  if (pattern && pattern.extractEntities) {
    return pattern.extractEntities(message);
  }
  
  return {};
}
