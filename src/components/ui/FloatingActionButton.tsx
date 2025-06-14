
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FloatingActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick?: () => void;
  icon?: React.ReactNode;
  tooltipText?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick: originalOnClick,
  className,
  icon,
  children,
  tooltipText = "Open activity view",
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

  const fabButton = (
    <Button
      ref={fabRef}
      onMouseDown={!isClient ? undefined : handleMouseDown} // Only allow drag on client
      style={ isClient ? { // Only apply transform on client
        transform: `translate(${translation.x}px, ${translation.y}px)`,
        touchAction: 'none', 
      } : {}}
      className={cn(
        "fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-xl text-primary-foreground bg-primary hover:bg-primary/90 flex items-center justify-center",
        isClient && "cursor-grab", // Only show grab cursor on client
        isClient && isDragging && "cursor-grabbing",
        className 
      )}
      size="icon"
      aria-label={tooltipText} 
      {...props}
      onClick={!isClient ? originalOnClick : undefined} // For server render or if not dragging
    >
      {icon ? icon : children ? children : <Car className="w-6 h-6" />}
    </Button>
  );

  if (!isClient) {
    return fabButton; // Render basic button for SSR or if JS is disabled
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
