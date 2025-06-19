
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
  const [isClient, setIsClient] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [translation, setTranslation] = useState({ x: 0, y: 0 });
  const [dragStartMouse, setDragStartMouse] = useState({ x: 0, y: 0 });
  const [initialTranslationOnDrag, setInitialTranslationOnDrag] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (fabRef.current) {
      setIsDragging(true);
      setHasDragged(false); 
      setDragStartMouse({ x: e.clientX, y: e.clientY });
      setInitialTranslationOnDrag({ ...translation }); 
      fabRef.current.focus(); 
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - dragStartMouse.x;
      const deltaY = e.clientY - dragStartMouse.y;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        setHasDragged(true);
      }

      let newX = initialTranslationOnDrag.x + deltaX;
      let newY = initialTranslationOnDrag.y + deltaY;
      
      setTranslation({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (!hasDragged && originalOnClick) {
          originalOnClick(); 
        }
        document.body.style.userSelect = ''; 
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; 
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (!isDragging) {
         document.body.style.userSelect = '';
      }
    };
  }, [isDragging, dragStartMouse, initialTranslationOnDrag, originalOnClick, hasDragged]);

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
      ref={fabRef}
      onMouseDown={!isClient ? undefined : handleMouseDown} 
      style={ isClient ? { 
        transform: `translate(${translation.x}px, ${translation.y}px)`,
        touchAction: 'none', 
      } : {}}
      className={cn(
        "fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-xl text-primary-foreground bg-primary hover:bg-primary/90 flex items-center justify-center",
        isClient && "cursor-grab", 
        isClient && isDragging && "cursor-grabbing",
        className 
      )}
      size="icon"
      aria-label={tooltipText} 
      {...props}
      onClick={!isClient ? originalOnClick : undefined} 
    >
      {displayIcon ? displayIcon : children}
    </Button>
  );

  if (!isClient) {
    return fabButton; 
  }

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
