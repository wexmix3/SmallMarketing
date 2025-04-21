import { NextApiRequest, NextApiResponse } from 'next';
import { getPickById, updatePick, deletePick } from '../../../src/utils/database';
import { evaluatePickResult } from '../../../src/utils/enhancedGamblingAlgorithm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the pick ID from the URL
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid pick ID' });
  }

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return handleGetPick(req, res, id);
    case 'PUT':
      return handleUpdatePick(req, res, id);
    case 'DELETE':
      return handleDeletePick(req, res, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Handler for GET requests
async function handleGetPick(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const pick = await getPickById(id);
    
    if (!pick) {
      return res.status(404).json({ message: 'Pick not found' });
    }
    
    return res.status(200).json({
      success: true,
      pick
    });
  } catch (error) {
    console.error('Error fetching pick:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pick',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// Handler for PUT requests
async function handleUpdatePick(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const updates = req.body;
    
    // If updating the result, evaluate the pick
    if (updates.evaluateResult) {
      const result = await evaluatePickResult(id, updates.gameResult);
      updates.result = result;
      delete updates.evaluateResult;
      delete updates.gameResult;
    }
    
    const updatedPick = await updatePick(id, updates);
    
    if (!updatedPick) {
      return res.status(404).json({ message: 'Pick not found' });
    }
    
    return res.status(200).json({
      success: true,
      pick: updatedPick
    });
  } catch (error) {
    console.error('Error updating pick:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update pick',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// Handler for DELETE requests
async function handleDeletePick(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const deleted = await deletePick(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Pick not found' });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Pick deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pick:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete pick',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
