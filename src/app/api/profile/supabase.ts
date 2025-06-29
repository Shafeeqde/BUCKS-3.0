import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function saveProfile({ name, email, phone }: { name: string; email: string; phone?: string }) {
  if (!name || !email) {
    return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
  }

  // TODO: Replace with real user ID from auth/session
  const userId = 'test-user-id';

  const { error } = await supabase
    .from('profiles')
    .upsert([
      {
        id: userId,
        name,
        email,
        phone: phone || null,
        updated_at: new Date().toISOString(),
      },
    ], { onConflict: 'id' }); // Fix: onConflict should be a string, not an array

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Profile saved successfully', userId }, { status: 200 });
}
