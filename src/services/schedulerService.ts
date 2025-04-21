/**
 * Scheduler Service
 *
 * This service handles scheduling tasks to run at specific times,
 * particularly for posting daily sports gambling picks.
 */

import { generateDailyPicks } from './sportsGamblingService';
import { formatPicksForTwitter, postTweetThread } from './twitterService';
import { DailyPicks, BettingPick } from '@/models/sports';

// Repository for storing picks (would be replaced with a database in a real implementation)
let scheduledPicks: DailyPicks[] = [];
let postedPicks: DailyPicks[] = [];

/**
 * Schedule daily picks to be posted at 9am EST
 */
export async function scheduleDailyPicks(): Promise<void> {
  try {
    // Generate picks for today
    const picks = await generateDailyPicks();
    
    // Store in scheduled picks
    scheduledPicks.push(picks);
    
    // Calculate time until 9am EST
    const postTime = getNext9AMEST();
    const timeUntilPost = postTime.getTime() - Date.now();
    
    console.log(`Scheduled picks for ${postTime.toLocaleString()}`);
    
    // Schedule the post
    setTimeout(() => {
      postDailyPicks(picks.id)
        .catch(error => console.error('Error posting daily picks:', error));
    }, timeUntilPost);
    
    return;
  } catch (error) {
    console.error('Error scheduling daily picks:', error);
    throw error;
  }
}

/**
 * Post daily picks to Twitter
 */
export async function postDailyPicks(picksId: string): Promise<void> {
  try {
    // Find the scheduled picks
    const picks = scheduledPicks.find(p => p.id === picksId);
    
    if (!picks) {
      throw new Error(`Picks with ID ${picksId} not found`);
    }
    
    // Format picks for Twitter
    const tweets = formatPicksForTwitter(picks.picks, true);
    
    // Post to Twitter
    const response = await postTweetThread(tweets);
    
    // Update picks with tweet ID and status
    const updatedPicks: DailyPicks = {
      ...picks,
      status: 'posted',
      tweetId: response[0].id,
      picks: picks.picks.map(pick => ({
        ...pick,
        postedAt: new Date(),
        tweetId: response[0].id
      }))
    };
    
    // Remove from scheduled picks and add to posted picks
    scheduledPicks = scheduledPicks.filter(p => p.id !== picksId);
    postedPicks.push(updatedPicks);
    
    console.log(`Posted picks to Twitter with ID ${response[0].id}`);
    
    return;
  } catch (error) {
    console.error('Error posting daily picks:', error);
    throw error;
  }
}

/**
 * Get the next 9am EST time
 */
function getNext9AMEST(): Date {
  const now = new Date();
  const estOffset = -5; // EST is UTC-5
  
  // Convert current time to EST
  const utcHours = now.getUTCHours();
  const estHours = (utcHours + estOffset) % 24;
  
  // Create a date object for 9am EST today
  const target = new Date(now);
  target.setUTCHours(9 - estOffset, 0, 0, 0);
  
  // If it's already past 9am EST, schedule for tomorrow
  if (estHours >= 9) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  
  return target;
}

/**
 * Initialize the scheduler
 */
export function initializeScheduler(): void {
  // Schedule picks for today
  scheduleDailyPicks()
    .catch(error => console.error('Error initializing scheduler:', error));
  
  // Set up daily scheduling at midnight EST
  const midnight = getNextMidnightEST();
  const timeUntilMidnight = midnight.getTime() - Date.now();
  
  setTimeout(() => {
    // Schedule picks for the new day
    scheduleDailyPicks()
      .catch(error => console.error('Error scheduling picks:', error));
    
    // Set up a daily interval
    setInterval(() => {
      scheduleDailyPicks()
        .catch(error => console.error('Error scheduling picks:', error));
    }, 24 * 60 * 60 * 1000); // 24 hours
  }, timeUntilMidnight);
}

/**
 * Get the next midnight EST time
 */
function getNextMidnightEST(): Date {
  const now = new Date();
  const estOffset = -5; // EST is UTC-5
  
  // Create a date object for midnight EST tomorrow
  const target = new Date(now);
  target.setUTCHours(24 + estOffset, 0, 0, 0);
  
  return target;
}

/**
 * Get all scheduled picks
 */
export function getScheduledPicks(): DailyPicks[] {
  return scheduledPicks;
}

/**
 * Get all posted picks
 */
export function getPostedPicks(): DailyPicks[] {
  return postedPicks;
}

/**
 * Manually trigger posting picks
 */
export async function manuallyPostPicks(picksId: string): Promise<void> {
  return postDailyPicks(picksId);
}

/**
 * Generate and immediately post picks
 */
export async function generateAndPostPicks(): Promise<void> {
  try {
    // Generate picks
    const picks = await generateDailyPicks();
    
    // Store in scheduled picks
    scheduledPicks.push(picks);
    
    // Post immediately
    await postDailyPicks(picks.id);
    
    return;
  } catch (error) {
    console.error('Error generating and posting picks:', error);
    throw error;
  }
}
