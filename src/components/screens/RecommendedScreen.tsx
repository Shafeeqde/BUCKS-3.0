
"use client";

import React from 'react';
import RecommendedPostCard from '@/components/recommended/RecommendedPostCard';
import type { RecommendedPost } from '@/types';
import { useToast } from "@/hooks/use-toast"; // Import useToast

const recommendedPostsData: RecommendedPost[] = [
    {
      id: 1, recommendedBy: 'Deepthi Suvarna', userImage: 'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnaXJsfGVufDB8fHx8MTc1MDA5Njc4NHww&ixlib=rb-4.1.0&q=80&w=1080', userImageAiHint: 'woman ux designer professional',
      recommenderProfileId: 'deepthi-suvarna-profile',
      title: 'Top 5 UX Principles for Mobile Apps', content: 'Boost your app\'s usability with these core UX principles, explained with examples.',
      thumbnail: 'https://source.unsplash.com/random/600x350/?mobile,app,design', thumbnailAiHint: 'mobile app design', type: 'image',
      otherRecommendersCount: 15,
    },
    {
      id: 2, recommendedBy: 'Senthil Devaraj', userImage: 'https://source.unsplash.com/random/40x40/?man,designer,indian', userImageAiHint: 'man designer indian',
      recommenderProfileId: 'senthil-devaraj-profile',
      title: 'A Day in the Life of a UI Designer', content: 'A short vlog showing the typical day, challenges, and creative process of a UI designer.',
      thumbnail: 'https://source.unsplash.com/random/600x350/?ui,design,workflow', thumbnailAiHint: 'ui design workflow', type: 'video',
      otherRecommendersCount: 22,
    },
    {
      id: 3, recommendedBy: 'Shoby C Chummar', userImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW58ZW58MHx8fHwxNzUwMDk2NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080', userImageAiHint: 'man founder creative studio',
      recommenderProfileId: 'shoby-c-profile',
      title: 'The Future of Branding in the Metaverse', content: 'Exploring how brands can build presence and engage users in virtual worlds.',
      thumbnail: 'https://source.unsplash.com/random/600x350/?metaverse,branding,virtual', thumbnailAiHint: 'metaverse branding virtual', type: 'image',
      otherRecommendersCount: 10,
    },
    {
      id: 4, recommendedBy: 'Maanisha K.', userImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8Z2lybHxlbnwwfHx8fDE3NTAwOTY3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080', userImageAiHint: 'woman creative designer indian',
      recommenderProfileId: 'maanisha-k-profile',
      title: "Mastering Design Systems: A Comprehensive Guide", content: 'Learn how to build, manage, and scale effective design systems for your products.',
      thumbnail: 'https://source.unsplash.com/random/600x350/?design,system,guide', thumbnailAiHint: 'design system guide', type: 'video',
      otherRecommendersCount: 5,
    },
     {
      id: 5, recommendedBy: 'Subhesh P.', userImage: 'https://source.unsplash.com/random/40x40/?man,team,lead,office', userImageAiHint: 'man team lead office',
      recommenderProfileId: 'subhesh-p-profile',
      title: "Leading Design Teams Remotely: Best Practices", content: 'Tips and strategies for managing and motivating design teams in a remote-first environment.',
      thumbnail: 'https://source.unsplash.com/random/600x350/?remote,team,collaboration', thumbnailAiHint: 'remote team collaboration', type: 'image',
    },
];

interface RecommendedScreenProps {
  onViewUserMomentsClick: (profileId?: string, userName?: string, userAvatarUrl?: string, userAvatarAiHint?: string) => void;
  onViewUserProfile: (profileId: string) => void;
  onViewPost: (postTitle: string) => void;
}

const RecommendedScreen: React.FC<RecommendedScreenProps> = ({ onViewUserMomentsClick, onViewUserProfile, onViewPost }) => {
  const { toast } = useToast();

  const handleViewRecommendedPost = (title: string) => {
    // This might eventually navigate to a detailed view. For now, it uses the onViewPost prop from AppRoot.
    onViewPost(title); 
  };
  
  return (
    <main className="flex-grow bg-background overflow-y-auto h-full custom-scrollbar p-4">
      <h2 className="text-2xl font-bold text-foreground mb-6 font-headline">Recommended for You</h2>
      <div className="space-y-4">
        {recommendedPostsData.map((post) => (
          <RecommendedPostCard 
            key={post.id} 
            post={post} 
            onViewUserMoments={onViewUserMomentsClick}
            onViewUserProfile={onViewUserProfile}
            onViewPost={handleViewRecommendedPost}
          />
        ))}
      </div>
    </main>
  );
};

export default RecommendedScreen;
