/**
 * AI Service
 *
 * This service handles interactions with AI models for the Customer Service Assistant.
 * It processes user messages, generates responses, and manages conversation context.
 *
 * Enhanced with advanced intent classification, entity extraction, and context management.
 */

import {
  ChatbotConfig,
  KnowledgeBase,
  Conversation,
  Message,
  FAQ
} from '@/models/chatbot';

// Import enhanced services
import { identifyIntent, extractEntities, Intent } from './intentClassificationService';
import { generateEmbedding, calculateSimilarity, findSimilarTexts } from './embeddingService';
import {
  searchKnowledgeBase,
  getBusinessHoursText,
  getProductInfo,
  getServiceInfo,
  getBusinessContactInfo
} from './enhancedKnowledgeBaseService';
import {
  detectLanguage,
  translateText,
  getLocalizedTemplates,
  formatLocalizedResponse,
  supportedLanguages
} from './languageService';
import {
  analyzeSentiment,
  classifyIntent,
  extractEntities as extractEntitiesEnhanced,
  generateEnhancedResponse,
  analyzeConversationQuality
} from './enhancedAiModelService';

// Use client-side repository for browser and server-side repository for server
const isServer = typeof window === 'undefined';

// Import repositories
let ChatbotConfigRepository, KnowledgeBaseRepository;

if (isServer) {
  // Server-side imports
  const serverRepo = require('@/repositories/chatbotRepositoryServer');
  ChatbotConfigRepository = serverRepo.ChatbotConfigRepository;
  KnowledgeBaseRepository = serverRepo.KnowledgeBaseRepository;
} else {
  // Client-side imports
  const clientRepo = require('@/repositories/chatbotRepository');
  ChatbotConfigRepository = clientRepo.ChatbotConfigRepository;
  KnowledgeBaseRepository = clientRepo.KnowledgeBaseRepository;
}

// Type for AI model response
interface AIResponse {
  text: string;
  confidence: number;
  intent?: string;
  entities?: Record<string, any>;
  suggestedActions?: string[];
  requiresHumanIntervention?: boolean;
}

// Type for conversation context
interface ConversationContext {
  conversationId: string;
  businessId: string;
  visitorInfo?: {
    name?: string;
    email?: string;
  };
  recentMessages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  identifiedIntents: string[];
  sessionData?: Record<string, any>;
  language?: {
    detected: string;
    preferred?: string;
    confidence: number;
  };
}

/**
 * Process a user message and generate an AI response
 *
 * Enhanced with advanced intent classification, entity extraction, and multi-language support
 */
