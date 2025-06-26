
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import type { SkillsetProfileData } from '@/types';

const COLLECTION_NAME = 'skillset_profiles';

// GET a specific skillset profile
export async function GET(request: NextRequest, context: { params: { profileId: string } }) {
    const { profileId } = context.params;
    try {
        if (!profileId) {
            return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
        }

        if (!db) {
            return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
        }

        const docRef = db.collection(COLLECTION_NAME).doc(profileId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: 'Skillset profile not found' }, { status: 404 });
        }
        
        const profile = { id: docSnap.id, ...docSnap.data() } as SkillsetProfileData;
        return NextResponse.json(profile, { status: 200 });

    } catch (error) {
        console.error(`Error fetching skillset profile ${profileId}:`, error);
        return NextResponse.json({ error: 'Failed to fetch skillset profile.' }, { status: 500 });
    }
}


// PUT /api/skillset-profiles/[profileId] - Update a specific profile
export async function PUT(request: NextRequest, context: { params: { profileId: string } }) {
  const { profileId } = context.params;
  try {
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }

    const body = await request.json();
    
    const { id, ...updateData } = body;

    const docRef = db.collection(COLLECTION_NAME).doc(profileId);
    await docRef.set(updateData, { merge: true });

    console.log(`Skillset profile updated for ID: ${profileId}`);
    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Error updating skillset profile ${profileId}:`, error);
    let errorMessage = 'Failed to update skillset profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/skillset-profiles/[profileId] - Delete a specific profile
export async function DELETE(request: NextRequest, context: { params: { profileId: string } }) {
  const { profileId } = context.params;
  try {
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }
    
    await db.collection(COLLECTION_NAME).doc(profileId).delete();

    console.log(`Skillset profile deleted for ID: ${profileId}`);
    return NextResponse.json({ message: 'Profile deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting skillset profile ${profileId}:`, error);
    let errorMessage = 'Failed to delete skillset profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
