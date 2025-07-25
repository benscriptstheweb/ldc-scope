// go to firestore users and match the current authenticated user from auth 
// via email.

import { getDocs, collection } from "firebase/firestore";
import { db } from "$lib/firebase/client";

const homesFBCollection = collection(db, 'homes');

export const getHomes = async () => {
    const homesFBData = await getDocs(homesFBCollection);

    let homes = homesFBData.docs.map((e) => {
        return {
            address1: e.data().address1,
            address2: e.data().address2,
            city: e.data().city,
            state: e.data().state,
            zip: e.data().zip,
            amenities: e.data().amenities,
            allowsPets: e.data().allowsPets,
            hostName: e.data().hostName,
            hasVolunteer: e.data().hasVolunteer
        };
    });

    return homes;
}
