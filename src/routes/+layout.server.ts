// src/routes/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const publicRoutes = ['/signin'];
    const pathname = url.pathname;

    if (!locals.user && !publicRoutes.includes(pathname)) {
        throw redirect(302, '/signin');
    }

    return {
        user: locals.user
    };
};
