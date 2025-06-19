
import { type NextRequest, NextResponse } from 'next/server';
import { users, UserEntry } from '../register/route'; // Import users from register route

export async function POST(request: NextRequest) {
  console.log(`[API /api/auth/login] Received POST request at ${new Date().toISOString()}`);
  try {
    const body = await request.json();
    console.log("[API /api/auth/login] Request body parsed:", body);
    const { userId, password } = body; // Changed from email to userId

    if (!userId || !password) {
      console.log("[API /api/auth/login] Validation failed: User ID or password missing.");
      return NextResponse.json({ success: false, message: 'User ID and password are required' }, { status: 400 });
    }

    // Hardcoded test user
    if (userId === 'test@bucks.com' && password === 'password123') {
      const user = {
        id: 'mock-test-user-id-000',
        name: 'Bucks Test User',
        email: 'test@bucks.com', // Use the User ID as email if it's an email format
      };
      console.log("[API /api/auth/login] Test user login successful for:", userId);
      return NextResponse.json({ success: true, message: 'Login successful', user }, { status: 200 });
    }

    // Check against in-memory registered users
    const registeredUser: UserEntry | undefined = users[userId];

    if (registeredUser && registeredUser.password === password) { // Plain text comparison for prototype
      const user = {
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.userId, // Assume userId might be an email
      };
      console.log("[API /api/auth/login] Registered user login successful for:", userId);
      return NextResponse.json({ success: true, message: 'Login successful', user }, { status: 200 });
    } else {
      console.log("[API /api/auth/login] Login failed: Invalid credentials for:", userId);
      return NextResponse.json({ success: false, message: 'Invalid User ID or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('[API /api/auth/login] Error in POST handler:', error);
    let errorMessage = 'An unexpected error occurred during login.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
