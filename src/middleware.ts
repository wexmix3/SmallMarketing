import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// In-memory rate limiting store (for demo purposes)
// In production, use Redis or another distributed store
const rateLimit = {
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  store: new Map<string, { count: number; resetTime: number }>()
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get the pathname
  const { pathname } = request.nextUrl;
  
  // Skip middleware for non-API routes and public API routes
  if (!pathname.startsWith('/api/') || 
      pathname.startsWith('/api/auth/') || 
      pathname === '/api/chatbot/widget') {
    return response;
  }
  
  // Apply rate limiting
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const rateLimitKey = `${ip}:${pathname}`;
  
  // Get current rate limit data
  const rateLimitData = rateLimit.store.get(rateLimitKey) || { 
    count: 0, 
    resetTime: now + rateLimit.windowMs 
  };
  
  // Reset if window has expired
  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 0;
    rateLimitData.resetTime = now + rateLimit.windowMs;
  }
  
  // Increment count
  rateLimitData.count++;
  
  // Update store
  rateLimit.store.set(rateLimitKey, rateLimitData);
  
  // Set rate limit headers
  response.headers.set('X-RateLimit-Limit', rateLimit.max.toString());
  response.headers.set('X-RateLimit-Remaining', Math.max(0, rateLimit.max - rateLimitData.count).toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitData.resetTime / 1000).toString());
  
  // Check if rate limit exceeded
  if (rateLimitData.count > rateLimit.max) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.'
      }),
      { 
        status: 429, 
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((rateLimitData.resetTime - now) / 1000).toString()
        }
      }
    );
  }
  
  // Check authentication for protected routes
  if (pathname.startsWith('/api/chatbot/admin/') || 
      pathname.startsWith('/api/chatbot/businesses/')) {
    try {
      // Get the token
      const token = await getToken({ req: request });
      
      // If no token, return unauthorized
      if (!token) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Unauthorized',
            message: 'Authentication required'
          }),
          { 
            status: 401, 
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Add user info to request headers for downstream use
      if (token.email) {
        response.headers.set('X-User-Email', token.email as string);
      }
      if (token.sub) {
        response.headers.set('X-User-ID', token.sub);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Internal Server Error',
          message: 'Authentication service unavailable'
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  // Validate request body for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      // Clone the request to read the body
      const clonedRequest = request.clone();
      const contentType = request.headers.get('content-type') || '';
      
      // Only validate JSON requests
      if (contentType.includes('application/json')) {
        const body = await clonedRequest.json();
        
        // Basic validation - ensure body is not empty
        if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
          return new NextResponse(
            JSON.stringify({ 
              error: 'Bad Request',
              message: 'Request body cannot be empty'
            }),
            { 
              status: 400, 
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
        
        // Add more specific validation rules here based on the route
      }
    } catch (error) {
      // If JSON parsing fails, return bad request
      return new NextResponse(
        JSON.stringify({ 
          error: 'Bad Request',
          message: 'Invalid JSON in request body'
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

// Configure which paths should run the middleware
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
    // Exclude Next.js static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
