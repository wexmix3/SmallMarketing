import { NextRequest, NextResponse } from 'next/server';
import { initializeScheduler } from '@/services/schedulerService';

// Flag to track if the scheduler has been initialized
let schedulerInitialized = false;

/**
 * GET /api/init
 * 
 * Initializes the scheduler for posting daily picks
 */
export async function GET(request: NextRequest) {
  try {
    // Only initialize once
    if (!schedulerInitialized) {
      initializeScheduler();
      schedulerInitialized = true;
      
      console.log('Scheduler initialized successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Scheduler initialized successfully'
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Scheduler already initialized'
    });
  } catch (error) {
    console.error('Error initializing scheduler:', error);
    return NextResponse.json(
      { error: 'Failed to initialize scheduler' },
      { status: 500 }
    );
  }
}
