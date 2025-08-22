// src/routes/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const publicRoutes = ['/signin', '/survey', '/survey/pass'];
    const pathname = url.pathname;

    if (!locals.user && !publicRoutes.includes(pathname)) {
        throw redirect(302, '/signin');
    }

    if (locals.user && pathname === '/signin') {
        throw redirect(302, '/');
    }

    return {
        user: locals.user
    };
};
