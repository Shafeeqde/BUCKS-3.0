import { type NextRequest, NextResponse } from 'next/server';
import * as professionalSupabase from './supabase';

// GET /api/professional-profile/[userId] - Fetch a specific professional profile
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params;
  try {
    const response = await professionalSupabase.GET(request, { params });
    return response;
  } catch (error) {
    console.error('Error in GET /api/professional-profile/[userId]:', error);
    return NextResponse.json({ error: 'Failed to fetch professional profile.' }, { status: 500 });
  }
}

// PUT /api/professional-profile/[userId] - Create or update a specific professional profile
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params;
  try {
    const response = await professionalSupabase.PUT(request, { params });
    return response;
  } catch (error) {
    console.error('Error in PUT /api/professional-profile/[userId]:', error);
    return NextResponse.json({ error: 'Failed to update professional profile.' }, { status: 500 });
  }
}
