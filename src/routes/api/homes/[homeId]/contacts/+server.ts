import { adminDb } from '$lib/firebase/admin';
import { json } from '@sveltejs/kit';

export async function POST({ locals, params, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 })
    }

    const { homeId } = params;
    const body = await request.json();

    if (!body.name || !body.phone || !body.email) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        await adminDb
            .collection('homes')
            .doc(homeId)
            .collection('contacts')
            .add({
                name: body.name,
                phone: body.phone,
                email: body.email,
                isPrimary: body.isPrimary
            });

        return json({ success: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return json({ error: 'Failed to add contact' }, { status: 500 });
    }
}

export async function GET({ params }) {
    const { homeId } = params;
    const contactsSnap = await adminDb
        .collection('homes')
        .doc(homeId)
        .collection('contacts').get();

    const contacts = contactsSnap.docs.map((contact) => {
        return {
            id: contact.id,
            name: contact.data().name,
            email: contact.data().email,
            phone: contact.data().phone,
            isPrimary: contact.data().isPrimary
        }
    });

    return json(contacts);
}