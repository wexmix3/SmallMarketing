# Installation Guide

This guide provides detailed instructions for installing and setting up the AI Customer Service Assistant on your website.

## Table of Contents

- [System Requirements](#system-requirements)
- [Installation Methods](#installation-methods)
  - [Method 1: Direct Embed](#method-1-direct-embed)
  - [Method 2: WordPress Plugin](#method-2-wordpress-plugin)
  - [Method 3: Shopify App](#method-3-shopify-app)
- [Setting Up Your Account](#setting-up-your-account)
- [Initial Configuration](#initial-configuration)
- [Troubleshooting](#troubleshooting)

## System Requirements

The AI Customer Service Assistant is a cloud-based solution that runs on our servers. Your website only needs to meet these minimal requirements:

- HTTPS-enabled website (required for security)
- Modern web browser support (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Ability to add custom code to your website

## Installation Methods

### Method 1: Direct Embed

The simplest way to add the AI Customer Service Assistant to your website is by using our embed code.

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

   Add this code to your website just before the closing `</body>` tag. The exact method depends on your website platform:

   - **HTML Website**: Edit your HTML files and paste the code before the `</body>` tag.
   - **WordPress (without plugin)**: Go to Appearance → Theme Editor → Theme Footer (footer.php) and paste the code before the `</body>` tag.
   - **Wix**: Go to Settings → Advanced → Custom Code → Footer and paste the code.
   - **Squarespace**: Go to Settings → Advanced → Code Injection → Footer and paste the code.
   - **Webflow**: Go to Project Settings → Custom Code → Footer Code and paste the code.

3. **Verify Installation**

   Visit your website and check if the chatbot button appears in the position you specified. Click it to open the chat window and test if it's working correctly.

### Method 2: WordPress Plugin

For WordPress websites, we offer a dedicated plugin for easier installation.

1. **Download the Plugin**

   Download the plugin ZIP file from your dashboard at [https://dashboard.aiassistant.com](https://dashboard.aiassistant.com) under "Integration" → "WordPress Plugin".

2. **Install the Plugin**

   - Log in to your WordPress admin dashboard
   - Go to Plugins → Add New → Upload Plugin
   - Choose the ZIP file you downloaded and click "Install Now"
   - After installation, click "Activate Plugin"

3. **Configure the Plugin**

   - Go to the new "AI Assistant" menu item in your WordPress admin
   - Enter your API key (found in your dashboard under "Settings" → "API Keys")
   - Configure the appearance and behavior settings
   - Click "Save Changes"

4. **Verify Installation**

   Visit your website and check if the chatbot button appears. Test it to ensure it's working correctly.

### Method 3: Shopify App

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

3. **Verify Installation**

   Visit your store and check if the chatbot button appears. Test it to ensure it's working correctly.

## Setting Up Your Account

Before installing the AI Customer Service Assistant, you need to set up your account:

1. **Sign Up**

   Visit [https://aiassistant.com](https://aiassistant.com) and click "Sign Up". Enter your email address and create a password.

2. **Choose a Plan**

   Select the plan that best fits your needs (Basic, Standard, or Premium).

3. **Enter Business Information**

   Provide your business name, industry, and website URL. This information helps us customize your assistant.

4. **Payment Information**

   Enter your payment details to activate your subscription.

5. **Verify Email**

   Check your email for a verification link and click it to verify your account.

## Initial Configuration

After setting up your account and installing the assistant, you should configure it to match your business needs:

1. **Customize Appearance**

   - Log in to your dashboard
   - Go to "Appearance" settings
   - Set your primary color, font, and theme
   - Customize the chatbot button position and style
   - Upload your logo (if applicable)

2. **Set Up Knowledge Base**

   - Go to "Knowledge Base" in your dashboard
   - Add FAQs about your business, products, and services
   - Import existing FAQs if you have them in CSV or JSON format
   - Organize FAQs into categories for better management

3. **Configure Behavior**

   - Go to "Behavior" settings
   - Set the welcome message that appears when a user opens the chat
   - Configure auto-open settings (if you want the chat to open automatically)
   - Set up business hours and offline message

4. **Test Your Assistant**

   - Use the "Test" feature in your dashboard to simulate conversations
   - Check if your assistant correctly answers questions from your knowledge base
   - Make adjustments as needed

## Troubleshooting

If you encounter issues during installation or setup, try these troubleshooting steps:

### Chatbot Not Appearing

1. **Check JavaScript Console**
   - Open your browser's developer tools (F12 or right-click → Inspect)
   - Go to the Console tab and look for any error messages related to the assistant

2. **Verify Embed Code**
   - Make sure the embed code is correctly placed before the `</body>` tag
   - Check that your assistant ID is correct
   - Ensure there are no syntax errors in the code

3. **Check for Conflicts**
   - Some website themes or plugins might conflict with the assistant
   - Try temporarily disabling other scripts or plugins to identify conflicts

### Assistant Not Responding Correctly

1. **Review Knowledge Base**
   - Check if your FAQs are properly formatted
   - Make sure you've provided enough information for common questions
   - Add more variations of questions to improve matching

2. **Check API Connection**
   - Verify that your API key is correct
   - Ensure your website can connect to our servers
   - Check if your subscription is active

### Still Having Issues?

Contact our support team for assistance:

- Email: support@aiassistant.com
- Phone: (555) 123-4567
- Support Hours: Monday-Friday, 9am-5pm EST

You can also check our [Troubleshooting Guide](https://help.aiassistant.com/troubleshooting) for more detailed solutions to common issues.
