
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import type { OverallProfessionalProfileData } from '@/types';

const PROFILES_COLLECTION = 'professional_profiles';

// GET /api/professional-profile/[userId] - Fetch a specific professional profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!db) {
      console.error('Firebase Admin SDK not initialized or Firestore unavailable. Cannot access Firestore.');
      return NextResponse.json({ error: 'Server configuration error, unable to fetch profile.' }, { status: 500 });
    }

    const docRef = db.collection(PROFILES_COLLECTION).doc(userId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Professional profile not found' }, { status: 404 });
    }

    const profile = { id: docSnap.id, ...docSnap.data() } as OverallProfessionalProfileData;
    return NextResponse.json(profile, { status: 200 });

  } catch (error) {
    console.error(`Error fetching professional profile for user ${userId}:`, error);
    let errorMessage = 'Failed to fetch professional profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT /api/professional-profile/[userId] - Create or update a specific professional profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    if (!db) {
      console.error('Firebase Admin SDK not initialized or Firestore unavailable. Cannot access Firestore.');
      return NextResponse.json({ error: 'Server configuration error, unable to update profile.' }, { status: 500 });
    }

    const body = await request.json();
    const { id, userId: bodyUserId, ...updateData } = body as Partial<OverallProfessionalProfileData> & { name_lowercase?: string };

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }

    if (updateData.name) {
      updateData.name_lowercase = updateData.name.toLowerCase();
    }
    
    const docRef = db.collection(PROFILES_COLLECTION).doc(userId);
    
    await docRef.set(updateData, { merge: true });

    console.log(`Professional profile created/updated for user ID: ${userId}`);

    const updatedDocSnap = await docRef.get();
    const updatedProfile = { id: updatedDocSnap.id, ...updatedDocSnap.data() };

    return NextResponse.json(updatedProfile, { status: 200 });

  } catch (error) {
    console.error(`Error updating professional profile for user ${userId}:`, error);
    let errorMessage = 'Failed to update professional profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
