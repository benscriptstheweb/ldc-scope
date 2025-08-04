import { adminDb } from '$lib/firebase/admin.js';
import { json } from '@sveltejs/kit';

export async function DELETE({ params }) {
    const { homeId, contactId } = params;

    try {
        await adminDb.collection('homes').doc(homeId).collection('contacts').doc(contactId).delete();
    } catch (error) {
        throw error;
    }

    return json({ status: 'deleted' });
}

export async function PATCH({ params, request }) {
    const { homeId, contactId } = params;
    const body = await request.json();

    try {
        await adminDb.collection('homes').doc(homeId).collection('contacts').doc(contactId).update(
            {
                ...body
            }
        );
    } catch (error) {
        throw error;
    }

    return json({ status: 'deleted' });
}
