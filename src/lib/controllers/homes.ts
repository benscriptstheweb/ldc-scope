// go to firestore users and match the current authenticated user from auth 
// via email.

import { getDocs, collection } from "firebase/firestore";
import { db } from "$lib/firebase/client";

const homesFBCollection = collection(db, 'homes');

export const getHomes = async () => {
    const homesFBData = await getDocs(homesFBCollection);

    let homes = homesFBData.docs.map((doc) => {
        return {
            id: doc.id,
            address1: doc.data().address1,
            address2: doc.data().address2,
            city: doc.data().city,
            state: doc.data().state,
            zip: doc.data().zip,
            hostName: doc.data().hostName,
        };
    });

    return homes;
}
