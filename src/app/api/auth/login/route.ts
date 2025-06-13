
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log(`[API /api/auth/login] Received POST request at ${new Date().toISOString()}`);
  try {
    console.log("[API /api/auth/login] Attempting to parse request body...");
    const body = await request.json();
    console.log("[API /api/auth/login] Request body parsed:", body);
    const { email, password } = body;

    if (!email || !password) {
      console.log("[API /api/auth/login] Validation failed: Email or password missing.");
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Simulate user lookup and password check
    if (email === 'testuser@example.com' && password === 'password123') {
      const user = {
        id: 'mock-user-id-123',
        name: 'Test User',
        email: email,
      };
      console.log("[API /api/auth/login] Login successful for:", email);
      return NextResponse.json({ success: true, message: 'Login successful', user }, { status: 200 });
    } else {
      console.log("[API /api/auth/login] Login failed: Invalid credentials for:", email);
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('[API /api/auth/login] Error in POST handler:', error);
    let errorMessage = 'An unexpected error occurred during login.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });