
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PlayIcon from '@/components/icons/PlayIcon';
import type { RecommendedPost } from '@/types';

interface RecommendedPostCardProps {
  post: RecommendedPost;
}

const RecommendedPostCard: React.FC<RecommendedPostCardProps> = ({ post }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center space-x-2 pb-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={post.userImage} alt={post.recommendedBy} data-ai-hint={post.userImageAiHint || "person avatar"} />
          <AvatarFallback>{post.recommendedBy.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold text-foreground">Recommended by {post.recommendedBy}</p>
      </CardHeader>
      <CardContent>
        {post.thumbnail && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
            <Image src={post.thumbnail} alt={post.title} layout="fill" objectFit="cover" data-ai-hint={post.thumbnailAiHint || "content thumbnail"} />
            {post.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <PlayIcon className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
        )}
        <CardTitle className="text-lg font-semibold text-foreground mb-2 font-headline">{post.title}</CardTitle>
        <CardDescription className="text-muted-foreground">{post.content}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default RecommendedPostCard;
