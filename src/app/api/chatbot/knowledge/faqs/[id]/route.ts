import { NextRequest, NextResponse } from 'next/server';
import { KnowledgeBaseRepository } from '@/repositories/chatbotRepository';

/**
 * PUT /api/chatbot/knowledge/faqs/:id
 * 
 * Updates an FAQ in the knowledge base
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const faqId = params.id;
    const body = await request.json();
    
    // Validate required fields
    if (!body.businessId || !body.question || !body.answer) {
      return NextResponse.json(
        { error: 'Business ID, question, and answer are required' },
        { status: 400 }
      );
    }
    
    // Update FAQ in knowledge base
    const faq = await KnowledgeBaseRepository.updateFAQ(body.businessId, {
      id: faqId,
      question: body.question,
      answer: body.answer,
      category: body.category,
      tags: body.tags,
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json(faq);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chatbot/knowledge/faqs/:id
 * 
 * Deletes an FAQ from the knowledge base
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const faqId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }
    
    // Delete FAQ from knowledge base
    const success = await KnowledgeBaseRepository.deleteFAQ(businessId, faqId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}
