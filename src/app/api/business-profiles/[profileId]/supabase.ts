import { supabase } from '@/lib/supabaseClient';
import type { NextRequest } from 'next/server';
import type { UserBusinessProfile } from '@/types';

function mapProfile(row: any): UserBusinessProfile {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    name_lowercase: row.name_lowercase,
    logo: row.logo,
    logoAiHint: row.logo_ai_hint,
    coverPhoto: row.cover_photo,
    coverPhotoAiHint: row.cover_photo_ai_hint,
    bio: row.bio,
    businessType: row.business_type,
    website: row.website,
    phone: row.phone,
    email: row.email,
    location: row.location,
    specialties: row.specialties,
    followers: row.followers,
    following: row.following,
    averageRating: row.average_rating,
    totalReviews: row.total_reviews,
    isActive: row.is_active,
    licenseNumber: row.license_number,
    documentUrl: row.document_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/business-profiles/[profileId] (Supabase version)
export async function GET(request: NextRequest, { params }: { params: { profileId: string } }) {
  const { profileId } = params;
  if (!profileId) {
    return new Response(JSON.stringify({ error: 'Profile ID is required' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('user_business_profiles')
    .select('*')
    .eq('id', profileId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') {
      return new Response(JSON.stringify({ error: 'Business profile not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(mapProfile(data)), { status: 200 });
}

// PUT /api/business-profiles/[profileId] (Supabase version)
export async function PUT(request: NextRequest, { params }: { params: { profileId: string } }) {
  const { profileId } = params;
  if (!profileId) {
    return new Response(JSON.stringify({ error: 'Profile ID is required' }), { status: 400 });
  }
  const body = await request.json();
  const { id, ...updateData } = body as Partial<UserBusinessProfile> & { name_lowercase?: string };
  if (Object.keys(updateData).length === 0) {
    return new Response(JSON.stringify({ error: 'No update data provided' }), { status: 400 });
  }
  if (updateData.name) {
    updateData.name_lowercase = updateData.name.toLowerCase();
  }
  const { error } = await supabase
    .from('user_business_profiles')
    .update(updateData)
    .eq('id', profileId);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ message: 'Business profile updated successfully', id: profileId }), { status: 200 });
}

// DELETE /api/business-profiles/[profileId] (Supabase version)
export async function DELETE(request: NextRequest, { params }: { params: { profileId: string } }) {
  const { profileId } = params;
  if (!profileId) {
    return new Response(JSON.stringify({ error: 'Profile ID is required' }), { status: 400 });
  }
  const { error } = await supabase
    .from('user_business_profiles')
    .delete()
    .eq('id', profileId);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ message: 'Business profile deleted successfully' }), { status: 200 });
}
