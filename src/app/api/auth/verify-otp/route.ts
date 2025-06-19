
import { type NextRequest, NextResponse } from 'next/server';
import { otpStore } from '../send-otp/route'; // Import the mock store

export async function POST(request: NextRequest) {
  console.log(`[API /api/auth/verify-otp] Received POST request at ${new Date().toISOString()}`);
  try {
    const body = await request.json();
    const { identifier, otp } = body;

    if (!identifier || !otp) {
      console.log("[API /api/auth/verify-otp] Validation failed: Identifier or OTP missing.");
      return NextResponse.json({ success: false, message: 'Identifier and OTP are required' }, { status: 400 });
    }

    const storedOtpEntry = otpStore[identifier];

    if (!storedOtpEntry) {
      console.log(`[API /api/auth/verify-otp] No OTP found for identifier: ${identifier}`);
      return NextResponse.json({ success: false, message: 'OTP not found or never sent. Please request a new OTP.' }, { status: 400 });
    }

    if (Date.now() > storedOtpEntry.expires) {
      console.log(`[API /api/auth/verify-otp] OTP expired for identifier: ${identifier}`);
      delete otpStore[identifier]; // Clean up expired OTP
      return NextResponse.json({ success: false, message: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
    }

    if (storedOtpEntry.otp === otp) {
      console.log(`[API /api/auth/verify-otp] OTP verified successfully for: ${identifier}`);
      // OTP is correct, simulate login
      delete otpStore[identifier]; // Clean up used OTP

      // Simulate user data retrieval or creation
      // In a real app, you'd fetch user from DB or create if it's a new registration via OTP.
      const user = {
        id: `mock-user-${identifier.replace(/[^a-zA-Z0-9]/g, '')}`, // Create a pseudo-unique ID
        name: 'Verified User', // Could be fetched or set during registration
        email: identifier, // Assuming identifier is the email for simplicity
        // Add other user properties as needed
      };
      
      return NextResponse.json({ success: true, message: 'Login successful', user }, { status: 200 });
    } else {
      console.log(`[API /api/auth/verify-otp] Invalid OTP for identifier: ${identifier}. Expected ${storedOtpEntry.otp}, got ${otp}`);
      return NextResponse.json({ success: false, message: 'Invalid OTP. Please try again.' }, { status: 401 });
    }

  } catch (error) {
    console.error('[API /api/auth/verify-otp] Error in POST handler:', error);
    let errorMessage = 'An unexpected error occurred during OTP verification.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
