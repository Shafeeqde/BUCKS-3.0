
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
        credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } else {
      console.warn('Firebase Admin SDK credentials are not fully configured. Skipping initialization. Please check your .env file:');
      if (!serviceAccountKey.projectId) {
        console.warn('- FIREBASE_PROJECT_ID is missing.');
      }
      if (!serviceAccountKey.clientEmail) {
        console.warn('- FIREBASE_CLIENT_EMAIL is missing.');
      }
      if (!serviceAccountKey.privateKey) {
        // This condition might be true if FIREBASE_PRIVATE_KEY is missing OR if it's present but becomes empty after the .replace() (e.g. if it was just "\\n")
        console.warn('- FIREBASE_PRIVATE_KEY is missing or invalid after processing.');
      }
      console.warn('Ensure your .env file is at the project root and you have restarted your development server after changes.');
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    console.error('Stack trace:', error.stack);
    // For more detailed debugging of the private key, you could log parts of it, but be cautious with sensitive info.
    // e.g., console.error('Private key (first 10 chars for check):', serviceAccountKey.privateKey?.substring(0, 10));
  }
}

export const db = admin.firestore();
// export const authAdmin = admin.auth(); // For Firebase Authentication admin tasks

