# AI Customer Service Assistant - Test Data Samples

This document provides sample test data for testing the AI Customer Service Assistant.

## Knowledge Base Test Data

### Retail Industry Sample

```json
{
  "industry": "Retail",
  "entries": [
    {
      "question": "What are your store hours?",
      "answer": "Our store is open Monday to Friday from 9am to 8pm, Saturday from 10am to 6pm, and Sunday from 12pm to 5pm.",
      "alternatives": [
        "When are you open?",
        "What time does the store close?",
        "Are you open on weekends?"
      ],
      "category": "Store Information"
    },
    {
      "question": "Do you offer free shipping?",
      "answer": "Yes, we offer free standard shipping on all orders over $50. Orders under $50 have a flat shipping fee of $5.99.",
      "alternatives": [
        "How much is shipping?",
        "Is there a shipping charge?",
        "Do I have to pay for delivery?"
      ],
      "category": "Shipping & Delivery"
    },
    {
      "question": "What is your return policy?",
      "answer": "We accept returns within 30 days of purchase with original receipt. Items must be unused and in original packaging. Return shipping is free for defective items.",
      "alternatives": [
        "Can I return items?",
        "How do I return something?",
        "What's your refund policy?"
      ],
      "category": "Returns & Refunds"
    },
    {
      "question": "Do you have a loyalty program?",
      "answer": "Yes, our Rewards Club is free to join and gives you 1 point for every dollar spent. 100 points can be redeemed for a $5 discount on future purchases.",
      "alternatives": [
        "Do you have a rewards program?",
        "How do I earn points?",
        "Is there a membership discount?"
      ],
      "category": "Loyalty & Rewards"
    },
    {
      "question": "How can I track my order?",
      "answer": "You can track your order by clicking the tracking link in your shipping confirmation email or by logging into your account on our website and viewing your order history.",
      "alternatives": [
        "Where is my order?",
        "Order tracking information",
        "How do I find my shipment?"
      ],
      "category": "Shipping & Delivery"
    }
  ]
}
```

### Restaurant Industry Sample

```json
{
  "industry": "Restaurant",
  "entries": [
    {
      "question": "Do you take reservations?",
      "answer": "Yes, we accept reservations up to 30 days in advance. You can book online through our website or by calling (555) 123-4567.",
      "alternatives": [
        "Can I book a table?",
        "How do I make a reservation?",
        "Do I need to reserve in advance?"
      ],
      "category": "Reservations"
    },
    {
      "question": "Do you have vegetarian options?",
      "answer": "Yes, we offer several vegetarian dishes on our menu. These items are marked with a (V) symbol. We can also modify many other dishes to be vegetarian upon request.",
      "alternatives": [
        "Is there anything vegetarian?",
        "Do you serve vegetarian food?",
        "What can I eat if I'm vegetarian?"
      ],
      "category": "Menu Information"
    },
    {
      "question": "Do you deliver?",
      "answer": "Yes, we offer delivery within a 5-mile radius of the restaurant. There is a $3 delivery fee, and the minimum order amount is $20. We also partner with UberEats and DoorDash.",
      "alternatives": [
        "Can I get food delivered?",
        "Do you offer food delivery?",
        "How much is delivery?"
      ],
      "category": "Ordering & Delivery"
    },
    {
      "question": "Do you have outdoor seating?",
      "answer": "Yes, we have a patio with 10 tables available for outdoor dining, weather permitting. Outdoor seating is first-come, first-served and cannot be reserved.",
      "alternatives": [
        "Is there a patio?",
        "Can we sit outside?",
        "Do you have tables outdoors?"
      ],
      "category": "Seating & Ambiance"
    },
    {
      "question": "Are you open on holidays?",
      "answer": "Our holiday hours vary. We are closed on Thanksgiving and Christmas Day. On other holidays, we may have reduced hours. Please check our website or social media for specific holiday schedules.",
      "alternatives": [
        "Are you open on Christmas?",
        "Holiday hours",
        "Do you close for holidays?"
      ],
      "category": "Hours & Availability"
    }
  ]
}
```

## Test User Profiles

### Customer Personas

