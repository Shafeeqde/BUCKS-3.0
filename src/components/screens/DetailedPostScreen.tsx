
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftIcon, PaperAirplaneIcon, PhotoIcon, VideoCameraIcon, DocumentIcon, HandThumbUpIcon, ChatBubbleOvalLeftEllipsisIcon, ShareIcon } from '@heroicons/react/24/outline';
import type { FeedItem, ProfilePost, Comment as CommentType, MediaAttachment } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';

interface DetailedPostScreenProps {
  post: FeedItem | ProfilePost | null;
  onPostComment: (commentText: string) => void;
  onBack: () => void;
}

const DetailedPostScreen: React.FC<DetailedPostScreenProps> = ({ post, onPostComment, onBack }) => {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-lg text-muted-foreground">Post not found or loading...</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toast({ title: "Empty Comment", description: "Please write something to comment.", variant: "destructive" });
      return;
    }
    setIsPostingComment(true);
    // Simulate API call for posting comment
    setTimeout(() => {
      onPostComment(newComment);
      setNewComment('');
      setIsPostingComment(false);
      // Toasting is handled in page.tsx
    }, 750);
  };

  const renderMedia = (media: MediaAttachment) => {
    if (!media.url) return null;
    switch (media.type) {
      case 'image':
        return <Image src={media.url} alt={media.aiHint || 'Post image'} width={800} height={450} className="rounded-lg object-cover w-full border" data-ai-hint={media.aiHint || "post image"} />;
      case 'video':
        return (
          <div className="bg-black aspect-video rounded-lg flex items-center justify-center">
            {media.thumbnailUrl ? (
              <Image src={media.thumbnailUrl} alt="Video thumbnail" fill objectFit="contain" data-ai-hint="video thumbnail"/>
            ) : (
              <VideoCameraIcon className="h-24 w-24 text-white/70" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <VideoCameraIcon className="h-16 w-16 text-white opacity-80 drop-shadow-lg cursor-pointer hover:opacity-100" onClick={() => toast({title: "Play Video (Mock)", description: "Video playback would start here."})}/>
            </div>
          </div>
        );
      case 'document':
        return (
          <a href={media.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-muted hover:bg-muted/80 rounded-lg border transition-colors">
            <div className="flex items-center space-x-3">
              <DocumentIcon className="h-10 w-10 text-primary flex-shrink-0" />
              <div>
                <p className="text-md font-medium text-foreground truncate">{media.fileName || 'Attached Document'}</p>
                <p className="text-sm text-primary hover:underline">View/Download Document</p>
              </div>
            </div>
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-3xl mx-auto p-4">
        <Button onClick={onBack} variant="ghost" className="mb-4 px-2">
          <ArrowLeftIcon className="mr-2 h-5 w-5" /> Back
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-11 w-11">
                <AvatarImage src={post.userImage} alt={post.user} data-ai-hint={post.userImageAiHint || "user avatar"} />
                <AvatarFallback>{post.user.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">{post.user}</CardTitle>
                <CardDescription className="text-xs">{post.timestamp}</CardDescription>
              </div>
            </div>
            {post.content && <p className="text-foreground whitespace-pre-line text-base">{post.content}</p>}
          </CardHeader>

          {post.media && (
            <CardContent className="pt-0">
              <div className="my-4">
                {renderMedia(post.media)}
              </div>
            </CardContent>
          )}

          <CardFooter className="border-t pt-4 flex flex-col gap-4">
            <div className="flex justify-around w-full text-muted-foreground">
              <Button variant="ghost" size="sm" className="flex-1 text-sm">
                <HandThumbUpIcon className="mr-1.5 h-5 w-5" /> Like ({
  'likes' in post
    ? post.likes
    : 'recommendations' in post
      ? post.recommendations
      : 0
})
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-sm text-primary font-semibold">
                <ChatBubbleOvalLeftEllipsisIcon className="mr-1.5 h-5 w-5" /> Comment ({post.commentsData?.length ?? post.comments ?? 0})
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-sm">
                <ShareIcon className="mr-1.5 h-5 w-5" /> Share
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Comments</h3>
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-9 w-9 mt-1">
                  {/* TODO: Get current logged in user avatar */}
                  <AvatarImage src={post.userImage} alt="Your avatar" data-ai-hint="user avatar"/>
                  <AvatarFallback>YOU</AvatarFallback>
                </Avatar>
                <div className="flex-grow space-y-2">
                  <Textarea
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    disabled={isPostingComment}
                  />
                  <Button onClick={handleCommentSubmit} disabled={isPostingComment || !newComment.trim()} size="sm">
                    {isPostingComment && <span className="mr-2 h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full"></span>}
                    {isPostingComment ? "Posting..." : "Post Comment"}
                    {!isPostingComment && <PaperAirplaneIcon className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {post.commentsData && post.commentsData.length > 0 ? (
            <div className="space-y-4">
              {post.commentsData.map((comment) => (
                <Card key={comment.id} className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.userAvatar} alt={comment.user} data-ai-hint={comment.userAvatarAiHint || "commenter avatar"} />
                        <AvatarFallback>{comment.user.substring(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex items-baseline justify-between">
                           <p className="text-sm font-semibold text-foreground">{comment.user}</p>
                           <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-line">{comment.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default DetailedPostScreen;
