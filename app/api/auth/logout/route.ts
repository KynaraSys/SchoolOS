import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Clear the HTTP-only cookie by setting it to empty with immediate expiration
        const cookieStore = await cookies();
        cookieStore.set('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });

        // Optional: Call backend logout if needed to invalidate token
        // const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        // await fetch(`${backendUrl}/api/logout`, { ... });

        return NextResponse.json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error('Logout Route Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
