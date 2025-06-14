
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, Phone, ThumbsUp, Share2, UserPlus, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BusinessProfileCardData, BusinessProductCardItem } from '@/types';

interface BusinessProfileCardProps {
  business: BusinessProfileCardData;
  onPress?: (id: string | number) => void;
  onProductClick?: (businessId: string | number, productId: string) => void;
  onAddToCartClick?: (businessId: string | number, productId: string) => void;
  onEnquiryClick?: (id: string | number) => void;
  onCallClick?: (id: string | number, phone?: string) => void;
  onRecommendClick?: (id: string | number) => void;
  onShareClick?: (id: string | number) => void;
  onFollowClick?: (id: string | number) => void;
}

const StarRating: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 4, className }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.4;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={cn(`w-${size} h-${size} text-yellow-400 fill-yellow-400`)} />
      ))}
      {halfStar && <Star key="half" className={cn(`w-${size} h-${size} text-yellow-400 fill-yellow-200`)} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={cn(`w-${size} h-${size} text-muted-foreground/30 fill-muted-foreground/30`)} />
      ))}
    </div>
  );
};

const BusinessProfileCard: React.FC<BusinessProfileCardProps> = ({
  business,
  onPress,
  onProductClick,
  onAddToCartClick,
  onEnquiryClick,
  onCallClick,
  onRecommendClick,
  onShareClick,
  onFollowClick,
}) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
      {/* Header */}
      <div
        className="p-4 flex items-start space-x-3 cursor-pointer"
        onClick={() => onPress?.(business.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onPress?.(business.id)}
      >
        <Image
          src={business.logoUrl || 'https://placehold.co/80x80.png'}
          alt={`${business.name} logo`}
          width={60}
          height={60}
          className="rounded-md object-cover border"
          data-ai-hint={business.logoAiHint || "business logo"}
        />
        <div className="flex-grow">
          <CardTitle className="text-lg font-headline hover:text-primary">{business.name}</CardTitle>
          {business.tagline && <CardDescription className="text-xs text-muted-foreground">{business.tagline}</CardDescription>}
          {business.briefInfo && <p className="text-xs text-muted-foreground mt-1">{business.briefInfo}</p>}
        </div>
        {onFollowClick && (
          <Button variant="outline" size="sm" className="rounded-full self-start" onClick={(e) => { e.stopPropagation(); onFollowClick(business.id); }}>
            <UserPlus className="h-4 w-4" />
            <span className="ml-1.5 hidden sm:inline">Follow</span>
          </Button>
        )}
      </div>

      {/* Products List */}
      {business.products && business.products.length > 0 && (
        <div className="px-4 pb-4 border-t mt-2 pt-3">
          <h4 className="text-sm font-semibold text-foreground mb-2">Products</h4>
          <div className="flex overflow-x-auto space-x-3 pb-2 custom-scrollbar">
            {business.products.map((product) => (
              <Card
                key={product.id}
                className="min-w-[140px] max-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow"
                onClick={(e) => { e.stopPropagation(); onProductClick?.(business.id, product.id); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onProductClick?.(business.id, product.id)}
              >
                <CardContent className="p-2">
                  <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden mb-2">
                    <Image
                      src={product.imageUrl || 'https://placehold.co/120x90.png'}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={product.imageAiHint || "product item"}
                    />
                    {product.discountPercentage && (
                      <Badge variant="destructive" className="absolute top-1 right-1 text-xs px-1.5 py-0.5">
                        {product.discountPercentage} Off
                      </Badge>
                    )}
                  </div>
                  <h5 className="text-xs font-medium truncate text-foreground" title={product.name}>{product.name}</h5>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    {product.discountPrice ? (
                      <>
                        <p className="text-sm font-semibold text-primary">₹{product.discountPrice}</p>
                        <p className="text-xs text-muted-foreground line-through">₹{product.price}</p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-foreground">₹{product.price}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-xs h-7"
                    onClick={(e) => { e.stopPropagation(); onAddToCartClick?.(business.id, product.id); }}
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Stats (Optional) */}
      {(business.averageRating !== undefined || business.totalReviews !== undefined) && (
        <CardFooter className="text-xs text-muted-foreground pt-2 pb-3 px-4 border-t justify-start gap-3">
          {business.averageRating !== undefined && (
            <div className="flex items-center">
              <StarRating rating={business.averageRating} size={3} />
              <span className="ml-1">({business.averageRating.toFixed(1)})</span>
            </div>
          )}
          {business.totalReviews !== undefined && (
            <span>{business.totalReviews} Reviews</span>
          )}
        </CardFooter>
      )}

      {/* CTA Buttons (Optional) */}
      {(onEnquiryClick || onCallClick || onRecommendClick || onShareClick) && (
        <CardFooter className="pt-3 pb-4 px-2 border-t flex-wrap justify-start gap-1 sm:gap-2">
          {onEnquiryClick && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); onEnquiryClick(business.id); }}>
              <MessageCircle className="h-4 w-4 mr-1" /> Enquiry
            </Button>
          )}
          {business.phone && onCallClick && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); onCallClick(business.id, business.phone); }}>
              <Phone className="h-4 w-4 mr-1" /> Call
            </Button>
          )}
          {onRecommendClick && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); onRecommendClick(business.id); }}>
              <ThumbsUp className="h-4 w-4 mr-1" /> Recommend
            </Button>
          )}
          {onShareClick && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); onShareClick(business.id); }}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default BusinessProfileCard;
