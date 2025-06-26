
import { type NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/firebase/admin';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    if (!storage) {
      console.error('Firebase Storage is not configured. Check admin SDK initialization.');
      return NextResponse.json({ error: 'Storage service is not available.' }, { status: 500 });
    }
    
    // Get the default bucket that was configured during Admin SDK initialization.
    const bucket = storage.bucket();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file was provided for upload.' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: 'File size cannot exceed 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uniqueFilename = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
    const destination = `uploads/${uniqueFilename}`;

    const fileUpload = bucket.file(destination);

    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;

    return NextResponse.json({ url: publicUrl }, { status: 200 });

  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during upload.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
