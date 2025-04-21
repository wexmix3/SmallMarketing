import { NextRequest, NextResponse } from 'next/server';
import { 
  initializeConversation, 
  getRecentConversations,
  getActiveConversations
} from '@/services/chatbotService';

/**
 * GET /api/chatbot/conversations
 * 
 * Gets conversations for a business
 * 
 * Query parameters:
 * - businessId: ID of the business
 * - status: Filter by status (active, closed, transferred, all)
 * - limit: Maximum number of conversations to return
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }
    
    let conversations;
    
    if (status === 'active' || status === 'transferred') {
      conversations = await getActiveConversations(businessId);
    } else {
      conversations = await getRecentConversations(businessId, limit);
    }
    
    // Filter by status if specified and not 'all'
    if (status !== 'all' && status !== 'active') {
      conversations = conversations.filter(conv => conv.status === status);
    }
    
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    return NextResponse.json(
      { error: 'Failed to get conversations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chatbot/conversations
 * 
 * Creates a new conversation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.businessId || !body.visitorId) {
      return NextResponse.json(
        { error: 'Business ID and Visitor ID are required' },
        { status: 400 }
      );
    }
    
    // Initialize conversation
    const conversation = await initializeConversation(
      body.businessId,
      body.visitorId,
      body.visitorName,
      body.visitorEmail,
      body.source || 'website'
    );
    
    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
