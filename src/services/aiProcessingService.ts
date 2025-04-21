/**
 * AI Processing Service
 * 
 * This service handles natural language understanding and response generation
 * for the AI Customer Service Assistant.
 */

import axios from 'axios';
import { KnowledgeBaseService } from './knowledgeBaseService';
import { ConversationContext, Message, AIResponse, Intent } from '../types/chatbot';

export class AIProcessingService {
  private apiKey: string;
  private knowledgeBaseService: KnowledgeBaseService;
  private model: string = 'gpt-3.5-turbo'; // Default model
  
  constructor(apiKey: string, knowledgeBaseService: KnowledgeBaseService) {
    this.apiKey = apiKey;
    this.knowledgeBaseService = knowledgeBaseService;
  }
  
  /**
   * Process a user message and generate a response
   */
  async processMessage(
    businessId: string,
    message: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    try {
      // 1. Identify intent
      const intent = await this.identifyIntent(message, businessId);
      
      // 2. Check if we have a direct FAQ match
      if (intent.type === 'faq' && intent.confidence > 0.8) {
        const faq = await this.knowledgeBaseService.getFAQById(businessId, intent.entityId);
        if (faq) {
          return {
            text: faq.answer,
            intent: intent,
            confidence: intent.confidence,
            source: 'faq',
            requiresHumanIntervention: false,
            suggestedActions: []
          };
        }
      }
      
      // 3. Generate response using AI if no direct match or confidence is low
      return await this.generateAIResponse(message, businessId, context, intent);
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        intent: { type: 'error', confidence: 0 },
        confidence: 0,
        source: 'fallback',
        requiresHumanIntervention: true,
        suggestedActions: []
      };
    }
  }
  
  /**
   * Identify the intent of a user message
   */
  private async identifyIntent(message: string, businessId: string): Promise<Intent> {
    // 1. Check for FAQ matches
    const faqs = await this.knowledgeBaseService.getAllFAQs(businessId);
    const faqMatch = this.findBestFAQMatch(message, faqs);
    
    if (faqMatch && faqMatch.score > 0.8) {
      return {
        type: 'faq',
        confidence: faqMatch.score,
        entityId: faqMatch.faq.id
      };
    }
    
    // 2. Check for business information intent
    const businessInfoIntents = [
      { keywords: ['hour', 'open', 'close', 'time'], type: 'business_hours' },
      { keywords: ['location', 'address', 'where', 'find'], type: 'business_location' },
      { keywords: ['contact', 'phone', 'email', 'reach'], type: 'contact_info' },
      { keywords: ['price', 'cost', 'fee', 'charge'], type: 'pricing' },
      { keywords: ['appointment', 'schedule', 'book', 'reserve'], type: 'appointment' },
      { keywords: ['product', 'item', 'sell', 'purchase'], type: 'products' },
      { keywords: ['service', 'offer', 'provide'], type: 'services' }
    ];
    
    const normalizedMessage = message.toLowerCase();
    
    for (const intent of businessInfoIntents) {
      const matchCount = intent.keywords.filter(keyword => 
        normalizedMessage.includes(keyword)
      ).length;
      
      const confidence = matchCount / intent.keywords.length;
      
      if (confidence > 0.5) {
        return {
          type: intent.type,
          confidence: confidence
        };
      }
    }
    
    // 3. Check for human handoff intent
    const humanHandoffKeywords = ['human', 'agent', 'person', 'representative', 'speak', 'talk'];
    const humanHandoffCount = humanHandoffKeywords.filter(keyword => 
      normalizedMessage.includes(keyword)
    ).length;
    
    if (humanHandoffCount >= 2) {
      return {
        type: 'human_handoff',
        confidence: 0.9
      };
    }
    
    // 4. Default to general inquiry
    return {
      type: 'general_inquiry',
      confidence: 0.3
    };
  }
  
  /**
   * Find the best matching FAQ for a user message
   */
  private findBestFAQMatch(message: string, faqs: any[]): { faq: any, score: number } | null {
    if (!faqs || faqs.length === 0) {
      return null;
    }
    
    const normalizedMessage = message.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;
    
    for (const faq of faqs) {
      const normalizedQuestion = faq.question.toLowerCase();
      
      // Simple similarity calculation
      const score = this.calculateSimilarity(normalizedMessage, normalizedQuestion);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }
    
    return bestMatch ? { faq: bestMatch, score: bestScore } : null;
  }
  
  /**
   * Calculate similarity between two strings (simple implementation)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(/\W+/).filter(word => word.length > 2);
    const words2 = str2.split(/\W+/).filter(word => word.length > 2);
    
    if (words1.length === 0 || words2.length === 0) {
      return 0;
    }
    
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }
  
  /**
   * Generate a response using AI
   */
  private async generateAIResponse(
    message: string,
    businessId: string,
    context: ConversationContext,
    intent: Intent
  ): Promise<AIResponse> {
    try {
      // 1. Get business information
      const businessInfo = await this.knowledgeBaseService.getBusinessInfo(businessId);
      
      // 2. Prepare conversation history
      const conversationHistory = context.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // 3. Prepare system message with business context
      const systemMessage = {
        role: 'system',
        content: `You are an AI customer service assistant for ${businessInfo.name}, a ${businessInfo.industry} business. 
        Your goal is to be helpful, friendly, and provide accurate information about the business.
        
        Business Information:
        - Name: ${businessInfo.name}
        - Description: ${businessInfo.description}
        - Hours: ${JSON.stringify(businessInfo.hours)}
        - Contact: ${JSON.stringify(businessInfo.contact)}
        
        If you don't know the answer to a question, don't make up information. Instead, offer to connect the customer with a human representative.
        Keep your responses concise and friendly.`
      };
      
      // 4. Call OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.model,
          messages: [systemMessage, ...conversationHistory, { role: 'user', content: message }],
          temperature: 0.7,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // 5. Process the response
      const aiText = response.data.choices[0].message.content.trim();
      
      // 6. Determine if human intervention is needed
      const requiresHumanIntervention = 
        intent.type === 'human_handoff' || 
        intent.confidence < 0.3 ||
        aiText.toLowerCase().includes("i don't know") ||
        aiText.toLowerCase().includes("i'm not sure");
      
      // 7. Generate suggested actions based on intent
      const suggestedActions = this.generateSuggestedActions(intent, businessInfo);
      
      return {
        text: aiText,
        intent: intent,
        confidence: response.data.choices[0].finish_reason === 'stop' ? 0.8 : 0.5,
        source: 'ai',
        requiresHumanIntervention,
        suggestedActions
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response
      return {
        text: "I'm sorry, I couldn't generate a response at the moment. Would you like to speak with a human representative?",
        intent: intent,
        confidence: 0.1,
        source: 'fallback',
        requiresHumanIntervention: true,
        suggestedActions: [
          { text: "Yes, connect me with a representative", value: "human_handoff" },
          { text: "No, I'll try again later", value: "end_conversation" }
        ]
      };
    }
  }
  
  /**
   * Generate suggested actions based on intent and business info
   */
  private generateSuggestedActions(intent: Intent, businessInfo: any): Array<{ text: string, value: string }> {
    switch (intent.type) {
      case 'business_hours':
        return [
          { text: "Do you need directions to our location?", value: "business_location" },
          { text: "Would you like to schedule an appointment?", value: "appointment" }
        ];
        
      case 'business_location':
        return [
          { text: "Get directions", value: "get_directions" },
          { text: "What are your business hours?", value: "business_hours" }
        ];
        
      case 'pricing':
        return [
          { text: "Tell me about your services", value: "services" },
          { text: "I'd like to make an appointment", value: "appointment" }
        ];
        
      case 'appointment':
        return [
          { text: "View available times", value: "view_availability" },
          { text: "Call the business directly", value: "contact_phone" }
        ];
        
      case 'products':
      case 'services':
        return [
          { text: "What are your most popular options?", value: "popular_items" },
          { text: "What are your prices?", value: "pricing" }
        ];
        
      case 'contact_info':
        return [
          { text: "Call now", value: "call_business" },
          { text: "Send email", value: "email_business" }
        ];
        
      case 'human_handoff':
        return [
          { text: "Leave a message", value: "leave_message" },
          { text: "Try again later", value: "end_conversation" }
        ];
        
      default:
        return [
          { text: "Tell me about your business", value: "business_info" },
          { text: "What services do you offer?", value: "services" },
          { text: "How can I contact you?", value: "contact_info" }
        ];
    }
  }
  
  /**
   * Set the AI model to use
   */
  setModel(model: string): void {
    this.model = model;
  }
}
