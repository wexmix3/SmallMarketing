# AI Customer Service Assistant

This document provides instructions for deploying and configuring the AI Customer Service Assistant for your business.

## Overview

The AI Customer Service Assistant is a powerful chatbot solution that helps small businesses provide 24/7 customer support. It features:

- Natural language understanding with intent classification
- Knowledge base integration with semantic search
- Advanced analytics and reporting
- Integration with calendar, CRM, and email marketing systems
- Easy embedding on any website

## Deployment Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key
- Vercel account (for deployment)

### Environment Variables

Set up the following environment variables in your Vercel project:

```
# Authentication
NEXTAUTH_URL=https://your-deployment-url.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# Database
DB_HOST=your-db-host
DB_PORT=your-db-port
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# General
NODE_ENV=production
```

### Deployment Steps

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Deploy to Vercel: `vercel --prod`

## Configuration

### Business Setup

1. Create a business account through the admin dashboard
2. Configure your business information, hours, and contact details
3. Add products and services to your knowledge base
4. Create FAQs to help the AI answer common questions

### Knowledge Base

The knowledge base is the foundation of your AI assistant. Add:

- Frequently asked questions
- Product information
- Service details
- Business policies

### Integrations

The AI Customer Service Assistant supports integration with:

- **Calendar Systems**: Google Calendar, Microsoft Outlook
- **CRM Systems**: HubSpot, Salesforce, Zoho
- **Email Marketing**: Mailchimp, SendGrid, ConvertKit

## Website Integration

Add the chatbot to your website by adding this script to your HTML:

```html
<script src="https://your-deployment-url.vercel.app/widget.js" 
        data-business-id="your-business-id"
        data-theme="light"
        data-position="right"
        data-primary-color="#0070f3"
        data-font-family="Arial, sans-serif"
        data-auto-show="false"
        data-auto-show-delay="5"></script>
```

### Widget Customization Options

- `data-business-id`: Your business ID (required)
- `data-theme`: "light" or "dark"
- `data-position`: "left" or "right"
- `data-primary-color`: Any hex color code
- `data-font-family`: Any valid CSS font family
- `data-auto-show`: "true" or "false" (whether to automatically open the chat)
- `data-auto-show-delay`: Time in seconds before auto-showing the chat

## Analytics

Access detailed analytics in the admin dashboard:

- Conversation metrics
- Resolution rates
- Popular intents
- Busy hours and days
- Quality scores

## Tiered Features

### Basic Tier
- AI chatbot with intent recognition
- Basic knowledge base
- Website widget
- Simple analytics

### Standard Tier
- Enhanced knowledge base with semantic search
- Advanced analytics and reporting
- Calendar integration for appointment scheduling
- Email capture for lead generation

### Premium Tier
- Full CRM integration
- Email marketing integration
- Custom training for specific business needs
- Priority human handoff
- White-labeled solution

## Support

For assistance with setup or troubleshooting, contact our support team at support@example.com.
