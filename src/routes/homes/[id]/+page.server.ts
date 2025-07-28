import { adminDb } from '$lib/firebase/admin';

export async function load({ params }) {
    const homeDocRef = adminDb.doc(`homes/${params.id}`);
    const homeSnap = await homeDocRef.get();
    const homeData = homeSnap.data();

    const ownerRef = homeData?.owner;
    const ownerSnap = await ownerRef.get();
    const ownerData = ownerSnap.data();

    const serializable = {
        address1: homeData?.address1,
        address2: homeData?.address2,
        city: homeData?.city,
        state: homeData?.state,
        zip: homeData?.zip,
        hasVolunteer: homeData?.hasVolunteer,
        owner: ownerData
    }

    return serializable
}