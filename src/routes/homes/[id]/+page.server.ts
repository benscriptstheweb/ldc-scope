import { adminDb } from '$lib/firebase/admin'; // Use your admin SDK instance

export async function load({ params }) {
    const docSnap = await adminDb.collection('homes').doc(params.id).get();

    return {
        home: docSnap.data()
    };
}