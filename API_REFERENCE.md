# API Reference

This document provides detailed information about the AI Customer Service Assistant API for developers who want to integrate the assistant with their own systems or customize its functionality beyond the standard options.

## Table of Contents

- [Authentication](#authentication)
- [Base URL](#base-url)
- [Rate Limits](#rate-limits)
- [Embed API](#embed-api)
  - [Configuration Options](#configuration-options)
  - [JavaScript Methods](#javascript-methods)
  - [Event Listeners](#event-listeners)
- [REST API](#rest-api)
  - [Conversations](#conversations)
  - [Messages](#messages)
  - [Knowledge Base](#knowledge-base)
  - [Analytics](#analytics)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Authentication

All API requests require authentication using an API key. You can generate API keys in your dashboard under "Settings" → "API Keys".

Include your API key in the request headers:

```
Authorization: Bearer YOUR_API_KEY
```

## Base URL

All API endpoints are relative to the following base URL:

```
https://api.aiassistant.com/v1
```

## Rate Limits

The API has the following rate limits:

- **Free Plan**: 100 requests per minute
- **Basic Plan**: 500 requests per minute
- **Standard Plan**: 1,000 requests per minute
- **Premium Plan**: 5,000 requests per minute

If you exceed these limits, you'll receive a `429 Too Many Requests` response.

## Embed API

The Embed API allows you to customize the behavior of the assistant on your website.

### Configuration Options

These options can be set as data attributes in the embed code:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data-assistant-id` | String | *Required* | Your unique assistant ID |
| `data-theme` | String | `"light"` | Theme: `"light"` or `"dark"` |
| `data-primary-color` | String | `"#0071e3"` | Primary color in hex format |
| `data-secondary-color` | String | `"#34c759"` | Secondary color in hex format |
| `data-font` | String | `"SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"` | Font family |
| `data-position` | String | `"bottom-right"` | Widget position: `"bottom-right"`, `"bottom-left"`, `"top-right"`, `"top-left"` |
| `data-margin-x` | Number | `20` | Horizontal margin in pixels |
| `data-margin-y` | Number | `20` | Vertical margin in pixels |
| `data-width` | Number | `360` | Widget width in pixels |
| `data-height` | Number | `500` | Widget height in pixels |
| `data-welcome-message` | String | `"Hello! How can I assist you today?"` | Welcome message |
| `data-suggested-actions` | String | `""` | Comma-separated list of suggested actions |
| `data-auto-open` | Boolean | `false` | Whether to auto-open the widget |
| `data-auto-open-delay` | Number | `5` | Delay in seconds before auto-opening |
| `data-show-avatar` | Boolean | `true` | Whether to show the avatar in messages |
| `data-logo-url` | String | `""` | URL to your logo image |
| `data-avatar-url` | String | `""` | URL to your avatar image |
| `data-hide-on-mobile` | Boolean | `false` | Whether to hide the widget on mobile devices |
| `data-hide-on-paths` | String | `""` | Comma-separated list of URL paths where the widget should be hidden |

### JavaScript Methods

The assistant exposes a JavaScript API that you can use to control it programmatically:

```javascript
// Initialize with custom options
window.AIAssistant.init({
  assistantId: 'your-assistant-id',
  theme: 'dark',
  primaryColor: '#ff9500'
});

// Open the chat widget
window.AIAssistant.open();

// Close the chat widget
window.AIAssistant.close();

// Toggle the chat widget
window.AIAssistant.toggle();

// Send a message programmatically
window.AIAssistant.sendMessage('What are your business hours?');

// Clear the conversation
window.AIAssistant.clearConversation();

// Set user information
window.AIAssistant.setUserInfo({
  name: 'John Doe',
  email: 'john@example.com',
  customData: {
    accountType: 'premium',
    signupDate: '2023-01-15'
  }
});

// Update configuration
window.AIAssistant.updateConfig({
  theme: 'light',
  primaryColor: '#0071e3'
});
```

### Event Listeners

You can listen for events to integrate with your website's functionality:

```javascript
// Listen for when the widget is opened
window.AIAssistant.on('open', function() {
  console.log('Chat widget opened');
});

// Listen for when the widget is closed
window.AIAssistant.on('close', function() {
  console.log('Chat widget closed');
});

// Listen for when a conversation starts
window.AIAssistant.on('conversation_start', function(conversationId) {
  console.log('New conversation started:', conversationId);
});

// Listen for when a message is sent by the user
window.AIAssistant.on('message_sent', function(message) {
  console.log('User sent message:', message);
});

// Listen for when a message is received from the assistant
window.AIAssistant.on('message_received', function(message) {
  console.log('Assistant sent message:', message);
});

// Listen for when a human handoff is requested
window.AIAssistant.on('human_handoff', function(conversationData) {
  console.log('Human handoff requested:', conversationData);
});

// Listen for errors
window.AIAssistant.on('error', function(error) {
  console.error('Assistant error:', error);
});
```

## REST API

The REST API allows you to manage your assistant, conversations, and knowledge base programmatically.

### Conversations

#### List Conversations

```
GET /conversations
```

Query Parameters:
- `limit` (optional): Number of conversations to return (default: 20, max: 100)
- `offset` (optional): Offset for pagination (default: 0)
- `status` (optional): Filter by status (`active`, `closed`, `all`)
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)

Response:
```json
{
  "conversations": [
    {
      "id": "conv_123456789",
      "status": "active",
      "created_at": "2023-06-15T14:30:00Z",
      "updated_at": "2023-06-15T14:35:00Z",
      "user": {
        "id": "user_987654321",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "message_count": 5,
      "last_message": {
        "id": "msg_567890123",
        "content": "Thank you for your help!",
        "role": "user",
        "created_at": "2023-06-15T14:35:00Z"
      }
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

#### Get Conversation

```
GET /conversations/{conversation_id}
```

Response:
```json
{
  "id": "conv_123456789",
  "status": "active",
  "created_at": "2023-06-15T14:30:00Z",
  "updated_at": "2023-06-15T14:35:00Z",
  "user": {
    "id": "user_987654321",
    "name": "John Doe",
    "email": "john@example.com",
    "custom_data": {
      "accountType": "premium",
      "signupDate": "2023-01-15"
    }
  },
  "messages": [
    {
      "id": "msg_123456789",
      "content": "Hello! How can I assist you today?",
      "role": "assistant",
      "created_at": "2023-06-15T14:30:00Z"
    },
    {
      "id": "msg_234567890",
      "content": "What are your business hours?",
      "role": "user",
      "created_at": "2023-06-15T14:31:00Z"
    },
    {
      "id": "msg_345678901",
      "content": "Our business hours are Monday to Friday from 9:00 AM to 5:00 PM, Saturday from 10:00 AM to 3:00 PM, and we are closed on Sunday.",
      "role": "assistant",
      "created_at": "2023-06-15T14:31:05Z"
    }
  ],
  "metadata": {
    "source": "website",
    "page_url": "https://example.com/contact",
    "browser": "Chrome",
    "os": "Windows"
  }
}
```

#### Close Conversation

```
POST /conversations/{conversation_id}/close
```

Response:
```json
{
  "id": "conv_123456789",
  "status": "closed",
  "closed_at": "2023-06-15T15:00:00Z"
}
```

### Messages

#### Send Message

```
POST /conversations/{conversation_id}/messages
```

Request Body:
```json
{
  "content": "What are your business hours?",
  "role": "user"
}
```

Response:
```json
{
  "id": "msg_234567890",
  "content": "What are your business hours?",
  "role": "user",
  "created_at": "2023-06-15T14:31:00Z",
  "conversation_id": "conv_123456789"
}
```

#### Get Message

```
GET /messages/{message_id}
```

Response:
```json
{
  "id": "msg_234567890",
  "content": "What are your business hours?",
  "role": "user",
  "created_at": "2023-06-15T14:31:00Z",
  "conversation_id": "conv_123456789"
}
```

### Knowledge Base

#### List FAQs

```
GET /knowledge-base/faqs
```

Query Parameters:
- `limit` (optional): Number of FAQs to return (default: 20, max: 100)
- `offset` (optional): Offset for pagination (default: 0)
- `category` (optional): Filter by category ID
- `query` (optional): Search query

Response:
```json
{
  "faqs": [
    {
      "id": "faq_123456789",
      "question": "What are your business hours?",
      "answer": "Our business hours are Monday to Friday from 9:00 AM to 5:00 PM, Saturday from 10:00 AM to 3:00 PM, and we are closed on Sunday.",
      "category": {
        "id": "cat_123456789",
        "name": "General"
      },
      "created_at": "2023-06-01T10:00:00Z",
      "updated_at": "2023-06-01T10:00:00Z"
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

#### Create FAQ

```
POST /knowledge-base/faqs
```

Request Body:
```json
{
  "question": "Do you offer free shipping?",
  "answer": "Yes, we offer free shipping on all orders over $50. For orders under $50, shipping costs $5.99.",
  "category_id": "cat_123456789",
  "alternative_questions": [
    "Is shipping free?",
    "How much does shipping cost?",
    "Do I have to pay for shipping?"
  ]
}
```

Response:
```json
{
  "id": "faq_234567890",
  "question": "Do you offer free shipping?",
  "answer": "Yes, we offer free shipping on all orders over $50. For orders under $50, shipping costs $5.99.",
  "category": {
    "id": "cat_123456789",
    "name": "Shipping"
  },
  "alternative_questions": [
    "Is shipping free?",
    "How much does shipping cost?",
    "Do I have to pay for shipping?"
  ],
  "created_at": "2023-06-15T15:30:00Z",
  "updated_at": "2023-06-15T15:30:00Z"
}
```

#### Update FAQ

```
PUT /knowledge-base/faqs/{faq_id}
```

Request Body:
```json
{
  "question": "Do you offer free shipping?",
  "answer": "Yes, we offer free shipping on all orders over $75. For orders under $75, shipping costs $4.99.",
  "category_id": "cat_123456789",
  "alternative_questions": [
    "Is shipping free?",
    "How much does shipping cost?",
    "Do I have to pay for shipping?"
  ]
}
```

Response:
```json
{
  "id": "faq_234567890",
  "question": "Do you offer free shipping?",
  "answer": "Yes, we offer free shipping on all orders over $75. For orders under $75, shipping costs $4.99.",
  "category": {
    "id": "cat_123456789",
    "name": "Shipping"
  },
  "alternative_questions": [
    "Is shipping free?",
    "How much does shipping cost?",
    "Do I have to pay for shipping?"
  ],
  "created_at": "2023-06-15T15:30:00Z",
  "updated_at": "2023-06-15T16:00:00Z"
}
```

#### Delete FAQ

```
DELETE /knowledge-base/faqs/{faq_id}
```

Response:
```json
{
  "success": true,
  "message": "FAQ deleted successfully"
}
```

### Analytics

#### Get Conversation Analytics

```
GET /analytics/conversations
```

Query Parameters:
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)
- `interval` (optional): Interval for grouping data (`day`, `week`, `month`)

Response:
```json
{
  "total_conversations": 1248,
  "average_messages_per_conversation": 5.3,
  "average_response_time": 1.2,
  "satisfaction_rate": 94,
  "timeline": [
    {
      "date": "2023-06-01",
      "conversations": 42,
      "messages": 215,
      "response_time": 1.3,
      "satisfaction_rate": 93
    },
    {
      "date": "2023-06-02",
      "conversations": 38,
      "messages": 198,
      "response_time": 1.2,
      "satisfaction_rate": 95
    }
  ]
}
```

#### Get Topic Analytics

```
GET /analytics/topics
```

Query Parameters:
- `from` (optional): Start date (ISO format)
- `to` (optional): End date (ISO format)
- `limit` (optional): Number of topics to return (default: 10, max: 50)

Response:
```json
{
  "topics": [
    {
      "name": "Product Information",
      "count": 325,
      "percentage": 26
    },
    {
      "name": "Pricing",
      "count": 287,
      "percentage": 23
    },
    {
      "name": "Returns",
      "count": 198,
      "percentage": 16
    },
    {
      "name": "Shipping",
      "count": 156,
      "percentage": 12
    },
    {
      "name": "Other",
      "count": 282,
      "percentage": 23
    }
  ]
}
```

## Webhooks

You can configure webhooks to receive notifications about events in your assistant. Configure webhooks in your dashboard under "Settings" → "Webhooks".

### Available Events

- `conversation.created`: Triggered when a new conversation starts
- `conversation.closed`: Triggered when a conversation is closed
- `message.created`: Triggered when a new message is sent or received
- `human_handoff.requested`: Triggered when a human handoff is requested

### Webhook Payload

```json
{
  "event": "message.created",
  "timestamp": "2023-06-15T14:31:00Z",
  "data": {
    "id": "msg_234567890",
    "content": "What are your business hours?",
    "role": "user",
    "created_at": "2023-06-15T14:31:00Z",
    "conversation_id": "conv_123456789"
  }
}
```

### Webhook Security

Webhooks include a signature in the `X-Signature` header. Verify this signature to ensure the webhook is from us:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature)
  );
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request:

- `200 OK`: The request was successful
- `201 Created`: The resource was created successfully
- `400 Bad Request`: The request was invalid
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource doesn't exist
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Something went wrong on our end

Error responses include a JSON object with details:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": "The 'question' field is required"
  }
}
```

## Examples

### Example 1: Create a Conversation and Send a Message

```javascript
// Create a new conversation
fetch('https://api.aiassistant.com/v1/conversations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    metadata: {
      source: 'api',
      custom_data: {
        accountType: 'premium'
      }
    }
  })
})
.then(response => response.json())
.then(conversation => {
  // Send a message in the conversation
  return fetch(`https://api.aiassistant.com/v1/conversations/${conversation.id}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: 'What are your business hours?',
      role: 'user'
    })
  });
})
.then(response => response.json())
.then(message => {
  console.log('Message sent:', message);
})
.catch(error => {
  console.error('Error:', error);
});
```

### Example 2: Add an FAQ to the Knowledge Base

```javascript
fetch('https://api.aiassistant.com/v1/knowledge-base/faqs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    question: 'Do you offer free shipping?',
    answer: 'Yes, we offer free shipping on all orders over $50. For orders under $50, shipping costs $5.99.',
    category_id: 'cat_123456789',
    alternative_questions: [
      'Is shipping free?',
      'How much does shipping cost?',
      'Do I have to pay for shipping?'
    ]
  })
})
.then(response => response.json())
.then(faq => {
  console.log('FAQ created:', faq);
})
.catch(error => {
  console.error('Error:', error);
});
```

### Example 3: Get Conversation Analytics

```javascript
const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const from = oneMonthAgo.toISOString().split('T')[0];
const to = today.toISOString().split('T')[0];

fetch(`https://api.aiassistant.com/v1/analytics/conversations?from=${from}&to=${to}&interval=day`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(analytics => {
  console.log('Conversation analytics:', analytics);
})
.catch(error => {
  console.error('Error:', error);
});
```

For more examples and detailed API documentation, please refer to our [API Documentation Portal](https://api.aiassistant.com/docs).
