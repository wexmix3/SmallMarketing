/**
 * OpenAI Service
 * 
 * This service provides a wrapper around the OpenAI API for use in the AI Customer Service Assistant.
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a response using the OpenAI API
 */
export async function generateResponse(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
  } = {}
) {
  try {
    const response = await openai.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 150,
      top_p: options.topP ?? 1,
      presence_penalty: options.presencePenalty ?? 0,
      frequency_penalty: options.frequencyPenalty ?? 0,
    });

    return {
      text: response.choices[0].message.content,
      usage: response.usage,
      model: response.model,
      finishReason: response.choices[0].finish_reason,
    };
  } catch (error) {
    console.error('Error generating response from OpenAI:', error);
    throw error;
  }
}

/**
 * Generate embeddings for a text
 */
export async function generateEmbeddings(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embeddings from OpenAI:', error);
    throw error;
  }
}

/**
 * Calculate similarity between two texts using embeddings
 */
export async function calculateSimilarity(text1: string, text2: string) {
  try {
    const embedding1 = await generateEmbeddings(text1);
    const embedding2 = await generateEmbeddings(text2);

    // Calculate cosine similarity
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

    const similarity = dotProduct / (magnitude1 * magnitude2);

    return similarity;
  } catch (error) {
    console.error('Error calculating similarity:', error);
    throw error;
  }
}

export default {
  generateResponse,
  generateEmbeddings,
  calculateSimilarity,
};
