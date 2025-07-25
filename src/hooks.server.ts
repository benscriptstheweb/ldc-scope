// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { adminAuth } from '$lib/firebase/admin';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('__session'); // Firebase Auth token stored in cookie

    if (sessionCookie) {
        try {
            const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
            const adminStatus = await adminAuth.getUser(decodedToken.uid)
                .then((record) => {
                    return record.customClaims?.['admin']
                })

            event.locals.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                isAdmin: adminStatus
            };
        } catch (err) {
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    return resolve(event);
};
