
"use client"; // Mark as Client Component

import React from 'react';
// Assuming standard React components
import Image from 'next/image';
import Link from 'next/link'; // If products will have detail pages
import { cn } from '@/lib/utils'; // Assuming utility for classes

 // Example using lucide-react for icons
 import { StarIcon, ChatBubbleOvalLeftEllipsisIcon, PhoneIcon, HandThumbUpIcon, ShareIcon, UserPlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';


 import { useCart } from '@/context/CartContext'; // Import useCart hook
 import type { BusinessProfileCardData, BusinessProductCardItem } from '@/types';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';


interface BusinessProfileCardProps {
  business: BusinessProfileCardData;
  onPress?: (id: string | number) => void;
  onProductClick?: (businessId: string | number, productId: string) => void;
  onEnquiryClick?: (id: string | number) => void;
  onCallClick?: (id: string | number, phone?: string) => void;
  onRecommendClick?: (id: string | number) => void;
  onShareClick?: (id: string | number) => void;
  onFollowClick?: (id: string | number) => void;
}

// Helper component for rendering stars
const StarRatingDisplay: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 4, className }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.4; // Use 0.4 to round up .5 and above to full, but show half for .4 like 4.4
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
  onEnquiryClick,
  onCallClick,
  onRecommendClick,
  onShareClick,
  onFollowClick,
}) => {
    const { addToCart } = useCart(); // Consume the cart context
    const logoHint = business.logoAiHint || "business logo";
    const logoSrc = business.logoUrl || `https://source.unsplash.com/random/80x80/?${logoHint.split(' ').join(',') || 'logo'}`;


    const handleProductAddToCart = (product: BusinessProductCardItem) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.discountPrice || product.price,
            businessId: business.id,
            businessName: business.name,
            imageUrl: product.imageUrl,
            imageAiHint: product.imageAiHint,
        });
    };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-full overflow-hidden">
      <div
        className="p-4 flex items-start space-x-4 cursor-pointer"
        onClick={() => onPress?.(business.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onPress?.(business.id)}
      >
        <div className="relative h-20 w-20 flex-shrink-0">
          <Image
            src={logoSrc}
            alt={`${business.name} logo`}
            fill
            className="rounded-lg object-cover border"
            sizes="(max-width: 768px) 80px, 80px"
            data-ai-hint={logoHint}
          />
        </div>
        <div className="flex-grow min-w-0">
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
          <h4 className="text-sm font-semibold text-foreground mb-2 px-0">Featured Products</h4>
          <div className="flex overflow-x-auto space-x-3 pb-2 custom-scrollbar -mr-3">
            {business.products.map((product) => {
              const productHint = product.imageAiHint || "product item";
              const productSrc = product.imageUrl || `https://source.unsplash.com/random/160x120/?${productHint.split(' ').join(',') || 'product'}`;
              return (
                <Card
                  key={product.id}
                  className="min-w-[160px] max-w-[180px] flex-shrink-0 flex flex-col group hover:shadow-md transition-shadow"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); onProductClick?.(business.id, product.id); }}
                  onKeyDown={(e) => e.key === 'Enter' && onProductClick?.(business.id, product.id)}
                >
                  <div className="relative w-full aspect-[4/3] rounded-t-md overflow-hidden border-b cursor-pointer">
                    <Image
                      src={productSrc}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 160px, 180px"
                      className="object-cover group-hover:scale-105 transition-transform"
                      data-ai-hint={productHint}
                    />
                    {product.discountPercentage && (
                      <Badge variant="destructive" className="absolute top-1.5 right-1.5 text-xs px-1.5 py-0.5">{product.discountPercentage}</Badge>
                    )}
                  </div>
                  <CardContent className="p-2.5 flex-grow flex flex-col justify-between">
                    <div>
                      <h5 className="text-sm font-semibold truncate text-foreground group-hover:text-primary" title={product.name}>{product.name}</h5>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        {product.discountPrice ? (
                          <>
                            <p className="text-md font-bold text-primary">₹{product.discountPrice}</p>
                            <p className="text-xs text-muted-foreground line-through">₹{product.price}</p>
                          </>
                        ) : (
                          <p className="text-md font-bold text-foreground">₹{product.price}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 text-xs h-8"
                      onClick={(e) => { e.stopPropagation(); handleProductAddToCart(product); }}
                    >
                      <ShoppingCartIcon className="h-3.5 w-3.5 mr-1.5" /> Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            <div className="w-1 flex-shrink-0"></div>
          </div>
        </div>
      )}

      {(business.averageRating !== undefined || business.totalReviews !== undefined) && (
        <CardFooter className="text-sm text-muted-foreground pt-2 pb-3 px-4 border-t justify-start gap-x-4 gap-y-1 flex-wrap">
          {business.averageRating !== undefined && (
            <div className="flex items-center">
              <StarRatingDisplay rating={business.averageRating} size={4} />
              <span className="ml-1.5 font-semibold text-foreground">{business.averageRating.toFixed(1)}</span>
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
            <Button variant="ghost" size="sm" className="text-sm px-2 py-1 h-auto" onClick={(e) => { e.stopPropagation(); onEnquiryClick(business.id); }}>
              <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 mr-1" /> Enquiry
            </Button>
          )}
          {business.phone && onCallClick && (
            <Button variant="ghost" size="sm" className="text-sm px-2 py-1 h-auto" onClick={(e) => { e.stopPropagation(); onCallClick(business.id, business.phone); }}>
              <PhoneIcon className="h-4 w-4 mr-1" /> Call
            </Button>
          )}
          {onRecommendClick && (
            <Button variant="ghost" size="sm" className="text-sm px-2 py-1 h-auto" onClick={(e) => { e.stopPropagation(); onRecommendClick(business.id); }}>
              <HandThumbUpIcon className="h-4 w-4 mr-1" /> Recommend
            </Button>
          )}
          {onShareClick && (
            <Button variant="ghost" size="sm" className="text-sm px-2 py-1 h-auto" onClick={(e) => { e.stopPropagation(); onShareClick(business.id); }}>
              <ShareIcon className="h-4 w-4 mr-1" /> Share
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default BusinessProfileCard;
