# Deployment Guide

This guide provides instructions for deploying the AI Customer Service Assistant to your website or application.

## Table of Contents

- [Deployment Options](#deployment-options)
- [Website Integration](#website-integration)
  - [Standard Embed](#standard-embed)
  - [WordPress Plugin](#wordpress-plugin)
  - [Shopify App](#shopify-app)
  - [Other CMS Platforms](#other-cms-platforms)
- [Mobile App Integration](#mobile-app-integration)
  - [iOS Integration](#ios-integration)
  - [Android Integration](#android-integration)
  - [React Native Integration](#react-native-integration)
- [Custom Backend Integration](#custom-backend-integration)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)
- [Testing Your Deployment](#testing-your-deployment)
- [Troubleshooting](#troubleshooting)

## Deployment Options

The AI Customer Service Assistant can be deployed in several ways:

1. **Website Widget**: A chat widget that appears on your website
2. **Full-Page Chat**: A dedicated chat page on your website
3. **Mobile SDK**: Integration with your mobile apps
4. **API Integration**: Custom integration with your backend systems

Choose the deployment option that best fits your needs and technical capabilities.

## Website Integration

### Standard Embed

The simplest way to deploy the assistant is by adding the embed code to your website.

1. **Get Your Embed Code**

   Log in to your dashboard at [https://dashboard.aiassistant.com](https://dashboard.aiassistant.com) and navigate to "Integration" → "Embed Code". You'll see a code snippet similar to this:

   ```html
   <script src="https://cdn.aiassistant.com/embed.js" 
           data-assistant-id="your-assistant-id" 
           data-position="bottom-right" 
           data-primary-color="#0071e3">
   </script>
   ```

2. **Add to Your Website**

   Add this code to your website just before the closing `</body>` tag. This ensures that the assistant loads after the rest of your page content.

3. **Test the Integration**

   Visit your website and check if the chatbot button appears in the position you specified. Click it to open the chat window and test if it's working correctly.

### WordPress Plugin

For WordPress websites, we offer a dedicated plugin for easier integration.

1. **Install the Plugin**

   - Download the plugin ZIP file from your dashboard
   - Log in to your WordPress admin dashboard
   - Go to Plugins → Add New → Upload Plugin
   - Choose the ZIP file you downloaded and click "Install Now"
   - After installation, click "Activate Plugin"

2. **Configure the Plugin**

   - Go to the new "AI Assistant" menu item in your WordPress admin
   - Enter your API key (found in your dashboard under "Settings" → "API Keys")
   - Configure the appearance and behavior settings
   - Click "Save Changes"

3. **Advanced WordPress Integration**

   If you want more control over where the assistant appears, you can use the shortcode:

   ```
   [ai_assistant theme="dark" position="bottom-left"]
   ```

   Or add it programmatically in your theme:

   ```php
   <?php if (function_exists('ai_assistant_embed')) { 
     ai_assistant_embed(array(
       'theme' => 'dark',
       'position' => 'bottom-left'
     )); 
   } ?>
   ```

### Shopify App

For Shopify stores, we offer a dedicated app for seamless integration.

1. **Install from Shopify App Store**

   - Go to the [Shopify App Store](https://apps.shopify.com)
   - Search for "AI Customer Service Assistant"
   - Click "Add app" and follow the installation process

2. **Configure the App**

   - After installation, you'll be redirected to the app settings
   - Enter your API key (found in your dashboard under "Settings" → "API Keys")
   - Configure the appearance and behavior settings
   - Click "Save"

3. **Theme Integration**

   The app automatically adds the assistant to your store. If you want to customize where it appears, you can use the Shopify theme editor:

   - Go to Online Store → Themes → Customize
   - Click "Add section" → "AI Assistant"
   - Configure the settings and save your changes

### Other CMS Platforms

#### Wix

1. Go to your Wix dashboard
2. Click on "Settings" → "Advanced" → "Custom Code"
3. Click "Add Custom Code"
4. Give it a name (e.g., "AI Assistant")
5. Paste your embed code
6. Set "Place Code In" to "Body - end"
7. Click "Apply"

#### Squarespace

1. Go to your Squarespace dashboard
2. Click on "Settings" → "Advanced" → "Code Injection"
3. Paste your embed code in the "Footer" section
4. Click "Save"

#### Webflow

1. Go to your Webflow project
2. Click on "Project Settings" → "Custom Code"
3. Paste your embed code in the "Footer Code" section
4. Click "Save Changes"

## Mobile App Integration

### iOS Integration

To integrate the assistant with your iOS app:

1. **Install the SDK**

   Add the dependency to your `Podfile`:

   ```ruby
   pod 'AIAssistantSDK', '~> 1.0'
   ```

   Then run:

   ```bash
   pod install
   ```

2. **Initialize the SDK**

   In your `AppDelegate.swift`:

   ```swift
   import AIAssistantSDK

   func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
       // Initialize AI Assistant
       AIAssistant.shared.initialize(assistantId: "your-assistant-id")
       return true
   }
   ```

3. **Show the Chat Interface**

   ```swift
   import AIAssistantSDK

   class YourViewController: UIViewController {
       @IBAction func showChat(_ sender: Any) {
           AIAssistant.shared.presentChat(from: self)
       }
   }
   ```

4. **Customize Appearance**

   ```swift
   let config = AIAssistantConfig()
   config.primaryColor = UIColor(hex: "#0071e3")
   config.theme = .dark
   config.welcomeMessage = "Hello! How can I help you today?"
   
   AIAssistant.shared.initialize(assistantId: "your-assistant-id", config: config)
   ```

### Android Integration

To integrate the assistant with your Android app:

1. **Add the Dependency**

   In your app's `build.gradle`:

   ```gradle
   dependencies {
       implementation 'com.aiassistant:sdk:1.0.0'
   }
   ```

2. **Initialize the SDK**

   In your `Application` class:

   ```java
   import com.aiassistant.sdk.AIAssistant;

   public class YourApplication extends Application {
       @Override
       public void onCreate() {
           super.onCreate();
           AIAssistant.initialize(this, "your-assistant-id");
       }
   }
   ```

3. **Show the Chat Interface**

   ```java
   import com.aiassistant.sdk.AIAssistant;

   public class YourActivity extends AppCompatActivity {
       public void showChat(View view) {
           AIAssistant.showChat(this);
       }
   }
   ```

4. **Customize Appearance**

   ```java
   AIAssistantConfig config = new AIAssistantConfig();
   config.setPrimaryColor("#0071e3");
   config.setTheme(AIAssistantTheme.DARK);
   config.setWelcomeMessage("Hello! How can I help you today?");
   
   AIAssistant.initialize(this, "your-assistant-id", config);
   ```

### React Native Integration

To integrate the assistant with your React Native app:

1. **Install the Package**

   ```bash
   npm install react-native-ai-assistant
   # or
   yarn add react-native-ai-assistant
   ```

2. **Link the Native Modules**

   ```bash
   npx react-native link react-native-ai-assistant
   ```

3. **Initialize the SDK**

   ```javascript
   import AIAssistant from 'react-native-ai-assistant';

   // In your app's entry point
   AIAssistant.initialize('your-assistant-id');
   ```

4. **Show the Chat Interface**

   ```javascript
   import AIAssistant from 'react-native-ai-assistant';
   import { Button } from 'react-native';

   function YourComponent() {
     const showChat = () => {
       AIAssistant.showChat();
     };

     return (
       <Button title="Chat with us" onPress={showChat} />
     );
   }
   ```

5. **Customize Appearance**

   ```javascript
   AIAssistant.initialize('your-assistant-id', {
     primaryColor: '#0071e3',
     theme: 'dark',
     welcomeMessage: 'Hello! How can I help you today?'
   });
   ```

## Custom Backend Integration

For advanced use cases, you can integrate the assistant with your own backend systems using our REST API.

1. **Authentication**

   Generate an API key in your dashboard under "Settings" → "API Keys".

2. **Create a Conversation**

   ```javascript
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
       }
     })
   })
   .then(response => response.json())
   .then(conversation => {
     console.log('Conversation created:', conversation);
   });
   ```

3. **Send a Message**

   ```javascript
   fetch(`https://api.aiassistant.com/v1/conversations/${conversationId}/messages`, {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer YOUR_API_KEY',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       content: 'What are your business hours?',
       role: 'user'
     })
   })
   .then(response => response.json())
   .then(message => {
     console.log('Message sent:', message);
   });
   ```

4. **Retrieve Messages**

   ```javascript
   fetch(`https://api.aiassistant.com/v1/conversations/${conversationId}`, {
     headers: {
       'Authorization': 'Bearer YOUR_API_KEY'
     }
   })
   .then(response => response.json())
   .then(conversation => {
     console.log('Messages:', conversation.messages);
   });
   ```

For more details on the API, refer to the [API Reference](API_REFERENCE.md).

## Security Considerations

When deploying the AI Customer Service Assistant, keep these security considerations in mind:

1. **API Key Protection**

   Never expose your API key in client-side code. If you need to make API calls from the frontend, create a backend proxy that securely stores and uses your API key.

2. **Data Privacy**

   Be mindful of the data you collect through the assistant. Ensure you have appropriate privacy policies in place and comply with regulations like GDPR and CCPA.

3. **Content Security Policy (CSP)**

   If your website uses a strict Content Security Policy, you'll need to add our domains to your allowed sources:

   ```
   script-src 'self' https://cdn.aiassistant.com;
   connect-src 'self' https://api.aiassistant.com;
   frame-src 'self' https://app.aiassistant.com;
   ```

4. **HTTPS**

   Ensure your website uses HTTPS to protect the communication between your users and the assistant.

5. **User Authentication**

   If you're integrating the assistant with authenticated sections of your website or app, use the user identification features to securely pass user information.

## Performance Optimization

To ensure the assistant loads quickly and doesn't impact your website's performance:

1. **Lazy Loading**

   The embed script is designed to load lazily, meaning it won't block your page's rendering. However, you can further optimize by adding the `defer` attribute:

   ```html
   <script defer src="https://cdn.aiassistant.com/embed.js" 
           data-assistant-id="your-assistant-id">
   </script>
   ```

2. **Preconnect Hint**

   Add a preconnect hint to establish an early connection to our servers:

   ```html
   <link rel="preconnect" href="https://cdn.aiassistant.com">
   <link rel="preconnect" href="https://api.aiassistant.com">
   ```

3. **Conditional Loading**

   Load the assistant only when needed:

   ```html
   <script>
     // Only load the assistant on certain pages
     if (window.location.pathname !== '/checkout') {
       const script = document.createElement('script');
       script.src = 'https://cdn.aiassistant.com/embed.js';
       script.dataset.assistantId = 'your-assistant-id';
       document.body.appendChild(script);
     }
   </script>
   ```

4. **Optimize Knowledge Base**

   Keep your knowledge base concise and well-organized. Too many FAQs can slow down the assistant's response time.

## Testing Your Deployment

After deploying the assistant, thoroughly test it to ensure it's working correctly:

1. **Functional Testing**

   - Test opening and closing the chat widget
   - Send test messages and verify responses
   - Test all configured features (file uploads, human handoff, etc.)

2. **Cross-Browser Testing**

   Test the assistant in different browsers:
   - Chrome
   - Firefox
   - Safari
   - Edge

3. **Mobile Testing**

   Test on various mobile devices and screen sizes:
   - iPhone (iOS)
   - Android phones
   - Tablets

4. **Performance Testing**

   - Check if the assistant loads quickly
   - Verify it doesn't slow down your website
   - Test with slow network connections

5. **Integration Testing**

   If you've integrated the assistant with other systems (CRM, help desk, etc.), test these integrations.

## Troubleshooting

If you encounter issues with your deployment, try these troubleshooting steps:

### Assistant Not Appearing

1. **Check Console for Errors**

   Open your browser's developer tools (F12) and check the console for error messages.

2. **Verify Your Assistant ID**

   Make sure you're using the correct assistant ID in your embed code.

3. **Check for Script Blockers**

   Ad blockers or content blockers might prevent the assistant from loading. Try disabling them temporarily.

4. **Verify Script Loading**

   Check if the embed script is actually loading by looking at the Network tab in developer tools.

### Assistant Not Responding

1. **Check API Connectivity**

   Ensure your website can connect to our API servers. Look for network errors in the developer tools.

2. **Verify API Key**

   Make sure your API key is valid and has the necessary permissions.

3. **Check Knowledge Base**

   Ensure your knowledge base is properly configured and contains relevant information.

### Styling Issues

1. **CSS Conflicts**

   Your website's CSS might conflict with the assistant's styles. Try adding more specific selectors to your CSS.

2. **Z-Index Problems**

   If the assistant is appearing behind other elements, adjust the z-index in your custom CSS:

   ```css
   .ai-assistant-widget {
     z-index: 9999 !important;
   }
   ```

### Still Having Issues?

Contact our support team for assistance:

- Email: support@aiassistant.com
- Phone: (555) 123-4567
- Support Hours: Monday-Friday, 9am-5pm EST

You can also check our [Troubleshooting Guide](https://help.aiassistant.com/troubleshooting) for more detailed solutions to common issues.
