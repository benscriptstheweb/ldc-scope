import { getDocs, collection } from "firebase/firestore";
import { db } from "$lib/firebase/client";

const homesFBCollection = collection(db, 'homes');

export const getHomes = async () => {
    const homesFBData = await getDocs(homesFBCollection);

    let homes = await Promise.all(homesFBData.docs.map(async (doc) => {

        const contactsCollection = collection(doc.ref, 'contacts');
        const contactsSnapshot = await getDocs(contactsCollection);

        const contacts = contactsSnapshot.docs.map(contactDoc => ({
            id: contactDoc.id,
            name: contactDoc.data().name,
            email: contactDoc.data().email,
            phone: contactDoc.data().phone,
            isPrimary: contactDoc.data().isPrimary
        }));

        const primaryContact = contacts.filter(contact => contact.isPrimary);

        return {
            id: doc.id,
            address1: doc.data().address1,
            address2: doc.data().address2,
            city: doc.data().city,
            state: doc.data().state,
            zip: doc.data().zip,
            hostName: doc.data().hostName,
            primaryContact: primaryContact[0].name
        };
    }));

    return homes;
}
