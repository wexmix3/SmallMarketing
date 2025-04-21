/**
 * Conversation Quality Analysis API
 * 
 * This API endpoint analyzes the quality of a conversation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeConversationQuality } from '@/services/enhancedAiModelService';
import { ConversationRepository, MessageRepository } from '@/repositories/chatbotRepository';

/**
 * POST /api/chatbot/analytics/conversation-quality
 * 
 * Analyze the quality of a conversation.
 * 
 * @param request - The request object
 * @returns The conversation quality analysis result
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
    const { conversationId } = body;
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }
    
    // Get conversation
    const conversation = await ConversationRepository.getById(conversationId);
    
    if (!conversation || conversation.businessId !== businessId) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    // Get messages
    const messages = await MessageRepository.getByConversationId(conversationId);
    
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Conversation has no messages' },
        { status: 400 }
      );
    }
    
    // Format messages for analysis
    const formattedMessages = messages.map(message => ({
      role: message.sender === 'user' ? 'user' : 
            message.sender === 'assistant' ? 'assistant' : 'system',
      content: message.content
    }));
    
    // Analyze conversation quality
    const result = await analyzeConversationQuality(formattedMessages);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing conversation quality:', error);
    
    return NextResponse.json(
      { error: 'Failed to analyze conversation quality' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chatbot/analytics/conversation-quality
 * 
 * Get the quality analysis for a conversation.
 * 
 * @param request - The request object
 * @returns The conversation quality analysis result
 */
export async function GET(request: NextRequest) {
  try {
    // Get business ID and conversation ID from query params
    const businessId = request.nextUrl.searchParams.get('businessId');
    const conversationId = request.nextUrl.searchParams.get('conversationId');
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }
    
    // Get conversation
    const conversation = await ConversationRepository.getById(conversationId);
    
    if (!conversation || conversation.businessId !== businessId) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    // Check if quality analysis exists in metadata
    if (conversation.metadata?.qualityAnalysis) {
      return NextResponse.json(conversation.metadata.qualityAnalysis);
    }
    
    // Get messages
    const messages = await MessageRepository.getByConversationId(conversationId);
    
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Conversation has no messages' },
        { status: 400 }
      );
    }
    
    // Format messages for analysis
    const formattedMessages = messages.map(message => ({
      role: message.sender === 'user' ? 'user' : 
            message.sender === 'assistant' ? 'assistant' : 'system',
      content: message.content
    }));
    
    // Analyze conversation quality
    const result = await analyzeConversationQuality(formattedMessages);
    
    // Save quality analysis to conversation metadata
    await ConversationRepository.update(conversationId, {
      metadata: {
        ...conversation.metadata,
        qualityAnalysis: result
      }
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting conversation quality:', error);
    
    return NextResponse.json(
      { error: 'Failed to get conversation quality' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
