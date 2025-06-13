
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email, and password are required' }, { status: 400 });
    }

    // Simulate user creation
    // In a real app, you'd save the user to your database, hash the password, etc.
    // You might also check if the email already exists.
    if (email === 'existing@example.com') {
        return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 409 });
    }

    const newUser = {
      id: `mock-new-user-${Date.now()}`, // Simple unique ID for simulation
      name: name,
      email: email,
      // Do NOT return the password
    };

    return NextResponse.json({ success: true, message: 'Registration successful', user: newUser }, { status: 201 });

  } catch (error) {
    console.error('Registration API error:', error);
    let errorMessage = 'An unexpected error occurred during registration.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
