/**
 * AI Customer Service Assistant - Shopify App
 * This file contains the server-side code for the Shopify app
 */

const express = require('express');
const { Shopify, ApiVersion } = require('@shopify/shopify-api');
const { join } = require('path');
const { readFileSync } = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Setup Shopify API
const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } = process.env;

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET,
  SCOPES: SCOPES.split(','),
  HOST_NAME: HOST.replace(/https?:\/\//, ''),
  API_VERSION: ApiVersion.October22,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Middleware
app.use(express.json());

// Auth callback
app.get('/auth/callback', async (req, res) => {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query
    );
    
    // Redirect to app
    res.redirect(`/?shop=${session.shop}&host=${req.query.host}`);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).send('Error during auth');
  }
});

// App routes
app.get('/', async (req, res) => {
  const { shop, host } = req.query;
  
  if (!shop) {
    return res.status(400).send('Missing shop parameter');
  }
  
  // Check if shop is authenticated
  const session = await Shopify.Utils.loadCurrentSession(req, res);
  
  if (!session) {
    // Redirect to auth
    return res.redirect(`/auth?shop=${shop}`);
  }
  
  // Render app
  res.send(getAppHTML(shop, host));
});

// API routes
app.get('/api/settings', async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get settings from Shopify metafields
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    
    const response = await client.get({
      path: 'metafields',
      query: {
        namespace: 'ai_assistant'
      }
    });
    
    // Format settings
    const settings = {};
    
    response.body.metafields.forEach(metafield => {
      settings[metafield.key] = metafield.value;
    });
    
    res.json(settings);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { assistantId, position, primaryColor } = req.body;
    
    // Validate required fields
    if (!assistantId) {
      return res.status(400).json({ error: 'Assistant ID is required' });
    }
    
    // Save settings to Shopify metafields
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    
    // Save assistant ID
    await client.post({
      path: 'metafields',
      data: {
        metafield: {
          namespace: 'ai_assistant',
          key: 'assistant_id',
          value: assistantId,
          type: 'single_line_text_field'
        }
      }
    });
    
    // Save position
    await client.post({
      path: 'metafields',
      data: {
        metafield: {
          namespace: 'ai_assistant',
          key: 'position',
          value: position || 'bottom-right',
          type: 'single_line_text_field'
        }
      }
    });
    
    // Save primary color
    await client.post({
      path: 'metafields',
      data: {
        metafield: {
          namespace: 'ai_assistant',
          key: 'primary_color',
          value: primaryColor || '#0071e3',
          type: 'single_line_text_field'
        }
      }
    });
    
    // Add script tag to store
    await client.post({
      path: 'script_tags',
      data: {
        script_tag: {
          event: 'onload',
          src: 'https://cdn.aiassistant.com/embed.js'
        }
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to generate app HTML
function getAppHTML(shop, host) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Customer Service Assistant</title>
        <link rel="stylesheet" href="https://cdn.aiassistant.com/shopify-app.css">
      </head>
      <body>
        <div id="app" data-shop="${shop}" data-host="${host}"></div>
        <script src="https://cdn.aiassistant.com/shopify-app.js"></script>
      </body>
    </html>
  `;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
