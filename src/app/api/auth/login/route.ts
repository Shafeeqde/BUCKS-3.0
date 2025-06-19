
// This file is intentionally left empty as password-based login is replaced by OTP.
// It can be deleted if no longer referenced or needed for other purposes.
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ success: false, message: 'Password login is disabled. Please use OTP login.' }, { status: 405 });
}
