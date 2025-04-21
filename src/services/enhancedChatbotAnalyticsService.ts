/**
 * Enhanced Chatbot Analytics Service
 * 
 * This service provides enhanced analytics capabilities for the AI Customer Service Assistant.
 * It tracks conversation metrics, quality scores, and generates reports.
 */

import { 
  Conversation, 
  Message, 
  AnalyticsSummary,
  ChatbotAnalytics
} from '@/models/chatbot';

// Use client-side repository for browser and server-side repository for server
const isServer = typeof window === 'undefined';

// Import repositories
let AnalyticsRepository, ConversationRepository;

if (isServer) {
  // Server-side imports
  const serverRepo = require('@/repositories/chatbotRepositoryServer');
  AnalyticsRepository = serverRepo.AnalyticsRepository;
  ConversationRepository = serverRepo.ConversationRepository;
} else {
  // Client-side imports
  const clientRepo = require('@/repositories/chatbotRepository');
  AnalyticsRepository = clientRepo.AnalyticsRepository;
  ConversationRepository = clientRepo.ConversationRepository;
}

/**
 * Get analytics summary for a business
 */
export async function getAnalyticsSummary(
  businessId: string,
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<AnalyticsSummary | null> {
  try {
    return await AnalyticsRepository.getByBusinessId(businessId, period);
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return null;
  }
}

/**
 * Get detailed analytics for a business
 */
export async function getDetailedAnalytics(
  businessId: string,
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<ChatbotAnalytics | null> {
  try {
    // Get all conversations for the business
    const conversations = await ConversationRepository.getByBusinessId(businessId);
    
    if (!conversations || conversations.length === 0) {
      return null;
    }
    
    // Calculate period start date
    const now = new Date();
    let periodStart: Date;
    
    switch (period) {
      case 'day':
        periodStart = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        periodStart = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        periodStart = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        periodStart = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        periodStart = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    // Filter conversations by period
    const periodConversations = conversations.filter(c => {
      const startTime = new Date(c.startTime);
      return startTime >= periodStart;
    });
    
    if (periodConversations.length === 0) {
      return null;
    }
    
    // Calculate metrics
    const metrics = calculateMetrics(periodConversations);
    
    return {
      id: `analytics-${businessId}-${period}`,
      businessId,
      period,
      startDate: periodStart,
      endDate: new Date(),
      metrics,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error getting detailed analytics:', error);
    return null;
  }
}

/**
 * Calculate metrics from conversations
 */
function calculateMetrics(conversations: Conversation[]): any {
  // Basic metrics
  const totalConversations = conversations.length;
  const activeConversations = conversations.filter(c => c.status === 'active').length;
  const closedConversations = conversations.filter(c => c.status === 'closed').length;
  const transferredConversations = conversations.filter(c => c.status === 'transferred').length;
  
  // Calculate conversation durations
  const durations: number[] = [];
  conversations.forEach(c => {
    if (c.endTime && c.startTime) {
      const startTime = new Date(c.startTime).getTime();
      const endTime = new Date(c.endTime).getTime();
      const duration = (endTime - startTime) / 1000; // in seconds
      durations.push(duration);
    }
  });
  
  const avgConversationDuration = durations.length > 0
    ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length
    : 0;
  
  // Calculate message metrics
  let totalMessages = 0;
  let userMessages = 0;
  let botMessages = 0;
  let agentMessages = 0;
  let responseTimes: number[] = [];
  
  conversations.forEach(c => {
    if (c.messages) {
      totalMessages += c.messages.length;
      
      // Track previous message for response time calculation
      let prevMessage: Message | null = null;
      
      c.messages.forEach(m => {
        if (m.sender === 'user') {
          userMessages++;
        } else if (m.sender === 'assistant') {
          botMessages++;
          
          // Calculate response time if previous message was from user
          if (prevMessage && prevMessage.sender === 'user') {
            const prevTime = new Date(prevMessage.timestamp).getTime();
            const currTime = new Date(m.timestamp).getTime();
            const responseTime = (currTime - prevTime) / 1000; // in seconds
            responseTimes.push(responseTime);
          }
        } else if (m.sender === 'human-agent') {
          agentMessages++;
        }
        
        prevMessage = m;
      });
    }
  });
  
  const avgMessagesPerConversation = totalConversations > 0
    ? totalMessages / totalConversations
    : 0;
  
  const avgResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 0;
  
  // Calculate resolution and transfer rates
  const totalCompletedConversations = closedConversations + transferredConversations;
  const resolutionRate = totalCompletedConversations > 0
    ? closedConversations / totalCompletedConversations
    : 0;
  const transferRate = totalCompletedConversations > 0
    ? transferredConversations / totalCompletedConversations
    : 0;
  
  // Calculate intent distribution
  const intentCounts: Record<string, number> = {};
  let totalIntents = 0;
  
  conversations.forEach(c => {
    if (c.messages) {
      c.messages.forEach(m => {
        if (m.intent) {
          intentCounts[m.intent] = (intentCounts[m.intent] || 0) + 1;
          totalIntents++;
        }
      });
    }
  });
  
  // Convert to array and sort by count
  const topIntents = Object.entries(intentCounts)
    .map(([intent, count]) => ({
      intent,
      count,
      percentage: totalIntents > 0 ? count / totalIntents : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Calculate busy hours
  const hourCounts: Record<number, number> = {};
  
  conversations.forEach(c => {
    const hour = new Date(c.startTime).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const busyHours = Object.entries(hourCounts)
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      count
    }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate busy days
  const dayCounts: Record<string, number> = {};
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  conversations.forEach(c => {
    const day = daysOfWeek[new Date(c.startTime).getDay()];
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  const busyDays = Object.entries(dayCounts)
    .map(([day, count]) => ({
      day,
      count
    }))
    .sort((a, b) => b.count - a.count);
  
  // Return all metrics
  return {
    totalConversations,
    avgConversationDuration,
    avgResponseTime,
    avgMessagesPerConversation,
    resolutionRate,
    transferRate,
    topIntents,
    busyHours,
    busyDays
  };
}

/**
 * Calculate quality score for a conversation
 */
export function calculateConversationQuality(conversation: Conversation): {
  score: number;
  metrics: Record<string, number>;
} {
  if (!conversation.messages || conversation.messages.length === 0) {
    return { score: 0, metrics: {} };
  }
  
  const metrics: Record<string, number> = {};
  
  // Metric 1: Response time (lower is better)
  const responseTimes: number[] = [];
  let prevMessage: Message | null = null;
  
  conversation.messages.forEach(m => {
    if (m.sender === 'assistant' && prevMessage && prevMessage.sender === 'user') {
      const prevTime = new Date(prevMessage.timestamp).getTime();
      const currTime = new Date(m.timestamp).getTime();
      const responseTime = (currTime - prevTime) / 1000; // in seconds
      responseTimes.push(responseTime);
    }
    
    prevMessage = m;
  });
  
  const avgResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 0;
  
  // Score response time (0-1, where 1 is best)
  // Assume ideal response time is under 2 seconds, worst is over 10 seconds
  metrics.responseTimeScore = Math.max(0, Math.min(1, 1 - (avgResponseTime - 2) / 8));
  
  // Metric 2: Message length appropriateness (not too short, not too long)
  const botMessageLengths = conversation.messages
    .filter(m => m.sender === 'assistant')
    .map(m => m.content.length);
  
  const avgMessageLength = botMessageLengths.length > 0
    ? botMessageLengths.reduce((sum, length) => sum + length, 0) / botMessageLengths.length
    : 0;
  
  // Score message length (0-1, where 1 is best)
  // Assume ideal length is between 100-300 characters
  if (avgMessageLength < 20) {
    metrics.messageLengthScore = 0.3; // Too short
  } else if (avgMessageLength < 100) {
    metrics.messageLengthScore = 0.7; // Slightly short
  } else if (avgMessageLength <= 300) {
    metrics.messageLengthScore = 1.0; // Ideal
  } else if (avgMessageLength <= 500) {
    metrics.messageLengthScore = 0.8; // Slightly long
  } else {
    metrics.messageLengthScore = 0.5; // Too long
  }
  
  // Metric 3: Conversation resolution
  if (conversation.status === 'closed') {
    metrics.resolutionScore = 1.0; // Resolved without human intervention
  } else if (conversation.status === 'transferred') {
    metrics.resolutionScore = 0.5; // Required human intervention
  } else {
    metrics.resolutionScore = 0.0; // Not resolved
  }
  
  // Metric 4: Conversation efficiency (messages per resolution)
  const messageCount = conversation.messages.length;
  
  // Score efficiency (0-1, where 1 is best)
  // Assume ideal conversation is resolved in 3-7 messages
  if (messageCount <= 2) {
    metrics.efficiencyScore = 0.5; // Too short to be meaningful
  } else if (messageCount <= 7) {
    metrics.efficiencyScore = 1.0; // Ideal
  } else if (messageCount <= 12) {
    metrics.efficiencyScore = 0.7; // Slightly inefficient
  } else {
    metrics.efficiencyScore = 0.4; // Very inefficient
  }
  
  // Calculate overall score (weighted average)
  const weights = {
    responseTimeScore: 0.25,
    messageLengthScore: 0.15,
    resolutionScore: 0.4,
    efficiencyScore: 0.2
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const [metric, score] of Object.entries(metrics)) {
    const weight = weights[metric as keyof typeof weights] || 0;
    totalScore += score * weight;
    totalWeight += weight;
  }
  
  const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  
  return {
    score: overallScore,
    metrics
  };
}

/**
 * Track conversation event
 */
export async function trackConversationEvent(
  businessId: string,
  conversationId: string,
  eventType: string,
  eventData: Record<string, any> = {}
): Promise<boolean> {
  try {
    // In a real implementation, this would store the event in a database
    console.log(`Tracking event: ${eventType} for conversation ${conversationId}`, eventData);
    
    // For now, just log the event
    return true;
  } catch (error) {
    console.error('Error tracking conversation event:', error);
    return false;
  }
}

/**
 * Generate analytics report
 */
export async function generateAnalyticsReport(
  businessId: string,
  period: 'day' | 'week' | 'month' | 'year' = 'month',
  format: 'json' | 'csv' | 'html' = 'json'
): Promise<string> {
  try {
    // Get detailed analytics
    const analytics = await getDetailedAnalytics(businessId, period);
    
    if (!analytics) {
      throw new Error('No analytics data available');
    }
    
    // Format the report based on the requested format
    switch (format) {
      case 'csv':
        return formatReportAsCsv(analytics);
      case 'html':
        return formatReportAsHtml(analytics);
      case 'json':
      default:
        return JSON.stringify(analytics, null, 2);
    }
  } catch (error) {
    console.error('Error generating analytics report:', error);
    return JSON.stringify({ error: 'Failed to generate report' });
  }
}

/**
 * Format report as CSV
 */
function formatReportAsCsv(analytics: ChatbotAnalytics): string {
  const { metrics } = analytics;
  
  // Basic metrics
  let csv = 'Metric,Value\n';
  csv += `Total Conversations,${metrics.totalConversations}\n`;
  csv += `Average Conversation Duration (seconds),${metrics.avgConversationDuration.toFixed(2)}\n`;
  csv += `Average Response Time (seconds),${metrics.avgResponseTime.toFixed(2)}\n`;
  csv += `Average Messages Per Conversation,${metrics.avgMessagesPerConversation.toFixed(2)}\n`;
  csv += `Resolution Rate,${(metrics.resolutionRate * 100).toFixed(2)}%\n`;
  csv += `Transfer Rate,${(metrics.transferRate * 100).toFixed(2)}%\n\n`;
  
  // Top intents
  csv += 'Top Intents\n';
  csv += 'Intent,Count,Percentage\n';
  metrics.topIntents.forEach(intent => {
    csv += `${intent.intent},${intent.count},${(intent.percentage * 100).toFixed(2)}%\n`;
  });
  csv += '\n';
  
  // Busy hours
  csv += 'Busy Hours\n';
  csv += 'Hour,Count\n';
  metrics.busyHours.forEach(hour => {
    csv += `${hour.hour}:00,${hour.count}\n`;
  });
  csv += '\n';
  
  // Busy days
  csv += 'Busy Days\n';
  csv += 'Day,Count\n';
  metrics.busyDays.forEach(day => {
    csv += `${day.day.charAt(0).toUpperCase() + day.day.slice(1)},${day.count}\n`;
  });
  
  return csv;
}

/**
 * Format report as HTML
 */
function formatReportAsHtml(analytics: ChatbotAnalytics): string {
  const { metrics } = analytics;
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Analytics Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      <h1>Analytics Report</h1>
      <p>Period: ${analytics.period} (${new Date(analytics.startDate).toLocaleDateString()} - ${new Date(analytics.endDate).toLocaleDateString()})</p>
      
      <h2>Basic Metrics</h2>
      <table>
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Total Conversations</td><td>${metrics.totalConversations}</td></tr>
        <tr><td>Average Conversation Duration</td><td>${metrics.avgConversationDuration.toFixed(2)} seconds</td></tr>
        <tr><td>Average Response Time</td><td>${metrics.avgResponseTime.toFixed(2)} seconds</td></tr>
        <tr><td>Average Messages Per Conversation</td><td>${metrics.avgMessagesPerConversation.toFixed(2)}</td></tr>
        <tr><td>Resolution Rate</td><td>${(metrics.resolutionRate * 100).toFixed(2)}%</td></tr>
        <tr><td>Transfer Rate</td><td>${(metrics.transferRate * 100).toFixed(2)}%</td></tr>
      </table>
      
      <h2>Top Intents</h2>
      <table>
        <tr><th>Intent</th><th>Count</th><th>Percentage</th></tr>
        ${metrics.topIntents.map(intent => `
          <tr>
            <td>${intent.intent}</td>
            <td>${intent.count}</td>
            <td>${(intent.percentage * 100).toFixed(2)}%</td>
          </tr>
        `).join('')}
      </table>
      
      <h2>Busy Hours</h2>
      <table>
        <tr><th>Hour</th><th>Count</th></tr>
        ${metrics.busyHours.map(hour => `
          <tr>
            <td>${hour.hour}:00</td>
            <td>${hour.count}</td>
          </tr>
        `).join('')}
      </table>
      
      <h2>Busy Days</h2>
      <table>
        <tr><th>Day</th><th>Count</th></tr>
        ${metrics.busyDays.map(day => `
          <tr>
            <td>${day.day.charAt(0).toUpperCase() + day.day.slice(1)}</td>
            <td>${day.count}</td>
          </tr>
        `).join('')}
      </table>
    </body>
    </html>
  `;
  
  return html;
}
