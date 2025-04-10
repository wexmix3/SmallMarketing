'use client';

import { useState, useEffect } from 'react';
import {
  TimePeriod,
  AnalyticsSummary,
  TimeSeriesData,
  TrafficSource,
  PagePerformance,
  DeviceBreakdown,
  BrowserBreakdown,
  CountryBreakdown
} from '@/models/analytics';
import {
  getAnalyticsSummary,
  getTimeSeriesData,
  getTrafficSources,
  getPagePerformance,
  getDeviceBreakdown,
  getBrowserBreakdown,
  getCountryBreakdown,
  getTopLandingPages,
  getTopExitPages,
  getTopConvertingPages,
  getRealTimeAnalytics,
  trackPageView,
  trackEvent,
  trackConversion,
  getConversionRateBySource,
  getBounceRateBySource,
  getAvgSessionDurationBySource,
  formatDuration
} from '@/services/analyticsService';

/**
 * Hook for managing website analytics functionality
 */
export function useWebAnalytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<DeviceBreakdown[]>([]);
  const [browserBreakdown, setBrowserBreakdown] = useState<BrowserBreakdown[]>([]);
  const [countryBreakdown, setCountryBreakdown] = useState<CountryBreakdown[]>([]);
  const [topLandingPages, setTopLandingPages] = useState<PagePerformance[]>([]);
  const [topExitPages, setTopExitPages] = useState<PagePerformance[]>([]);
  const [topConvertingPages, setTopConvertingPages] = useState<PagePerformance[]>([]);
  const [realTimeData, setRealTimeData] = useState<{
    activeVisitors: number;
    pageViewsToday: number;
    popularPages: { url: string; title: string; activeVisitors: number }[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          summaryData,
          timeSeriesData,
          trafficSourcesData,
          pagePerformanceData,
          deviceBreakdownData,
          browserBreakdownData,
          countryBreakdownData,
          topLandingPagesData,
          topExitPagesData,
          topConvertingPagesData,
          realTimeDataResult
        ] = await Promise.all([
          getAnalyticsSummary(),
          getTimeSeriesData(),
          getTrafficSources(),
          getPagePerformance(),
          getDeviceBreakdown(),
          getBrowserBreakdown(),
          getCountryBreakdown(),
          getTopLandingPages(),
          getTopExitPages(),
          getTopConvertingPages(),
          getRealTimeAnalytics()
        ]);
        
        setSummary(summaryData);
        setTimeSeriesData(timeSeriesData);
        setTrafficSources(trafficSourcesData);
        setPagePerformance(pagePerformanceData);
        setDeviceBreakdown(deviceBreakdownData);
        setBrowserBreakdown(browserBreakdownData);
        setCountryBreakdown(countryBreakdownData);
        setTopLandingPages(topLandingPagesData);
        setTopExitPages(topExitPagesData);
        setTopConvertingPages(topConvertingPagesData);
        setRealTimeData(realTimeDataResult);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Real-time data polling
  useEffect(() => {
    const pollRealTimeData = async () => {
      try {
        const data = await getRealTimeAnalytics();
        setRealTimeData(data);
      } catch (err) {
        console.error('Failed to load real-time data:', err);
      }
    };
    
    // Poll every 30 seconds
    const interval = setInterval(pollRealTimeData, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  /**
   * Load data for a specific time period
   */
  const loadDataForPeriod = async (period: TimePeriod) => {
    try {
      setLoading(true);
      
      const [
        summaryData,
        timeSeriesData,
        trafficSourcesData,
        pagePerformanceData,
        deviceBreakdownData,
        browserBreakdownData,
        countryBreakdownData,
        topLandingPagesData,
        topExitPagesData,
        topConvertingPagesData
      ] = await Promise.all([
        getAnalyticsSummary(period),
        getTimeSeriesData(period),
        getTrafficSources(period),
        getPagePerformance(period),
        getDeviceBreakdown(period),
        getBrowserBreakdown(period),
        getCountryBreakdown(period),
        getTopLandingPages(period),
        getTopExitPages(period),
        getTopConvertingPages(period)
      ]);
      
      setSummary(summaryData);
      setTimeSeriesData(timeSeriesData);
      setTrafficSources(trafficSourcesData);
      setPagePerformance(pagePerformanceData);
      setDeviceBreakdown(deviceBreakdownData);
      setBrowserBreakdown(browserBreakdownData);
      setCountryBreakdown(countryBreakdownData);
      setTopLandingPages(topLandingPagesData);
      setTopExitPages(topExitPagesData);
      setTopConvertingPages(topConvertingPagesData);
    } catch (err) {
      setError('Failed to load analytics data for the selected period');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Track a page view
   */
  const trackPageViewEvent = async (
    url: string,
    title: string,
    referrer: string = '',
    visitorId?: string,
    sessionId?: string
  ) => {
    try {
      await trackPageView(url, title, referrer, visitorId, sessionId);
    } catch (err) {
      console.error('Failed to track page view:', err);
    }
  };
  
  /**
   * Track an event
   */
  const trackEventAction = async (
    eventType: 'click' | 'form_submission' | 'video_play' | 'video_complete' | 'file_download' | 'custom',
    name: string,
    category?: string,
    label?: string,
    value?: number,
    visitorId?: string,
    sessionId?: string
  ) => {
    try {
      await trackEvent(eventType, name, category, label, value, visitorId, sessionId);
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  };
  
  /**
   * Track a conversion
   */
  const trackConversionEvent = async (
    name: string,
    conversionType: 'lead' | 'signup' | 'purchase' | 'download' | 'custom',
    value?: number,
    visitorId?: string,
    sessionId?: string
  ) => {
    try {
      await trackConversion(name, conversionType, value, visitorId, sessionId);
    } catch (err) {
      console.error('Failed to track conversion:', err);
    }
  };
  
  /**
   * Get conversion rate by source
   */
  const getConversionRatesBySource = async (period: TimePeriod = 'month') => {
    try {
      return await getConversionRateBySource(period);
    } catch (err) {
      console.error('Failed to get conversion rates by source:', err);
      return [];
    }
  };
  
  /**
   * Get bounce rate by source
   */
  const getBounceRatesBySource = async (period: TimePeriod = 'month') => {
    try {
      return await getBounceRateBySource(period);
    } catch (err) {
      console.error('Failed to get bounce rates by source:', err);
      return [];
    }
  };
  
  /**
   * Get average session duration by source
   */
  const getAvgSessionDurationsBySource = async (period: TimePeriod = 'month') => {
    try {
      return await getAvgSessionDurationBySource(period);
    } catch (err) {
      console.error('Failed to get average session durations by source:', err);
      return [];
    }
  };
  
  /**
   * Format time duration
   */
  const formatTimeDuration = (seconds: number) => {
    return formatDuration(seconds);
  };
  
  return {
    // State
    summary,
    timeSeriesData,
    trafficSources,
    pagePerformance,
    deviceBreakdown,
    browserBreakdown,
    countryBreakdown,
    topLandingPages,
    topExitPages,
    topConvertingPages,
    realTimeData,
    loading,
    error,
    
    // Actions
    loadDataForPeriod,
    trackPageView: trackPageViewEvent,
    trackEvent: trackEventAction,
    trackConversion: trackConversionEvent,
    getConversionRatesBySource,
    getBounceRatesBySource,
    getAvgSessionDurationsBySource,
    formatDuration: formatTimeDuration
  };
}
