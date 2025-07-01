import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const COLLECTION_NAME = 'skillset_profiles';

// GET a specific skillset profile
export async function GET(request: NextRequest, context: { params: Promise <{ profileId: string }> }) {
    const { profileId } = await context.params;
    try {
        if (!profileId) {
            return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
        }

        const { data: profile, error } = await supabase
    .from(COLLECTION_NAME)
    .select('*')
    .eq('id', profileId)
    .single();

if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
}

if (!profile) {
    return NextResponse.json({ error: 'Skillset profile not found' }, { status: 404 });
}

return NextResponse.json(profile, { status: 200 });

    } catch (error) {
        console.error(`Error fetching skillset profile ${profileId}:`, error);
        return NextResponse.json({ error: 'Failed to fetch skillset profile.' }, { status: 500 });
    }
}


// PUT /api/skillset-profiles/[profileId] - Update a specific profile
export async function PUT(request: NextRequest, context: { params:  Promise <{ profileId: string }> }) {
  const { profileId } = await context.params;
  try {
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    const body = await request.json();
    
    const { id, ...updateData } = body;

    const { data, error } = await supabase
      .from(COLLECTION_NAME)
      .update(updateData)
      .eq('id', profileId)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Skillset profile not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully', profile: data }, { status: 200 });

  } catch (error) {
    console.error(`Error updating skillset profile ${profileId}:`, error);
    let errorMessage = 'Failed to update skillset profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/skillset-profiles/[profileId] - Delete a specific profile
export async function DELETE(request: NextRequest, context: { params: Promise <{ profileId: string }> }) {
  const { profileId } = await context.params;
  try {
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from(COLLECTION_NAME)
      .delete()
      .eq('id', profileId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting skillset profile ${profileId}:`, error);
    let errorMessage = 'Failed to delete skillset profile.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
