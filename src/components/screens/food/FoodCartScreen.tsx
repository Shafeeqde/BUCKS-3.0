
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeftIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { FoodCartItem } from '@/types'; // Still using FoodCartItem for local food cart
import FoodCartItemCard from '@/components/food/FoodCartItemCard'; // Still using FoodCartItemCard

interface FoodCartScreenProps {
  cartItems: FoodCartItem[]; // This screen uses its own local cartItems for now
  onUpdateQuantity: (menuItemId: string, newQuantity: number) => void;
  onRemoveItem: (menuItemId: string) => void;
  onCheckout: () => void;
  onBack: () => void;
}

const FoodCartScreen: React.FC<FoodCartScreenProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onBack,
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b sticky top-0 bg-background z-10 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-muted-foreground hover:text-primary">
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-foreground font-headline flex items-center">
          <ShoppingCartIcon className="h-6 w-6 mr-2 text-primary" /> Food Order
        </h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <ShoppingCartIcon className="h-20 w-20 text-muted-foreground opacity-50 mb-4" />
          <p className="text-lg text-muted-foreground">Your food order is empty.</p>
          <p className="text-sm text-muted-foreground">Add some delicious items to get started!</p>
          <Button onClick={onBack} variant="outline" className="mt-6">Browse Restaurants</Button>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <FoodCartItemCard
                  key={item.menuItemId}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </div>
          </ScrollArea>
          <CardFooter className="p-4 border-t flex flex-col space-y-3 sticky bottom-0 bg-card">
            <div className="w-full space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <hr className="my-1" />
              <div className="flex justify-between font-semibold text-lg text-foreground">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={onCheckout}>
              Place Food Order
            </Button>
          </CardFooter>
        </>
      )}
    </div>
  );
};

export default FoodCartScreen;
