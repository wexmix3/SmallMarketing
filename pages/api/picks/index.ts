import { NextApiRequest, NextApiResponse } from 'next';
import { getAllPicks, getPicksByDate } from '../../../src/utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if date filter is provided
    const { date } = req.query;
    
    // Get picks based on filter
    const picks = date 
      ? await getPicksByDate(date as string)
      : await getAllPicks();
    
    // Return success response
    return res.status(200).json({
      success: true,
      picks
    });
  } catch (error) {
    console.error('Error fetching picks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch picks',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
