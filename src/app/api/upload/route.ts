import { type NextRequest } from 'next/server';
import { uploadFile } from './supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    return await uploadFile(formData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during upload.';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
