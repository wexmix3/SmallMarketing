import { NextApiRequest, NextApiResponse } from 'next';
import { generateDailyPicks, formatPicksForTweet } from '../../src/utils/enhancedGamblingAlgorithm';
import { postTweet } from '../../src/utils/twitter';
import { savePickToDatabase } from '../../src/utils/database';
import { rateLimit } from '../../src/middleware/rateLimit';
import { handleApiError, ErrorType, validateRequest } from '../../src/utils/errorHandler';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return handleApiError(res, 'Method not allowed', ErrorType.VALIDATION, 'Only POST requests are allowed');
  }

  try {
    // Apply rate limiting (10 requests per minute for this endpoint)
    const isAllowed = await rateLimit(req, res, 10);
    if (!isAllowed) return; // Response already sent by rateLimit middleware

    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return handleApiError(res, 'Unauthorized', ErrorType.AUTHENTICATION, 'You must be signed in to generate picks');
    }

    // Validate request body
    const validation = validateRequest(req.body, {
      numPicks: { required: true, type: 'number', min: 1, max: 3 }
    });

    if (!validation.valid) {
      return handleApiError(
        res,
        validation.errors?.join(', ') || 'Invalid request data',
        ErrorType.VALIDATION
      );
    }

    // Get number of picks from request body
    const { numPicks = 3 } = req.body;

    // Generate picks
    const picks = await generateDailyPicks(Math.min(3, Math.max(1, numPicks)));

    // Save picks to database
    const savedPicks = await Promise.all(picks.map(pick => savePickToDatabase(pick)));

    // Format picks for Twitter
    const tweetContent = formatPicksForTweet(picks);

    // Post to Twitter
    const tweetResponse = await postTweet(tweetContent);

    // Return success response
    return res.status(200).json({
      success: true,
      picks: savedPicks,
      tweet: tweetContent,
      tweetResponse
    });
  } catch (error) {
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes('database')) {
        return handleApiError(res, error, ErrorType.DATABASE);
      } else if (error.message.includes('Twitter') || error.message.includes('API')) {
        return handleApiError(res, error, ErrorType.EXTERNAL_API);
      }
    }

    // Default error handling
    return handleApiError(res, error instanceof Error ? error : String(error), ErrorType.INTERNAL);
  }
}
