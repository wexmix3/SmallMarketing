import { NextRequest, NextResponse } from 'next/server';
import { KnowledgeBaseRepository } from '@/repositories/chatbotRepository';

/**
 * GET /api/chatbot/knowledge
 * 
 * Gets knowledge base for a business
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }
    
    const knowledgeBase = await KnowledgeBaseRepository.getByBusinessId(businessId);
    
    if (!knowledgeBase) {
      return NextResponse.json(
        { error: 'Knowledge base not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(knowledgeBase);
  } catch (error) {
    console.error('Error getting knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to get knowledge base' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chatbot/knowledge
 * 
 * Creates or updates knowledge base
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }
    
    // Save knowledge base
    const knowledgeBase = await KnowledgeBaseRepository.save(body);
    
    return NextResponse.json(knowledgeBase);
  } catch (error) {
    console.error('Error saving knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to save knowledge base' },
      { status: 500 }
    );
  }
}
