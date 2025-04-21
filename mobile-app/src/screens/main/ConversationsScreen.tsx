/**
 * Conversations Screen
 * 
 * This screen displays a list of conversations and allows filtering.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, isToday, isYesterday } from 'date-fns';

import { useTheme } from '../../contexts/ThemeContext';
import { conversationsApi } from '../../api/api';

// Define conversation type
interface Conversation {
  id: string;
  status: 'active' | 'closed' | 'transferred';
  source: string;
  visitorName: string;
  visitorEmail: string;
  startTime: string;
  endTime: string | null;
  lastMessageTime: string;
  messageCount: number;
  unreadCount: number;
  tags: string[];
}

// Define filter type
type FilterStatus = 'all' | 'active' | 'closed' | 'transferred';

const ConversationsScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Load conversations
  const loadConversations = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(1);
      } else if (!refresh && !hasMore) {
        return;
      } else {
        setLoading(true);
      }
      
      const currentPage = refresh ? 1 : page;
      
      // Prepare API params
      const params: { status?: string; page: number; limit: number } = {
        page: currentPage,
        limit: 20
      };
      
      // Add status filter if not 'all'
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      
      // Fetch conversations
      const response = await conversationsApi.getAll(params);
      const data = response.data;
      
      // Update state
      if (refresh) {
        setConversations(data.conversations);
      } else {
        setConversations(prev => [...prev, ...data.conversations]);
      }
      
      setHasMore(data.hasMore);
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Error loading conversations:', error);
      Alert.alert('Error', 'Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterStatus, page, hasMore]);
  
  // Load conversations on mount and when filter changes
  useEffect(() => {
    loadConversations(true);
  }, [filterStatus]);
  
  // Refresh conversations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadConversations(true);
    }, [])
  );
  
  // Handle refresh
  const handleRefresh = () => {
    loadConversations(true);
  };
  
  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadConversations();
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };
  
  // Render conversation item
  const renderItem = ({ item }: { item: Conversation }) => {
    // Determine status icon and color
    let statusIcon = 'message-text';
    let statusColor = colors.primary;
    
    if (item.status === 'closed') {
      statusIcon = 'message-text-outline';
      statusColor = colors.secondary;
    } else if (item.status === 'transferred') {
      statusIcon = 'message-arrow-right';
      statusColor = colors.warning;
    }
    
    return (
      <TouchableOpacity
        style={[
          styles.conversationItem,
          { backgroundColor: colors.card, borderColor: colors.border }
        ]}
        onPress={() => 
          navigation.navigate('ConversationDetail', { 
            id: item.id,
            title: item.visitorName || 'Visitor'
          })
        }
      >
        <View style={styles.conversationHeader}>
          <View style={styles.nameContainer}>
            <Icon name={statusIcon} size={20} color={statusColor} style={styles.statusIcon} />
            <Text style={[styles.visitorName, { color: colors.text }]}>
              {item.visitorName || 'Anonymous Visitor'}
            </Text>
          </View>
          <Text style={[styles.timeText, { color: colors.secondary }]}>
            {formatDate(item.lastMessageTime || item.startTime)}
          </Text>
        </View>
        
        <View style={styles.conversationInfo}>
          <Text 
            style={[styles.emailText, { color: colors.secondary }]}
            numberOfLines={1}
          >
            {item.visitorEmail || 'No email provided'}
          </Text>
          
          <View style={styles.badgeContainer}>
            {item.unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        
        {item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View 
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: isDark ? '#333' : '#f0f0f0' }
                ]}
              >
                <Text style={[styles.tagText, { color: colors.text }]}>
                  {tag}
                </Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <Text style={[styles.moreTagsText, { color: colors.secondary }]}>
                +{item.tags.length - 3}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  // Render filter tabs
  const renderFilterTabs = () => {
    const tabs: { label: string; value: FilterStatus }[] = [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Closed', value: 'closed' },
      { label: 'Transferred', value: 'transferred' }
    ];
    
    return (
      <View style={[styles.filterContainer, { borderColor: colors.border }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[
              styles.filterTab,
              filterStatus === tab.value && { 
                borderBottomWidth: 2,
                borderBottomColor: colors.primary
              }
            ]}
            onPress={() => setFilterStatus(tab.value)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterStatus === tab.value ? colors.primary : colors.text }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Render footer (loading indicator)
  const renderFooter = () => {
    if (!loading || refreshing) return null;
    
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };
  
  // Render empty state
  const renderEmpty = () => {
    if (loading && !refreshing) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Icon name="chat-remove" size={60} color={colors.secondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No conversations found
        </Text>
        <Text style={[styles.emptyText, { color: colors.secondary }]}>
          {filterStatus === 'all'
            ? 'You don\'t have any conversations yet.'
            : `You don't have any ${filterStatus} conversations.`}
        </Text>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderFilterTabs()}
      
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  conversationItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 8,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
  },
  conversationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emailText: {
    fontSize: 14,
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
  },
  moreTagsText: {
    fontSize: 12,
    marginTop: 4,
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ConversationsScreen;
