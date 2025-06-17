
"use client";

import React, { useState } from 'react';
import { PlusIcon, PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import CategoryItem from '@/components/feeds/CategoryItem';
import FeedCard from '@/components/feeds/FeedCard';
import type { Category, FeedItem as FeedItemType } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { initialCategoriesData } from '@/lib/dummy-data/feedsCategories';

const initialFeedItems: FeedItemType[] = [
  {
    id: 1, type: 'post', user: 'Shafeeq A.', userImage: 'https://source.unsplash.com/random/40x40/?man,casual,beard', userImageAiHint: 'man casual beard', profileId: 'shafeeq-profile',
    timestamp: 'Wishing you a joyful and prosperous Diwali',
    content: 'May this festival of lights bring happiness, success, and warmth to your lives.',
    postImage: 'https://source.unsplash.com/random/600x350/?diwali,festival', postImageAiHint: 'diwali festival',
    comments: 7, recommendations: 10, notRecommendations: 2, showCommentBox: false, currentComment: ''
  },
  {
    id: 2, type: 'post', user: 'Senthil Devaraj', userImage: 'https://source.unsplash.com/random/40x40/?man,professional,southindian', userImageAiHint: 'man professional southindian', profileId: 'senthil-profile',
    timestamp: 'Unemployed for 12 months, seeking opportunities.',
    content: 'Hi Guys, I have been Unemployed for 12 months now, please help by reviewing my resume and please help if there are any opportunities. Senthil Devaraj Resume.',
    comments: 12, recommendations: 5, notRecommendations: 1, showCommentBox: false, currentComment: ''
  },
  {
    id: 3, type: 'job', user: 'Mikado UX UI', userImage: 'https://source.unsplash.com/random/40x40/?design,studio,logo', userImageAiHint: 'design studio logo', profileId: 'mikado-ux-ui-business-profile', 
    timestamp: 'Hiring Graphic Designer',
    content: 'Hi Design Enthusiast , we are in search of the graphic Designer with Illustrative and sketching skills , check out your Job portal and share you resume and please suggest you known persons if you know someone as we expected.',
    comments: 20, recommendations: 25, notRecommendations: 3, showCommentBox: false, currentComment: ''
  },
  {
    id: 4, type: 'ad', user: 'TVS Synergy', userImage: 'https://source.unsplash.com/random/40x40/?automotive,brand', userImageAiHint: 'automotive brand', profileId: 'tvs-synergy-profile',
    postImage: 'https://source.unsplash.com/random/600x350/?scooter,advertisement', postImageAiHint: 'scooter advertisement',
    content: 'TVS Ntorq 125 Price : Check On-Road & Ex-Showroom Prices of All Variants -',
    timestamp: 'Sponsored Ad', comments: 0, recommendations: 15, notRecommendations: 0, showCommentBox: false, currentComment: ''
  },
  {
    id: 5, type: 'post', user: 'Hot Griddle Restaurant', userImage: 'https://source.unsplash.com/random/40x40/?restaurant,logo&sig=hg', userImageAiHint: 'restaurant logo', profileId: 'hot-griddle-business-profile', 
    timestamp: '4 days ago',
    content: 'Special Offer: Combo meals starting at just ₹249 this week! Perfect for a quick and delicious lunch. #FoodDeals #LunchSpecial',
    comments: 18, recommendations: 88, notRecommendations: 1, showCommentBox: false, currentComment: ''
  },
  {
    id: 6, type: 'post', user: 'GreenScape Landscaping', userImage: 'https://source.unsplash.com/random/40x40/?landscape,company,logo&sig=gs', userImageAiHint: 'landscape company logo', profileId: 'greenscape-business-profile', 
    timestamp: '1 day ago',
    content: 'Spring is here! 🌷 Time to get your garden ready. Contact us for a free consultation.',
    postImage: 'https://source.unsplash.com/random/600x350/?garden,spring,flowers', postImageAiHint: 'garden spring flowers',
    comments: 9, recommendations: 45, notRecommendations: 0, showCommentBox: false, currentComment: ''
  },
];

interface FeedsScreenProps {
  onViewUserProfile?: (profileId: string) => void;
  onAddMomentClick: () => void;
  onViewUserMomentsClick: (profileId?: string, userName?: string, userAvatarUrl?: string, userAvatarAiHint?: string) => void;
}

const FeedsScreen: React.FC<FeedsScreenProps> = ({ 
  onViewUserProfile,
  onAddMomentClick,
  onViewUserMomentsClick 
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategoriesData);
  const [feedItems, setFeedItems] = useState<FeedItemType[]>(initialFeedItems);
  const { toast } = useToast();

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

  const handleToggleCommentBox = (id: number) => {
    setFeedItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, showCommentBox: !item.showCommentBox, currentComment: '' } : item
      )
    );
  };

  const handleCommentChange = (id: number, value: string) => {
    setFeedItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, currentComment: value } : item
      )
    );
  };

  const handlePostComment = (id: number) => {
    const item = feedItems.find(i => i.id === id);
    if (item && item.currentComment.trim()) {
       toast({
        title: "Comment Posted!",
        description: `Your comment on ${item.user}'s post has been submitted.`,
      });
      setFeedItems(prevItems =>
        prevItems.map(i =>
          i.id === id ? { ...i, currentComment: '', showCommentBox: false, comments: i.comments + 1 } : i
        )
      );
    }
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
              onCommentChange={handleCommentChange}
              onPostComment={handlePostComment}
              onToggleCommentBox={handleToggleCommentBox}
              onViewUserProfile={onViewUserProfile} 
              onViewUserMoments={onViewUserMomentsClick}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default FeedsScreen;
