
import 'server-only';
import admin from 'firebase-admin';

// Ensure this path is correct if your service account key is elsewhere.
// You can also load it from environment variables as shown below.

const serviceAccountKey = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  try {
    if (serviceAccountKey.projectId && serviceAccountKey.clientEmail && serviceAccountKey.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
      });
      console.log('Firebase Admin SDK initialized.');
    } else {
      console.warn('Firebase Admin SDK credentials are not fully configured. Skipping initialization.');
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const db = admin.firestore();
// export const authAdmin = admin.auth(); // For Firebase Authentication admin tasks
