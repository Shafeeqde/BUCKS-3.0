
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarIcon, ChatBubbleOvalLeftEllipsisIcon, PhoneIcon, HandThumbUpIcon, ShareIcon, UserPlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
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
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full overflow-hidden">
      <div
        className="p-4 flex items-start space-x-4 cursor-pointer"
        onClick={() => onPress?.(business.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onPress?.(business.id)}
      >
        <Image
          src={business.logoUrl || 'https://placehold.co/80x80.png'}
          alt={`${business.name} logo`}
          width={72} // Slightly larger logo
          height={72}
          className="rounded-lg object-cover border flex-shrink-0"
          data-ai-hint={business.logoAiHint || "business logo"}
        />
        <div className="flex-grow min-w-0"> {/* Added min-w-0 */}
          <CardTitle className="text-lg font-headline hover:text-primary truncate">{business.name}</CardTitle>
          {business.tagline && <CardDescription className="text-xs text-muted-foreground mt-0.5 truncate">{business.tagline}</CardDescription>}
          {business.briefInfo && <p className="text-xs text-muted-foreground mt-1">{business.briefInfo}</p>}
        </div>
        {onFollowClick && (
          <Button variant="outline" size="sm" className="rounded-full self-start whitespace-nowrap" onClick={(e) => { e.stopPropagation(); onFollowClick(business.id); }}>
            <UserPlusIcon className="h-4 w-4" />
            <span className="ml-1.5 hidden sm:inline">Follow</span>
          </Button>
        )}
      </div>

      {business.products && business.products.length > 0 && (
        <div className="pl-4 pr-1 pb-4 border-t mt-2 pt-3">
          <h4 className="text-sm font-semibold text-foreground mb-2 px-0">Products</h4>
          <div className="flex overflow-x-auto space-x-3 pb-2 custom-scrollbar -mr-3"> {/* Negative margin to hide scrollbar visually if needed */}
            {business.products.map((product) => (
              <Card
                key={product.id}
                className="min-w-[150px] max-w-[170px] flex-shrink-0 hover:shadow-md transition-shadow cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onProductClick?.(business.id, product.id); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onProductClick?.(business.id, product.id)}
              >
                <CardContent className="p-2.5">
                  <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden mb-2 border">
                    <Image
                      src={product.imageUrl || 'https://placehold.co/150x112.png'}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={product.imageAiHint || "product item"}
                    />
                    {product.discountPercentage && (
                      <Badge variant="destructive" className="absolute top-1.5 right-1.5 text-xs px-1.5 py-0.5">{product.discountPercentage}</Badge>
                    )}
                  </div>
                  <h5 className="text-xs font-semibold truncate text-foreground" title={product.name}>{product.name}</h5>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    {product.discountPrice ? (
                      <>
                        <p className="text-sm font-bold text-primary">₹{product.discountPrice}</p>
                        <p className="text-xs text-muted-foreground line-through">₹{product.price}</p>
                      </>
                    ) : (
                      <p className="text-sm font-bold text-foreground">₹{product.price}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-xs h-8"
                    onClick={(e) => { e.stopPropagation(); onAddToCartClick?.(business.id, product.id); }}
                  >
                    <ShoppingCartIcon className="h-3.5 w-3.5 mr-1.5" /> Add
                  </Button>
                </CardContent>
              </Card>
            ))}
            <div className="w-1 flex-shrink-0"></div> {/* Spacer for right padding of scroll area */}
          </div>
        </div>
      )}

      {(business.averageRating !== undefined || business.totalReviews !== undefined) && (
        <CardFooter className="text-xs text-muted-foreground pt-2 pb-3 px-4 border-t justify-start gap-x-3 gap-y-1 flex-wrap">
          {business.averageRating !== undefined && (
            <div className="flex items-center">
              <StarRatingDisplay rating={business.averageRating} size={3} />
              <span className="ml-1 font-medium">{business.averageRating.toFixed(1)}</span>
            </div>
          )}
          {business.totalReviews !== undefined && (
            <span>{business.totalReviews} Reviews</span>
          )}
        </CardFooter>
      )}

      {(onEnquiryClick || onCallClick || onRecommendClick || onShareClick) && (
        <CardFooter className="pt-3 pb-4 px-3 border-t flex flex-wrap justify-start gap-1.5 sm:gap-2">
          {onEnquiryClick && (
            <Button variant="ghost" size="sm" className="text-xs px-2" onClick={(e) => { e.stopPropagation(); onEnquiryClick(business.id); }}>
              <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 mr-1" /> Enquiry
            </Button>
          )}
          {business.phone && onCallClick && (
            <Button variant="ghost" size="sm" className="text-xs px-2" onClick={(e) => { e.stopPropagation(); onCallClick(business.id, business.phone); }}>
              <PhoneIcon className="h-4 w-4 mr-1" /> Call
            </Button>
          )}
          {onRecommendClick && (
            <Button variant="ghost" size="sm" className="text-xs px-2" onClick={(e) => { e.stopPropagation(); onRecommendClick(business.id); }}>
              <HandThumbUpIcon className="h-4 w-4 mr-1" /> Recommend
            </Button>
          )}
          {onShareClick && (
            <Button variant="ghost" size="sm" className="text-xs px-2" onClick={(e) => { e.stopPropagation(); onShareClick(business.id); }}>
              <ShareIcon className="h-4 w-4 mr-1" /> Share
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default BusinessProfileCard;
