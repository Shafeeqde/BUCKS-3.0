import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';
import type { UserVehicle } from '@/types';

export async function updateVehicle(vehicleId: string, updateData: Partial<UserVehicle>) {
  if (!vehicleId) {
    return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
  }
  if (updateData.licensePlate) {
    updateData.licensePlate_lowercase = updateData.licensePlate.toLowerCase();
  }
  const { data, error } = await supabase
    .from('vehicles')
    .update(updateData)
    .eq('id', vehicleId)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function deleteVehicle(vehicleId: string) {
  if (!vehicleId) {
    return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
  }
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicleId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Vehicle deleted successfully' }, { status: 200 });
}
