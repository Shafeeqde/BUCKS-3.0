import { supabase } from '@/lib/supabaseClient';
import type { NextRequest } from 'next/server';
import type { SkillsetProfileData, SkillsetProfileSummary } from '@/types';

function mapProfileSummary(row: any): SkillsetProfileSummary {
  return {
    id: row.id,
    skillName: row.skill_name,
    skillLevel: row.skill_level,
    isActive: row.is_active || false,
    portfolioItemCount: Array.isArray(row.portfolio_items) ? row.portfolio_items.length : 0,
    averageRating: row.average_rating || 0,
  };
}

// POST /api/skillset-profiles (Supabase version)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { skillName, userId, userName, userAvatarUrl, userAvatarAiHint } = body;
  if (!skillName || !userId || !userName) {
    return new Response(JSON.stringify({ error: 'Skill name, user ID, and user name are required' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('skillset_profiles')
    .insert([
      {
        skill_name: skillName,
        user_id: userId,
        user_name: userName,
        user_avatar_url: userAvatarUrl,
        user_avatar_ai_hint: userAvatarAiHint,
        skill_level: 'Beginner',
        skill_description: '',
        is_active: false,
        work_experience_entries: [],
        portfolio_items: [],
        professional_feed: [],
        reviews: [],
        recommendations_count: 0,
        average_rating: 0,
        total_reviews: 0,
      },
    ])
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(
    JSON.stringify(mapProfileSummary(data)),
    { status: 201 }
  );
}

// GET /api/skillset-profiles (Supabase version)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID query parameter is required' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('skillset_profiles')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data.map(mapProfileSummary)), { status: 200 });
}
