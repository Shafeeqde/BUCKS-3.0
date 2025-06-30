import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../supabase';
import type { PersonalTag } from '@/types';

// POST: Add a tag to a post
export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
  const body = await req.json();
  const tag: Omit<PersonalTag, 'id' | 'createdAt' | 'approvedAt'> = body;
  const { data, error } = await supabase
    .from('personal_tags')
    .insert([{ ...tag, post_id: params.postId }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PUT: Update tag status (approve/reject)
export async function PUT(req: NextRequest, { params }: { params: { postId: string } }) {
  const { id, status } = await req.json();
  const update: Partial<PersonalTag> = { status };
  if (status === 'approved') update.approvedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from('personal_tags')
    .update(update)
    .eq('id', id)
    .eq('post_id', params.postId)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

// DELETE: Remove a tag
export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  const { id } = await req.json();
  const { error } = await supabase
    .from('personal_tags')
    .delete()
    .eq('id', id)
    .eq('post_id', params.postId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 200 });
}
