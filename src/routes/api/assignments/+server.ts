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