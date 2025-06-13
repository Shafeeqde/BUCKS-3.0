
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Simulate user lookup and password check
    // In a real app, you'd query your database and hash/compare passwords
    if (email === 'testuser@example.com' && password === 'password123') {
      const user = {
        id: 'mock-user-id-123',
        name: 'Test User',
        email: email,
        // Add any other user data you want to return
      };
      return NextResponse.json({ success: true, message: 'Login successful', user }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    let errorMessage = 'An unexpected error occurred during login.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