export async function processMessage(
  businessId: string,
  conversationId: string,
  message: string,
  context?: ConversationContext
): Promise<AIResponse> {
  try {
    // Get chatbot configuration
    const config = await ChatbotConfigRepository.getByBusinessId(businessId);
    if (!config) {
      throw new Error('Chatbot configuration not found');
    }

    // Get knowledge base
    const knowledgeBase = await KnowledgeBaseRepository.getByBusinessId(businessId);
    if (!knowledgeBase) {
      throw new Error('Knowledge base not found');
    }

    // Detect language if not already detected
    let detectedLanguage = context?.language?.detected || 'en';
    let languageConfidence = context?.language?.confidence || 0;

    if (!context?.language || context.language.confidence < 0.7) {
      try {
        detectedLanguage = await detectLanguage(message);
        languageConfidence = 0.9; // Assume high confidence for now
        console.log(`Detected language: ${detectedLanguage}`);
      } catch (error) {
        console.error('Error detecting language:', error);
        // Default to English if detection fails
        detectedLanguage = 'en';
        languageConfidence = 0.5;
      }
    }

    // Get preferred language from context or use detected language
    const preferredLanguage = context?.language?.preferred || detectedLanguage;

    // Create or update conversation context
    const updatedContext = await updateConversationContext(
      businessId,
      conversationId,
      message,
      context,
      {
        detected: detectedLanguage,
        preferred: preferredLanguage,
        confidence: languageConfidence
      }
    );

    // Translate message to English for intent classification if needed
    let processedMessage = message;
    if (detectedLanguage !== 'en') {
      try {
        processedMessage = await translateText(message, 'en', detectedLanguage);
        console.log(`Translated message for processing: ${processedMessage}`);
      } catch (error) {
        console.error('Error translating message:', error);
        // Continue with original message if translation fails
        processedMessage = message;
      }
    }

    // Analyze sentiment
    let sentiment = { sentiment: 'neutral', score: 0 };
    try {
      sentiment = await analyzeSentiment(processedMessage);
      console.log('Analyzed sentiment:', sentiment);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }

    // Identify intent using enhanced classification
    console.log('Identifying intent for message:', processedMessage);
    const intentResult = await identifyIntent(processedMessage, knowledgeBase, updatedContext);
    console.log('Identified intent:', intentResult);

    // Extract additional entities if needed
    let entities = intentResult.entities || {};
    if (Object.keys(entities).length === 0) {
      entities = extractEntities(processedMessage, intentResult.name);
    }

    // Update context with identified intent, entities, and sentiment
    updatedContext.identifiedIntents.push(intentResult.name);
    updatedContext.sessionData = {
      ...updatedContext.sessionData,
      currentIntent: intentResult.name,
      intentConfidence: intentResult.confidence,
      sentiment: sentiment.sentiment,
      sentimentScore: sentiment.score,
      entities: {
        ...updatedContext.sessionData?.entities,
        ...entities
      }
    };

    // Generate response based on intent and context
    const response = await generateResponse(
      processedMessage,
      intentResult.name,
      knowledgeBase,
      config,
      updatedContext,
      entities
    );

    // Translate response back to user's language if needed
    let finalResponseText = response.text;
    if (preferredLanguage !== 'en' && response.text) {
      try {
        finalResponseText = await translateText(response.text, preferredLanguage, 'en');
        console.log(`Translated response to ${preferredLanguage}`);
      } catch (error) {
        console.error('Error translating response:', error);
        // Continue with English response if translation fails
        finalResponseText = response.text;
      }
    }

    // Add metadata to the response
    return {
      ...response,
      text: finalResponseText,
      intent: intentResult.name,
      entities,
      confidence: intentResult.confidence
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
      confidence: 0.5,
      requiresHumanIntervention: true
    };
  }
}

/**
 * Update the conversation context with the new message
 *
 * Enhanced with improved context management for multi-turn conversations and language support
 */
async function updateConversationContext(
  businessId: string,
  conversationId: string,
  message: string,
  existingContext?: ConversationContext,
  languageInfo?: {
    detected: string;
    preferred?: string;
    confidence: number;
  }
): Promise<ConversationContext> {
  // If context exists, update it
  if (existingContext) {
    // Add the new user message to recent messages
    const updatedMessages = [
      ...existingContext.recentMessages,
      { role: 'user', content: message }
    ];

    // Keep only the last 10 messages to avoid context getting too large
    const recentMessages = updatedMessages.slice(-10);

    // Analyze conversation state
    const conversationState = analyzeConversationState(recentMessages, existingContext.identifiedIntents);

    // Update language information if provided
    const updatedLanguage = languageInfo
      ? {
          detected: languageInfo.detected,
          preferred: languageInfo.preferred || existingContext.language?.preferred || languageInfo.detected,
          confidence: languageInfo.confidence
        }
      : existingContext.language;

    return {
      ...existingContext,
      recentMessages,
      language: updatedLanguage,
      sessionData: {
        ...existingContext.sessionData,
        conversationState,
        messageCount: (existingContext.sessionData?.messageCount || 0) + 1,
        lastMessageTimestamp: new Date().toISOString(),
        language: updatedLanguage?.detected || 'en'
      }
    };
  }

  // Get knowledge base for system message
  let systemMessage = 'You are a helpful customer service assistant.';
  try {
    const knowledgeBase = await KnowledgeBaseRepository.getByBusinessId(businessId);
    if (knowledgeBase && knowledgeBase.businessInfo) {
      systemMessage = `You are a helpful customer service assistant for ${knowledgeBase.businessInfo.name}, a business in the ${knowledgeBase.businessInfo.industry} industry. You help customers with questions about products, services, business hours, and other inquiries.`;
    }
  } catch (error) {
    console.error('Error getting knowledge base for system message:', error);
  }

  // Create new context if none exists
  return {
    conversationId,
    businessId,
    recentMessages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: message }
    ],
    identifiedIntents: [],
    language: languageInfo || {
      detected: 'en',
      preferred: 'en',
      confidence: 0.9
    },
    sessionData: {
      conversationState: 'greeting',
      messageCount: 1,
      startTimestamp: new Date().toISOString(),
      lastMessageTimestamp: new Date().toISOString(),
      userTimezone: getUserTimezone(),
      language: languageInfo?.detected || 'en',
      entities: {}
    }
  };
}

