/**
 * Dashboard Screen
 * 
 * This screen displays key metrics and recent activity for the business.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, PieChart } from 'react-native-chart-kit';

import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsApi, conversationsApi } from '../../api/api';

// Get screen width
const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  
  // Analytics data
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  
  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get analytics summary
      const analyticsResponse = await analyticsApi.getSummary(period);
      setAnalytics(analyticsResponse.data);
      
      // Get recent conversations
      const conversationsResponse = await conversationsApi.getAll({ 
        page: 1, 
        limit: 5 
      });
      setRecentConversations(conversationsResponse.data.conversations);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load data on mount and when period changes
  useEffect(() => {
    loadDashboardData();
  }, [period]);
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };
  
  // Render loading state
  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading dashboard...</Text>
      </View>
    );
  }
  
  // Prepare chart data
  const conversationData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: analytics?.conversationsByDay || [0, 0, 0, 0, 0, 0, 0],
        color: () => colors.primary,
        strokeWidth: 2
      }
    ],
    legend: ['Conversations']
  };
  
  const resolutionData = analytics?.resolutionRate ? [
    {
      name: 'Resolved',
      population: analytics.resolutionRate * 100,
      color: colors.success,
      legendFontColor: colors.text,
      legendFontSize: 12
    },
    {
      name: 'Transferred',
      population: analytics.transferRate * 100,
      color: colors.warning,
      legendFontColor: colors.text,
      legendFontSize: 12
    }
  ] : [];
  
  const chartConfig = {
    backgroundGradientFrom: isDark ? '#333' : '#fff',
    backgroundGradientTo: isDark ? '#333' : '#fff',
    decimalPlaces: 0,
    color: () => colors.primary,
    labelColor: () => colors.text,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary
    }
  };
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Welcome back, {user?.name || 'User'}
        </Text>
        <Text style={[styles.businessName, { color: colors.primary }]}>
          {user?.businessId || 'Your Business'}
        </Text>
      </View>
      
      {/* Period Selector */}
      <View style={[styles.periodSelector, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            period === 'day' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setPeriod('day')}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: period === 'day' ? 'white' : colors.text }
            ]}
          >
            Day
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.periodButton,
            period === 'week' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setPeriod('week')}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: period === 'week' ? 'white' : colors.text }
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.periodButton,
            period === 'month' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setPeriod('month')}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: period === 'month' ? 'white' : colors.text }
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Metrics Cards */}
      <View style={styles.metricsContainer}>
        <View style={[styles.metricCard, { backgroundColor: isDark ? '#222' : 'white' }]}>
          <View style={[styles.metricIconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <Icon name="chat-processing" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {analytics?.totalConversations || 0}
          </Text>
          <Text style={[styles.metricLabel, { color: colors.secondary }]}>
            Conversations
          </Text>
        </View>
        
        <View style={[styles.metricCard, { backgroundColor: isDark ? '#222' : 'white' }]}>
          <View style={[styles.metricIconContainer, { backgroundColor: `${colors.success}20` }]}>
            <Icon name="check-circle" size={24} color={colors.success} />
          </View>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {analytics?.resolutionRate 
              ? `${(analytics.resolutionRate * 100).toFixed(0)}%` 
              : '0%'}
          </Text>
          <Text style={[styles.metricLabel, { color: colors.secondary }]}>
            Resolution Rate
          </Text>
        </View>
        
        <View style={[styles.metricCard, { backgroundColor: isDark ? '#222' : 'white' }]}>
          <View style={[styles.metricIconContainer, { backgroundColor: `${colors.warning}20` }]}>
            <Icon name="clock-outline" size={24} color={colors.warning} />
          </View>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {analytics?.avgResponseTime 
              ? `${analytics.avgResponseTime.toFixed(1)}s` 
              : '0s'}
          </Text>
          <Text style={[styles.metricLabel, { color: colors.secondary }]}>
            Avg. Response Time
          </Text>
        </View>
        
        <View style={[styles.metricCard, { backgroundColor: isDark ? '#222' : 'white' }]}>
          <View style={[styles.metricIconContainer, { backgroundColor: `${colors.info}20` }]}>
            <Icon name="message-text" size={24} color={colors.info} />
          </View>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {analytics?.avgMessagesPerConversation 
              ? analytics.avgMessagesPerConversation.toFixed(1) 
              : '0'}
          </Text>
          <Text style={[styles.metricLabel, { color: colors.secondary }]}>
            Avg. Messages
          </Text>
        </View>
      </View>
      
      {/* Conversations Chart */}
      <View style={[styles.chartCard, { backgroundColor: isDark ? '#222' : 'white' }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Conversations Over Time
        </Text>
        <LineChart
          data={conversationData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
      
      {/* Resolution Rate Chart */}
      {resolutionData.length > 0 && (
        <View style={[styles.chartCard, { backgroundColor: isDark ? '#222' : 'white' }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Resolution Rate
          </Text>
          <PieChart
            data={resolutionData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}
      
      {/* Recent Conversations */}
      <View style={[styles.sectionCard, { backgroundColor: isDark ? '#222' : 'white' }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Conversations
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Conversations')}
          >
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        
        {recentConversations.length > 0 ? (
          recentConversations.map((conversation, index) => (
            <TouchableOpacity
              key={conversation.id}
              style={[
                styles.conversationItem,
                index < recentConversations.length - 1 && 
                  [styles.itemBorder, { borderBottomColor: colors.border }]
              ]}
              onPress={() => 
                navigation.navigate('Conversations', {
                  screen: 'ConversationDetail',
                  params: { 
                    id: conversation.id,
                    title: conversation.visitorName || 'Visitor'
                  }
                })
              }
            >
              <View style={styles.conversationInfo}>
                <Text style={[styles.conversationName, { color: colors.text }]}>
                  {conversation.visitorName || 'Anonymous Visitor'}
                </Text>
                <Text style={[styles.conversationPreview, { color: colors.secondary }]} numberOfLines={1}>
                  {conversation.lastMessage || 'No messages yet'}
                </Text>
              </View>
              
              <View style={styles.conversationMeta}>
                <Text style={[styles.conversationTime, { color: colors.secondary }]}>
                  {new Date(conversation.lastMessageTime || conversation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {conversation.unreadCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.secondary }]}>
              No recent conversations
            </Text>
          </View>
        )}
      </View>
      
      {/* Quick Actions */}
      <View style={[styles.sectionCard, { backgroundColor: isDark ? '#222' : 'white' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('KnowledgeBase')}
          >
            <Icon name="book-open-variant" size={24} color="white" />
            <Text style={styles.actionText}>Knowledge Base</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Icon name="chart-bar" size={24} color="white" />
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.info }]}
            onPress={() => navigation.navigate('Settings', { screen: 'Integrations' })}
          >
            <Icon name="puzzle" size={24} color="white" />
            <Text style={styles.actionText}>Integrations</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  periodButtonText: {
    fontWeight: '500',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
  },
  chartCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  sectionCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
  },
  conversationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  conversationPreview: {
    fontSize: 14,
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  conversationTime: {
    fontSize: 12,
    marginBottom: 4,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '30%',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    marginTop: 8,
    fontWeight: '500',
  },
});

export default DashboardScreen;
