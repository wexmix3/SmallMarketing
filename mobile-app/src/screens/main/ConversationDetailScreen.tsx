/**
 * Conversation Detail Screen
 * 
 * This screen displays a conversation and allows the agent to respond.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

import { useTheme } from '../../contexts/ThemeContext';
import { conversationsApi } from '../../api/api';

// Define message type
interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: 'user' | 'assistant' | 'human-agent';
  timestamp: string;
  isRead: boolean;
  metadata?: Record<string, any>;
}

// Define conversation type
interface Conversation {
  id: string;
  status: 'active' | 'closed' | 'transferred';
  visitorName: string;
  visitorEmail: string;
  messages: Message[];
}

const ConversationDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  
  const { id } = route.params as { id: string };
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Load conversation and messages
  const loadConversation = async () => {
    try {
      setLoading(true);
      
      // Get conversation details
      const conversationResponse = await conversationsApi.getById(id);
      setConversation(conversationResponse.data);
      
      // Get messages
      const messagesResponse = await conversationsApi.getMessages(id);
      setMessages(messagesResponse.data);
    } catch (error) {
      console.error('Error loading conversation:', error);
      Alert.alert('Error', 'Failed to load conversation. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load conversation on mount
  useEffect(() => {
    loadConversation();
    
    // Set up polling for new messages
    const interval = setInterval(() => {
      if (!sending) {
        refreshMessages();
      }
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, [id]);
  
  // Refresh messages
  const refreshMessages = async () => {
    try {
      const messagesResponse = await conversationsApi.getMessages(id);
      setMessages(messagesResponse.data);
    } catch (error) {
      console.error('Error refreshing messages:', error);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadConversation();
  };
  
  // Send message
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      setSending(true);
      
      // Add message to UI immediately for better UX
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: id,
        content: message,
        sender: 'human-agent',
        timestamp: new Date().toISOString(),
        isRead: true
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      // Send message to API
      await conversationsApi.sendMessage(id, message);
      
      // Refresh messages to get the actual message from the server
      await refreshMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  // Close conversation
  const closeConversation = async () => {
    try {
      await conversationsApi.updateStatus(id, 'closed');
      
      // Update local state
      setConversation(prev => prev ? { ...prev, status: 'closed' } : null);
      
      // Show success message
      Alert.alert('Success', 'Conversation closed successfully.');
    } catch (error) {
      console.error('Error closing conversation:', error);
      Alert.alert('Error', 'Failed to close conversation. Please try again.');
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, 'h:mm a');
  };
  
  // Render message item
  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    const isAgent = item.sender === 'human-agent';
    const isAssistant = item.sender === 'assistant';
    
    // Determine message style based on sender
    const messageContainerStyle = [
      styles.messageContainer,
      isUser ? styles.userMessageContainer : null,
      isAgent ? styles.agentMessageContainer : null,
      isAssistant ? styles.assistantMessageContainer : null
    ];
    
    const messageBubbleStyle = [
      styles.messageBubble,
      isUser ? [styles.userMessageBubble, { backgroundColor: colors.primary }] : null,
      isAgent ? [styles.agentMessageBubble, { backgroundColor: colors.success }] : null,
      isAssistant ? [styles.assistantMessageBubble, { backgroundColor: isDark ? '#444' : '#e5e5ea' }] : null
    ];
    
    const messageTextStyle = [
      styles.messageText,
      isUser || isAgent ? { color: 'white' } : { color: isDark ? 'white' : 'black' }
    ];
    
    return (
      <View style={messageContainerStyle}>
        <View style={messageBubbleStyle}>
          <Text style={messageTextStyle}>{item.content}</Text>
          <Text style={styles.timestampText}>
            {formatTimestamp(item.timestamp)}
            {isAssistant && ' • AI'}
            {isAgent && ' • You'}
          </Text>
        </View>
      </View>
    );
  };
  
  // Render header with visitor info
  const renderHeader = () => {
    if (!conversation) return null;
    
    return (
      <View style={[styles.headerContainer, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}>
        <View style={styles.visitorInfo}>
          <Text style={[styles.visitorName, { color: colors.text }]}>
            {conversation.visitorName || 'Anonymous Visitor'}
          </Text>
          {conversation.visitorEmail && (
            <Text style={[styles.visitorEmail, { color: colors.secondary }]}>
              {conversation.visitorEmail}
            </Text>
          )}
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { 
              backgroundColor: 
                conversation.status === 'active' ? colors.primary :
                conversation.status === 'closed' ? colors.secondary :
                colors.warning
            }
          ]}>
            <Text style={styles.statusText}>
              {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  // Render loading state
  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading conversation...</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {renderHeader()}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      {conversation?.status === 'active' ? (
        <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: isDark ? '#333' : '#f5f5f5',
                color: colors.text,
                borderColor: colors.border
              }
            ]}
            placeholder="Type your message..."
            placeholderTextColor={colors.secondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.error }]}
              onPress={() => {
                Alert.alert(
                  'Close Conversation',
                  'Are you sure you want to close this conversation?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Close', onPress: closeConversation }
                  ]
                );
              }}
            >
              <Icon name="close-circle" size={20} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: colors.primary },
                !message.trim() && { opacity: 0.5 }
              ]}
              onPress={sendMessage}
              disabled={!message.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Icon name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={[styles.closedContainer, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}>
          <Icon name="lock" size={20} color={colors.secondary} />
          <Text style={[styles.closedText, { color: colors.secondary }]}>
            This conversation is {conversation?.status}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  visitorEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  statusContainer: {
    marginLeft: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-start',
  },
  agentMessageContainer: {
    alignSelf: 'flex-end',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  agentMessageBubble: {
    borderBottomRightRadius: 4,
  },
  assistantMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestampText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    paddingRight: 40,
    fontSize: 16,
    maxHeight: 120,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  closedContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  closedText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default ConversationDetailScreen;
