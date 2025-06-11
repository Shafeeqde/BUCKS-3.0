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
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'food meal', type: 'image',
    },
    {
      id: 4, recommendedBy: 'Maanisha', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'woman professional',
      title: "Beginner's Guide to Investing", content: 'Understanding the basics of stock market and mutual funds.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'charts finance', type: 'video',
    },
    {
      id: 5, recommendedBy: 'Subhesh', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'man casual',
      title: 'DIY Home Decor Projects', content: 'Transform your living space with these creative and easy projects.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'home interior', type: 'image',
    },
    {
      id: 6, recommendedBy: 'Seena', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'woman fitness',
      title: 'Fitness Routines for Small Spaces', content: 'Stay active even with limited room and equipment.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'yoga exercise', type: 'video',
    },
     {
      id: 7, recommendedBy: 'Shafeeq', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'man glasses',
      title: 'Understanding Artificial Intelligence', content: 'A simple explanation of AI concepts and its impact.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'robot technology', type: 'image',
    },
    {
      id: 8, recommendedBy: 'Senthil', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'man smiling',
      title: 'Mastering Digital Photography', content: 'Tips and tricks for capturing stunning photos with your smartphone.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'camera photo', type: 'image',
    },
    {
      id: 9, recommendedBy: 'Deepthi', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'woman nature',
      title: 'The Future of Sustainable Living', content: 'Innovative ideas for an eco-friendly lifestyle.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'green energy', type: 'video',
    },
    {
      id: 10, recommendedBy: 'Maanisha', userImage: 'https://placehold.co/40x40.png', userImageAiHint: 'woman professional',
      title: 'Learn to Code in 30 Days', content: 'A structured plan to kickstart your programming journey.',
      thumbnail: 'https://placehold.co/600x350.png', thumbnailAiHint: 'laptop code', type: 'image',
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
      </div>
    </main>
  );
};

export default RecommendedScreen;
