
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, Building, MessageSquare, ShoppingBag, Users, Info, ExternalLink, Phone, MapPin, Rss, ThumbsUp, MessageCircle as CommentIcon, Star, Video, CalendarDays, DollarSign, PlusCircle, ExternalLinkIcon } from 'lucide-react';
import type { UserBusinessProfile, BusinessProduct, BusinessJob, BusinessFeedItem, BusinessService, BusinessReview } from '@/types';
import { cn } from '@/lib/utils';

interface UserBusinessProfileDetailScreenProps {
  profile: UserBusinessProfile | undefined | null;
  onBack: () => void;
  // TODO: Add handlers for interactions
  // onFollowClick?: (businessId: string | number) => void;
  // onContactClick?: (businessId: string | number) => void;
  // onViewProductDetail?: (productId: string) => void;
  // onAddToCart?: (productId: string) => void;
  // onApplyForJob?: (jobId: string) => void;
}

const StarRating: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 5, className }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // Basic half-star logic
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className={`w-${size} h-${size} text-yellow-400 fill-yellow-400`} />)}
      {halfStar && <Star key="half" className={`w-${size} h-${size} text-yellow-400 fill-yellow-200`} />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className={`w-${size} h-${size} text-muted-foreground/30`} />)}
    </div>
  );
};


