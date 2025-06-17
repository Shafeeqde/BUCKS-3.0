
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import type { ProductListing } from '@/types';
import { cn } from '@/lib/utils';

interface ProductListingCardProps {
  product: ProductListing;
  onViewDetail: () => void;
  onAddToCart: () => void;
}

const ProductListingCard: React.FC<ProductListingCardProps> = ({ product, onViewDetail, onAddToCart }) => {
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Card
      className="shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent space from scrolling
          onViewDetail();
        }
      }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer" onClick={onViewDetail}>
        <Image
          src={product.imageUrl || `https://source.unsplash.com/random/400x300/?${product.imageAiHint || 'product'}`}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="bg-muted group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={product.imageAiHint || 'product item'}
        />
        {discountPercentage && (
          <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
            {discountPercentage}% OFF
          </Badge>
        )}
      </div>
      <CardHeader className="p-3 pb-1 cursor-pointer" onClick={onViewDetail}>
        {product.brand && <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>}
        <CardTitle className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1 flex-grow cursor-pointer" onClick={onViewDetail}>
        <div className="flex items-baseline gap-2 mb-1">
          <p className="text-md font-bold text-foreground">₹{product.price.toFixed(2)}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</p>
          )}
        </div>
        {product.rating !== undefined && product.reviewCount !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground">
            <StarIcon className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-0.5" />
            {product.rating.toFixed(1)} ({product.reviewCount})
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-2 border-t">
        <Button size="sm" className="w-full text-xs h-8" onClick={(e) => { e.stopPropagation(); onAddToCart(); }}>
          <ShoppingCartIcon className="h-3.5 w-3.5 mr-1.5" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductListingCard;
