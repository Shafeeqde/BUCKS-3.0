
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    UserCircleIcon,
    Cog6ToothIcon,
    PlusCircleIcon,
    PhotoIcon,
    FilmIcon,
    LinkIcon as LinkOutlineIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    QueueListIcon,
    InformationCircleIcon,
    MapPinIcon,
    EnvelopeIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import type { TabName, PublicProfileData, ProfilePost } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { individualProfiles } from '@/lib/dummy-data/individualProfiles'; // Import dummy data

interface IndividualProfileScreenProps {
  setActiveTab: (tab: TabName) => void;
  profileId: string | null;
}

const simulateFetchPublicProfile = async (profileId: string): Promise<PublicProfileData | null> => {
  console.log(`Simulating fetching public profile for ID: ${profileId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const profile = individualProfiles.find(p => p.id === profileId);
      resolve(profile || null);
    }, 500);
  });
};


const IndividualProfileScreen: React.FC<IndividualProfileScreenProps> = ({ setActiveTab, profileId }) => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profileId) {
      fetchProfileData(profileId);
    } else {
      setError("No profile ID provided.");
      setLoading(false);
      toast({ title: "Error", description: "No profile specified to display.", variant: "destructive" });
    }
  }, [profileId, toast]);

  const fetchProfileData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulateFetchPublicProfile(id);
      if (data) {
        setProfileData(data);
      } else {
        setError("Profile not found.");
        toast({ title: "Error", description: "Profile not found.", variant: "destructive" });
      }
    } catch (err: any) {
      console.error('Error fetching public profile:', err);
      setError("Failed to load profile data.");
      toast({ title: "Error", description: "Failed to load profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <svg className="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-muted-foreground">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-destructive mb-4">{error}</p>
        {profileId && <Button onClick={() => fetchProfileData(profileId)} variant="outline">Try Again</Button>}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground">Profile data is unavailable.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full bg-muted/20">
      <div className="container mx-auto max-w-4xl py-0 px-0 sm:px-0">
        <Card className="shadow-none sm:shadow-xl overflow-hidden border-0 sm:border rounded-none sm:rounded-lg">
          <CardHeader className="bg-card p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary">
                <AvatarImage src={profileData.avatarUrl || 'https://source.unsplash.com/random/100x100/?avatar'} alt={profileData.name} data-ai-hint={profileData.avatarAiHint || "user avatar"}/>
                <AvatarFallback className="text-2xl">{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-grow">
                <h1 className="text-2xl font-bold font-headline text-foreground">{profileData.name}</h1>
                {profileData.professionalTitle && <p className="text-md text-primary font-semibold">{profileData.professionalTitle}</p>}
                <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2 text-xs text-muted-foreground">
                  <span><span className="font-semibold text-foreground">{profileData.posts?.length || 0}</span> Posts</span>
                  <span><span className="font-semibold text-foreground">{profileData.followers || 0}</span> Followers</span>
                  <span><span className="font-semibold text-foreground">{profileData.following || 0}</span> Following</span>
                </div>
              </div>
            </div>
             <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => toast({title: "Follow (Simulated)"})}>
                   Follow
                </Button>
                <Button size="sm" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => toast({title: "Message (Simulated)"})}>
                   Message
                </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 rounded-none h-auto bg-muted/50">
                <TabsTrigger value="feed" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><QueueListIcon className="h-4 w-4"/>Feed</TabsTrigger>
                <TabsTrigger value="about" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><InformationCircleIcon className="h-4 w-4"/>About</TabsTrigger>
                <TabsTrigger value="media" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><PhotoIcon className="h-4 w-4"/>Media</TabsTrigger>
                <TabsTrigger value="links" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><LinkOutlineIcon className="h-4 w-4"/>Links</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="p-4 min-h-[300px]">
                 {profileData.posts && profileData.posts.length > 0 ? (
                    <div className="space-y-4">
                    {profileData.posts.map(post => (
                        <Card key={post.id} className="shadow-sm">
                        <CardHeader className="pb-2 pt-4 px-4">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={profileData.avatarUrl || undefined} alt={profileData.name} data-ai-hint={profileData.avatarAiHint || "user avatar"}/>
                                    <AvatarFallback>{profileData.name.substring(0,1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{profileData.name}</p>
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
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-10">No posts in {profileData.name}&apos;s feed yet.</p>
                )}
              </TabsContent>
              <TabsContent value="about" className="p-4 min-h-[300px] space-y-4">
                <h3 className="text-lg font-semibold text-foreground">About {profileData.name}</h3>
                {profileData.bio ? <p className="text-sm text-muted-foreground whitespace-pre-line">{profileData.bio}</p> : <p className="text-sm text-muted-foreground">No bio available.</p>}
                {profileData.contactInfo && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-md font-semibold text-foreground mb-2">Contact</h4>
                    <div className="space-y-1 text-sm">
                      {profileData.contactInfo.email && <p className="flex items-center gap-2"><EnvelopeIcon className="h-4 w-4 text-muted-foreground"/> {profileData.contactInfo.email}</p>}
                      {profileData.contactInfo.website && <p className="flex items-center gap-2"><GlobeAltIcon className="h-4 w-4 text-muted-foreground"/> <a href={profileData.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profileData.contactInfo.website}</a></p>}
                      {profileData.contactInfo.location && <p className="flex items-center gap-2"><MapPinIcon className="h-4 w-4 text-muted-foreground"/> {profileData.contactInfo.location}</p>}
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="media" className="p-4 min-h-[300px]"><p className="text-muted-foreground text-center py-10">{profileData.name}&apos;s media gallery will appear here.</p></TabsContent>
              <TabsContent value="links" className="p-4 min-h-[300px]"><p className="text-muted-foreground text-center py-10">{profileData.name}&apos;s shared links will appear here.</p></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default IndividualProfileScreen;

    