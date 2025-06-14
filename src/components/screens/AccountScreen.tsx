
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import type { TabName, UserDataForSideMenu, ProfilePost } from '@/types';
import { Edit3, Grid, List, Camera, Video, Link as LinkIcon, FileText, MessageSquare, ThumbsUp, PlusCircle, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountScreenProps {
  userData: UserDataForSideMenu | null;
  setActiveTab: (tab: TabName) => void;
}

// Simulated content data for the logged-in user
const allUserContent: ProfilePost[] = [
    { id: 1, type: 'image', thumbnailUrl: 'https://source.unsplash.com/random/300x300/?nature,landscape', thumbnailAiHint: 'nature landscape', likes: 120, comments: 15, user: 'Test User', timestamp: '2 hours ago', content: 'Enjoying the golden hour! What a beautiful sunset.' },
    { id: 2, type: 'video', thumbnailUrl: 'https://source.unsplash.com/random/300x300/?tech,desk', thumbnailAiHint: 'tech desk', videoUrl: '#', likes: 85, comments: 10, user: 'Test User', timestamp: '5 hours ago', content: 'A quick tour of my new workspace setup. Loving the minimalist vibe!' },
    { id: 3, type: 'text', content: 'Just finished reading "Atomic Habits" by James Clear. Highly recommend for anyone looking to build better routines! #books #productivity', likes: 75, comments: 8, user: 'Test User', timestamp: '1 day ago' },
    { id: 4, type: 'link', content: 'My latest blog post on "The Future of AI in Design". Check it out!', thumbnailUrl: 'https://source.unsplash.com/random/300x150/?ai,design', thumbnailAiHint: 'ai design', likes: 50, comments: 5, url: 'https://example.com/blog/ai-design', user: 'Test User', timestamp: '3 days ago' },
    { id: 5, type: 'image', thumbnailUrl: 'https://source.unsplash.com/random/300x300/?food,healthy', thumbnailAiHint: 'food healthy', likes: 200, comments: 22, user: 'Test User', timestamp: '1 day ago', content: 'Healthy and delicious meal prep for the week.' },
    { id: 6, type: 'file', content: 'Q3_Marketing_Report.pdf', fileName: 'Q3_Marketing_Report.pdf', fileIcon: 'FileText', likes: 30, comments: 2, user: 'Test User', timestamp: '3 weeks ago' },
    { id: 7, type: 'tweet', content: 'Excited for the upcoming Next.js conference! Who else is attending? #NextJS #WebDev', likes: 45, comments: 7, user: 'Test User', timestamp: '2 months ago' },
];


const AccountScreen: React.FC<AccountScreenProps> = ({ userData, setActiveTab }) => {
    const { toast } = useToast();
    const [activeProfileTab, setActiveProfileTab] = useState('feed');

    // Filter content based on userData if available, otherwise use allUserContent as fallback
    const userContent = userData?.name ? allUserContent.filter(post => post.user === userData.name) : allUserContent;

    const filteredPosts = userContent.filter(post => {
        switch (activeProfileTab) {
        case 'feed': return true;
        case 'images': return post.type === 'image';
        case 'videos': return post.type === 'video';
        case 'links': return post.type === 'link';
        case 'files': return post.type === 'file';
        case 'tweets': return post.type === 'tweet' || (post.type === 'text' && post.content && post.content.includes('#'));
        default: return false;
        }
    });

    const totalPosts = userContent.length;
    // Simulate follower/following counts based on user ID if available, else fallback
    const followersCount = userData?.id ? (parseInt(userData.id.substring(userData.id.length - 3), 16) % 500) + 100 : 1234;
    const followingCount = userData?.id ? (parseInt(userData.id.substring(userData.id.length - 2), 16) % 200) + 50 : 567;

    const handleManageProfessionalProfile = () => {
      setActiveTab('professional-profile');
      toast({ title: "Navigating", description: "Opening your professional profile dashboard." });
    };

    const handleEditPersonalProfile = () => {
        toast({ title: "Edit Personal Profile (Simulated)", description: "This would open a form to edit your display name, avatar, etc. for this content profile." });
    };
    
    const renderPostContent = (item: ProfilePost) => {
        switch (item.type) {
            case 'image':
                return item.thumbnailUrl && <Image src={item.thumbnailUrl} alt={item.content || "Post image"} width={500} height={300} className="w-full h-auto object-cover rounded-md my-2" data-ai-hint={item.thumbnailAiHint || "user content"} />;
            case 'video':
                return (
                    <div className="relative my-2 bg-black rounded-md aspect-video flex items-center justify-center">
                        {item.thumbnailUrl && <Image src={item.thumbnailUrl} alt="Video thumbnail" layout="fill" objectFit="cover" className="rounded-md opacity-70" data-ai-hint={item.thumbnailAiHint || "video content"}/>}
                        <Video className="h-12 w-12 text-white absolute z-10" />
                        <p className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">{item.content || "Video Post"}</p>
                    </div>
                );
            case 'link':
                return (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block my-2 p-3 border rounded-md hover:bg-muted transition-colors">
                        {item.thumbnailUrl && <Image src={item.thumbnailUrl} alt="Link preview" width={500} height={150} className="w-full h-auto object-cover rounded-md mb-2" data-ai-hint={item.thumbnailAiHint || "link preview"}/>}
                        <p className="font-semibold text-primary">{item.content}</p>
                        {item.url && <p className="text-xs text-muted-foreground truncate">{item.url}</p>}
                    </a>
                );
            case 'file':
                return (
                    <div className="my-2 p-3 border rounded-md flex items-center gap-2 bg-muted/50">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-medium">{item.fileName || item.content}</p>
                            <p className="text-xs text-muted-foreground">Shared a file.</p>
                        </div>
                    </div>
                );
            case 'tweet':
            case 'text':
                return <p className="my-2 py-1 whitespace-pre-line">{item.content}</p>;
            default:
                return <p className="my-2 py-1">{item.content}</p>;
        }
    };

    const PostCard: React.FC<{ item: ProfilePost }> = ({ item }) => (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-start space-x-3 pb-3">
                <Avatar>
                    <AvatarImage src={userData?.avatarUrl} alt={userData?.name} data-ai-hint={userData?.avatarAiHint || "user avatar"} />
                    <AvatarFallback>{userData?.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-foreground">{item.user}</p>
                    <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                {renderPostContent(item)}
            </CardContent>
            <CardFooter className="flex justify-start items-center gap-2 pt-2 border-t">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <ThumbsUp className="h-4 w-4 mr-1.5" /> {item.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <MessageSquare className="h-4 w-4 mr-1.5" /> {item.comments}
                </Button>
            </CardFooter>
        </Card>
    );

    const GridItem: React.FC<{ item: ProfilePost }> = ({ item }) => (
        <Card className="aspect-square overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-lg transition-shadow">
            {item.type === 'image' && item.thumbnailUrl && (
                <Image src={item.thumbnailUrl} alt={item.content || "Grid item"} layout="fill" objectFit="cover" data-ai-hint={item.thumbnailAiHint || "gallery image"} />
            )}
            {item.type === 'video' && (
                <>
                    {item.thumbnailUrl && <Image src={item.thumbnailUrl} alt="Video thumbnail" layout="fill" objectFit="cover" className="opacity-80 group-hover:opacity-60 transition-opacity" data-ai-hint={item.thumbnailAiHint || "gallery video"}/>}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video className="h-8 w-8 text-white" />
                    </div>
                </>
            )}
             {item.type === 'link' && (
                 <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-2 text-center">
                    <LinkIcon className="h-8 w-8 text-primary mb-1"/>
                    <p className="text-xs font-medium text-foreground line-clamp-2">{item.content}</p>
                 </div>
            )}
            {item.type === 'file' && (
                <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-2 text-center">
                    <FileText className="h-8 w-8 text-primary mb-1"/>
                    <p className="text-xs font-medium text-foreground line-clamp-2">{item.fileName || item.content}</p>
                </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-sm">
                <span className="flex items-center"><ThumbsUp className="h-4 w-4 mr-1" />{item.likes}</span>
                <span className="flex items-center"><MessageSquare className="h-4 w-4 mr-1" />{item.comments}</span>
            </div>
        </Card>
    );


    return (
        <ScrollArea className="h-full bg-muted/20">
            <div className="max-w-4xl mx-auto">
                <Card className="rounded-none sm:rounded-b-lg shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background ring-2 ring-primary">
                                <AvatarImage src={userData?.avatarUrl} alt={userData?.name} data-ai-hint={userData?.avatarAiHint || "user avatar"} />
                                <AvatarFallback>{userData?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">{userData?.name || 'User Profile'}</h1>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={handleEditPersonalProfile}>
                                        <Edit3 className="h-4 w-4" />
                                        <span className="sr-only">Edit Personal Profile</span>
                                    </Button>
                                </div>
                                {userData?.email && <p className="text-sm text-muted-foreground">{userData.email}</p>}
                                <div className="flex justify-center sm:justify-start space-x-6 mt-3 text-sm">
                                    <div><span className="font-semibold text-foreground">{totalPosts}</span> <span className="text-muted-foreground">Posts</span></div>
                                    <div><span className="font-semibold text-foreground">{followersCount}</span> <span className="text-muted-foreground">Followers</span></div>
                                    <div><span className="font-semibold text-foreground">{followingCount}</span> <span className="text-muted-foreground">Following</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-2 justify-between items-center">
                            <Button variant="outline" onClick={handleManageProfessionalProfile} className="w-full sm:w-auto">
                                <UserCog className="mr-2 h-4 w-4" /> Manage Professional Profile
                            </Button>
                             <Button className="w-full sm:w-auto" onClick={() => toast({ title: "Create Post (Simulated)", description: "Functionality to create a new post will be here."})}>
                                <PlusCircle className="mr-2 h-4 w-4"/> Create Post
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Tabs value={activeProfileTab} onValueChange={(value) => setActiveProfileTab(value)} className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2 px-2 sm:px-0">
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
                        <TabsTrigger value="feed" className="py-2.5"><List className="mr-1.5 h-4 w-4"/>Feed</TabsTrigger>
                        <TabsTrigger value="images" className="py-2.5"><Camera className="mr-1.5 h-4 w-4"/>Images</TabsTrigger>
                        <TabsTrigger value="videos" className="py-2.5"><Video className="mr-1.5 h-4 w-4"/>Videos</TabsTrigger>
                        <TabsTrigger value="links" className="py-2.5"><LinkIcon className="mr-1.5 h-4 w-4"/>Links</TabsTrigger>
                        <TabsTrigger value="files" className="py-2.5"><FileText className="mr-1.5 h-4 w-4"/>Files</TabsTrigger>
                        <TabsTrigger value="tweets" className="py-2.5"><MessageSquare className="mr-1.5 h-4 w-4"/>Tweets</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="p-2 sm:p-4">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <p className="text-lg">No posts yet in this category.</p>
                            <p className="text-sm">Start sharing your content!</p>
                        </div>
                    ) : (activeProfileTab === 'feed' || activeProfileTab === 'tweets' || activeProfileTab === 'links' || activeProfileTab === 'files' || (activeProfileTab === 'text' && !filteredPosts.some(p => p.thumbnailUrl))) ? (
                        <div className="space-y-4">
                            {filteredPosts.map(item => <PostCard key={item.id} item={item} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2">
                           {filteredPosts.map(item => <GridItem key={item.id} item={item} />)}
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};

export default AccountScreen;

