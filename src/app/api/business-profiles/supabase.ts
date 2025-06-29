import { supabase } from '@/lib/supabaseClient';
import type { NextRequest, NextResponse } from 'next/server';
import type { UserBusinessProfile } from '@/types';

// Helper: Map DB row to UserBusinessProfile (add more fields as needed)
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
    // feed, products, services, jobs, reviews: fetch separately if needed
  };
}

// POST /api/business-profiles (Supabase version)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, bio, userId, ...otherData } = body as Partial<UserBusinessProfile>;

  if (!name || !bio) {
    return new Response(JSON.stringify({ error: 'Name and Bio are required' }), { status: 400 });
  }
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required to create a business profile' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('user_business_profiles')
    .insert([
      {
        user_id: userId,
        name,
        name_lowercase: name.toLowerCase(),
        bio,
        logo: otherData.logo || '',
        logo_ai_hint: otherData.logoAiHint || '',
        cover_photo: otherData.coverPhoto || '',
        cover_photo_ai_hint: otherData.coverPhotoAiHint || '',
        website: otherData.website || '',
        phone: otherData.phone || '',
        email: otherData.email || '',
        location: otherData.location || '',
        specialties: otherData.specialties || [],
        followers: otherData.followers || 0,
        following: otherData.following || 0,
        average_rating: otherData.averageRating || 0,
        total_reviews: otherData.totalReviews || 0,
        is_active: otherData.isActive === undefined ? true : otherData.isActive,
        license_number: otherData.licenseNumber || '',
        document_url: otherData.documentUrl || '',
      },
    ])
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(mapProfile(data)), { status: 201 });
}

// GET /api/business-profiles (Supabase version)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID query parameter is required' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('user_business_profiles')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data.map(mapProfile)), { status: 200 });
}
