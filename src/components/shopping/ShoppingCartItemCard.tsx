
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { ShoppingCartItem } from '@/types';

interface ShoppingCartItemCardProps {
  item: ShoppingCartItem;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const ShoppingCartItemCard: React.FC<ShoppingCartItemCardProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1) {
      onUpdateQuantity(item.productId, newQuantity);
    } else if (newQuantity === 0) {
      onRemoveItem(item.productId);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-3 flex items-center space-x-3">
        {item.imageUrl && (
          <div className="relative h-16 w-16 rounded-md overflow-hidden border flex-shrink-0">
            <Image
              src={item.imageUrl}
              alt={item.name}
              layout="fill"
              objectFit="cover"
              className="bg-muted"
              data-ai-hint={item.imageAiHint || 'cart product'}
            />
          </div>
        )}
        <div className="flex-grow min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
          {item.variantInfo && <p className="text-xs text-muted-foreground truncate">{item.variantInfo}</p>}
          <p className="text-sm font-medium text-primary mt-0.5">₹{(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(-1)} disabled={item.quantity <= 1 && false}>
            <MinusIcon className="h-3.5 w-3.5" />
          </Button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(1)}>
            <PlusIcon className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onRemoveItem(item.productId)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingCartItemCard;
