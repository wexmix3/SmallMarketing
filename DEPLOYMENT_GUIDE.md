# AI Customer Service Assistant - Deployment Guide

This guide provides detailed instructions for deploying the AI Customer Service Assistant to various platforms and environments.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Deployment](#local-development-deployment)
4. [Web Server Deployment](#web-server-deployment)
5. [Vercel Deployment](#vercel-deployment)
6. [Netlify Deployment](#netlify-deployment)
7. [GitHub Pages Deployment](#github-pages-deployment)
8. [WordPress Integration](#wordpress-integration)
9. [Shopify Integration](#shopify-integration)
10. [Custom Domain Configuration](#custom-domain-configuration)
11. [SSL Configuration](#ssl-configuration)
12. [Environment Variables](#environment-variables)
13. [Performance Optimization](#performance-optimization)
14. [Troubleshooting](#troubleshooting)

## Deployment Overview

The AI Customer Service Assistant can be deployed in several ways:

1. **Static Website Deployment**: Deploy the HTML, CSS, and JavaScript files to a web server or static hosting service.
2. **CMS Integration**: Integrate the assistant into content management systems like WordPress or Shopify.
3. **Custom Integration**: Embed the assistant into an existing web application.

Choose the deployment method that best fits your technical expertise and requirements.

## Prerequisites

Before deploying the AI Customer Service Assistant, ensure you have:

1. **Complete Project Files**:
   - HTML files (dashboard.html, chatbot-demo-enhanced.html, etc.)
   - CSS files (styles.css, dashboard.css, chatbot-base.css, etc.)
   - JavaScript files (chatbot.js, chatbot-widget.js, etc.)
   - Image assets in the public/images directory

2. **Development Tools**:
   - Git (for version control)
   - Node.js and npm (for build tools, if using)
   - A text editor or IDE
   - A web browser for testing

3. **Accounts** (depending on deployment method):
   - GitHub account (for GitHub Pages)
   - Vercel, Netlify, or similar hosting account
   - Web hosting account with FTP access
   - WordPress or Shopify account

## Local Development Deployment

To run the AI Customer Service Assistant locally for development:

1. **Clone or download the project**:
   ```bash
   git clone https://github.com/yourusername/ai-customer-service-assistant.git
   cd ai-customer-service-assistant
   ```

2. **Open the project in your code editor**.

3. **Launch a local server**:

   Using Node.js and the `http-server` package:
   ```bash
   npm install -g http-server
   http-server
   ```

   Using Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:8000` (or the port specified by your server).

5. **Test the application**:
   - Test the dashboard at `http://localhost:8000/dashboard.html`
   - Test the chatbot at `http://localhost:8000/chatbot-demo-enhanced.html`
   - Test the landing page at `http://localhost:8000/landing-page.html`

## Web Server Deployment

To deploy to a traditional web server:

1. **Prepare your files**:
   - Ensure all file paths are relative and correct
   - Optimize images and minify CSS/JS for production (optional)

2. **Upload files via FTP**:
   - Connect to your web server using an FTP client (FileZilla, Cyberduck, etc.)
   - Upload all project files to your web server's public directory (often called `public_html`, `www`, or `htdocs`)
   - Maintain the same directory structure as your local project

3. **Configure the server** (if needed):
   - Ensure the server is configured to serve HTML files
   - Set the correct MIME types for CSS and JavaScript files
   - Configure caching for static assets

4. **Test the deployment**:
   - Visit your website URL to ensure everything is working correctly
   - Test on different browsers and devices

## Vercel Deployment

Vercel is an excellent platform for deploying static websites with zero configuration:

1. **Create a Vercel account** at [vercel.com](https://vercel.com).

2. **Install the Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy your project**:
   ```bash
   # Navigate to your project directory
   cd ai-customer-service-assistant
   
   # Deploy
   vercel
   ```

5. **Configure project settings** in the Vercel dashboard:
   - Set environment variables if needed
   - Configure custom domains
   - Set up build settings if you're using a build process

6. **For production deployment**:
   ```bash
   vercel --prod
   ```

## Netlify Deployment

Netlify is another great platform for static site hosting:

1. **Create a Netlify account** at [netlify.com](https://netlify.com).

2. **Deploy using the Netlify UI**:
   - Go to the Netlify dashboard
   - Drag and drop your project folder onto the Netlify dashboard
   - Wait for the upload and deployment to complete

3. **Deploy using the Netlify CLI**:
   ```bash
   # Install the Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Deploy
   netlify deploy
   ```

4. **For production deployment**:
   ```bash
   netlify deploy --prod
   ```

5. **Configure project settings** in the Netlify dashboard:
   - Set environment variables if needed
   - Configure custom domains
   - Set up build settings if you're using a build process

## GitHub Pages Deployment

GitHub Pages is a free hosting service provided by GitHub:

1. **Create a GitHub repository** for your project.

2. **Push your code to GitHub**:
   ```bash
   # Initialize Git repository (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Initial commit"
   
   # Add GitHub repository as remote
   git remote add origin https://github.com/yourusername/ai-customer-service-assistant.git
   
   # Push to GitHub
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to the "GitHub Pages" section
   - Select the branch you want to deploy (usually `main` or `master`)
   - Click "Save"

4. **Access your deployed site**:
   - Your site will be available at `https://yourusername.github.io/ai-customer-service-assistant/`
   - It may take a few minutes for the site to be published

## WordPress Integration

To integrate the AI Customer Service Assistant into a WordPress site:

1. **Upload files to your WordPress server**:
   - Upload the CSS, JS, and image files to your WordPress theme directory or a custom directory
   - You can use the WordPress media library for images

2. **Add CSS and JavaScript**:
   Edit your theme's `functions.php` file to enqueue the necessary scripts and styles:

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

3. **Add the chatbot widget to your site**:
   Edit your theme's `footer.php` file to add the initialization code:

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
               theme: 'light',
               font: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
           });
       }
   });
   </script>
   ```

4. **Create a full-page chatbot** (optional):
   - Create a new page template in your theme
   - Add the HTML structure from `chatbot-fullpage.html`
   - Use WordPress template tags for header and footer

## Shopify Integration

To integrate the AI Customer Service Assistant into a Shopify store:

1. **Upload assets to Shopify**:
   - Go to your Shopify admin dashboard
   - Navigate to "Online Store" > "Themes"
   - Click "Actions" > "Edit code" on your current theme

2. **Add CSS files**:
   - In the theme editor, click "Add a new asset"
   - Upload each CSS file (chatbot-base.css, chatbot-messages.css, etc.)

3. **Add JavaScript files**:
   - Upload each JavaScript file (chatbot.js, chatbot-widget.js, etc.)

4. **Modify theme.liquid**:
   Add the following code just before the closing `</body>` tag:

   ```liquid
   {{ 'chatbot-base.css' | asset_url | stylesheet_tag }}
   {{ 'chatbot-messages.css' | asset_url | stylesheet_tag }}
   {{ 'chatbot-settings.css' | asset_url | stylesheet_tag }}
   {{ 'chatbot-widget.css' | asset_url | stylesheet_tag }}
   
   {{ 'chatbot.js' | asset_url | script_tag }}
   {{ 'chatbot-widget.js' | asset_url | script_tag }}
   
   <script>
   document.addEventListener('DOMContentLoaded', function() {
       // Initialize chatbot widget
       if (typeof initChatbotWidget === 'function') {
           initChatbotWidget({
               position: 'bottom-right',
               primaryColor: '{{ settings.color_primary }}',
               chatbotName: '{{ shop.name }} Assistant',
               welcomeMessage: 'Hello! Welcome to {{ shop.name }}. How can I assist you today?',
               autoOpen: false,
               autoOpenDelay: 5000,
               showAvatar: true,
               theme: 'light'
           });
       }
   });
   </script>
   ```

5. **Create a dedicated page** (optional):
   - Create a new page in Shopify
   - Create a new template in your theme for this page
   - Add the HTML structure from `chatbot-fullpage.html`

## Custom Domain Configuration

To configure a custom domain for your deployed AI Customer Service Assistant:

### For Vercel:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" > "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings

### For Netlify:

1. Go to your site in the Netlify dashboard
2. Click on "Settings" > "Domain management"
3. Click "Add custom domain"
4. Follow the instructions to configure DNS settings

### For GitHub Pages:

1. Go to your repository on GitHub
2. Click on "Settings" > "Pages"
3. Under "Custom domain", enter your domain name
4. Update your DNS settings as instructed

### DNS Configuration:

1. **A Record**:
   - Create an A record pointing to your hosting provider's IP address
   - For GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

2. **CNAME Record**:
   - Create a CNAME record for `www` pointing to your deployment URL
   - For GitHub Pages: `yourusername.github.io`
   - For Vercel: `yoursitename.vercel.app`
   - For Netlify: `yoursitename.netlify.app`

3. **Wait for DNS propagation**:
   - DNS changes can take up to 48 hours to propagate
   - Use a tool like [whatsmydns.net](https://www.whatsmydns.net/) to check propagation status

## SSL Configuration

Secure your deployment with SSL (HTTPS):

### For Vercel, Netlify, and GitHub Pages:

SSL is automatically configured for you. No additional steps are required.

### For custom web servers:

1. **Obtain an SSL certificate**:
   - Use [Let's Encrypt](https://letsencrypt.org/) for a free certificate
   - Use [Certbot](https://certbot.eff.org/) to automate certificate installation

2. **Install the certificate on your server**:
   - Follow your hosting provider's instructions for installing SSL certificates
   - Configure your web server to redirect HTTP to HTTPS

3. **Update internal links**:
   - Ensure all internal links use HTTPS instead of HTTP
   - Update any hardcoded URLs in your code

## Environment Variables

For deployments that require environment variables (API keys, configuration settings, etc.):

### For Vercel:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" > "Environment Variables"
3. Add your environment variables
4. Redeploy your application

### For Netlify:

1. Go to your site in the Netlify dashboard
2. Click on "Settings" > "Build & deploy" > "Environment"
3. Add your environment variables
4. Redeploy your application

### For local development:

Create a `.env` file in your project root:

```
API_KEY=your_api_key_here
API_URL=https://api.example.com
```

**Important**: Never commit `.env` files to your repository. Add `.env` to your `.gitignore` file.

## Performance Optimization

Optimize your deployment for better performance:

1. **Minify CSS and JavaScript**:
   - Use tools like [Terser](https://terser.org/) for JavaScript
   - Use [cssnano](https://cssnano.co/) for CSS

2. **Optimize images**:
   - Compress images using tools like [TinyPNG](https://tinypng.com/)
   - Use appropriate image formats (WebP for modern browsers)
   - Implement lazy loading for images

3. **Implement caching**:
   - Set appropriate cache headers for static assets
   - Use a CDN for global distribution

4. **Code splitting**:
   - Load only the necessary JavaScript for each page
   - Use dynamic imports for large modules

5. **Preload critical assets**:
   ```html
   <link rel="preload" href="chatbot-widget.js" as="script">
   <link rel="preload" href="chatbot-base.css" as="style">
   ```

## Troubleshooting

Common deployment issues and their solutions:

### 1. Files not loading

**Symptoms**: CSS, JavaScript, or images not loading, 404 errors in the console.

**Solutions**:
- Check file paths and ensure they're correct
- Verify that all files were uploaded to the server
- Check for case sensitivity issues in file paths
- Ensure the server is configured to serve the correct MIME types

### 2. JavaScript errors

**Symptoms**: Chatbot not initializing, console errors.

**Solutions**:
- Check the browser console for specific error messages
- Verify that all required JavaScript files are loaded in the correct order
- Check for syntax errors in your initialization code
- Ensure all dependencies are loaded

### 3. Styling issues

**Symptoms**: Chatbot appears unstyled or with layout problems.

**Solutions**:
- Verify that all CSS files are loaded
- Check for CSS conflicts with your existing website styles
- Use browser developer tools to inspect the elements and identify styling issues
- Add more specific CSS selectors to override conflicting styles

### 4. Cross-Origin Resource Sharing (CORS) issues

**Symptoms**: API requests failing, CORS errors in the console.

**Solutions**:
- Ensure your API server allows requests from your domain
- Add appropriate CORS headers to your API responses
- Use a proxy server for API requests if needed

### 5. SSL/HTTPS issues

**Symptoms**: Mixed content warnings, features not working on HTTPS.

**Solutions**:
- Ensure all resources (scripts, styles, images, APIs) use HTTPS URLs
- Redirect HTTP to HTTPS on your server
- Update hardcoded HTTP URLs in your code

### Getting Help

If you encounter issues not covered in this guide:

1. Check the browser console for error messages
2. Review the documentation for your hosting platform
3. Search for similar issues in our support forum
4. Contact our support team at support@aiassistant.com

---

## Conclusion

This deployment guide covers the most common scenarios for deploying the AI Customer Service Assistant. For specific requirements or custom deployments, please contact our support team for assistance.

Remember to test your deployment thoroughly on different browsers and devices to ensure a consistent experience for all users.

For updates and additional documentation, visit our [documentation portal](https://docs.aiassistant.com).
