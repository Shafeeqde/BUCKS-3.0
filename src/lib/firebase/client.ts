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

// Initialize Firebase App
let app: FirebaseApp;
if (getApps().length === 0) {
  if (!firebaseConfig.apiKey) {
    console.error("Firebase API key is missing. Please check your NEXT_PUBLIC_FIREBASE_API_KEY environment variable.");
    // Assign a dummy app object to prevent crashes, auth will also be a dummy object.
    app = {} as FirebaseApp; 
  } else {
    app = initializeApp(firebaseConfig);
  }
} else {
  app = getApp();
}

// Initialize and export Firebase services
// We check if the app object is valid before trying to get Auth from it.
// If it's a dummy object, auth will be a dummy object too.
const auth: Auth = app.name ? getAuth(app) : {} as Auth;

export { app, auth };
