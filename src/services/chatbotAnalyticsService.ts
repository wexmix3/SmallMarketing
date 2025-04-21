/**
 * Chatbot Analytics Service
 * 
 * This service tracks and analyzes chatbot interactions, providing insights
 * into usage patterns, performance metrics, and customer satisfaction.
 */

import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { 
  AnalyticsSummary,
  TimeSeriesData,
  ConversationMetrics,
  IntentDistribution,
  PerformanceMetrics
} from '../types/chatbot';

export class ChatbotAnalyticsService {
  private db: Pool;
  
  constructor(dbConnection: Pool) {
    this.db = dbConnection;
  }
  
  /**
   * Track conversation start
   */
  async trackConversationStart(
    businessId: string,
    conversationId: string,
    source: string
  ): Promise<void> {
    try {
      const eventId = uuidv4();
      const now = new Date();
      
      await this.db.query(
        `INSERT INTO analytics_events 
         (id, business_id, conversation_id, event_type, event_data, timestamp, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          eventId,
          businessId,
          conversationId,
          'conversation_start',
          { source },
          now,
          now
        ]
      );
      
      // Update daily metrics
      await this.incrementDailyMetric(businessId, 'conversations_started', 1);
      await this.incrementDailyMetric(businessId, `source_${source}`, 1);
    } catch (error) {
      console.error('Error tracking conversation start:', error);
    }
  }
  
  /**
   * Track message
   */
  async trackMessage(
    businessId: string,
    conversationId: string,
    messageId: string,
    sender: string,
    messageLength: number
  ): Promise<void> {
    try {
      const eventId = uuidv4();
      const now = new Date();
      
      await this.db.query(
        `INSERT INTO analytics_events 
         (id, business_id, conversation_id, message_id, event_type, event_data, timestamp, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          eventId,
          businessId,
          conversationId,
          messageId,
          'message',
          { sender, messageLength },
          now,
          now
        ]
      );
      
      // Update daily metrics
      await this.incrementDailyMetric(businessId, 'total_messages', 1);
      await this.incrementDailyMetric(businessId, `${sender}_messages`, 1);
    } catch (error) {
      console.error('Error tracking message:', error);
    }
  }
  
  /**
   * Track AI response
   */
  async trackAIResponse(
    businessId: string,
    conversationId: string,
    intentType: string,
    confidence: number,
    source: string,
    requiresHumanIntervention: boolean
  ): Promise<void> {
    try {
      const eventId = uuidv4();
      const now = new Date();
      
      await this.db.query(
        `INSERT INTO analytics_events 
         (id, business_id, conversation_id, event_type, event_data, timestamp, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          eventId,
          businessId,
          conversationId,
          'ai_response',
          { intentType, confidence, source, requiresHumanIntervention },
          now,
          now
        ]
      );
      
      // Update daily metrics
      await this.incrementDailyMetric(businessId, 'ai_responses', 1);
      await this.incrementDailyMetric(businessId, `intent_${intentType}`, 1);
      await this.incrementDailyMetric(businessId, `source_${source}`, 1);
      
      if (requiresHumanIntervention) {
        await this.incrementDailyMetric(businessId, 'human_interventions', 1);
      }
      
      // Update average confidence
      await this.updateAverageMetric(businessId, 'avg_confidence', confidence);
    } catch (error) {
      console.error('Error tracking AI response:', error);
    }
  }
  
  /**
   * Track conversation status change
   */
  async trackConversationStatusChange(
    businessId: string,
    conversationId: string,
    status: string
  ): Promise<void> {
    try {
      const eventId = uuidv4();
      const now = new Date();
      
      await this.db.query(
        `INSERT INTO analytics_events 
         (id, business_id, conversation_id, event_type, event_data, timestamp, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          eventId,
          businessId,
          conversationId,
          'status_change',
          { status },
          now,
          now
        ]
      );
      
      // Update daily metrics
      await this.incrementDailyMetric(businessId, `status_${status}`, 1);
      
      // If conversation is closed, calculate duration
      if (status === 'closed') {
        // Get conversation start time
        const result = await this.db.query(
          `SELECT start_time FROM conversations WHERE id = $1`,
          [conversationId]
        );
        
        if (result.rows.length > 0) {
          const startTime = new Date(result.rows[0].start_time);
          const duration = (now.getTime() - startTime.getTime()) / 1000; // in seconds
          
          // Update average duration
          await this.updateAverageMetric(businessId, 'avg_conversation_duration', duration);
        }
      }
    } catch (error) {
      console.error('Error tracking conversation status change:', error);
    }
  }
  
