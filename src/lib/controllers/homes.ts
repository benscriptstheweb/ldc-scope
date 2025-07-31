import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "$lib/firebase/client";

const homesFBCollection = collection(db, 'homes');

export const getHomes = async () => {
    const homesFBData = await getDocs(homesFBCollection);

    let homes = await Promise.all(homesFBData.docs.map(async (doc) => {
        const primaryContactQuery = query(
            collection(doc.ref, 'contacts'),
            where("isPrimary", '==', true)
        );
        const contactsDocs = await getDocs(primaryContactQuery);
        const primaryContact = contactsDocs.docs.map(doc => doc.data().name);

        return {
            id: doc.id,
            address1: doc.data().address1,
            address2: doc.data().address2,
            city: doc.data().city,
            state: doc.data().state,
            zip: doc.data().zip,
            hostName: doc.data().hostName,
            primaryContact: primaryContact
        };
    }));

    return homes;
}
