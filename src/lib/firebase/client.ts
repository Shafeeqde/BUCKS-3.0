
'use client';

import { initializeApp, getApps, getApp, type FirebaseOptions, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// A function to initialize the Firebase app, but only on the client side.
function initializeClientApp() {
  // If we're on the server, don't initialize, as window is not available.
  if (typeof window === 'undefined') {
    return null;
  }

  // If the app is already initialized, return it.
  if (getApps().length > 0) {
    return getApp();
  }

  // If the API key is missing, log a warning and don't initialize.
  if (!firebaseConfig.apiKey) {
    console.error("Firebase API key is missing. Please check your environment variables (NEXT_PUBLIC_FIREBASE_API_KEY).");
    return null;
  }

  // Initialize the app.
  return initializeApp(firebaseConfig);
}

// Get the app instance. This will be null on the server.
const app = initializeClientApp();

// Get the auth instance. This will be a dummy object on the server to prevent crashes on import.
// On the client, it will be the real auth instance.
const auth = app ? getAuth(app) : ({} as Auth);

export { app, auth };
