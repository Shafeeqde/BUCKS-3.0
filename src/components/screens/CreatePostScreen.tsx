
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

interface CreatePostScreenProps {
  onPost: (content: string, media?: MediaAttachment) => void;
  onCancel: () => void;
}

type MediaDialogType = 'image' | 'video' | 'document' | null;

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ onPost, onCancel }) => {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<MediaAttachment | null>(null);

  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [currentDialogType, setCurrentDialogType] = useState<MediaDialogType>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaAiHint, setMediaAiHint] = useState('');
  const [mediaThumbnailUrl, setMediaThumbnailUrl] = useState('');
  const [mediaFileName, setMediaFileName] = useState('');


  const handleOpenMediaDialog = (type: MediaDialogType) => {
    setCurrentDialogType(type);
    setMediaUrl('');
    setMediaAiHint('');
    setMediaThumbnailUrl('');
    setMediaFileName('');
    setShowMediaDialog(true);
  };

  const handleAttachMedia = () => {
    if (!currentDialogType) return;

    let newMedia: MediaAttachment | null = null;
    switch (currentDialogType) {
      case 'image':
        if (!mediaUrl) {
          toast({ title: "Image URL Required", variant: "destructive" });
          return;
        }
        newMedia = { type: 'image', url: mediaUrl, aiHint: mediaAiHint || undefined };
        break;
      case 'video':
        if (!mediaUrl) {
          toast({ title: "Video URL Required", variant: "destructive" });
          return;
        }
        newMedia = { type: 'video', url: mediaUrl, thumbnailUrl: mediaThumbnailUrl || undefined };
        break;
      case 'document':
         if (!mediaUrl) { // Using mediaUrl for document link for now
          toast({ title: "Document URL/Link Required", variant: "destructive" });
          return;
        }
        newMedia = { type: 'document', url: mediaUrl, fileName: mediaFileName || 'Attached Document' };
        break;
    }

    if (newMedia) {
      setAttachedMedia(newMedia);
    }
    setShowMediaDialog(false);
  };
  
  const removeAttachedMedia = () => {
    setAttachedMedia(null);
  };

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
    // Navigation back to account screen is handled by the onPost callback in page.tsx
  };

  const renderMediaDialogContent = () => {
    switch (currentDialogType) {
      case 'image':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
              <DialogDescription>Enter the URL for your image and an optional AI hint.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://example.com/image.png" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="imageAiHint">AI Hint (for image search)</Label>
                <Input id="imageAiHint" value={mediaAiHint} onChange={(e) => setMediaAiHint(e.target.value)} placeholder="e.g., 'sunset over mountains'" />
              </div>
            </div>
          </>
        );
      case 'video':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Add Video</DialogTitle>
              <DialogDescription>Enter the URL for your video and an optional thumbnail URL.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input id="videoUrl" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="space-y-1">
                <Label htmlFor="videoThumbnailUrl">Thumbnail URL (Optional)</Label>
                <Input id="videoThumbnailUrl" value={mediaThumbnailUrl} onChange={(e) => setMediaThumbnailUrl(e.target.value)} placeholder="https://example.com/thumbnail.png" />
              </div>
            </div>
          </>
        );
      case 'document':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Add Document</DialogTitle>
              <DialogDescription>Enter a URL/link to your document and an optional file name.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
               <div className="space-y-1">
                <Label htmlFor="docUrl">Document URL/Link</Label>
                <Input id="docUrl" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://example.com/document.pdf" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="docFileName">File Name (Optional)</Label>
                <Input id="docFileName" value={mediaFileName} onChange={(e) => setMediaFileName(e.target.value)} placeholder="e.g., 'Project Proposal.pdf'" />
              </div>
            </div>
          </>
        );
      default:
        return null;
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
          {attachedMedia && (
            <div className="mt-3 p-3 border rounded-md bg-muted/50 relative">
              <p className="text-sm font-medium text-foreground mb-2">Attached Media:</p>
              {attachedMedia.type === 'image' && (
                <Image src={attachedMedia.url} alt={attachedMedia.aiHint || 'Attached image'} width={100} height={100} className="rounded-md border object-cover" data-ai-hint={attachedMedia.aiHint || "post image"}/>
              )}
              {attachedMedia.type === 'video' && (
                <div className="w-24 h-24 bg-black rounded-md flex items-center justify-center relative">
                  {attachedMedia.thumbnailUrl ? (
                    <Image src={attachedMedia.thumbnailUrl} alt="Video thumbnail" layout="fill" objectFit="cover" className="rounded-md" data-ai-hint="video thumbnail"/>
                  ) : (
                    <VideoCameraIcon className="h-10 w-10 text-white" />
                  )}
                   <VideoCameraIcon className="absolute h-6 w-6 text-white opacity-80" />
                </div>
              )}
              {attachedMedia.type === 'document' && (
                <div className="flex items-center space-x-2 p-2 bg-background rounded-md border">
                  <DocumentPlusIcon className="h-8 w-8 text-primary" />
                  <span className="text-sm text-foreground truncate">{attachedMedia.fileName || attachedMedia.url}</span>
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={removeAttachedMedia} className="absolute top-1 right-1 h-6 w-6 text-destructive hover:bg-destructive/10" aria-label="Remove media">
                <XCircleIcon className="h-5 w-5"/>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isPosting || !!attachedMedia}>
                <PhotoIcon className="mr-2 h-4 w-4" /> Add Media
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleOpenMediaDialog('image')}><PhotoIcon className="mr-2 h-4 w-4"/>Add Image</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenMediaDialog('video')}><VideoCameraIcon className="mr-2 h-4 w-4"/>Add Video</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenMediaDialog('document')}><DocumentPlusIcon className="mr-2 h-4 w-4"/>Add Document</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

      <Dialog open={showMediaDialog} onOpenChange={setShowMediaDialog}>
        <DialogContent>
          {renderMediaDialogContent()}
          {currentDialogType && (
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleAttachMedia}>Attach Media</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePostScreen;
