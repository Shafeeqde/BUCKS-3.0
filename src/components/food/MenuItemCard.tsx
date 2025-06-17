
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircleIcon, CheckIcon } from '@heroicons/react/24/outline';
import type { MenuItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: () => void;
  isAdded?: boolean; // Optional: To show a different state if item is already in cart
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart, isAdded }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {item.imageUrl && (
        <div className="relative h-32 w-full">
          <Image
            src={item.imageUrl}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-md bg-muted"
            data-ai-hint={item.imageAiHint || 'menu item food'}
          />
        </div>
      )}
      <CardHeader className={cn("p-3 pb-1", !item.imageUrl && "pt-4")}>
        <CardTitle className="text-md font-semibold truncate">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow">
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
        )}
        <div className="flex flex-wrap gap-1 mb-2">
          {item.isVegetarian && <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Veg</Badge>}
          {item.isSpicy && <Badge variant="outline" className="text-red-600 border-red-600 text-xs">Spicy</Badge>}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 border-t mt-auto flex justify-between items-center">
        <p className="text-md font-bold text-foreground">₹{item.price.toFixed(2)}</p>
        <Button size="sm" variant={isAdded ? "secondary" : "default"} onClick={onAddToCart} disabled={isAdded}>
          {isAdded ? <CheckIcon className="h-4 w-4 mr-1.5" /> : <PlusCircleIcon className="h-4 w-4 mr-1.5" />}
          {isAdded ? 'Added' : 'Add'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;

    