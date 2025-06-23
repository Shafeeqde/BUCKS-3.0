
"use client";

import React from 'react';
import { Bars3Icon, ChatBubbleOvalLeftEllipsisIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCart } from '@/context/CartContext'; 

interface HeaderProps {
  onMenuClick: () => void;
  onMessagesClick: () => void;
  onCartClick: () => void; 
  unreadCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onMessagesClick,
  onCartClick,
  unreadCount = 0,
}) => {
  const { getCartItemCount } = useCart(); 
  const cartItemCount = getCartItemCount(); 

  return (
    <header className="bg-card shadow-sm p-4 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu" className="mr-2 text-foreground hover:text-primary" onClick={onMenuClick}>
              <Bars3Icon className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open Menu</p>
          </TooltipContent>
        </Tooltip>
        <span className="text-3xl font-bold text-primary font-logo">bucks</span>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Cart" className="text-foreground hover:text-primary" onClick={onCartClick}>
                <ShoppingCartIcon className="w-7 h-7 sm:w-8 sm:w-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Cart ({cartItemCount} items)</p>
            </TooltipContent>
          </Tooltip>
          {cartItemCount > 0 && (
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-destructive-foreground bg-destructive rounded-full">
              {cartItemCount > 9 ? "9+" : cartItemCount}
            </span>
          )}
        </div>
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Messages" className="text-foreground hover:text-primary" onClick={onMessagesClick}>
                <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Messages & Notifications</p>
            </TooltipContent>
          </Tooltip>
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-destructive-foreground bg-destructive rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
