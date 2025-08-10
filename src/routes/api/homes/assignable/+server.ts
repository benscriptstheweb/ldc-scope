import { adminDb } from "$lib/firebase/admin";
import { json } from "@sveltejs/kit";

export async function GET() {
    const assignableHomesSnap = await adminDb
        .collection('homes')
        .where('isAssigned', '==', false)
        .get();

    const assignableHomes = await Promise.all(assignableHomesSnap.docs.map(async (doc) => {
        return {
            id: doc.id,
            address1: doc.data().address1,
            address2: doc.data().address2,
            city: doc.data().city,
            state: doc.data().state,
            zip: doc.data().zip,
        };
    }));

    return json(assignableHomes);
}