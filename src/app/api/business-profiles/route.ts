
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import type { UserBusinessProfile } from '@/types';

const PROFILES_COLLECTION = 'business_profiles';

// POST /api/business-profiles - Create a new business profile
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      console.error('Firebase Admin SDK not initialized, or Firestore is unavailable. Cannot create profile.');
      return NextResponse.json({ error: 'Server configuration error: Database service not available.' }, { status: 500 });
    }

    const body = await request.json();
    const { name, bio, ...otherData } = body as Partial<UserBusinessProfile>;

    if (!name || !bio) {
      return NextResponse.json({ error: 'Name and Bio are required' }, { status: 400 });
    }

    const newProfileData: Omit<UserBusinessProfile, 'id'> = {
      name,
      bio,
      name_lowercase: name.toLowerCase(),
      logo: otherData.logo || '',
      logoAiHint: otherData.logoAiHint || '',
      coverPhoto: otherData.coverPhoto || '',
      coverPhotoAiHint: otherData.coverPhotoAiHint || '',
      website: otherData.website || '',
      phone: otherData.phone || '',
      email: otherData.email || '',
      location: otherData.location || '',
      specialties: otherData.specialties || [],
      followers: otherData.followers || 0,
      following: otherData.following || 0,
      feed: otherData.feed || [],
      products: otherData.products || [],
      services: otherData.services || [],
      jobs: otherData.jobs || [],
      reviews: otherData.reviews || [],
      averageRating: otherData.averageRating || 0,
      totalReviews: otherData.totalReviews || 0,
      isActive: otherData.isActive === undefined ? true : otherData.isActive,
      licenseNumber: otherData.licenseNumber || '',
      documentUrl: otherData.documentUrl || '',
    };

    const docRef = await db.collection(PROFILES_COLLECTION).add(newProfileData);
    const newProfile = { id: docRef.id, ...newProfileData };

    console.log(`New business profile created with ID: ${docRef.id}`);
    return NextResponse.json(newProfile, { status: 201 });

  } catch (error) {
    console.error('Error creating business profile:', error);
    let errorMessage = 'Failed to create business profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET /api/business-profiles - List all business profiles
export async function GET() {
  try {
    if (!db) {
      console.error('Firebase Admin SDK not initialized, or Firestore is unavailable. Cannot list profiles.');
      return NextResponse.json({ error: 'Server configuration error: Database service not available.' }, { status: 500 });
    }

    const snapshot = await db.collection(PROFILES_COLLECTION).get();
    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const profiles: UserBusinessProfile[] = [];
    snapshot.forEach(doc => {
      profiles.push({ id: doc.id, ...doc.data() } as UserBusinessProfile);
    });

    return NextResponse.json(profiles, { status: 200 });

  } catch (error) {
    console.error('Error fetching business profiles:', error);
    let errorMessage = 'Failed to fetch business profiles.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
