
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import type { UserVehicle } from '@/types';

const VEHICLES_COLLECTION = 'vehicles';

// PUT /api/users/[userId]/vehicles/[vehicleId] - Update a specific vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string; vehicleId: string } }
) {
  const { userId, vehicleId } = params;
  try {
    if (!userId || !vehicleId) {
      return NextResponse.json({ error: 'User ID and Vehicle ID are required' }, { status: 400 });
    }
    
    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }

    const body = await request.json();
    // Exclude IDs to prevent modification
    const { id, userId: bodyUserId, ...updateData } = body as Partial<UserVehicle>;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }
    
    const docRef = db.collection(VEHICLES_COLLECTION).doc(vehicleId);
    
    await docRef.update(updateData);

    console.log(`Vehicle updated for ID: ${vehicleId}`);

    const updatedDocSnap = await docRef.get();
    const updatedVehicle = { id: updatedDocSnap.id, ...updatedDocSnap.data() };

    return NextResponse.json(updatedVehicle, { status: 200 });

  } catch (error) {
    console.error(`Error updating vehicle ${vehicleId}:`, error);
    let errorMessage = 'Failed to update vehicle.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/users/[userId]/vehicles/[vehicleId] - Delete a specific vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; vehicleId: string } }
) {
  const { vehicleId } = params;
  try {
    if (!vehicleId) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Server configuration error: Database not available.' }, { status: 500 });
    }

    await db.collection(VEHICLES_COLLECTION).doc(vehicleId).delete();

    console.log(`Vehicle deleted for ID: ${vehicleId}`);
    return NextResponse.json({ message: 'Vehicle deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting vehicle ${vehicleId}:`, error);
    let errorMessage = 'Failed to delete vehicle.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
