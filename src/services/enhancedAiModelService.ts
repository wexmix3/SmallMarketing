/**
 * Enhanced AI Model Service
 * 
 * This service provides advanced AI capabilities including sentiment analysis,
 * improved intent classification, and better handling of complex queries.
 */

import { openai } from './openaiService';
import { generateEmbedding } from './embeddingService';

// Define sentiment types
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'mixed';

// Define sentiment analysis result
export interface SentimentAnalysisResult {
  sentiment: Sentiment;
  score: number;
  explanation?: string;
}

// Define intent classification result with confidence
export interface IntentClassificationResult {
  intent: string;
  confidence: number;
  subIntents?: Array<{
    intent: string;
    confidence: number;
  }>;
}

// Define entity extraction result
export interface EntityExtractionResult {
  entities: Record<string, any>;
  confidence: Record<string, number>;
}

/**
 * Analyze sentiment of a text
 * 
 * @param text - The text to analyze
 * @param detailed - Whether to include detailed explanation
 * @returns The sentiment analysis result
 */
export async function analyzeSentiment(
  text: string,
  detailed: boolean = false
): Promise<SentimentAnalysisResult> {
  try {
    // Use OpenAI for sentiment analysis
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a sentiment analysis system. Analyze the sentiment of the text and respond with a JSON object containing:
          - sentiment: one of "positive", "neutral", "negative", or "mixed"
          - score: a number between -1 and 1 where -1 is very negative, 0 is neutral, and 1 is very positive
          ${detailed ? '- explanation: a brief explanation of the sentiment analysis' : ''}
          
          Only respond with the JSON object, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });
    
    // Parse the response
    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      sentiment: result.sentiment || 'neutral',
      score: result.score || 0,
      explanation: detailed ? result.explanation : undefined
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    
    // Return neutral sentiment if analysis fails
    return {
      sentiment: 'neutral',
      score: 0
    };
  }
}

/**
 * Classify intent with improved accuracy
 * 
 * @param text - The text to classify
 * @param intents - Array of possible intents
 * @param examples - Examples for each intent
 * @returns The intent classification result
 */
export async function classifyIntent(
  text: string,
  intents: string[],
  examples: Record<string, string[]>
): Promise<IntentClassificationResult> {
  try {
    // Generate embedding for the text
    const textEmbedding = await generateEmbedding(text);
    
    // Calculate similarity scores for each intent
    const scores: Record<string, number> = {};
    
    for (const intent of intents) {
      const intentExamples = examples[intent] || [];
      
      if (intentExamples.length === 0) {
        scores[intent] = 0;
        continue;
      }
      
      // Generate embeddings for each example
      const exampleEmbeddings = await Promise.all(
        intentExamples.map(example => generateEmbedding(example))
      );
      
      // Calculate average similarity
      let totalSimilarity = 0;
      
      for (const exampleEmbedding of exampleEmbeddings) {
        // Calculate cosine similarity
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;
        
        for (let i = 0; i < textEmbedding.length; i++) {
          dotProduct += textEmbedding[i] * exampleEmbedding[i];
          magnitude1 += textEmbedding[i] * textEmbedding[i];
          magnitude2 += exampleEmbedding[i] * exampleEmbedding[i];
        }
        
        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);
        
        const similarity = dotProduct / (magnitude1 * magnitude2);
        totalSimilarity += similarity;
      }
      
      scores[intent] = totalSimilarity / exampleEmbeddings.length;
    }
    
    // Find the intent with the highest score
    let maxIntent = intents[0];
    let maxScore = scores[maxIntent] || 0;
    
    for (const intent of intents) {
      if (scores[intent] > maxScore) {
        maxIntent = intent;
        maxScore = scores[intent];
      }
    }
    
    // Find sub-intents (other intents with high scores)
    const subIntents = intents
      .filter(intent => intent !== maxIntent && scores[intent] > 0.7)
      .map(intent => ({
        intent,
        confidence: scores[intent]
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
    
    return {
      intent: maxIntent,
      confidence: maxScore,
      subIntents: subIntents.length > 0 ? subIntents : undefined
    };
  } catch (error) {
    console.error('Intent classification error:', error);
    
    // Return default intent if classification fails
    return {
      intent: 'general_inquiry',
      confidence: 0.5
    };
  }
}

/**
 * Extract entities with improved accuracy
 * 
 * @param text - The text to extract entities from
 * @param entityTypes - Types of entities to extract
 * @returns The entity extraction result
 */
export async function extractEntities(
  text: string,
  entityTypes: string[]
): Promise<EntityExtractionResult> {
  try {
    // Use OpenAI for entity extraction
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an entity extraction system. Extract the following entity types from the text: ${entityTypes.join(', ')}.
          
          Respond with a JSON object where:
          - The keys are the entity types
          - The values are the extracted entities
          - Include a "confidence" object with the same keys and confidence scores (0-1) as values
          
          Only respond with the JSON object, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });
    
    // Parse the response
    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Extract entities and confidence scores
    const entities: Record<string, any> = {};
    const confidence: Record<string, number> = {};
    
    for (const entityType of entityTypes) {
      if (result[entityType] !== undefined) {
        entities[entityType] = result[entityType];
        confidence[entityType] = result.confidence?.[entityType] || 0.5;
      }
    }
    
    return {
      entities,
      confidence
    };
  } catch (error) {
    console.error('Entity extraction error:', error);
    
    // Return empty entities if extraction fails
    return {
      entities: {},
      confidence: {}
    };
  }
}

