import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, remember } = body;

        // Forward request to Laravel Backend
        // Forward request to Laravel Backend
        const apiHost = process.env.NEXT_PUBLIC_API_HOST;
        let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

        if (apiHost) {
            // If host has protocol, use it
            if (apiHost.startsWith('http')) {
                backendUrl = apiHost;
            }
            // If host looks like a FQDN (has dots), use https
            else if (apiHost.includes('.')) {
                backendUrl = `https://${apiHost}`;
            }
            // Otherwise assume internal service name (http)
            else {
                backendUrl = `http://${apiHost}`; // Render internal service discovery usually on port 80/10000 depending on config. Try default 80 first or let service discovery handle it.
                // Dockerfile says EXPOSE 80, so http://school-os-backend should work if on same private network.
            }
        }

        console.log(`[Login] connecting to backend: ${backendUrl}, API_HOST env: ${apiHost}`);

        const response = await fetch(`${backendUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Login Route Error: Failed to parse backend response as JSON', responseText);
            return NextResponse.json(
                { message: 'Backend returned invalid response', details: responseText.substring(0, 500) },
                { status: response.status >= 400 ? response.status : 500 }
            );
        }

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
