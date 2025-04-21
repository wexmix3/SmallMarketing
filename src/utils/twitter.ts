import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if Twitter API credentials are available
const hasTwitterCredentials =
  process.env.TWITTER_API_KEY &&
  process.env.TWITTER_API_SECRET &&
  process.env.TWITTER_ACCESS_TOKEN &&
  process.env.TWITTER_ACCESS_SECRET;

// Initialize Twitter client if credentials are available
let twitterClient: TwitterApi | null = null;
let rwClient: any = null;

if (hasTwitterCredentials) {
  try {
    twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY as string,
      appSecret: process.env.TWITTER_API_SECRET as string,
      accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
      accessSecret: process.env.TWITTER_ACCESS_SECRET as string,
    });

    // Get read-write client
    rwClient = twitterClient.readWrite;
  } catch (error) {
    console.error('Failed to initialize Twitter client:', error);
  }
}

/**
 * Post a tweet with the given content
 * @param content - The content of the tweet
 * @returns Promise with the tweet response
 */
export async function postTweet(content: string): Promise<any> {
  // If Twitter client is not available, return mock response
  if (!rwClient) {
    console.log('Twitter client not available. Mock tweet:', content);
    return { data: { id: `mock-tweet-${Date.now()}`, text: content } };
  }

  try {
    const response = await rwClient.v2.tweet(content);
    console.log('Tweet posted successfully:', response);
    return response;
  } catch (error) {
    console.error('Error posting tweet:', error);
    // Return mock response instead of throwing
    return { data: { id: `mock-tweet-${Date.now()}`, text: content } };
  }
}

/**
 * Post a tweet with media (image)
 * @param content - The content of the tweet
 * @param mediaPath - Path to the media file
 * @returns Promise with the tweet response
 */
export async function postTweetWithMedia(content: string, mediaPath: string): Promise<any> {
  // If Twitter client is not available, return mock response
  if (!rwClient) {
    console.log('Twitter client not available. Mock tweet with media:', content, mediaPath);
    return { data: { id: `mock-tweet-media-${Date.now()}`, text: content } };
  }

  try {
    const mediaId = await rwClient.v1.uploadMedia(mediaPath);
    const response = await rwClient.v2.tweet({
      text: content,
      media: { media_ids: [mediaId] }
    });
    console.log('Tweet with media posted successfully:', response);
    return response;
  } catch (error) {
    console.error('Error posting tweet with media:', error);
    // Return mock response instead of throwing
    return { data: { id: `mock-tweet-media-${Date.now()}`, text: content } };
  }
}

// Export a mock client if the real one is not available
export default rwClient || {
  v1: {
    uploadMedia: async () => `mock-media-${Date.now()}`,
  },
  v2: {
    tweet: async (content: any) => ({
      data: { id: `mock-tweet-${Date.now()}`, text: typeof content === 'string' ? content : content.text }
    }),
  },
};
