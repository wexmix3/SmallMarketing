/**
 * Database Initialization
 * 
 * This script initializes the database for the AI Customer Service Assistant.
 * It creates the necessary tables and populates them with initial data.
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Initialize the database
 */
export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read schema SQL
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    // Execute schema SQL
    await pool.query(schemaSQL);
    
    console.log('Database schema created successfully');
    
    // Check if we need to populate with sample data
    if (process.env.POPULATE_SAMPLE_DATA === 'true') {
      await populateSampleData();
    }
    
    console.log('Database initialization complete');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

/**
 * Populate the database with sample data
 */
async function populateSampleData() {
  try {
    console.log('Populating database with sample data...');
    
    // Create sample business
    const businessId = uuidv4();
    await pool.query(
      `INSERT INTO businesses 
       (id, name, industry, description, hours, contact, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [
        businessId,
        'Acme Retail Store',
        'Retail',
        'A sample retail store selling various products.',
        JSON.stringify([
          { day: 'monday', open: '09:00', close: '17:00', isClosed: false },
          { day: 'tuesday', open: '09:00', close: '17:00', isClosed: false },
          { day: 'wednesday', open: '09:00', close: '17:00', isClosed: false },
          { day: 'thursday', open: '09:00', close: '17:00', isClosed: false },
          { day: 'friday', open: '09:00', close: '17:00', isClosed: false },
          { day: 'saturday', open: '10:00', close: '15:00', isClosed: false },
          { day: 'sunday', open: '00:00', close: '00:00', isClosed: true }
        ]),
        JSON.stringify({
          email: 'info@acmeretail.example',
          phone: '555-123-4567',
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'USA'
          },
          website: 'https://acmeretail.example',
          socialMedia: {
            facebook: 'https://facebook.com/acmeretail',
            twitter: 'https://twitter.com/acmeretail',
            instagram: 'https://instagram.com/acmeretail'
          }
        })
      ]
    );
    
    // Create chatbot configuration
    const configId = uuidv4();
    await pool.query(
      `INSERT INTO chatbot_config 
       (id, business_id, name, welcome_message, fallback_message, transfer_message, offline_message, 
        appearance, behavior, integrations, ai_settings, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
      [
        configId,
        businessId,
        'Acme Customer Service',
        'Hello! Welcome to Acme Retail. How can I assist you today?',
        "I'm sorry, I didn't understand that. Could you please rephrase your question?",
        "I'll connect you with a human agent who can better assist you.",
        "We're currently offline. Please leave a message and we'll get back to you soon.",
        JSON.stringify({
          theme: 'light',
          position: 'right',
          primaryColor: '#4F46E5',
          secondaryColor: '#ffffff',
          fontFamily: 'Arial, sans-serif'
        }),
        JSON.stringify({
          autoShowDelay: 5,
          collectEmail: true,
          collectName: true,
          requireContactInfo: false,
          showTypingIndicator: true,
          enableFileUploads: false,
          maxAttachmentSize: 5 * 1024 * 1024
        }),
        JSON.stringify({
          calendarType: 'google',
          calendarId: 'primary',
          emailMarketing: true,
          emailMarketingProvider: 'mailchimp'
        }),
        JSON.stringify({
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 150,
          topP: 1,
          presencePenalty: 0,
          frequencyPenalty: 0
        })
      ]
    );
    
    // Create sample FAQs
    const faqs = [
      {
        id: uuidv4(),
        business_id: businessId,
        question: 'What are your business hours?',
        answer: 'We are open Monday to Friday from 9 AM to 5 PM, Saturday from 10 AM to 3 PM, and closed on Sundays.',
        category: 'General',
        tags: ['hours', 'schedule']
      },
      {
        id: uuidv4(),
        business_id: businessId,
        question: 'Do you offer free shipping?',
        answer: 'Yes, we offer free shipping on all orders over $50 within the continental United States.',
        category: 'Shipping',
        tags: ['shipping', 'delivery']
      },
      {
        id: uuidv4(),
        business_id: businessId,
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging.',
        category: 'Returns',
        tags: ['returns', 'refunds']
      },
      {
        id: uuidv4(),
        business_id: businessId,
        question: 'How can I track my order?',
        answer: 'You can track your order by logging into your account and viewing your order history, or by using the tracking number provided in your shipping confirmation email.',
        category: 'Orders',
        tags: ['tracking', 'orders']
      },
      {
        id: uuidv4(),
        business_id: businessId,
        question: 'Do you have a physical store location?',
        answer: 'Yes, our store is located at 123 Main St, Anytown, CA 12345. We welcome you to visit us during our business hours!',
        category: 'General',
        tags: ['location', 'store']
      }
    ];
    
    for (const faq of faqs) {
      await pool.query(
        `INSERT INTO faqs 
         (id, business_id, question, answer, category, tags, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [faq.id, faq.business_id, faq.question, faq.answer, faq.category, faq.tags]
      );
    }
    
    // Create sample products
    const products = [
      {
        id: uuidv4(),
        business_id: businessId,
        name: 'Basic T-Shirt',
        description: 'A comfortable cotton t-shirt available in various colors.',
        price: 19.99,
        currency: 'USD',
        category: 'Apparel',
        tags: ['clothing', 't-shirt', 'casual'],
        in_stock: true,
        attributes: {
          material: 'Cotton',
          sizes: 'S, M, L, XL',
          colors: 'Black, White, Blue, Red'
        }
      },
      {
        id: uuidv4(),
        business_id: businessId,
        name: 'Premium Jeans',
        description: 'High-quality denim jeans with a modern fit.',
        price: 59.99,
        currency: 'USD',
        category: 'Apparel',
        tags: ['clothing', 'jeans', 'denim'],
        in_stock: true,
        attributes: {
          material: 'Denim',
          sizes: '28, 30, 32, 34, 36',
          colors: 'Blue, Black'
        }
      },
      {
        id: uuidv4(),
        business_id: businessId,
        name: 'Wireless Headphones',
        description: 'Bluetooth headphones with noise cancellation.',
        price: 89.99,
        currency: 'USD',
        category: 'Electronics',
        tags: ['audio', 'headphones', 'wireless'],
        in_stock: true,
        attributes: {
          batteryLife: '20 hours',
          connectivity: 'Bluetooth 5.0',
          colors: 'Black, White, Silver'
        }
      }
    ];
    
    for (const product of products) {
      await pool.query(
        `INSERT INTO products 
         (id, business_id, name, description, price, currency, category, tags, in_stock, attributes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
        [
          product.id, 
          product.business_id, 
          product.name, 
          product.description, 
          product.price, 
          product.currency, 
          product.category, 
          product.tags, 
          product.in_stock, 
          JSON.stringify(product.attributes)
        ]
      );
    }
    
    // Create sample services
    const services = [
      {
        id: uuidv4(),
        business_id: businessId,
        name: 'Express Shipping',
        description: 'Get your order delivered within 2 business days.',
        price: 15.00,
        currency: 'USD',
        category: 'Shipping',
        tags: ['shipping', 'delivery', 'express']
      },
      {
        id: uuidv4(),
        business_id: businessId,
        name: 'Gift Wrapping',
        description: 'Have your items beautifully wrapped for gifting.',
        price: 5.00,
        currency: 'USD',
        category: 'Additional Services',
        tags: ['gift', 'wrapping']
      },
      {
        id: uuidv4(),
        business_id: businessId,
        name: 'Personal Shopping Assistance',
        description: 'Get personalized help from our shopping experts.',
        price: 25.00,
        currency: 'USD',
        duration: 30,
        category: 'Consultation',
        tags: ['shopping', 'assistance', 'personal']
      }
    ];
    
    for (const service of services) {
      await pool.query(
        `INSERT INTO services 
         (id, business_id, name, description, price, currency, duration, category, tags, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [
          service.id, 
          service.business_id, 
          service.name, 
          service.description, 
          service.price, 
          service.currency, 
          service.duration, 
          service.category, 
          service.tags
        ]
      );
    }
    
    // Create FAQ templates
    const faqTemplates = [
      {
        id: uuidv4(),
        template_id: 'retail_basic',
        industry: 'Retail',
        question: 'What are your business hours?',
        answer: 'Our business hours are [insert your business hours here].',
        category: 'General',
        tags: ['hours', 'schedule']
      },
      {
        id: uuidv4(),
        template_id: 'retail_basic',
        industry: 'Retail',
        question: 'Do you offer free shipping?',
        answer: 'Our shipping policy is [insert your shipping policy here].',
        category: 'Shipping',
        tags: ['shipping', 'delivery']
      },
      {
        id: uuidv4(),
        template_id: 'retail_basic',
        industry: 'Retail',
        question: 'What is your return policy?',
        answer: 'Our return policy is [insert your return policy here].',
        category: 'Returns',
        tags: ['returns', 'refunds']
      },
      {
        id: uuidv4(),
        template_id: 'restaurant_basic',
        industry: 'Restaurant',
        question: 'Do you take reservations?',
        answer: 'Our reservation policy is [insert your reservation policy here].',
        category: 'Reservations',
        tags: ['reservations', 'booking']
      },
      {
        id: uuidv4(),
        template_id: 'restaurant_basic',
        industry: 'Restaurant',
        question: 'Do you have vegetarian options?',
        answer: 'Information about our menu options: [insert your menu information here].',
        category: 'Menu',
        tags: ['vegetarian', 'menu', 'dietary']
      }
    ];
    
    for (const template of faqTemplates) {
      await pool.query(
        `INSERT INTO faq_templates 
         (id, template_id, industry, question, answer, category, tags, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          template.id, 
          template.template_id, 
          template.industry, 
          template.question, 
          template.answer, 
          template.category, 
          template.tags
        ]
      );
    }
    
    console.log('Sample data populated successfully');
  } catch (error) {
    console.error('Error populating sample data:', error);
    throw error;
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}
