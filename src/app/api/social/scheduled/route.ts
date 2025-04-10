import { NextRequest, NextResponse } from 'next/server';
import { PostRepository } from '@/repositories/socialMediaRepository';
import { SocialPlatformType } from '@/models/social';

/**
 * GET /api/social/scheduled
 * 
 * Gets all scheduled social media posts
 * 
 * Query parameters:
 * - platform: Filter by platform (optional)
 * - startDate: Filter by start date (optional)
 * - endDate: Filter by end date (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform') as SocialPlatformType | null;
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    
    // Get all scheduled posts
    let scheduledPosts = await PostRepository.getByStatus('scheduled');
    
    // Filter by platform if specified
    if (platform) {
      scheduledPosts = scheduledPosts.filter(post => 
        post.platforms.includes(platform)
      );
    }
    
    // Filter by date range if specified
    if (startDateStr || endDateStr) {
      const startDate = startDateStr ? new Date(startDateStr) : new Date(0); // Beginning of time
      const endDate = endDateStr ? new Date(endDateStr) : new Date(8640000000000000); // End of time
      
      scheduledPosts = scheduledPosts.filter(post => {
        const postDate = new Date(post.scheduledTime);
        return postDate >= startDate && postDate <= endDate;
      });
    }
    
    // Sort by scheduled time
    scheduledPosts.sort((a, b) => {
      const dateA = new Date(a.scheduledTime);
      const dateB = new Date(b.scheduledTime);
      return dateA.getTime() - dateB.getTime();
    });
    
    return NextResponse.json(scheduledPosts);
  } catch (error) {
    console.error('Error getting scheduled posts:', error);
    return NextResponse.json(
      { error: 'Failed to get scheduled posts' },
      { status: 500 }
    );
  }
}
