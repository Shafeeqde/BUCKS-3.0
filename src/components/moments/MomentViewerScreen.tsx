
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog'; // Using Dialog components for modal structure
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { UserMoment } from '@/types';
import { cn } from '@/lib/utils';

interface MomentViewerScreenProps {
  isOpen: boolean;
  onClose: () => void;
  moments: UserMoment[];
  initialMomentIndex?: number;
}

const MomentViewerScreen: React.FC<MomentViewerScreenProps> = ({
  isOpen,
  onClose,
  moments,
  initialMomentIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialMomentIndex);

  useEffect(() => {
    setCurrentIndex(initialMomentIndex);
  }, [isOpen, initialMomentIndex]);

  if (!isOpen || moments.length === 0) {
    return null;
  }

  const currentMoment = moments[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : moments.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < moments.length - 1 ? prevIndex + 1 : 0));
  };
  
  // Auto-advance (basic example, can be more sophisticated with progress bars)
  // useEffect(() => {
  //   if (moments.length > 1) {
  //     const timer = setTimeout(() => {
  //       goToNext();
  //     }, 5000); // Change moment every 5 seconds
  //     return () => clearTimeout(timer);
  //   }
  // }, [currentIndex, moments.length]);


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogOverlay className="bg-black/90" />
      <DialogContent 
        className="p-0 w-full h-full max-w-full max-h-full sm:max-w-full sm:max-h-full md:max-w-full md:max-h-full lg:max-w-full lg:max-h-full flex flex-col items-center justify-center bg-transparent border-0 shadow-none rounded-none !translate-x-0 !translate-y-0"
        onEscapeKeyDown={onClose}
        hideCloseButton // Custom close button below
      >
        <div className="relative w-full h-full max-w-screen-sm max-h-screen-md aspect-[9/16] sm:aspect-auto sm:max-h-[90vh] sm:max-w-[50vh] bg-black rounded-lg overflow-hidden shadow-2xl flex flex-col">
          {/* Progress Bars (Placeholder) */}
          {moments.length > 1 && (
            <div className="absolute top-2 left-2 right-2 z-20 flex space-x-1 px-1">
              {moments.map((_, index) => (
                <div key={index} className="h-1 flex-1 rounded-full bg-white/30">
                  <div
                    className={cn(
                      "h-full rounded-full bg-white transition-all duration-300 ease-linear",
                      index === currentIndex ? "w-full" : "w-0", 
                      index < currentIndex && "w-full" // Filled if already viewed
                    )}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-3 right-3 z-20 text-white hover:bg-white/20 h-8 w-8"
            aria-label="Close moment viewer"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>

          {/* Content Area */}
          <div className="relative flex-grow w-full h-full">
            {currentMoment.imageUrl && (
              <Image
                src={currentMoment.imageUrl}
                alt={currentMoment.caption || currentMoment.aiHint || `Moment ${currentIndex + 1}`}
                layout="fill"
                objectFit="contain" // 'contain' is usually better for stories to see the whole image
                className="z-0"
                data-ai-hint={currentMoment.aiHint || "story moment"}
                priority
              />
            )}
            {currentMoment.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10">
                <p className="text-white text-sm text-center drop-shadow-md">{currentMoment.caption}</p>
              </div>
            )}
          </div>

          {/* Navigation Tappable Areas */}
          {moments.length > 1 && (
            <>
              <div
                className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
                onClick={goToPrevious}
                aria-label="Previous moment"
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
                onClick={goToNext}
                aria-label="Next moment"
              />
            </>
          )}
           {/* Navigation Buttons (Optional, more explicit control) */}
            {moments.length > 1 && (
                <div className="absolute inset-y-0 left-0 flex items-center z-20">
                    <Button variant="ghost" size="icon" onClick={goToPrevious} className="text-white hover:bg-white/20 m-2">
                        <ChevronLeftIcon className="h-6 w-6"/>
                    </Button>
                </div>
            )}
            {moments.length > 1 && (
                <div className="absolute inset-y-0 right-0 flex items-center z-20">
                    <Button variant="ghost" size="icon" onClick={goToNext} className="text-white hover:bg-white/20 m-2">
                        <ChevronRightIcon className="h-6 w-6"/>
                    </Button>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MomentViewerScreen;
