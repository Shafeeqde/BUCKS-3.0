
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log(`[API /api/auth/register] Received POST request at ${new Date().toISOString()}`);
  try {
    console.log("[API /api/auth/register] Attempting to parse request body...");
    const body = await request.json();
    console.log("[API /api/auth/register] Request body parsed:", body);
    const { name, email, password } = body; // Corrected line

    if (!name || !email || !password) {
      console.log("[API /api/auth/register] Validation failed: Name, email or password missing.");
      return NextResponse.json({ success: false, message: 'Name, email and password are required' }, { status: 400 });
    }

    // Simulate user creation
    // In a real app, you would save the user to a database
    const newUser = {
      id: `mock-user-${Date.now()}`, // Simple unique ID
      name: name,
      email: email,
    };
    console.log("[API /api/auth/register] Registration successful for:", email, "New user:", newUser);
    // Typically, you wouldn't send the password back, even in a mock.
    // The success message and user object (without sensitive info) is usually sufficient.
    return NextResponse.json({ success: true, message: 'Registration successful', user: newUser }, { status: 201 });

  } catch (error) {
    console.error('[API /api/auth/register] Error in POST handler:', error);
    let errorMessage = 'An unexpected error occurred during registration.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
