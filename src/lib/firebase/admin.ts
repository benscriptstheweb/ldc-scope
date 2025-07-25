import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { dev } from '$app/environment';

if (!getApps().length) {
    initializeApp({
        credential:
            dev
                ? cert("./google-services.json")
                : cert({
                    projectId: process.env.PROJECT_ID,
                    clientEmail: process.env.CLIENT_EMAIL,
                    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
                })
    });
}

export const adminAuth = getAuth();
