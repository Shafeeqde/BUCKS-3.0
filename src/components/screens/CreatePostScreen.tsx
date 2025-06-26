
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ArrowLeftIcon, PaperAirplaneIcon, PhotoIcon, VideoCameraIcon, DocumentPlusIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useToast } from "@/hooks/use-toast";
import type { MediaAttachment } from '@/types';
import ImageUpload from '@/components/ui/ImageUpload';

interface CreatePostScreenProps {
  onPost: (content: string, media?: MediaAttachment) => void;
  onCancel: () => void;
}

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ onPost, onCancel }) => {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<MediaAttachment | null>(null);

  const handlePostSubmit = async () => {
    if (!postContent.trim() && !attachedMedia) {
      toast({
        title: "Empty Post",
        description: "Please write something or attach media.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onPost(postContent, attachedMedia || undefined); 
    
    setIsPosting(false);
    setPostContent('');
    setAttachedMedia(null);
  };
  
  const handleMediaUploadComplete = (url: string) => {
    if(url) {
      setAttachedMedia({ type: 'image', url });
    } else {
      setAttachedMedia(null);
    }
  };


  return (
    <div className="flex flex-col h-full p-4 bg-muted/30">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onCancel} className="mr-2 text-muted-foreground hover:text-primary">
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-foreground font-headline">Create New Post</h2>
      </div>

      <Card className="flex-grow flex flex-col shadow-xl">
        <CardHeader>
          <CardTitle>What's on your mind?</CardTitle>
          <CardDescription>Share your thoughts, updates, or media with your followers.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col space-y-4">
          <div className="flex-grow">
            <Label htmlFor="postContent" className="sr-only">Post Content</Label>
            <Textarea
              id="postContent"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Write your post here..."
              className="h-full resize-none text-base"
              disabled={isPosting}
            />
          </div>
          
          <ImageUpload
            label="Attach an Image"
            onUploadComplete={handleMediaUploadComplete}
            initialImageUrl={attachedMedia?.type === 'image' ? attachedMedia.url : null}
          />
         
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-end items-center gap-3">
          <Button 
            onClick={handlePostSubmit} 
            disabled={isPosting || (!postContent.trim() && !attachedMedia)}
            className="w-full sm:w-auto"
          >
            {isPosting ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <PaperAirplaneIcon className="mr-2 h-4 w-4" />
            )}
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreatePostScreen;
