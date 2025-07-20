// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { adminAuth } from '$lib/firebase/admin';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('__session'); // Firebase Auth token stored in cookie

    if (sessionCookie) {
        try {
            const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
            event.locals.user = {
                uid: decodedToken.uid,
                email: decodedToken.email
            };
        } catch (err) {
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    return resolve(event);
};
