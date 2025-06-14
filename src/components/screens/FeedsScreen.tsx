
"use client";

import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Baseline, Loader2 } from 'lucide-react';
import CategoryItem from '@/components/feeds/CategoryItem';
import FeedCard from '@/components/feeds/FeedCard';
import type { Category, FeedItem as FeedItemType } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const initialCategories: Category[] = [
  { id: 'moments-0', name: 'Your Moments', icon: Plus, type: 'moments', viewed: false, color: 'bg-primary/10 text-primary' },
  { id: 'feed-deepthi', name: 'Deepthi', image: 'https://source.unsplash.com/random/100x100/?woman,portrait', dataAiHint: 'woman portrait', viewed: false },
  { id: 'feed-maanisha', name: 'Maanisha', image: 'https://source.unsplash.com/random/100x100/?woman,smiling', dataAiHint: 'woman smiling', viewed: false },
  { id: 'feed-subhesh', name: 'Subhesh', image: 'https://source.unsplash.com/random/100x100/?man,office', dataAiHint: 'man office', viewed: true },
  { id: 'feed-seena', name: 'Seena', image: 'https://source.unsplash.com/random/100x100/?person,outdoor', dataAiHint: 'person outdoor', viewed: false },
  { id: 'feed-1', name: 'Shafeeq', image: 'https://source.unsplash.com/random/100x100/?man,casual', dataAiHint: 'man casual', viewed: false },
  { id: 'feed-2', name: 'Senthil', image: 'https://source.unsplash.com/random/100x100/?person,tech', dataAiHint: 'person tech', viewed: true },
  { id: 'feed-3', name: 'Mikado', image: 'https://source.unsplash.com/random/100x100/?company,logo', dataAiHint: 'company logo', viewed: true },
  { id: 'feed-4', name: 'TVS Synergy', image: 'https://source.unsplash.com/random/100x100/?vehicle,brand', dataAiHint: 'vehicle brand', viewed: false },
];

const initialFeedItems: FeedItemType[] = [
  {
    id: 1, type: 'post', user: 'Shafeeq', userImage: 'https://source.unsplash.com/random/40x40/?man,casual', userImageAiHint: 'man casual',
    timestamp: 'Wishing you a joyful and prosperous Diwali',
    content: 'May this festival of lights bring happiness, success, and warmth to your lives.',
    postImage: 'https://source.unsplash.com/random/600x350/?diwali,festival', postImageAiHint: 'diwali festival',
    comments: 7, recommendations: 10, notRecommendations: 2, showCommentBox: false, currentComment: ''
  },
  {
    id: 2, type: 'post', user: 'Senthil Devaraj', userImage: 'https://source.unsplash.com/random/40x40/?man,professional', userImageAiHint: 'man professional',
    timestamp: 'Unemployed for 12 months, seeking opportunities.',
    content: 'Hi Guys, I have been Unemployed for 12 months now, please help by reviewing my resume and please help if there are any opportunities. Senthil Devaraj Resume.',
    comments: 12, recommendations: 5, notRecommendations: 1, showCommentBox: false, currentComment: ''
  },
  {
    id: 3, type: 'job', user: 'Mikado UX UI', userImage: 'https://source.unsplash.com/random/40x40/?design,studio,logo', userImageAiHint: 'design studio logo',
    timestamp: 'Hiring Graphic Designer',
    content: 'Hi Design Enthusiast , we are in search of the graphic Designer with Illustrative and sketching skills , check out your Job portal and share you resume and please suggest you known persons if you know someone as we expected.',
    comments: 20, recommendations: 25, notRecommendations: 3, showCommentBox: false, currentComment: ''
  },
  {
    id: 4, type: 'ad', user: 'TVS Synergy', userImage: 'https://source.unsplash.com/random/40x40/?automotive,brand', userImageAiHint: 'automotive brand',
    postImage: 'https://source.unsplash.com/random/600x350/?scooter,advertisement', postImageAiHint: 'scooter advertisement',
    content: 'TVS Ntorq 125 Price : Check On-Road & Ex-Showroom Prices of All Variants -',
    timestamp: 'Sponsored Ad', comments: 0, recommendations: 15, notRecommendations: 0, showCommentBox: false, currentComment: ''
  }
];