/**
 * Analyze the conversation state based on message history and intents
 */
function analyzeConversationState(
  messages: Array<{ role: string; content: string }>,
  identifiedIntents: string[]
): string {
  // If this is the first few messages, it's a greeting
  if (messages.length <= 3) {
    return 'greeting';
  }

  // Check the most recent intents
  const recentIntents = identifiedIntents.slice(-3);

  // If the user is asking for a human, it's escalation
  if (recentIntents.includes('human_handoff')) {
    return 'escalation';
  }

  // If there are multiple pricing or product intents, it's product exploration
  const productRelatedIntents = recentIntents.filter(
    intent => intent.includes('product') || intent.includes('pricing')
  );
  if (productRelatedIntents.length >= 2) {
    return 'product_exploration';
  }

  // If there are appointment intents, it's scheduling
  if (recentIntents.includes('appointment_scheduling') || recentIntents.includes('confirm_appointment')) {
    return 'scheduling';
  }

  // If there are multiple general inquiries, it might be confusion
  const generalInquiries = recentIntents.filter(intent => intent === 'general_inquiry');
  if (generalInquiries.length >= 3) {
    return 'confusion';
  }

  // Default to conversation
  return 'conversation';
}

/**
 * Get the user's timezone for context
 */
function getUserTimezone(): string {
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.error('Error getting timezone:', error);
    }
  }
  return 'UTC';
}

// Note: The identifyIntent function has been replaced by the imported version from intentClassificationService

/**
 * Find a matching FAQ for the user's message
 */
function findMatchingFAQ(message: string, faqs: FAQ[]): FAQ | null {
  // In a real implementation, this would use semantic search or embeddings
  // For this demo, we'll use simple string matching

  for (const faq of faqs) {
    const normalizedQuestion = faq.question.toLowerCase();

    // Check for exact matches or significant overlap
    if (message.includes(normalizedQuestion) ||
        normalizedQuestion.includes(message) ||
        calculateSimilarity(message, normalizedQuestion) > 0.7) {
      return faq;
    }

    // Check for keyword matches in the question
    const keywords = extractKeywords(normalizedQuestion);
    const matchingKeywords = keywords.filter(keyword => message.includes(keyword));

    if (matchingKeywords.length >= Math.ceil(keywords.length * 0.6)) {
      return faq;
    }
  }

  return null;
}

/**
 * Calculate similarity between two strings (simple implementation)
 */
function calculateSimilarity(str1: string, str2: string): number {
  // This is a very simple implementation
  // In a real app, you would use more sophisticated algorithms

  const words1 = str1.toLowerCase().split(/\W+/);
  const words2 = str2.toLowerCase().split(/\W+/);

  const commonWords = words1.filter(word => words2.includes(word));

  return commonWords.length / Math.max(words1.length, words2.length);
}

/**
 * Extract keywords from a string
 */
function extractKeywords(text: string): string[] {
  // Remove common stop words
  const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
                    'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by',
                    'about', 'against', 'between', 'into', 'through', 'during', 'before',
                    'after', 'above', 'below', 'from', 'up', 'down', 'of', 'off', 'over',
                    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
                    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
                    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
                    'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should',
                    'now', 'do', 'does', 'did', 'doing', 'i', 'you', 'he', 'she', 'it',
                    'we', 'they', 'their', 'this', 'that', 'these', 'those'];

  const words = text.toLowerCase().split(/\W+/).filter(word =>
    word.length > 2 && !stopWords.includes(word)
  );

  return [...new Set(words)]; // Remove duplicates
}

// Import OpenAI integration
import { generateChatCompletion } from './openaiIntegration';

/**
 * Generate a response based on intent and context
 *
 * Enhanced with entity awareness and improved context handling
 */
