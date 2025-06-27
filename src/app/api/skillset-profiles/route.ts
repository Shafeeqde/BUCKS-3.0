
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import type { SkillsetProfileData, SkillsetProfileSummary } from '@/types';

const COLLECTION_NAME = 'skillset_profiles';

// POST /api/skillset-profiles - Create a new skillset profile
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }

    const body = await request.json();
    const { skillName, userId, userName, userAvatarUrl, userAvatarAiHint } = body; 

    if (!skillName || !userId || !userName) {
      return NextResponse.json({ error: 'Skill name, user ID, and user name are required' }, { status: 400 });
    }

    const newProfileData: Omit<SkillsetProfileData, 'id'> = {
      // Default values for a new profile
      skillName,
      userId, 
      userName,
      userAvatarUrl,
      userAvatarAiHint,
      skillLevel: 'Beginner',
      skillDescription: '',
      isActive: false, // Start as inactive
      workExperienceEntries: [],
      portfolioItems: [],
      professionalFeed: [],
      reviews: [],
      recommendationsCount: 0,
      averageRating: 0,
      totalReviews: 0,
    };

    const docRef = await db.collection(COLLECTION_NAME).add(newProfileData);
    const newProfileSummary: SkillsetProfileSummary = {
        id: docRef.id,
        skillName: newProfileData.skillName,
        skillLevel: newProfileData.skillLevel,
        isActive: newProfileData.isActive ?? false,
        portfolioItemCount: 0,
        averageRating: 0,
    };

    console.log(`New skillset profile created with ID: ${docRef.id}`);
    return NextResponse.json(newProfileSummary, { status: 201 });

  } catch (error) {
    console.error('Error creating skillset profile:', error);
    let errorMessage = 'Failed to create skillset profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


// GET /api/skillset-profiles?userId=... - List all skillset profiles for a user
export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID query parameter is required' }, { status: 400 });
    }

    const snapshot = await db.collection(COLLECTION_NAME).where('userId', '==', userId).get();
    
    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const profiles: SkillsetProfileSummary[] = [];
    snapshot.forEach(doc => {
      const data = doc.data() as SkillsetProfileData;
      profiles.push({
        id: doc.id,
        skillName: data.skillName,
        skillLevel: data.skillLevel,
        isActive: data.isActive || false,
        portfolioItemCount: data.portfolioItems?.length || 0,
        averageRating: data.averageRating || 0,
      });
    });

    return NextResponse.json(profiles, { status: 200 });

  } catch (error) {
    console.error('Error fetching skillset profiles:', error);
    let errorMessage = 'Failed to fetch skillset profiles.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
