// src/routes/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const publicRoutes = ['/signin', '/survey', '/survey/pass'];
    const pathname = url.pathname;

    // redirect to signin if there is no user object in locals
    if (!locals.user && !publicRoutes.includes(pathname)) {
        throw redirect(302, '/signin');
    }

    // if there is already a user signed in and they try to visit signin page
    // redirect to home
    if (locals.user && pathname === '/signin') {
        throw redirect(302, '/');
    }

    return {
        user: locals.user
    };
};
