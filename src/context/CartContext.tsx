
"use client"; // Mark as Client Component

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { BusinessProductCardItem } from '@/types';
import { useToast } from "@/hooks/use-toast";


// Define the type for a cart item
export interface CartContextItem {
    id: string; // Product ID
    name: string;
    price: string; // Product Price (store as string)
    quantity: number;
    businessId: string | number; // ID of the business the product belongs to
    businessName: string; // Name of the business
    imageUrl?: string; // Product image URL
    imageAiHint?: string; // Product image AI hint
}

// Define the shape of the Cart Context
interface CartContextType {
    cart: CartContextItem[];
    addToCart: (item: Omit<CartContextItem, 'quantity'>, quantity?: number) => void;
    updateCartItemQuantity: (itemId: string, businessId: string | number, newQuantity: number) => void;
    removeCartItem: (itemId: string, businessId: string | number) => void;
    getCartItemCount: () => number;
    clearCartForBusiness: (businessId: string | number) => void;
    getCartForBusiness: (businessId: string | number) => CartContextItem[];
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
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                setTimeout(() => {
                    toast({
                        title: "Cart Updated",
                        description: `${item.name} quantity increased to ${newCart[existingItemIndex].quantity} in your cart for ${item.businessName}.`,
                    });
                }, 0);
                return newCart;
            } else {
                setTimeout(() => {
                    toast({
                        title: "Added to Cart",
                        description: `${quantity} x ${item.name} added to your cart for ${item.businessName}.`,
                    });
                }, 0);
                return [...prevCart, { ...item, quantity }];
            }
        });
    };

    const updateCartItemQuantity = (itemId: string, businessId: string | number, newQuantity: number) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === itemId && item.businessId === businessId
                    ? { ...item, quantity: newQuantity }
                    : item
            ).filter(item => item.quantity > 0) // Remove item if quantity is 0 or less
        );
    };

    const removeCartItem = (itemId: string, businessId: string | number) => {
        setCart(prevCart => {
            const itemToRemove = prevCart.find(item => item.id === itemId && item.businessId === businessId);
            if (itemToRemove) {
                setTimeout(() => {
                    toast({
                        title: "Item Removed",
                        description: `${itemToRemove.name} removed from your cart for ${itemToRemove.businessName}.`,
                        variant: "destructive"
                    });
                }, 0);
            }
            return prevCart.filter(item => !(item.id === itemId && item.businessId === businessId));
        });
    };

    const clearCartForBusiness = (businessId: string | number) => {
        const businessName = cart.find(item => item.businessId === businessId)?.businessName || 'this business';
        setCart(prevCart => prevCart.filter(item => item.businessId !== businessId));
        setTimeout(() => {
            toast({
                title: `Cart Cleared for ${businessName}`,
                description: `All items from ${businessName} have been removed from your cart.`,
            });
        }, 0);
    };

    const getCartForBusiness = (businessId: string | number): CartContextItem[] => {
        return cart.filter(item => item.businessId === businessId);
    };


    // Function to get the total number of items in the cart (sum of quantities)
     const getCartItemCount = () => {
         return cart.reduce((total, item) => total + item.quantity, 0);
     };

    // Provide the cart state and actions through the context
    return (
        <CartContext.Provider value={{ cart, addToCart, updateCartItemQuantity, removeCartItem, getCartItemCount, clearCartForBusiness, getCartForBusiness }}>
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
