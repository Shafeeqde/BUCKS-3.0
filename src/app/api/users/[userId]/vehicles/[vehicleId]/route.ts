import { type NextRequest } from 'next/server';
import { updateVehicle, deleteVehicle } from './supabase';
import type { UserVehicle } from '@/types';

// PUT /api/users/[userId]/vehicles/[vehicleId] - Update a specific vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; vehicleId: string }> }
) {
  const { vehicleId } = await params;
  try {
    const body = await request.json();
    // Exclude IDs to prevent modification
    const { id, userId: bodyUserId, ...updateData } = body as Partial<UserVehicle> & { licensePlate_lowercase?: string };
    return await updateVehicle(vehicleId, updateData);
  } catch (error) {
    let errorMessage = 'Failed to update vehicle.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/users/[userId]/vehicles/[vehicleId] - Delete a specific vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; vehicleId: string }> }
) {
  const { vehicleId } = await params;
  try {
    return await deleteVehicle(vehicleId);
  } catch (error) {
    let errorMessage = 'Failed to delete vehicle.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
