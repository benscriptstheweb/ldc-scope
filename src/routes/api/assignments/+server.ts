import { adminDb } from "$lib/firebase/admin";
import { json } from "@sveltejs/kit";

export async function GET() {
    const assignmentsSnap = await adminDb.collection('assignments').get();

    const assignments = await Promise.all(assignmentsSnap.docs.map(async (assignmentsDoc) => {
        return {
            id: assignmentsDoc.id,
            homeId: assignmentsDoc.data().homeId,
            volunteerId: assignmentsDoc.data().volunteerId,
        };
    }));

    return json(assignments);
}

export async function POST({ locals, request }) {
    if (!locals.user?.isAdmin) {
        return new Response('Forbidden', { status: 403 })
    }

    const body = await request.json();

    try {
        await adminDb.collection('assignments').add(body);
        await adminDb.collection('homes').doc(body.homeId).update({
            isAssigned: true
        });

        return json({ success: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return json({ error: 'Failed to assign' }, { status: 500 });
    }
}