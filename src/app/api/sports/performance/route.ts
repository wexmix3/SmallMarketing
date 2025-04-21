import { NextRequest, NextResponse } from 'next/server';
import { getPerformanceMetrics } from '@/services/sportsGamblingService';

/**
 * GET /api/sports/performance
 * 
 * Gets performance metrics for betting picks
 * 
 * Query parameters:
 * - startDate: Start date for metrics (optional)
 * - endDate: End date for metrics (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    
    // Parse dates if provided
    const startDate = startDateStr ? new Date(startDateStr) : undefined;
    const endDate = endDateStr ? new Date(endDateStr) : undefined;
    
    // Get performance metrics
    const metrics = await getPerformanceMetrics(startDate, endDate);
    
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get performance metrics' },
      { status: 500 }
    );
  }
}
