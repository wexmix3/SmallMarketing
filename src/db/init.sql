-- AI Customer Service Assistant - Database Initialization Script

-- Create the database if it doesn't exist
-- Note: This needs to be run as a superuser
-- CREATE DATABASE ai_customer_service;

-- Connect to the database
-- \c ai_customer_service

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
\i schema.sql

-- Insert sample business
INSERT INTO businesses (id, name, industry, description, hours, contact, created_at, updated_at)
VALUES (
  'business-1',
  'Acme Corporation',
  'Retail',
  'We provide high-quality products and services for all your needs.',
  '[
    {"day": "monday", "open": "09:00", "close": "17:00", "isClosed": false},
    {"day": "tuesday", "open": "09:00", "close": "17:00", "isClosed": false},
    {"day": "wednesday", "open": "09:00", "close": "17:00", "isClosed": false},
    {"day": "thursday", "open": "09:00", "close": "17:00", "isClosed": false},
    {"day": "friday", "open": "09:00", "close": "17:00", "isClosed": false},
    {"day": "saturday", "open": "10:00", "close": "14:00", "isClosed": false},
    {"day": "sunday", "open": "", "close": "", "isClosed": true}
  ]',
  '{
    "email": "info@acme.com",
    "phone": "555-123-4567",
    "address": {
      "street": "123 Main Street",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345",
      "country": "USA"
    },
    "website": "https://acme.com",
    "socialMedia": {
      "facebook": "https://facebook.com/acme",
      "twitter": "https://twitter.com/acme"
    }
  }',
  NOW(),
  NOW()
);

-- Insert sample chatbot configuration
INSERT INTO chatbot_config (id, business_id, name, welcome_message, fallback_message, transfer_message, offline_message, appearance, behavior, integrations, ai_settings, created_at, updated_at)
VALUES (
  'chatbot-1',
  'business-1',
  'Customer Support Assistant',
  'Hello! How can I help you today?',
  'I''m sorry, I couldn''t understand that. Could you rephrase your question?',
  'I''ll connect you with a human agent shortly.',
  'We''re currently offline. Please leave a message and we''ll get back to you soon.',
  '{
    "theme": "light",
    "position": "right",
    "primaryColor": "#0070f3",
    "secondaryColor": "#ffffff",
    "fontFamily": "Arial, sans-serif"
  }',
  '{
    "autoShowDelay": 5,
    "collectEmail": true,
    "collectName": true,
    "requireContactInfo": false,
    "showTypingIndicator": true,
    "enableFileUploads": false,
    "maxAttachmentSize": 5242880
  }',
  '{
    "calendarType": null,
    "calendarId": null,
    "crmType": null,
    "crmId": null,
    "emailMarketing": false,
    "emailMarketingProvider": null
  }',
  '{
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "maxTokens": 150,
    "topP": 1,
    "presencePenalty": 0,
    "frequencyPenalty": 0
  }',
  NOW(),
  NOW()
);

-- Insert sample FAQs
INSERT INTO faqs (id, business_id, question, answer, category, tags, created_at, updated_at)
VALUES
  (
    uuid_generate_v4(),
    'business-1',
    'What are your business hours?',
    'We are open Monday to Friday from 9 AM to 5 PM, and Saturday from 10 AM to 2 PM. We are closed on Sundays.',
    'General',
    ARRAY['hours', 'schedule'],
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'business-1',
    'Do you offer free shipping?',
    'Yes, we offer free shipping on all orders over $50 within the continental United States.',
    'Shipping',
    ARRAY['shipping', 'delivery'],
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'business-1',
    'What is your return policy?',
    'We accept returns within 30 days of purchase. Items must be unused and in original packaging.',
    'Returns',
    ARRAY['returns', 'refunds'],
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'business-1',
    'How can I track my order?',
    'You can track your order by logging into your account and viewing your order history, or by using the tracking number provided in your shipping confirmation email.',
    'Orders',
    ARRAY['tracking', 'orders', 'shipping'],
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'business-1',
    'Do you have a physical store?',
    'Yes, our flagship store is located at 123 Main Street, Anytown, CA 12345. We also have several other locations throughout the country. Please check our website for the store nearest you.',
    'General',
    ARRAY['store', 'location'],
    NOW(),
    NOW()
  );

