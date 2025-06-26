
import 'server-only';
import admin from 'firebase-admin';

let db: admin.firestore.Firestore | undefined = undefined;
let storage: admin.storage.Storage | undefined = undefined;

if (!admin.apps.length) {
  console.log("Attempting to initialize Firebase Admin SDK...");

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  const hasProjectId = !!projectId;
  const hasClientEmail = !!clientEmail;
  const hasPrivateKey = !!privateKey;
  const hasStorageBucket = !!storageBucket;

  console.log(`- FIREBASE_PROJECT_ID: ${hasProjectId ? 'Found' : 'MISSING!'}`);
  console.log(`- FIREBASE_CLIENT_EMAIL: ${hasClientEmail ? 'Found' : 'MISSING!'}`);
  console.log(`- FIREBASE_PRIVATE_KEY: ${hasPrivateKey ? 'Found' : 'MISSING!'}`);
  console.log(`- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${hasStorageBucket ? 'Found' : 'MISSING!'}`);

  if (hasProjectId && hasClientEmail && hasPrivateKey && hasStorageBucket) {
    try {
      privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

      const serviceAccount = {
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        storageBucket: storageBucket,
      });

      console.log('Firebase Admin SDK initialized successfully.');
      db = admin.firestore();
      storage = admin.storage();

    } catch (error: any) {
      console.error('\n--- FIREBASE ADMIN INITIALIZATION FAILED ---');
      console.error(error.message);
      db = undefined;
      storage = undefined;
    }
  } else {
    console.warn('\nFirebase Admin SDK not initialized because one or more required environment variables are missing.');
    db = undefined;
    storage = undefined;
  }
} else {
  db = admin.firestore();
  storage = admin.storage();
}

export { db, storage };
