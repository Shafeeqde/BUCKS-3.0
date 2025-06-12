
"use client";

import React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Car } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps extends ButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  className, 
  icon,
  children,
  ...props 
}) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-xl text-primary-foreground bg-primary hover:bg-primary/90 flex items-center justify-center",
        className
      )}
      aria-label="Open activity view"
      size="icon"
      {...props}
    >
      {icon ? icon : children ? children : <Car className="w-6 h-6" />}
    </Button>
  );
};

export default FloatingActionButton;
