import { type NextRequest, NextResponse } from 'next/server';
import * as searchSupabase from './supabase';

export async function GET(request: NextRequest) {
  try {
    const response = await searchSupabase.GET(request);
    return response;
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ error: 'Failed to perform search.' }, { status: 500 });
  }
}