```json
[
  {
    "id": "user_001",
    "name": "Sarah Johnson",
    "age": 34,
    "persona": "Busy Professional",
    "behavior": "Direct, time-conscious, prefers quick answers",
    "typical_questions": [
      "Do you have this in stock?",
      "What's your fastest shipping option?",
      "Can I return this if it doesn't fit?"
    ],
    "test_scenario": "Looking for specific product information with time constraints"
  },
  {
    "id": "user_002",
    "name": "Michael Rodriguez",
    "age": 67,
    "persona": "Senior Citizen",
    "behavior": "Patient, may need extra explanation, prefers simple language",
    "typical_questions": [
      "How do I place an order?",
      "Can someone help me choose the right product?",
      "Do you offer senior discounts?"
    ],
    "test_scenario": "First-time online shopper needing guidance"
  },
  {
    "id": "user_003",
    "name": "Taylor Wong",
    "age": 22,
    "persona": "Tech-Savvy Student",
    "behavior": "Uses slang, types quickly, expects instant responses",
    "typical_questions": [
      "yo do u ship to campus addresses?",
      "can i get this by friday?",
      "whats the student discount code?"
    ],
    "test_scenario": "Checking delivery options for urgent purchase"
  },
  {
    "id": "user_004",
    "name": "David Miller",
    "age": 45,
    "persona": "Detail-Oriented Researcher",
    "behavior": "Asks specific, detailed questions, wants comprehensive answers",
    "typical_questions": [
      "What are the exact dimensions of the product?",
      "Is this compatible with model X-200?",
      "Can you explain the difference between these two options?"
    ],
    "test_scenario": "Comparing product specifications before purchase"
  },
  {
    "id": "user_005",
    "name": "Emma Garcia",
    "age": 29,
    "persona": "Frustrated Customer",
    "behavior": "Upset about previous experience, uses emotional language",
    "typical_questions": [
      "Why hasn't my order arrived yet?",
      "I received the wrong item, what now?",
      "This is the third time I've had to contact you!"
    ],
    "test_scenario": "Seeking resolution for delayed shipment"
  }
]
```

## Test Conversation Flows

### Simple Information Request

```
User: Hi, what are your store hours?
Assistant: Our store is open Monday to Friday from 9am to 8pm, Saturday from 10am to 6pm, and Sunday from 12pm to 5pm.
User: Are you open on holidays?
Assistant: Our holiday hours vary. We are closed on Thanksgiving and Christmas Day. On other holidays, we may have reduced hours. Please check our website or social media for specific holiday schedules.
User: Thanks!
Assistant: You're welcome! Is there anything else I can help you with today?
User: No, that's all.
Assistant: Thank you for chatting with us. Have a great day! If you need any assistance in the future, feel free to reach out.
```

### Product Inquiry with Follow-up

```
User: Do you have the XYZ Wireless Headphones in stock?
Assistant: Yes, we currently have the XYZ Wireless Headphones in stock in black, white, and blue colors.
User: How much are they?
Assistant: The XYZ Wireless Headphones are priced at $129.99. Currently, we're running a promotion where you can get a free charging case with your purchase.
User: Do you offer any warranty?
Assistant: Yes, the XYZ Wireless Headphones come with a 1-year manufacturer warranty. We also offer an extended 2-year protection plan for an additional $19.99.
User: And what's your return policy if I don't like them?
Assistant: We accept returns within 30 days of purchase with original receipt. Items must be unused and in original packaging. Return shipping is free for defective items.
User: Great, thanks for the information.
Assistant: You're welcome! Would you like me to help you place an order for the XYZ Wireless Headphones?
User: Not right now, I'll think about it.
Assistant: No problem! If you have any other questions or decide to make a purchase later, feel free to chat with us again. Have a great day!
```

### Complex Support Scenario

