/**
 * Notification Service
 * 
 * This service handles push notifications and local notifications.
 */

import { Platform } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settingsApi } from '../api/api';

class NotificationServiceClass {
  /**
   * Initialize the notification service
   */
  async initialize() {
    try {
      // Request permission for iOS
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log('Push notifications not authorized');
          return false;
        }
      }

      // Get FCM token
      const token = await messaging().getToken();
      
      // Save token to storage
      await AsyncStorage.setItem('fcmToken', token);
      
      // Register token with backend if user is logged in
      try {
        await settingsApi.updateFcmToken(token);
      } catch (error) {
        // User might not be logged in yet, that's okay
        console.log('Could not register FCM token with backend:', error);
      }
      
      // Set up token refresh listener
      messaging().onTokenRefresh(async (newToken) => {
        await AsyncStorage.setItem('fcmToken', newToken);
        
        try {
          await settingsApi.updateFcmToken(newToken);
        } catch (error) {
          console.error('Error updating FCM token:', error);
        }
      });
      
      // Set up notification handlers
      this.setupNotificationHandlers();
      
      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }
  
  /**
   * Set up notification handlers
   */
  setupNotificationHandlers() {
    // Handle notifications when app is in foreground
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground notification received:', remoteMessage);
      this.displayLocalNotification(remoteMessage);
    });
    
    // Handle notification when app is in background and user taps on it
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage);
      this.handleNotificationTap(remoteMessage);
    });
    
    // Handle notification that opened the app from terminated state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Initial notification:', remoteMessage);
          this.handleNotificationTap(remoteMessage);
        }
      });
  }
  
  /**
   * Display a local notification
   */
  displayLocalNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    // For a complete implementation, you would use a library like react-native-push-notification
    // or react-native-notifications to display local notifications
    
    // For now, we'll just log the notification
    console.log('Would display notification:', {
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data
    });
    
    // In a real implementation, you would do something like:
    /*
    PushNotification.localNotification({
      channelId: 'default-channel',
      title: remoteMessage.notification?.title,
      message: remoteMessage.notification?.body || '',
      userInfo: remoteMessage.data
    });
    */
  }
  
  /**
   * Handle notification tap
   */
  handleNotificationTap(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    // Extract data from notification
    const data = remoteMessage.data || {};
    
    // Handle different notification types
    switch (data.type) {
      case 'new_conversation':
        // Navigate to conversation detail
        // You would use a navigation service or event emitter to handle this
        console.log('Navigate to conversation:', data.conversationId);
        break;
        
      case 'new_message':
        // Navigate to conversation detail
        console.log('Navigate to message:', data.conversationId);
        break;
        
      case 'human_handoff_request':
        // Navigate to conversation that needs human intervention
        console.log('Navigate to handoff request:', data.conversationId);
        break;
        
      default:
        // Default handling
        console.log('Unhandled notification type:', data.type);
    }
  }
  
  /**
   * Register device token with backend
   */
  async registerToken() {
    try {
      const token = await AsyncStorage.getItem('fcmToken');
      
      if (token) {
        await settingsApi.updateFcmToken(token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error registering token:', error);
      return false;
    }
  }
  
  /**
   * Unregister device token from backend
   */
  async unregisterToken() {
    try {
      await settingsApi.deleteFcmToken();
      return true;
    } catch (error) {
      console.error('Error unregistering token:', error);
      return false;
    }
  }
}

// Export as singleton
export const NotificationService = new NotificationServiceClass();
