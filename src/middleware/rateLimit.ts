import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../pages/api/auth/[...nextauth]';

// Simple in-memory store for rate limiting
// In a production environment, you would use Redis or another distributed cache
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Rate limit configuration
const RATE_LIMIT_MAX = 100; // Maximum number of requests
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

/**
 * Rate limiting middleware for API routes
 * @param req - Next.js API request
 * @param res - Next.js API response
 * @param maxRequests - Maximum number of requests in the time window
 * @param windowMs - Time window in milliseconds
 * @returns True if the request is allowed, false if rate limited
 */
export async function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  maxRequests: number = RATE_LIMIT_MAX,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): Promise<boolean> {
  // Get client identifier (IP address or user ID if authenticated)
  let clientId = req.headers['x-forwarded-for'] as string || 
                 req.socket.remoteAddress || 
                 'unknown';
  
  // If user is authenticated, use their ID instead of IP
  const session = await getServerSession(req, res, authOptions);
  if (session?.user?.id) {
    clientId = session.user.id;
    
    // Authenticated users get higher rate limits
    maxRequests = maxRequests * 2;
  }
  
  // Get current timestamp
  const now = Date.now();
  
  // Initialize or reset rate limit data if needed
  if (!store[clientId] || store[clientId].resetTime <= now) {
    store[clientId] = {
      count: 0,
      resetTime: now + windowMs
    };
  }
  
  // Increment request count
  store[clientId].count++;
  
  // Check if rate limit is exceeded
  if (store[clientId].count > maxRequests) {
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', Math.ceil(store[clientId].resetTime / 1000).toString());
    res.setHeader('Retry-After', Math.ceil((store[clientId].resetTime - now) / 1000).toString());
    
    // Return 429 Too Many Requests
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
    
    return false;
  }
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', (maxRequests - store[clientId].count).toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(store[clientId].resetTime / 1000).toString());
  
  return true;
}