```
User: I ordered a laptop last week but haven't received any shipping confirmation.
Assistant: I'm sorry to hear that. I'd be happy to help you check on your order. Could you please provide your order number?
User: It's ORD-12345-67890
Assistant: Thank you. Let me look up that order for you. One moment please...
Assistant: I've found your order for the ProBook X5 laptop placed on May 15th. I see that there was a slight delay in processing due to a verification check, but your order has been shipped today. You should receive a shipping confirmation email within the next hour with tracking information.
User: That's frustrating. I needed it for a presentation tomorrow.
Assistant: I completely understand your frustration, and I apologize for the delay. According to the shipping information, your laptop is being sent via expedited shipping and is scheduled for delivery tomorrow by 12pm. Would you like me to double-check this with our shipping department?
User: Yes please, that would be helpful.
Assistant: I'll contact our shipping department right away. Would you mind staying in the chat while I do this, or would you prefer that I email you with an update?
User: I'll wait here.
Assistant: Thank you for your patience. I've confirmed with our shipping department that your laptop is out for delivery and scheduled to arrive tomorrow by 12pm. They've also upgraded your shipping to priority status at no extra charge due to the delay. You'll receive the tracking number by email within the next 30 minutes.
User: Thank you, that's a relief.
Assistant: You're welcome. I apologize again for the inconvenience. Is there anything else I can assist you with regarding your order?
User: No, that's all I needed.
Assistant: Thank you for your patience and understanding. If you have any other questions or concerns, please don't hesitate to reach out. Have a great presentation tomorrow!
```

## Test Configuration Settings

### Widget Appearance Settings

```json
{
  "theme": "light",
  "primaryColor": "#0071e3",
  "secondaryColor": "#f5f5f7",
  "fontFamily": "Helvetica Neue, Helvetica, Arial, sans-serif",
  "fontSize": "14px",
  "borderRadius": "10px",
  "position": "bottom-right",
  "buttonText": "Chat with us",
  "buttonIcon": "chat",
  "headerText": "Customer Support",
  "placeholderText": "Type your message...",
  "welcomeMessage": "Hello! How can I help you today?",
  "offlineMessage": "We're currently offline. Please leave a message and we'll get back to you soon.",
  "showAvatar": true,
  "showTimestamp": true,
  "showTypingIndicator": true,
  "enableEmoji": true,
  "enableAttachments": true,
  "enableHistory": true
}
```

### Integration Settings

```json
{
  "website": {
    "embedCode": "<script src=\"https://cdn.aiassistant.com/widget.js\" data-assistant-id=\"YOUR_ASSISTANT_ID\"></script>",
    "autoInitialize": true,
    "deferLoading": false,
    "cookieStorage": true,
    "sessionPersistence": true
  },
  "wordpress": {
    "pluginUrl": "https://wordpress.org/plugins/ai-customer-assistant/",
    "shortcode": "[ai_assistant id=\"YOUR_ASSISTANT_ID\" theme=\"light\"]",
    "widgetSupport": true,
    "gutenbergBlock": true
  },
  "shopify": {
    "appUrl": "https://apps.shopify.com/ai-customer-assistant",
    "productIntegration": true,
    "orderIntegration": true,
    "customerIntegration": true
  }
}
```

## Test Environment Variables

### Development Environment

```
API_ENDPOINT=https://dev-api.aiassistant.com/v1
AUTH_DOMAIN=dev-auth.aiassistant.com
CLIENT_ID=dev_client_123456
ENVIRONMENT=development
LOG_LEVEL=debug
ENABLE_MOCK_DATA=true
MOCK_RESPONSE_DELAY=500
AI_MODEL=gpt-3.5-turbo
KNOWLEDGE_BASE_ID=kb_dev_123456
ANALYTICS_ENABLED=false
```

### Testing Environment

```
API_ENDPOINT=https://test-api.aiassistant.com/v1
AUTH_DOMAIN=test-auth.aiassistant.com
CLIENT_ID=test_client_123456
ENVIRONMENT=testing
LOG_LEVEL=info
ENABLE_MOCK_DATA=false
MOCK_RESPONSE_DELAY=0
AI_MODEL=gpt-3.5-turbo
KNOWLEDGE_BASE_ID=kb_test_123456
ANALYTICS_ENABLED=true
```

### Production Environment

```
API_ENDPOINT=https://api.aiassistant.com/v1
AUTH_DOMAIN=auth.aiassistant.com
CLIENT_ID=prod_client_123456
ENVIRONMENT=production
LOG_LEVEL=error
ENABLE_MOCK_DATA=false
MOCK_RESPONSE_DELAY=0
AI_MODEL=gpt-4
KNOWLEDGE_BASE_ID=kb_prod_123456
ANALYTICS_ENABLED=true
```

This document provides sample test data for various aspects of the AI Customer Service Assistant. Use these samples for testing functionality, performance, and integration capabilities.
