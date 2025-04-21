# AI Customer Service Assistant - Configuration Reference

This document provides a comprehensive reference for all configuration options available in the AI Customer Service Assistant.

## Table of Contents

1. [Widget Configuration](#widget-configuration)
2. [Appearance Configuration](#appearance-configuration)
3. [Behavior Configuration](#behavior-configuration)
4. [Content Configuration](#content-configuration)
5. [Advanced Configuration](#advanced-configuration)
6. [Configuration Methods](#configuration-methods)
7. [Configuration Examples](#configuration-examples)

## Widget Configuration

These options control the basic setup of the chatbot widget.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `assistantId` | String | *Required* | Your unique assistant ID |
| `position` | String | `"bottom-right"` | Widget position: `"bottom-right"`, `"bottom-left"`, `"top-right"`, `"top-left"` |
| `marginX` | Number | `20` | Horizontal margin in pixels |
| `marginY` | Number | `20` | Vertical margin in pixels |
| `width` | Number | `360` | Widget width in pixels |
| `height` | Number | `500` | Widget height in pixels |
| `maxHeight` | String | `"80vh"` | Maximum height of the widget |
| `draggable` | Boolean | `true` | Whether the widget can be dragged |
| `hideOnMobile` | Boolean | `false` | Whether to hide the widget on mobile devices |
| `hideOnPaths` | Array | `[]` | Array of URL paths where the widget should be hidden |
| `showOnPaths` | Array | `[]` | Array of URL paths where the widget should be shown (overrides hideOnPaths) |
| `zIndex` | Number | `9999` | Z-index of the widget |

## Appearance Configuration

These options control the visual appearance of the chatbot.

### Theme Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | String | `"light"` | Theme: `"light"` or `"dark"` |
| `primaryColor` | String | `"#0071e3"` | Primary color in hex format |
| `secondaryColor` | String | `"#34c759"` | Secondary color in hex format |
| `font` | String | `"SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"` | Font family |
| `fontSize` | String | `"16px"` | Base font size |
| `borderRadius` | String | `"12px"` | Border radius for the widget |
| `boxShadow` | String | `"0 10px 25px rgba(0, 0, 0, 0.1)"` | Box shadow for the widget |

### Button Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `buttonIcon` | String | `"comment"` | Icon for the toggle button: `"comment"`, `"question"`, `"message"`, `"chat"` |
| `buttonSize` | Number | `60` | Size of the toggle button in pixels |
| `buttonIconSize` | Number | `24` | Size of the icon in the toggle button in pixels |
| `buttonColor` | String | `null` | Button background color (defaults to primaryColor) |
| `buttonIconColor` | String | `"#ffffff"` | Button icon color |

### Header Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showHeader` | Boolean | `true` | Whether to show the chat header |
| `headerColor` | String | `null` | Header background color (defaults to background color) |
| `showCloseButton` | Boolean | `true` | Whether to show the close button in the header |
| `showMinimizeButton` | Boolean | `true` | Whether to show the minimize button in the header |
| `logoUrl` | String | `""` | URL to your logo image |
| `logoHeight` | Number | `30` | Height of the logo in pixels |

### Message Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showAvatar` | Boolean | `true` | Whether to show the avatar in messages |
| `avatarUrl` | String | `""` | URL to your avatar image |
| `showTimestamp` | Boolean | `true` | Whether to show timestamps on messages |
| `timestampFormat` | String | `"h:mm a"` | Format for message timestamps |
| `userMessageColor` | String | `null` | Background color for user messages (defaults to primaryColor) |
| `botMessageColor` | String | `null` | Background color for bot messages (defaults to background light) |
| `userMessageTextColor` | String | `"#ffffff"` | Text color for user messages |
| `botMessageTextColor` | String | `null` | Text color for bot messages (defaults to text color) |

## Behavior Configuration

These options control how the chatbot behaves.

### General Behavior

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoOpen` | Boolean | `false` | Whether to auto-open the widget |
| `autoOpenDelay` | Number | `5000` | Delay in milliseconds before auto-opening |
| `autoOpenOnce` | Boolean | `true` | Whether to auto-open only once per session |
| `closeOnClickOutside` | Boolean | `true` | Whether to close the widget when clicking outside |
| `closeOnEsc` | Boolean | `true` | Whether to close the widget when pressing Escape |
| `persistSession` | Boolean | `true` | Whether to persist the conversation across page loads |
| `sessionTimeout` | Number | `1800000` | Session timeout in milliseconds (30 minutes) |

### Welcome Message

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `welcomeMessage` | String | `"Hello! How can I assist you today?"` | Welcome message |
| `showWelcomeMessage` | Boolean | `true` | Whether to show the welcome message |
| `delayWelcomeMessage` | Number | `500` | Delay in milliseconds before showing the welcome message |

### Suggested Actions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `suggestedActions` | Array | `[]` | Array of suggested actions to show with the welcome message |
| `showSuggestedActions` | Boolean | `true` | Whether to show suggested actions |
| `maxSuggestedActions` | Number | `4` | Maximum number of suggested actions to show |

### Input Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `inputPlaceholder` | String | `"Type your message..."` | Placeholder text for the input field |
| `sendButtonIcon` | String | `"paper-plane"` | Icon for the send button |
| `enableAttachments` | Boolean | `false` | Whether to enable file attachments |
| `maxAttachmentSize` | Number | `5242880` | Maximum attachment size in bytes (5MB) |
| `allowedAttachmentTypes` | Array | `[".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx"]` | Allowed attachment file types |

### Typing Indicator

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showTypingIndicator` | Boolean | `true` | Whether to show the typing indicator |
| `typingIndicatorTimeout` | Number | `10000` | Timeout for the typing indicator in milliseconds |

## Content Configuration

These options control the content and knowledge base of the chatbot.

### Business Information

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `businessName` | String | `"Your Business"` | Your business name |
| `businessDescription` | String | `""` | Short description of your business |
| `businessUrl` | String | `""` | URL to your business website |
| `businessEmail` | String | `""` | Contact email for your business |
| `businessPhone` | String | `""` | Contact phone number for your business |
| `businessAddress` | String | `""` | Physical address of your business |

### Business Hours

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `businessHours` | Object | See below | Business hours configuration |
| `showBusinessHours` | Boolean | `true` | Whether to include business hours in responses |
| `offlineMessage` | String | `"We're currently offline. Please leave a message and we'll get back to you as soon as possible."` | Message shown when outside business hours |

Default business hours:
```javascript
{
  monday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
  tuesday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
  wednesday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
  thursday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
  friday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
  saturday: { open: "10:00 AM", close: "3:00 PM", isClosed: false },
  sunday: { open: "", close: "", isClosed: true }
}
```

### Knowledge Base

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `knowledgeBase` | Array | `[]` | Array of FAQ objects |
| `knowledgeBaseUrl` | String | `""` | URL to a JSON file containing the knowledge base |
| `fallbackMessage` | String | `"I'm sorry, I don't have an answer for that. Would you like to contact our support team?"` | Message shown when no answer is found |
| `matchThreshold` | Number | `0.6` | Threshold for matching questions (0-1) |

Knowledge base item format:
```javascript
{
  id: "kb-1",
  question: "What are your business hours?",
  answer: "Our business hours are Monday to Friday from 9:00 AM to 5:00 PM, Saturday from 10:00 AM to 3:00 PM, and we are closed on Sunday.",
  category: "General",
  alternativeQuestions: [
    "When are you open?",
    "What time do you close?",
    "Are you open on weekends?"
  ]
}
```

## Advanced Configuration

These options provide advanced functionality for the chatbot.

### Human Handoff

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableHumanHandoff` | Boolean | `false` | Whether to enable human handoff |
| `humanHandoffMessage` | String | `"Would you like to speak with a human agent?"` | Message shown when offering human handoff |
| `humanHandoffThreshold` | Number | `3` | Number of failed responses before offering human handoff |
| `humanHandoffCallback` | Function | `null` | Callback function when human handoff is requested |

### Analytics

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableAnalytics` | Boolean | `true` | Whether to enable analytics |
| `analyticsCallback` | Function | `null` | Callback function for analytics events |
| `trackEvents` | Array | `["open", "close", "message", "error"]` | Events to track |

### Localization

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `language` | String | `"en"` | Language code |
| `translations` | Object | `{}` | Custom translations |
| `dateFormat` | String | `"MM/DD/YYYY"` | Date format |
| `timeFormat` | String | `"h:mm A"` | Time format |

### Accessibility

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableA11y` | Boolean | `true` | Whether to enable accessibility features |
| `ariaLabels` | Object | See below | ARIA labels for UI elements |

Default ARIA labels:
```javascript
{
  toggleButton: "Toggle chat window",
  closeButton: "Close chat window",
  minimizeButton: "Minimize chat window",
  messageInput: "Type your message",
  sendButton: "Send message",
  attachmentButton: "Attach file"
}
```

## Configuration Methods

There are several ways to configure the AI Customer Service Assistant:

### HTML Data Attributes

You can configure the assistant using HTML data attributes:

```html
<script src="path/to/chatbot-widget.js" 
        data-assistant-id="your-assistant-id" 
        data-position="bottom-right" 
        data-primary-color="#0071e3"
        data-theme="light"
        data-welcome-message="Hello! How can I assist you today?"
        data-auto-open="false"
        data-auto-open-delay="5000"
        data-show-avatar="true">
</script>
```

### JavaScript Initialization

You can configure the assistant using JavaScript:

```javascript
window.AIAssistant.init({
  assistantId: 'your-assistant-id',
  position: 'bottom-right',
  primaryColor: '#0071e3',
  theme: 'light',
  welcomeMessage: 'Hello! How can I assist you today?',
  autoOpen: false,
  autoOpenDelay: 5000,
  showAvatar: true
});
```

### Configuration Object

You can create a configuration object and pass it to the initialization function:

```javascript
const config = {
  assistantId: 'your-assistant-id',
  position: 'bottom-right',
  primaryColor: '#0071e3',
  theme: 'light',
  welcomeMessage: 'Hello! How can I assist you today?',
  autoOpen: false,
  autoOpenDelay: 5000,
  showAvatar: true
};

window.AIAssistant.init(config);
```

### Dynamic Configuration

You can update the configuration at runtime:

```javascript
// Update a single option
window.AIAssistant.updateConfig('theme', 'dark');

// Update multiple options
window.AIAssistant.updateConfig({
  theme: 'dark',
  primaryColor: '#5856d6'
});
```

## Configuration Examples

Here are some common configuration examples:

### E-commerce Website

```javascript
window.AIAssistant.init({
  assistantId: 'your-assistant-id',
  position: 'bottom-right',
  primaryColor: '#4a90e2',
  theme: 'light',
  welcomeMessage: 'Welcome to our store! How can I help you today?',
  suggestedActions: [
    'View products',
    'Check order status',
    'Return policy',
    'Shipping information'
  ],
  businessHours: {
    monday: { open: "8:00 AM", close: "8:00 PM", isClosed: false },
    tuesday: { open: "8:00 AM", close: "8:00 PM", isClosed: false },
    wednesday: { open: "8:00 AM", close: "8:00 PM", isClosed: false },
    thursday: { open: "8:00 AM", close: "8:00 PM", isClosed: false },
    friday: { open: "8:00 AM", close: "8:00 PM", isClosed: false },
    saturday: { open: "9:00 AM", close: "6:00 PM", isClosed: false },
    sunday: { open: "10:00 AM", close: "4:00 PM", isClosed: false }
  },
  knowledgeBase: [
    {
      id: "kb-1",
      question: "What is your return policy?",
      answer: "You can return any item within 30 days of purchase for a full refund. The item must be in its original condition and packaging.",
      category: "Returns"
    },
    {
      id: "kb-2",
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and going to the 'Orders' section. Alternatively, you can use the tracking number provided in your shipping confirmation email.",
      category: "Orders"
    }
  ]
});
```

### Professional Services

```javascript
window.AIAssistant.init({
  assistantId: 'your-assistant-id',
  position: 'bottom-right',
  primaryColor: '#34c759',
  theme: 'light',
  welcomeMessage: 'Welcome to our firm. How may we assist you today?',
  suggestedActions: [
    'Book a consultation',
    'Our services',
    'Contact information',
    'Office locations'
  ],
  businessHours: {
    monday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
    tuesday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
    wednesday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
    thursday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
    friday: { open: "9:00 AM", close: "5:00 PM", isClosed: false },
    saturday: { open: "", close: "", isClosed: true },
    sunday: { open: "", close: "", isClosed: true }
  },
  enableHumanHandoff: true,
  humanHandoffMessage: "Would you like to schedule a consultation with one of our professionals?",
  humanHandoffCallback: function(conversation) {
    // Custom logic to handle human handoff
    console.log("Human handoff requested:", conversation);
    // Example: Open a form to schedule a consultation
    window.location.href = "/schedule-consultation";
  }
});
```

### Restaurant

```javascript
window.AIAssistant.init({
  assistantId: 'your-assistant-id',
  position: 'bottom-right',
  primaryColor: '#ff9500',
  theme: 'dark',
  welcomeMessage: 'Welcome to our restaurant! How can I assist you today?',
  suggestedActions: [
    'View menu',
    'Make a reservation',
    'Opening hours',
    'Delivery options'
  ],
  businessHours: {
    monday: { open: "11:00 AM", close: "10:00 PM", isClosed: false },
    tuesday: { open: "11:00 AM", close: "10:00 PM", isClosed: false },
    wednesday: { open: "11:00 AM", close: "10:00 PM", isClosed: false },
    thursday: { open: "11:00 AM", close: "10:00 PM", isClosed: false },
    friday: { open: "11:00 AM", close: "11:00 PM", isClosed: false },
    saturday: { open: "11:00 AM", close: "11:00 PM", isClosed: false },
    sunday: { open: "12:00 PM", close: "9:00 PM", isClosed: false }
  },
  knowledgeBase: [
    {
      id: "kb-1",
      question: "Do you take reservations?",
      answer: "Yes, we accept reservations for parties of any size. You can make a reservation online through our website or by calling us at (555) 123-4567.",
      category: "Reservations"
    },
    {
      id: "kb-2",
      question: "Do you offer delivery?",
      answer: "Yes, we offer delivery through UberEats, DoorDash, and Grubhub. You can also order directly through our website for pickup.",
      category: "Delivery"
    }
  ]
});
```

---

This configuration reference provides a comprehensive overview of all available options for the AI Customer Service Assistant. For more detailed information on specific features or implementation details, please refer to the code documentation and comments.
