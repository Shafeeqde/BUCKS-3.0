
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeftIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart, type CartContextItem } from '@/context/CartContext';
import UnifiedCartItemCard from './UnifiedCartItemCard'; // Renamed import
import { useToast } from '@/hooks/use-toast';
import type { TabName } from '@/types';

interface UnifiedCartScreenProps {
  onBack: () => void; // To go back to the previous screen
  setActiveTab: (tab: TabName) => void;
}

const UnifiedCartScreen: React.FC<UnifiedCartScreenProps> = ({
  onBack,
  setActiveTab,
}) => {
  const { cart, getCartItemCount } = useCart();
  const { toast } = useToast();

  const groupedCart = cart.reduce((acc, item) => {
    const businessIdStr = String(item.businessId);
    if (!acc[businessIdStr]) {
      acc[businessIdStr] = {
        businessId: item.businessId,
        businessName: item.businessName,
        items: [],
        subtotal: 0,
      };
    }
    acc[businessIdStr].items.push(item);
    acc[businessIdStr].subtotal += parseFloat(item.price) * item.quantity;
    return acc;
  }, {} as Record<string, { businessId: string | number; businessName: string; items: CartContextItem[]; subtotal: number }>);

  const businessCarts = Object.values(groupedCart);

  const handleCheckout = (businessId: string | number, businessName: string) => {
    toast({
      title: `Checkout for ${businessName}`,
      description: "Simulating checkout process. Items for this business would be processed.",
    });
    // In a real app, this would trigger an order process for this specific business
    // Feature Coming Soon: Clear items for this business after mock checkout
    // Optionally, navigate away or show an order confirmation
    if (getCartItemCount() === 0) { // If that was the last business in cart
        setActiveTab('home');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b sticky top-0 bg-background z-10 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-muted-foreground hover:text-primary">
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-foreground font-headline flex items-center">
          <ShoppingCartIcon className="h-6 w-6 mr-2 text-primary" /> Your Cart
        </h2>
      </div>

      {cart.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <ShoppingCartIcon className="h-20 w-20 text-muted-foreground opacity-50 mb-4" />
          <p className="text-lg text-muted-foreground">Your cart is empty.</p>
          <p className="text-sm text-muted-foreground">Add some items to get started!</p>
          <Button onClick={() => setActiveTab('home')} variant="outline" className="mt-6">Continue Shopping</Button>
        </div>
      ) : (
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-6">
            {businessCarts.map((businessCart) => (
              <Card key={businessCart.businessId} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary">{businessCart.businessName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {businessCart.items.map((item) => (
                    <UnifiedCartItemCard
                      key={item.id}
                      item={item}
                    />
                  ))}
                </CardContent>
                <CardFooter className="flex flex-col items-end space-y-2 pt-3 border-t">
                  <div className="text-md font-semibold">
                    Subtotal for {businessCart.businessName}: ₹{businessCart.subtotal.toFixed(2)}
                  </div>
                  <Button
                    onClick={() => handleCheckout(businessCart.businessId, businessCart.businessName)}
                    className="w-full sm:w-auto"
                  >
                    Checkout from {businessCart.businessName}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default UnifiedCartScreen;
