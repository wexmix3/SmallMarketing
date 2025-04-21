import { NextApiRequest, NextApiResponse } from 'next';
import predictionModel from '../../../src/ml/predictionModel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Start training the model
    // This is an async operation, but we'll return immediately
    predictionModel.trainModel().catch(error => {
      console.error('Error training model:', error);
    });
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Model training started'
    });
  } catch (error) {
    console.error('Error starting model training:', error);
    return res.status(500).json({
      success: false,
      message: 'Error starting model training',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
