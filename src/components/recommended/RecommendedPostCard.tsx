
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PlayIcon from '@/components/icons/PlayIcon';
import type { RecommendedPost } from '@/types';
import { HandThumbUpIcon } from '@heroicons/react/24/outline'; // For recommendation icon

const RecommendedPostCard: React.FC<RecommendedPostCardProps> = ({ post }) => {
  let recommendationText = `Recommended by ${post.recommendedBy}`;
  if (post.otherRecommendersCount && post.otherRecommendersCount > 0) {
    recommendationText += ` and ${post.otherRecommendersCount} others`;
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start space-x-3 pb-3">
        <Avatar className="w-10 h-10 border">
          <AvatarImage src={post.userImage} alt={post.recommendedBy} data-ai-hint={post.userImageAiHint || "person avatar"} />
          <AvatarFallback>{post.recommendedBy.substring(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
                 <HandThumbUpIcon className="w-4 h-4 mr-1.5 text-primary" />
                <span className="font-semibold text-primary">{post.recommendedBy}</span>
                {post.otherRecommendersCount && post.otherRecommendersCount > 0 && (
                   <span className="ml-1">and {post.otherRecommendersCount} others recommended</span>
                )}
                {!(post.otherRecommendersCount && post.otherRecommendersCount > 0) && (
                     <span className="ml-1">recommended</span>
                )}
            </div>
            <CardTitle className="text-lg font-semibold text-foreground mb-0 font-headline">{post.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {post.thumbnail && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 shadow-inner">
            <Image src={post.thumbnail} alt={post.title} layout="fill" objectFit="cover" data-ai-hint={post.thumbnailAiHint || "content thumbnail"} />
            {post.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <PlayIcon className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
        )}
        <CardDescription className="text-muted-foreground line-clamp-3">{post.content}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default RecommendedPostCard;