async function generateResponse(
  message: string,
  intent: string,
  knowledgeBase: KnowledgeBase,
  config: ChatbotConfig,
  context: ConversationContext,
  entities?: Record<string, any>
): Promise<AIResponse> {
  // Check if this is an FAQ intent
  if (intent.startsWith('faq_')) {
    const faqId = intent.replace('faq_', '');
    const faq = knowledgeBase.faqs.find(f => f.id === faqId);

    if (faq) {
      return {
        text: faq.answer,
        confidence: 0.95,
        intent,
        suggestedActions: ['Is there anything else I can help you with?']
      };
    }
  }

  // For human handoff intent, return immediately
  if (intent === 'human_handoff') {
    return {
      text: "I'll connect you with a human customer service representative right away. Please hold for a moment while I transfer you.",
      confidence: 0.95,
      intent,
      requiresHumanIntervention: true
    };
  }

  // For other intents, use OpenAI to generate a response
  try {
    // Prepare system message with business and knowledge base info
    const businessInfo = knowledgeBase.businessInfo;
    const conversationState = context.sessionData?.conversationState || 'conversation';
    const messageCount = context.sessionData?.messageCount || 1;

    // Format entities for the system message
    const entityInfo = entities && Object.keys(entities).length > 0
      ? `\nIdentified entities: ${JSON.stringify(entities)}`
      : '';

    // Format conversation state for the system message
    let stateGuidance = '';
    if (conversationState === 'greeting' && messageCount <= 2) {
      stateGuidance = '\nThis is the beginning of the conversation. Provide a warm welcome and offer assistance.';
    } else if (conversationState === 'confusion') {
      stateGuidance = '\nThe user seems confused. Try to clarify their needs and provide more direct guidance.';
    } else if (conversationState === 'product_exploration') {
      stateGuidance = '\nThe user is exploring products. Provide detailed information about products and suggest related items.';
    } else if (conversationState === 'scheduling') {
      stateGuidance = '\nThe user is trying to schedule an appointment. Help them find a suitable time and confirm the details.';
    } else if (conversationState === 'escalation') {
      stateGuidance = '\nThe user has requested human assistance. Acknowledge this and prepare for handoff.';
    }

    // Get relevant knowledge base information based on intent and entities
    let knowledgeBaseInfo = '';

    // Add business hours in a readable format
    const businessHours = getBusinessHoursText(businessInfo);

    // Add business contact information
    const contactInfo = getBusinessContactInfo(businessInfo);

    // Search knowledge base for relevant information based on intent and entities
    if (intent === 'product_information' && entities?.product) {
      try {
        // Search for products matching the entity
        const searchResults = await searchKnowledgeBase(
          entities.product,
          businessInfo.id,
          { searchFAQs: false, searchServices: false, threshold: 0.6, limit: 1 }
        );

        if (searchResults.products.length > 0) {
          const product = searchResults.products[0];
          knowledgeBaseInfo += `\n\nProduct Information:\n${getProductInfo(product)}`;
        }
      } catch (error) {
        console.error('Error searching knowledge base for product:', error);
      }
    } else if (intent === 'pricing' && entities?.product) {
      try {
        // Search for products matching the entity
        const searchResults = await searchKnowledgeBase(
          entities.product,
          businessInfo.id,
          { searchFAQs: false, searchServices: false, threshold: 0.6, limit: 1 }
        );

        if (searchResults.products.length > 0) {
          const product = searchResults.products[0];
          knowledgeBaseInfo += `\n\nProduct Pricing:\nThe ${product.name} costs ${product.price} ${product.currency}.`;
        }
      } catch (error) {
        console.error('Error searching knowledge base for product pricing:', error);
      }
    } else if (intent === 'appointment_scheduling') {
      try {
        // Search for services
        const searchResults = await searchKnowledgeBase(
          'appointment services',
          businessInfo.id,
          { searchFAQs: false, searchProducts: false, threshold: 0.6, limit: 3 }
        );

        if (searchResults.services.length > 0) {
          knowledgeBaseInfo += '\n\nAvailable Services for Appointments:';
          searchResults.services.forEach(service => {
            knowledgeBaseInfo += `\n- ${service.name}: ${service.price} ${service.currency}`;
            if (service.duration) {
              knowledgeBaseInfo += ` (${service.duration} minutes)`;
            }
          });
        }
      } catch (error) {
        console.error('Error searching knowledge base for services:', error);
      }
    }

    // Add relevant FAQs based on intent
    try {
      const searchResults = await searchKnowledgeBase(
        message,
        businessInfo.id,
        { searchProducts: false, searchServices: false, threshold: 0.75, limit: 2 }
      );

      if (searchResults.faqs.length > 0) {
        knowledgeBaseInfo += '\n\nRelevant FAQs:';
        searchResults.faqs.forEach(faq => {
          knowledgeBaseInfo += `\nQ: ${faq.question}\nA: ${faq.answer}`;
        });
      }
    } catch (error) {
      console.error('Error searching knowledge base for FAQs:', error);
    }

    const systemMessage = `You are a helpful customer service assistant for ${businessInfo.name}, a business in the ${businessInfo.industry} industry.

Business hours:\n${businessHours}

Contact Information:\n${contactInfo}

You have identified the user's intent as: ${intent}.${entityInfo}${stateGuidance}${knowledgeBaseInfo}

Respond in a helpful, friendly, and concise manner. If you don't know the answer, suggest the user speak with a human representative.`;

    // Prepare conversation history for context
    const messages = [
      { role: 'system', content: systemMessage },
      ...context.recentMessages
    ];

    // Get AI settings from config
    const aiSettings = config.aiSettings || {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 150,
      topP: 1
    };

    // Get sentiment from context
    const sentiment = context.sessionData?.sentiment || 'neutral';

    // Prepare context for enhanced response generation
    const enhancedContext = {
      conversationHistory: context.recentMessages,
      businessInfo: {
        name: businessInfo.name,
        industry: businessInfo.industry,
        description: businessInfo.description,
        hours: businessHours,
        contact: contactInfo
      },
      knowledgeBase: {
        faqs: knowledgeBase.faqs.slice(0, 5),
        products: knowledgeBase.products.slice(0, 3),
        services: knowledgeBase.services.slice(0, 3)
      },
      sentiment: sentiment as any,
      intent,
      entities
    };

    // Generate enhanced response
    const response = await generateEnhancedResponse(
      message,
      enhancedContext,
      {
        temperature: aiSettings.temperature,
        maxTokens: aiSettings.maxTokens,
        model: aiSettings.model === 'gpt-4' ? 'gpt-4o' : 'gpt-3.5-turbo'
      }
    );

    // For backward compatibility
    const responseObj = {
      text: response,
      usage: { total_tokens: 0 }
    };

    // Determine suggested actions based on intent, entities, and context
    let suggestedActions: string[] = [];
    const conversationState = context.sessionData?.conversationState || 'conversation';

    // Generate dynamic suggested actions based on context
    switch (intent) {
      case 'business_hours':
        suggestedActions = ['Do you need directions to our location?', 'Would you like to schedule an appointment?'];
        break;

      case 'return_policy':
        suggestedActions = ['Do you need to initiate a return?', 'Would you like information about our exchange policy?'];
        // If we're in a product context, add product-specific return question
        if (entities?.product || context.sessionData?.entities?.product) {
          const product = entities?.product || context.sessionData?.entities?.product;
          suggestedActions.unshift(`How do I return my ${product}?`);
        }
        break;

      case 'shipping_info':
        suggestedActions = ['Do you need to track an existing order?', 'Would you like to place a new order?'];
        // If we have an order number, add tracking question
        if (entities?.orderNumber) {
          suggestedActions.unshift(`Track order ${entities.orderNumber}`);
        }
        break;

      case 'pricing':
        suggestedActions = ['View our product catalog', 'Ask about current promotions'];
        // If we have a product entity, add product-specific questions
        if (entities?.product) {
          suggestedActions = [
            `What are the features of the ${entities.product}?`,
            `Do you have the ${entities.product} in different colors?`,
            `Is the ${entities.product} in stock?`
          ];
        }
        break;

      case 'appointment_scheduling':
        // If we have date/time entities, suggest confirmation
        if (entities?.date || entities?.time) {
          const date = entities?.date || 'the selected date';
          const time = entities?.time || 'the selected time';
          suggestedActions = [
            `Confirm appointment for ${date} at ${time}`,
            'Choose a different time',
            'What services do you offer?'
          ];
        } else {
          suggestedActions = [
            'View available times',
            'Learn about our services',
            'What information do you need from me?'
          ];
        }
        break;

      case 'product_information':
        // If we have a product entity, add product-specific questions
        if (entities?.product) {
          suggestedActions = [
            `What is the price of the ${entities.product}?`,
            `Is the ${entities.product} in stock?`,
            `Do you have alternatives to the ${entities.product}?`
          ];
        } else {
          suggestedActions = [
            'What are your most popular products?',
            'Do you offer any discounts?',
            'I'm looking for something specific'
          ];
        }
        break;

      case 'general_inquiry':
      default:
        // Adjust based on conversation state
        if (conversationState === 'greeting') {
          suggestedActions = [
            'Tell me about your products',
            'What are your business hours?',
            'How can I contact you?'
          ];
        } else if (conversationState === 'confusion') {
          suggestedActions = [
            'I need help with a specific product',
            'I want to speak with a human',
            'Let me start over'
          ];
        } else if (conversationState === 'product_exploration') {
          suggestedActions = [
            'Show me your best sellers',
            'What's on sale?',
            'I need help finding a specific item'
          ];
        } else {
          suggestedActions = [
            'Tell me about your products',
            'What are your business hours?',
            'I need help with a return',
            'I want to schedule an appointment'
          ];
        }
        break;
    }

    return {
      text: responseObj.text,
      confidence: 0.85, // Confidence based on enhanced AI model
      intent,
      suggestedActions
    };
  } catch (error) {
    console.error('Error generating response with OpenAI:', error);

    // Fallback to predefined responses if OpenAI fails
    switch (intent) {
      case 'business_hours':
        return {
          text: "We are open Monday to Friday from 9 AM to 5 PM, and Saturday from 10 AM to 2 PM. We are closed on Sundays.",
          confidence: 0.9,
          intent,
          suggestedActions: ['Do you need directions to our location?', 'Would you like to schedule an appointment?']
        };

      case 'return_policy':
        return {
          text: "We accept returns within 30 days of purchase. Items must be unused and in original packaging. For standard returns, customers are responsible for return shipping costs. However, if you received a defective item, we'll provide a prepaid shipping label.",
          confidence: 0.9,
          intent,
          suggestedActions: ['Do you need to initiate a return?', 'Would you like information about our exchange policy?']
        };

      case 'shipping_info':
        return {
          text: "We offer standard shipping (3-5 business days), expedited shipping (2-3 business days), and overnight shipping. Free standard shipping is available on all orders over $50 within the continental United States.",
          confidence: 0.9,
          intent,
          suggestedActions: ['Do you need to track an existing order?', 'Would you like to place a new order?']
        };

      case 'pricing':
        return {
          text: "Our pricing varies by product. Is there a specific item you're interested in?",
          confidence: 0.8,
          intent,
          entities: { needsProductInfo: true },
          suggestedActions: ['View our product catalog', 'Ask about current promotions']
        };

      case 'appointment_scheduling':
        return {
          text: "I'd be happy to help you schedule an appointment. What day and time works best for you?",
          confidence: 0.85,
          intent,
          entities: { needsAppointmentInfo: true },
          suggestedActions: ['View available times', 'Learn about our services']
        };

      case 'general_inquiry':
      default:
        return {
          text: "Thank you for your message. How can I assist you today? I can help with information about our products, services, business hours, shipping, returns, or scheduling an appointment.",
          confidence: 0.7,
          intent: 'general_inquiry',
          suggestedActions: [
            'Tell me about your products',
            'What are your business hours?',
            'I need help with a return',
            'I want to schedule an appointment'
          ]
        };
    }
  }
}

