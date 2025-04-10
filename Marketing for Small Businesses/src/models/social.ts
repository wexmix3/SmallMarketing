/**
 * Social Media Data Models
 *
 * These models define the structure for social media management functionality
 * including platforms, posts, engagement metrics, and analytics.
 */

// Platform Types
export type SocialPlatformType = 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn' | 'Pinterest';

/**
 * Platform Model
 *
 * Represents a social media platform with connection details and credentials
 */
export interface Platform {
  id: string;
  platformType: SocialPlatformType;
  name: string;
  icon: string;
  connected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'pending' | 'error';
  username: string;
  profileUrl?: string;
  credentials: {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: Date;
    apiKey?: string;
    apiSecret?: string;
    scope?: string[];
  };
  lastSyncedAt?: Date;
  metrics?: {
    followers: number;
    engagement: string;
    posts: number;
    growth: string;
  };
  settings?: {
    autoPublish: boolean;
    defaultHashtags?: string[];
    characterLimit?: number;
    mediaTypes?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// For backward compatibility
export type SocialPlatform = SocialPlatformType;
export interface SocialAccount extends Omit<Platform, 'platformType' | 'credentials' | 'connectionStatus' | 'settings' | 'createdAt' | 'updatedAt'> {
  name: SocialPlatformType;
}

/**
 * Media Attachment Model
 *
 * Represents media files attached to social media posts
 */
export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'link' | 'document' | 'gif';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  size?: number; // in bytes
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for videos, in seconds
  mimeType?: string;
  altText?: string; // for accessibility
  createdAt: Date;
}

/**
 * Social Post Model
 *
 * Represents a social media post with content, scheduling, and platform information
 */
export interface SocialPost {
  id: string;
  content: string;
  mediaAttachments: MediaAttachment[];
  scheduledTime: Date;
  scheduledFor?: string; // human-readable format
  platforms: SocialPlatformType[];
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
  publishedUrls?: Record<SocialPlatformType, string>; // URLs to published posts
  engagement?: EngagementMetrics;
  hashtags?: string[];
  mentions?: string[];
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  targetAudience?: {
    ageRanges?: string[];
    genders?: string[];
    interests?: string[];
    locations?: string[];
  };
  author: {
    id: string;
    name: string;
  };
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: {
    id: string;
    name: string;
    date: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Engagement Metrics Model
 *
 * Represents engagement data for social media content
 */
export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  impressions: number; // number of times content was displayed
  reach: number; // number of unique users who saw the content
  saves?: number;
  reactions?: Record<string, number>; // platform-specific reactions
  commentSentiment?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  demographicBreakdown?: {
    ageRanges: Record<string, number>;
    genders: Record<string, number>;
    locations: Record<string, number>;
  };
  engagementRate: number; // calculated percentage
  updatedAt: Date;
}

// For backward compatibility
export interface PostEngagement extends Omit<EngagementMetrics, 'engagementRate' | 'demographicBreakdown' | 'commentSentiment' | 'reactions' | 'saves' | 'updatedAt'> {
}

// Analytics Types
export interface PlatformAnalytics {
  platform: SocialPlatform;
  followers: number;
  engagement: string;
  posts: number;
  reach: number;
  growth: string;
  topPosts: SocialPost[];
}

export interface EngagementOverTime {
  date: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface FollowerGrowth {
  date: string;
  followers: {
    [key in SocialPlatform]?: number;
  };
  total: number;
}

// Mock Data Functions
export function getMockSocialAccounts(): SocialAccount[] {
  return [
    {
      id: 1,
      name: 'Facebook',
      connected: true,
      icon: '/facebook-icon.png',
      username: 'LocalBusinessPage',
      metrics: {
        followers: 1245,
        engagement: '3.2%',
        posts: 45,
        growth: '+2.4%'
      }
    },
    {
      id: 2,
      name: 'Instagram',
      connected: true,
      icon: '/instagram-icon.png',
      username: '@localbusiness',
      metrics: {
        followers: 1840,
        engagement: '5.7%',
        posts: 62,
        growth: '+4.1%'
      }
    },
    {
      id: 3,
      name: 'Twitter',
      connected: true,
      icon: '/twitter-icon.png',
      username: '@LocalBiz',
      metrics: {
        followers: 768,
        engagement: '2.1%',
        posts: 87,
        growth: '+1.2%'
      }
    },
    {
      id: 4,
      name: 'LinkedIn',
      connected: false,
      icon: '/linkedin-icon.png',
      username: ''
    },
    {
      id: 5,
      name: 'Pinterest',
      connected: false,
      icon: '/pinterest-icon.png',
      username: ''
    },
  ];
}

export function getMockScheduledPosts(): SocialPost[] {
  return [
    {
      id: 1,
      content: 'Don\'t miss our summer sale! 20% off all products this weekend only. #summersale #discount',
      media: [
        {
          id: '1',
          type: 'image',
          url: '/images/summer-sale.jpg',
          thumbnail: '/images/summer-sale-thumb.jpg',
        }
      ],
      scheduledFor: 'Tomorrow, 10:00 AM',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      platforms: ['Facebook', 'Instagram', 'Twitter'],
      status: 'scheduled',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      content: 'Check out our new product line that just arrived! Perfect for the upcoming season.',
      media: [
        {
          id: '2',
          type: 'image',
          url: '/images/new-products.jpg',
          thumbnail: '/images/new-products-thumb.jpg',
        }
      ],
      scheduledFor: 'Aug 18, 2023, 2:00 PM',
      scheduledTime: new Date('2023-08-18T14:00:00'),
      platforms: ['Facebook', 'Instagram'],
      status: 'scheduled',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      content: 'We\'re excited to announce our extended hours starting next week! Now open until 8 PM on weekdays.',
      scheduledFor: 'Aug 22, 2023, 9:00 AM',
      scheduledTime: new Date('2023-08-22T09:00:00'),
      platforms: ['Facebook', 'Twitter'],
      status: 'scheduled',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];
}

export function getMockPublishedPosts(): SocialPost[] {
  return [
    {
      id: 101,
      content: 'We\'re thrilled to announce our new loyalty program! Sign up today and get 10% off your next purchase. #loyaltyrewards',
      media: [
        {
          id: '101',
          type: 'image',
          url: '/images/loyalty-program.jpg',
          thumbnail: '/images/loyalty-program-thumb.jpg',
        }
      ],
      scheduledFor: 'July 15, 2023, 11:00 AM',
      scheduledTime: new Date('2023-07-15T11:00:00'),
      platforms: ['Facebook', 'Instagram', 'Twitter'],
      status: 'published',
      engagement: {
        likes: 45,
        comments: 12,
        shares: 8,
        impressions: 1250,
        reach: 980
      },
      createdAt: new Date('2023-07-14'),
      updatedAt: new Date('2023-07-15')
    },
    {
      id: 102,
      content: 'Happy National Small Business Day! We\'re celebrating with special offers all week long. Stop by and support your local businesses! #smallbusinessday',
      media: [
        {
          id: '102',
          type: 'image',
          url: '/images/small-business-day.jpg',
          thumbnail: '/images/small-business-day-thumb.jpg',
        }
      ],
      scheduledFor: 'July 25, 2023, 9:00 AM',
      scheduledTime: new Date('2023-07-25T09:00:00'),
      platforms: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn'],
      status: 'published',
      engagement: {
        likes: 87,
        comments: 23,
        shares: 34,
        impressions: 2340,
        reach: 1820
      },
      createdAt: new Date('2023-07-24'),
      updatedAt: new Date('2023-07-25')
    },
    {
      id: 103,
      content: 'Our weekend workshop was a huge success! Thanks to everyone who participated. Here are some highlights from the event. #workshop #community',
      media: [
        {
          id: '103-1',
          type: 'image',
          url: '/images/workshop-1.jpg',
          thumbnail: '/images/workshop-1-thumb.jpg',
        },
        {
          id: '103-2',
          type: 'image',
          url: '/images/workshop-2.jpg',
          thumbnail: '/images/workshop-2-thumb.jpg',
        }
      ],
      scheduledFor: 'August 2, 2023, 3:00 PM',
      scheduledTime: new Date('2023-08-02T15:00:00'),
      platforms: ['Facebook', 'Instagram'],
      status: 'published',
      engagement: {
        likes: 62,
        comments: 18,
        shares: 7,
        impressions: 1560,
        reach: 1120
      },
      createdAt: new Date('2023-08-02'),
      updatedAt: new Date('2023-08-02')
    },
  ];
}

export function getMockEngagementOverTime(): EngagementOverTime[] {
  return [
    { date: 'Jul 1', likes: 32, comments: 8, shares: 5 },
    { date: 'Jul 8', likes: 45, comments: 12, shares: 8 },
    { date: 'Jul 15', likes: 38, comments: 10, shares: 6 },
    { date: 'Jul 22', likes: 87, comments: 23, shares: 34 },
    { date: 'Jul 29', likes: 54, comments: 15, shares: 12 },
    { date: 'Aug 5', likes: 62, comments: 18, shares: 7 },
    { date: 'Aug 12', likes: 48, comments: 14, shares: 9 },
  ];
}

export function getMockFollowerGrowth(): FollowerGrowth[] {
  return [
    {
      date: 'Jul 1',
      followers: {
        Facebook: 1150,
        Instagram: 1680,
        Twitter: 720
      },
      total: 3550
    },
    {
      date: 'Jul 8',
      followers: {
        Facebook: 1175,
        Instagram: 1720,
        Twitter: 735
      },
      total: 3630
    },
    {
      date: 'Jul 15',
      followers: {
        Facebook: 1195,
        Instagram: 1760,
        Twitter: 745
      },
      total: 3700
    },
    {
      date: 'Jul 22',
      followers: {
        Facebook: 1215,
        Instagram: 1790,
        Twitter: 755
      },
      total: 3760
    },
    {
      date: 'Jul 29',
      followers: {
        Facebook: 1230,
        Instagram: 1815,
        Twitter: 760
      },
      total: 3805
    },
    {
      date: 'Aug 5',
      followers: {
        Facebook: 1245,
        Instagram: 1840,
        Twitter: 768
      },
      total: 3853
    },
  ];
}

export function getMockPlatformAnalytics(): PlatformAnalytics[] {
  return [
    {
      platform: 'Facebook',
      followers: 1245,
      engagement: '3.2%',
      posts: 45,
      reach: 8750,
      growth: '+2.4%',
      topPosts: getMockPublishedPosts().slice(0, 2)
    },
    {
      platform: 'Instagram',
      followers: 1840,
      engagement: '5.7%',
      posts: 62,
      reach: 12450,
      growth: '+4.1%',
      topPosts: getMockPublishedPosts().slice(0, 2)
    },
    {
      platform: 'Twitter',
      followers: 768,
      engagement: '2.1%',
      posts: 87,
      reach: 5680,
      growth: '+1.2%',
      topPosts: getMockPublishedPosts().slice(1, 3)
    }
  ];
}
