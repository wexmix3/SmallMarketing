-- AI Customer Service Assistant Database Schema

-- Businesses
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  description TEXT,
  hours JSONB,
  contact JSONB,
  logo VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Chatbot Configuration
CREATE TABLE IF NOT EXISTS chatbot_config (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  welcome_message TEXT NOT NULL,
  fallback_message TEXT NOT NULL,
  transfer_message TEXT,
  offline_message TEXT,
  appearance JSONB NOT NULL,
  behavior JSONB NOT NULL,
  integrations JSONB NOT NULL,
  ai_settings JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- FAQ Templates
CREATE TABLE IF NOT EXISTS faq_templates (
  id UUID PRIMARY KEY,
  template_id VARCHAR(100) NOT NULL,
  industry VARCHAR(100),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  image_url VARCHAR(255),
  category VARCHAR(100),
  tags TEXT[],
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  attributes JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  duration INTEGER, -- in minutes
  image_url VARCHAR(255),
  category VARCHAR(100),
  tags TEXT[],
  availability JSONB,
  attributes JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Custom Entities
CREATE TABLE IF NOT EXISTS custom_entities (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  fields JSONB NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  visitor_id VARCHAR(255) NOT NULL,
  visitor_name VARCHAR(255),
  visitor_email VARCHAR(255),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  source VARCHAR(20) NOT NULL DEFAULT 'website',
  assigned_to UUID,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Conversation Tags
CREATE TABLE IF NOT EXISTS conversation_tags (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, tag)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Attachments
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL, -- in bytes
  url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Daily Analytics Metrics
CREATE TABLE IF NOT EXISTS analytics_daily_metrics (
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Conversation metrics
  conversations_started INTEGER DEFAULT 0,
  conversations_closed INTEGER DEFAULT 0,
  conversations_transferred INTEGER DEFAULT 0,
  avg_conversation_duration FLOAT,
  avg_conversation_duration_count INTEGER DEFAULT 0,
  
  -- Message metrics
  total_messages INTEGER DEFAULT 0,
  user_messages INTEGER DEFAULT 0,
  assistant_messages INTEGER DEFAULT 0,
  human_agent_messages INTEGER DEFAULT 0,
  
  -- Performance metrics
  ai_responses INTEGER DEFAULT 0,
  human_interventions INTEGER DEFAULT 0,
  avg_response_time FLOAT,
  avg_response_time_count INTEGER DEFAULT 0,
  avg_confidence FLOAT,
  avg_confidence_count INTEGER DEFAULT 0,
  
  -- Feedback metrics
  feedback_count INTEGER DEFAULT 0,
  avg_satisfaction FLOAT,
  avg_satisfaction_count INTEGER DEFAULT 0,
  
  -- Source metrics
  source_website INTEGER DEFAULT 0,
  source_facebook INTEGER DEFAULT 0,
  source_instagram INTEGER DEFAULT 0,
  source_other INTEGER DEFAULT 0,
  
  -- Intent metrics (these will be dynamically accessed)
  intent_business_hours INTEGER DEFAULT 0,
  intent_business_location INTEGER DEFAULT 0,
  intent_contact_info INTEGER DEFAULT 0,
  intent_pricing INTEGER DEFAULT 0,
  intent_appointment INTEGER DEFAULT 0,
  intent_products INTEGER DEFAULT 0,
  intent_services INTEGER DEFAULT 0,
  intent_faq INTEGER DEFAULT 0,
  intent_general_inquiry INTEGER DEFAULT 0,
  intent_human_handoff INTEGER DEFAULT 0,
  
  -- Other metrics
  source_ai INTEGER DEFAULT 0,
  source_faq INTEGER DEFAULT 0,
  source_fallback INTEGER DEFAULT 0,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (business_id, date)
);

-- User Feedback
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversations_business_id ON conversations(business_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_analytics_events_business_id ON analytics_events(business_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_faqs_business_id ON faqs(business_id);
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_services_business_id ON services(business_id);
