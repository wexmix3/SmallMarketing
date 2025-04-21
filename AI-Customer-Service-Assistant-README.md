# AI Customer Service Assistant

A comprehensive AI-powered chatbot solution for small local businesses, integrated with the Marketing for Small Businesses platform.

## Overview

The AI Customer Service Assistant is a customizable chatbot that helps small businesses provide 24/7 customer support, answer common questions, schedule appointments, and collect leads. It integrates seamlessly with websites and can be customized to match your brand.

## Features

- **24/7 Automated Support**: Answer customer questions at any time
- **Custom Knowledge Base**: Train the AI with your business information, FAQs, products, and services
- **Appointment Scheduling**: Allow customers to book appointments directly through chat
- **Lead Capture**: Collect visitor information for follow-up
- **Human Handoff**: Transfer complex conversations to human agents
- **Analytics Dashboard**: Track conversation metrics and customer satisfaction
- **Customizable Appearance**: Match the chatbot to your brand identity
- **Multi-platform Support**: Website, Facebook, Instagram integration (Premium tier)

## Technical Architecture

The AI Customer Service Assistant is built using:

- **Frontend**: React.js/TypeScript with Next.js
- **Backend**: Node.js with Next.js API routes
- **Database**: PostgreSQL for structured data
- **AI/ML**: Integration with OpenAI GPT or Anthropic Claude APIs
- **Real-time Communication**: WebSockets for live chat
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- PostgreSQL database
- OpenAI API key (for AI functionality)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/marketing-for-small-businesses.git
   cd marketing-for-small-businesses
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   DATABASE_URL=your_database_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000/demo/customer-service-assistant](http://localhost:3000/demo/customer-service-assistant) to see the demo.

## Usage

### Admin Dashboard

Access the admin dashboard at `/admin/customer-service-assistant` to:
- View and manage conversations
- Configure your knowledge base
- Customize chatbot appearance and behavior
- View analytics and performance metrics

### Website Integration

To add the chatbot to your website, copy the embed code from the integration guide at `/docs/customer-service-assistant/integration`.

Basic integration example:

```html
<script>
  (function(w,d,s,o,f,js,fjs){
    w['AIChatWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','aichat','https://widget.example.com/loader.js'));
  
  aichat('init', 'your-business-id', { theme: 'light' });
</script>
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chatbot/           # API routes for chatbot functionality
│   ├── admin/
│   │   └── customer-service-assistant/  # Admin dashboard
│   ├── demo/
│   │   └── customer-service-assistant/  # Demo page
│   └── docs/
│       └── customer-service-assistant/  # Documentation
├── components/
│   └── chatbot/               # Chatbot UI components
├── models/
│   └── chatbot.ts             # Data models
├── repositories/
│   └── chatbotRepository.ts   # Data access layer
└── services/
    ├── aiService.ts           # AI processing service
    └── chatbotService.ts      # Business logic
```

## API Reference

### Chatbot Configuration

- `GET /api/chatbot/config?businessId={id}` - Get chatbot configuration
- `POST /api/chatbot/config` - Create or update configuration

### Conversations

- `GET /api/chatbot/conversations?businessId={id}` - Get conversations
- `POST /api/chatbot/conversations` - Create a new conversation
- `GET /api/chatbot/conversations/{id}` - Get a specific conversation
- `PUT /api/chatbot/conversations/{id}` - Update conversation status

### Messages

- `POST /api/chatbot/conversations/{id}/messages` - Send a message
- `PUT /api/chatbot/conversations/{id}/messages` - Mark messages as read

### Knowledge Base

- `GET /api/chatbot/knowledge?businessId={id}` - Get knowledge base
- `POST /api/chatbot/knowledge` - Create or update knowledge base
- `POST /api/chatbot/knowledge/faqs` - Add a new FAQ
- `PUT /api/chatbot/knowledge/faqs/{id}` - Update an FAQ
- `DELETE /api/chatbot/knowledge/faqs/{id}` - Delete an FAQ

## Pricing Plans

- **Basic Tier**: $29/month
  - Website integration
  - Customizable appearance
  - FAQ configuration
  - Basic analytics
  - Email notifications

- **Standard Tier**: $79/month
  - All Basic features
  - Appointment scheduling
  - Product/service catalog
  - Lead capture forms
  - Mobile app notifications
  - CRM integration

- **Premium Tier**: $149/month
  - All Standard features
  - Multi-language support
  - Multi-platform integration
  - Advanced analytics
  - Voice capability
  - Priority support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenAI for GPT API
- Anthropic for Claude API
- Next.js team for the framework
- Vercel for hosting
