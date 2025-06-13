
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, Phone, ThumbsUp, Share2, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define a type for the data this card will display
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

const StarRating: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 4, className }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.4; // Adjust threshold for half star if needed
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={cn(`w-${size} h-${size} text-yellow-400 fill-yellow-400`)} />
      ))}
      {halfStar && <Star key="half" className={cn(`w-${size} h-${size} text-yellow-400 fill-yellow-200`)} />} {/* Simplified half star */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={cn(`w-${size} h-${size} text-muted-foreground/30 fill-muted-foreground/30`)} />
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
      className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => onPress?.(profile.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint={profile.avatarAiHint || "professional person"} />
            <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-xl font-headline">{profile.name}</CardTitle>
            {profile.professionalTitle && <CardDescription className="text-sm text-primary">{profile.professionalTitle}</CardDescription>}
          </div>
          {onFollowClick && (
            <Button variant="outline" size="sm" className="rounded-full" onClick={(e) => { e.stopPropagation(); onFollowClick(profile.id); }}>
              <UserPlus className="mr-1.5 h-4 w-4" /> Follow
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-0">
        {profile.previewImages && profile.previewImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
            {profile.previewImages.slice(0, 4).map((image, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                <Image
                  src={image.url}
                  alt={`${profile.name} preview ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={image.aiHint}
                />
              </div>
            ))}
          </div>
        )}

        {profile.shortBio && <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{profile.shortBio}</p>}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
          {profile.averageRating !== undefined && profile.totalReviews !== undefined && (
            <div className="flex items-center">
              <StarRating rating={profile.averageRating} size={4} />
              <span className="ml-1.5">({profile.averageRating.toFixed(1)})</span>
              <span className="ml-1">·</span>
              <span className="ml-1">{profile.totalReviews} Reviews</span>
            </div>
          )}
          {profile.recommendationsCount !== undefined && (
            <div className="flex items-center">
              <ThumbsUp className="w-3.5 h-3.5 mr-1 text-green-500" />
              <span>{profile.recommendationsCount} Recommended</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex flex-wrap gap-2 w-full justify-start">
          {onEnquiryClick && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEnquiryClick(profile.id); }}>
              <MessageCircle /> Enquiry
            </Button>
          )}
          {profile.phone && onCallClick && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onCallClick(profile.id, profile.phone); }}>
              <Phone /> Call
            </Button>
          )}
          {onRecommendClick && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onRecommendClick(profile.id); }}>
              <ThumbsUp /> Recommend
            </Button>
          )}
          {onShareClick && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onShareClick(profile.id); }}>
              <Share2 /> Share
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default IndividualProfessionalCard;
