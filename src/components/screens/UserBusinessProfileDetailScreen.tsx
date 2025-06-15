
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeftIcon, BriefcaseIcon, BuildingOfficeIcon, ChatBubbleOvalLeftEllipsisIcon, ShoppingBagIcon, InformationCircleIcon, ArrowTopRightOnSquareIcon, PhoneIcon, MapPinIcon, RssIcon, HandThumbUpIcon,
    StarIcon as StarIconOutline, // Heroicon outline star
    VideoCameraIcon, CalendarDaysIcon, PlusCircleIcon, EllipsisHorizontalIcon, UserPlusIcon, GlobeAltIcon, EnvelopeIcon
} from '@heroicons/react/24/outline';
import type { UserBusinessProfile, BusinessProduct, BusinessJob, BusinessFeedItem, BusinessService, BusinessReview } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Filled StarIcon for rating display
const StarIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)} {...props}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.242 5.855c.215 1.02.933 1.756 1.95 1.756 1.017 0 1.735-.736 1.95-1.756l1.242-5.855 4.116-3.986c.887-.76.415-2.212-.749-2.305l-5.404-.433L13.212 3.21z" clipRule="evenodd" />
  </svg>
);

const StarRatingDisplay: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 5, className }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const iconDynamicStyle = { height: `${size / 4}rem`, width: `${size / 4}rem` };

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} style={iconDynamicStyle} className={"text-yellow-400"} />)}
      {halfStar && <StarIcon key="half" style={iconDynamicStyle} className={"text-yellow-400"} />}
      {[...Array(emptyStars)].map((_, i) => <StarIconOutline key={`empty-${i}`} style={iconDynamicStyle} className={"text-muted-foreground/50"} />)}
    </div>
  );
};


interface UserBusinessProfileDetailScreenProps {
  profile: UserBusinessProfile | undefined | null;
  onBack: () => void;
}