/**
 * Generate a welcome message for a new conversation
 */
export async function generateWelcomeMessage(businessId: string): Promise<string> {
  try {
    const config = await ChatbotConfigRepository.getByBusinessId(businessId);

    if (config && config.welcomeMessage) {
      return config.welcomeMessage;
    }

    // Default welcome message
    return "Hello! Welcome to our customer service chat. How can I assist you today?";
  } catch (error) {
    console.error('Error generating welcome message:', error);
    return "Hello! How can I help you today?";
  }
}

/**
 * Generate a fallback message when the AI is uncertain
 */
export async function generateFallbackMessage(businessId: string): Promise<string> {
  try {
    const config = await ChatbotConfigRepository.getByBusinessId(businessId);

    if (config && config.fallbackMessage) {
      return config.fallbackMessage;
    }

    // Default fallback message
    return "I'm sorry, I didn't quite understand that. Could you please rephrase your question?";
  } catch (error) {
    console.error('Error generating fallback message:', error);
    return "I'm sorry, I didn't understand that. Could you try again?";
  }
}

/**
 * Check if the chatbot should transfer to a human agent
 */
export function shouldTransferToHuman(response: AIResponse): boolean {
  // Transfer if confidence is too low or if the AI explicitly recommends it
  return response.confidence < 0.4 || response.requiresHumanIntervention === true;
}
