/**
 * Security Middleware
 * Handles authentication and security for API requests
 */

import { verifyToken } from '../utils/auth.js';

/**
 * Authentication middleware
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {Function} next - Next middleware function
 */
async function authMiddleware(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7);
    
    try {
      // Verify JWT token
      const decoded = await verifyToken(token);
      
      // Add user info to request
      req.user = {
        userId: decoded.userId,
        businessId: decoded.businessId,
        role: decoded.role
      };
      
      // Continue to next middleware
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Role-based access control middleware
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} - Middleware function
 */
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    try {
      // Check if user exists (should be set by authMiddleware)
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Check if user has allowed role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      // Continue to next middleware
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Rate limiting middleware
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} - Middleware function
 */
function rateLimitMiddleware(maxRequests = 100, windowMs = 60000) {
  // In a real implementation, this would use a proper rate limiting library
  // For demo purposes, we'll use a simple in-memory store
  const requestCounts = {};
  
  // Clean up old entries periodically
  setInterval(() => {
    const now = Date.now();
    
    Object.keys(requestCounts).forEach(key => {
      if (now - requestCounts[key].timestamp > windowMs) {
        delete requestCounts[key];
      }
    });
  }, windowMs);
  
  return (req, res, next) => {
    try {
      // Get client IP
      const clientIp = req.ip || req.connection.remoteAddress;
      
      // Initialize or update request count
      if (!requestCounts[clientIp]) {
        requestCounts[clientIp] = {
          count: 1,
          timestamp: Date.now()
        };
      } else {
        // Check if window has expired
        if (Date.now() - requestCounts[clientIp].timestamp > windowMs) {
          // Reset count for new window
          requestCounts[clientIp] = {
            count: 1,
            timestamp: Date.now()
          };
        } else {
          // Increment count
          requestCounts[clientIp].count++;
        }
      }
      
      // Check if rate limit exceeded
      if (requestCounts[clientIp].count > maxRequests) {
        return res.status(429).json({ error: 'Too many requests' });
      }
      
      // Continue to next middleware
      next();
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Export middleware functions
export {
  authMiddleware,
  roleMiddleware,
  rateLimitMiddleware
};
