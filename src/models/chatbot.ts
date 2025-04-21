/**
 * Chatbot Data Models
 *
 * These models define the structure for the AI Customer Service Assistant
 * including chatbot configuration, knowledge base, and conversation history.
 */

// Business Hours Type
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface BusinessHours {
  day: DayOfWeek;
  open: string; // Format: "HH:MM" in 24-hour format
  close: string; // Format: "HH:MM" in 24-hour format
  isClosed: boolean;
}

// Contact Information Type
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
  activeHours?: BusinessHours[];
  appearance: {
    theme: 'light' | 'dark' | 'custom';
    position: 'left' | 'right';
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    customCSS?: string;
    logoUrl?: string;
    avatarUrl?: string;
  };
  behaviors: {
    autoShowDelay?: number; // in seconds
    collectEmail: boolean;
    collectName: boolean;
    requireContactInfo: boolean;
    showTypingIndicator: boolean;
    enableFileUploads: boolean;
    maxAttachmentSize?: number; // in bytes
  };
  integrations: {
    calendarType?: 'google' | 'outlook' | 'calendly' | 'custom';
    calendarId?: string;
    crmType?: 'salesforce' | 'hubspot' | 'zoho' | 'custom';
    crmId?: string;
    emailMarketing?: boolean;
    emailMarketingProvider?: string;
  };
  aiSettings: {
    model: 'gpt-3.5-turbo' | 'gpt-4' | 'claude-instant' | 'claude-2';
    temperature: number; // 0-1, lower is more deterministic
    maxTokens: number;
    topP: number; // 0-1, diversity of responses
    presencePenalty: number; // -2.0 to 2.0
    frequencyPenalty: number; // -2.0 to 2.0
  };
  createdAt: Date;
  updatedAt: Date;
}

// Knowledge Base Types
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

// Business Information Type
export interface BusinessInfo {
  id: string;
  name: string;
  industry: string;
  description: string;
  hours: BusinessHours[];
  contact: ContactInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeBase {
  id: string;
  businessId: string;
  businessInfo: BusinessInfo;
  faqs: FAQ[];
  products: Product[];
  services: Service[];
  customEntities?: CustomEntity[];
  createdAt: Date;
  updatedAt: Date;
}

// Conversation Types
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

// Analytics Types
export interface AnalyticsSummary {
  id: string;
  businessId: string;
  period: 'day' | 'week' | 'month' | 'year';
  totalConversations: number;
  activeConversations: number;
  avgConversationDuration: number; // in seconds
  messageCount: {
    total: number;
    fromUsers: number;
    fromBot: number;
    fromAgents: number;
  };
  resolutionRate: number; // 0-1
  transferRate: number; // 0-1
  timeframe: {
    start: Date;
    end: Date;
  };
  createdAt: Date;
}

export interface ChatbotAnalytics {
  id: string;
  businessId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalConversations: number;
    avgConversationDuration: number; // in seconds
    avgResponseTime: number; // in seconds
    avgMessagesPerConversation: number;
    resolutionRate: number; // 0-1
    transferRate: number; // 0-1
    satisfactionScore?: number; // 0-5
    topIntents: Array<{
      intent: string;
      count: number;
      percentage: number;
    }>;
    busyHours: Array<{
      hour: number; // 0-23
      count: number;
    }>;
    busyDays: Array<{
      day: DayOfWeek;
      count: number;
    }>;
  };
  createdAt: Date;
}

