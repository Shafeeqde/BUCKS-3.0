import { type NextRequest, NextResponse } from 'next/server';
import { POST as supabasePOST, GET as supabaseGET } from './supabase';


// POST /api/skillset-profiles - Create a new skillset profile
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const response = await supabasePOST(request);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in POST /api/skillset-profiles:', error);
    return NextResponse.json({ error: 'Failed to create skillset profile.' }, { status: 500 });
  }
}


// GET /api/skillset-profiles?userId=... - List all skillset profiles for a user
export async function GET(request: NextRequest) {
  try {
    const response = await supabaseGET(request);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in GET /api/skillset-profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch skillset profiles.' }, { status: 500 });
  }
}
