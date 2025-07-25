import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { dev } from '$app/environment';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;
if (!getApps().length) {
    app = initializeApp({
        credential:
            dev
                ? cert("./google-services.json")
                : cert({
                    projectId: process.env.PROJECT_ID,
                    clientEmail: process.env.CLIENT_EMAIL,
                    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
                })
    });
} else {
    app = getApps()[0];
}

export const adminAuth = getAuth();
export const adminDb = getFirestore(app);
