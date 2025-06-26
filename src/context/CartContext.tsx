
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

// Simplified for now, can be expanded if shopping is re-introduced
export interface CartContextItem {
    id: string; 
    name: string;
    price: string; 
    quantity: number;
    businessId: string | number; 
    businessName: string; 
    imageUrl?: string;
    imageAiHint?: string;
}

interface CartContextType {
    cart: CartContextItem[];
    addToCart: (item: Omit<CartContextItem, 'quantity'>, quantity?: number) => void;
    getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartContextItem[]>([]);
    const { toast } = useToast();

    const addToCart = (item: Omit<CartContextItem, 'quantity'>, quantity: number = 1) => {
        toast({
          title: "Feature Coming Soon",
          description: "Shopping cart functionality is under development.",
        });
    };

     const getCartItemCount = () => {
         return cart.reduce((total, item) => total + item.quantity, 0);
     };

    return (
        <CartContext.Provider value={{ cart, addToCart, getCartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
