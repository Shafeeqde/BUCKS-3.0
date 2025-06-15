
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  onCommentChange: (id: number, value: string) => void;
  onPostComment: (id: number) => void;
  onToggleCommentBox: (id: number) => void;
  onViewUserProfile?: (profileId: string) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ item, onInteraction, onCommentChange, onPostComment, onToggleCommentBox, onViewUserProfile }) => {
  
  const handleUserClick = () => {
    if (item.profileId && onViewUserProfile) {
      onViewUserProfile(item.profileId);
    }
  };

  const isClickable = !!(item.profileId && onViewUserProfile);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader 
        className={cn(
          "flex flex-row items-center space-x-3 pb-3",
          isClickable && "cursor-pointer hover:bg-muted/50"
        )}
        onClick={isClickable ? handleUserClick : undefined}
        onKeyDown={isClickable ? (e) => e.key === 'Enter' && handleUserClick() : undefined}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? "button" : undefined}
        aria-label={isClickable ? `View ${item.user}'s profile` : undefined}
      >
        <Avatar>
          <AvatarImage src={item.userImage} alt={item.user} data-ai-hint={item.userImageAiHint || "profile person"} />
          <AvatarFallback>{item.user.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className={cn("text-base font-semibold text-foreground font-headline", isClickable && "group-hover:text-primary group-hover:underline")}>{item.user}</CardTitle>
          <p className="text-sm text-muted-foreground">{item.timestamp}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-foreground mb-3">{item.content}</p>
        {item.postImage && (
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-3">
            <Image src={item.postImage} alt="Feed content" layout="fill" objectFit="cover" data-ai-hint={item.postImageAiHint || "general image"}/>
          </div>
        )}
        <div className="flex items-center justify-between text-muted-foreground text-sm mt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToggleCommentBox(item.id)}
                className="flex items-center hover:text-primary focus:outline-none p-1 rounded-md hover:bg-accent/20"
                aria-label={`View or add comments for ${item.user}'s post`}
              >
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 mr-1.5" />
                <span className="text-xs">{item.comments}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Comments</p></TooltipContent>
          </Tooltip>

          <div className="flex items-center space-x-3">
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
      
      {item.showCommentBox && (
        <div className="p-4 border-t border-border flex flex-col space-y-2">
          <Textarea
            className="w-full p-3 border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={3}
            placeholder="Write your comment..."
            value={item.currentComment}
            onChange={(e) => onCommentChange(item.id, e.target.value)}
          />
          <Button
            className="self-end bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full shadow-md"
            onClick={() => onPostComment(item.id)}
            disabled={!item.currentComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FeedCard;
