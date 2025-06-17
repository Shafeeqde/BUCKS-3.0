
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StarIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { Restaurant } from '@/types';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  return (
    <Card
      className="shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      aria-label={`View details for ${restaurant.name}`}
    >
      <div className="relative h-40 w-full">
        <Image
          src={restaurant.imageUrl || `https://source.unsplash.com/random/800x600/?${restaurant.imageAiHint || 'food restaurant'}`}
          alt={restaurant.name}
          layout="fill"
          objectFit="cover"
          className="bg-muted"
          data-ai-hint={restaurant.imageAiHint || 'food restaurant'}
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-bold truncate font-headline">{restaurant.name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground truncate">{restaurant.cuisine}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-3 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <StarIcon className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
                <ClockIcon className="h-3.5 w-3.5 mr-1" />
                <span>{restaurant.deliveryTime}</span>
            </div>
            <span>{restaurant.priceRange}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
