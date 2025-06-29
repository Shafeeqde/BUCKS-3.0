import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file was provided for upload.' }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size cannot exceed 5MB.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = new Uint8Array(bytes);

  const uniqueFilename = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
  const destination = `uploads/${uniqueFilename}`;

  const { data, error } = await supabase.storage
    .from('public') // Change to your Supabase bucket name
    .upload(destination, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from('public').getPublicUrl(destination);
  const publicUrl = publicUrlData?.publicUrl;

  return NextResponse.json({ url: publicUrl }, { status: 200 });
}
