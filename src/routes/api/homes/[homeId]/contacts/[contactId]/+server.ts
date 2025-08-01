import { adminDb } from '$lib/firebase/admin.js';
import { json } from '@sveltejs/kit';

export async function DELETE({ params }) {
    const { homeId, contactId } = params;

    try {
        await adminDb.collection('homes').doc(homeId).collection('contacts').doc(contactId).delete();
    } catch (error) {
        throw error;
    }

    return json({ status: 'success' });
}