const UserBusinessProfileDetailScreen: React.FC<UserBusinessProfileDetailScreenProps> = ({
  profile,
  onBack,
}) => {
  const { toast } = useToast(); // If you need toasts for actions

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

  // Placeholder action handlers
  const handleFollow = () => toast({ title: "Follow Clicked (Simulated)", description: `Following ${profile.name}` });
  const handleMessage = () => toast({ title: "Message Clicked (Simulated)", description: `Messaging ${profile.name}` });
  const handleAddToCart = (product: BusinessProduct) => toast({ title: "Added to Cart (Simulated)", description: `${product.name} added to cart.`});
  const handleViewProduct = (product: BusinessProduct) => toast({ title: "View Product (Simulated)", description: `Viewing ${product.name}.`});
  const handleApplyJob = (job: BusinessJob) => toast({ title: "Apply for Job (Simulated)", description: `Applying for ${job.title}.`});
  const handleEnquireService = (service: BusinessService) => toast({ title: "Enquire Service (Simulated)", description: `Enquiring about ${service.name}.`});


  return (
    <ScrollArea className="h-full custom-scrollbar bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Header and Cover Photo */}
        <div className="relative">
          {profile.coverPhoto ? (
            <Image
              src={profile.coverPhoto}
              alt={`${profile.name} Cover Photo`}
              width={1200}
              height={300}
              className="w-full h-48 md:h-64 object-cover"
              data-ai-hint={profile.coverPhotoAiHint || "business cover image"}
              priority
            />
          ) : (
            <div className="w-full h-48 md:h-64 bg-muted flex items-center justify-center">
              <Building className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-card/80 hover:bg-card text-card-foreground rounded-full z-20 backdrop-blur-sm"
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Info Section */}
        <div className="p-4 md:p-6">
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 -mt-16 sm:-mt-20">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background bg-background shadow-lg flex-shrink-0">
              <Image
                src={profile.logo || `https://placehold.co/128x128.png?text=${profile.name.substring(0,1)}`}
                alt={`${profile.name} Logo`}
                width={128}
                height={128}
                className="rounded-full object-cover"
                data-ai-hint={profile.logoAiHint || "company logo"}
              />
            </Avatar>
            <div className="mt-4 sm:mt-0 flex-grow text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">{profile.name}</h1>
              {profile.location && <p className="text-muted-foreground text-sm mt-1 flex items-center justify-center sm:justify-start"><MapPin className="h-4 w-4 mr-1.5"/>{profile.location}</p>}
              {profile.averageRating && profile.totalReviews ? (
                 <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <StarRating rating={profile.averageRating} />
                    <span className="text-sm text-muted-foreground">({profile.totalReviews} reviews)</span>
                 </div>
              ): null}
              <div className="flex items-center justify-center sm:justify-start space-x-3 mt-3 text-xs text-muted-foreground">
                <span><Users className="inline h-3.5 w-3.5 mr-1" /> {profile.followers || 0} Followers</span>
                <span>•</span>
                <span>{profile.following || 0} Following</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                <Button onClick={handleFollow}><ThumbsUp className="mr-2 h-4 w-4" /> Follow</Button>
                <Button variant="outline" onClick={handleMessage}><MessageSquare className="mr-2 h-4 w-4" /> Message</Button>
                {profile.website && (
                  <Button variant="outline" asChild>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="mr-2 h-4 w-4" /> Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <Card className="mt-6">
            <CardHeader><CardTitle className="text-lg flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>About {profile.name}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-foreground whitespace-pre-line">{profile.bio}</p>
              {profile.specialties && profile.specialties.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-1.5">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
                  </div>
                </div>
              )}
              {profile.phone && <p className="flex items-center pt-2 border-t mt-3"><Phone className="h-4 w-4 mr-2 text-muted-foreground"/> {profile.phone}</p>}
              {profile.email && <p className="flex items-center"><ExternalLink className="h-4 w-4 mr-2 text-muted-foreground"/> <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a></p>}
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Feed, Products, Services, Jobs, Reviews */}
        <Tabs defaultValue="feed" className="w-full px-2 sm:px-4 md:px-6 pb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-4 h-auto">
            <TabsTrigger value="feed" className="py-2.5"><Rss className="mr-1.5 h-4 w-4"/>Feed</TabsTrigger>
            <TabsTrigger value="products" className="py-2.5"><ShoppingBag className="mr-1.5 h-4 w-4"/>Products</TabsTrigger>
            <TabsTrigger value="services" className="py-2.5"><Briefcase className="mr-1.5 h-4 w-4"/>Services</TabsTrigger>
            <TabsTrigger value="jobs" className="py-2.5"><Users className="mr-1.5 h-4 w-4"/>Jobs</TabsTrigger>
            <TabsTrigger value="reviews" className="py-2.5"><Star className="mr-1.5 h-4 w-4"/>Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {profile.feed && profile.feed.length > 0 ? profile.feed.map(item => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  {item.image && <div className="relative aspect-video w-full mb-3 rounded-md overflow-hidden"><Image src={item.image} alt="Feed image" layout="fill" objectFit="cover" data-ai-hint={item.imageAiHint || "social media post"}/></div>}
                  {item.videoUrl && <div className="relative aspect-video w-full mb-3 rounded-md overflow-hidden bg-black flex items-center justify-center text-card-foreground"><Video className="w-12 h-12 opacity-70" /> <span className="ml-2">Video Placeholder</span></div> }
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
                {product.imageUrl && <div className="relative aspect-[4/3] w-full rounded-t-md overflow-hidden"><Image src={product.imageUrl} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={product.imageAiHint || "product item"}/></div>}
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  {product.description && <CardDescription className="text-xs mt-1 line-clamp-2">{product.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1.5">
                    {product.discountPrice ? (
                      <>
                        <p className="text-xl font-semibold text-primary">{product.discountPrice}</p>
                        <p className="text-sm text-muted-foreground line-through">{product.price}</p>
                      </>
                    ) : (
                      <p className="text-xl font-semibold text-primary">{product.price}</p>
                    )}
                    {product.discountPercentage && <Badge variant="destructive">{product.discountPercentage} OFF</Badge>}
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-2">
                  <Button className="w-full" onClick={() => handleAddToCart(product)}><ShoppingBag className="mr-2 h-4 w-4"/>Add to Cart</Button>
                  <Button variant="outline" className="w-full" onClick={() => handleViewProduct(product)}>View Details</Button>
                </CardFooter>
              </Card>
            )) : <p className="text-center text-muted-foreground py-8 col-span-full">No products listed.</p>}
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            {profile.services && profile.services.length > 0 ? profile.services.map(service => (
                 <Card key={service.id}>
                    <CardHeader>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        {service.price && <CardDescription className="font-medium text-primary">{service.price}</CardDescription>}
                    </CardHeader>
                    {service.description && <CardContent><p className="text-sm text-muted-foreground">{service.description}</p></CardContent>}
                    <CardFooter>
                        <Button variant="outline" onClick={() => handleEnquireService(service)}>Enquire</Button>
                    </CardFooter>
                 </Card>
            )) : <p className="text-center text-muted-foreground py-8">No services offered.</p>}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            {profile.jobs && profile.jobs.length > 0 ? profile.jobs.map(job => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {job.location && <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1"/>{job.location}</span>}
                    {job.type && <span className="flex items-center mt-1"><Briefcase className="h-3.5 w-3.5 mr-1"/>{job.type}</span>}
                    {job.postedDate && <span className="block text-xs mt-1.5 flex items-center"><CalendarDays className="h-3.5 w-3.5 mr-1"/>Posted: {job.postedDate}</span>}
                  </CardDescription>
                </CardHeader>
                {job.description && <CardContent><p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p></CardContent>}
                <CardFooter className="gap-2">
                  <Button onClick={() => handleApplyJob(job)}><PlusCircle className="mr-2 h-4 w-4"/>Apply Now</Button>
                  <Button variant="outline">View Details</Button>
                </CardFooter>
              </Card>
            )) : <p className="text-center text-muted-foreground py-8">No job openings currently.</p>}
          </TabsContent>
           <TabsContent value="reviews" className="space-y-4">
            {profile.reviews && profile.reviews.length > 0 ? profile.reviews.map(review => (
              <Card key={review.id}>
                <CardHeader className="flex flex-row justify-between items-start pb-2">
                  <div>
                    <CardTitle className="text-md">{review.reviewerName}</CardTitle>
                    <CardDescription className="text-xs">{review.date}</CardDescription>
                  </div>
                  <StarRating rating={review.rating} size={4}/>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            )) : <p className="text-center text-muted-foreground py-8">No reviews yet.</p>}
            <div className="text-center mt-6">
                 <Button variant="outline">Write a Review</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default UserBusinessProfileDetailScreen;

    