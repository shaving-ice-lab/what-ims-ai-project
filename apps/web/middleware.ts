import { NextRequest, NextResponse } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password'];

// Role-based route access configuration
const roleRoutes: Record<string, string[]> = {
  admin: ['/admin', '/dashboard'],
  sub_admin: ['/admin', '/dashboard'],
  supplier: ['/supplier', '/dashboard'],
  store: ['/store', '/dashboard'],
};

// Routes that require role selection
const roleSelectRoute = '/select-role';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const token = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  const selectedRole = request.cookies.get('selectedRole')?.value;

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle role selection page
  if (pathname === roleSelectRoute) {
    // If user has already selected a role, redirect to dashboard
    if (selectedRole) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Redirect to role selection if user has multiple roles but hasn't selected one
  const hasMultipleRoles = request.cookies.get('hasMultipleRoles')?.value === 'true';
  if (hasMultipleRoles && !selectedRole && pathname !== roleSelectRoute) {
    return NextResponse.redirect(new URL(roleSelectRoute, request.url));
  }

  // Determine the effective role (selected role or single role)
  const effectiveRole = selectedRole || userRole;

  // Check role-based access
  if (effectiveRole) {
    const allowedPaths = roleRoutes[effectiveRole] || [];

    // Check if current path is allowed for the user's role
    const isAllowed =
      allowedPaths.some((path) => pathname.startsWith(path)) || pathname === '/dashboard';

    if (!isAllowed) {
      // Redirect to appropriate dashboard based on role
      const defaultPath = roleRoutes[effectiveRole]?.[0] || '/dashboard';
      return NextResponse.redirect(new URL(defaultPath, request.url));
    }
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
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
