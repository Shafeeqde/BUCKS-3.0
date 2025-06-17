
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import type { FeedItem as FeedItemType } from '@/types';
import { cn } from '@/lib/utils';

interface FeedCardProps {
  item: FeedItemType;
  onInteraction: (id: number, type: 'recommend' | 'notRecommend') => void;
  onViewUserProfile?: (profileId: string) => void;
  onViewUserMoments?: (profileId?: string, userName?: string, userAvatarUrl?: string, userAvatarAiHint?: string) => void;
  onViewDetail: () => void; // New prop
}

const FeedCard: React.FC<FeedCardProps> = ({ 
  item, 
  onInteraction, 
  onViewUserProfile,
  onViewUserMoments,
  onViewDetail // Use new prop
}) => {
  
  const handleUserClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent card click if name is clicked
    if (item.profileId && onViewUserProfile) {
      onViewUserProfile(item.profileId);
    }
  };

  const handleAvatarClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent card click if avatar is clicked
    if (item.profileId && onViewUserMoments) {
      onViewUserMoments(item.profileId, item.user, item.userImage, item.userImageAiHint);
    } else if (item.profileId && onViewUserProfile) { 
      onViewUserProfile(item.profileId);
    }
  };

  const isNameClickable = !!(item.profileId && onViewUserProfile);
  const isAvatarClickable = !!(item.profileId && (onViewUserMoments || onViewUserProfile));


  return (
    <Card 
      className="shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onViewDetail} // Make the whole card clickable to view detail
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetail()}
      aria-label={`View post by ${item.user}`}
    >
      <CardHeader 
        className="flex flex-row items-center space-x-3 pb-3"
        onClick={(e) => e.stopPropagation()} // Prevent card click from triggering if header elements are clicked
      >
        <Avatar 
          className={cn(
            isAvatarClickable && "cursor-pointer ring-offset-2 ring-offset-card hover:ring-2 hover:ring-primary transition-all"
          )}
          onClick={isAvatarClickable ? handleAvatarClick : undefined}
          onKeyDown={isAvatarClickable ? (e) => e.key === 'Enter' && handleAvatarClick(e) : undefined}
          role={isAvatarClickable ? "button" : undefined}
          tabIndex={isAvatarClickable ? 0 : undefined}
          aria-label={isAvatarClickable ? `View ${item.user}'s moments or profile` : `${item.user}'s avatar`}
        >
          <AvatarImage src={item.userImage} alt={item.user} data-ai-hint={item.userImageAiHint || "profile person"} />
          <AvatarFallback>{item.user.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div 
          className={cn(
            "flex-grow",
            isNameClickable && "cursor-pointer" 
          )}
          onClick={isNameClickable ? handleUserClick : undefined}
          onKeyDown={isNameClickable ? (e) => e.key === 'Enter' && handleUserClick() : undefined}
          tabIndex={isNameClickable ? 0 : undefined}
          role={isNameClickable ? "button" : undefined}
          aria-label={isNameClickable ? `View ${item.user}'s profile` : undefined}
        >
          <CardTitle className={cn("text-base font-semibold text-foreground font-headline", isNameClickable && "hover:text-primary hover:underline")}>{item.user}</CardTitle>
          <p className="text-sm text-muted-foreground">{item.timestamp}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-foreground mb-3">{item.content}</p>
        {item.media && item.media.type === 'image' && item.media.url && (
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-3">
            <Image src={item.media.url} alt={item.media.aiHint || "Feed content"} layout="fill" objectFit="cover" data-ai-hint={item.media.aiHint || "general image"}/>
          </div>
        )}
        {/* Add rendering for other media types if needed here, similar to AccountScreen */}
        <div className="flex items-center justify-between text-muted-foreground text-sm mt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetail(); }} // Comment icon now also navigates to detail
                className="flex items-center hover:text-primary focus:outline-none p-1 rounded-md hover:bg-accent/20"
                aria-label={`View comments for ${item.user}'s post`}
              >
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 mr-1.5" />
                <span className="text-xs">{item.comments}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent><p>View Comments</p></TooltipContent>
          </Tooltip>

          <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}> {/* Prevent card click for interactions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onInteraction(item.id, 'recommend')}
                  className="flex items-center text-green-600 hover:text-green-700 focus:outline-none p-1 rounded-md hover:bg-green-500/10"
                  aria-label="Recommend this post"
                >
                  <ArrowUpIcon className="w-5 h-5 mr-1" />
                  <span className="text-xs">{item.recommendations}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent><p>Recommend</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onInteraction(item.id, 'notRecommend')}
                  className="flex items-center text-red-600 hover:text-red-700 focus:outline-none p-1 rounded-md hover:bg-red-500/10"
                  aria-label="Not interested in this post"
                >
                  <ArrowDownIcon className="w-5 h-5 mr-1" />
                  <span className="text-xs">{item.notRecommendations}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent><p>Not interested</p></TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedCard;
