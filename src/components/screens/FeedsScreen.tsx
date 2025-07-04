
"use client";

import React, { useState, useEffect } from 'react';
import CategoryItem from '@/components/feeds/CategoryItem';
import FeedCard from '@/components/feeds/FeedCard';
import type { Category, FeedItem as FeedItemType, ProfilePost } from '@/types';
import { useToast } from "@/hooks/use-toast";
// Real API will be used instead of dummy data
import { Skeleton } from '../ui/skeleton';
import { Card } from '@/components/ui/card';

interface FeedsScreenProps {
  onViewUserProfile?: (profileId: string) => void;
  onViewPostDetail: (post: FeedItemType) => void;
}

const FeedsScreen: React.FC<FeedsScreenProps> = ({ 
  onViewUserProfile,
  onViewPostDetail,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const posts: ProfilePost[] = await response.json();
        
        const formattedFeedItems: FeedItemType[] = posts.map(p => ({
          ...p,
          type: 'post',
          recommendations: p.likes || 0,
          notRecommendations: 0, // No backend field for this yet
          userImage: p.userImage ?? '', // Ensure userImage is always a string
          content: p.content ?? '', // Ensure content is always a string
        }));

        setFeedItems(formattedFeedItems);
      } catch (error) {
        console.error("Error fetching all posts for feed:", error);
        toast({
          title: "Could not load feed",
          description: "There was an issue fetching the latest posts.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch('/api/feed-categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Could not load categories",
          description: "There was an issue fetching the feed categories.",
          variant: "destructive"
        });
        setCategories([]); // Use empty array as fallback
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchAllPosts();
    fetchCategories();
  }, [toast]);

  const handleInteraction = (id: string | number, type: 'recommend' | 'notRecommend') => {
    toast({
      title: "Interaction (Simulated)",
      description: `You interacted with post ${id}.`,
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (category.id === 'moments-0' && category.type === 'moments') {
       toast({ title: "Feature Coming Soon", description: "Moments/Stories are under development." });
    } else if (category.profileId) { 
      toast({ title: "Feature Coming Soon", description: "Viewing user moments is under development." });
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId ? { ...cat, viewed: true } : cat
        )
      );
    } else {
      toast({
          title: `Viewing ${category?.name || 'Category'}`,
          description: "Content filtering for this category is not yet implemented.",
      });
    }
  };

  return (
    <>
      <main className="flex-grow bg-background overflow-y-auto h-full custom-scrollbar">
        <div className="flex py-3 border-b border-border overflow-x-auto custom-scrollbar px-4 space-x-3 bg-card sticky top-0 z-[5]">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} onClick={handleCategoryClick} />
          ))}
        </div>

        <div className="p-4 space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="shadow-sm p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-3" />
                <Skeleton className="h-40 w-full rounded-lg" />
              </Card>
            ))
          ) : feedItems.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">The feed is empty.</p>
              <p className="text-sm">Be the first to create a post!</p>
            </div>
          ) : (
            feedItems.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                onInteraction={(id, type) => handleInteraction(String(id), type)}
                onViewUserProfile={onViewUserProfile} 
                onViewUserMoments={() => handleCategoryClick(`cat-${item.profileId}`)}
                onViewDetail={() => onViewPostDetail(item)}
              />
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default FeedsScreen;
