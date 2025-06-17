
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProductCategory } from '@/types';

interface ProductCategoryCardProps {
  category: ProductCategory;
  onClick: () => void;
}

const ProductCategoryCard: React.FC<ProductCategoryCardProps> = ({ category, onClick }) => {
  return (
    <Card
      className="shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden group"
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      aria-label={`View products in ${category.name} category`}
    >
      <div className="relative h-40 w-full">
        <Image
          src={category.imageUrl || `https://source.unsplash.com/random/600x400/?${category.imageAiHint || 'category products'}`}
          alt={category.name}
          layout="fill"
          objectFit="cover"
          className="bg-muted transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={category.imageAiHint || 'category products'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      </div>
      <CardHeader className="p-4 absolute bottom-0 left-0 right-0">
        <CardTitle className="text-lg font-bold text-primary-foreground drop-shadow-md font-headline">{category.name}</CardTitle>
        {category.description && (
          <CardDescription className="text-xs text-primary-foreground/80 line-clamp-2 drop-shadow-sm">
            {category.description}
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  );
};

export default ProductCategoryCard;
