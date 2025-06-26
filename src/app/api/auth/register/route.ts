
import { type NextRequest, NextResponse } from 'next/server';
import { users, type UserEntry } from '@/lib/auth/store'; // Import users from the new store

export async function POST(request: NextRequest) {
  console.log(`[API /api/auth/register] Received POST request at ${new Date().toISOString()}`);
  try {
    const body = await request.json();
    console.log("[API /api/auth/register] Request body parsed:", body);
    const { name, userId, password } = body; // Expecting userId (email or custom) and password

    if (!name || !userId || !password) {
      console.log("[API /api/auth/register] Validation failed: Name, User ID, or Password missing.");
      return NextResponse.json({ success: false, message: 'Name, User ID, and Password are required' }, { status: 400 });
    }

    if (users[userId]) {
      console.log(`[API /api/auth/register] Registration failed: User ID ${userId} already exists.`);
      return NextResponse.json({ success: false, message: 'This User ID is already taken.' }, { status: 409 });
    }
    
    const internalUserId = `mock-user-${Date.now()}`;
    const newUser: UserEntry = {
      id: internalUserId,
      name: name,
      userId: userId,
      password: password, // Storing plain text for prototype
    };
    
    if (userId.includes('@')) { // Simple check if userId is an email
        newUser.email = userId;
    }

    users[userId] = newUser; // Store user by their chosen User ID
    console.log("[API /api/auth/register] Registration successful for User ID:", userId, "New user internal ID:", internalUserId);
    
    const publicUser = { id: newUser.id, name: newUser.name, userId: newUser.userId, email: newUser.email };

    return NextResponse.json({ success: true, message: 'Registration successful. You can now log in.', user: publicUser }, { status: 201 });

  } catch (error) {
    console.error('[API /api/auth/register] Error in POST handler:', error);
    let errorMessage = 'An unexpected error occurred during registration.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
