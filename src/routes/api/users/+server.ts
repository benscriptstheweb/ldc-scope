import { adminAuth } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export async function GET({ locals, url }) {
    const email = url.searchParams.get('email');

    if (!locals.user || locals.user.isAdmin !== true) {
        return new Response('Unauthorized', { status: 401 });
    }

    if (email) {
        const singleUser = await adminAuth.getUserByEmail(email);

        return json({
            uid: singleUser.uid,
            email: singleUser.email,
            displayName: singleUser.displayName
        })
    }

    let listUsersResult = await adminAuth.listUsers(20);
    let users = listUsersResult.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
    }));

    return json(users);
}