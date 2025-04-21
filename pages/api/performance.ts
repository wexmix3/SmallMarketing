import { NextApiRequest, NextApiResponse } from 'next';
import { getPerformanceMetrics } from '../../src/utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get performance metrics
    const metrics = await getPerformanceMetrics();
    
    // Return success response
    return res.status(200).json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch performance metrics',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
