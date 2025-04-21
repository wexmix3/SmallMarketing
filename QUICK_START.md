# AI Customer Service Assistant - Quick Start Guide

This quick start guide will help you deploy the AI Customer Service Assistant to your website in just a few minutes.

## Prerequisites

- A website where you can add custom HTML/JavaScript
- Basic knowledge of HTML
- Your AI Customer Service Assistant files

## Option 1: Direct Embed (Simplest)

1. **Download the package**:
   Download the latest release from our [releases page](https://github.com/yourusername/ai-customer-service-assistant/releases).

2. **Upload the files to your web server**:
   Upload the entire package to your web server, maintaining the directory structure.

3. **Add the embed code to your website**:
   Add the following code to your website, just before the closing `</body>` tag:

   ```html
   <script src="https://your-domain.com/path/to/chatbot-widget.js" 
           data-assistant-id="your-assistant-id" 
           data-position="bottom-right" 
           data-primary-color="#0071e3">
   </script>
   ```

   Replace `https://your-domain.com/path/to/chatbot-widget.js` with the actual path to the chatbot-widget.js file on your server.

4. **Test the chatbot**:
   Visit your website and check if the chatbot button appears in the bottom-right corner. Click it to open the chat window and test if it's working correctly.

## Option 2: Deploy to Vercel (Recommended for Developers)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy your project**:
   ```bash
   # Navigate to your project directory
   cd ai-customer-service-assistant
   
   # Deploy
   vercel
   ```

4. **Add the embed code to your website**:
   ```html
   <script src="https://your-vercel-deployment-url.vercel.app/chatbot-widget.js" 
           data-assistant-id="your-assistant-id" 
           data-position="bottom-right" 
           data-primary-color="#0071e3">
   </script>
   ```

## Option 3: WordPress Integration

1. **Upload files to your WordPress server**:
   Upload the CSS, JS, and image files to your WordPress theme directory or a custom directory.

2. **Add the following code to your theme's functions.php file**:
   ```php
   function enqueue_chatbot_assets() {
       // Enqueue CSS files
       wp_enqueue_style('chatbot-base', get_template_directory_uri() . '/path/to/chatbot-base.css');
       wp_enqueue_style('chatbot-messages', get_template_directory_uri() . '/path/to/chatbot-messages.css');
       wp_enqueue_style('chatbot-settings', get_template_directory_uri() . '/path/to/chatbot-settings.css');
       wp_enqueue_style('chatbot-widget', get_template_directory_uri() . '/path/to/chatbot-widget.css');
       
       // Enqueue JavaScript files
       wp_enqueue_script('chatbot', get_template_directory_uri() . '/path/to/chatbot.js', array(), '1.0.0', true);
       wp_enqueue_script('chatbot-widget', get_template_directory_uri() . '/path/to/chatbot-widget.js', array('chatbot'), '1.0.0', true);
   }
   add_action('wp_enqueue_scripts', 'enqueue_chatbot_assets');
   ```

3. **Add the initialization code to your theme's footer.php file**:
   ```php
   <script>
   document.addEventListener('DOMContentLoaded', function() {
       // Initialize chatbot widget
       if (typeof initChatbotWidget === 'function') {
           initChatbotWidget({
               position: 'bottom-right',
               primaryColor: '#0071e3',
               chatbotName: 'AI Customer Service Assistant',
               welcomeMessage: 'Hello! Welcome to our website. How can I assist you today?',
               autoOpen: false,
               autoOpenDelay: 5000,
               showAvatar: true,
               theme: 'light'
           });
       }
   });
   </script>
   ```

## Customization Options

You can customize the chatbot by adding data attributes to the script tag or by passing options to the `initChatbotWidget` function:

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

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | String | `"bottom-right"` | Widget position: `"bottom-right"`, `"bottom-left"`, `"top-right"`, `"top-left"` |
| `primaryColor` | String | `"#0071e3"` | Primary color in hex format |
| `theme` | String | `"light"` | Theme: `"light"` or `"dark"` |
| `chatbotName` | String | `"AI Customer Service Assistant"` | Name displayed in the chat header |
| `welcomeMessage` | String | `"Hello! How can I assist you today?"` | Welcome message |
| `autoOpen` | Boolean | `false` | Whether to auto-open the widget |
| `autoOpenDelay` | Number | `5000` | Delay in milliseconds before auto-opening |
| `showAvatar` | Boolean | `true` | Whether to show the avatar in messages |

## Next Steps

For more detailed information, please refer to the following documentation:

- [Full Deployment Guide](DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Customization Guide](CUSTOMIZATION.md) - How to customize your assistant
- [API Reference](API_REFERENCE.md) - API documentation for developers

## Support

If you need help with setup or have any questions, please contact our support team:

- Email: support@aiassistant.com
- Phone: (555) 123-4567
- Support Hours: Monday-Friday, 9am-5pm EST
