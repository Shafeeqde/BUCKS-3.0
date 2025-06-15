
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    StarIcon, 
    HandThumbUpIcon, 
    EnvelopeIcon, 
    PhoneIcon, 
    GlobeAltIcon, 
    BriefcaseIcon, 
    LinkIcon as LinkIconOutline, 
    ArrowTopRightOnSquareIcon, 
    InformationCircleIcon,
    MapPinIcon, // Added for location if needed
    BookOpenIcon, // Added for portfolio/skillsets
    RssIcon // Added for feed/updates
} from '@heroicons/react/24/outline';
import { useToast } from "@/hooks/use-toast";
import type { TabName, IndividualProfileData, WorkExperienceEntry, SkillsetSpecificPortfolioItem, BusinessFeedItem, BusinessReview } from '@/types'; // Added more types for later phases
import { cn } from '@/lib/utils';

interface IndividualProfileScreenProps {
  setActiveTab: (tab: TabName) => void;
  profileId: string;
}

const simulateFetchIndividualProfile = async (profileId: string): Promise<IndividualProfileData | null> => {
  console.log(`Simulating fetching individual profile for ID: ${profileId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockProfileData: IndividualProfileData = {
        id: profileId,
        name: 'Alice Wonderland',
        avatarUrl: 'https://source.unsplash.com/random/120x120/?woman,smiling',
        avatarAiHint: 'woman smiling',
        professionalTitle: 'Creative UX/UI Designer & Frontend Developer',
        bio: 'Creative UX/UI designer and frontend developer with a passion for crafting intuitive and engaging digital experiences. Proficient in modern design tools and web technologies, dedicated to user-centric solutions.',
        contactInfo: {
          phone: '+1-555-0101',
          email: 'alice.wonderland@example.com',
          website: 'https://alicewonder.design',
          location: 'Wonderland, Digital Realm'
        },
        skillsets: [
          { id: 'skill-uxui', name: 'UX/UI Design', level: 'Expert', description: 'User research, wireframing, prototyping, usability testing. Figma, Adobe XD.' },
          { id: 'skill-frontend', name: 'Frontend Development', level: 'Advanced', description: 'React, Next.js, TypeScript, Tailwind CSS. Building responsive UIs.' },
          { id: 'skill-illustration', name: 'Illustration', level: 'Intermediate', description: 'Digital illustrations for web and print media.' }
        ],
        workExperienceEntries: [
            { id: 'exp1', title: 'Lead UX Designer', company: 'Digital Dreams Co.', years: '2020 - Present', description: 'Led UX strategy for key projects.'},
            { id: 'exp2', title: 'Frontend Developer', company: 'Web Weavers Inc.', years: '2018 - 2020', description: 'Developed responsive web applications.'}
        ],
        portfolioItems: [
            {id: 'port1', title: 'E-commerce App Redesign', imageUrl: 'https://source.unsplash.com/random/300x200/?app,design', imageAiHint: 'app design', description: 'Complete UX overhaul for a major e-commerce platform.'},
            {id: 'port2', title: 'Portfolio Website', imageUrl: 'https://source.unsplash.com/random/300x200/?website,portfolio', imageAiHint: 'website portfolio', description: 'Personal portfolio showcasing various projects.', link: 'https://alicewonder.design'}
        ],
        professionalFeed: [
            {id: 'feed1', content: 'Excited to share my latest article on accessible design principles!', timestamp: '2 days ago', imageUrl: 'https://source.unsplash.com/random/300x150/?blog,writing', imageAiHint: 'blog writing'}
        ],
        reviews: [
            {id: 'rev1', reviewerName: 'John C.', rating: 5, comment: 'Alice is a fantastic designer, truly understood our needs!', date: '2024-03-15'}
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

const StarRatingDisplay: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 5, className = "h-5 w-5" }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className={cn(className, "text-yellow-400 fill-yellow-400")} />)}
      {halfStar && <StarIcon key="half" className={cn(className, "text-yellow-400 fill-yellow-200")} />}
      {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className={cn(className, "text-muted-foreground/50")} />)}
    </div>
  );
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
    <ScrollArea className="h-full bg-background">
      <div className="max-w-4xl mx-auto"> {/* Removed p-4 sm:p-6 md:p-8 for global padding */}
        {/* Profile Header */}
        <Card className="mb-6 shadow-lg rounded-b-lg"> {/* Ensure bottom rounding if top is covered by cover */}
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background ring-2 ring-primary flex-shrink-0">
              <AvatarImage src={profileData.avatarUrl} alt={profileData.name} data-ai-hint={profileData.avatarAiHint || "person professional"} />
              <AvatarFallback className="text-3xl">{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-grow mt-4 sm:mt-0">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground mb-1">{profileData.name}</h1>
              {profileData.professionalTitle && <p className="text-md text-primary font-semibold mb-2">{profileData.professionalTitle}</p>}
              {profileData.bio && <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{profileData.bio}</p>}
              
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 mb-4">
                {profileData.averageRating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <StarRatingDisplay rating={profileData.averageRating} size={4} className="h-4 w-4" />
                    <span className="text-xs text-muted-foreground font-medium">{profileData.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({profileData.totalReviews} reviews)</span>
                  </div>
                )}
                {profileData.recommendationsCount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <HandThumbUpIcon className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{profileData.recommendationsCount}</span> Recommendations
                  </div>
                )}
              </div>
              <Button size="lg" className="w-full sm:w-auto">
                <EnvelopeIcon className="mr-2 h-5 w-5" /> Contact {profileData.name.split(' ')[0]}
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
                  <CardTitle className="text-xl flex items-center"><InformationCircleIcon className="mr-2 h-5 w-5 text-primary" />Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {profileData.contactInfo.phone && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a href={`tel:${profileData.contactInfo.phone}`} className="text-foreground hover:text-primary hover:underline">{profileData.contactInfo.phone}</a>
                    </div>
                  )}
                  {profileData.contactInfo.email && (
                    <div className="flex items-center gap-3">
                      <EnvelopeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a href={`mailto:${profileData.contactInfo.email}`} className="text-foreground hover:text-primary hover:underline">{profileData.contactInfo.email}</a>
                    </div>
                  )}
                   {profileData.contactInfo.location && (
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{profileData.contactInfo.location}</span>
                    </div>
                  )}
                  {profileData.contactInfo.website && (
                    <div className="flex items-center gap-3">
                      <GlobeAltIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a href={profileData.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        {profileData.contactInfo.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
             <Card>
                <CardHeader><CardTitle className="text-xl flex items-center"><LinkIconOutline className="mr-2 h-5 w-5 text-primary"/>Quick Links</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Portfolio, Certifications, etc. (Content coming in next phase)</p></CardContent>
            </Card>
          </div>

          {/* Right Column (Skillsets, Reviews, Feed) */}
          <div className="md:col-span-2 space-y-6">
            {profileData.skillsets && profileData.skillsets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><BriefcaseIcon className="mr-2 h-5 w-5 text-primary" />Skillsets & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {profileData.skillsets.map((skill, index) => (
                    <div key={skill.id} className={cn("pb-4", index < profileData.skillsets.length - 1 && "border-b")}>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-lg font-semibold text-foreground">{skill.name}</h4>
                        <Badge variant="secondary">{skill.level}</Badge>
                      </div>
                      {skill.description && <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            {profileData.workExperienceEntries && profileData.workExperienceEntries.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-xl flex items-center"><BriefcaseIcon className="mr-2 h-5 w-5 text-primary" />Work Experience</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {/* Placeholder for Work Experience mapping - Phase 2d */}
                  <p className="text-sm text-muted-foreground">Work experience details will appear here.</p>
                </CardContent>
              </Card>
            )}

            {profileData.portfolioItems && profileData.portfolioItems.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-xl flex items-center"><BookOpenIcon className="mr-2 h-5 w-5 text-primary" />Portfolio</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {/* Placeholder for Portfolio mapping - Phase 2d */}
                  <p className="text-sm text-muted-foreground">Portfolio items will appear here.</p>
                </CardContent>
              </Card>
            )}
            
            {profileData.professionalFeed && profileData.professionalFeed.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-xl flex items-center"><RssIcon className="mr-2 h-5 w-5 text-primary" />Professional Updates</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {/* Placeholder for Feed mapping - Phase 2d */}
                  <p className="text-sm text-muted-foreground">Feed items will appear here.</p>
                </CardContent>
              </Card>
            )}

            {profileData.reviews && profileData.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    Reviews & Feedback 
                    <Badge variant="outline" className="ml-2">{profileData.totalReviews}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Detailed reviews will be listed here. (Content coming in Phase 2d)</p>
                   <div className="mt-4 p-4 bg-muted/50 rounded-md text-center text-sm text-muted-foreground">
                        Full review listing coming soon.
                   </div>
                   <Button variant="outline" className="mt-4 w-full sm:w-auto">View All Reviews</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default IndividualProfileScreen;
    
