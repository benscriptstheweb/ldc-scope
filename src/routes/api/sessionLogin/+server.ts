import { adminAuth } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
    const { idToken } = await request.json();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set the session cookie
    cookies.set('__session', sessionCookie, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: expiresIn / 1000
    });

    return json({ status: 'success' });
};