-- Insert sample products
INSERT INTO products (id, business_id, name, description, price, currency, image_url, category, tags, in_stock, attributes, created_at, updated_at)
VALUES
  (
    uuid_generate_v4(),
    'business-1',
    'Basic T-Shirt',
    'A comfortable cotton t-shirt available in various colors.',
    19.99,
    'USD',
    'https://example.com/images/tshirt.jpg',
    'Apparel',
    ARRAY['clothing', 't-shirt', 'casual'],
    TRUE,
    '{"material": "Cotton", "sizes": "S, M, L, XL", "colors": "Black, White, Blue, Red"}',
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'business-1',
    'Premium Hoodie',
    'A warm and stylish hoodie perfect for cool weather.',
    49.99,
    'USD',
    'https://example.com/images/hoodie.jpg',
    'Apparel',
    ARRAY['clothing', 'hoodie', 'casual'],
    TRUE,
    '{"material": "Cotton Blend", "sizes": "S, M, L, XL, XXL", "colors": "Black, Gray, Navy"}',
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'business-1',
    'Wireless Earbuds',
    'High-quality wireless earbuds with noise cancellation.',
    129.99,
    'USD',
    'https://example.com/images/earbuds.jpg',
    'Electronics',
    ARRAY['audio', 'earbuds', 'wireless'],
    TRUE,
    '{"battery": "8 hours", "colors": "Black, White", "waterproof": "IPX5"}',
    NOW(),
    NOW()
  );

-- Insert sample services
INSERT INTO services (id, business_id, name, description, price, currency, duration, image_url, category, tags, availability, attributes, created_at, updated_at)
VALUES
  (
    uuid_generate_v4(),
    'business-1',
    'Basic Consultation',
    'A one-hour consultation to discuss your needs and provide recommendations.',
    99.99,
    'USD',
    60,
    'https://example.com/images/consultation.jpg',
    'Consulting',
    ARRAY['consultation', 'advice'],
    '[
      {"day": "monday", "open": "09:00", "close": "17:00", "isClosed": false},
      {"day": "tuesday", "open": "09:00", "close": "17:00", "isClosed": false},
      {"day": "wednesday", "open": "09:00", "close": "17:00", "isClosed": false},
      {"day": "thursday", "open": "09:00", "close": "17:00", "isClosed": false},
      {"day": "friday", "open": "09:00", "close": "17:00", "isClosed": false}
    ]',
    '{"location": "In-person or virtual", "cancellation": "24 hours notice required"}',
    NOW(),
    NOW()
  ),
  (
    uuid_generate_v4(),
    'business-1',
    'Premium Support',
    'Priority support with 24/7 availability and guaranteed response times.',
    199.99,
    'USD',
    NULL,
    'https://example.com/images/support.jpg',
    'Support',
    ARRAY['support', 'priority'],
    NULL,
    '{"responseTime": "1 hour", "availability": "24/7", "channels": "Phone, Email, Chat"}',
    NOW(),
    NOW()
  );

-- Insert sample FAQ templates
INSERT INTO faq_templates (id, template_id, industry, question, answer, category, tags, created_at)
VALUES
  (
    uuid_generate_v4(),
    'retail',
    'Retail',
    'What are your store hours?',
    'Our store hours vary by location. Please check our website for the hours of the store nearest you.',
    'General',
    ARRAY['hours', 'store'],
    NOW()
  ),
  (
    uuid_generate_v4(),
    'retail',
    'Retail',
    'Do you offer gift wrapping?',
    'Yes, we offer gift wrapping for a small fee. Please ask a store associate for details.',
    'Services',
    ARRAY['gift', 'wrapping'],
    NOW()
  ),
  (
    uuid_generate_v4(),
    'restaurant',
    'Restaurant',
    'Do you take reservations?',
    'Yes, we accept reservations by phone or through our website.',
    'General',
    ARRAY['reservations', 'booking'],
    NOW()
  ),
  (
    uuid_generate_v4(),
    'restaurant',
    'Restaurant',
    'Do you have vegetarian options?',
    'Yes, we offer a variety of vegetarian dishes. Please check our menu for details.',
    'Menu',
    ARRAY['vegetarian', 'food'],
    NOW()
  );
