
"use client";

import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import type { ProductCategory } from '@/types';
import ProductCategoryCard from '@/components/shopping/ProductCategoryCard';

interface ShoppingCategoriesScreenProps {
  categories: ProductCategory[];
  onSelectCategory: (categoryId: string) => void;
}

const ShoppingCategoriesScreen: React.FC<ShoppingCategoriesScreenProps> = ({ categories, onSelectCategory }) => {
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
          Shop by Category
        </h2>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search categories..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-grow p-4">
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
            {!searchTerm && <p className="text-sm">More categories coming soon!</p>}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ShoppingCategoriesScreen;
