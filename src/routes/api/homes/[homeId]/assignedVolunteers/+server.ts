import { adminDb } from "$lib/firebase/admin";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
    const assignmentsSnap = await adminDb.collection('assignments').where('homeId', '==', params.homeId).get();

    const assignments = await Promise.all(assignmentsSnap.docs.map(async (assignmentsDoc) => {
        const volunteersSnap = await adminDb.collection('volunteers').doc(assignmentsDoc.data().volunteerId).get();

        return {
            id: assignmentsDoc.id,
            volunteerName: volunteersSnap.data()?.name,
            dateStart: volunteersSnap.data()?.dateStart,
            dateEnd: volunteersSnap.data()?.dateEnd,
        };
    }));

    return json(assignments);
}