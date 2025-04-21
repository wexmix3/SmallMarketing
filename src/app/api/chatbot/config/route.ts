import { NextRequest, NextResponse } from 'next/server';

// Import server-side repository for API routes
import { ChatbotConfigRepository } from '@/repositories/chatbotRepositoryServer';

/**
 * GET /api/chatbot/config
 *
 * Gets chatbot configuration for a business
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

    const config = await ChatbotConfigRepository.getByBusinessId(businessId);

    if (!config) {
      return NextResponse.json(
        { error: 'Chatbot configuration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error getting chatbot config:', error);
    return NextResponse.json(
      { error: 'Failed to get chatbot configuration' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chatbot/config
 *
 * Creates or updates chatbot configuration
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

    // Save configuration
    const config = await ChatbotConfigRepository.save(body);

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error saving chatbot config:', error);
    return NextResponse.json(
      { error: 'Failed to save chatbot configuration' },
      { status: 500 }
    );
  }
}
