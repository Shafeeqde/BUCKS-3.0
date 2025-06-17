
"use client";

import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon, ArrowLeftIcon, FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import type { ProductListing, ProductCategory } from '@/types';
import ProductListingCard from '@/components/shopping/ProductListingCard';

interface ShoppingProductsListScreenProps {
  products: ProductListing[];
  category: ProductCategory | null;
  onSelectProduct: (productId: string) => void;
  onBack: () => void;
  onAddToCart: (product: ProductListing, quantity: number) => void;
}

const ShoppingProductsListScreen: React.FC<ShoppingProductsListScreenProps> = ({
  products,
  category,
  onSelectProduct,
  onBack,
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<ProductListing[]>(products);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerSearchTerm) ||
          product.description.toLowerCase().includes(lowerSearchTerm) ||
          (product.brand && product.brand.toLowerCase().includes(lowerSearchTerm)) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
      )
    );
  }, [searchTerm, products]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-muted-foreground hover:text-primary">
                <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold text-foreground font-headline truncate">
                {category ? category.name : 'All Products'}
            </h2>
        </div>
        <div className="flex gap-2">
            <div className="relative flex-grow">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button variant="outline" size="icon">
                <AdjustmentsHorizontalIcon className="h-5 w-5"/>
                <span className="sr-only">Filters</span>
            </Button>
        </div>
      </div>

      <ScrollArea className="flex-grow p-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductListingCard
                key={product.id}
                product={product}
                onViewDetail={() => onSelectProduct(product.id)}
                onAddToCart={() => onAddToCart(product, 1)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <MagnifyingGlassIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No products found matching "{searchTerm}".</p>
            {searchTerm && <p className="text-sm">Try adjusting your search or filters.</p>}
            {!searchTerm && <p className="text-sm">More products coming soon for {category?.name || 'this category'}!</p>}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ShoppingProductsListScreen;
