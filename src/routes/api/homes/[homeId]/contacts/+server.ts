import { adminDb } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export async function POST({ params, request }) {
    const { homeId } = params;
    const body = await request.json();

    if (!body.name || !body.phone || !body.email) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const docRef = await adminDb
            .collection('homes')
            .doc(homeId)
            .collection('contacts')
            .add({
                name: body.name,
                phone: body.phone,
                email: body.email,
            });

        return json({ id: docRef.id });
    } catch (err) {
        console.error(err);
        return json({ error: 'Failed to add contact' }, { status: 500 });
    }
}