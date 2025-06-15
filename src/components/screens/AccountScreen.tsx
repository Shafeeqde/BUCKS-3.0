
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCircleIcon, Cog6ToothIcon, PencilSquareIcon, PlusCircleIcon, PhotoIcon, LinkIcon as LinkOutlineIcon, FilmIcon } from '@heroicons/react/24/outline'; // Renamed LinkIcon to avoid conflict
import type { TabName, UserDataForSideMenu, ProfilePost } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface AccountScreenProps {
  userData: UserDataForSideMenu | null;
  setActiveTab: (tab: TabName) => void;
}

// Dummy posts for the feed
const dummyPosts: ProfilePost[] = [
  { id: 'post1', type: 'post', user: 'Current User', timestamp: '2h ago', content: 'Just had a great lunch! #foodie', imageUrl: 'https://source.unsplash.com/random/600x400/?lunch,food', imageAiHint: 'lunch food', likes: 15, comments: 3 },
  { id: 'post2', type: 'post', user: 'Current User', timestamp: '1d ago', content: 'Working on a new exciting project. Stay tuned! #development', likes: 25, comments: 8 },
  { id: 'post3', type: 'image', user: 'Current User', timestamp: '3d ago', imageUrl: 'https://source.unsplash.com/random/600x400/?nature,sunset', imageAiHint: 'nature sunset', likes: 40, comments: 5, content: "Beautiful sunset today!"},
];


const AccountScreen: React.FC<AccountScreenProps> = ({ userData, setActiveTab }) => {
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

  const handleEditPersonalProfile = () => {
    // This could navigate to AccountSettingsScreen or a dedicated edit profile screen
    setActiveTab('account-settings'); 
    toast({ title: "Navigating to Settings", description: "Opening account settings." });
  };

  const handleCreatePost = () => {
    toast({ title: "Create Post (Simulated)", description: "Post creation dialog or screen would open here." });
  };


  return (
    <ScrollArea className="h-full bg-muted/20">
      <div className="container mx-auto max-w-4xl py-6 px-2 sm:px-4">
        <Card className="shadow-xl overflow-hidden">
          <CardHeader className="bg-card p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary">
                <AvatarImage src={userData.avatarUrl || 'https://source.unsplash.com/random/100x100/?avatar'} alt={userData.name} data-ai-hint={userData.avatarAiHint || "user avatar"} />
                <AvatarFallback className="text-2xl">{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold font-headline text-foreground">{userData.name}</h1>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2 text-xs text-muted-foreground">
                  {/* Placeholder stats */}
                  <span><span className="font-semibold text-foreground">123</span> Followers</span>
                  <span><span className="font-semibold text-foreground">45</span> Following</span>
                </div>
              </div>
              <div className="sm:ml-auto flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                <Button variant="outline" size="sm" onClick={handleManageProfessionalProfile} className="w-full sm:w-auto">
                  <UserCircleIcon className="mr-2 h-4 w-4" /> Pro Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={handleEditPersonalProfile} className="w-full sm:w-auto">
                  <Cog6ToothIcon className="mr-2 h-4 w-4" /> Account Settings
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <Button className="w-full" onClick={handleCreatePost}>
                <PlusCircleIcon className="mr-2 h-5 w-5" /> Create Post
              </Button>
            </div>
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-none">
                <TabsTrigger value="feed" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"><PencilSquareIcon className="mr-1.5 h-4 w-4"/>Feed</TabsTrigger>
                <TabsTrigger value="media" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"><PhotoIcon className="mr-1.5 h-4 w-4"/>Media</TabsTrigger>
                <TabsTrigger value="links" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"><LinkOutlineIcon className="mr-1.5 h-4 w-4"/>Links</TabsTrigger>
              </TabsList>
              <TabsContent value="feed" className="p-4 min-h-[300px]">
                 <h3 className="text-lg font-semibold mb-3 text-foreground">My Feed</h3>
                 {dummyPosts.length > 0 ? (
                    <div className="space-y-4">
                    {dummyPosts.map(post => (
                        <Card key={post.id} className="shadow-sm">
                        <CardHeader className="pb-2 pt-4 px-4">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={userData.avatarUrl || undefined} alt={userData.name} data-ai-hint={userData.avatarAiHint}/>
                                    <AvatarFallback>{userData.name.substring(0,1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{userData.name}</p>
                                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-3">
                            {post.content && <p className="text-sm mb-2 text-foreground">{post.content}</p>}
                            {post.imageUrl && <div className="relative aspect-video rounded-md overflow-hidden border"><Image src={post.imageUrl} alt="Post image" fill className="object-cover" data-ai-hint={post.imageAiHint || "feed post"}/></div>}
                        </CardContent>
                        <CardFooter className="text-xs text-muted-foreground px-4 pt-2 pb-3 border-t">
                            <span>{post.likes} Likes</span>
                            <span className="mx-2">•</span>
                            <span>{post.comments} Comments</span>
                            {/* Add action buttons like Edit/Delete here if needed */}
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-10">No posts in your feed yet. Click "Create Post" to share something!</p>
                )}
              </TabsContent>
              <TabsContent value="media" className="p-4 min-h-[300px]"><p className="text-muted-foreground text-center py-10">Your media gallery will appear here.</p></TabsContent>
              <TabsContent value="links" className="p-4 min-h-[300px]"><p className="text-muted-foreground text-center py-10">Your saved links and resources will appear here.</p></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default AccountScreen;
    