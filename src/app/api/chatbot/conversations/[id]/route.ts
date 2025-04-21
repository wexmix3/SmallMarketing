import { NextRequest, NextResponse } from 'next/server';
import { ConversationRepository } from '@/repositories/chatbotRepository';
import { closeConversation, transferToHuman } from '@/services/chatbotService';

/**
 * GET /api/chatbot/conversations/:id
 * 
 * Gets a specific conversation by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    
    // Get the conversation
    const conversation = await ConversationRepository.getById(conversationId);
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error getting conversation:', error);
    return NextResponse.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/chatbot/conversations/:id
 * 
 * Updates a conversation's status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const body = await request.json();
    
    // Validate required fields
    if (!body.status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    let updatedConversation;
    
    // Handle different status updates
    switch (body.status) {
      case 'closed':
        updatedConversation = await closeConversation(conversationId);
        break;
      case 'transferred':
        updatedConversation = await transferToHuman(conversationId, body.agentId);
        break;
      default:
        updatedConversation = await ConversationRepository.updateStatus(conversationId, body.status);
    }
    
    if (!updatedConversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedConversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}
