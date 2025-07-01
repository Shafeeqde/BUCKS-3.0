import { NextRequest, NextResponse } from 'next/server';
import type { PublicProfileData } from '@/types';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  const { profileId } = params;

  try {
    // Fetch the profile from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();
    
    if (error) {
      console.error('Error fetching profile from Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile data' }, 
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Profile not found' }, 
        { status: 404 }
      );
    }

    // Fetch posts for this profile
    const { data: posts, error: postsError } = await supabase
      .from('profile_posts')
      .select('*')
      .eq('profileId', profileId)
      .order('timestamp', { ascending: false });
    
    if (postsError) {
      console.error('Error fetching profile posts:', postsError);
      // Continue with empty posts array
    }

    // Map the data to match the PublicProfileData type
    const profileData: PublicProfileData = {
      id: data.id,
      name: data.name,
      username: data.username,
      avatarUrl: data.avatarUrl,
      avatarAiHint: data.avatarAiHint,
      bio: data.bio,
      location: data.location,
      website: data.website,
      email: data.email,
      isVerified: data.isVerified || false,
      followers: data.followers || 0,
      following: data.following || 0,
      posts: posts || [],
      socialLinks: data.socialLinks || []
    };
    
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error in personal profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
