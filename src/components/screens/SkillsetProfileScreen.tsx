
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Star, ThumbsUp, MessageSquare as MessageSquareIcon, Mail, Phone, Globe, Briefcase, BookOpen, Rss, MapPin, ExternalLink, Link as LinkIcon, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { TabName, SkillsetProfileData, SkillsetSpecificWorkExperience, SkillsetSpecificPortfolioItem } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SkillsetProfileScreenProps {
  setActiveTab: (tab: TabName) => void;
  skillsetProfileId: string | null; // Can be null if no profile is selected yet
  // Optional: Pass current user data if this screen can also show "My Skillset Profile"
  // currentUserData?: any; 
}

// --- Placeholder API Simulation Function ---
const simulateFetchSkillsetProfile = async (profileId: string): Promise<SkillsetProfileData | null> => {
  console.log(`Simulating fetching skillset profile for ID: ${profileId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (profileId === 'plumbing-profile-johndoe-123') {
        const mockProfileData: SkillsetProfileData = {
          id: profileId,
          skillName: 'Plumbing Services',
          skillLevel: 'Certified Professional',
          skillDescription: 'Providing reliable and efficient plumbing solutions for residential and commercial properties. Specializing in repairs, installations, and maintenance.',
          userName: 'John Doe',
          userAvatarUrl: 'https://source.unsplash.com/120x120/?man,plumber',
          userAvatarAiHint: 'man plumber',
          professionalTitle: 'Master Plumber',
          skillSpecificBio: 'With over 10 years of dedicated experience in the plumbing industry, I offer comprehensive solutions tailored to your needs. Committed to quality workmanship and customer satisfaction.',
          contactInfo: {
            phone: '+1 123 456 7890',
            email: 'john.doe.plumber@example.com',
            location: 'Servicing the Greater Metro Area',
            website: 'https://johndoeplumbing.com'
          },
          workExperienceEntries: [
            { id: 'pw1', title: 'Lead Plumber', company: 'Local Plumbing Co.', years: '2015 - Present', description: 'Managed a team of plumbers, oversaw major residential and commercial plumbing installations, and specialized in troubleshooting complex issues.' },
            { id: 'pw2', title: 'Apprentice Plumber', company: 'Pro Plumb Apprent.', years: '2013 - 2015', description: 'Assisted senior plumbers on various projects, gaining hands-on experience in pipe fitting, fixture installation, and repair techniques.' },
          ],
          portfolioItems: [
            { id: 'pp1', title: 'Bathroom Renovation Project', imageUrl: 'https://source.unsplash.com/600x400/?modern,bathroom,plumbing', imageAiHint: 'modern bathroom plumbing', description: 'Complete plumbing overhaul for a luxury bathroom remodel, including installation of new pipes, shower systems, and high-efficiency fixtures.', link: '#' },
            { id: 'pp2', title: 'Commercial Kitchen Installation', imageUrl: 'https://source.unsplash.com/600x400/?commercial,kitchen,pipes', imageAiHint: 'commercial kitchen pipes', description: 'Designed and implemented the full plumbing system for a new restaurant kitchen, ensuring compliance with all health and safety codes.', link: '#' },
          ],
          professionalFeed: [
            { id: 'pf1', content: 'Just shared some quick tips for preventing common household leaks on my blog! #plumbingtips', imageUrl: 'https://source.unsplash.com/400x200/?water,tap', imageAiHint: 'water tap', timestamp: '1 week ago' },
            { id: 'pf2', content: 'Successfully completed a major repiping job for a historic building downtown. Challenging but rewarding!', timestamp: '3 days ago' },
          ],
          reviews: [
            { id: 'pr1', reviewerName: 'Homeowner A', rating: 5, comment: 'John fixed my leaky faucet quickly and was very professional. Highly recommend his plumbing services!', date: '2023-11-01' },
            { id: 'pr2', reviewerName: 'Business Owner B', rating: 4, comment: 'Reliable and knowledgeable. Handled our office plumbing needs efficiently.', date: '2023-10-25' },
          ],
          recommendationsCount: 30,
          averageRating: 4.9,
          totalReviews: 15,
        };
        console.log('Simulated plumbing skillset profile fetched:', mockProfileData);
        resolve(mockProfileData);
      } else if (profileId === 'jenson-interior-stylist-123') {
        const mockProfileData: SkillsetProfileData = {
          id: profileId,
          skillName: 'Interior Home Styling',
          skillLevel: 'Lead Stylist & Consultant',
          skillDescription: 'Transforming spaces into beautiful, functional, and personalized environments. Specializing in modern, minimalist, and eclectic styles.',
          userName: 'Jenson Harris',
          userAvatarUrl: 'https://source.unsplash.com/120x120/?man,interior,designer',
          userAvatarAiHint: 'man interior designer',
          professionalTitle: 'Interior Home Stylist',
          skillSpecificBio: 'A passionate interior stylist with a keen eye for detail and a commitment to creating spaces that inspire. My approach is collaborative, ensuring your vision is at the heart of every design.',
          contactInfo: {
            phone: '+1 555 0101',
            email: 'jenson.stylist@example.com',
            location: 'New York, NY & Online Consultations',
            website: 'https://jensoninteriors.design'
          },
          workExperienceEntries: [
            { id: 'jw1', title: 'Lead Interior Stylist', company: 'Chic Living Designs', years: '2018 - Present', description: 'Led and managed numerous high-end residential styling projects from concept to completion. Collaborated with architects and clients to deliver bespoke interior solutions.' },
            { id: 'jw2', title: 'Junior Interior Designer', company: 'Urban Aesthetics Inc.', years: '2016 - 2018', description: 'Assisted senior designers in material sourcing, mood board creation, and client presentations for diverse interior projects.' },
          ],
          portfolioItems: [
            { id: 'jp1', title: 'Downtown Loft Transformation', imageUrl: 'https://source.unsplash.com/600x400/?modern,loft,apartment', imageAiHint: 'modern loft apartment', description: 'Complete styling of a 2-bedroom downtown loft, focusing on maximizing space and light with custom furniture and art.', link: '#' },
            { id: 'jp2', title: 'Minimalist Scandinavian Home', imageUrl: 'https://source.unsplash.com/600x400/?scandinavian,interior,design', imageAiHint: 'scandinavian interior design', description: 'Styled a family home with a minimalist Scandinavian aesthetic, emphasizing natural materials and a serene color palette.', link: '#' },
            { id: 'jp3', title: 'Eclectic Living Room Concept', imageUrl: 'https://source.unsplash.com/600x400/?eclectic,living,room', imageAiHint: 'eclectic living room', description: 'Designed an eclectic living space blending vintage finds with contemporary pieces to reflect the client\'s unique personality.', link: '#' },
          ],
          professionalFeed: [
            { id: 'jf1', content: 'New blog post: "Top 5 Color Trends for Interiors in 2024". Check it out!', imageUrl: 'https://source.unsplash.com/400x200/?color,swatches', imageAiHint: 'color swatches', timestamp: '2 days ago' },
            { id: 'jf2', content: 'Thrilled to have a recent project featured in "Modern Home Digest"! #interiordesign', timestamp: '1 week ago' },
          ],
          reviews: [
            { id: 'jr1', reviewerName: 'Sarah L.', rating: 5, comment: 'Jenson completely understood my vision and brought it to life beautifully! So easy to work with.', date: '2023-12-05' },
            { id: 'jr2', reviewerName: 'Mark P.', rating: 5, comment: 'Our home feels brand new thanks to Jenson. His attention to detail is impeccable.', date: '2023-11-15' },
            { id: 'jr3', reviewerName: 'Emily K.', rating: 4, comment: 'Loved the concepts Jenson presented. The project took a bit longer than expected but the result was worth it.', date: '2023-10-02' },
          ],
          recommendationsCount: 125,
          averageRating: 4.8,
          totalReviews: 88,
        };
        console.log('Simulated Jenson Harris Interior Styling profile fetched:', mockProfileData);
        resolve(mockProfileData);
      }
      else {
        console.log('Simulated skillset profile not found for ID:', profileId);
        resolve(null);
      }
    }, 1000);
  });
};

const StarRating: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 5, className = "h-5 w-5" }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className={cn(className, "text-yellow-400 fill-yellow-400")} />)}
      {halfStar && <Star key="half" className={cn(className, "text-yellow-400 fill-yellow-200")} />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className={cn(className, "text-muted-foreground/50")} />)}
    </div>
  );
};

const SkillsetProfileScreen: React.FC<SkillsetProfileScreenProps> = ({ setActiveTab, skillsetProfileId }) => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<SkillsetProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skillsetProfileId) {
      fetchSkillsetProfileData(skillsetProfileId);
    } else {
      setError("No skillset profile ID provided.");
      setLoading(false);
      // Optionally, navigate away or show a different UI
    }
  }, [skillsetProfileId]);

  const fetchSkillsetProfileData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulateFetchSkillsetProfile(id);
      if (data) {
        setProfileData(data);
      } else {
        setError("Skillset profile not found.");
        toast({ title: "Error", description: "Skillset profile not found.", variant: "destructive" });
      }
    } catch (err: any) {
      console.error('Error fetching skillset profile:', err);
      setError("Failed to load skillset profile.");
      toast({ title: "Error", description: "Failed to load skillset profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading Skillset Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-destructive mb-4">{error}</p>
        {skillsetProfileId && <Button onClick={() => fetchSkillsetProfileData(skillsetProfileId)} variant="outline">Try Again</Button>}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground">Skillset profile data is unavailable.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Profile Header */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="pt-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/20 flex-shrink-0">
              <AvatarImage src={profileData.userAvatarUrl} alt={profileData.userName} data-ai-hint={profileData.userAvatarAiHint || "professional person"} />
              <AvatarFallback>{profileData.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary mb-1">{profileData.skillName}</h1>
              <p className="text-lg text-muted-foreground mb-1">by {profileData.userName}</p>
              {profileData.professionalTitle && <p className="text-md text-muted-foreground font-medium mb-2">{profileData.professionalTitle}</p>}
              {profileData.skillLevel && <Badge variant="secondary" className="mb-2">{profileData.skillLevel}</Badge>}
              {profileData.skillSpecificBio && <p className="text-muted-foreground mb-4 text-base">{profileData.skillSpecificBio}</p>}
              {!profileData.skillSpecificBio && profileData.skillDescription && <p className="text-muted-foreground mb-4 text-base">{profileData.skillDescription}</p>}

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 mb-4">
                {profileData.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={profileData.averageRating} />
                    <span className="text-sm text-muted-foreground ml-1">({profileData.averageRating.toFixed(1)})</span>
                    <span className="text-sm text-muted-foreground hidden sm:inline"> ({profileData.totalReviews} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span>{profileData.recommendationsCount} Recommendations</span>
                </div>
                {profileData.averageRating > 0 && <span className="text-sm text-muted-foreground sm:hidden"> ({profileData.totalReviews} reviews)</span>}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Button size="lg">
                  <MessageSquareIcon className="mr-2 h-5 w-5" /> Enquire about {profileData.skillName.split(' ')[0]}
                </Button>
                {profileData.contactInfo?.phone && <Button size="lg" variant="outline"><Phone className="mr-2 h-5 w-5"/> Call</Button>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column (Contact, etc.) */}
          <div className="md:col-span-1 space-y-6">
            {profileData.contactInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><Mail className="mr-2 h-5 w-5 text-primary" />Contact Information</CardTitle>
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
                  {profileData.contactInfo.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{profileData.contactInfo.location}</span>
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
             {profileData.skillDescription && !profileData.skillSpecificBio && (
                <Card>
                    <CardHeader><CardTitle className="text-xl flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Skill Description</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">{profileData.skillDescription}</p></CardContent>
                </Card>
            )}
          </div>

          {/* Right Column (Work Experience, Portfolio, Feed, Reviews) */}
          <div className="md:col-span-2 space-y-6">
            {profileData.workExperienceEntries && profileData.workExperienceEntries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" />Work Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.workExperienceEntries.map((item) => (
                    <div key={item.id} className="pb-4 border-b last:border-b-0">
                      <h4 className="text-md font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.company} ({item.years})</p>
                      {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {profileData.portfolioItems && profileData.portfolioItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary" />Portfolio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileData.portfolioItems.map((item) => (
                    <div key={item.id} className="pb-4 border-b last:border-b-0">
                      {item.imageUrl && (
                        <div className="relative w-full aspect-video rounded-md overflow-hidden mb-2">
                          <Image src={item.imageUrl} alt={item.title} layout="fill" objectFit="cover" data-ai-hint={item.imageAiHint || "portfolio project"} />
                        </div>
                      )}
                      <h4 className="text-md font-semibold text-foreground">{item.title}</h4>
                      {item.description && <p className="text-xs text-muted-foreground mt-1 mb-2">{item.description}</p>}
                      {item.link && (
                        <Button variant="link" size="sm" asChild className="p-0 h-auto">
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs">
                            View Project <ExternalLink className="inline h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {/* TODO: Handle videoUrl */}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {profileData.professionalFeed && profileData.professionalFeed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><Rss className="mr-2 h-5 w-5 text-primary" />Professional Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.professionalFeed.map((item) => (
                    <div key={item.id} className="pb-4 border-b last:border-b-0">
                       {item.imageUrl && (
                        <div className="relative w-full aspect-[16/7] rounded-md overflow-hidden mb-2">
                          <Image src={item.imageUrl} alt="Feed image" layout="fill" objectFit="cover" data-ai-hint={item.imageAiHint || "social media update"} />
                        </div>
                      )}
                      <p className="text-sm text-foreground mb-1">{item.content}</p>
                      <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                    </div>
                  ))}
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
                <CardContent className="space-y-4">
                  {profileData.reviews.slice(0, 3).map((item) => ( // Show first 3 reviews
                    <div key={item.id} className="pb-4 border-b last:border-b-0">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="text-sm font-semibold text-foreground">{item.reviewerName}</h5>
                        <StarRating rating={item.rating} size={4} className="h-4 w-4" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 italic">{item.comment}</p>
                      <p className="text-xs text-muted-foreground text-right">{item.date}</p>
                    </div>
                  ))}
                  {profileData.reviews.length > 3 && (
                    <Button variant="outline" className="w-full mt-2">View All {profileData.totalReviews} Reviews</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SkillsetProfileScreen;

