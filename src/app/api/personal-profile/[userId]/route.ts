import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase';
import type { PersonalPost, PersonalTag, PersonalRecommendation, PersonalComment } from '@/types';

// GET: Fetch all personal posts for a user
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const { data, error } = await supabase
    .from('personal_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

// POST: Create a new personal post
export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const body = await req.json();
  const post: Omit<PersonalPost, 'id' | 'createdAt' | 'updatedAt' | 'recommendationsCount' | 'commentsCount'> = body;
  const { data, error } = await supabase
    .from('personal_posts')
    .insert([{ ...post, user_id: userId }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PUT: Update a personal post
export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const body = await req.json();
  const { id, ...updateFields } = body;
  const { data, error } = await supabase
    .from('personal_posts')
    .update({ ...updateFields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

// DELETE: Delete a personal post
export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const { id } = await req.json();
  const { error } = await supabase
    .from('personal_posts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 200 });
}
