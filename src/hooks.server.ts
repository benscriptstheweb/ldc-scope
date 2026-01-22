import type { Handle } from '@sveltejs/kit';
import { adminAuth } from '$lib/firebase/admin';

export const handle: Handle = async ({ event, resolve }) => {
    // Firebase Auth token stored in cookie from login at /signin page
    const sessionCookie = event.cookies.get('__session');

    // if there is a cookie... 
    if (sessionCookie) {
        try {
            const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

            // ...locals will be saved with the custom claims in a user object...
            event.locals.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                isAdmin: decodedToken.isAdmin,
                assignedRegion: decodedToken.assignedRegion
            };
        } catch (err) {
            // ...otherwise, if the cookie is bad from a bad login attempt....
            event.locals.user = null;
        }
    } else {
        // ...or if there is no cookie from no attempt at a login, then locals gets nothing.
        // This triggers a redirect back to /signin page in the +layout.server.ts file.
        event.locals.user = null;
    }

    return resolve(event);
};
