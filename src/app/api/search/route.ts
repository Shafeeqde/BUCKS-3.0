
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import type { UserBusinessProfile, OverallProfessionalProfileData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase().trim() || '';

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    const searchResults: any[] = [];
    const limit = 5; // Limit results from each collection

    // To perform case-insensitive "contains" search, we check for a range.
    const endQuery = query.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));


    // --- Search Business Profiles ---
    const businessProfilesRef = db.collection('business_profiles');
    // Query by name
    const businessNameQuery = businessProfilesRef
      .where('name_lowercase', '>=', query)
      .where('name_lowercase', '<', endQuery)
      .limit(limit);
    
    // We can add more queries for other fields if needed, but Firestore is limited.
    // A single query cannot have range filters on different fields.
    // For a real-world app, a dedicated search service like Algolia or Elasticsearch is recommended.
    
    const [businessNameSnapshot] = await Promise.all([
        businessNameQuery.get(),
    ]);

    const foundIds = new Set<string>();

    businessNameSnapshot.forEach(doc => {
      if (!foundIds.has(doc.id)) {
          searchResults.push({ type: 'business', data: { id: doc.id, ...doc.data() } as UserBusinessProfile });
          foundIds.add(doc.id);
      }
    });

    // --- Search Professional Profiles ---
    const professionalProfilesRef = db.collection('professional_profiles');
     const professionalNameQuery = professionalProfilesRef
      .where('name_lowercase', '>=', query)
      .where('name_lowercase', '<', endQuery)
      .limit(limit);
      
    const [professionalNameSnapshot] = await Promise.all([
        professionalNameQuery.get()
    ]);

    professionalNameSnapshot.forEach(doc => {
        if (!foundIds.has(doc.id)) {
            searchResults.push({ type: 'individual', data: { id: doc.id, ...doc.data() } as OverallProfessionalProfileData });
            foundIds.add(doc.id);
        }
    });
    
    // Simple shuffle to mix results
    searchResults.sort(() => Math.random() - 0.5);

    return NextResponse.json(searchResults, { status: 200 });

  } catch (error) {
    console.error('Error in search API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to perform search.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
