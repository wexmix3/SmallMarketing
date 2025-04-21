import { NextApiRequest, NextApiResponse } from 'next';
import { initializeDatabase } from '../../src/utils/initDatabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if force sync is requested
    const { force = false } = req.body;
    
    // Initialize database
    const success = await initializeDatabase(force);
    
    if (success) {
      return res.status(200).json({
        success: true,
        message: 'Database initialized successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to initialize database'
      });
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    return res.status(500).json({
      success: false,
      message: 'Error initializing database',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
