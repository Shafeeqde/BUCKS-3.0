
"use client";

import React, { useState } from 'react';
import CategoryItem from '@/components/feeds/CategoryItem';
import FeedCard from '@/components/feeds/FeedCard';
import type { Category, FeedItem as FeedItemType } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { initialCategoriesData } from '@/lib/dummy-data/feedsCategories';
// Removed initialFeedItemsData as it's now a prop

interface FeedsScreenProps {
  onViewUserProfile?: (profileId: string) => void;
  onAddMomentClick: () => void;
  onViewUserMomentsClick: (profileId?: string, userName?: string, userAvatarUrl?: string, userAvatarAiHint?: string) => void;
  onViewPostDetail: (post: FeedItemType) => void; // New prop
  feedItems: FeedItemType[]; // New prop
}

const FeedsScreen: React.FC<FeedsScreenProps> = ({ 
  onViewUserProfile,
  onAddMomentClick,
  onViewUserMomentsClick,
  onViewPostDetail, // Use new prop
  feedItems: initialFeedItems // Use new prop
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategoriesData);
  const [feedItems, setFeedItems] = useState<FeedItemType[]>(initialFeedItems); // State now uses passed prop
  const { toast } = useToast();

  // Effect to update local feedItems state if the prop changes (e.g., after a comment)
  React.useEffect(() => {
    setFeedItems(initialFeedItems);
  }, [initialFeedItems]);

  const handleInteraction = (id: number, type: 'recommend' | 'notRecommend') => {
    const itemInteractedWith = feedItems.find(item => item.id === id);
    if (!itemInteractedWith) return;

    toast({
      title: type === 'recommend' ? "Recommended!" : "Marked as Not Recommended",
      description: `You ${type === 'recommend' ? 'recommended' : 'marked'} ${itemInteractedWith.user}'s post.`,
    });

    setFeedItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          let updatedRecommendations = item.recommendations;
          let updatedNotRecommendations = item.notRecommendations;

          if (type === 'recommend') updatedRecommendations += 1;
          else if (type === 'notRecommend') updatedNotRecommendations += 1;

          return {
            ...item,
            recommendations: updatedRecommendations,
            notRecommendations: updatedNotRecommendations,
          };
        }
        return item;
      })
    );
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
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId ? { ...cat, viewed: true } : cat
        )
      );
      toast({
          title: `Viewing ${category?.name || 'Category'}`,
          description: "Content for this category would load here. (Generic category click)",
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
          {feedItems.map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              onInteraction={handleInteraction}
              onViewUserProfile={onViewUserProfile} 
              onViewUserMoments={onViewUserMomentsClick}
              onViewDetail={() => onViewPostDetail(item)} 
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default FeedsScreen;
