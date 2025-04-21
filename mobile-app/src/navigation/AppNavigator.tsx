/**
 * App Navigator
 * 
 * This component handles the navigation structure of the app.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import ConversationsScreen from '../screens/main/ConversationsScreen';
import ConversationDetailScreen from '../screens/main/ConversationDetailScreen';
import KnowledgeBaseScreen from '../screens/main/KnowledgeBaseScreen';
import AnalyticsScreen from '../screens/main/AnalyticsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import IntegrationsScreen from '../screens/main/IntegrationsScreen';

// Stack Navigators
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const ConversationsStack = createNativeStackNavigator();
const KnowledgeBaseStack = createNativeStackNavigator();
const AnalyticsStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

// Tab Navigator
const MainTab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Conversations Stack Navigator
const ConversationsNavigator = () => (
  <ConversationsStack.Navigator>
    <ConversationsStack.Screen 
      name="ConversationsList" 
      component={ConversationsScreen} 
      options={{ title: 'Conversations' }}
    />
    <ConversationsStack.Screen 
      name="ConversationDetail" 
      component={ConversationDetailScreen}
      options={({ route }) => ({ 
        title: route.params?.title || 'Conversation' 
      })}
    />
  </ConversationsStack.Navigator>
);

// Knowledge Base Stack Navigator
const KnowledgeBaseNavigator = () => (
  <KnowledgeBaseStack.Navigator>
    <KnowledgeBaseStack.Screen 
      name="KnowledgeBaseMain" 
      component={KnowledgeBaseScreen} 
      options={{ title: 'Knowledge Base' }}
    />
  </KnowledgeBaseStack.Navigator>
);

// Analytics Stack Navigator
const AnalyticsNavigator = () => (
  <AnalyticsStack.Navigator>
    <AnalyticsStack.Screen 
      name="AnalyticsMain" 
      component={AnalyticsScreen} 
      options={{ title: 'Analytics' }}
    />
  </AnalyticsStack.Navigator>
);

// Settings Stack Navigator
const SettingsNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen 
      name="SettingsMain" 
      component={SettingsScreen} 
      options={{ title: 'Settings' }}
    />
    <SettingsStack.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ title: 'Profile' }}
    />
    <SettingsStack.Screen 
      name="Integrations" 
      component={IntegrationsScreen} 
      options={{ title: 'Integrations' }}
    />
  </SettingsStack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerShown: false,
      }}
    >
      <MainTab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen 
        name="Conversations" 
        component={ConversationsNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chat" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen 
        name="KnowledgeBase" 
        component={KnowledgeBaseNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open-variant" color={color} size={size} />
          ),
          tabBarLabel: 'Knowledge',
        }}
      />
      <MainTab.Screen 
        name="Analytics" 
        component={AnalyticsNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-bar" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen 
        name="Settings" 
        component={SettingsNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    // TODO: Return a splash screen or loading indicator
    return null;
  }
  
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <MainStack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <MainStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </MainStack.Navigator>
  );
};

export default AppNavigator;
