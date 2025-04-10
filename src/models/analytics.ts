/**
 * Website Analytics Data Models
 *
 * These models define the structure for website analytics functionality
 * including page views, visitors, events, and conversions.
 */

// Time periods
export type TimePeriod = 'day' | 'week' | 'month' | 'year';

// Page View Types
export interface PageView {
  id: string;
  url: string;
  title: string;
  referrer: string;
  timestamp: Date;
  visitorId: string;
  sessionId: string;
  timeOnPage?: number; // in seconds
  exitPage: boolean;
  landingPage: boolean;
  device: 'desktop' | 'tablet' | 'mobile';
  browser: string;
  operatingSystem: string;
  country: string;
  region?: string;
  city?: string;
}

// Visitor Types
export interface Visitor {
  id: string;
  firstSeen: Date;
  lastSeen: Date;
  sessions: number;
  pageViews: number;
  totalTimeOnSite: number; // in seconds
  conversions: number;
  device: 'desktop' | 'tablet' | 'mobile';
  browser: string;
  operatingSystem: string;
  country: string;
  region?: string;
  city?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  returning: boolean;
}

// Session Types
export interface Session {
  id: string;
  visitorId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  pageViews: number;
  landingPage: string;
  exitPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  device: 'desktop' | 'tablet' | 'mobile';
  browser: string;
  operatingSystem: string;
  country: string;
  region?: string;
  city?: string;
  bounced: boolean;
  converted: boolean;
}

// Event Types
export type EventType = 'click' | 'form_submission' | 'video_play' | 'video_complete' | 'file_download' | 'custom';

export interface Event {
  id: string;
  type: EventType;
  name: string;
  category?: string;
  label?: string;
  value?: number;
  url: string;
  timestamp: Date;
  visitorId: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

// Conversion Types
export interface Conversion {
  id: string;
  name: string;
  value?: number;
  url: string;
  timestamp: Date;
  visitorId: string;
  sessionId: string;
  conversionType: 'lead' | 'signup' | 'purchase' | 'download' | 'custom';
  metadata?: Record<string, any>;
}

// Traffic Source Types
export interface TrafficSource {
  source: string;
  medium?: string;
  campaign?: string;
  visitors: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
  conversionRate: number;
}

// Page Performance Types
export interface PagePerformance {
  url: string;
  title: string;
  pageViews: number;
  uniquePageViews: number;
  avgTimeOnPage: number;
  entrances: number;
  bounceRate: number;
  exitRate: number;
  conversions: number;
  conversionRate: number;
}

// Analytics Summary Types
export interface AnalyticsSummary {
  timeframe: string;
  visitors: number;
  newVisitors: number;
  returningVisitors: number;
  sessions: number;
  pageViews: number;
  pagesPerSession: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversions: number;
  conversionRate: number;
}

// Time Series Data
export interface TimeSeriesData {
  date: string;
  visitors: number;
  pageViews: number;
  sessions: number;
  conversions: number;
}

// Device Breakdown
export interface DeviceBreakdown {
  device: 'desktop' | 'tablet' | 'mobile';
  visitors: number;
  percentage: number;
}

// Browser Breakdown
export interface BrowserBreakdown {
  browser: string;
  visitors: number;
  percentage: number;
}

// Country Breakdown
export interface CountryBreakdown {
  country: string;
  visitors: number;
  percentage: number;
}

// Mock Data Functions
export function getMockTimeSeriesData(days: number = 30): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate some realistic-looking data with weekly patterns
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Base values
    let visitors = isWeekend ? 
      Math.floor(Math.random() * 50) + 100 : 
      Math.floor(Math.random() * 100) + 150;
    
    // Add some trend (increasing over time)
    visitors = Math.floor(visitors * (1 + (days - i) / (days * 2)));
    
    // Add some randomness
    visitors = Math.floor(visitors * (0.9 + Math.random() * 0.2));
    
    // Calculate related metrics
    const sessions = Math.floor(visitors * (1.1 + Math.random() * 0.3));
    const pageViews = Math.floor(sessions * (2.5 + Math.random() * 1.5));
    const conversions = Math.floor(visitors * (0.02 + Math.random() * 0.03));
    
    data.push({
      date: date.toISOString().split('T')[0],
      visitors,
      sessions,
      pageViews,
      conversions
    });
  }
  
  return data;
}

export function getMockAnalyticsSummary(): AnalyticsSummary {
  return {
    timeframe: 'Last 30 days',
    visitors: 4250,
    newVisitors: 2890,
    returningVisitors: 1360,
    sessions: 5120,
    pageViews: 12480,
    pagesPerSession: 2.44,
    avgSessionDuration: 184, // in seconds
    bounceRate: 42.8,
    conversions: 128,
    conversionRate: 3.01
  };
}

