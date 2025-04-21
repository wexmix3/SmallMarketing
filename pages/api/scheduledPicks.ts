import { NextApiRequest, NextApiResponse } from 'next';
import { generateDailyPicks, formatPicksForTweet } from '../../src/utils/enhancedGamblingAlgorithm';
import { postTweet } from '../../src/utils/twitter';
import { savePickToDatabase } from '../../src/utils/database';
import { handleApiError, ErrorType } from '../../src/utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify the request is authorized with API key
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
    return handleApiError(res, 'Invalid API key', ErrorType.AUTHENTICATION, 'Unauthorized access to scheduled picks');
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return handleApiError(res, 'Method not allowed', ErrorType.VALIDATION, 'Only GET requests are allowed');
  }

  try {
    // Determine how many picks to generate (1-3 randomly)
    const numPicks = Math.floor(Math.random() * 3) + 1;

    // Generate picks
    const picks = await generateDailyPicks(numPicks);

    // Save picks to database
    const savedPicks = await Promise.all(picks.map(pick => savePickToDatabase(pick)));

    // Format picks for Twitter
    const tweetContent = formatPicksForTweet(picks);

    // Post to Twitter
    const tweetResponse = await postTweet(tweetContent);

    // Log the successful post
    console.log(`Successfully posted ${numPicks} picks at ${new Date().toISOString()}`);

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
