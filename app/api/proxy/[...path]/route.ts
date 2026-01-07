import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Proxy Route
 * 
 * This catch-all route proxies requests to the Laravel backend,
 * automatically attaching the auth_token from HttpOnly cookies
 * as a Bearer token in the Authorization header.
 * 
 * This prevents XSS attacks from stealing the auth token since
 * JavaScript cannot access HttpOnly cookies.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NEXT_PUBLIC_API_HOST ? `https://${process.env.NEXT_PUBLIC_API_HOST}` : 'http://127.0.0.1:8000');

async function handleRequest(request: NextRequest, params: Promise<{ path: string[] }>) {
    try {
        const { path } = await params;
        console.log('Proxy Request Path:', path);
        const cookieStore = await cookies();
        const authToken = cookieStore.get('auth_token')?.value;

        // Build the backend URL
        const backendPath = path.join('/');
        const url = new URL(`/api/${backendPath}`, BACKEND_URL);

        // Forward query parameters
        request.nextUrl.searchParams.forEach((value, key) => {
            url.searchParams.append(key, value);
        });

        // Build headers
        const headers: HeadersInit = {
            'Accept': 'application/json',
        };

        // Add auth header if token exists
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        // Handle content type based on request
        const contentType = request.headers.get('content-type');
        if (contentType) {
            headers['Content-Type'] = contentType;
        }

        // Get request body for non-GET requests
        let body: BodyInit | undefined;
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            try {
                body = await request.text();
            } catch {
                // No body
            }
        }

        // Make the request to the backend
        const response = await fetch(url.toString(), {
            method: request.method,
            headers,
            body,
        });

        // Get response data
        const data = await response.text();

        // Return the response with appropriate headers
        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/json',
            },
        });

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { message: 'Proxy Error: Unable to reach backend' },
            { status: 502 }
        );
    }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleRequest(request, context.params);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleRequest(request, context.params);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleRequest(request, context.params);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleRequest(request, context.params);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return handleRequest(request, context.params);
}
