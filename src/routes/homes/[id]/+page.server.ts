import { adminDb } from '$lib/firebase/admin';

export async function load({ params }) {
    // house details
    const homeDocRef = adminDb.doc(`homes/${params.id}`);
    const homeSnap = await homeDocRef.get();
    const homeData = homeSnap.data();

    // attached volunteers
    const volunteerRef = homeDocRef.collection('volunteers');
    const volunteerSnap = await volunteerRef.get()
    const volunteerData = volunteerSnap.docs.map((doc) => {
        return {
            name: doc.data().name,
            dateStart: Intl.DateTimeFormat('en-CA').format(doc.data().dateStart.toDate()),
            dateEnd: Intl.DateTimeFormat('en-CA').format(doc.data().dateEnd.toDate())
        }
    });

    const serializable = {
        address1: homeData?.address1,
        address2: homeData?.address2,
        city: homeData?.city,
        state: homeData?.state,
        zip: homeData?.zip,
        amenities: homeData?.amenities,
        volunteers: volunteerData
    }

    return serializable
}