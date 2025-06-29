import { type NextRequest, NextResponse } from 'next/server';
import * as postsSupabase from './supabase';

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const response = await postsSupabase.POST(request);
    return response;
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post.' }, { status: 500 });
  }
}

// GET /api/posts?userId=... - List all posts for a user, or all posts if no userId
export async function GET(request: NextRequest) {
  try {
    const response = await postsSupabase.GET(request);
    return response;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts.' }, { status: 500 });
  }
}
