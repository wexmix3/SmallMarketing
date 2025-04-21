import { NextRequest, NextResponse } from 'next/server';
import { DailyPicksRepository } from '@/repositories/sportsGamblingRepository';
import { manuallyPostPicks } from '@/services/schedulerService';

/**
 * GET /api/sports/picks/:id
 * 
 * Gets a specific daily picks by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const picksId = params.id;
    
    // Get the picks
    const picks = await DailyPicksRepository.getById(picksId);
    if (!picks) {
      return NextResponse.json(
        { error: 'Picks not found' },
        { status: 404 }
      );
    }
    
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
 * POST /api/sports/picks/:id/post
 * 
 * Manually posts picks to Twitter
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const picksId = params.id;
    
    // Check if picks exist
    const picks = await DailyPicksRepository.getById(picksId);
    if (!picks) {
      return NextResponse.json(
        { error: 'Picks not found' },
        { status: 404 }
      );
    }
    
    // Post picks to Twitter
    await manuallyPostPicks(picksId);
    
    // Get updated picks
    const updatedPicks = await DailyPicksRepository.getById(picksId);
    
    return NextResponse.json(updatedPicks);
  } catch (error) {
    console.error('Error posting picks:', error);
    return NextResponse.json(
      { error: 'Failed to post picks' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sports/picks/:id
 * 
 * Deletes picks
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const picksId = params.id;
    
    // Delete the picks
    const success = await DailyPicksRepository.delete(picksId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Picks not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting picks:', error);
    return NextResponse.json(
      { error: 'Failed to delete picks' },
      { status: 500 }
    );
  }
}
