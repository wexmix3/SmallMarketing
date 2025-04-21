/**
 * AI Customer Service Assistant Mobile App
 * 
 * Main application component
 */

import React, { useEffect } from 'react';
import { StatusBar, LogBox, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { NotificationService } from './src/services/NotificationService';

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

const App = () => {
  // Initialize push notifications
  useEffect(() => {
    const initNotifications = async () => {
      // Request permission for iOS
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      }

      // Get FCM token
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      // Listen for token refresh
      const unsubscribe = messaging().onTokenRefresh(newToken => {
        console.log('FCM Token refreshed:', newToken);
        // TODO: Send to backend
      });

      // Handle foreground messages
      const messageUnsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Foreground Message:', remoteMessage);
        NotificationService.displayLocalNotification(remoteMessage);
      });

      return () => {
        unsubscribe();
        messageUnsubscribe();
      };
    };

    initNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AuthProvider>
              <NavigationContainer>
                <StatusBar barStyle="dark-content" />
                <AppNavigator />
              </NavigationContainer>
            </AuthProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
