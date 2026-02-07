import { adminAuth } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
    const { idToken } = await request.json();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    // create the session cookie via firebase
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // set the session cookie with properties
    cookies.set('__session', sessionCookie, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: expiresIn / 1000
    });

    return json({ message: 'success' }, { status: 200 });
};
