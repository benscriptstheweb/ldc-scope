import { adminDb } from "$lib/firebase/admin";
import { json } from "@sveltejs/kit";

export async function GET() {
    const volunteersSnapShot = await adminDb.collection('volunteers').get();

    const volunteers = await Promise.all(volunteersSnapShot.docs.map(async (volunteerDoc) => {
        let assignedCity: any;

        const assignmentsSnap = await adminDb.collection('assignments')
            .where('volunteerId', '==', volunteerDoc.id)
            .get();

        // Only call the homes database if there is an assignment found.
        if (assignmentsSnap.docs.length !== 0) {
            assignedCity = await Promise.all(assignmentsSnap.docs.map(async (assignmentDoc) => {
                const homeById = await adminDb.collection('homes').doc(assignmentDoc.data().homeId).get()
                return homeById.data()?.city
            }));
        } else {
            assignedCity = null
        }

        return {
            id: volunteerDoc.id,
            name: volunteerDoc.data().name,
            email: volunteerDoc.data().email,
            phone: volunteerDoc.data().phone,
            dateStart: Intl.DateTimeFormat('en-CA').format(new Date(volunteerDoc.data().dateStart)),
            dateEnd: Intl.DateTimeFormat('en-CA').format(new Date(volunteerDoc.data().dateEnd)),
            project: volunteerDoc.data().project,
            assignedCity
        };
    }));


    return json(volunteers);
}

export async function POST({ locals, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 })
    }

    const body = await request.json();

    console.log('adding new volunteer...', body)

    // For Volunteers, we can always add their contact info later. Most important now is their name
    // project assignment, and phone.
    if (!body.project || !body.name || !body.phone) {
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