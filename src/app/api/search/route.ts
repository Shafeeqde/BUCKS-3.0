
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import type { UserBusinessProfile, OverallProfessionalProfileData, UserVehicle } from '@/types';

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

    const limit = 5; // Limit results from each collection
    const endQuery = query.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));

    // --- Search Promises ---
    const businessPromise = db.collection('business_profiles')
      .where('name_lowercase', '>=', query)
      .where('name_lowercase', '<', endQuery)
      .limit(limit)
      .get();

    const professionalPromise = db.collection('professional_profiles')
      .where('name_lowercase', '>=', query)
      .where('name_lowercase', '<', endQuery)
      .limit(limit)
      .get();
      
    const vehiclePromise = db.collection('vehicles')
        .where('licensePlate_lowercase', '>=', query)
        .where('licensePlate_lowercase', '<', endQuery)
        .limit(limit)
        .get();

    // --- Execute Searches in Parallel ---
    const [
        businessSnapshot, 
        professionalSnapshot,
        vehicleSnapshot
    ] = await Promise.all([
        businessPromise, 
        professionalPromise,
        vehiclePromise
    ]);

    const searchResults: any[] = [];
    const foundIds = new Set<string>(); // To prevent duplicates if we search more fields later

    businessSnapshot.forEach(doc => {
      if (!foundIds.has(doc.id)) {
          searchResults.push({ type: 'business', data: { id: doc.id, ...doc.data() } as UserBusinessProfile });
          foundIds.add(doc.id);
      }
    });

    professionalSnapshot.forEach(doc => {
        if (!foundIds.has(doc.id)) {
            searchResults.push({ type: 'individual', data: { id: doc.id, ...doc.data() } as OverallProfessionalProfileData });
            foundIds.add(doc.id);
        }
    });
    
    vehicleSnapshot.forEach(doc => {
        if (!foundIds.has(doc.id)) {
            const vehicleData = { id: doc.id, ...doc.data() } as UserVehicle;
            // Add a user-friendly name for display
            const displayName = `${vehicleData.vehicleType} - ${vehicleData.licensePlate}`;
            searchResults.push({ type: 'vehicle', data: { ...vehicleData, name: displayName } });
            foundIds.add(doc.id);
        }
    });
    
    // Simple shuffle to mix results for better presentation
    searchResults.sort(() => Math.random() - 0.5);

    return NextResponse.json(searchResults, { status: 200 });

  } catch (error) {
    console.error('Error in search API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to perform search.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
