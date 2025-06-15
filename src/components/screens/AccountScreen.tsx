
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
import { PencilSquareIcon, Squares2X2Icon, ListBulletIcon, CameraIcon, VideoCameraIcon, LinkIcon as LinkIconOutline, DocumentTextIcon, ChatBubbleOvalLeftEllipsisIcon, HandThumbUpIcon, PlusCircleIcon, UserCircleIcon, EllipsisHorizontalIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface AccountScreenProps {
  userData: UserDataForSideMenu | null;
  setActiveTab: (tab: TabName) => void;
}

// Personal content for the logged-in user (Test User)
const allUserContent: ProfilePost[] = [
    // --- Test User (Logged-in User - Existing) ---
    { id: 'tu-1', type: 'image', thumbnailUrl: 'https://source.unsplash.com/random/300x300/?nature,landscape', thumbnailAiHint: 'nature landscape', likes: 120, comments: 15, user: 'Test User', timestamp: '2 hours ago', content: 'Enjoying the golden hour! What a beautiful sunset.', userImage: 'https://source.unsplash.com/random/48x48/?user,avatar&sig=1' },
    { id: 'tu-2', type: 'video', thumbnailUrl: 'https://source.unsplash.com/random/300x300/?tech,desk', thumbnailAiHint: 'tech desk', videoUrl: '#', likes: 85, comments: 10, user: 'Test User', timestamp: '5 hours ago', content: 'A quick tour of my new workspace setup. Loving the minimalist vibe!', userImage: 'https://source.unsplash.com/random/48x48/?user,avatar&sig=1' },
    { id: 'tu-3', type: 'text', content: 'Just finished reading "Atomic Habits" by James Clear. Highly recommend for anyone looking to build better routines! #books #productivity', likes: 75, comments: 8, user: 'Test User', timestamp: '1 day ago', userImage: 'https://source.unsplash.com/random/48x48/?user,avatar&sig=1' },
    { id: 'tu-4', type: 'link', content: 'My latest blog post on "The Future of AI in Design". Check it out!', thumbnailUrl: 'https://source.unsplash.com/random/300x150/?ai,design', thumbnailAiHint: 'ai design', likes: 50, comments: 5, url: 'https://example.com/blog/ai-design', user: 'Test User', timestamp: '3 days ago', userImage: 'https://source.unsplash.com/random/48x48/?user,avatar&sig=1' },
    { id: 'tu-5', type: 'image', thumbnailUrl: 'https://source.unsplash.com/random/300x300/?food,healthy', thumbnailAiHint: 'food healthy', likes: 200, comments: 22, user: 'Test User', timestamp: '1 day ago', content: 'Healthy and delicious meal prep for the week.', userImage: 'https://source.unsplash.com/random/48x48/?user,avatar&sig=1' },
    { id: 'tu-6', type: 'file', content: 'Q3_Marketing_Report.pdf', fileName: 'Q3_Marketing_Report.pdf', fileIcon: 'DocumentTextIcon', likes: 30, comments: 2, user: 'Test User', timestamp: '3 weeks ago', userImage: 'https://source.unsplash.com/random/48x48/?user,avatar&sig=1' },
    { id: 'tu-7', type: 'tweet', content: 'Excited for the upcoming Next.js conference! Who else is attending? #NextJS #WebDev', likes: 45, comments: 7, user: 'Test User', timestamp: '2 months ago', userImage: 'https://source.unsplash.com/random/48x48/?user,avatar&sig=1' },
    { id: 'tu-8', type: 'post', content: 'Looking for recommendations for a good co-working space in downtown. Any suggestions?', user: 'Test User', timestamp: 'Today', likes: 15, comments: 4, userImage: 'https://source.unsplash.com/random/48x48/?user,avatar&sig=1'},
    { id: 'tu-9', type: 'image', thumbnailUrl: 'https://source.unsplash.com/random/300x300/?city,night', thumbnailAiHint: 'city night', likes: 90, comments: 10, user: 'Test User', timestamp: '4 hours ago', content: 'Night city lights.', userImage: 'https://source.unsplash.com/random/48x48/?user,avatar&sig=1' },


    // --- Shafeeq (Personal User - Existing) ---
    { id: 'sh-1', type: 'image', user: 'Shafeeq', userImage: 'https://source.unsplash.com/random/40x40/?man,casual&sig=2', timestamp: 'Yesterday', likes: 150, comments: 20, content: 'Beautiful morning hike! The air was so fresh. #nature #weekendvibes', thumbnailUrl: 'https://source.unsplash.com/random/300x300/?hike,mountain', thumbnailAiHint: 'hike mountain' },
    { id: 'sh-2', type: 'text', user: 'Shafeeq', userImage: 'https://source.unsplash.com/random/40x40/?man,casual&sig=2', timestamp: '3 days ago', likes: 70, comments: 8, content: 'Learning to cook a new Italian dish today. Fingers crossed it turns out well! 🍝 #cooking #newrecipe' },
    { id: 'sh-3', type: 'tweet', user: 'Shafeeq', userImage: 'https://source.unsplash.com/random/40x40/?man,casual&sig=2', timestamp: '5 hours ago', likes: 40, comments: 5, content: 'Just finished a great book on mindfulness. Feeling very centered. #reading #mindfulness' },

    // --- Senthil Devaraj (Personal User - Existing) ---
    { id: 'sd-1', type: 'text', user: 'Senthil Devaraj', userImage: 'https://source.unsplash.com/random/40x40/?man,professional&sig=3', timestamp: '2 days ago', likes: 55, comments: 12, content: 'Completed an online certification in Advanced Project Management. Looking for new opportunities! #upskilling #careergoals #projectmanagement #jobsearch' },
    { id: 'sd-2', type: 'link', user: 'Senthil Devaraj', userImage: 'https://source.unsplash.com/random/40x40/?man,professional&sig=3', timestamp: '4 days ago', likes: 30, comments: 7, content: 'Found this insightful article on acing technical interviews. Sharing for others who might find it useful!', url: 'https://example.com/tech-interview-tips', thumbnailUrl: 'https://source.unsplash.com/random/300x150/?interview,laptop', thumbnailAiHint: 'interview laptop' },
    { id: 'sd-3', type: 'file', user: 'Senthil Devaraj', userImage: 'https://source.unsplash.com/random/40x40/?man,professional&sig=3', timestamp: '1 month ago', likes: 15, comments: 2, content: 'My_Resume_Senthil_Devaraj.pdf', fileName: 'My_Resume_Senthil_Devaraj.pdf', fileIcon: 'DocumentTextIcon', thumbnailAiHint: 'document resume' },
];


const AccountScreen: React.FC<AccountScreenProps> = ({ userData, setActiveTab }) => {
    const { toast } = useToast();
    const [activeProfileTab, setActiveProfileTab] = useState('feed');

    const loggedInUserName = userData?.name || 'Test User'; 

    const filteredPosts = allUserContent.filter(post => {
        // The "Feed" tab for a user's personal profile page might show an aggregation of their posts
        // and posts from individuals they follow (though individual following isn't fully simulated here).
        // For simplicity now, the 'feed' tab on AccountScreen will just show the loggedInUser's own content.
        if (activeProfileTab === 'feed') {
            return post.user === loggedInUserName;
        }
        // Other tabs show specific content types from the logged-in user.
        if (activeProfileTab === 'images') {
            return post.type === 'image' && post.user === loggedInUserName;
        }
        if (activeProfileTab === 'videos') {
            return post.type === 'video' && post.user === loggedInUserName;
        }
        if (activeProfileTab === 'links') {
            return post.type === 'link' && post.user === loggedInUserName;
        }
        if (activeProfileTab === 'files') {
            return post.type === 'file' && post.user === loggedInUserName;
        }
        if (activeProfileTab === 'tweets') {
            return post.type === 'tweet' && post.user === loggedInUserName;
        }
        return false;
    });

    const userSpecificContent = allUserContent.filter(post => post.user === loggedInUserName);
    const totalPostsByLoggedInUser = userSpecificContent.length;
    
    const followersCount = userData?.id ? (parseInt(userData.id.replace(/[^0-9]/g, '').slice(-3) || "123", 10) % 500) + 100 : 1234;
    const followingCount = userData?.id ? (parseInt(userData.id.replace(/[^0-9]/g, '').slice(-2) || "56", 10) % 200) + 50 : 567;


    const handleManageProfessionalProfile = () => {
      setActiveTab('professional-profile');
      toast({ title: "Navigating", description: "Opening your professional profile dashboard." });
    };

    const handleEditPersonalProfile = () => {
        toast({ title: "Edit Personal Profile (Simulated)", description: "This would open a form to edit your display name, avatar, etc. for this content profile." });
    };

    const renderPostContent = (item: ProfilePost) => {
        const postUserInfo = (
            <div className="flex items-center mb-3">
                <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={item.userImage || `https://source.unsplash.com/random/40x40/?${item.user.split(' ')[0].toLowerCase()}`} alt={item.user} data-ai-hint={item.user.toLowerCase() + " avatar"} />
                    <AvatarFallback>{item.user?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <p className="font-semibold text-foreground">{item.user}</p>
                    <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                </div>
                {item.user === loggedInUserName && (
                    <Button variant="ghost" size="icon" className="ml-auto h-7 w-7 text-muted-foreground hover:text-primary">
                        <EllipsisHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                    </Button>
                 )}
            </div>
        );

        switch (item.type) {
            case 'image':
                return (
                    <>
                        {postUserInfo}
                        {item.content && <p className="text-foreground mb-3">{item.content}</p>}
                        {item.thumbnailUrl && <Image src={item.thumbnailUrl} alt={item.content || "Post image"} width={500} height={300} className="w-full h-auto object-cover rounded-md my-2" data-ai-hint={item.thumbnailAiHint || "user content"} />}
                    </>
                );
            case 'video':
                return (
                    <>
                        {postUserInfo}
                        {item.content && <p className="text-foreground mb-3">{item.content}</p>}
                        <div className="relative my-2 bg-black rounded-md aspect-video flex items-center justify-center">
                            {item.thumbnailUrl && <Image src={item.thumbnailUrl} alt="Video thumbnail" layout="fill" objectFit="cover" className="rounded-md opacity-70" data-ai-hint={item.thumbnailAiHint || "video content"}/>}
                            <PlayCircleIcon className="h-12 w-12 text-white absolute z-10" />
                        </div>
                    </>
                );
            case 'link':
                return (
                    <>
                        {postUserInfo}
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block my-2 p-3 border rounded-md hover:bg-muted transition-colors">
                            {item.thumbnailUrl && <Image src={item.thumbnailUrl} alt="Link preview" width={500} height={150} className="w-full h-auto object-cover rounded-md mb-2" data-ai-hint={item.thumbnailAiHint || "link preview"}/>}
                            <p className="font-semibold text-primary">{item.content}</p>
                            {item.url && <p className="text-xs text-muted-foreground truncate">{item.url}</p>}
                        </a>
                    </>
                );
            case 'file':
                return (
                    <>
                        {postUserInfo}
                        <div className="my-2 p-3 border rounded-md flex items-center gap-2 bg-muted/50">
                            <DocumentTextIcon className="h-6 w-6 text-primary" />
                            <div>
                                <p className="font-medium">{item.fileName || item.content}</p>
                                <p className="text-xs text-muted-foreground">Shared a file.</p>
                            </div>
                        </div>
                    </>
                );
            case 'tweet':
                 return (
                    <div className="p-3 border border-blue-200 rounded-lg bg-blue-50/70 my-2">
                       <div className="flex items-center mb-2">
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={item.userImage || `https://source.unsplash.com/random/32x32/?${item.user.split(' ')[0].toLowerCase()}`} alt={item.user} data-ai-hint={item.user.toLowerCase() + " avatar"}/>
                                <AvatarFallback>{item.user?.substring(0,1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-900 text-sm">{item.user}</p>
                                <p className="text-xs text-gray-500">{item.timestamp}</p>
                            </div>
                       </div>
                       <p className="text-gray-800 text-sm whitespace-pre-line">{item.content}</p>
                    </div>
                 );
            case 'text':
                return (
                    <>
                        {postUserInfo}
                        <p className="my-2 py-1 whitespace-pre-line">{item.content}</p>
                    </>
                );
            default:
                return (
                     <>
                        {postUserInfo}
                        <p className="my-2 py-1">{item.content}</p>
                    </>
                );
        }
    };

    const PostCard: React.FC<{ item: ProfilePost }> = ({ item }) => (
        <Card className="shadow-md">
            <CardContent className="pt-4 pb-2">
                {renderPostContent(item)}
            </CardContent>
            <CardFooter className="flex justify-start items-center gap-2 pt-2 pb-3 border-t">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <HandThumbUpIcon className="h-4 w-4 mr-1.5" /> {item.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 mr-1.5" /> {item.comments}
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
                        <PlayCircleIcon className="h-8 w-8 text-white" />
                    </div>
                </>
            )}
             {item.type === 'link' && (
                 <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-2 text-center">
                    <LinkIconOutline className="h-8 w-8 text-primary mb-1"/>
                    <p className="text-xs font-medium text-foreground line-clamp-2">{item.content}</p>
                 </div>
            )}
            {item.type === 'file' && (
                <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-2 text-center">
                    <DocumentTextIcon className="h-8 w-8 text-primary mb-1"/>
                    <p className="text-xs font-medium text-foreground line-clamp-2">{item.fileName || item.content}</p>
                </div>
            )}
             {item.type === 'tweet' && ( 
                <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center p-2 text-center">
                    <Image src="/assets/icons/twitter-x.svg" alt="Tweet icon" width={32} height={32} className="mb-1 opacity-70"/>
                    <p className="text-xs font-medium text-blue-700 line-clamp-3">{item.content}</p>
                </div>
            )}
            {item.type === 'text' && (
                <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-2 text-center">
                    <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8 text-gray-500 mb-1"/>
                    <p className="text-xs font-medium text-gray-700 line-clamp-3">{item.content}</p>
                </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-sm">
                <span className="flex items-center"><HandThumbUpIcon className="h-4 w-4 mr-1" />{item.likes}</span>
                <span className="flex items-center"><ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 mr-1" />{item.comments}</span>
            </div>
            {item.user === loggedInUserName && ( 
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-white opacity-0 group-hover:opacity-100 z-10 hover:bg-black/50">
                    <EllipsisHorizontalIcon className="h-3 w-3" />
                </Button>
            )}
        </Card>
    );


    return (
        <ScrollArea className="h-full bg-muted/20">
            <div className="max-w-4xl mx-auto">
                <Card className="rounded-none sm:rounded-b-lg shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background ring-2 ring-primary">
                                <AvatarImage src={userData?.avatarUrl || `https://source.unsplash.com/random/128x128/?${loggedInUserName.split(' ')[0].toLowerCase() || 'abstract'}`} alt={loggedInUserName} data-ai-hint={userData?.avatarAiHint || "user avatar"} />
                                <AvatarFallback className="text-3xl">{loggedInUserName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">{loggedInUserName}</h1>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={handleEditPersonalProfile}>
                                        <PencilSquareIcon className="h-4 w-4" />
                                        <span className="sr-only">Edit Personal Profile</span>
                                    </Button>
                                </div>
                                {userData?.email && <p className="text-sm text-muted-foreground">{userData.email}</p>}
                                <div className="flex justify-center sm:justify-start space-x-6 mt-3 text-sm">
                                    <div><span className="font-semibold text-foreground">{totalPostsByLoggedInUser}</span> <span className="text-muted-foreground">Posts</span></div>
                                    <div><span className="font-semibold text-foreground">{followersCount}</span> <span className="text-muted-foreground">Followers</span></div>
                                    <div><span className="font-semibold text-foreground">{followingCount}</span> <span className="text-muted-foreground">Following</span></div>
                                </div>
                            </div>
                        </div>
                         <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-2 justify-between items-center">
                            <Button variant="outline" onClick={handleManageProfessionalProfile} className="w-full sm:w-auto">
                                <UserCircleIcon className="mr-2 h-4 w-4" /> Manage Professional Profile
                            </Button>
                             <Button className="w-full sm:w-auto" onClick={() => toast({ title: "Create Post (Simulated)", description: "Functionality to create a new post will be here."})}>
                                <PlusCircleIcon className="mr-2 h-4 w-4"/> Create Post
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Tabs value={activeProfileTab} onValueChange={(value) => setActiveProfileTab(value)} className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2 px-2 sm:px-0">
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
                        <TabsTrigger value="feed" className="py-2.5 flex items-center gap-1.5"><ListBulletIcon className="h-4 w-4"/>Feed</TabsTrigger>
                        <TabsTrigger value="images" className="py-2.5 flex items-center gap-1.5"><CameraIcon className="h-4 w-4"/>Images</TabsTrigger>
                        <TabsTrigger value="videos" className="py-2.5 flex items-center gap-1.5"><VideoCameraIcon className="h-4 w-4"/>Videos</TabsTrigger>
                        <TabsTrigger value="links" className="py-2.5 flex items-center gap-1.5"><LinkIconOutline className="h-4 w-4"/>Links</TabsTrigger>
                        <TabsTrigger value="files" className="py-2.5 flex items-center gap-1.5"><DocumentTextIcon className="h-4 w-4"/>Files</TabsTrigger>
                        <TabsTrigger value="tweets" className="py-2.5 flex items-center gap-1.5"><Image src="/assets/icons/twitter-x.svg" alt="Tweets" width={16} height={16} className="opacity-70"/>Tweets</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="p-2 sm:p-4">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <p className="text-lg">No posts yet in this category.</p>
                            <p className="text-sm">Start sharing your content or follow others!</p>
                        </div>
                    ) : (['feed', 'tweets'].includes(activeProfileTab)) ? ( 
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
