
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarIcon, ChatBubbleOvalLeftEllipsisIcon, PhoneIcon, HandThumbUpIcon, ShareIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export interface IndividualProfessionalCardData {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarAiHint?: string;
  professionalTitle?: string;
  previewImages?: { url: string; aiHint: string }[];
  shortBio?: string;
  averageRating?: number;
  totalReviews?: number;
  recommendationsCount?: number;
  phone?: string;
  email?: string;
}

interface IndividualProfessionalCardProps {
  profile: IndividualProfessionalCardData;
  onPress?: (id: string) => void;
  onEnquiryClick?: (id: string) => void;
  onCallClick?: (id: string, phone?: string) => void;
  onRecommendClick?: (id: string) => void;
  onShareClick?: (id: string) => void;
  onFollowClick?: (id: string) => void;
}

const StarRatingDisplay: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 4, className }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.4;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className={cn(`w-${size} h-${size} text-yellow-400 fill-yellow-400`)} />
      ))}
      {halfStar && <StarIcon key="half" className={cn(`w-${size} h-${size} text-yellow-400 fill-yellow-200`)} />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} className={cn(`w-${size} h-${size} text-muted-foreground/30 fill-muted-foreground/30`)} />
      ))}
    </div>
  );
};

const IndividualProfessionalCard: React.FC<IndividualProfessionalCardProps> = ({
  profile,
  onPress,
  onEnquiryClick,
  onCallClick,
  onRecommendClick,
  onShareClick,
  onFollowClick,
}) => {
  return (
    <Card
      className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer w-full overflow-hidden"
      onClick={() => onPress?.(profile.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onPress?.(profile.id)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-20 w-20 border-2 border-primary/20 flex-shrink-0"> {/* Increased Avatar size */}
            <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint={profile.avatarAiHint || "professional person"} />
            <AvatarFallback className="text-xl">{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <CardTitle className="text-xl font-headline truncate hover:text-primary">{profile.name}</CardTitle>
            {profile.professionalTitle && <CardDescription className="text-sm text-primary font-medium truncate">{profile.professionalTitle}</CardDescription>}
          </div>
          {onFollowClick && (
            <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap self-start" onClick={(e) => { e.stopPropagation(); onFollowClick(profile.id); }}>
              <UserPlusIcon className="mr-1.5 h-4 w-4" /> Follow
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        {profile.previewImages && profile.previewImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {profile.previewImages.slice(0, 4).map((image, index) => (
              <div key={index} className="relative aspect-[4/3] rounded-md overflow-hidden border shadow-sm">
                <Image
                  src={image.url}
                  alt={`${profile.name} preview ${index + 1}`}
                  fill // Changed from layout="fill"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 150px" // Example sizes, adjust as needed
                  className="object-cover" // Ensure this is used with fill
                  data-ai-hint={image.aiHint}
                />
              </div>
            ))}
          </div>
        )}

        {profile.shortBio && <p className="text-sm text-foreground mb-3 line-clamp-3">{profile.shortBio}</p>}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {profile.averageRating !== undefined && profile.totalReviews !== undefined && (
            <div className="flex items-center">
              <StarRatingDisplay rating={profile.averageRating} size={4} />
              <span className="ml-1.5 font-semibold text-foreground">{profile.averageRating.toFixed(1)}</span>
              <span className="ml-1">({profile.totalReviews} Reviews)</span>
            </div>
          )}
          {profile.recommendationsCount !== undefined && (
            <div className="flex items-center">
              <HandThumbUpIcon className="w-4 h-4 mr-1.5 text-green-500" />
              <span className="font-semibold text-foreground">{profile.recommendationsCount}</span>
              <span className="ml-1">Recommendations</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <div className="flex flex-wrap gap-2 w-full justify-start">
          {onEnquiryClick && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEnquiryClick(profile.id); }}>
              <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 mr-1.5" /> Enquiry
            </Button>
          )}
          {profile.phone && onCallClick && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onCallClick(profile.id, profile.phone); }}>
              <PhoneIcon className="h-4 w-4 mr-1.5" /> Call
            </Button>
          )}
          {onRecommendClick && (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onRecommendClick(profile.id); }}>
              <HandThumbUpIcon className="h-4 w-4 mr-1.5" /> Recommend
            </Button>
          )}
          {onShareClick && (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onShareClick(profile.id); }}>
              <ShareIcon className="h-4 w-4 mr-1.5" /> Share
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default IndividualProfessionalCard;

    