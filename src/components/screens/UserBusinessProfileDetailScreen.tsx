
"use client";

import React from 'react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  StarIcon,
  RssIcon,
  ShoppingBagIcon,
  BriefcaseIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import type { UserBusinessProfile, BusinessProduct, BusinessService, BusinessJob, BusinessFeedItem, BusinessReview } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface UserBusinessProfileDetailScreenProps {
  profile: UserBusinessProfile | undefined | null;
  onBack: () => void;
  // Add more interactive props if needed, e.g., onFollow, onMessage, onAddToCart
}

const StarRatingDisplay: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 5, className }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // Adjust threshold if needed
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className={`w-${size} h-${size} text-yellow-400 fill-yellow-400`} />)}
      {halfStar && <StarIcon key="half" className={`w-${size} h-${size} text-yellow-400 fill-yellow-200`} />}
      {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className={`w-${size} h-${size} text-gray-300`} />)}
    </div>
  );
};


const UserBusinessProfileDetailScreen: React.FC<UserBusinessProfileDetailScreenProps> = ({
  profile,
  onBack,
}) => {
  const { toast } = useToast();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <BuildingOfficeIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">The business profile you are looking for does not exist or could not be loaded.</p>
        <Button onClick={onBack}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }
  
  const handleActionClick = (action: string) => {
    toast({ title: `${action} Clicked`, description: `Simulating ${action.toLowerCase()} action for ${profile.name}.` });
  };

  return (
    <ScrollArea className="h-full custom-scrollbar bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="relative h-48 sm:h-60 md:h-72 group">
          {profile.coverPhoto ? (
            <Image
              src={profile.coverPhoto}
              alt={`${profile.name} cover photo`}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg sm:rounded-t-xl"
              data-ai-hint={profile.coverPhotoAiHint || "business cover photo"}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg sm:rounded-t-xl flex items-center justify-center">
              <BuildingOfficeIcon className="w-16 h-16 text-primary/50" />
            </div>
          )}
           <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="absolute top-3 left-3 bg-black/30 hover:bg-black/50 text-white rounded-full z-10 h-9 w-9"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </div>

        <Card className="shadow-xl -mt-12 sm:-mt-16 md:-mt-20 mx-2 sm:mx-4 md:mx-6 rounded-xl border-border overflow-hidden">
          <CardHeader className="p-4 sm:p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <Avatar className="h-20 w-20 sm:h-28 sm:w-28 border-4 border-background ring-2 ring-primary flex-shrink-0 bg-card">
                {profile.logo ? (
                  <AvatarImage src={profile.logo} alt={profile.name} data-ai-hint={profile.logoAiHint || "business logo"}/>
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-muted rounded-full">
                     <BuildingOfficeIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary/70" />
                   </div>
                )}
                <AvatarFallback className="text-2xl sm:text-3xl">{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
                <CardTitle className="text-2xl sm:text-3xl font-headline text-foreground">{profile.name}</CardTitle>
                {profile.location && <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1"><MapPinIcon className="h-4 w-4 flex-shrink-0"/>{profile.location}</p>}
                <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2 text-xs text-muted-foreground">
                  <span><span className="font-semibold text-foreground">{profile.followers || 0}</span> Followers</span>
                  <span><span className="font-semibold text-foreground">{profile.following || 0}</span> Following</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 mt-3 sm:mt-0 self-center sm:self-start">
                <Button size="sm" onClick={() => handleActionClick('Follow')}><UserPlusIcon className="mr-1.5 h-4 w-4"/>Follow</Button>
                <Button size="sm" variant="outline" onClick={() => handleActionClick('Message')}><ChatBubbleLeftRightIcon className="mr-1.5 h-4 w-4"/>Message</Button>
              </div>
            </div>
            {profile.bio && <CardDescription className="mt-4 text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-line">{profile.bio}</CardDescription>}
             {profile.specialties && profile.specialties.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {profile.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                </div>
            )}
          </CardHeader>

          <CardContent className="p-0">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 rounded-none h-auto bg-card border-b">
                <TabsTrigger value="feed" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><RssIcon className="h-4 w-4"/>Feed</TabsTrigger>
                <TabsTrigger value="products" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><ShoppingBagIcon className="h-4 w-4"/>Products</TabsTrigger>
                <TabsTrigger value="services" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><SparklesIcon className="h-4 w-4"/>Services</TabsTrigger>
                <TabsTrigger value="jobs" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><BriefcaseIcon className="h-4 w-4"/>Jobs</TabsTrigger>
                <TabsTrigger value="reviews" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none flex items-center gap-1.5 text-xs sm:text-sm"><StarIcon className="h-4 w-4"/>Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="p-4 min-h-[200px]">
                {profile.feed && profile.feed.length > 0 ? (
                  <div className="space-y-4">
                    {profile.feed.map(item => (
                      <Card key={item.id} className="shadow-sm">
                        <CardContent className="p-4">
                          {item.image && (
                            <div className="relative aspect-video rounded-md overflow-hidden mb-3 border">
                              <Image src={item.image} alt="Feed image" layout="fill" objectFit="cover" data-ai-hint={item.imageAiHint || "business feed item"}/>
                            </div>
                          )}
                          <p className="text-sm text-foreground mb-1 whitespace-pre-line">{item.content}</p>
                          <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground text-center py-10">No feed updates yet.</p>}
              </TabsContent>

              <TabsContent value="products" className="p-4 min-h-[200px]">
                {profile.products && profile.products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.products.map(product => (
                      <Card key={product.id} className="shadow-sm">
                        {product.imageUrl && (
                          <div className="relative aspect-square rounded-t-md overflow-hidden border-b">
                            <Image src={product.imageUrl} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={product.imageAiHint || "product item"}/>
                             {product.discountPercentage && <Badge variant="destructive" className="absolute top-2 right-2">{product.discountPercentage}</Badge>}
                          </div>
                        )}
                        <CardHeader className="p-3">
                          <CardTitle className="text-md font-semibold line-clamp-2">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          {product.description && <p className="text-xs text-muted-foreground line-clamp-3 mb-2">{product.description}</p>}
                          <div className="flex items-baseline gap-2">
                             <p className={cn("font-bold text-lg", product.discountPrice ? "text-primary" : "text-foreground")}>
                                ₹{product.discountPrice || product.price}
                            </p>
                            {product.discountPrice && <p className="text-sm text-muted-foreground line-through">₹{product.price}</p>}
                          </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                            <Button size="sm" className="w-full" onClick={() => handleActionClick(`Add ${product.name} to Cart`)}>Add to Cart</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground text-center py-10">No products listed yet.</p>}
              </TabsContent>

              <TabsContent value="services" className="p-4 min-h-[200px]">
                {profile.services && profile.services.length > 0 ? (
                  <div className="space-y-3">
                    {profile.services.map(service => (
                      <Card key={service.id} className="shadow-sm">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-md text-foreground">{service.name}</h4>
                          {service.description && <p className="text-sm text-muted-foreground mt-1">{service.description}</p>}
                          {service.price && <p className="text-sm font-medium text-primary mt-2">{service.price}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground text-center py-10">No services listed yet.</p>}
              </TabsContent>

              <TabsContent value="jobs" className="p-4 min-h-[200px]">
                {profile.jobs && profile.jobs.length > 0 ? (
                  <div className="space-y-4">
                    {profile.jobs.map(job => (
                      <Card key={job.id} className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-primary">{job.title}</CardTitle>
                          <CardDescription>{job.type} {job.location && `• ${job.location}`}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                          {job.description && <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>}
                          {job.salaryRange && <p className="text-sm font-medium">Salary: {job.salaryRange}</p>}
                        </CardContent>
                        <CardFooter className="border-t pt-3">
                          <Button size="sm" variant="outline" onClick={() => handleActionClick(`View Job: ${job.title}`)}>View Details</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground text-center py-10">No job openings currently.</p>}
              </TabsContent>

              <TabsContent value="reviews" className="p-4 min-h-[200px]">
                {profile.reviews && profile.reviews.length > 0 ? (
                  <div className="space-y-4">
                    <div className="mb-4 flex items-center gap-2">
                        <StarRatingDisplay rating={profile.averageRating || 0} />
                        <span className="text-lg font-semibold text-foreground">{profile.averageRating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-sm text-muted-foreground">({profile.totalReviews || 0} reviews)</span>
                    </div>
                    {profile.reviews.map(review => (
                      <Card key={review.id} className="shadow-sm">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-md font-semibold">{review.reviewerName}</CardTitle>
                            <StarRatingDisplay rating={review.rating} size={4}/>
                          </div>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground text-center py-10">No reviews yet.</p>}
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="p-4 sm:p-6 border-t border-border space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
            <div className="grid grid-cols-2 gap-2 text-xs w-full sm:w-auto">
                {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline"><GlobeAltIcon className="mr-1.5 h-4 w-4"/>Website</a>}
                {profile.phone && <a href={`tel:${profile.phone}`} className="flex items-center text-primary hover:underline"><PhoneIcon className="mr-1.5 h-4 w-4"/>Call</a>}
                {profile.email && <a href={`mailto:${profile.email}`} className="flex items-center text-primary hover:underline"><EnvelopeIcon className="mr-1.5 h-4 w-4"/>Email</a>}
            </div>
            <Button variant="outline" size="sm" onClick={() => handleActionClick('Share')}><ShareIcon className="mr-1.5 h-4 w-4"/>Share Profile</Button>
          </CardFooter>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default UserBusinessProfileDetailScreen;

    