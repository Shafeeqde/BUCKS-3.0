
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Star, ThumbsUp, Mail, Phone, Globe, Briefcase, Link as LinkIcon, ExternalLink, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { TabName, IndividualProfileData } from '@/types';
import { cn } from '@/lib/utils';

interface IndividualProfileScreenProps {
  setActiveTab: (tab: TabName) => void; // For potential navigation
  profileId: string; // To fetch the specific profile
}

// --- Placeholder API Simulation Function ---
const simulateFetchIndividualProfile = async (profileId: string): Promise<IndividualProfileData | null> => {
  console.log(`Simulating fetching individual profile for ID: ${profileId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProfileData: IndividualProfileData = {
        id: profileId,
        name: 'Alice Wonderland',
        avatarUrl: 'https://source.unsplash.com/random/120x120/?woman,smiling',
        avatarAiHint: 'woman smiling',
        bio: 'Creative UX/UI designer and frontend developer with a passion for crafting intuitive and engaging digital experiences. Proficient in modern design tools and web technologies.',
        contactInfo: {
          phone: '+1-555-0101',
          email: 'alice.wonderland@example.com',
          website: 'https://alicewonder.design',
        },
        skillsets: [
          {
            name: 'UX/UI Design',
            level: 'Expert',
            description: 'User research, wireframing, prototyping, usability testing. Figma, Adobe XD.',
            workExperience: '7+ years leading design for SaaS products and mobile apps.',
            portfolioUrls: [
              { url: '#ux-project-1', title: 'E-commerce Redesign Case Study' },
              { url: '#ui-project-2', title: 'Mobile App UI Kit' }
            ],
          },
          {
            name: 'Frontend Development',
            level: 'Advanced',
            description: 'React, Next.js, TypeScript, Tailwind CSS. Building responsive and performant UIs.',
            workExperience: '5+ years developing production-grade applications.',
            portfolioUrls: [{ url: '#frontend-project-1', title: 'Interactive Dashboard Project' }],
          },
          {
            name: 'Illustration',
            level: 'Intermediate',
            description: 'Digital illustrations for web and print media.',
            workExperience: 'Freelance illustration projects for various clients.',
            portfolioUrls: [],
          }
        ],
        recommendationsCount: 78,
        averageRating: 4.8,
        totalReviews: 32,
      };
      console.log('Simulated profile fetched:', mockProfileData);
      resolve(mockProfileData);
    }, 1000);
  });
};


const IndividualProfileScreen: React.FC<IndividualProfileScreenProps> = ({ setActiveTab, profileId }) => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<IndividualProfileData | null>(null);
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
      const data = await simulateFetchIndividualProfile(id);
      if (data) {
        setProfileData(data);
      } else {
        setError("Profile not found.");
        toast({ title: "Error", description: "Individual profile not found.", variant: "destructive" });
      }
    } catch (err: any) {
      console.error('Error fetching individual profile:', err);
      setError("Failed to load profile data.");
      toast({ title: "Error", description: "Failed to load individual profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => fetchProfileData(profileId)} variant="outline">Try Again</Button>
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

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
        {halfStar && <Star key="half" className="h-5 w-5 text-yellow-400 fill-yellow-200" />} {/* Simplistic half star */}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-5 w-5 text-muted-foreground/50" />)}
      </div>
    );
  };

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Profile Header */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/20">
              <AvatarImage src={profileData.avatarUrl} alt={profileData.name} data-ai-hint={profileData.avatarAiHint || "person professional"} />
              <AvatarFallback>{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-grow">
              <h1 className="text-3xl font-bold font-headline text-primary mb-1">{profileData.name}</h1>
              {profileData.bio && <p className="text-muted-foreground mb-4 text-base">{profileData.bio}</p>}
              
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-3 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(profileData.averageRating)}
                  <span className="text-sm text-muted-foreground ml-1">({profileData.averageRating.toFixed(1)})</span>
                  <span className="text-sm text-muted-foreground hidden sm:inline"> ({profileData.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span>{profileData.recommendationsCount} Recommendations</span>
                </div>
                 <span className="text-sm text-muted-foreground sm:hidden"> ({profileData.totalReviews} reviews)</span>
              </div>
              <Button size="lg">
                <Mail className="mr-2 h-5 w-5" /> Contact {profileData.name.split(' ')[0]}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info & Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column (Contact, etc.) */}
          <div className="md:col-span-1 space-y-6">
            {profileData.contactInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><Info className="mr-2 h-5 w-5 text-primary" />Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {profileData.contactInfo.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
                      <a href={`tel:${profileData.contactInfo.phone}`} className="text-foreground hover:text-primary hover:underline">{profileData.contactInfo.phone}</a>
                    </div>
                  )}
                  {profileData.contactInfo.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
                      <a href={`mailto:${profileData.contactInfo.email}`} className="text-foreground hover:text-primary hover:underline">{profileData.contactInfo.email}</a>
                    </div>
                  )}
                  {profileData.contactInfo.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
                      <a href={profileData.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary hover:underline truncate">
                        {profileData.contactInfo.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            {/* Placeholder for "Professional Feed Summary" or "Quick Links" */}
             <Card>
                <CardHeader><CardTitle className="text-xl">Quick Links</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Portfolio, Certifications, etc.</p></CardContent>
            </Card>
          </div>

          {/* Right Column (Skillsets, Reviews, Feed) */}
          <div className="md:col-span-2 space-y-6">
            {profileData.skillsets && profileData.skillsets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" />Skillsets & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileData.skillsets.map((skill, index) => (
                    <div key={index} className={cn("pb-4", index < profileData.skillsets.length - 1 && "border-b")}>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-lg font-semibold text-foreground">{skill.name}</h4>
                        <Badge variant="secondary">{skill.level}</Badge>
                      </div>
                      {skill.description && <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>}
                      {skill.workExperience && <p className="text-xs text-muted-foreground italic mb-2">Experience: {skill.workExperience}</p>}
                      {skill.portfolioUrls && skill.portfolioUrls.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-muted-foreground mb-1">Portfolio Highlights:</h5>
                          <ul className="space-y-1">
                            {skill.portfolioUrls.map((item, urlIndex) => (
                              <li key={urlIndex}>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center">
                                  <LinkIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                  {item.title || `View Project ${urlIndex + 1}`}
                                  <ExternalLink className="h-3 w-3 ml-1.5 opacity-70"/>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {profileData.totalReviews > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    Reviews & Feedback 
                    <Badge variant="outline" className="ml-2">{profileData.totalReviews}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Detailed reviews will be listed here.</p>
                  {/* Placeholder for individual reviews */}
                   <div className="mt-4 p-4 bg-muted/50 rounded-md text-center text-sm text-muted-foreground">
                        Full review listing coming soon.
                   </div>
                   <Button variant="outline" className="mt-4 w-full sm:w-auto">View All Reviews</Button>
                </CardContent>
              </Card>
            )}

            {/* Professional Feed Section (Placeholder) */}
            <Card>
              <CardHeader><CardTitle className="text-xl">Professional Updates</CardTitle></CardHeader>
              <CardContent>
                 <p className="text-sm text-muted-foreground">Recent posts, articles, or achievements will appear here.</p>
                 <div className="mt-4 p-4 bg-muted/50 rounded-md text-center text-sm text-muted-foreground">
                        Professional feed coming soon.
                   </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default IndividualProfileScreen;
    