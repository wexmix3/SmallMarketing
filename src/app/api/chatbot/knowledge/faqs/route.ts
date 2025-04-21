import { NextRequest, NextResponse } from 'next/server';
import { KnowledgeBaseRepository } from '@/repositories/chatbotRepository';

/**
 * POST /api/chatbot/knowledge/faqs
 * 
 * Adds a new FAQ to the knowledge base
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.businessId || !body.question || !body.answer) {
      return NextResponse.json(
        { error: 'Business ID, question, and answer are required' },
        { status: 400 }
      );
    }
    
    // Add FAQ to knowledge base
    const faq = await KnowledgeBaseRepository.addFAQ(body.businessId, {
      id: body.id,
      question: body.question,
      answer: body.answer,
      category: body.category,
      tags: body.tags,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json(faq);
  } catch (error) {
    console.error('Error adding FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to add FAQ' },
      { status: 500 }
    );
  }
}
