
import 'server-only';
import admin from 'firebase-admin';

let db: admin.firestore.Firestore | undefined = undefined;

if (!admin.apps.length) {
  console.log("Attempting to initialize Firebase Admin SDK...");

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const hasProjectId = !!projectId;
  const hasClientEmail = !!clientEmail;
  const hasPrivateKey = !!privateKey;

  console.log(`- FIREBASE_PROJECT_ID: ${hasProjectId ? 'Found' : 'MISSING!'}`);
  console.log(`- FIREBASE_CLIENT_EMAIL: ${hasClientEmail ? 'Found' : 'MISSING!'}`);
  console.log(`- FIREBASE_PRIVATE_KEY: ${hasPrivateKey ? 'Found' : 'MISSING!'}`);

  if (hasProjectId && hasClientEmail && hasPrivateKey) {
    try {
      // The private key from the .env file might be wrapped in quotes, which we need to remove.
      // It also contains literal "\\n" strings that need to be replaced with actual newline characters.
      privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

      const serviceAccount = {
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });

      console.log('Firebase Admin SDK initialized successfully.');
      db = admin.firestore();

    } catch (error: any) {
      console.error('\n--- FIREBASE ADMIN INITIALIZATION FAILED ---');
      console.error('This usually means the FIREBASE_PRIVATE_KEY in your .env file is not formatted correctly.');
      console.error('Please ensure it is a single line, wrapped in double quotes, with "\\n" for newlines.');
      console.error('Example: FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_KEY_HERE\\n-----END PRIVATE KEY-----\\n"');
      console.error('\nOriginal Error:', error.message);
      db = undefined;
    }
  } else {
    console.warn('\nFirebase Admin SDK not initialized because one or more required environment variables are missing.');
    db = undefined;
  }
} else {
  db = admin.firestore();
}

export { db };
