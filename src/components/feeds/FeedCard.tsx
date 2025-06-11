"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import type { FeedItem as FeedItemType } from '@/types';

interface FeedCardProps {
  item: FeedItemType;
  onInteraction: (id: number, type: 'recommend' | 'notRecommend') => void;
  onCommentChange: (id: number, value: string) => void;
  onPostComment: (id: number) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ item, onInteraction, onCommentChange, onPostComment }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Avatar>
          <AvatarImage src={item.userImage} alt={item.user} data-ai-hint={item.userImageAiHint || "profile person"} />
          <AvatarFallback>{item.user.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className="text-base font-semibold text-foreground font-headline">{item.user}</CardTitle>
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
        <div className="flex items-center text-muted-foreground text-sm">
          <span className="mr-4">💬 {item.comments}</span>
          <span className="mr-4">👍 {item.recommendations}</span>
          <span>👎 {item.notRecommendations}</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch p-0">
        <div className="flex justify-around border-t pt-3 pb-3 px-4">
          <Button
            variant="ghost"
            className="flex items-center text-primary hover:bg-primary/10 hover:text-primary font-medium px-4 py-2 rounded-full"
            onClick={() => onInteraction(item.id, 'recommend')}
          >
            <ArrowUpIcon className="mr-1 w-5 h-5" />
            Recommend
          </Button>
          <Button
            variant="ghost"
            className="flex items-center text-destructive hover:bg-destructive/10 hover:text-destructive font-medium px-4 py-2 rounded-full"
            onClick={() => onInteraction(item.id, 'notRecommend')}
          >
            <ArrowDownIcon className="mr-1 w-5 h-5" />
            Not Recommend
          </Button>
        </div>

        {item.showCommentBox && (
          <div className="p-4 border-t flex flex-col space-y-2">
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
      </CardFooter>
    </Card>
  );
};

export default FeedCard;