const UserBusinessProfileDetailScreen: React.FC<UserBusinessProfileDetailScreenProps> = ({
  profile,
  onBack,
}) => {
  const { toast } = useToast();

  const handleFollow = () => {
    return toast({ title: "Follow Clicked (Simulated)", description: "Following business." });
  };
  const handleMessage = () => {
    return toast({ title: "Message Clicked (Simulated)", description: "Messaging business." });
  };
  const handleAddToCart = (product: BusinessProduct) => {
    return toast({ title: "Added to Cart (Simulated)", description: "Product added to cart."});
  };
  const handleViewProduct = (product: BusinessProduct) => {
    return toast({ title: "View Product (Simulated)", description: "Viewing product details."});
  };
  const handleApplyJob = (job: BusinessJob) => {
    return toast({ title: "Apply for Job (Simulated)", description: "Applying for job."});
  };
  const handleEnquireService = (service: BusinessService) => {
    return toast({ title: "Enquire Service (Simulated)", description: "Enquiring about service."});
  };

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

  return (
    <ScrollArea className="h-full custom-scrollbar bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white rounded-full z-20 backdrop-blur-sm h-9 w-9"
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div className="w-full h-48 md:h-64 relative bg-muted">
            {profile.coverPhoto ? (
              <Image
                src={profile.coverPhoto}
                alt={`${profile.name} Cover Photo`}
                fill
                className="object-cover"
                data-ai-hint={profile.coverPhotoAiHint || "business cover image"}
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BuildingOfficeIcon className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            {profile.averageRating && profile.totalReviews ? (
            <Badge variant="secondary" className="absolute top-4 right-4 bg-black/50 text-white backdrop-blur-sm text-sm py-1.5 px-3 rounded-lg shadow-md">
                <StarIcon className="w-4 h-4 text-yellow-400 mr-1.5"/> {profile.averageRating.toFixed(1)} ({profile.totalReviews} Reviews)
            </Badge>
          ) : null}
        </div>

        <div className="p-4 md:p-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 -mt-16 sm:-mt-20 md:-mt-24">
            <div className="relative h-28 w-28 sm:h-36 sm:w-36 flex-shrink-0">
              <Image
                src={profile.logo || `https://source.unsplash.com/random/160x160/?abstract,logo&text=${profile.name.substring(0,1)}`}
                alt={`${profile.name} Logo`}
                fill
                className="rounded-xl object-cover border-4 border-background bg-card shadow-lg"
                data-ai-hint={profile.logoAiHint || "company logo"}
              />
            </div>
            <div className="mt-3 sm:mt-0 flex-grow text-center sm:text-left pt-0 sm:pt-6">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">{profile.name}</h1>
              <div className="flex items-center justify-center sm:justify-start space-x-4 mt-1.5 text-sm text-muted-foreground">
                <span><span className="font-semibold text-foreground">{profile.followers || 0}</span> Followers</span>
                <span className="text-muted-foreground/50">•</span>
                <span><span className="font-semibold text-foreground">{profile.following || 0}</span> Following</span>
              </div>
            </div>
          </div>
          {profile.bio && <p className="text-sm text-foreground mt-4 whitespace-pre-line leading-relaxed">{profile.bio}</p>}
        </div>

        <div className="px-4 md:px-6 pb-4 flex items-center gap-2">
            <Button onClick={handleFollow} className="flex-grow bg-primary hover:bg-primary/90 text-primary-foreground text-base py-2.5 h-auto">
                <UserPlusIcon className="mr-2 h-4 w-4" /> Follow
            </Button>
            <Button variant="outline" onClick={handleMessage} className="flex-grow text-base py-2.5 h-auto">
                <ChatBubbleOvalLeftEllipsisIcon className="mr-2 h-4 w-4" /> Message
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="More options" className="h-11 w-11">
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast({title: "Share Profile (Simulated)", description: "Sharing profile."})}>
                            <ArrowTopRightOnSquareIcon className="mr-2 h-4 w-4" /> Share Profile
                        </DropdownMenuItem>
                         {profile.phone &&
                            <DropdownMenuItem onClick={() => toast({title: "Calling Business (Simulated)", description: `Calling ${profile.phone}.`})}>
                                <PhoneIcon className="mr-2 h-4 w-4" /> Call Business
                            </DropdownMenuItem>
                        }
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast({title: "Report Profile (Simulated)", description: "Reporting profile."})} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <InformationCircleIcon className="mr-2 h-4 w-4" /> Report
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>More Options</p>
              </TooltipContent>
            </Tooltip>
        </div>

        <Tabs defaultValue="products" className="w-full px-2 sm:px-4 md:px-6 pb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 h-auto bg-muted rounded-md">
            <TabsTrigger value="products" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm flex items-center gap-1.5"><ShoppingBagIcon className="h-4 w-4"/>Products</TabsTrigger>
            <TabsTrigger value="services" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm flex items-center gap-1.5"><BriefcaseIcon className="h-4 w-4"/>Services</TabsTrigger>
            <TabsTrigger value="posts" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm flex items-center gap-1.5"><RssIcon className="h-4 w-4"/>Posts</TabsTrigger>
            <TabsTrigger value="about" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm flex items-center gap-1.5"><InformationCircleIcon className="h-4 w-4"/>About</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <h3 className="text-xl font-semibold text-foreground mb-4 px-2 font-headline">Menu / Products</h3>
            {profile.products && profile.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.products.map(product => (
                        <Card key={product.id} className="flex flex-col group overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                            <div className="relative w-full aspect-[4/3] cursor-pointer" onClick={() => handleViewProduct(product)}>
                                <Image
                                    src={product.imageUrl || 'https://source.unsplash.com/random/300x225/?food,item'}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    data-ai-hint={product.imageAiHint || "menu food item"}
                                />
                                 {product.discountPercentage && (
                                  <Badge variant="destructive" className="absolute top-2 right-2 text-xs px-2 py-1">{product.discountPercentage} OFF</Badge>
                                )}
                            </div>
                            <CardHeader className="pb-2 px-4 pt-3">
                                <CardTitle className="text-md font-semibold group-hover:text-primary truncate cursor-pointer" onClick={() => handleViewProduct(product)}>{product.name}</CardTitle>
                                {product.description && <CardDescription className="text-xs line-clamp-2">{product.description}</CardDescription>}
                            </CardHeader>
                            <CardContent className="px-4 pb-3 flex-grow">
                                <div className="flex items-baseline gap-2 mt-1">
                                {product.discountPrice ? (
                                  <>
                                    <p className="text-lg font-bold text-primary">₹{product.discountPrice}</p>
                                    <p className="text-sm text-muted-foreground line-through">₹{product.price}</p>
                                  </>
                                ) : (
                                  <p className="text-lg font-bold text-foreground">₹{product.price}</p>
                                )}
                                </div>
                            </CardContent>
                            <CardFooter className="px-4 pb-4 pt-0">
                                <Button className="w-full" onClick={() => handleAddToCart(product)}><PlusCircleIcon className="mr-2 h-4 w-4"/>Add to Cart</Button>
                            </CardFooter>
                        </Card>
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
                  {item.image && <div className="relative aspect-video w-full mb-3 rounded-md overflow-hidden"><Image src={item.image} alt="Feed image" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" data-ai-hint={item.imageAiHint || "social media post"}/></div>}
                  {item.videoUrl && <div className="relative aspect-video w-full mb-3 rounded-md overflow-hidden bg-black flex items-center justify-center text-card-foreground"><VideoCameraIcon className="w-12 h-12 opacity-70" /> <span className="ml-2">Video Placeholder</span></div> }
                  <p className="text-foreground mb-2 whitespace-pre-line">{item.content}</p>
                  <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                   <div className="flex items-center text-muted-foreground text-sm mt-3 pt-3 border-t">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><HandThumbUpIcon className="mr-1 h-4 w-4" /> Like</Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><ChatBubbleOvalLeftEllipsisIcon className="mr-1 h-4 w-4" /> Comment</Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary ml-auto"><ArrowTopRightOnSquareIcon className="mr-1 h-4 w-4" /> Share</Button>
                    </div>
                </CardContent>
              </Card>
            )) : <p className="text-center text-muted-foreground py-8">No posts yet from this business.</p>}
          </TabsContent>

           <TabsContent value="about" className="space-y-6">
                <Card className="shadow-sm">
                    <CardHeader><CardTitle className="text-lg font-headline flex items-center"><InformationCircleIcon className="mr-2 h-5 w-5 text-primary"/>About {profile.name}</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {profile.bio && <p className="text-foreground whitespace-pre-line leading-relaxed">{profile.bio}</p>}
                        {profile.specialties && profile.specialties.length > 0 && (
                            <div>
                            <h4 className="font-semibold text-foreground mb-1.5 mt-3">Specialties:</h4>
                            <div className="flex flex-wrap gap-2">
                                {profile.specialties.map(spec => <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>)}
                            </div>
                            </div>
                        )}
                         <div className="space-y-2 pt-3 mt-3 border-t">
                            {profile.location && <p className="flex items-center gap-2"><MapPinIcon className="h-4 w-4 text-muted-foreground"/> {profile.location}</p>}
                            {profile.phone && <p className="flex items-center gap-2"><PhoneIcon className="h-4 w-4 text-muted-foreground"/> <a href={`tel:${profile.phone}`} className="hover:underline text-primary">{profile.phone}</a></p>}
                            {profile.email && <p className="flex items-center gap-2"><EnvelopeIcon className="h-4 w-4 text-muted-foreground"/> <a href={`mailto:${profile.email}`} className="hover:underline text-primary">{profile.email}</a></p>}
                            {profile.website && <p className="flex items-center gap-2"><GlobeAltIcon className="h-4 w-4 text-muted-foreground"/> <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary truncate">{profile.website.replace(/^https?:\/\//, '')}</a></p>}
                         </div>
                    </CardContent>
                </Card>
                {profile.jobs && profile.jobs.length > 0 && (
                     <Card className="shadow-sm">
                        <CardHeader><CardTitle className="text-lg font-headline flex items-center"><BriefcaseIcon className="mr-2 h-5 w-5 text-primary"/>Job Openings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                        {profile.jobs.map(job => (
                            <div key={job.id} className="pb-3 border-b last:border-b-0">
                                <h4 className="text-md font-semibold text-foreground">{job.title}</h4>
                                <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                                    {job.location && <p className="flex items-center"><MapPinIcon className="h-3.5 w-3.5 mr-1"/>{job.location}</p>}
                                    {job.type && <p className="flex items-center"><BriefcaseIcon className="h-3.5 w-3.5 mr-1"/>{job.type}</p>}
                                    {job.postedDate && <p className="flex items-center"><CalendarDaysIcon className="h-3.5 w-3.5 mr-1"/>Posted: {job.postedDate}</p>}
                                </div>
                                {job.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{job.description}</p>}
                                <Button size="sm" className="mt-3" onClick={() => handleApplyJob(job)}><PlusCircleIcon className="mr-2 h-4 w-4"/>Apply Now</Button>
                            </div>
                        ))}
                        </CardContent>
                    </Card>
                )}
                {profile.reviews && profile.reviews.length > 0 && (
                    <Card className="shadow-sm">
                        <CardHeader><CardTitle className="text-lg font-headline flex items-center"><ChatBubbleOvalLeftEllipsisIcon className="mr-2 h-5 w-5 text-primary"/>Customer Reviews ({profile.totalReviews || 0})</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                        {profile.reviews.map(review => (
                        <div key={review.id} className="pb-3 border-b last:border-b-0">
                            <div className="flex justify-between items-start pb-1">
                            <div>
                                <h5 className="text-sm font-semibold text-foreground">{review.reviewerName}</h5>
                                <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                            <StarRatingDisplay rating={review.rating} size={4}/>
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

