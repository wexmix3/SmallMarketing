/**
 * Embedding Service
 * 
 * This service provides text embedding functionality for semantic search and similarity matching.
 * It uses OpenAI's embedding API in production and a simplified mock implementation for development.
 */

// Mock embeddings cache to avoid regenerating embeddings for the same text
const embeddingsCache = new Map<string, number[]>();

/**
 * Generate an embedding for the given text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Check cache first
  const cacheKey = text.toLowerCase().trim();
  if (embeddingsCache.has(cacheKey)) {
    return embeddingsCache.get(cacheKey)!;
  }
  
  // In production, use OpenAI's embedding API
  if (process.env.OPENAI_API_KEY && process.env.NODE_ENV === 'production') {
    try {
      const embedding = await generateOpenAIEmbedding(text);
      embeddingsCache.set(cacheKey, embedding);
      return embedding;
    } catch (error) {
      console.error('Error generating OpenAI embedding:', error);
      // Fall back to mock implementation
    }
  }
  
  // For development or if OpenAI API fails, use mock implementation
  const mockEmbedding = generateMockEmbedding(text);
  embeddingsCache.set(cacheKey, mockEmbedding);
  return mockEmbedding;
}

/**
 * Generate an embedding using OpenAI's API
 */
async function generateOpenAIEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Generate a mock embedding for development and testing
 * 
 * This is a simplified implementation that creates embeddings based on word frequencies.
 * It's not suitable for production use but provides a reasonable approximation for testing.
 */
function generateMockEmbedding(text: string): number[] {
  const dimension = 64; // Use a smaller dimension for mock embeddings
  const embedding = new Array(dimension).fill(0);
  
  // Normalize and tokenize text
  const normalizedText = text.toLowerCase().trim();
  const words = normalizedText.split(/\W+/).filter(word => word.length > 0);
  
  // Common English stop words to ignore
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 
    'about', 'against', 'between', 'into', 'through', 'during', 'before', 
    'after', 'above', 'below', 'from', 'up', 'down', 'of', 'off', 'over', 
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 
    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 
    'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 
    'now', 'do', 'does', 'did', 'doing', 'i', 'you', 'he', 'she', 'it', 
    'we', 'they', 'their', 'this', 'that', 'these', 'those'
  ]);
  
  // Create a deterministic hash for each word
  for (const word of words) {
    if (stopWords.has(word)) continue;
    
    // Simple hash function to map words to embedding dimensions
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use the hash to determine which dimensions to update
    const dimension1 = Math.abs(hash) % dimension;
    const dimension2 = (Math.abs(hash) + 7) % dimension; // Add offset for second dimension
    
    // Update the embedding
    embedding[dimension1] += 1.0;
    embedding[dimension2] += 0.5;
  }
  
  // Add some values based on text length and character types
  embedding[0] = normalizedText.length / 100; // Text length
  embedding[1] = words.length / 20; // Word count
  embedding[2] = (normalizedText.match(/\?/g) || []).length / 2; // Question marks
  embedding[3] = (normalizedText.match(/!/g) || []).length / 2; // Exclamation marks
  
  // Normalize the embedding
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude;
    }
  }
  
  return embedding;
}

/**
 * Calculate similarity between two texts
 */
export async function calculateSimilarity(text1: string, text2: string): Promise<number> {
  const embedding1 = await generateEmbedding(text1);
  const embedding2 = await generateEmbedding(text2);
  
  return calculateCosineSimilarity(embedding1, embedding2);
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
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
 * Find the most similar texts from a list
 */
export async function findSimilarTexts(
  query: string,
  texts: string[],
  options: { threshold?: number; limit?: number } = {}
): Promise<Array<{ text: string; similarity: number }>> {
  const { threshold = 0.7, limit = 5 } = options;
  
  const queryEmbedding = await generateEmbedding(query);
  const results: Array<{ text: string; similarity: number }> = [];
  
  for (const text of texts) {
    const textEmbedding = await generateEmbedding(text);
    const similarity = calculateCosineSimilarity(queryEmbedding, textEmbedding);
    
    if (similarity >= threshold) {
      results.push({ text, similarity });
    }
  }
  
  // Sort by similarity (descending) and limit results
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}
