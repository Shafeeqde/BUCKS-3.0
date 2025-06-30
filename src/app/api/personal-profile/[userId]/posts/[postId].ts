import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../supabase';
import type { PersonalTag, PersonalRecommendation, PersonalComment } from '@/types';

// GET: Fetch a single post with tags, recommendations, and comments
export async function GET(req: NextRequest, { params }: { params: { userId: string, postId: string } }) {
  const { postId } = params;
  // Fetch post
  const { data: post, error: postError } = await supabase
    .from('personal_posts')
    .select('*')
    .eq('id', postId)
    .single();
  if (postError) return NextResponse.json({ error: postError.message }, { status: 404 });

  // Fetch tags
  const { data: tags } = await supabase
    .from('personal_tags')
    .select('*')
    .eq('post_id', postId);
  // Fetch recommendations
  const { data: recommendations } = await supabase
    .from('personal_recommendations')
    .select('*')
    .eq('post_id', postId);
  // Fetch comments
  const { data: comments } = await supabase
    .from('personal_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  return NextResponse.json({ post, tags, recommendations, comments }, { status: 200 });
}
