
import 'server-only';
import admin from 'firebase-admin';

let db: admin.firestore.Firestore | undefined = undefined;

if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
      db = admin.firestore(); // Assign db only after successful initialization
    } else {
      console.warn('Firebase Admin SDK credentials are not fully configured. Skipping initialization. Firestore `db` will be undefined.');
      if (!serviceAccount.projectId) console.warn(' - FIREBASE_PROJECT_ID is missing or empty.');
      if (!serviceAccount.clientEmail) console.warn(' - FIREBASE_CLIENT_EMAIL is missing or empty.');
      if (!serviceAccount.privateKey) console.warn(' - FIREBASE_PRIVATE_KEY is missing, empty, or invalid after processing.');
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    if (error.code) console.error('Error code:', error.code);
    console.warn('Firestore `db` will be undefined due to initialization error.');
  }
} else {
  // App is already initialized
  db = admin.firestore();
  console.log('Firebase Admin SDK already initialized. Using existing app.');
}

export { db };
    