export function getMockTrafficSources(): TrafficSource[] {
  return [
    {
      source: 'google',
      medium: 'organic',
      visitors: 1850,
      sessions: 2240,
      pageViews: 5680,
      bounceRate: 38.4,
      avgSessionDuration: 210,
      conversions: 62,
      conversionRate: 3.35
    },
    {
      source: 'direct',
      visitors: 1120,
      sessions: 1340,
      pageViews: 3250,
      bounceRate: 41.2,
      avgSessionDuration: 195,
      conversions: 38,
      conversionRate: 3.39
    },
    {
      source: 'facebook',
      medium: 'social',
      visitors: 580,
      sessions: 640,
      pageViews: 1480,
      bounceRate: 52.6,
      avgSessionDuration: 145,
      conversions: 12,
      conversionRate: 2.07
    },
    {
      source: 'email',
      campaign: 'newsletter',
      visitors: 320,
      sessions: 350,
      pageViews: 980,
      bounceRate: 28.5,
      avgSessionDuration: 230,
      conversions: 14,
      conversionRate: 4.38
    },
    {
      source: 'bing',
      medium: 'organic',
      visitors: 180,
      sessions: 210,
      pageViews: 520,
      bounceRate: 44.8,
      avgSessionDuration: 175,
      conversions: 5,
      conversionRate: 2.78
    },
    {
      source: 'twitter',
      medium: 'social',
      visitors: 120,
      sessions: 140,
      pageViews: 290,
      bounceRate: 58.2,
      avgSessionDuration: 120,
      conversions: 2,
      conversionRate: 1.67
    },
    {
      source: 'instagram',
      medium: 'social',
      visitors: 80,
      sessions: 90,
      pageViews: 180,
      bounceRate: 62.4,
      avgSessionDuration: 105,
      conversions: 1,
      conversionRate: 1.25
    }
  ];
}

export function getMockPagePerformance(): PagePerformance[] {
  return [
    {
      url: '/',
      title: 'Home',
      pageViews: 3850,
      uniquePageViews: 3240,
      avgTimeOnPage: 65,
      entrances: 2480,
      bounceRate: 42.5,
      exitRate: 28.4,
      conversions: 48,
      conversionRate: 1.25
    },
    {
      url: '/products',
      title: 'Products',
      pageViews: 2240,
      uniquePageViews: 1980,
      avgTimeOnPage: 95,
      entrances: 840,
      bounceRate: 32.8,
      exitRate: 18.6,
      conversions: 32,
      conversionRate: 1.43
    },
    {
      url: '/about',
      title: 'About Us',
      pageViews: 980,
      uniquePageViews: 920,
      avgTimeOnPage: 78,
      entrances: 320,
      bounceRate: 58.4,
      exitRate: 42.2,
      conversions: 4,
      conversionRate: 0.41
    },
    {
      url: '/contact',
      title: 'Contact Us',
      pageViews: 1240,
      uniquePageViews: 1180,
      avgTimeOnPage: 120,
      entrances: 580,
      bounceRate: 24.6,
      exitRate: 68.5,
      conversions: 22,
      conversionRate: 1.77
    },
    {
      url: '/blog',
      title: 'Blog',
      pageViews: 1850,
      uniquePageViews: 1620,
      avgTimeOnPage: 145,
      entrances: 720,
      bounceRate: 38.2,
      exitRate: 22.8,
      conversions: 12,
      conversionRate: 0.65
    },
    {
      url: '/products/featured',
      title: 'Featured Products',
      pageViews: 1480,
      uniquePageViews: 1320,
      avgTimeOnPage: 110,
      entrances: 180,
      bounceRate: 28.4,
      exitRate: 15.6,
      conversions: 28,
      conversionRate: 1.89
    },
    {
      url: '/checkout',
      title: 'Checkout',
      pageViews: 840,
      uniquePageViews: 780,
      avgTimeOnPage: 180,
      entrances: 0,
      bounceRate: 0,
      exitRate: 92.4,
      conversions: 82,
      conversionRate: 9.76
    }
  ];
}

export function getMockDeviceBreakdown(): DeviceBreakdown[] {
  return [
    {
      device: 'desktop',
      visitors: 2480,
      percentage: 58.4
    },
    {
      device: 'mobile',
      visitors: 1520,
      percentage: 35.8
    },
    {
      device: 'tablet',
      visitors: 250,
      percentage: 5.8
    }
  ];
}

export function getMockBrowserBreakdown(): BrowserBreakdown[] {
  return [
    {
      browser: 'Chrome',
      visitors: 2240,
      percentage: 52.7
    },
    {
      browser: 'Safari',
      visitors: 980,
      percentage: 23.1
    },
    {
      browser: 'Firefox',
      visitors: 480,
      percentage: 11.3
    },
    {
      browser: 'Edge',
      visitors: 380,
      percentage: 8.9
    },
    {
      browser: 'Opera',
      visitors: 120,
      percentage: 2.8
    },
    {
      browser: 'Other',
      visitors: 50,
      percentage: 1.2
    }
  ];
}

export function getMockCountryBreakdown(): CountryBreakdown[] {
  return [
    {
      country: 'United States',
      visitors: 2850,
      percentage: 67.1
    },
    {
      country: 'United Kingdom',
      visitors: 480,
      percentage: 11.3
    },
    {
      country: 'Canada',
      visitors: 320,
      percentage: 7.5
    },
    {
      country: 'Australia',
      visitors: 180,
      percentage: 4.2
    },
    {
      country: 'Germany',
      visitors: 150,
      percentage: 3.5
    },
    {
      country: 'France',
      visitors: 120,
      percentage: 2.8
    },
    {
      country: 'Other',
      visitors: 150,
      percentage: 3.6
    }
  ];
}
