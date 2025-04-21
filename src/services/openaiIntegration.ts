/**
 * OpenAI Integration Service
 * 
 * This service provides integration with the OpenAI API for the AI Customer Service Assistant.
 * It handles sending requests to OpenAI and processing the responses.
 */

// Mock implementation for development without an actual OpenAI API key
export async function generateChatCompletion(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  } = {}
): Promise<{ text: string; usage: { total_tokens: number } }> {
  console.log('Generating chat completion with messages:', messages);
  
  // In a real implementation, this would call the OpenAI API
  // For development, we'll return mock responses based on the last user message
  const lastUserMessage = messages
    .filter(msg => msg.role === 'user')
    .pop()?.content.toLowerCase() || '';
  
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate response based on keywords in the message
  let response = "I'm here to help! What would you like to know about our products or services?";
  
  if (lastUserMessage.includes('hour') || lastUserMessage.includes('open')) {
    response = "We are open Monday to Friday from 9 AM to 5 PM, and Saturday from 10 AM to 2 PM. We are closed on Sundays.";
  } else if (lastUserMessage.includes('return') || lastUserMessage.includes('refund')) {
    response = "Our return policy allows returns within 30 days of purchase with a receipt. Items must be in original condition.";
  } else if (lastUserMessage.includes('ship') || lastUserMessage.includes('delivery')) {
    response = "We offer free shipping on orders over $50. Standard shipping takes 3-5 business days.";
  } else if (lastUserMessage.includes('price') || lastUserMessage.includes('cost')) {
    response = "Our prices vary by product. Is there a specific item you're interested in?";
  } else if (lastUserMessage.includes('appointment') || lastUserMessage.includes('schedule')) {
    response = "I'd be happy to help you schedule an appointment. What day and time works best for you?";
  } else if (lastUserMessage.includes('speak') && lastUserMessage.includes('human')) {
    response = "I'll connect you with a human agent shortly. Please wait a moment.";
  } else if (lastUserMessage.includes('product') || lastUserMessage.includes('item')) {
    response = "We offer a variety of high-quality products. Our most popular items include our Premium T-shirts, Wireless Earbuds, and Hoodies.";
  } else if (lastUserMessage.includes('thank')) {
    response = "You're welcome! Is there anything else I can help you with today?";
  } else if (lastUserMessage.includes('help')) {
    response = "I can help with information about our products, services, business hours, shipping, returns, or scheduling an appointment. What would you like to know?";
  }
  
  return {
    text: response,
    usage: {
      total_tokens: Math.floor(Math.random() * 100) + 50 // Random token count for mock
    }
  };
}

// Real implementation using the OpenAI API
export async function generateChatCompletionWithAPI(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  } = {}
): Promise<{ text: string; usage: { total_tokens: number } }> {
  // Check if OpenAI API key is available
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OpenAI API key not found, using mock implementation');
    return generateChatCompletion(messages, options);
  }
  
  try {
    // In a real implementation, this would use the OpenAI SDK
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: options.model || 'gpt-3.5-turbo',
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 150,
        top_p: options.topP ?? 1
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    return {
      text: data.choices[0].message.content,
      usage: data.usage
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Fall back to mock implementation if API call fails
    return generateChatCompletion(messages, options);
  }
}
