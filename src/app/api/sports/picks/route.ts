import { NextRequest, NextResponse } from 'next/server';
import { generateDailyPicks, getPerformanceMetrics } from '@/services/sportsGamblingService';
import { 
  getScheduledPicks, 
  getPostedPicks, 
  manuallyPostPicks, 
  generateAndPostPicks 
} from '@/services/schedulerService';
import { DailyPicksRepository } from '@/repositories/sportsGamblingRepository';

/**
 * GET /api/sports/picks
 * 
 * Gets all daily picks
 * 
 * Query parameters:
 * - status: Filter by status (optional)
 * - date: Filter by date (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as 'pending' | 'posted' | 'completed' | null;
    const dateStr = searchParams.get('date');
    
    // Get picks based on parameters
    let picks;
    
    if (status) {
      picks = await DailyPicksRepository.getByStatus(status);
    } else if (dateStr) {
      const date = new Date(dateStr);
      const dailyPicks = await DailyPicksRepository.getByDate(date);
      picks = dailyPicks ? [dailyPicks] : [];
    } else {
      picks = await DailyPicksRepository.getAll();
    }
    
    // Sort by date (newest first)
    picks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json(picks);
  } catch (error) {
    console.error('Error getting picks:', error);
    return NextResponse.json(
      { error: 'Failed to get picks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sports/picks
 * 
 * Generates new daily picks
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Generate picks for the specified date or today
    const date = body.date ? new Date(body.date) : new Date();
    const picks = await generateDailyPicks(date);
    
    // Save to repository
    await DailyPicksRepository.save(picks);
    
    // Post immediately if requested
    if (body.postNow) {
      await manuallyPostPicks(picks.id);
    }
    
    return NextResponse.json(picks);
  } catch (error) {
    console.error('Error generating picks:', error);
    return NextResponse.json(
      { error: 'Failed to generate picks' },
      { status: 500 }
    );
  }
}
