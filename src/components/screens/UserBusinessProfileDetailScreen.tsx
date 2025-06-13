
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Briefcase, Building, MessageSquare, ShoppingBag, Users, Info, ExternalLink, Phone, MapPin, Rss, ThumbsUp, MessageCircle as CommentIcon } from 'lucide-react';
import type { UserBusinessProfile, BusinessProduct, BusinessJob, BusinessFeedItem } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

interface UserBusinessProfileDetailScreenProps {
  profile: UserBusinessProfile | undefined | null;
  onBack: () => void;
}

const UserBusinessProfileDetailScreen: React.FC<UserBusinessProfileDetailScreenProps> = ({ profile, onBack }) => {
  const [activeTab, setActiveTab] = useState('feed');

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <Building className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">The business profile you are looking for does not exist or could not be loaded.</p>
        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full custom-scrollbar bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header and Cover Photo */}
        <div className="relative">
          {profile.coverPhoto ? (
            <Image
              src={profile.coverPhoto}
              alt={`${profile.name} Cover Photo`}
              width={1200}
              height={300}
              className="w-full h-48 md:h-64 object-cover"
              data-ai-hint={profile.coverPhotoAiHint || "business cover"}
            />
          ) : (
            <div className="w-full h-48 md:h-64 bg-muted flex items-center justify-center">
              <Building className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-card/70 hover:bg-card text-card-foreground rounded-full z-20" // Ensure back button is above cover
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Info Section */}
        <div className="p-4 md:p-6">
          <div className="relative z-10 flex flex-col sm:flex-row items-start space-x-0 sm:space-x-6 -mt-16 sm:-mt-20">
            <Image
              src={profile.logo || `https://placehold.co/120x120.png?text=${profile.name.substring(0,1)}`}
              alt={`${profile.name} Logo`}
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-background bg-background shadow-lg"
              data-ai-hint={profile.logoAiHint || "company logo"}
            />
            <div className="mt-4 sm:mt-0 flex-grow">
              <h1 className="text-3xl font-bold font-headline text-foreground">{profile.name}</h1>
              <p className="text-muted-foreground mt-1">{profile.bio}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <span><Users className="inline h-4 w-4 mr-1" /> {profile.followers || 0} Followers</span>
                <span>{profile.following || 0} Following</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button><ThumbsUp className="mr-2 h-4 w-4" /> Follow</Button>
                <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Message</Button>
                {profile.website && (
                  <Button variant="outline" asChild>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <Card className="mt-6">
            <CardHeader><CardTitle className="text-lg flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>About</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {profile.location && <p className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0"/> {profile.location}</p>}
              {profile.phone && <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-muted-foreground"/> {profile.phone}</p>}
              {profile.specialties && profile.specialties.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Feed, Products, Services, Jobs */}
        <Tabs defaultValue="feed" className="w-full px-4 md:px-6 pb-6" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
            <TabsTrigger value="feed"><Rss className="mr-2 h-4 w-4"/>Feed</TabsTrigger>
            <TabsTrigger value="products"><ShoppingBag className="mr-2 h-4 w-4"/>Products</TabsTrigger>
            <TabsTrigger value="services"><Briefcase className="mr-2 h-4 w-4"/>Services</TabsTrigger>
            <TabsTrigger value="jobs"><Users className="mr-2 h-4 w-4"/>Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {profile.feed && profile.feed.length > 0 ? profile.feed.map(item => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  {item.image && <Image src={item.image} alt="Feed image" width={500} height={300} className="rounded-md mb-3 w-full object-cover aspect-video" data-ai-hint={item.imageAiHint || "social media post"}/>}
                  <p className="text-foreground mb-2">{item.content}</p>
                  <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                   <div className="flex items-center text-muted-foreground text-sm mt-3 pt-3 border-t">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><ThumbsUp className="mr-1 h-4 w-4" /> Like</Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><CommentIcon className="mr-1 h-4 w-4" /> Comment</Button>
                    </div>
                </CardContent>
              </Card>
            )) : <p className="text-center text-muted-foreground py-8">No feed items yet.</p>}
          </TabsContent>

          <TabsContent value="products" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.products && profile.products.length > 0 ? profile.products.map(product => (
              <Card key={product.id}>
                {product.imageUrl && <Image src={product.imageUrl} alt={product.name} width={300} height={200} className="rounded-t-md w-full object-cover aspect-[3/2]" data-ai-hint={product.imageAiHint || "product item"}/>}
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  {product.description && <CardDescription>{product.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-primary">₹{product.price}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            )) : <p className="text-center text-muted-foreground py-8 col-span-full">No products listed.</p>}
          </TabsContent>

          <TabsContent value="services">
            {profile.services && profile.services.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2 list-disc list-inside">
                    {profile.services.map((service, index) => <li key={index} className="text-foreground">{service}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ) : <p className="text-center text-muted-foreground py-8">No services offered.</p>}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            {profile.jobs && profile.jobs.length > 0 ? profile.jobs.map(job => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    {job.location && `${job.location} • `} {job.type && `${job.type}`}
                    {job.postedDate && <span className="block text-xs mt-1">Posted: {job.postedDate}</span>}
                  </CardDescription>
                </CardHeader>
                {job.description && <CardContent><p className="text-sm text-muted-foreground">{job.description}</p></CardContent>}
                <CardFooter>
                  <Button variant="outline">Apply Now</Button>
                </CardFooter>
              </Card>
            )) : <p className="text-center text-muted-foreground py-8">No job openings.</p>}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default UserBusinessProfileDetailScreen;
