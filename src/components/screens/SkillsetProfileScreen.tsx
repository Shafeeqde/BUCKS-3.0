
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    StarIcon,
    HandThumbUpIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    EnvelopeIcon,
    PhoneIcon,
    GlobeAltIcon,
    BriefcaseIcon,
    BookOpenIcon,
    RssIcon,
    MapPinIcon,
    ArrowTopRightOnSquareIcon,
    LinkIcon as LinkIconOutline,
    InformationCircleIcon,
    CalendarDaysIcon // Added for booking CTA
} from '@heroicons/react/24/outline';
import { useToast } from "@/hooks/use-toast";
import type { TabName, SkillsetProfileData } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SkillsetProfileScreenProps {
  setActiveTab: (tab: TabName) => void;
  skillsetProfileId: string | null;
  onBookService: (profileId: string, profileName: string, skillName: string) => void; // Added prop
}

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
          userAvatarUrl: 'https://source.unsplash.com/random/120x120/?man,plumber',
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
            { id: 'pp1', title: 'Bathroom Renovation Project', imageUrl: 'https://source.unsplash.com/random/600x400/?modern,bathroom,plumbing', imageAiHint: 'modern bathroom plumbing', description: 'Complete plumbing overhaul for a luxury bathroom remodel, including installation of new pipes, shower systems, and high-efficiency fixtures.', link: '#' },
            { id: 'pp2', title: 'Commercial Kitchen Installation', imageUrl: 'https://source.unsplash.com/random/600x400/?commercial,kitchen,pipes', imageAiHint: 'commercial kitchen pipes', description: 'Designed and implemented the full plumbing system for a new restaurant kitchen, ensuring compliance with all health and safety codes.', link: '#' },
          ],
          professionalFeed: [
            { id: 'pf1', content: 'Just shared some quick tips for preventing common household leaks on my blog! #plumbingtips', imageUrl: 'https://source.unsplash.com/random/400x200/?water,tap', imageAiHint: 'water tap', timestamp: '1 week ago' },
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
          userAvatarUrl: 'https://source.unsplash.com/random/120x120/?man,interior,designer',
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
            { id: 'jp1', title: 'Downtown Loft Transformation', imageUrl: 'https://source.unsplash.com/random/600x400/?modern,loft,apartment', imageAiHint: 'modern loft apartment', description: 'Complete styling of a 2-bedroom downtown loft, focusing on maximizing space and light with custom furniture and art.', link: '#' },
            { id: 'jp2', title: 'Minimalist Scandinavian Home', imageUrl: 'https://source.unsplash.com/random/600x400/?scandinavian,interior,design', imageAiHint: 'scandinavian interior design', description: 'Styled a family home with a minimalist Scandinavian aesthetic, emphasizing natural materials and a serene color palette.', link: '#' },
            { id: 'jp3', title: 'Eclectic Living Room Concept', imageUrl: 'https://source.unsplash.com/random/600x400/?eclectic,living,room', imageAiHint: 'eclectic living room', description: 'Designed an eclectic living space blending vintage finds with contemporary pieces to reflect the client\'s unique personality.', link: '#' },
          ],
          professionalFeed: [
            { id: 'jf1', content: 'New blog post: "Top 5 Color Trends for Interiors in 2024". Check it out!', imageUrl: 'https://source.unsplash.com/random/400x200/?color,swatches', imageAiHint: 'color swatches', timestamp: '2 days ago' },
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

const SkillsetProfileScreen: React.FC<SkillsetProfileScreenProps> = ({ setActiveTab, skillsetProfileId, onBookService }) => {
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
        <svg className="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
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

  const handleBookServiceClick = () => {
    onBookService(profileData.id, profileData.userName, profileData.skillName);
  };

  return (
    <ScrollArea className="h-full bg-background">
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6 shadow-lg rounded-b-lg">
          <CardContent className="pt-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background ring-2 ring-primary flex-shrink-0">
              <AvatarImage src={profileData.userAvatarUrl} alt={profileData.userName} data-ai-hint={profileData.userAvatarAiHint || "professional person"} />
              <AvatarFallback className="text-3xl">{profileData.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-grow mt-4 md:mt-0">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary mb-1">{profileData.skillName}</h1>
              <p className="text-lg text-muted-foreground mb-1">by {profileData.userName}</p>
              {profileData.professionalTitle && <p className="text-md text-muted-foreground font-medium mb-2">{profileData.professionalTitle}</p>}
              {profileData.skillLevel && <Badge variant="secondary" className="mb-2">{profileData.skillLevel}</Badge>}

              {profileData.skillSpecificBio ? (
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{profileData.skillSpecificBio}</p>
              ) : profileData.skillDescription && (
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{profileData.skillDescription}</p>
              )}

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 mb-4">
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
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Button size="lg" className="w-full sm:w-auto" onClick={handleBookServiceClick}> {/* Updated this button */}
                  <CalendarDaysIcon className="mr-2 h-5 w-5" /> Book This Service
                </Button>
                {profileData.contactInfo?.phone && <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => toast({title: "Call initiated (mock)"})}><PhoneIcon className="mr-2 h-5 w-5"/> Call</Button>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 p-4">
          <div className="md:col-span-1 space-y-6">
            {profileData.contactInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><InformationCircleIcon className="mr-2 h-5 w-5 text-primary" />Contact Details</CardTitle>
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
            {profileData.skillDescription && profileData.skillSpecificBio && (
                <Card>
                    <CardHeader><CardTitle className="text-xl flex items-center"><InformationCircleIcon className="mr-2 h-5 w-5 text-primary"/>Skill Overview</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">{profileData.skillDescription}</p></CardContent>
                </Card>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            {profileData.workExperienceEntries && profileData.workExperienceEntries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><BriefcaseIcon className="mr-2 h-5 w-5 text-primary" />Relevant Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {profileData.workExperienceEntries.map(exp => (
                       <div key={exp.id} className="pb-3 border-b last:border-b-0">
                           <h4 className="font-semibold text-foreground">{exp.title}</h4>
                           <p className="text-sm text-muted-foreground">{exp.company} ({exp.years})</p>
                           {exp.description && <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>}
                       </div>
                   ))}
                </CardContent>
              </Card>
            )}

            {profileData.portfolioItems && profileData.portfolioItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><BookOpenIcon className="mr-2 h-5 w-5 text-primary" />Skill Portfolio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileData.portfolioItems.map(item => (
                    <div key={item.id}>
                        <h4 className="font-semibold text-md mb-1.5">{item.title}</h4>
                        {item.imageUrl && (
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-2 border">
                                <Image src={item.imageUrl} alt={item.title} layout="fill" objectFit="cover" data-ai-hint={item.imageAiHint || "portfolio project image"}/>
                            </div>
                        )}
                        {item.description && <p className="text-sm text-muted-foreground mb-1.5">{item.description}</p>}
                        {item.link && item.link !== '#' && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center">
                                View Project <ArrowTopRightOnSquareIcon className="ml-1 h-3 w-3"/>
                            </a>
                        )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {profileData.professionalFeed && profileData.professionalFeed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><RssIcon className="mr-2 h-5 w-5 text-primary" />Skill-Related Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.professionalFeed.map(item => (
                      <div key={item.id} className="pb-3 border-b last:border-b-0">
                          {item.imageUrl && (
                              <div className="relative aspect-video rounded-lg overflow-hidden mb-2 border">
                                  <Image src={item.imageUrl} alt="Feed item" layout="fill" objectFit="cover" data-ai-hint={item.imageAiHint || "feed update image"}/>
                              </div>
                          )}
                          <p className="text-sm text-foreground">{item.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
                      </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {profileData.reviews && profileData.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    Client Reviews
                    <Badge variant="outline" className="ml-2">{profileData.totalReviews}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {profileData.reviews.slice(0,3).map(review => (
                       <div key={review.id} className="pb-3 border-b last:border-b-0">
                           <div className="flex justify-between items-center mb-1">
                               <h5 className="font-semibold text-sm">{review.reviewerName}</h5>
                               <StarRatingDisplay rating={review.rating} size={4} className="h-4 w-4"/>
                           </div>
                           <p className="text-xs text-muted-foreground mb-1">{review.date}</p>
                           <p className="text-sm text-muted-foreground">{review.comment}</p>
                       </div>
                   ))}
                  {profileData.reviews.length > 3 && (
                    <Button variant="outline" className="w-full mt-2" onClick={() => toast({title: "View All Reviews (Mock)"})}>View All {profileData.totalReviews} Reviews</Button>
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
