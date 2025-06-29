import { supabase } from '@/lib/supabaseClient';
import type { NextRequest } from 'next/server';
import type { ProfilePost } from '@/types';

function mapPost(row: any): ProfilePost {
  return {
    id: row.id,
    userId: row.user_id,
    user: row.user,
    userImage: row.user_image,
    userImageAiHint: row.user_image_ai_hint,
    timestamp: row.timestamp ? new Date(row.timestamp).toISOString() : new Date().toISOString(),
    content: row.content,
    media: row.media,
    likes: row.likes || 0,
    comments: row.comments || 0,
    commentsData: row.comments_data || [],
  };
}

// POST /api/posts (Supabase version)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, user, userImage, userImageAiHint, content, media } = body;
  if (!userId || !user) {
    return new Response(JSON.stringify({ error: 'User information is required to create a post.' }), { status: 400 });
  }
  if (!content && !media) {
    return new Response(JSON.stringify({ error: 'Post must have content or media.' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        user_id: userId,
        user,
        user_image: userImage || '',
        user_image_ai_hint: userImageAiHint || '',
        content: content || '',
        media: media || null,
        likes: 0,
        comments: 0,
        comments_data: [],
        timestamp: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(mapPost(data)), { status: 201 });
}

// GET /api/posts (Supabase version)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  let query = supabase
    .from('posts')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50);
  if (userId) {
    query = query.eq('user_id', userId);
  }
  const { data, error } = await query;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify((data || []).map(mapPost)), { status: 200 });
}
