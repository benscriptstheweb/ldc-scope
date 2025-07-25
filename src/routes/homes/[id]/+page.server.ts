import { adminDb } from '$lib/firebase/admin';

export async function load({ params }) {
    const docSnap = await adminDb.collection('homes').doc(params.id).get();

    return {
        home: docSnap.data()
    };
}