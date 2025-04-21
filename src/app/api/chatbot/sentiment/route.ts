/**
 * Sentiment Analysis API
 * 
 * This API endpoint analyzes the sentiment of text.
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeSentiment } from '@/services/enhancedAiModelService';

/**
 * POST /api/chatbot/sentiment
 * 
 * Analyze the sentiment of text.
 * 
 * @param request - The request object
 * @returns The sentiment analysis result
 */
export async function POST(request: NextRequest) {
  try {
    // Get business ID from query params
    const businessId = request.nextUrl.searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { text, detailed = false } = body;
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    // Analyze sentiment
    const result = await analyzeSentiment(text, detailed);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
