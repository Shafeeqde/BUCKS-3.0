import { type NextRequest, NextResponse } from 'next/server';
import * as vehiclesSupabase from './supabase';

// POST /api/users/[userId]/vehicles - Create a new vehicle for a user
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const response = await vehiclesSupabase.POST(request, { params });
    return response;
  } catch (error) {
    console.error('Error in POST /api/users/[userId]/vehicles:', error);
    return NextResponse.json({ error: 'Failed to create vehicle.' }, { status: 500 });
  }
}

// GET /api/users/[userId]/vehicles - List all vehicles for a user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const response = await vehiclesSupabase.GET(request, { params });
    return response;
  } catch (error) {
    console.error('Error in GET /api/users/[userId]/vehicles:', error);
    return NextResponse.json({ error: 'Failed to fetch vehicles.' }, { status: 500 });
  }
}

