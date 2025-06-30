import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../supabase';
import type { PersonalRecommendation } from '@/types';

// POST: Add or update a recommendation (upvote/downvote)
export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
  const body = await req.json();
  const { userId, type } = body;
  // Upsert recommendation
  const { data, error } = await supabase
    .from('personal_recommendations')
    .upsert({ post_id: params.postId, user_id: userId, type }, { onConflict: 'post_id,user_id' })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// DELETE: Remove a recommendation
export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  const { userId } = await req.json();
  const { error } = await supabase
    .from('personal_recommendations')
    .delete()
    .eq('post_id', params.postId)
    .eq('user_id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 200 });
}
