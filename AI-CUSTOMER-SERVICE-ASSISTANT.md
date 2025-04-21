# AI Customer Service Assistant

## Overview

The AI Customer Service Assistant is a powerful, customizable chatbot solution designed to enhance customer support for small businesses. It provides 24/7 automated assistance, answers common questions, and seamlessly transfers complex inquiries to human agents when needed.

## Features

- **Natural Language Understanding**: Understands customer inquiries in plain language
- **Knowledge Base Integration**: Accesses your business information, FAQs, products, and services
- **Multi-platform Support**: Works on websites, mobile apps, and social media platforms
- **Customizable Appearance**: Matches your brand's look and feel
- **Seamless Human Handoff**: Transfers complex conversations to human agents
- **Analytics Dashboard**: Tracks performance and identifies improvement opportunities
- **Easy Setup**: Simple configuration with minimal technical knowledge required

## Architecture

The AI Customer Service Assistant is built with a modular architecture:

1. **Chat Widget**: A responsive frontend component that can be embedded in websites and applications
2. **Core Engine**: Processes messages, manages conversations, and coordinates with other components
3. **Knowledge Base**: Stores business information, FAQs, products, and services
4. **AI Integration**: Connects with OpenAI's GPT models for natural language understanding
5. **Admin Dashboard**: Provides configuration, monitoring, and analytics capabilities

## Technical Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Next.js
- **Database**: PostgreSQL (with mock database option for development)
- **AI**: OpenAI GPT models
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (optional for production)
- OpenAI API key (for production)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ai_customer_service
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_SSL=false

   # Use mock database for development
   USE_MOCK_DB=true

   # OpenAI API
   OPENAI_API_KEY=your_openai_api_key

   # Next.js
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deploy to Vercel:
   ```bash
   vercel
   ```
4. Set up environment variables in the Vercel dashboard

## Usage

### Embedding the Chat Widget

Add the following code to your website:

```html
<script src="https://your-deployment-url/widget.js" 
        data-business-id="your-business-id"
        data-theme="light"
        data-position="right"></script>
```

### Customizing the Chat Widget

The chat widget can be customized with the following attributes:

- `data-business-id`: Your unique business ID
- `data-theme`: `light`, `dark`, or `custom`
- `data-position`: `left` or `right`
- `data-primary-color`: Primary color in hex format (e.g., `#0070f3`)
- `data-font-family`: Font family to use (e.g., `Arial, sans-serif`)
- `data-auto-show`: `true` or `false` to automatically show the widget after a delay
- `data-auto-show-delay`: Delay in seconds before showing the widget

### Admin Dashboard

Access the admin dashboard at `https://your-deployment-url/admin` to:

- Configure the chatbot
- Manage your knowledge base
- View conversation history
- Monitor analytics
- Set up integrations

## Development

### Project Structure

```
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router
│   ├── components/     # React components
│   ├── db/             # Database connection and migrations
│   ├── models/         # Data models
│   ├── repositories/   # Data access layer
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── mock-data/      # Mock data for development
├── scripts/            # Build and setup scripts
├── .env.local          # Environment variables
└── package.json        # Dependencies and scripts
```

### Key Components

#### Chat Widget

The chat widget is a React component that can be embedded in any website. It provides a user interface for customers to interact with the AI assistant.

#### Knowledge Base

The knowledge base stores information about your business, including:

- Business information (name, description, hours, contact details)
- FAQs (questions and answers)
- Products (name, description, price, attributes)
- Services (name, description, price, duration)

#### AI Integration

The AI integration connects with OpenAI's GPT models to:

- Understand customer inquiries
- Generate appropriate responses
- Identify when human intervention is needed

#### Analytics

The analytics module tracks:

- Conversation volume and duration
- Message counts
- Resolution and transfer rates
- Popular topics and questions
- Busy hours and days

## Customization

### Appearance

The appearance of the chat widget can be customized through the admin dashboard or by setting attributes in the embed code.

### Behavior

The behavior of the chat widget can be customized through the admin dashboard, including:

- Welcome message
- Fallback message
- Transfer message
- Offline message
- Contact information collection
- File upload settings

### AI Settings

The AI settings can be customized through the admin dashboard, including:

- Model selection (GPT-3.5-Turbo or GPT-4)
- Temperature (creativity level)
- Maximum tokens (response length)
- Other model parameters

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check database credentials in `.env.local`
   - Ensure PostgreSQL is running
   - Try using the mock database with `USE_MOCK_DB=true`

2. **OpenAI API Errors**
   - Verify your API key is correct
   - Check for rate limits or quota issues
   - Ensure your account has access to the selected model

3. **Widget Not Loading**
   - Check for JavaScript errors in the browser console
   - Verify the business ID is correct
   - Ensure the deployment URL is accessible

## Support

For support, please contact us at support@example.com or open an issue on GitHub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