// Mock Data Generators
export function getMockChatbotConfig(): ChatbotConfig {
  return {
    id: 'chatbot-1',
    businessId: 'business-1',
    name: 'Customer Support Assistant',
    welcomeMessage: 'Hello! How can I help you today?',
    fallbackMessage: "I'm sorry, I couldn't understand that. Could you rephrase your question?",
    transferMessage: "I'll connect you with a human agent shortly.",
    offlineMessage: "We're currently offline. Please leave a message and we'll get back to you soon.",
    appearance: {
      theme: 'light',
      position: 'right',
      primaryColor: '#0070f3',
      secondaryColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    },
    behaviors: {
      autoShowDelay: 5,
      collectEmail: true,
      collectName: true,
      requireContactInfo: false,
      showTypingIndicator: true,
      enableFileUploads: true,
      maxAttachmentSize: 5 * 1024 * 1024, // 5MB
    },
    integrations: {
      calendarType: 'google',
      calendarId: 'primary',
      crmType: 'hubspot',
      crmId: 'default',
      emailMarketing: true,
      emailMarketingProvider: 'mailchimp',
    },
    aiSettings: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 150,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function getMockKnowledgeBase(): KnowledgeBase {
  return {
    id: 'kb-1',
    businessId: 'business-1',
    businessInfo: {
      id: 'business-1',
      name: 'Acme Corporation',
      industry: 'Retail',
      description: 'We provide high-quality products and services for all your needs.',
      hours: [
        { day: 'monday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'tuesday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'wednesday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'thursday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'friday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'saturday', open: '10:00', close: '14:00', isClosed: false },
        { day: 'sunday', open: '', close: '', isClosed: true }
      ],
      contact: {
        email: 'info@acme.com',
        phone: '555-123-4567',
        address: {
          street: '123 Main Street',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        website: 'https://acme.com',
        socialMedia: {
          facebook: 'https://facebook.com/acme',
          twitter: 'https://twitter.com/acme'
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    faqs: [
      {
        id: 'faq-1',
        question: 'What are your business hours?',
        answer: 'We are open Monday to Friday from 9 AM to 5 PM, and Saturday from 10 AM to 2 PM. We are closed on Sundays.',
        category: 'General',
        tags: ['hours', 'schedule'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'faq-2',
        question: 'Do you offer free shipping?',
        answer: 'Yes, we offer free shipping on all orders over $50 within the continental United States.',
        category: 'Shipping',
        tags: ['shipping', 'delivery'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'faq-3',
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging.',
        category: 'Returns',
        tags: ['returns', 'refunds'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    products: [
      {
        id: 'product-1',
        name: 'Basic T-Shirt',
        description: 'A comfortable cotton t-shirt available in various colors.',
        price: 19.99,
        currency: 'USD',
        imageUrl: 'https://example.com/images/tshirt.jpg',
        category: 'Apparel',
        tags: ['clothing', 't-shirt', 'casual'],
        inStock: true,
        attributes: {
          material: 'Cotton',
          sizes: 'S, M, L, XL',
          colors: 'Black, White, Blue, Red',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    services: [
      {
        id: 'service-1',
        name: 'Basic Haircut',
        description: 'A standard haircut service including wash and style.',
        price: 35.00,
        currency: 'USD',
        duration: 45,
        imageUrl: 'https://example.com/images/haircut.jpg',
        category: 'Hair Services',
        tags: ['haircut', 'styling'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    customEntities: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function getMockConversation(): Conversation {
  return {
    id: 'conv-1',
    businessId: 'business-1',
    visitorId: 'visitor-1',
    visitorName: 'John Doe',
    visitorEmail: 'john@example.com',
    startTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    status: 'active',
    source: 'website',
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        content: 'Hello, I have a question about your return policy.',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        isRead: true,
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        content: 'Hi John! I\'d be happy to help with that. We accept returns within 30 days of purchase. Items must be unused and in original packaging.',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 1000 * 60 * 4.8), // 4.8 minutes ago
        isRead: true,
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        content: 'Do I need to pay for return shipping?',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 4.5), // 4.5 minutes ago
        isRead: true,
      },
      {
        id: 'msg-4',
        conversationId: 'conv-1',
        content: 'For standard returns, customers are responsible for return shipping costs. However, if you received a defective item, we'll provide a prepaid shipping label.',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 1000 * 60 * 4.3), // 4.3 minutes ago
        isRead: true,
      },
    ],
    tags: ['returns', 'shipping'],
    metadata: {
      browser: 'Chrome',
      device: 'desktop',
      referrer: 'https://www.google.com',
    },
  };
}

export function getMockChatbotAnalytics(): ChatbotAnalytics {
  return {
    id: 'analytics-1',
    businessId: 'business-1',
    period: 'month',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    endDate: new Date(),
    metrics: {
      totalConversations: 245,
      avgConversationDuration: 180, // 3 minutes
      avgResponseTime: 12, // 12 seconds
      avgMessagesPerConversation: 6.3,
      resolutionRate: 0.78, // 78%
      transferRate: 0.15, // 15%
      satisfactionScore: 4.2, // out of 5
      topIntents: [
        { intent: 'check_order_status', count: 52, percentage: 0.21 },
        { intent: 'return_policy', count: 38, percentage: 0.16 },
        { intent: 'product_information', count: 35, percentage: 0.14 },
        { intent: 'shipping_information', count: 30, percentage: 0.12 },
        { intent: 'business_hours', count: 25, percentage: 0.10 },
      ],
      busyHours: [
        { hour: 9, count: 18 },
        { hour: 10, count: 22 },
        { hour: 11, count: 25 },
        { hour: 12, count: 20 },
        { hour: 13, count: 15 },
        { hour: 14, count: 28 },
        { hour: 15, count: 32 },
        { hour: 16, count: 30 },
        { hour: 17, count: 25 },
        { hour: 18, count: 20 },
        { hour: 19, count: 10 },
      ],
      busyDays: [
        { day: 'monday', count: 45 },
        { day: 'tuesday', count: 38 },
        { day: 'wednesday', count: 42 },
        { day: 'thursday', count: 50 },
        { day: 'friday', count: 55 },
        { day: 'saturday', count: 15 },
        { day: 'sunday', count: 0 },
      ],
    },
    createdAt: new Date(),
  };
}
