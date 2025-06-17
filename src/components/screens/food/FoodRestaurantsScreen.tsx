
"use client";

import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import type { Restaurant } from '@/types';
import RestaurantCard from '@/components/food/RestaurantCard';

interface FoodRestaurantsScreenProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurantId: string) => void;
}

const FoodRestaurantsScreen: React.FC<FoodRestaurantsScreenProps> = ({ restaurants, onSelectRestaurant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredRestaurants(
      restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(lowerSearchTerm) ||
          restaurant.cuisine.toLowerCase().includes(lowerSearchTerm) ||
          (restaurant.address && restaurant.address.toLowerCase().includes(lowerSearchTerm))
      )
    );
  }, [searchTerm, restaurants]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <h2 className="text-2xl font-bold text-foreground font-headline mb-4 flex items-center">
            <BuildingStorefrontIcon className="h-7 w-7 mr-2 text-primary"/>
            Order Food
        </h2>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search restaurants, cuisines..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-grow p-4">
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => onSelectRestaurant(restaurant.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <BuildingStorefrontIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No restaurants found matching "{searchTerm}".</p>
            {searchTerm && <p className="text-sm">Try a different search term.</p>}
            {!searchTerm && <p className="text-sm">More restaurants coming soon!</p>}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default FoodRestaurantsScreen;
