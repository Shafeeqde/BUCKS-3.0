
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import type { UserBusinessProfile } from '@/types';

const PROFILES_COLLECTION = 'business_profiles';

interface RouteParams {
  params: {
    profileId: string;
  };
}

// GET /api/business-profiles/[profileId] - Fetch a specific business profile
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { profileId } = params;
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    if (!db) {
      console.error('Firebase Admin SDK not initialized or Firestore unavailable. Cannot access Firestore.');
      return NextResponse.json({ error: 'Server configuration error, unable to fetch profile.' }, { status: 500 });
    }

    const docRef = db.collection(PROFILES_COLLECTION).doc(profileId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
    }

    const profile = { id: docSnap.id, ...docSnap.data() } as UserBusinessProfile;
    return NextResponse.json(profile, { status: 200 });

  } catch (error) {
    console.error(`Error fetching business profile ${params.profileId}:`, error);
    let errorMessage = 'Failed to fetch business profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT /api/business-profiles/[profileId] - Update a specific business profile
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { profileId } = params;
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }
    
    if (!db) {
      console.error('Firebase Admin SDK not initialized or Firestore unavailable. Cannot access Firestore.');
      return NextResponse.json({ error: 'Server configuration error, unable to update profile.' }, { status: 500 });
    }

    const body = await request.json();
    const { id, ...updateData } = body as Partial<UserBusinessProfile>;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }
    
    const docRef = db.collection(PROFILES_COLLECTION).doc(profileId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
    }
    
    await docRef.update(updateData);

    console.log(`Business profile updated for ID: ${profileId}`);
    return NextResponse.json({ message: 'Business profile updated successfully', id: profileId }, { status: 200 });

  } catch (error) {
    console.error(`Error updating business profile ${params.profileId}:`, error);
    let errorMessage = 'Failed to update business profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/business-profiles/[profileId] - Delete a specific business profile
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { profileId } = params;
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    if (!db) {
      console.error('Firebase Admin SDK not initialized or Firestore unavailable. Cannot access Firestore.');
      return NextResponse.json({ error: 'Server configuration error, unable to delete profile.' }, { status: 500 });
    }

    const docRef = db.collection(PROFILES_COLLECTION).doc(profileId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
    }

    await docRef.delete();

    console.log(`Business profile deleted for ID: ${profileId}`);
    return NextResponse.json({ message: 'Business profile deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting business profile ${params.profileId}:`, error);
    let errorMessage = 'Failed to delete business profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
    
    