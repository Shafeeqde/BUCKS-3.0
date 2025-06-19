
import { type NextRequest, NextResponse } from 'next/server';

// THIS IS A MOCK IN-MEMORY OTP STORE - DO NOT USE IN PRODUCTION
// Data will be lost on server restart.
interface OtpEntry {
  otp: string;
  expires: number; // Timestamp
}
const otpStore: Record<string, OtpEntry> = {};

export async function POST(request: NextRequest) {
  console.log(`[API /api/auth/send-otp] Received POST request at ${new Date().toISOString()}`);
  try {
    const body = await request.json();
    const { identifier } = body; // This can be email or mobile number

    if (!identifier) {
      console.log("[API /api/auth/send-otp] Validation failed: Identifier missing.");
      return NextResponse.json({ success: false, message: 'Email or mobile number is required' }, { status: 400 });
    }

    // Simulate OTP generation
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    // Store the OTP (mock)
    otpStore[identifier] = { otp: generatedOtp, expires };

    // Simulate sending OTP (log to console for prototype)
    console.log(`[MOCK OTP SENT] OTP for ${identifier}: ${generatedOtp}`);

    return NextResponse.json({ 
      success: true, 
      message: `OTP has been "sent" to ${identifier}. Please check the server console for the OTP.` 
    }, { status: 200 });

  } catch (error) {
    console.error('[API /api/auth/send-otp] Error in POST handler:', error);
    let errorMessage = 'An unexpected error occurred while sending OTP.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

// Export the otpStore only for use by verify-otp in this prototyped scenario
// In a real app, OTPs would be managed in a persistent, secure datastore (e.g., Redis, Firestore with TTL)
export { otpStore };
