
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { TruckIcon, Bike, StoreIcon, BellIcon } from 'lucide-react'; // Added StoreIcon, BellIcon
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FloatingActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick?: () => void;
  icon?: React.ReactNode;
  tooltipText?: string;
  activityType?: 'taxi' | 'delivery' | 'business' | null; // Added 'business'
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick: originalOnClick,
  className,
  icon,
  children,
  tooltipText = "View Activity", // More generic default
  activityType, 
  ...props
}) => {
  let displayIcon = icon;
  if (!displayIcon && !children) {
    switch (activityType) {
      case 'taxi':
        displayIcon = <TruckIcon className="w-6 h-6" />;
        break;
      case 'delivery':
        displayIcon = <Bike className="w-6 h-6" />;
        break;
      case 'business':
        displayIcon = <StoreIcon className="w-6 h-6" />;
        break;
      default: // For null or if activityDetails has a different type not covered by simple "online" modes
        displayIcon = <BellIcon className="w-6 h-6" />; // Generic alert/activity icon
    }
  }
  
  const fabButton = (
    <Button
      onClick={originalOnClick}
      className={cn(
        "fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full shadow-xl text-primary-foreground bg-primary hover:bg-primary/90 flex items-center justify-center",
        className 
      )}
      size="icon"
      aria-label={tooltipText} 
      {...props}
    >
      {displayIcon ? displayIcon : children}
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {fabButton}
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default FloatingActionButton;
