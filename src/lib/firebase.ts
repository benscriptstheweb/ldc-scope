import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB5UXjfm3J9V54PWbNU5F6S8VdmVccY3z0",
    authDomain: "ldc-scope.firebaseapp.com",
    projectId: "ldc-scope",
    storageBucket: "ldc-scope.firebasestorage.app",
    messagingSenderId: "922729461059",
    appId: "1:922729461059:web:e2699d8247f497daedabf6"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
