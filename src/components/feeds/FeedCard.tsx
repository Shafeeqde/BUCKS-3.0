
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ChatBubbleOvalLeftEllipsisIcon, EllipsisVerticalIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import type { FeedItem as FeedItemType } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface FeedCardProps {
  item: FeedItemType;
  onInteraction: (id: number, type: 'recommend' | 'notRecommend') => void;
  onViewUserProfile?: (profileId: string) => void;
  onViewUserMoments?: (profileId?: string, userName?: string, userAvatarUrl?: string, userAvatarAiHint?: string) => void;
  onViewDetail: () => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ 
  item, 
  onInteraction, 
  onViewUserProfile,
  onViewUserMoments,
  onViewDetail 
}) => {
  const { toast } = useToast();
  
  const handleUserClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); 
    if (item.profileId && onViewUserProfile) {
      onViewUserProfile(item.profileId);
    }
  };

  const handleAvatarClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); 
    if (item.profileId && onViewUserMoments) {
      onViewUserMoments(item.profileId, item.user, item.userImage, item.userImageAiHint);
    } else if (item.profileId && onViewUserProfile) { 
      onViewUserProfile(item.profileId);
    }
  };

  const handleDropdownAction = (action: 'Share' | 'Repost' | 'Save' | 'Report') => {
    toast({
      title: `${action} Action`,
      description: `${action} action for "${item.content.substring(0,20)}..." (Simulated).`,
      variant: action === 'Report' ? 'destructive' : 'default',
    });
  };

  const isNameClickable = !!(item.profileId && onViewUserProfile);
  const isAvatarClickable = !!(item.profileId && (onViewUserMoments || onViewUserProfile));


  return (
    <Card 
      className="shadow-sm hover:shadow-md transition-shadow duration-200"
      aria-label={`Post by ${item.user}`}
    >
      <CardHeader 
        className="flex flex-row items-center space-x-3 pb-3"
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
          onKeyDown={isNameClickable ? (e) => e.key === 'Enter' && handleUserClick(e) : undefined}
          tabIndex={isNameClickable ? 0 : undefined}
          role={isNameClickable ? "button" : undefined}
          aria-label={isNameClickable ? `View ${item.user}'s profile` : undefined}
        >
          <CardTitle className={cn("text-base font-semibold text-foreground font-headline", isNameClickable && "hover:text-primary hover:underline")}>{item.user}</CardTitle>
          <p className="text-sm text-muted-foreground">{item.type === 'ad' ? 'Sponsored' : item.timestamp}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground flex-shrink-0" onClick={(e) => e.stopPropagation()} aria-label="More options">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => handleDropdownAction('Share')}>Share Post</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropdownAction('Repost')}>Repost</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDropdownAction('Save')}>Save Post</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDropdownAction('Report')} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
              Report Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-3">
        {item.recommendedBy && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 p-2 bg-muted/50 rounded-md">
            <HandThumbUpIcon className="h-4 w-4 text-green-500"/>
            <span className="font-semibold">Recommended by {item.recommendedBy.name} and {item.recommendedBy.othersCount} others</span>
          </div>
        )}
        <p className="text-foreground mb-3 whitespace-pre-line">{item.content}</p>
        {item.media && item.media.type === 'image' && item.media.url && (
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-3 cursor-pointer" onClick={onViewDetail}>
            <Image src={item.media.url} alt={item.media.aiHint || "Feed content"} layout="fill" objectFit="cover" data-ai-hint={item.media.aiHint || "general image"}/>
          </div>
        )}
        <div className="flex items-center justify-between text-muted-foreground text-sm mt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetail(); }}
                className="flex items-center hover:text-primary focus:outline-none p-1 rounded-md hover:bg-accent/20"
                aria-label={`View comments for ${item.user}'s post`}
              >
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 mr-1.5" />
                <span className="text-xs">{item.comments}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent><p>View Comments & Details</p></TooltipContent>
          </Tooltip>

          <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
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
