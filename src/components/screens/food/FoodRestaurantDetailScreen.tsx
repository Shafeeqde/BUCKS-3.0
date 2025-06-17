
"use client";

import React from 'react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import type { Restaurant, MenuItem } from '@/types';
import MenuItemCard from '@/components/food/MenuItemCard';
import { useToast } from "@/hooks/use-toast";

interface FoodRestaurantDetailScreenProps {
  restaurant: Restaurant | null;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onBack: () => void;
}

const FoodRestaurantDetailScreen: React.FC<FoodRestaurantDetailScreenProps> = ({ restaurant, onAddToCart, onBack }) => {
  const { toast } = useToast();

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-lg text-muted-foreground">Restaurant details not found.</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const handleAddItem = (item: MenuItem) => {
    onAddToCart(item, 1); // Default quantity 1
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your food cart.`,
    });
  };

  const menuCategories = Array.from(new Set(restaurant.menu.map(item => item.category)));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b sticky top-0 bg-background z-10 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-muted-foreground hover:text-primary">
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-foreground font-headline truncate">{restaurant.name}</h2>
      </div>

      <ScrollArea className="flex-grow">
        {restaurant.imageUrl && (
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              layout="fill"
              objectFit="cover"
              className="bg-muted"
              data-ai-hint={restaurant.imageAiHint || "restaurant food"}
            />
          </div>
        )}
        <div className="p-4">
          <CardHeader className="px-0 pt-0 pb-2">
            <CardTitle className="text-2xl font-headline">{restaurant.name}</CardTitle>
            <CardDescription className="text-sm">
              {restaurant.cuisine} &bull; {restaurant.priceRange} &bull; {restaurant.deliveryTime}
            </CardDescription>
            <div className="flex items-center text-sm">
              <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
              {restaurant.rating.toFixed(1)}
            </div>
            {restaurant.address && <p className="text-xs text-muted-foreground mt-1">{restaurant.address}</p>}
          </CardHeader>

          {menuCategories.map(category => (
            <div key={category} className="mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 sticky top-0 bg-background py-2 border-b">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.menu.filter(item => item.category === category).map(menuItem => (
                  <MenuItemCard key={menuItem.id} item={menuItem} onAddToCart={() => handleAddItem(menuItem)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FoodRestaurantDetailScreen;
