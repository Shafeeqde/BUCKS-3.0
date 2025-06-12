
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin'; // Adjust path if necessary

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    // For demonstration, using a hardcoded user ID.
    // In a real app, you'd get the userId from an authenticated session.
    const userId = 'test-user-id'; 

    // Check if Firebase Admin SDK was initialized
    if (!db.app) {
        console.error('Firebase Admin SDK not initialized. Cannot access Firestore.');
        return NextResponse.json({ error: 'Server configuration error, unable to save profile.' }, { status: 500 });
    }
    
    const profileRef = db.collection('profiles').doc(userId);

    await profileRef.set({
      name,
      email,
      phone: phone || null, // Store phone as null if not provided
      updatedAt: new Date().toISOString(),
    }, { merge: true }); // Use merge: true to update if exists, or create if not

    console.log(`Profile for user ${userId} saved/updated:`, { name, email, phone });
    return NextResponse.json({ message: 'Profile saved successfully', userId }, { status: 200 });

  } catch (error) {
    console.error('Error saving profile:', error);
    let errorMessage = 'Failed to save profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
