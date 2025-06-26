
"use client";

import React, { useState, useEffect } from 'react';
import CategoryItem from '@/components/feeds/CategoryItem';
import FeedCard from '@/components/feeds/FeedCard';
import type { Category, FeedItem as FeedItemType, ProfilePost } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { initialCategoriesData } from '@/lib/dummy-data/feedsCategories';
import { Skeleton } from '../ui/skeleton';

interface FeedsScreenProps {
  onViewUserProfile?: (profileId: string) => void;
  onAddMomentClick: () => void;
  onViewUserMomentsClick: (profileId?: string, userName?: string, userAvatarUrl?: string, userAvatarAiHint?: string) => void;
  onViewPostDetail: (post: FeedItemType) => void;
}

const FeedsScreen: React.FC<FeedsScreenProps> = ({ 
  onViewUserProfile,
  onAddMomentClick,
  onViewUserMomentsClick,
  onViewPostDetail,
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategoriesData);
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

    fetchAllPosts();
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
      onAddMomentClick();
    } else if (category.profileId) { 
      onViewUserMomentsClick(category.profileId, category.name, category.image, category.dataAiHint);
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
                onViewUserMoments={onViewUserMomentsClick}
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