/**
 * Generate a response with improved context handling
 * 
 * @param prompt - The prompt for response generation
 * @param context - Additional context for the response
 * @param options - Generation options
 * @returns The generated response
 */
export async function generateEnhancedResponse(
  prompt: string,
  context: {
    conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    businessInfo?: Record<string, any>;
    knowledgeBase?: Record<string, any>;
    sentiment?: Sentiment;
    intent?: string;
    entities?: Record<string, any>;
  },
  options: {
    temperature?: number;
    maxTokens?: number;
    model?: 'gpt-3.5-turbo' | 'gpt-4o';
  } = {}
): Promise<string> {
  try {
    const {
      temperature = 0.7,
      maxTokens = 500,
      model = 'gpt-4o'
    } = options;
    
    // Prepare system message with context
    let systemMessage = 'You are a helpful customer service assistant.';
    
    if (context.businessInfo) {
      systemMessage += `\n\nBusiness Information:\n${JSON.stringify(context.businessInfo, null, 2)}`;
    }
    
    if (context.intent) {
      systemMessage += `\n\nIdentified Intent: ${context.intent}`;
    }
    
    if (context.entities && Object.keys(context.entities).length > 0) {
      systemMessage += `\n\nIdentified Entities:\n${JSON.stringify(context.entities, null, 2)}`;
    }
    
    if (context.sentiment) {
      systemMessage += `\n\nUser Sentiment: ${context.sentiment}`;
      
      // Add guidance based on sentiment
      if (context.sentiment === 'negative') {
        systemMessage += '\nThe user seems upset. Be empathetic and focus on resolving their issue.';
      } else if (context.sentiment === 'positive') {
        systemMessage += '\nThe user seems happy. Maintain the positive tone in your response.';
      } else if (context.sentiment === 'mixed') {
        systemMessage += '\nThe user has mixed feelings. Address both positive and negative aspects in your response.';
      }
    }
    
    if (context.knowledgeBase) {
      systemMessage += '\n\nRelevant Knowledge Base Information:';
      
      if (context.knowledgeBase.faqs) {
        systemMessage += '\n\nFAQs:';
        for (const faq of context.knowledgeBase.faqs) {
          systemMessage += `\nQ: ${faq.question}\nA: ${faq.answer}\n`;
        }
      }
      
      if (context.knowledgeBase.products) {
        systemMessage += '\n\nProducts:';
        for (const product of context.knowledgeBase.products) {
          systemMessage += `\n- ${product.name}: ${product.description}`;
        }
      }
      
      if (context.knowledgeBase.services) {
        systemMessage += '\n\nServices:';
        for (const service of context.knowledgeBase.services) {
          systemMessage += `\n- ${service.name}: ${service.description}`;
        }
      }
    }
    
    // Prepare messages
    const messages = [
      {
        role: 'system',
        content: systemMessage
      },
      ...context.conversationHistory,
      {
        role: 'user',
        content: prompt
      }
    ];
    
    // Generate response
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    });
    
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Response generation error:', error);
    return 'I apologize, but I\'m having trouble generating a response right now. Please try again later.';
  }
}

/**
 * Analyze conversation quality
 * 
 * @param conversation - The conversation to analyze
 * @returns The quality analysis result
 */
export async function analyzeConversationQuality(
  conversation: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<{
  score: number;
  metrics: Record<string, number>;
  suggestions: string[];
}> {
  try {
    // Use OpenAI for conversation quality analysis
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a conversation quality analysis system. Analyze the conversation and respond with a JSON object containing:
          - score: an overall quality score between 0 and 1
          - metrics: an object with specific metrics (each between 0 and 1):
            - helpfulness: how helpful the assistant's responses were
            - clarity: how clear the assistant's responses were
            - empathy: how empathetic the assistant was
            - efficiency: how efficiently the assistant addressed the user's needs
            - accuracy: how accurate the assistant's information was
          - suggestions: an array of suggestions for improvement
          
          Only respond with the JSON object, nothing else.`
        },
        {
          role: 'user',
          content: `Analyze this conversation:\n\n${conversation.map(msg => `${msg.role}: ${msg.content}`).join('\n\n')}`
        }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });
    
    // Parse the response
    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      score: result.score || 0.5,
      metrics: result.metrics || {
        helpfulness: 0.5,
        clarity: 0.5,
        empathy: 0.5,
        efficiency: 0.5,
        accuracy: 0.5
      },
      suggestions: result.suggestions || []
    };
  } catch (error) {
    console.error('Conversation quality analysis error:', error);
    
    // Return default result if analysis fails
    return {
      score: 0.5,
      metrics: {
        helpfulness: 0.5,
        clarity: 0.5,
        empathy: 0.5,
        efficiency: 0.5,
        accuracy: 0.5
      },
      suggestions: ['Could not analyze conversation quality.']
    };
  }
}
