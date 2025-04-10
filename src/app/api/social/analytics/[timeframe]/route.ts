import { NextRequest, NextResponse } from 'next/server';
import { 
  getMockEngagementOverTime, 
  getMockFollowerGrowth, 
  getMockPlatformAnalytics,
  EngagementOverTime,
  FollowerGrowth,
  PlatformAnalytics,
  SocialPlatformType
} from '@/models/social';
import { PostRepository, EngagementRepository } from '@/repositories/socialMediaRepository';

/**
 * GET /api/social/analytics/:timeframe
 * 
 * Gets social media analytics for the specified timeframe
 * 
 * Timeframe options:
 * - 7days: Last 7 days
 * - 30days: Last 30 days
 * - 90days: Last 90 days
 * - custom: Custom date range (requires startDate and endDate query parameters)
 * 
 * Query parameters:
 * - platform: Filter by platform (optional)
 * - startDate: Start date for custom timeframe (required if timeframe=custom)
 * - endDate: End date for custom timeframe (required if timeframe=custom)
 * - metrics: Comma-separated list of metrics to include (optional)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { timeframe: string } }
) {
  try {
    const timeframe = params.timeframe;
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform') as SocialPlatformType | null;
    const metricsParam = searchParams.get('metrics');
    const metrics = metricsParam ? metricsParam.split(',') : ['all'];
    
    // Validate timeframe
    const validTimeframes = ['7days', '30days', '90days', 'custom'];
    if (!validTimeframes.includes(timeframe)) {
      return NextResponse.json(
        { error: `Invalid timeframe: ${timeframe}. Valid options are: ${validTimeframes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Handle custom timeframe
    if (timeframe === 'custom') {
      const startDateStr = searchParams.get('startDate');
      const endDateStr = searchParams.get('endDate');
      
      if (!startDateStr || !endDateStr) {
        return NextResponse.json(
          { error: 'startDate and endDate are required for custom timeframe' },
          { status: 400 }
        );
      }
      
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format. Use ISO format (YYYY-MM-DD)' },
          { status: 400 }
        );
      }
    }
    
    // Get analytics data
    // In a real app, this would query a database or analytics service
    // For this demo, we'll use mock data
    
    // Get engagement data
    let engagementData: EngagementOverTime[] = [];
    if (metrics.includes('all') || metrics.includes('engagement')) {
      engagementData = getMockEngagementOverTime();
      
      // Filter by timeframe
      engagementData = filterDataByTimeframe(engagementData, timeframe, searchParams);
    }
    
    // Get follower growth data
    let followerData: FollowerGrowth[] = [];
    if (metrics.includes('all') || metrics.includes('followers')) {
      followerData = getMockFollowerGrowth();
      
      // Filter by timeframe
      followerData = filterDataByTimeframe(followerData, timeframe, searchParams);
      
      // Filter by platform
      if (platform) {
        followerData = followerData.map(data => ({
          ...data,
          followers: {
            [platform]: data.followers[platform] || 0
          },
          total: data.followers[platform] || 0
        }));
      }
    }
    
    // Get platform analytics
    let platformAnalytics: PlatformAnalytics[] = [];
    if (metrics.includes('all') || metrics.includes('platforms')) {
      platformAnalytics = getMockPlatformAnalytics();
      
      // Filter by platform
      if (platform) {
        platformAnalytics = platformAnalytics.filter(data => 
          data.platform === platform
        );
      }
    }
    
    // Get post performance data
    let postPerformance = [];
    if (metrics.includes('all') || metrics.includes('posts')) {
      // Get published posts
      const publishedPosts = await PostRepository.getByStatus('published');
      
      // Get engagement metrics for each post
      const postPerformancePromises = publishedPosts.map(async post => {
        const engagement = await EngagementRepository.getByPostId(post.id);
        return {
          id: post.id,
          content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
          platforms: post.platforms,
          publishedAt: post.scheduledTime,
          engagement: engagement || {
            likes: 0,
            comments: 0,
            shares: 0,
            clicks: 0,
            impressions: 0,
            reach: 0,
            engagementRate: 0,
            updatedAt: new Date()
          }
        };
      });
      
      postPerformance = await Promise.all(postPerformancePromises);
      
      // Filter by platform
      if (platform) {
        postPerformance = postPerformance.filter(post => 
          post.platforms.includes(platform)
        );
      }
      
      // Sort by engagement rate (descending)
      postPerformance.sort((a, b) => 
        b.engagement.engagementRate - a.engagement.engagementRate
      );
    }
    
    // Calculate summary metrics
    const summary = calculateSummaryMetrics(
      engagementData, 
      followerData, 
      platformAnalytics
    );
    
    // Construct response
    const response: any = { summary };
    
    if (metrics.includes('all') || metrics.includes('engagement')) {
      response.engagement = engagementData;
    }
    
    if (metrics.includes('all') || metrics.includes('followers')) {
      response.followers = followerData;
    }
    
    if (metrics.includes('all') || metrics.includes('platforms')) {
      response.platforms = platformAnalytics;
    }
    
    if (metrics.includes('all') || metrics.includes('posts')) {
      response.posts = postPerformance;
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}

/**
 * Filter data by timeframe
 */
function filterDataByTimeframe<T extends { date: string }>(
  data: T[],
  timeframe: string,
  searchParams: URLSearchParams
): T[] {
  // Get date range based on timeframe
  let startDate: Date;
  let endDate = new Date(); // Now
  
  if (timeframe === 'custom') {
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    
    startDate = startDateStr ? new Date(startDateStr) : new Date();
    endDate = endDateStr ? new Date(endDateStr) : new Date();
  } else {
    // Calculate start date based on timeframe
    startDate = new Date();
    const days = timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : 90;
    startDate.setDate(startDate.getDate() - days);
  }
  
  // Filter data by date range
  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

/**
 * Calculate summary metrics
 */
function calculateSummaryMetrics(
  engagementData: EngagementOverTime[],
  followerData: FollowerGrowth[],
  platformAnalytics: PlatformAnalytics[]
) {
  // Calculate total engagement
  const totalEngagement = engagementData.reduce(
    (sum, data) => sum + data.likes + data.comments + data.shares,
    0
  );
  
  // Calculate average engagement per post
  const avgEngagementPerPost = engagementData.length > 0
    ? totalEngagement / engagementData.length
    : 0;
  
  // Calculate follower growth
  const followerGrowth = followerData.length >= 2
    ? ((followerData[followerData.length - 1].total - followerData[0].total) / followerData[0].total) * 100
    : 0;
  
  // Calculate total followers
  const totalFollowers = followerData.length > 0
    ? followerData[followerData.length - 1].total
    : 0;
  
  // Calculate total reach
  const totalReach = platformAnalytics.reduce(
    (sum, platform) => sum + platform.reach,
    0
  );
  
  // Calculate average engagement rate
  const avgEngagementRate = platformAnalytics.length > 0
    ? platformAnalytics.reduce(
        (sum, platform) => sum + parseFloat(platform.engagement.replace('%', '')),
        0
      ) / platformAnalytics.length
    : 0;
  
  return {
    totalEngagement,
    avgEngagementPerPost,
    followerGrowth: `${followerGrowth.toFixed(1)}%`,
    totalFollowers,
    totalReach,
    avgEngagementRate: `${avgEngagementRate.toFixed(1)}%`,
  };
}
