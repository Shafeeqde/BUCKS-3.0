
"use client";

import React from 'react';
import RecommendedPostCard from '@/components/recommended/RecommendedPostCard';
import type { RecommendedPost } from '@/types';

const recommendedPostsData: RecommendedPost[] = [
    {
      id: 1, recommendedBy: 'Shafeeq', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'man glasses',
      title: 'Top 5 Productivity Hacks', content: 'Boost your daily efficiency with these simple yet effective tips.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'desk computer', type: 'image',
    },
    {
      id: 2, recommendedBy: 'Senthil', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'man smiling',
      title: 'Exploring Hidden Gems in Bangalore', content: 'A travel vlog discovering lesser-known spots in the city.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'city street', type: 'video',
    },
    {
      id: 3, recommendedBy: 'Deepthi', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'woman nature',
      title: 'Healthy Meal Prep Ideas for Busy Weeks', content: 'Quick and nutritious recipes to keep you energized.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'healthy food', type: 'image',
    },
    {
      id: 4, recommendedBy: 'Maanisha', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'woman professional',
      title: "Beginner's Guide to Investing", content: 'Understanding the basics of stock market and mutual funds.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'finance chart', type: 'video',
    },
];

const RecommendedScreen = () => {
  return (
    <main className="flex-grow bg-background overflow-y-auto p-4 h-full custom-scrollbar">
      <h2 className="text-2xl font-bold text-foreground mb-6 font-headline">Recommended for You</h2>
      <div className="space-y-4">
        {recommendedPostsData.map((post) => (
          <RecommendedPostCard key={post.id} post={post} />
        ))}
         {/* Add a few more for better scroll */}
        {recommendedPostsData.slice(0,2).map((post, index) => (
          <RecommendedPostCard key={`extra-${post.id}-${index}`} post={{...post, id: post.id + 100 + index, title: `${post.title} (More)`}} />
        ))}
      </div>
    </main>
  );
};

export default RecommendedScreen;
