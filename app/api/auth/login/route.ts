import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, remember } = body;

        // Forward request to Laravel Backend
        // Forward request to Laravel Backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL ||
            (process.env.NEXT_PUBLIC_API_HOST ? `https://${process.env.NEXT_PUBLIC_API_HOST}` : 'http://127.0.0.1:8000');
        const response = await fetch(`${backendUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Set HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: remember ? 60 * 60 * 24 * 30 : undefined, // 30 days or Session Cookie
        });

        // Also return the user data and token (for client-side usage if needed)
        // Although the goal is to rely on the cookie for server-side auth.
        return NextResponse.json(data);

    } catch (error) {
        console.error('Login Route Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
