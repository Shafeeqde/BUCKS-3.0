
"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CategoryItem from '@/components/feeds/CategoryItem';
import FeedCard from '@/components/feeds/FeedCard';
import type { Category, FeedItem as FeedItemType } from '@/types';
import { useToast } from "@/hooks/use-toast";

const initialCategories: Category[] = [
  { id: 'moments-0', name: 'Your Moments', icon: Plus, type: 'moments', viewed: false, color: 'bg-primary/10 text-primary' },
  { id: 'feed-deepthi', name: 'Deepthi', image: 'https://placehold.co/100x100.png', dataAiHint: 'woman portrait', viewed: false },
  { id: 'feed-maanisha', name: 'Maanisha', image: 'https://placehold.co/100x100.png', dataAiHint: 'woman smiling', viewed: false },
  { id: 'feed-subhesh', name: 'Subhesh', image: 'https://placehold.co/100x100.png', dataAiHint: 'man office', viewed: true },
  { id: 'feed-seena', name: 'Seena', image: 'https://placehold.co/100x100.png', dataAiHint: 'person outdoor', viewed: false },
  { id: 'feed-1', name: 'Shafeeq', image: 'https://placehold.co/100x100.png', dataAiHint: 'man casual', viewed: false },
  { id: 'feed-2', name: 'Senthil', image: 'https://placehold.co/100x100.png', dataAiHint: 'person tech', viewed: true },
  { id: 'feed-3', name: 'Mikado', image: 'https://placehold.co/100x100.png', dataAiHint: 'company logo', viewed: true },
  { id: 'feed-4', name: 'TVS Synergy', image: 'https://placehold.co/100x100.png', dataAiHint: 'vehicle brand', viewed: false },
];

const initialFeedItems: FeedItemType[] = [
  {
    id: 1, type: 'post', user: 'Shafeeq', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'man casual',
    timestamp: 'Wishing you a joyful and prosperous Diwali',
    content: 'May this festival of lights bring happiness, success, and warmth to your lives.',
    postImage: 'https://placehold.co/600x350.png', postImageAiHint: 'diwali festival',
    comments: 7, recommendations: 10, notRecommendations: 2, showCommentBox: false, currentComment: ''
  },
  {
    id: 2, type: 'post', user: 'Senthil Devaraj', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'man professional',
    timestamp: 'Unemployed for 12 months, seeking opportunities.',
    content: 'Hi Guys, I have been Unemployed for 12 months now, please help by reviewing my resume and please help if there are any opportunities. Senthil Devaraj Resume.',
    comments: 12, recommendations: 5, notRecommendations: 1, showCommentBox: false, currentComment: ''
  },
  {
    id: 3, type: 'job', user: 'Mikado UX UI', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'design studio logo',
    timestamp: 'Hiring Graphic Designer',
    content: 'Hi Design Enthusiast , we are in search of the graphic Designer with Illustrative and sketching skills , check out your Job portal and share you resume and please suggest you known persons if you know someone as we expected.',
    comments: 20, recommendations: 25, notRecommendations: 3, showCommentBox: false, currentComment: ''
  },
  {
    id: 4, type: 'ad', user: 'TVS Synergy', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'automotive brand',
    postImage: 'https://placehold.co/600x350.png', postImageAiHint: 'scooter advertisement',
    content: 'TVS Ntorq 125 Price : Check On-Road & Ex-Showroom Prices of All Variants -',
    timestamp: 'Sponsored Ad', comments: 0, recommendations: 15, notRecommendations: 0, showCommentBox: false, currentComment: ''
  }
];

const FeedsScreen = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [feedItems, setFeedItems] = useState<FeedItemType[]>(initialFeedItems);
  const { toast } = useToast();

  const handleInteraction = (id: number, type: 'recommend' | 'notRecommend') => {
    setFeedItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const isOpeningCommentBox = !item.showCommentBox;
          let updatedRecommendations = item.recommendations;
          let updatedNotRecommendations = item.notRecommendations;

          if (isOpeningCommentBox) {
            if (type === 'recommend') updatedRecommendations += 1;
            else if (type === 'notRecommend') updatedNotRecommendations += 1;
          }
          return {
            ...item,
            recommendations: updatedRecommendations,
            notRecommendations: updatedNotRecommendations,
            showCommentBox: isOpeningCommentBox, 
            currentComment: '' 
          };
        }
        return item;
      })
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

  const handleCategoryClick = (id: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === id ? { ...category, viewed: true } : category
      )
    );
    const category = categories.find(c => c.id === id);
    toast({
        title: `Viewing ${category?.name || 'Category'}`,
        description: "Content for this category would load here in a full app.",
    });
  };

  return (
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
          />
        ))}
      </div>
    </main>
  );
};

export default FeedsScreen;
