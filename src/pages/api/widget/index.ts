import { NextApiRequest, NextApiResponse } from 'next';
import { ConfigurationService } from '../../../services/configurationService';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const configService = new ConfigurationService(pool);

/**
 * Widget API endpoint
 * 
 * This endpoint serves the widget configuration for a business.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { businessId } = req.query;
    
    if (!businessId || Array.isArray(businessId)) {
      res.status(400).json({ error: 'Business ID is required' });
      return;
    }
    
    // Get chatbot configuration
    const config = await configService.getConfiguration(businessId);
    
    if (!config) {
      res.status(404).json({ error: 'Chatbot configuration not found' });
      return;
    }
    
    // Return configuration with sensitive information removed
    const safeConfig = {
      id: config.id,
      businessId: config.businessId,
      name: config.name,
      welcomeMessage: config.welcomeMessage,
      fallbackMessage: config.fallbackMessage,
      transferMessage: config.transferMessage,
      offlineMessage: config.offlineMessage,
      appearance: config.appearance,
      behavior: {
        ...config.behavior,
        // Remove any sensitive settings
        apiKeys: undefined
      },
      // Remove sensitive integration details
      integrations: {
        calendarType: config.integrations.calendarType,
        crmType: config.integrations.crmType,
        emailMarketing: config.integrations.emailMarketing,
        emailMarketingProvider: config.integrations.emailMarketingProvider
      },
      // Remove AI settings
      aiSettings: undefined
    };
    
    res.status(200).json(safeConfig);
  } catch (error) {
    console.error('Error getting widget configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
