import { supabase } from '@/lib/supabaseClient';
import type { NextRequest } from 'next/server';
import type { UserVehicle } from '@/types';

function mapVehicle(row: any): UserVehicle {
  return {
    id: row.id,
    userId: row.user_id,
    vehicleType: row.vehicle_type,
    licensePlate: row.license_plate,
    licensePlate_lowercase: row.license_plate_lowercase,
    isActive: row.is_active,
    listingMode: row.listing_mode,
  };
}

// POST /api/users/[userId]/vehicles (Supabase version)
export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const body = await request.json();
  const { vehicleType, licensePlate, listingMode } = body;
  if (!userId || !vehicleType || !licensePlate || !listingMode) {
    return new Response(JSON.stringify({ error: 'User ID, vehicle type, license plate, and listing mode are required.' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('user_vehicles')
    .insert([
      {
        user_id: userId,
        vehicle_type: vehicleType,
        license_plate: licensePlate,
        license_plate_lowercase: licensePlate.toLowerCase(),
        is_active: false,
        listing_mode: listingMode,
      },
    ])
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(mapVehicle(data)), { status: 201 });
}

// GET /api/users/[userId]/vehicles (Supabase version)
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('user_vehicles')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data.map(mapVehicle)), { status: 200 });
}
