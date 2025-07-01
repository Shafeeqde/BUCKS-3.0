import { NextResponse } from 'next/server';
import type { FeedItem } from '@/types';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Fetch recommended items from Supabase
    const { data, error } = await supabase
      .from('recommended_items')
      .select('*')
      .eq('type', 'recommended');
    
    if (error) {
      console.error('Error fetching recommended items from Supabase:', error);
      return NextResponse.json({ error: 'Failed to fetch recommended items' }, { status: 500 });
    }
    
    // If no data found or empty array, return fallback items
    if (!data || data.length === 0) {
      // Fallback recommended items if table is empty
      const fallbackItems: FeedItem[] = [
        {
          id: '1',
          user: 'Sarah Johnson',
          userImage: '/images/avatars/user1.png',
          userImageAiHint: 'professional woman with glasses',
          timestamp: new Date().toISOString(),
          content: 'Just launched a new service for small business accounting. Check out my business profile for details!',
          comments: 5,
          recommendations: 24,
          notRecommendations: 2,
          type: 'recommended',
          profileId: 'user1'
        },
        {
          id: '2',
          user: 'David Chen',
          userImage: '/images/avatars/user2.png',
          userImageAiHint: 'young man with casual attire',
          timestamp: new Date().toISOString(),
          content: 'Looking for recommendations for reliable web developers in the area. Any suggestions?',
          comments: 12,
          recommendations: 18,
          notRecommendations: 0,
          type: 'recommended',
          profileId: 'user2'
        }
      ];
      
      return NextResponse.json(fallbackItems);
    }
    
    // Map the data to ensure it matches the FeedItem type
    const recommendedItems = data.map(item => ({
      id: item.id,
      user: item.user,
      userImage: item.userImage,
      userImageAiHint: item.userImageAiHint,
      timestamp: item.timestamp,
      content: item.content,
      comments: item.comments || 0,
      recommendations: item.recommendations || 0,
      notRecommendations: item.notRecommendations || 0,
      type: item.type || 'recommended',
      profileId: item.profileId
    }));

    return NextResponse.json(recommendedItems);
  } catch (error) {
    console.error('Error fetching recommended items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommended items' },
      { status: 500 }
    );
  }
}
