
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowLeft, Briefcase, Building, MessageSquare, ShoppingBag, Users, Info, ExternalLink as ExternalLinkIcon, Phone, MapPin, Rss, ThumbsUp, 
    MessageCircle as CommentIcon, Star, Video, CalendarDays, DollarSign, PlusCircle, MoreHorizontal, Settings, Edit, Trash2, UserPlus
} from 'lucide-react';
import type { UserBusinessProfile, BusinessProduct, BusinessJob, BusinessFeedItem, BusinessService, BusinessReview } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


interface UserBusinessProfileDetailScreenProps {
  profile: UserBusinessProfile | undefined | null;
  onBack: () => void;
}

const StarRating: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 5, className }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const iconSizeClass = `w-${size} h-${size}`;
  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className={cn(iconSizeClass, "text-yellow-400 fill-yellow-400")} />)}
      {halfStar && <Star key="half" className={cn(iconSizeClass, "text-yellow-400 fill-yellow-200")} />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className={cn(iconSizeClass, "text-muted-foreground/30")} />)}
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
        <Building className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">The business profile you are looking for does not exist or could not be loaded.</p>
        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const handleFollow = () => toast({ title: "Follow Clicked (Simulated)", description: `Following ${profile.name}` });
  const handleMessage = () => toast({ title: "Message Clicked (Simulated)", description: `Messaging ${profile.name}` });
  const handleAddToCart = (product: BusinessProduct) => toast({ title: "Added to Cart (Simulated)", description: `${product.name} added to cart.`});
  const handleViewProduct = (product: BusinessProduct) => toast({ title: "View Product (Simulated)", description: `Viewing ${product.name}. This would ideally open a product detail view or modal.`});
  const handleApplyJob = (job: BusinessJob) => toast({ title: "Apply for Job (Simulated)", description: `Applying for ${job.title}.`});
  const handleEnquireService = (service: BusinessService) => toast({ title: "Enquire Service (Simulated)", description: `Enquiring about ${service.name}.`});


  return (
    <ScrollArea className="h-full custom-scrollbar bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-black/30 hover:bg-black/50 text-white rounded-full z-20 backdrop-blur-sm"
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {profile.coverPhoto ? (
            <Image
              src={profile.coverPhoto}
              alt={`${profile.name} Cover Photo`}
              width={1200}
              height={300}
              className="w-full h-48 md:h-60 object-cover"
              data-ai-hint={profile.coverPhotoAiHint || "business cover image"}
              priority
            />
          ) : (
            <div className="w-full h-48 md:h-60 bg-muted flex items-center justify-center">
              <Building className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          {profile.averageRating && profile.totalReviews ? (
            <Badge variant="secondary" className="absolute top-4 right-4 bg-black/50 text-white backdrop-blur-sm text-sm py-1.5 px-3 rounded-full shadow-md">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1.5"/> {profile.averageRating.toFixed(1)} Ratings ({profile.totalReviews})
            </Badge>
          ) : null}
        </div>

        <div className="p-4 md:p-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 -mt-12 sm:-mt-16 md:-mt-20">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0">
              <Image
                src={profile.logo || `https://source.unsplash.com/128x128/?abstract,logo&text=${profile.name.substring(0,1)}`}
                alt={`${profile.name} Logo`}
                fill
                className="rounded-full sm:rounded-lg object-cover border-4 border-background bg-card shadow-lg"
                data-ai-hint={profile.logoAiHint || "company logo"}
              />
            </div>
            <div className="mt-4 sm:mt-0 flex-grow text-center sm:text-left pt-0 sm:pt-4">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">{profile.name}</h1>
              <div className="flex items-center justify-center sm:justify-start space-x-4 mt-1 text-sm text-muted-foreground">
                <span>{profile.followers || 0} Followers</span>
                <span>•</span>
                <span>{profile.following || 0} Following</span>
              </div>
            </div>
          </div>
          
          {profile.bio && <p className="text-sm text-foreground mt-4 whitespace-pre-line">{profile.bio}</p>}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 flex items-center">
              <ExternalLinkIcon className="h-4 w-4 mr-1.5"/> {profile.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
        
        <div className="px-4 md:px-6 pb-4 flex items-center gap-2">
            <Button onClick={handleFollow} className="flex-grow bg-primary hover:bg-primary/90 text-primary-foreground">
                <UserPlus className="mr-2 h-4 w-4" /> Follow
            </Button>
            <Button variant="outline" onClick={handleMessage} className="flex-grow">
                <MessageSquare className="mr-2 h-4 w-4" /> Message
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="More options">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({title: "Share Profile (Simulated)"})}>
                            <ExternalLinkIcon className="mr-2 h-4 w-4" /> Share Profile
                        </DropdownMenuItem>
                         {profile.phone && 
                            <DropdownMenuItem onClick={() => toast({title: `Calling ${profile.phone} (Simulated)`})}>
                                <Phone className="mr-2 h-4 w-4" /> Call Business
                            </DropdownMenuItem>
                        }
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast({title: "Report Profile (Simulated)"})} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Info className="mr-2 h-4 w-4" /> Report
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>More Options</p>
              </TooltipContent>
            </Tooltip>
        </div>

        <Tabs defaultValue="products" className="w-full px-2 sm:px-4 md:px-6 pb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 h-auto bg-muted rounded-md">
            <TabsTrigger value="products" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm"><ShoppingBag className="mr-1.5 h-4 w-4 hidden sm:inline-flex"/>Products</TabsTrigger>
            <TabsTrigger value="services" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm"><Briefcase className="mr-1.5 h-4 w-4 hidden sm:inline-flex"/>Services</TabsTrigger>
            <TabsTrigger value="posts" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm"><Rss className="mr-1.5 h-4 w-4 hidden sm:inline-flex"/>Posts</TabsTrigger>
            <TabsTrigger value="about" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm"><Info className="mr-1.5 h-4 w-4 hidden sm:inline-flex"/>About Us</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <h3 className="text-xl font-semibold text-foreground mb-4 px-2 font-headline">Menu Items</h3>
            {profile.products && profile.products.length > 0 ? (
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-5">
                    {profile.products.map(product => (
                        <div key={product.id} className="flex flex-col items-center text-center cursor-pointer group" onClick={() => handleViewProduct(product)}>
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2">
                                <Image 
                                    src={product.imageUrl || 'https://source.unsplash.com/100x100/?food,item'} 
                                    alt={product.name} 
                                    fill
                                    className="rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all shadow-md"
                                    data-ai-hint={product.imageAiHint || "menu food item"}
                                />
                            </div>
                            <p className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary truncate w-full px-1">{product.name}</p>
                            <p className="text-xs text-primary font-semibold">{product.discountPrice ? product.discountPrice : product.price}</p>
                        </div>
                    ))}
                </div>
            ) : <p className="text-center text-muted-foreground py-8 col-span-full">No menu items listed yet.</p>}
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            {profile.services && profile.services.length > 0 ? profile.services.map(service => (
                 <Card key={service.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">{service.name}</CardTitle>
                        {service.price && <CardDescription className="font-medium text-primary">{service.price}</CardDescription>}
                    </CardHeader>
                    {service.description && <CardContent><p className="text-sm text-muted-foreground">{service.description}</p></CardContent>}
                    <CardFooter>
                        <Button variant="outline" size="sm" onClick={() => handleEnquireService(service)}>Enquire Now</Button>
                    </CardFooter>
                 </Card>
            )) : <p className="text-center text-muted-foreground py-8">No services offered by this business.</p>}
          </TabsContent>
          
          <TabsContent value="posts" className="space-y-4">
            {profile.feed && profile.feed.length > 0 ? profile.feed.map(item => (
              <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  {item.image && <div className="relative aspect-video w-full mb-3 rounded-md overflow-hidden"><Image src={item.image} alt="Feed image" layout="fill" objectFit="cover" data-ai-hint={item.imageAiHint || "social media post"}/></div>}
                  {item.videoUrl && <div className="relative aspect-video w-full mb-3 rounded-md overflow-hidden bg-black flex items-center justify-center text-card-foreground"><Video className="w-12 h-12 opacity-70" /> <span className="ml-2">Video Placeholder</span></div> }
                  <p className="text-foreground mb-2 whitespace-pre-line">{item.content}</p>
                  <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                   <div className="flex items-center text-muted-foreground text-sm mt-3 pt-3 border-t">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><ThumbsUp className="mr-1 h-4 w-4" /> Like</Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><CommentIcon className="mr-1 h-4 w-4" /> Comment</Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary ml-auto"><ExternalLinkIcon className="mr-1 h-4 w-4" /> Share</Button>
                    </div>
                </CardContent>
              </Card>
            )) : <p className="text-center text-muted-foreground py-8">No posts yet from this business.</p>}
          </TabsContent>

           <TabsContent value="about" className="space-y-6">
                <Card className="shadow-sm">
                    <CardHeader><CardTitle className="text-lg font-headline">About {profile.name}</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <p className="text-foreground whitespace-pre-line">{profile.bio}</p>
                        {profile.specialties && profile.specialties.length > 0 && (
                            <div>
                            <h4 className="font-semibold text-foreground mb-1.5 mt-3">Specialties:</h4>
                            <div className="flex flex-wrap gap-2">
                                {profile.specialties.map(spec => <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>)}
                            </div>
                            </div>
                        )}
                         {profile.location && <p className="flex items-center pt-3 border-t mt-4"><MapPin className="h-4 w-4 mr-2 text-muted-foreground"/> {profile.location}</p>}
                         {profile.phone && <p className="flex items-center pt-2 mt-2"><Phone className="h-4 w-4 mr-2 text-muted-foreground"/> {profile.phone}</p>}
                         {profile.email && <p className="flex items-center pt-2 mt-2"><ExternalLinkIcon className="h-4 w-4 mr-2 text-muted-foreground"/> <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a></p>}
                    </CardContent>
                </Card>
                {profile.jobs && profile.jobs.length > 0 && (
                     <Card className="shadow-sm">
                        <CardHeader><CardTitle className="text-lg font-headline">Job Openings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                        {profile.jobs.map(job => (
                            <div key={job.id} className="pb-3 border-b last:border-b-0">
                                <h4 className="text-md font-semibold text-foreground">{job.title}</h4>
                                <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                                    {job.location && <p className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1"/>{job.location}</p>}
                                    {job.type && <p className="flex items-center"><Briefcase className="h-3.5 w-3.5 mr-1"/>{job.type}</p>}
                                    {job.postedDate && <p className="flex items-center"><CalendarDays className="h-3.5 w-3.5 mr-1"/>Posted: {job.postedDate}</p>}
                                </div>
                                {job.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{job.description}</p>}
                                <Button size="sm" className="mt-3" onClick={() => handleApplyJob(job)}><PlusCircle className="mr-2 h-4 w-4"/>Apply Now</Button>
                            </div>
                        ))}
                        </CardContent>
                    </Card>
                )}
                {profile.reviews && profile.reviews.length > 0 && (
                    <Card className="shadow-sm">
                        <CardHeader><CardTitle className="text-lg font-headline">Customer Reviews ({profile.totalReviews})</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                        {profile.reviews.map(review => (
                        <div key={review.id} className="pb-3 border-b last:border-b-0">
                            <div className="flex justify-between items-start pb-1">
                            <div>
                                <h5 className="text-sm font-semibold text-foreground">{review.reviewerName}</h5>
                                <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                            <StarRating rating={review.rating} size={4}/>
                            </div>
                            <p className="text-sm text-foreground">{review.comment}</p>
                        </div>
                        ))}
                        <div className="text-center mt-4">
                            <Button variant="outline">Write a Review</Button>
                        </div>
                        </CardContent>
                    </Card>
                )}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default UserBusinessProfileDetailScreen;
