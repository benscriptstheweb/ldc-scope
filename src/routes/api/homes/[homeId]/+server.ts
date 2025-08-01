import { adminDb } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export async function PATCH({ params, request }) {
    const { homeId } = params;
    const body = await request.json();

    if (!body.address1 || !body.city || !body.state || !body.zip) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        await adminDb
            .collection('homes')
            .doc(homeId)
            .update({
                address1: body.address1,
                address2: body.address2,
                city: body.city,
                state: body.state,
                zip: body.zip
            });

        return json({ success: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return json({ error: 'Failed to add contact' }, { status: 500 });
    }
}
