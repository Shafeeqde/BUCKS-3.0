import { type NextRequest, NextResponse } from 'next/server';
import * as businessProfileSupabase from './supabase';

// GET /api/business-profiles/[profileId] - Fetch a specific business profile
export async function GET(request: NextRequest, context: { params: Promise<{ profileId: string }> }) {
  const params = await context.params;
  try {
    const response = await businessProfileSupabase.GET(request, { params });
    return response;
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return NextResponse.json({ error: 'Failed to fetch business profile.' }, { status: 500 });
  }
}

// PUT /api/business-profiles/[profileId] - Update a specific business profile
export async function PUT(request: NextRequest, context: { params: Promise<{ profileId: string }> }) {
  const params = await context.params;
  try {
    const response = await businessProfileSupabase.PUT(request, { params });
    return response;
  } catch (error) {
    console.error('Error updating business profile:', error);
    return NextResponse.json({ error: 'Failed to update business profile.' }, { status: 500 });
  }
}

// DELETE /api/business-profiles/[profileId] - Delete a specific business profile
export async function DELETE(request: NextRequest, context: { params: Promise<{ profileId: string }> }) {
  const params = await context.params;
  try {
    const response = await businessProfileSupabase.DELETE(request, { params });
    return response;
  } catch (error) {
    console.error('Error deleting business profile:', error);
    return NextResponse.json({ error: 'Failed to delete business profile.' }, { status: 500 });
  }
}
