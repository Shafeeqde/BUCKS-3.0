import { type NextRequest, NextResponse } from 'next/server';
import { POST, GET } from './supabase';

// POST /api/business-profiles - Create a new business profile
export async function POST(request: NextRequest) {
  return POST(request);
}

// GET /api/business-profiles - List all business profiles for a user
export async function GET(request: NextRequest) {
  return GET(request);
}
