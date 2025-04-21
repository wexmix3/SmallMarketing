# Customization Guide

This guide explains how to customize your AI Customer Service Assistant to match your brand and business needs.

## Table of Contents

- [Appearance Customization](#appearance-customization)
  - [Theme](#theme)
  - [Colors](#colors)
  - [Fonts](#fonts)
  - [Widget Position](#widget-position)
  - [Logo and Avatar](#logo-and-avatar)
- [Behavior Customization](#behavior-customization)
  - [Welcome Message](#welcome-message)
  - [Auto-Open Settings](#auto-open-settings)
  - [Suggested Actions](#suggested-actions)
  - [Business Hours](#business-hours)
- [Knowledge Base Customization](#knowledge-base-customization)
  - [Adding FAQs](#adding-faqs)
  - [Importing FAQs](#importing-faqs)
  - [Organizing Categories](#organizing-categories)
  - [Training the AI](#training-the-ai)
- [Advanced Customization](#advanced-customization)
  - [Custom CSS](#custom-css)
  - [JavaScript Hooks](#javascript-hooks)
  - [Custom Integrations](#custom-integrations)
- [Examples](#examples)

## Appearance Customization

### Theme

The AI Customer Service Assistant offers two built-in themes: Light and Dark. You can select the theme that best matches your website's design.

**Dashboard Method:**
1. Go to "Appearance" → "Theme"
2. Select "Light" or "Dark"
3. Click "Save Changes"

**Code Method:**
```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-theme="light">
</script>
```
Options: `light` or `dark`

### Colors

You can customize the primary color of the assistant to match your brand colors.

**Dashboard Method:**
1. Go to "Appearance" → "Colors"
2. Use the color picker to select your primary color
3. Optionally, set secondary colors for different elements
4. Click "Save Changes"

**Code Method:**
```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-primary-color="#0071e3"
        data-secondary-color="#34c759">
</script>
```

### Fonts

Choose from several font options or specify your own custom font (if it's available via Google Fonts or already loaded on your website).

**Dashboard Method:**
1. Go to "Appearance" → "Typography"
2. Select a font from the dropdown menu
3. Optionally, adjust font sizes for different elements
4. Click "Save Changes"

**Code Method:**
```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-font="SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif">
</script>
```

### Widget Position

You can position the chat widget in any corner of your website.

**Dashboard Method:**
1. Go to "Appearance" → "Widget Position"
2. Select a position (Bottom Right, Bottom Left, Top Right, Top Left)
3. Adjust the margin from the edge if needed
4. Click "Save Changes"

**Code Method:**
```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-position="bottom-right"
        data-margin-x="20"
        data-margin-y="20">
</script>
```
Position options: `bottom-right`, `bottom-left`, `top-right`, `top-left`

### Logo and Avatar

Add your company logo and customize the chat avatar.

**Dashboard Method:**
1. Go to "Appearance" → "Logo & Avatar"
2. Upload your logo (recommended size: 250x80px)
3. Upload an avatar image or select an icon (recommended size: 40x40px)
4. Click "Save Changes"

**Code Method:**
```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-logo-url="https://your-domain.com/logo.png"
        data-avatar-url="https://your-domain.com/avatar.png">
</script>
```

## Behavior Customization

### Welcome Message

Customize the first message users see when they open the chat.

**Dashboard Method:**
1. Go to "Behavior" → "Welcome Message"
2. Enter your welcome message
3. Optionally, add suggested actions for users to click
4. Click "Save Changes"

**Code Method:**
```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-welcome-message="Hello! Welcome to our website. How can I assist you today?">
</script>
```

### Auto-Open Settings

Configure if and when the chat should automatically open.

**Dashboard Method:**
1. Go to "Behavior" → "Auto-Open Settings"
2. Enable or disable auto-open
3. Set the delay in seconds
4. Optionally, set conditions (first visit, returning visitor, specific pages)
5. Click "Save Changes"

**Code Method:**
```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-auto-open="true"
        data-auto-open-delay="5">
</script>
```

### Suggested Actions

Add quick action buttons to guide users.

**Dashboard Method:**
1. Go to "Behavior" → "Suggested Actions"
2. Add suggested actions for different scenarios
3. Arrange them in the desired order
4. Click "Save Changes"

**Code Method:**
This is typically managed through the dashboard, but you can set initial suggested actions:
```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-suggested-actions="What are your business hours?,How do I contact support?,Tell me about your products">
</script>
```

### Business Hours

Set your business hours to provide appropriate responses during and after hours.

**Dashboard Method:**
1. Go to "Behavior" → "Business Hours"
2. Set your business hours for each day of the week
3. Customize the offline message
4. Click "Save Changes"

**Code Method:**
Business hours are typically managed through the dashboard due to their complexity.

## Knowledge Base Customization

### Adding FAQs

Add frequently asked questions and their answers to train your assistant.

**Dashboard Method:**
1. Go to "Knowledge Base" → "FAQs"
2. Click "Add New FAQ"
3. Enter the question and answer
4. Assign a category
5. Click "Save"

### Importing FAQs

Import existing FAQs from a CSV or JSON file.

**Dashboard Method:**
1. Go to "Knowledge Base" → "Import"
2. Select the file format (CSV or JSON)
3. Download the template if needed
4. Upload your file
5. Map the columns if using CSV
6. Click "Import"

### Organizing Categories

Organize your FAQs into categories for better management.

**Dashboard Method:**
1. Go to "Knowledge Base" → "Categories"
2. Click "Add New Category"
3. Enter the category name and description
4. Click "Save"
5. Assign FAQs to categories as needed

### Training the AI

Train the AI to better understand and respond to customer inquiries.

**Dashboard Method:**
1. Go to "Knowledge Base" → "Training"
2. Review conversation logs to identify misunderstood queries
3. Add these queries as alternative phrasings for existing FAQs
4. Click "Train AI" to update the model
5. Monitor performance and retrain as needed

## Advanced Customization

### Custom CSS

Apply custom CSS to further customize the appearance of your assistant.

**Dashboard Method:**
1. Go to "Advanced" → "Custom CSS"
2. Enter your CSS code
3. Click "Save Changes"

**Example:**
```css
.chatbot-widget {
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
  background-color: #5856d6;
}
```

### JavaScript Hooks

Use JavaScript hooks to integrate the assistant with your website's functionality.

**Dashboard Method:**
1. Go to "Advanced" → "JavaScript Hooks"
2. Enter your JavaScript code
3. Click "Save Changes"

**Example:**
```javascript
window.AIAssistant.on('conversation_start', function() {
  // Track conversation start in analytics
  if (typeof gtag === 'function') {
    gtag('event', 'chatbot_conversation_start');
  }
});

window.AIAssistant.on('message_sent', function(message) {
  // Custom logic when user sends a message
  console.log('User sent: ' + message);
});
```

### Custom Integrations

Integrate the assistant with other systems like CRM, help desk, or e-commerce platforms.

**Dashboard Method:**
1. Go to "Advanced" → "Integrations"
2. Select the integration you want to set up
3. Follow the specific instructions for that integration
4. Enter any required API keys or credentials
5. Click "Save Changes"

**Available Integrations:**
- Zendesk
- Salesforce
- HubSpot
- Shopify
- WooCommerce
- Slack
- Microsoft Teams
- Custom Webhook

## Examples

### Example 1: E-commerce Website

```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-primary-color="#4a90e2"
        data-theme="light"
        data-position="bottom-right"
        data-welcome-message="Welcome to our store! How can I help you today?"
        data-suggested-actions="View products,Check order status,Return policy">
</script>
```

### Example 2: Professional Services

```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-primary-color="#34c759"
        data-theme="dark"
        data-position="bottom-left"
        data-welcome-message="Welcome to our firm. How may we assist you today?"
        data-suggested-actions="Book a consultation,Our services,Contact information">
</script>
```

### Example 3: Restaurant

```html
<script src="https://cdn.aiassistant.com/embed.js" 
        data-assistant-id="your-assistant-id" 
        data-primary-color="#ff9500"
        data-theme="light"
        data-position="bottom-right"
        data-welcome-message="Welcome to our restaurant! How can I assist you today?"
        data-suggested-actions="View menu,Make a reservation,Opening hours,Delivery options">
</script>
```

For more examples and advanced customization options, please refer to our [API Reference](API_REFERENCE.md).
