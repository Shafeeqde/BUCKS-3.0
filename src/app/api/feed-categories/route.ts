import { NextResponse } from 'next/server';
import type { Category } from '@/types';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Fetch categories from Supabase
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      console.error('Error fetching categories from Supabase:', error);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
    
    // If no data found or empty array, return fallback categories
    if (!data || data.length === 0) {
      // Fallback categories if table is empty
      const fallbackCategories: Category[] = [
        {
          id: 'all',
          name: 'All',
          icon: 'QueueListIcon',
          viewed: false
        },
        {
          id: 'trending',
          name: 'Trending',
          icon: 'ChartBarIcon',
          viewed: false
        },
        {
          id: 'business',
          name: 'Business',
          icon: 'BriefcaseIcon',
          viewed: false
        },
        {
          id: 'services',
          name: 'Services',
          icon: 'WrenchScrewdriverIcon',
          viewed: false
        },
        {
          id: 'community',
          name: 'Community',
          icon: 'UsersIcon',
          viewed: false
        }
      ];
      
      return NextResponse.json(fallbackCategories);
    }
    
    // Map the data to match the Category type if necessary
    const categories = data.map(item => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      viewed: item.viewed || false
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching feed categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed categories' },
      { status: 500 }
    );
  }
}
