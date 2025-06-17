
"use client"; // Mark as Client Component

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { BusinessProductCardItem } from '@/types'; // Assuming BusinessProductCardItem is close enough or can be adapted
import { useToast } from "@/hooks/use-toast";


// Define the type for a cart item
export interface CartContextItem {
    id: string; // Product ID
    name: string;
    price: string; // Product Price (store as string as per BusinessProductCardItem)
    quantity: number;
    businessId: string | number; // ID of the business the product belongs to
    imageUrl?: string;
    imageAiHint?: string;
    // Add other product details if needed
}

// Define the shape of the Cart Context
interface CartContextType {
    cart: CartContextItem[];
    addToCart: (item: Omit<CartContextItem, 'quantity'>, quantity?: number) => void;
    getCartItemCount: () => number;
    // TODO: Add more cart actions (removeFromCart, updateQuantity, clearCart) for a full cart page
}

// Create the Context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the Cart Provider Component
interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartContextItem[]>([]);
    const { toast } = useToast();

    // Function to add an item to the cart
    const addToCart = (item: Omit<CartContextItem, 'quantity'>, quantity: number = 1) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(
                cartItem => cartItem.id === item.id && cartItem.businessId === item.businessId
            );

            if (existingItemIndex > -1) {
                // If exists, update the quantity
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                toast({
                    title: "Cart Updated",
                    description: `${item.name} quantity increased to ${newCart[existingItemIndex].quantity}.`,
                });
                return newCart;
            } else {
                // If not exists, add the new item
                 toast({
                    title: "Added to Cart",
                    description: `${quantity} x ${item.name} added from business ID ${item.businessId}.`,
                });
                return [...prevCart, { ...item, quantity }];
            }
        });
        console.log('Item added/updated in cart:', item.name, 'Quantity:', quantity, 'Business:', item.businessId, 'Current Cart:', cart);
    };

    // Function to get the total number of items in the cart (sum of quantities)
     const getCartItemCount = () => {
         return cart.reduce((total, item) => total + item.quantity, 0);
     };

    // Provide the cart state and actions through the context
    return (
        <CartContext.Provider value={{ cart, addToCart, getCartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to consume the Cart Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
