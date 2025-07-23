// go to firestore users and match the current authenticated user from auth 
// via email.

import { getDocs, collection } from "firebase/firestore";
import { db } from "$lib/firebase/client";
import type { User } from "firebase/auth";

const userCollection = collection(db, 'users');

export const getUsers = async () => {
    const userData = await getDocs(userCollection);

    let users = userData.docs.map((e) => {
        return {
            isAdmin: e.data().isAdmin,
            isAgent: e.data().isAgent,
            assignedRegion: e.data().assignedRegion,
            name: `${e.data().lastName}, ${e.data().firstName}`,
            email: e.data().email,
        };
    });

    return users;
}

export const getSignedInUser = async (user: User | null) => {
    const users = await getUsers();
    const signedInPublisher = users.filter((e) => e.email === user?.email)[0];
    return signedInPublisher;
};
