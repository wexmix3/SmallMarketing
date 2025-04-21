import { NextRequest, NextResponse } from 'next/server';
import { sendMessage, markMessagesAsRead } from '@/services/chatbotService';

/**
 * POST /api/chatbot/conversations/:id/messages
 * 
 * Sends a message in a conversation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const body = await request.json();
    
    // Validate required fields
    if (!body.content || !body.sender) {
      return NextResponse.json(
        { error: 'Content and sender are required' },
        { status: 400 }
      );
    }
    
    // Validate sender type
    if (!['user', 'assistant', 'human-agent'].includes(body.sender)) {
      return NextResponse.json(
        { error: 'Invalid sender type' },
        { status: 400 }
      );
    }
    
    // Send message
    const message = await sendMessage(
      conversationId,
      body.content,
      body.sender,
      body.attachments
    );
    
    if (!message) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/chatbot/conversations/:id/messages
 * 
 * Marks messages as read
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const body = await request.json();
    
    // Validate required fields
    if (!body.messageIds || !Array.isArray(body.messageIds)) {
      return NextResponse.json(
        { error: 'Message IDs array is required' },
        { status: 400 }
      );
    }
    
    // Mark messages as read
    const success = await markMessagesAsRead(conversationId, body.messageIds);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to mark messages as read' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
