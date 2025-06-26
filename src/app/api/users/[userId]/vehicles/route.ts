
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import type { UserVehicle } from '@/types';

const VEHICLES_COLLECTION = 'vehicles';

// POST /api/users/[userId]/vehicles - Create a new vehicle for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  try {
    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }

    const body = await request.json();
    const { vehicleType, licensePlate, listingMode } = body;

    if (!userId || !vehicleType || !licensePlate || !listingMode) {
      return NextResponse.json({ error: 'User ID, vehicle type, license plate, and listing mode are required.' }, { status: 400 });
    }

    const newVehicleData: Omit<UserVehicle, 'id'> = {
      userId,
      vehicleType,
      licensePlate,
      listingMode,
      licensePlate_lowercase: licensePlate.toLowerCase(),
      isActive: false, // Always default to inactive
    };

    const docRef = await db.collection(VEHICLES_COLLECTION).add(newVehicleData);
    const newVehicle = { id: docRef.id, ...newVehicleData };
    
    return NextResponse.json(newVehicle, { status: 201 });

  } catch (error) {
    console.error('Error creating vehicle:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create vehicle.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


// GET /api/users/[userId]/vehicles - List all vehicles for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  try {
    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const snapshot = await db.collection(VEHICLES_COLLECTION)
                           .where('userId', '==', userId)
                           .get();
    
    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const vehicles: UserVehicle[] = [];
    snapshot.forEach(doc => {
      vehicles.push({ id: doc.id, ...doc.data() } as UserVehicle);
    });

    return NextResponse.json(vehicles, { status: 200 });

  } catch (error) {
    console.error('Error fetching vehicles:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch vehicles.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

    