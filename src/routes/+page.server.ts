import { adminDb } from "$lib/firebase/admin";
import type { PageServerLoad } from "./homes/[id]/$types";

export const load: PageServerLoad = async () => {
    const homesSnapshot = await adminDb.collection('homes').get();

    const homes = await Promise.all(homesSnapshot.docs.map(async (homeDoc) => {
        const contactsFromHome = homeDoc.ref.collection('contacts')
        const primaryContactsList = contactsFromHome.where('isPrimary', '==', true);
        const primaryContactsDocs = await primaryContactsList.get();

        const primaryContact = primaryContactsDocs.docs.map(contactDoc => contactDoc.data().name);

        return {
            id: homeDoc.id,
            address1: homeDoc.data().address1,
            address2: homeDoc.data().address2,
            city: homeDoc.data().city,
            state: homeDoc.data().state,
            zip: homeDoc.data().zip,
            primaryContact
        };
    }));

    return { homes };
}
