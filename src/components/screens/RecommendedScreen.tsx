
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MagnifyingGlassIcon, PhotoIcon, VideoCameraIcon, DocumentIcon, QueueListIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { recommendedItems as initialRecommendedItems } from '@/lib/dummy-data/recommendedItems';
import type { FeedItem } from '@/types';
import FeedCard from '@/components/feeds/FeedCard'; // Reusing FeedCard for consistency

interface RecommendedScreenProps {
  onViewPostDetail: (post: FeedItem) => void;
  onViewUserProfile?: (profileId: string) => void;
  onViewUserMoments?: (profileId?: string, userName?: string, userAvatarUrl?: string, userAvatarAiHint?: string) => void;
}

const RecommendedScreen: React.FC<RecommendedScreenProps> = ({
  onViewPostDetail,
  onViewUserProfile,
  onViewUserMoments
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendedItems, setRecommendedItems] = useState(initialRecommendedItems);

  const handleInteraction = (id: number, type: 'recommend' | 'notRecommend') => {
    setRecommendedItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? {
              ...item,
              recommendations: type === 'recommend' ? item.recommendations + 1 : item.recommendations,
              notRecommendations: type === 'notRecommend' ? item.notRecommendations + 1 : item.notRecommendations,
            }
          : item
      )
    );
  };

  const filteredItems = recommendedItems.filter(item => {
    const termMatch = searchTerm === '' || item.content.toLowerCase().includes(searchTerm.toLowerCase()) || item.user.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'all') return termMatch;
    if (activeFilter === 'images') return termMatch && item.media?.type === 'image';
    if (activeFilter === 'videos') return termMatch && item.media?.type === 'video';
    if (activeFilter === 'files') return termMatch && item.media?.type === 'document';
    return termMatch;
  });

  return (
    <ScrollArea className="h-full bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 -mx-4 -mt-6 px-4 pt-6 pb-4 mb-6 border-b">
          <h2 className="text-2xl font-bold text-foreground font-headline mb-4">Recommended</h2>
          <div className="relative mb-3">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search recommended content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-1">
            <Button variant={activeFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter('all')} className="rounded-full"><QueueListIcon className="mr-1.5 h-4 w-4"/>All</Button>
            <Button variant={activeFilter === 'images' ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter('images')} className="rounded-full"><PhotoIcon className="mr-1.5 h-4 w-4"/>Images</Button>
            <Button variant={activeFilter === 'videos' ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter('videos')} className="rounded-full"><VideoCameraIcon className="mr-1.5 h-4 w-4"/>Videos</Button>
            <Button variant={activeFilter === 'files' ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter('files')} className="rounded-full"><DocumentIcon className="mr-1.5 h-4 w-4"/>Files</Button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No content found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                onInteraction={handleInteraction}
                onViewDetail={() => onViewPostDetail(item)}
                onViewUserProfile={onViewUserProfile}
                onViewUserMoments={onViewUserMoments}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default RecommendedScreen;
