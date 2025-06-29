import { supabase } from '@/lib/supabaseClient';
import type { NextRequest } from 'next/server';
import type { OverallProfessionalProfileData } from '@/types';

function mapProfile(row: any): OverallProfessionalProfileData {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    name_lowercase: row.name_lowercase,
    professionalTitle: row.professional_title,
    avatarUrl: row.avatar_url,
    avatarAiHint: row.avatar_ai_hint,
    coverPhotoUrl: row.cover_photo_url,
    coverPhotoAiHint: row.cover_photo_ai_hint,
    professionalBio: row.professional_bio,
    areasOfExpertise: row.areas_of_expertise || [],
    externalProfileLinks: row.external_profile_links || [],
    workExperience: row.work_experience || [],
    education: row.education || [],
    licensesCertifications: row.licenses_certifications || [],
  };
}

// GET /api/professional-profile/[userId] (Supabase version)
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('professional_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return new Response(JSON.stringify({ error: 'Professional profile not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(mapProfile(data)), { status: 200 });
}

// PUT /api/professional-profile/[userId] (Supabase version)
export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
  }
  const body = await request.json();
  const { id, userId: bodyUserId, ...updateData } = body as Partial<OverallProfessionalProfileData> & { name_lowercase?: string };
  if (Object.keys(updateData).length === 0) {
    return new Response(JSON.stringify({ error: 'No update data provided' }), { status: 400 });
  }
  if (updateData.name) {
    updateData.name_lowercase = updateData.name.toLowerCase();
  }
  const { data, error } = await supabase
    .from('professional_profiles')
    .upsert([
      { user_id: userId, ...updateData },
    ], { onConflict: 'user_id' })
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(mapProfile(data)), { status: 200 });
}