  /**
   * Track user feedback
   */
  async trackUserFeedback(
    businessId: string,
    conversationId: string,
    rating: number,
    feedback?: string
  ): Promise<void> {
    try {
      const eventId = uuidv4();
      const now = new Date();
      
      await this.db.query(
        `INSERT INTO analytics_events 
         (id, business_id, conversation_id, event_type, event_data, timestamp, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          eventId,
          businessId,
          conversationId,
          'user_feedback',
          { rating, feedback },
          now,
          now
        ]
      );
      
      // Update daily metrics
      await this.incrementDailyMetric(businessId, 'feedback_count', 1);
      await this.updateAverageMetric(businessId, 'avg_satisfaction', rating);
    } catch (error) {
      console.error('Error tracking user feedback:', error);
    }
  }
  
  /**
   * Get analytics summary for a business
   */
  async getAnalyticsSummary(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsSummary> {
    try {
      // Get conversation metrics
      const conversationMetrics = await this.getConversationMetrics(businessId, startDate, endDate);
      
      // Get message metrics
      const messageMetrics = await this.getMessageMetrics(businessId, startDate, endDate);
      
      // Get performance metrics
      const performanceMetrics = await this.getPerformanceMetrics(businessId, startDate, endDate);
      
      // Get intent distribution
      const intentDistribution = await this.getIntentDistribution(businessId, startDate, endDate);
      
      return {
        timeframe: {
          startDate,
          endDate
        },
        conversations: conversationMetrics,
        messages: messageMetrics,
        performance: performanceMetrics,
        intents: intentDistribution
      };
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      return {
        timeframe: {
          startDate,
          endDate
        },
        conversations: {
          total: 0,
          active: 0,
          closed: 0,
          transferred: 0,
          avgDuration: 0
        },
        messages: {
          total: 0,
          fromUsers: 0,
          fromAssistant: 0,
          fromHumans: 0,
          avgPerConversation: 0
        },
        performance: {
          avgResponseTime: 0,
          resolutionRate: 0,
          transferRate: 0,
          satisfactionScore: 0
        },
        intents: []
      };
    }
  }
  
  /**
   * Get time series data for a metric
   */
  async getTimeSeriesData(
    businessId: string,
    metric: string,
    startDate: Date,
    endDate: Date,
    interval: 'day' | 'week' | 'month' = 'day'
  ): Promise<TimeSeriesData[]> {
    try {
      let intervalSql;
      
      switch (interval) {
        case 'week':
          intervalSql = "date_trunc('week', date)";
          break;
        case 'month':
          intervalSql = "date_trunc('month', date)";
          break;
        default:
          intervalSql = "date";
      }
      
      const result = await this.db.query(
        `SELECT ${intervalSql} as period, SUM(${metric}) as value
         FROM analytics_daily_metrics
         WHERE business_id = $1 AND date BETWEEN $2 AND $3
         GROUP BY period
         ORDER BY period ASC`,
        [businessId, startDate, endDate]
      );
      
      return result.rows.map(row => ({
        date: row.period,
        value: parseFloat(row.value)
      }));
    } catch (error) {
      console.error('Error getting time series data:', error);
      return [];
    }
  }
  
  /**
   * Get conversation metrics
   */
  private async getConversationMetrics(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ConversationMetrics> {
    try {
      // Get total conversations
      const totalResult = await this.db.query(
        `SELECT COUNT(*) as count
         FROM conversations
         WHERE business_id = $1 AND start_time BETWEEN $2 AND $3`,
        [businessId, startDate, endDate]
      );
      
      const total = parseInt(totalResult.rows[0].count);
      
      // Get conversations by status
      const statusResult = await this.db.query(
        `SELECT status, COUNT(*) as count
         FROM conversations
         WHERE business_id = $1 AND start_time BETWEEN $2 AND $3
         GROUP BY status`,
        [businessId, startDate, endDate]
      );
      
      const statusCounts = statusResult.rows.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count);
        return acc;
      }, { active: 0, closed: 0, transferred: 0 });
      
      // Get average duration of closed conversations
      const durationResult = await this.db.query(
        `SELECT AVG(EXTRACT(EPOCH FROM (end_time - start_time))) as avg_duration
         FROM conversations
         WHERE business_id = $1 AND start_time BETWEEN $2 AND $3 AND status = 'closed' AND end_time IS NOT NULL`,
        [businessId, startDate, endDate]
      );
      
      const avgDuration = durationResult.rows[0].avg_duration ? parseFloat(durationResult.rows[0].avg_duration) : 0;
      
      return {
        total,
        active: statusCounts.active || 0,
        closed: statusCounts.closed || 0,
        transferred: statusCounts.transferred || 0,
        avgDuration
      };
    } catch (error) {
      console.error('Error getting conversation metrics:', error);
      return {
        total: 0,
        active: 0,
        closed: 0,
        transferred: 0,
        avgDuration: 0
      };
    }
  }
  
  /**
   * Get message metrics
   */
  private async getMessageMetrics(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      // Get total messages and breakdown by sender
      const messageResult = await this.db.query(
        `SELECT sender, COUNT(*) as count
         FROM messages m
         JOIN conversations c ON m.conversation_id = c.id
         WHERE c.business_id = $1 AND m.timestamp BETWEEN $2 AND $3
         GROUP BY sender`,
        [businessId, startDate, endDate]
      );
      
      const messageCounts = messageResult.rows.reduce((acc, row) => {
        acc[row.sender] = parseInt(row.count);
        return acc;
      }, { user: 0, assistant: 0, 'human-agent': 0 });
      
      const total = Object.values(messageCounts).reduce((sum: any, count: any) => sum + count, 0);
      
      // Get average messages per conversation
      const avgResult = await this.db.query(
        `SELECT AVG(message_count) as avg_messages
         FROM (
           SELECT c.id, COUNT(m.id) as message_count
           FROM conversations c
           LEFT JOIN messages m ON c.id = m.conversation_id
           WHERE c.business_id = $1 AND c.start_time BETWEEN $2 AND $3
           GROUP BY c.id
         ) as conversation_messages`,
        [businessId, startDate, endDate]
      );
      
      const avgPerConversation = avgResult.rows[0].avg_messages ? parseFloat(avgResult.rows[0].avg_messages) : 0;
      
      return {
        total,
        fromUsers: messageCounts.user || 0,
        fromAssistant: messageCounts.assistant || 0,
        fromHumans: messageCounts['human-agent'] || 0,
        avgPerConversation
      };
    } catch (error) {
      console.error('Error getting message metrics:', error);
      return {
        total: 0,
        fromUsers: 0,
        fromAssistant: 0,
        fromHumans: 0,
        avgPerConversation: 0
      };
    }
  }
  
  /**
   * Get performance metrics
   */
  private async getPerformanceMetrics(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceMetrics> {
    try {
      // Get average response time
      const responseTimeResult = await this.db.query(
        `WITH user_messages AS (
           SELECT 
             m.conversation_id,
             m.timestamp as user_time,
             m.id as user_message_id
           FROM messages m
           JOIN conversations c ON m.conversation_id = c.id
           WHERE c.business_id = $1 
             AND m.timestamp BETWEEN $2 AND $3
             AND m.sender = 'user'
         ),
         response_times AS (
           SELECT 
             um.conversation_id,
             um.user_message_id,
             MIN(m.timestamp) - um.user_time as response_time
           FROM user_messages um
           JOIN messages m ON um.conversation_id = m.conversation_id
           WHERE m.sender IN ('assistant', 'human-agent')
             AND m.timestamp > um.user_time
           GROUP BY um.conversation_id, um.user_message_id, um.user_time
         )
         SELECT AVG(EXTRACT(EPOCH FROM response_time)) as avg_response_time
         FROM response_times`,
        [businessId, startDate, endDate]
      );
      
      const avgResponseTime = responseTimeResult.rows[0].avg_response_time 
        ? parseFloat(responseTimeResult.rows[0].avg_response_time) 
        : 0;
      
      // Get resolution rate (percentage of conversations closed without transfer)
      const resolutionResult = await this.db.query(
        `SELECT 
           COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_count,
           COUNT(*) as total_count
         FROM conversations
         WHERE business_id = $1 
           AND start_time BETWEEN $2 AND $3
           AND (status = 'closed' OR status = 'transferred')`,
        [businessId, startDate, endDate]
      );
      
      const closedCount = parseInt(resolutionResult.rows[0].closed_count) || 0;
      const totalResolvedCount = parseInt(resolutionResult.rows[0].total_count) || 0;
      
      const resolutionRate = totalResolvedCount > 0 ? closedCount / totalResolvedCount : 0;
      
      // Get transfer rate
      const transferRate = totalResolvedCount > 0 ? 1 - resolutionRate : 0;
      
      // Get average satisfaction score
      const satisfactionResult = await this.db.query(
        `SELECT AVG(CAST((event_data->>'rating') AS FLOAT)) as avg_satisfaction
         FROM analytics_events
         WHERE business_id = $1 
           AND timestamp BETWEEN $2 AND $3
           AND event_type = 'user_feedback'`,
        [businessId, startDate, endDate]
      );
      
      const satisfactionScore = satisfactionResult.rows[0].avg_satisfaction 
        ? parseFloat(satisfactionResult.rows[0].avg_satisfaction) 
        : 0;
      
      return {
        avgResponseTime,
        resolutionRate,
        transferRate,
        satisfactionScore
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return {
        avgResponseTime: 0,
        resolutionRate: 0,
        transferRate: 0,
        satisfactionScore: 0
      };
    }
  }
  
  /**
   * Get intent distribution
   */
  private async getIntentDistribution(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IntentDistribution[]> {
    try {
      const result = await this.db.query(
        `SELECT 
           event_data->>'intentType' as intent,
           COUNT(*) as count
         FROM analytics_events
         WHERE business_id = $1 
           AND timestamp BETWEEN $2 AND $3
           AND event_type = 'ai_response'
           AND event_data->>'intentType' IS NOT NULL
         GROUP BY event_data->>'intentType'
         ORDER BY count DESC`,
        [businessId, startDate, endDate]
      );
      
      const total = result.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
      
      return result.rows.map(row => ({
        intent: row.intent,
        count: parseInt(row.count),
        percentage: total > 0 ? parseInt(row.count) / total : 0
      }));
    } catch (error) {
      console.error('Error getting intent distribution:', error);
      return [];
    }
  }
  
  /**
   * Increment a daily metric
   */
  private async incrementDailyMetric(
    businessId: string,
    metric: string,
    value: number
  ): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if record exists for today
      const checkResult = await this.db.query(
        `SELECT 1 FROM analytics_daily_metrics 
         WHERE business_id = $1 AND date = $2`,
        [businessId, today]
      );
      
      if (checkResult.rows.length === 0) {
        // Create new record for today
        await this.db.query(
          `INSERT INTO analytics_daily_metrics 
           (business_id, date, ${metric}, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [businessId, today, value, new Date(), new Date()]
        );
      } else {
        // Update existing record
        await this.db.query(
          `UPDATE analytics_daily_metrics 
           SET ${metric} = COALESCE(${metric}, 0) + $1, updated_at = $2
           WHERE business_id = $3 AND date = $4`,
          [value, new Date(), businessId, today]
        );
      }
    } catch (error) {
      console.error(`Error incrementing daily metric ${metric}:`, error);
    }
  }
  
