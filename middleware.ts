import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')
    const { pathname } = request.nextUrl

    // Definitions for public paths that don't require authentication
    const isAuthPath = pathname.startsWith('/auth')

    // 1. Redirect to Login if unauthenticated and trying to access a protected route
    // We treat everything as protected unless it matches a public path
    if ((!token || !token.value) && !isAuthPath) {
        const loginUrl = new URL('/auth/login', request.url)
        // Optional: Add the original URL as a 'from' parameter to redirect back after login
        // loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 2. Redirect to Dashboard if authenticated and trying to access auth pages (login/register)
    // This prevents logged-in users from seeing the login screen
    if (token && isAuthPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
