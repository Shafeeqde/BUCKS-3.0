import { type NextRequest } from 'next/server';
import { saveProfile } from './supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;
    return await saveProfile({ name, email, phone });
  } catch (error) {
    let errorMessage = 'Failed to save profile.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
