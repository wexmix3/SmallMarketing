import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsRepository } from '@/repositories/chatbotRepository';

/**
 * GET /api/chatbot/analytics
 * 
 * Gets analytics for a business
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    const period = searchParams.get('period') || 'month';
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }
    
    // Validate period
    if (!['day', 'week', 'month', 'year'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Use "day", "week", "month", or "year".' },
        { status: 400 }
      );
    }
    
    const analytics = await AnalyticsRepository.getByBusinessId(
      businessId, 
      period as 'day' | 'week' | 'month' | 'year'
    );
    
    if (!analytics) {
      return NextResponse.json(
        { error: 'Analytics not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error getting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}
