import { NextApiRequest, NextApiResponse } from 'next';
import { getMonthlyPerformance } from '../../../src/utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get monthly performance data
    const monthlyData = await getMonthlyPerformance();
    
    // Return success response
    return res.status(200).json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    console.error('Error fetching monthly performance data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly performance data',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
