import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../supabase';
import type { PersonalComment } from '@/types';

// POST: Add a comment
export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
  const body = await req.json();
  const comment: Omit<PersonalComment, 'id' | 'createdAt' | 'updatedAt'> = body;
  const { data, error } = await supabase
    .from('personal_comments')
    .insert([{ ...comment, post_id: params.postId }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PUT: Update a comment
export async function PUT(req: NextRequest, { params }: { params: { postId: string } }) {
  const { id, ...updateFields } = await req.json();
  const { data, error } = await supabase
    .from('personal_comments')
    .update({ ...updateFields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('post_id', params.postId)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

// DELETE: Remove a comment
export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  const { id } = await req.json();
  const { error } = await supabase
    .from('personal_comments')
    .delete()
    .eq('id', id)
    .eq('post_id', params.postId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 200 });
}
