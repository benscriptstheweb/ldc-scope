import { adminDb } from '$lib/firebase/admin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    // house details
    const homeDocRef = adminDb.doc(`homes/${params.id}`);
    const homeSnap = await homeDocRef.get();
    const homeData = homeSnap.data();

    // attached volunteers :: will deprecate
    const volunteerRef = homeDocRef.collection('volunteers');
    const volunteerSnap = await volunteerRef.get()
    const volunteerData = volunteerSnap.docs.map((doc) => {
        return {
            name: doc.data().name,
            dateStart: Intl.DateTimeFormat('en-CA').format(doc.data().dateStart.toDate()),
            dateEnd: Intl.DateTimeFormat('en-CA').format(doc.data().dateEnd.toDate())
        }
    });

    // contacts
    const contactsRef = homeDocRef.collection('contacts');
    const contactsSnap = await contactsRef.get();
    const contactsData = contactsSnap.docs.map((contact) => {
        return {
            id: contact.id,
            name: contact.data().name,
            email: contact.data().email,
            phone: contact.data().phone,
            isPrimary: contact.data().isPrimary
        }
    });

    const home = {
        id: params.id,
        address1: homeData?.address1,
        address2: homeData?.address2,
        city: homeData?.city,
        state: homeData?.state,
        zip: homeData?.zip,
        amenities: homeData?.amenities,
        volunteers: volunteerData,
        contacts: contactsData
    }

    return home;
}
