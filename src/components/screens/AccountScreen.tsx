
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCircleIcon, PlusCircleIcon, PhotoIcon, FilmIcon, LinkIcon as LinkOutlineIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, QueueListIcon, DocumentIcon, VideoCameraIcon, PlusIcon, TruckIcon, BikeIcon } from '@heroicons/react/24/outline'; // Using BikeIcon from lucide-react below instead if available
import { Bike } from 'lucide-react'; // Using Lucide for Bike icon
import type { TabName, UserDataForSideMenu, ProfilePost, UserMoment, FeedItem } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface AccountScreenProps {
  userData: UserDataForSideMenu | null;
  setActiveTab: (tab: TabName) => void;
  userPosts: ProfilePost[];
  userMoments: UserMoment[];
  onAddMomentClick: () => void;
  onViewUserMomentsClick: () => void;
  onViewPostDetail: (post: ProfilePost | FeedItem) => void;
  isTaxiDriverOnline: boolean;
  onToggleTaxiDriverOnline: () => void;
  isDeliveryDriverOnline: boolean;
  onToggleDeliveryDriverOnline: () => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ 
  userData, 
  setActiveTab, 
  userPosts, 
  userMoments, 
  onAddMomentClick, 
  onViewUserMomentsClick,
  onViewPostDetail,
  isTaxiDriverOnline,
  onToggleTaxiDriverOnline,
  isDeliveryDriverOnline,
  onToggleDeliveryDriverOnline,
}) => {
  const { toast } = useToast();

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <UserCircleIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">User data not available.</p>
        <p className="text-sm text-muted-foreground">Please log in to view your account.</p>
      </div>
    );
  }

  const handleManageProfessionalProfile = () => {
    setActiveTab('professional-profile');
  };

  const handleCreatePost = () => {
    setActiveTab('create-post');
  };

  const hasMoments = userMoments && userMoments.length > 0;

  return (
    <ScrollArea className="h-full bg-muted/20">
      <div className="container mx-auto max-w-4xl py-0 px-0 sm:px-0">
        <Card className="shadow-none sm:shadow-xl overflow-hidden border-0 sm:border rounded-none sm:rounded-lg">
          <CardHeader className="bg-card p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={hasMoments ? onViewUserMomentsClick : onAddMomentClick}
                  className={cn(
                    "rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card",
                    "transition-transform hover:scale-105 active:scale-95"
                  )}
                  aria-label={hasMoments ? "View moments" : "Add new moment"}
                >
                  <Avatar
                    className={cn(
                      "h-20 w-20 sm:h-24 sm:w-24 border-2",
                      hasMoments ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card" : "border-muted"
                    )}
                  >
                    <AvatarImage src={userData.avatarUrl || 'https://source.unsplash.com/random/100x100/?avatar'} alt={userData.name} data-ai-hint={userData.avatarAiHint || "user avatar"} />
                    <AvatarFallback className="text-2xl">{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </button>
                {!hasMoments && (
                  <button
                    type="button"
                    onClick={onAddMomentClick}
                    className="absolute -bottom-1 -right-1 h-7 w-7 sm:h-8 sm:w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-transform hover:scale-110 active:scale-90"
                    aria-label="Add new moment"
                  >
                    <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                )}
              </div>
              <div className="text-center sm:text-left flex-grow">
                <h1 className="text-2xl font-bold font-headline text-foreground">{userData.name}</h1>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2 text-xs text-muted-foreground">
                  <span><span className="font-semibold text-foreground">{userPosts.length}</span> Posts</span>
                  <span><span className="font-semibold text-foreground">{/* Mock */}391</span> Followers</span>
                  <span><span className="font-semibold text-foreground">{/* Mock */}85</span> Following</span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={handleManageProfessionalProfile} className="w-full">
                  <UserCircleIcon className="mr-2 h-4 w-4" /> Profile
                </Button>
                <Button size="sm" onClick={handleCreatePost} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <PlusCircleIcon className="mr-2 h-4 w-4" /> Create Post
                </Button>
            </div>
             <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button 
                    variant={isTaxiDriverOnline ? "secondary" : "outline"}
                    size="sm" 
                    onClick={onToggleTaxiDriverOnline} 
                    className="w-full"
                >
                    <TruckIcon className="mr-2 h-4 w-4" /> {isTaxiDriverOnline ? "Go Offline (Taxi)" : "Go Online (Taxi)"}
                </Button>
                <Button 
                    variant={isDeliveryDriverOnline ? "secondary" : "outline"}
                    size="sm" 
                    onClick={onToggleDeliveryDriverOnline} 
                    className="w-full"
                >
                    <Bike className="mr-2 h-4 w-4" /> {isDeliveryDriverOnline ? "Go Offline (Delivery)" : "Go Online (Delivery)"}
                </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 rounded-none h-auto bg-muted/50">
                <TabsTrigger value="feed" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><QueueListIcon className="h-4 w-4"/>Feed</TabsTrigger>
                <TabsTrigger value="images" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><PhotoIcon className="h-4 w-4"/>Images</TabsTrigger>
                <TabsTrigger value="videos" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><FilmIcon className="h-4 w-4"/>Videos</TabsTrigger>
                <TabsTrigger value="links" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><LinkOutlineIcon className="h-4 w-4"/>Links</TabsTrigger>
                <TabsTrigger value="files" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><DocumentTextIcon className="h-4 w-4"/>Files</TabsTrigger>
                <TabsTrigger value="tweets" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><ChatBubbleLeftRightIcon className="h-4 w-4"/>Tweets</TabsTrigger>
              </TabsList>
              <TabsContent value="feed" className="p-4 min-h-[300px]">
                 {userPosts.length > 0 ? (
                    <div className="space-y-4">
                    {userPosts.map(post => (
                        <Card 
                          key={post.id} 
                          className="shadow-sm cursor-pointer hover:shadow-md"
                          onClick={() => onViewPostDetail(post)}
                          onKeyDown={(e) => e.key === 'Enter' && onViewPostDetail(post)}
                          tabIndex={0}
                          aria-label={`View post: ${post.content ? post.content.substring(0,30) + "..." : "Media post"}`}
                        >
                          <CardHeader className="pb-2 pt-4 px-4">
                              <div className="flex items-center space-x-3">
                                  <Avatar className="h-9 w-9">
                                      <AvatarImage src={post.userImage || userData.avatarUrl || undefined} alt={post.user} data-ai-hint={post.userImageAiHint || userData.avatarAiHint || "user avatar"}/>
                                      <AvatarFallback>{post.user.substring(0,1)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                      <p className="text-sm font-semibold text-foreground">{post.user}</p>
                                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                                  </div>
                              </div>
                          </CardHeader>
                          <CardContent className="px-4 pb-3">
                              {post.content && <p className="text-sm mb-2 text-foreground whitespace-pre-line">{post.content}</p>}
                              {post.media && (
                                <div className="mt-2 border rounded-md overflow-hidden">
                                  {post.media.type === 'image' && (
                                    <Image src={post.media.url} alt={post.media.aiHint || 'Post image'} width={500} height={300} className="object-cover w-full" data-ai-hint={post.media.aiHint || "post image"}/>
                                  )}
                                  {post.media.type === 'video' && (
                                    <div className="bg-black aspect-video flex items-center justify-center">
                                      {post.media.thumbnailUrl ? (
                                        <Image src={post.media.thumbnailUrl} alt="Video thumbnail" fill objectFit="contain" data-ai-hint="video thumbnail"/>
                                      ) : (
                                        <VideoCameraIcon className="h-16 w-16 text-white/70" />
                                      )}
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <VideoCameraIcon className="h-12 w-12 text-white opacity-80 drop-shadow-lg" />
                                      </div>
                                    </div>
                                  )}
                                  {post.media.type === 'document' && (
                                    <div className="p-3 bg-muted/30 flex items-center space-x-3">
                                      <DocumentIcon className="h-10 w-10 text-primary flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-foreground truncate">{post.media.fileName || 'Attached Document'}</p>
                                        <a href={post.media.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View/Download Document</a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                          </CardContent>
                          <CardFooter className="text-xs text-muted-foreground px-4 pt-2 pb-3 border-t">
                              <span>{post.likes} Likes</span>
                              <span className="mx-2">•</span>
                              <span>{post.comments} Comments</span>
                          </CardFooter>
                        </Card>
                    ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-10">No posts in your feed yet. Click "Create Post" to share something!</p>
                )}
              </TabsContent>
              <TabsContent value="images" className="p-4 min-h-[300px]"><p className="text-muted-foreground text-center py-10">Your image gallery will appear here.</p></TabsContent>
              <TabsContent value="videos" className="p-4 min-h-[300px]"><p className="text-muted-foreground text-center py-10">Your video gallery will appear here.</p></TabsContent>
              <TabsContent value="links" className="p-4 min-h-[300px]"><p className="text-muted-foreground text-center py-10">Your saved links will appear here.</p></TabsContent>
              <TabsContent value="files" className="p-4 min-h-[300px]"><p className="text-muted-foreground text-center py-10">Your shared files will appear here.</p></TabsContent>
              <TabsContent value="tweets" className="p-4 min-h-[300px]"><p className="text-muted-foreground text-center py-10">Your tweets/micro-posts will appear here.</p></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default AccountScreen;
