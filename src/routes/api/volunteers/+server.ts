import { adminDb } from "$lib/firebase/admin";
import { json } from "@sveltejs/kit";

export async function GET() {
    const volunteersSnapShot = await adminDb.collection('volunteers').get();

    const volunteers = await Promise.all(volunteersSnapShot.docs.map(async (volunteerDoc) => {
        return {
            id: volunteerDoc.id,
            name: volunteerDoc.data().name,
            email: volunteerDoc.data().email,
            phone: volunteerDoc.data().phone,
            dateStart: Intl.DateTimeFormat('en-CA').format(volunteerDoc.data().dateStart.toDate()),
            dateEnd: Intl.DateTimeFormat('en-CA').format(volunteerDoc.data().dateEnd.toDate()),
            project: volunteerDoc.data().project
        };
    }));

    return json(volunteers);
}

export async function POST({ locals, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 })
    }

    const body = await request.json();

    // For Volunteers, we can always add their contact info later. Most important now is their name
    // and assignment, and a reachable contact.
    if (!body.project || !body.name || !body.email) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        await adminDb
            .collection('volunteers')
            .add(body);

        return json({ success: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return json({ error: 'Failed to add contact' }, { status: 500 });
    }
}