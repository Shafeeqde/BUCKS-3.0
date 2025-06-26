
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useToast } from "@/hooks/use-toast";

interface CreateMomentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMoment: (imageUrl: string, caption?: string, aiHint?: string) => void;
}

const CreateMomentDialog: React.FC<CreateMomentDialogProps> = ({ isOpen, onClose, onCreateMoment }) => {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');
  const [aiHint, setAiHint] = useState('');
  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Image URL Required",
        description: "Please provide a URL for your moment's image.",
        variant: "destructive",
      });
      return;
    }
    setIsPosting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 750));
    onCreateMoment(imageUrl, caption, aiHint);
    setIsPosting(false);
    // Reset fields for next time
    setImageUrl('');
    setAiHint('');
    setCaption('');
    onClose(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PhotoIcon className="mr-2 h-5 w-5 text-primary" /> Create New Moment
          </DialogTitle>
          <DialogDescription>
            Share a quick moment with your followers. Add an image and an optional caption.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="momentImageUrl">Image URL <span className="text-destructive">*</span></Label>
            <Input
              id="momentImageUrl"
              placeholder="https://example.com/your-moment.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isPosting}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="momentAiHint">AI Hint (for image)</Label>
            <Input
              id="momentAiHint"
              placeholder="e.g., 'sunset beach', 'friends laughing'"
              value={aiHint}
              onChange={(e) => setAiHint(e.target.value)}
              disabled={isPosting}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="momentCaption">Caption (Optional)</Label>
            <Textarea
              id="momentCaption"
              placeholder="What's happening in this moment?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              disabled={isPosting}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPosting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={isPosting || !imageUrl.trim()}>
            {isPosting && <span className="mr-2 h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full"></span>}
            {isPosting ? 'Posting...' : 'Post Moment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMomentDialog;
