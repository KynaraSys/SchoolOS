import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get('auth_token')?.value;

        // Call backend logout to revoke the Sanctum token
        if (authToken) {
            try {
                await fetch(`${BACKEND_URL}/api/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                // Log but don't fail - we still want to clear the cookie
                console.error('Backend logout failed:', error);
            }
        }

        // Clear the HTTP-only cookie by setting it to empty with immediate expiration
        cookieStore.set('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });

        return NextResponse.json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error('Logout Route Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

