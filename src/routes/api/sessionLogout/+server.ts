import { json } from '@sveltejs/kit';


export const POST = async ({ cookies }) => {
    cookies.set('__session', '', {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 0
    });

    return json({ status: 'logged out' });
};