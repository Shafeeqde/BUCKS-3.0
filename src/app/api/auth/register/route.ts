
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log(`[API /api/auth/register] Received POST request at ${new Date().toISOString()}`);
  try {
    console.log("[API /api/auth/register] Attempting to parse request body...");
    const body = await request.json();
    console.log("[API /api/auth/register] Request body parsed:", body);
    const { name, email, password }. // src/components/screens/RegistrationScreen.tsx

Please try logging in or registering again and check your server-side terminal. Let me know what logs you see (or don't see). This will give us the next clue.