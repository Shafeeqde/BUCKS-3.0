import { supabase } from '@/lib/supabaseClient';
import type { NextRequest } from 'next/server';
import type { UserBusinessProfile, OverallProfessionalProfileData, UserVehicle } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLowerCase().trim() || '';
  if (!query) {
    return new Response(JSON.stringify([]), { status: 200 });
  }
  const limit = 5;
  // Business Profiles
  const { data: businessData, error: businessError } = await supabase
    .from('user_business_profiles')
    .select('*')
    .ilike('name_lowercase', `${query}%`)
    .limit(limit);
  // Professional Profiles
  const { data: professionalData, error: professionalError } = await supabase
    .from('professional_profiles')
    .select('*')
    .ilike('name_lowercase', `${query}%`)
    .limit(limit);
  // Vehicles
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('user_vehicles')
    .select('*')
    .ilike('license_plate_lowercase', `${query}%`)
    .limit(limit);
  if (businessError || professionalError || vehicleError) {
    return new Response(JSON.stringify({ error: businessError?.message || professionalError?.message || vehicleError?.message }), { status: 500 });
  }
  const searchResults: any[] = [];
  const foundIds = new Set<string>();
  businessData?.forEach(row => {
    if (!foundIds.has(row.id)) {
      searchResults.push({ type: 'business', data: row as UserBusinessProfile });
      foundIds.add(row.id);
    }
  });
  professionalData?.forEach(row => {
    if (!foundIds.has(row.id)) {
      searchResults.push({ type: 'individual', data: row as OverallProfessionalProfileData });
      foundIds.add(row.id);
    }
  });
  vehicleData?.forEach(row => {
    if (!foundIds.has(row.id)) {
      const displayName = `${row.vehicle_type} - ${row.license_plate}`;
      searchResults.push({ type: 'vehicle', data: { ...row, name: displayName } as UserVehicle });
      foundIds.add(row.id);
    }
  });
  searchResults.sort(() => Math.random() - 0.5);
  return new Response(JSON.stringify(searchResults), { status: 200 });
}
