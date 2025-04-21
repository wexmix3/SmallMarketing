const fs = require('fs');
const path = require('path');

// Create mock data directory if it doesn't exist
const mockDataDir = path.join(__dirname, '..', 'src', 'mock-data');
if (!fs.existsSync(mockDataDir)) {
  fs.mkdirSync(mockDataDir, { recursive: true });
}

// Create mock data files
const createMockData = () => {
  // Businesses
  const businesses = [
    {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Chatbot configurations
  const chatbotConfigs = [
    {
      id: 'chatbot-1',
      businessId: 'business-1',
      name: 'Customer Support Assistant',
      welcomeMessage: 'Hello! How can I help you today?',
      fallbackMessage: 'I\'m sorry, I couldn\'t understand that. Could you rephrase your question?',
      transferMessage: 'I\'ll connect you with a human agent shortly.',
      offlineMessage: 'We\'re currently offline. Please leave a message and we\'ll get back to you soon.',
      appearance: {
        theme: 'light',
        position: 'right',
        primaryColor: '#0070f3',
        secondaryColor: '#ffffff',
        fontFamily: 'Arial, sans-serif'
      },
      behaviors: {
        autoShowDelay: 5,
        collectName: true,
        collectEmail: true,
        requireContactInfo: false,
        showTypingIndicator: true,
        enableFileUploads: false,
        maxAttachmentSize: 5242880
      },
      integrations: {
        calendarType: null,
        calendarId: null,
        crmType: null,
        crmId: null,
        emailMarketing: false,
        emailMarketingProvider: null
      },
      aiSettings: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 150,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // FAQs
  const faqs = [
    {
      id: 'faq-1',
      businessId: 'business-1',
      question: 'What are your business hours?',
      answer: 'We are open Monday to Friday from 9 AM to 5 PM, and Saturday from 10 AM to 2 PM. We are closed on Sundays.',
      category: 'General',
      tags: ['hours', 'schedule'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-2',
      businessId: 'business-1',
      question: 'Do you offer free shipping?',
      answer: 'Yes, we offer free shipping on all orders over $50 within the continental United States.',
      category: 'Shipping',
      tags: ['shipping', 'delivery'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-3',
      businessId: 'business-1',
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging.',
      category: 'Returns',
      tags: ['returns', 'refunds'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-4',
      businessId: 'business-1',
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and viewing your order history, or by using the tracking number provided in your shipping confirmation email.',
      category: 'Orders',
      tags: ['tracking', 'orders', 'shipping'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'faq-5',
      businessId: 'business-1',
      question: 'Do you have a physical store?',
      answer: 'Yes, our flagship store is located at 123 Main Street, Anytown, CA 12345. We also have several other locations throughout the country. Please check our website for the store nearest you.',
      category: 'General',
      tags: ['store', 'location'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Products
  const products = [
    {
      id: 'product-1',
      businessId: 'business-1',
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
        colors: 'Black, White, Blue, Red'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'product-2',
      businessId: 'business-1',
      name: 'Premium Hoodie',
      description: 'A warm and stylish hoodie perfect for cool weather.',
      price: 49.99,
      currency: 'USD',
      imageUrl: 'https://example.com/images/hoodie.jpg',
      category: 'Apparel',
      tags: ['clothing', 'hoodie', 'casual'],
      inStock: true,
      attributes: {
        material: 'Cotton Blend',
        sizes: 'S, M, L, XL, XXL',
        colors: 'Black, Gray, Navy'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'product-3',
      businessId: 'business-1',
      name: 'Wireless Earbuds',
      description: 'High-quality wireless earbuds with noise cancellation.',
      price: 129.99,
      currency: 'USD',
      imageUrl: 'https://example.com/images/earbuds.jpg',
      category: 'Electronics',
      tags: ['audio', 'earbuds', 'wireless'],
      inStock: true,
      attributes: {
        battery: '8 hours',
        colors: 'Black, White',
        waterproof: 'IPX5'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Services
  const services = [
    {
      id: 'service-1',
      businessId: 'business-1',
      name: 'Basic Consultation',
      description: 'A one-hour consultation to discuss your needs and provide recommendations.',
      price: 99.99,
      currency: 'USD',
      duration: 60,
      imageUrl: 'https://example.com/images/consultation.jpg',
      category: 'Consulting',
      tags: ['consultation', 'advice'],
      availability: [
        { day: 'monday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'tuesday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'wednesday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'thursday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'friday', open: '09:00', close: '17:00', isClosed: false }
      ],
      attributes: {
        location: 'In-person or virtual',
        cancellation: '24 hours notice required'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'service-2',
      businessId: 'business-1',
      name: 'Premium Support',
      description: 'Priority support with 24/7 availability and guaranteed response times.',
      price: 199.99,
      currency: 'USD',
      duration: null,
      imageUrl: 'https://example.com/images/support.jpg',
      category: 'Support',
      tags: ['support', 'priority'],
      availability: null,
      attributes: {
        responseTime: '1 hour',
        availability: '24/7',
        channels: 'Phone, Email, Chat'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Conversations
  const conversations = [
    {
      id: 'conversation-1',
      businessId: 'business-1',
      visitorId: 'visitor-123',
      visitorName: 'John Doe',
      visitorEmail: 'john@example.com',
      startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      endTime: null,
      status: 'active',
      source: 'website',
      messages: [
        {
          id: 'message-1',
          conversationId: 'conversation-1',
          content: 'Hello! How can I help you today?',
          sender: 'assistant',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true
        },
        {
          id: 'message-2',
          conversationId: 'conversation-1',
          content: 'I have a question about your return policy.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3540000).toISOString(),
          isRead: true
        },
        {
          id: 'message-3',
          conversationId: 'conversation-1',
          content: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging. Is there anything specific you\'d like to know about our return policy?',
          sender: 'assistant',
          timestamp: new Date(Date.now() - 3530000).toISOString(),
          isRead: true
        }
      ],
      tags: ['returns', 'policy'],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3530000).toISOString()
    }
  ];

  // Write files
  fs.writeFileSync(path.join(mockDataDir, 'businesses.json'), JSON.stringify(businesses, null, 2));
  fs.writeFileSync(path.join(mockDataDir, 'chatbot-configs.json'), JSON.stringify(chatbotConfigs, null, 2));
  fs.writeFileSync(path.join(mockDataDir, 'faqs.json'), JSON.stringify(faqs, null, 2));
  fs.writeFileSync(path.join(mockDataDir, 'products.json'), JSON.stringify(products, null, 2));
  fs.writeFileSync(path.join(mockDataDir, 'services.json'), JSON.stringify(services, null, 2));
  fs.writeFileSync(path.join(mockDataDir, 'conversations.json'), JSON.stringify(conversations, null, 2));

  console.log('Mock data files created successfully in', mockDataDir);
};

createMockData();