const FeedsScreen = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [feedItems, setFeedItems] = useState<FeedItemType[]>(initialFeedItems);
  const { toast } = useToast();

  const [showCreateMomentDialog, setShowCreateMomentDialog] = useState(false);
  const [momentImageUrl, setMomentImageUrl] = useState('');
  const [momentText, setMomentText] = useState('');
  const [isPostingMoment, setIsPostingMoment] = useState(false);

  const handleInteraction = (id: number, type: 'recommend' | 'notRecommend') => {
    setFeedItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const isOpeningCommentBox = !item.showCommentBox;
          let updatedRecommendations = item.recommendations;
          let updatedNotRecommendations = item.notRecommendations;

          if (isOpeningCommentBox) {
            if (type === 'recommend') updatedRecommendations += 1;
            else if (type === 'notRecommend') updatedNotRecommendations += 1;
          }
          return {
            ...item,
            recommendations: updatedRecommendations,
            notRecommendations: updatedNotRecommendations,
            showCommentBox: isOpeningCommentBox,
            currentComment: ''
          };
        }
        return item;
      })
    );
  };

  const handleCommentChange = (id: number, value: string) => {
    setFeedItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, currentComment: value } : item
      )
    );
  };

  const handlePostComment = (id: number) => {
    const item = feedItems.find(i => i.id === id);
    if (item && item.currentComment.trim()) {
       toast({
        title: "Comment Posted!",
        description: `Your comment on ${item.user}'s post has been submitted.`,
      });
      setFeedItems(prevItems =>
        prevItems.map(i =>
          i.id === id ? { ...i, currentComment: '', showCommentBox: false, comments: i.comments + 1 } : i
        )
      );
    }
  };

  const handleCategoryClick = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category?.type === 'moments' && category.id === 'moments-0') {
      setMomentImageUrl('');
      setMomentText('');
      setShowCreateMomentDialog(true);
    } else {
      setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.id === id ? { ...cat, viewed: true } : cat
        )
      );
      toast({
          title: `Viewing ${category?.name || 'Category'}`,
          description: "Content for this category would load here in a full app.",
      });
    }
  };

  const handlePostMoment = async () => {
    if (!momentImageUrl.trim() && !momentText.trim()) {
      toast({
        title: "Cannot Post Empty Moment",
        description: "Please add an image URL or some text for your moment.",
        variant: "destructive",
      });
      return;
    }
    setIsPostingMoment(true);
    // Simulate posting the moment
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    console.log("Posting moment:", { imageUrl: momentImageUrl, text: momentText });
    toast({
      title: "Moment Posted! (Simulated)",
      description: "Your moment has been shared.",
    });
    setShowCreateMomentDialog(false);
    setMomentImageUrl('');
    setMomentText('');
    setIsPostingMoment(false);
    // In a real app, you'd add this moment to a list and potentially update the "Your Moments" category visual
  };

  return (
    <>
      <main className="flex-grow bg-background overflow-y-auto h-full custom-scrollbar">
        <div className="flex py-3 border-b border-border overflow-x-auto custom-scrollbar px-4 space-x-3 bg-card sticky top-0 z-[5]">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} onClick={handleCategoryClick} />
          ))}
        </div>

        <div className="p-4 space-y-4">
          {feedItems.map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              onInteraction={handleInteraction}
              onCommentChange={handleCommentChange}
              onPostComment={handlePostComment}
            />
          ))}
        </div>
      </main>

      <Dialog open={showCreateMomentDialog} onOpenChange={setShowCreateMomentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5 text-primary" /> Create Your Moment
            </DialogTitle>
            <DialogDescription>
              Share an image and a short text with your followers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="momentImageUrl" className="flex items-center">
                <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Image URL
              </Label>
              <Input
                id="momentImageUrl"
                placeholder="https://example.com/image.png"
                value={momentImageUrl}
                onChange={(e) => setMomentImageUrl(e.target.value)}
                disabled={isPostingMoment}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="momentText" className="flex items-center">
                <Baseline className="mr-2 h-4 w-4 text-muted-foreground" /> Your Text
              </Label>
              <Textarea
                id="momentText"
                placeholder="What's happening?"
                value={momentText}
                onChange={(e) => setMomentText(e.target.value)}
                rows={3}
                disabled={isPostingMoment}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPostingMoment}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handlePostMoment} disabled={isPostingMoment}>
              {isPostingMoment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPostingMoment ? 'Posting...' : 'Post Moment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedsScreen;
    