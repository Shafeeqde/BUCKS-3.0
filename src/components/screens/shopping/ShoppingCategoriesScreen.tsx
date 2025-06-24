
"use client";

import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon, ShoppingBagIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import type { ProductCategory } from '@/types';
import ProductCategoryCard from '@/components/shopping/ProductCategoryCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface ShoppingCategoriesScreenProps {
  categories: ProductCategory[];
  onSelectCategory: (categoryId: string) => void;
  onSelectBusinessProfile: (businessId: string | number) => void;
}

const dummyFeaturedStores = [
    {
      id: 'bp-1-cafe-bliss',
      name: 'Cafe Bliss',
      tagline: 'Artisanal coffee & pastries',
      imageUrl: 'https://source.unsplash.com/random/800x600/?modern,cafe,logo',
      imageAiHint: 'modern cafe logo',
    },
    {
      id: 'bp-2-techfix-solutions',
      name: 'TechFix Solutions',
      tagline: 'Gadget repairs and services',
      imageUrl: 'https://source.unsplash.com/random/800x600/?tech,repair,workshop',
      imageAiHint: 'tech repair workshop',
    },
    {
      id: 'bp-new-fashion',
      name: 'Vogue Threads',
      tagline: 'Latest fashion trends',
      imageUrl: 'https://source.unsplash.com/random/800x600/?fashion,store,boutique',
      imageAiHint: 'fashion store boutique',
    },
    {
        id: 'bp-3-greenscape-gardens',
        name: 'GreenScape Gardens',
        tagline: 'Landscaping and plant nursery',
        imageUrl: 'https://source.unsplash.com/random/800x600/?lush,green,garden',
        imageAiHint: 'lush green garden',
    }
  ];

const ShoppingCategoriesScreen: React.FC<ShoppingCategoriesScreenProps> = ({ categories, onSelectCategory, onSelectBusinessProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>(categories);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredCategories(
      categories.filter(
        (category) =>
          category.name.toLowerCase().includes(lowerSearchTerm) ||
          (category.description && category.description.toLowerCase().includes(lowerSearchTerm))
      )
    );
  }, [searchTerm, categories]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <h2 className="text-2xl font-bold text-foreground font-headline mb-4 flex items-center">
          <ShoppingBagIcon className="h-7 w-7 mr-2 text-primary" />
          Shopping
        </h2>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for stores or categories..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-grow p-4">
        {/* Featured Stores Section */}
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-3 font-headline flex items-center">
                <BuildingStorefrontIcon className="h-5 w-5 mr-2 text-muted-foreground"/>
                Featured Stores
            </h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar">
                {dummyFeaturedStores.map(store => (
                    <Card 
                        key={store.id} 
                        className="min-w-[250px] max-w-[250px] shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer overflow-hidden group" 
                        onClick={() => onSelectBusinessProfile(store.id)}
                    >
                        <div className="relative h-32 w-full">
                            <Image src={store.imageUrl} alt={store.name} layout="fill" objectFit="cover" className="bg-muted group-hover:scale-105 transition-transform" data-ai-hint={store.imageAiHint} />
                        </div>
                        <CardHeader className="p-3">
                            <CardTitle className="text-md font-bold truncate group-hover:text-primary">{store.name}</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground truncate">{store.tagline}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>

        {/* Categories Section */}
        <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 font-headline">Shop by Category</h3>
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <ProductCategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => onSelectCategory(category.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <ShoppingBagIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No categories found matching "{searchTerm}".</p>
                {searchTerm && <p className="text-sm">Try a different search term.</p>}
              </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ShoppingCategoriesScreen;
