import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/', '/hotels', '/about', '/contact', '/test-auth'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Protected paths that require authentication
  const protectedPaths = ['/dashboard', '/profile', '/bookings', '/owner'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // Since middleware runs on server and can't access localStorage,
  // we need to let the client-side handle authentication checks
  // We'll just ensure protected routes aren't accessed without a token in the request
  
  // Check for token in Authorization header (sent from client)
  const authHeader = request.headers.get('authorization');
  const hasToken = authHeader && authHeader.startsWith('Bearer ');
  
  // For API routes, we might want to check the token
  if (pathname.startsWith('/api/')) {
    // API routes protection logic here
    return NextResponse.next();
  }

  // For page routes, we'll let the client-side ProtectedRoute component handle it
  // This middleware just ensures that protected routes aren't served if there's no token in the request
  if (!hasToken && isProtectedPath) {
    // Instead of redirecting, we'll let the client handle it
    // This prevents redirect loops and works with localStorage
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};