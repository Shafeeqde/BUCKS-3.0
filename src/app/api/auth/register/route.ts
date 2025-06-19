
import { type NextRequest, NextResponse } from 'next/server';

// This is a mock in-memory user store for the prototype.
// In a real app, use a database like Firestore.
const users: Record<string, { id: string; name: string; emailOrMobile: string }> = {};

export async function POST(request: NextRequest) {
  console.log(`[API /api/auth/register] Received POST request at ${new Date().toISOString()}`);
  try {
    const body = await request.json();
    console.log("[API /api/auth/register] Request body parsed:", body);
    const { name, emailOrMobile } = body; // 'email' can now be email or mobile

    if (!name || !emailOrMobile) {
      console.log("[API /api/auth/register] Validation failed: Name or identifier (email/mobile) missing.");
      return NextResponse.json({ success: false, message: 'Name and Email/Mobile are required' }, { status: 400 });
    }

    // Simulate checking if user already exists (using emailOrMobile as key)
    if (users[emailOrMobile]) {
      console.log(`[API /api/auth/register] Registration failed: User already exists with identifier ${emailOrMobile}`);
      return NextResponse.json({ success: false, message: 'An account with this email/mobile already exists.' }, { status: 409 });
    }
    
    // Simulate user creation
    const userId = `mock-user-${Date.now()}`;
    const newUser = {
      id: userId,
      name: name,
      emailOrMobile: emailOrMobile,
      email: emailOrMobile.includes('@') ? emailOrMobile : undefined, // Store email if it is one
      // mobile: !emailOrMobile.includes('@') ? emailOrMobile : undefined, // Store mobile if it is one
    };
    
    users[emailOrMobile] = newUser; // Store user by their identifier
    console.log("[API /api/auth/register] Registration successful for:", emailOrMobile, "New user:", newUser);
    
    // Return only non-sensitive parts of the user object
    const publicUser = { id: newUser.id, name: newUser.name, email: newUser.email };

    return NextResponse.json({ success: true, message: 'Registration successful. You can now log in using OTP.', user: publicUser }, { status: 201 });

  } catch (error) {
    console.error('[API /api/auth/register] Error in POST handler:', error);
    let errorMessage = 'An unexpected error occurred during registration.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
