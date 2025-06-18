
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin'; // Adjust path if necessary

export async function POST(request: NextRequest) {
  try {
    // Check if db is initialized
    if (!db) {
        console.error('Firebase Admin SDK not initialized or Firestore unavailable. Cannot save profile.');
        return NextResponse.json({ error: 'Server configuration error: Database service not available.' }, { status: 500 });
    }

    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const userId = 'test-user-id'; 
    
    const profileRef = db.collection('profiles').doc(userId);

    await profileRef.set({
      name,
      email,
      phone: phone || null, 
      updatedAt: new Date().toISOString(),
    }, { merge: true }); 

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
    