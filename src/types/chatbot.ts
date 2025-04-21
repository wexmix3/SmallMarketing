/**
 * Chatbot Types
 * 
 * This file contains TypeScript type definitions for the AI Customer Service Assistant.
 */

// Business Information
export interface BusinessInfo {
  id: string;
  name: string;
  industry: string;
  description: string;
  hours: BusinessHours[];
  contact: ContactInfo;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface BusinessHours {
  day: DayOfWeek;
  open: string; // Format: "HH:MM" in 24-hour format
  close: string; // Format: "HH:MM" in 24-hour format
  isClosed: boolean;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

// Chatbot Configuration
export interface ChatbotConfig {
  id: string;
  businessId: string;
  name: string;
  welcomeMessage: string;
  fallbackMessage: string;
  transferMessage?: string;
  offlineMessage?: string;
  appearance: AppearanceSettings;
  behavior: BehaviorSettings;
  integrations: IntegrationSettings;
  aiSettings: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'custom';
  position: 'left' | 'right';
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  customCSS?: string;
  logoUrl?: string;
  avatarUrl?: string;
}

export interface BehaviorSettings {
  autoShowDelay?: number; // in seconds
  collectEmail: boolean;
  collectName: boolean;
  requireContactInfo: boolean;
  showTypingIndicator: boolean;
  enableFileUploads: boolean;
  maxAttachmentSize?: number; // in bytes
}

export interface IntegrationSettings {
  calendarType?: 'google' | 'outlook' | 'calendly' | 'custom';
  calendarId?: string;
  crmType?: 'salesforce' | 'hubspot' | 'zoho' | 'custom';
  crmId?: string;
  emailMarketing?: boolean;
  emailMarketingProvider?: string;
}

// Knowledge Base
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  inStock: boolean;
  attributes?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration?: number; // in minutes
  imageUrl?: string;
  category?: string;
  tags?: string[];
  availability?: BusinessHours[];
  attributes?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomEntity {
  id: string;
  type: string;
  name: string;
  fields: Record<string, any>;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Conversation
export type MessageSender = 'user' | 'assistant' | 'human-agent';
export type ConversationStatus = 'active' | 'closed' | 'transferred';
export type ConversationSource = 'website' | 'facebook' | 'instagram' | 'other';

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number; // in bytes
  url: string;
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  attachments?: Attachment[];
  metadata?: Record<string, any>;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  businessId: string;
  visitorId: string;
  visitorName?: string;
  visitorEmail?: string;
  startTime: Date;
  endTime?: Date;
  status: ConversationStatus;
  source: ConversationSource;
  messages: Message[];
  tags?: string[];
  assignedTo?: string; // User ID of human agent
  metadata?: Record<string, any>;
}

// AI Processing
export interface ConversationContext {
  conversationId: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  visitorInfo?: {
    name?: string;
    email?: string;
  };
}

export interface Intent {
  type: string;
  confidence: number;
  entityId?: string;
}

export interface AIResponse {
  text: string;
  intent: Intent;
  confidence: number;
  source: 'ai' | 'faq' | 'fallback';
  requiresHumanIntervention: boolean;
  suggestedActions: Array<{ text: string, value: string }>;
}

// Analytics
export interface AnalyticsSummary {
  timeframe: {
    startDate: Date;
    endDate: Date;
  };
  conversations: ConversationMetrics;
  messages: {
    total: number;
    fromUsers: number;
    fromAssistant: number;
    fromHumans: number;
    avgPerConversation: number;
  };
  performance: PerformanceMetrics;
  intents: IntentDistribution[];
}

export interface ConversationMetrics {
  total: number;
  active: number;
  closed: number;
  transferred: number;
  avgDuration: number; // in seconds
}

export interface PerformanceMetrics {
  avgResponseTime: number; // in seconds
  resolutionRate: number; // 0-1
  transferRate: number; // 0-1
  satisfactionScore: number; // 0-5
}

export interface IntentDistribution {
  intent: string;
  count: number;
  percentage: number; // 0-1
}

export interface TimeSeriesData {
  date: Date;
  value: number;
}

// Embedding Script
export interface EmbedOptions {
  theme?: 'light' | 'dark' | 'custom';
  position?: 'left' | 'right';
  primaryColor?: string;
  autoOpen?: boolean;
  collectVisitorInfo?: boolean;
}

// Admin Dashboard
export interface ChatbotStats {
  activeConversations: number;
  totalConversations: number;
  avgResponseTime: number;
  resolutionRate: number;
  satisfactionScore: number;
}

// User Feedback
export interface UserFeedback {
  id: string;
  conversationId: string;
  rating: number; // 1-5
  feedback?: string;
  timestamp: Date;
}