  /**
   * Update an average metric
   */
  private async updateAverageMetric(
    businessId: string,
    metric: string,
    value: number
  ): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get current count and average
      const result = await this.db.query(
        `SELECT ${metric}, ${metric}_count FROM analytics_daily_metrics 
         WHERE business_id = $1 AND date = $2`,
        [businessId, today]
      );
      
      if (result.rows.length === 0) {
        // Create new record for today
        await this.db.query(
          `INSERT INTO analytics_daily_metrics 
           (business_id, date, ${metric}, ${metric}_count, created_at, updated_at)
           VALUES ($1, $2, $3, 1, $4, $5)`,
          [businessId, today, value, new Date(), new Date()]
        );
      } else {
        const currentAvg = result.rows[0][metric] || 0;
        const currentCount = result.rows[0][`${metric}_count`] || 0;
        
        // Calculate new average
        const newCount = currentCount + 1;
        const newAvg = ((currentAvg * currentCount) + value) / newCount;
        
        // Update existing record
        await this.db.query(
          `UPDATE analytics_daily_metrics 
           SET ${metric} = $1, ${metric}_count = $2, updated_at = $3
           WHERE business_id = $4 AND date = $5`,
          [newAvg, newCount, new Date(), businessId, today]
        );
      }
    } catch (error) {
      console.error(`Error updating average metric ${metric}:`, error);
    }
  }
}
