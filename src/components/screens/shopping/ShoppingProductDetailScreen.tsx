
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon, ShieldCheckIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { ProductListing } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


interface ShoppingProductDetailScreenProps {
  product: ProductListing | null;
  onAddToCart: (product: ProductListing, quantity: number) => void;
  onBack: () => void;
}

const StarRatingDisplay: React.FC<{ rating: number; size?: number; className?: string }> = ({ rating, size = 5, className }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <div className={cn("flex items-center", className)}>
        {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className={`w-${size} h-${size} text-yellow-400 fill-yellow-400`} />)}
        {halfStar && <StarIcon key="half" className={`w-${size} h-${size} text-yellow-400 fill-yellow-200`} />}
        {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className={`w-${size} h-${size} text-gray-300`} />)}
      </div>
    );
  };

const ShoppingProductDetailScreen: React.FC<ShoppingProductDetailScreenProps> = ({ product, onAddToCart, onBack }) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-lg text-muted-foreground">Product details not found.</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const handleAddToCartClick = () => {
    // Variant selection validation could be added here if needed
    let variantInfo = "";
    if (product.variants && product.variants.length > 0) {
        variantInfo = product.variants.map(v => `${v.name}: ${selectedVariants[v.id] || 'Not selected'}`).join(', ');
    }
    onAddToCart(product, quantity); // Pass selectedVariants if needed for price adjustment
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} ${variantInfo ? `(${variantInfo})` : ''} added to your shopping cart.`,
    });
  };

  const handleVariantSelect = (variantId: string, optionValue: string) => {
    setSelectedVariants(prev => ({...prev, [variantId]: optionValue}));
  };

  return (
    <div className="flex flex-col h-full">
       <div className="p-4 border-b sticky top-0 bg-background z-20 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-muted-foreground hover:text-primary">
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-foreground font-headline truncate">{product.name}</h2>
      </div>
      <ScrollArea className="flex-grow">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 p-4 md:p-6">
          {/* Image Gallery */}
          <div className="md:sticky md:top-20 self-start">
            <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
              <Image
                src={product.imageUrl || `https://source.unsplash.com/random/600x600/?${product.imageAiHint || 'product'}`}
                alt={product.name}
                layout="fill"
                objectFit="contain" // Use contain to see full product if not square
                data-ai-hint={product.imageAiHint || 'product image'}
              />
            </div>
            {/* Thumbnail placeholder if multiple images */}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.brand && <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>}
              <h1 className="text-2xl lg:text-3xl font-bold font-headline text-foreground">{product.name}</h1>
              {product.rating !== undefined && product.reviewCount !== undefined && (
                <div className="flex items-center gap-2 mt-2">
                  <StarRatingDisplay rating={product.rating} />
                  <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                    {product.variants.map(variant => (
                        <div key={variant.id}>
                            <Label className="text-sm font-medium">{variant.name}: <span className="text-muted-foreground">{selectedVariants[variant.id]}</span></Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {variant.options.map(option => (
                                    <Button 
                                        key={option.value} 
                                        variant={selectedVariants[variant.id] === option.value ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleVariantSelect(variant.id, option.value)}
                                    >
                                        {option.value}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-3">
              <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => Math.max(1, q - 1))}><MinusIcon className="h-4 w-4"/></Button>
                <Input
                  id="quantity"
                  type="number"
                  value={Number(quantity)}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-8 w-12 text-center border-0 focus-visible:ring-0"
                  min="1"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => q + 1)}><PlusIcon className="h-4 w-4"/></Button>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={handleAddToCartClick}>
              <ShoppingCartIcon className="mr-2 h-5 w-5" /> Add to Cart
            </Button>

            <div className="text-sm text-muted-foreground space-y-2">
              {product.stock !== undefined && (
                <p>{product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}</p>
              )}
              <div className="flex items-center gap-1.5">
                <ShieldCheckIcon className="h-4 w-4 text-green-600"/> Secure transaction
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1.5">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </div>
            )}
            {/* Placeholder for reviews section */}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ShoppingProductDetailScreen;
