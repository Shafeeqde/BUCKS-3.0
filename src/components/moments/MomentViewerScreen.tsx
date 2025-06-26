
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import type { UserMoment } from '@/types';
import { cn } from '@/lib/utils';

interface MomentViewerScreenProps {
  isOpen: boolean;
  onClose: () => void;
  moments: UserMoment[];
  initialMomentIndex?: number;
  ownerName?: string;
  ownerAvatarUrl?: string;
  ownerAvatarAiHint?: string;
  onViewOwnerProfile?: () => void;
}

const MomentViewerScreen: React.FC<MomentViewerScreenProps> = ({
  isOpen,
  onClose,
  moments,
  initialMomentIndex = 0,
  ownerName,
  ownerAvatarUrl,
  ownerAvatarAiHint,
  onViewOwnerProfile,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialMomentIndex);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialMomentIndex);
    }
  }, [isOpen, initialMomentIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && !isPaused && moments.length > 0 && moments.length > 1) {
      timer = setTimeout(() => {
        goToNext();
      }, 7000); // Auto-advance after 7 seconds
    }
    return () => clearTimeout(timer);
  }, [currentIndex, isOpen, isPaused, moments.length]);


  if (!isOpen) {
    return null;
  }

  const currentMoment = moments.length > 0 ? moments[currentIndex] : null;

  const goToPrevious = () => {
    if (moments.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const goToNext = () => {
    if (moments.length === 0) return;
    if (currentIndex < moments.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
        onClose(); // Close viewer after the last moment
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogOverlay className="bg-black/90" />
      <DialogContent
        className={cn(
          "fixed z-[60] p-0 border-0 shadow-none flex flex-col",
          "inset-0 w-full h-full bg-black rounded-none",
          "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[360px] sm:max-w-[360px] sm:h-[640px] sm:max-h-[90vh] sm:rounded-2xl sm:overflow-hidden sm:shadow-2xl"
        )}
        onEscapeKeyDown={onClose}
        hideCloseButton 
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>
            Moment Viewer: {ownerName ? `Viewing moments from ${ownerName}` : "Viewing your moments"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full h-full flex flex-col overflow-hidden">
          <div className="absolute top-0 left-0 right-0 z-20 p-3">
            {moments.length > 1 && (
              <div className="flex space-x-1 mb-2">
                {moments.map((_, index) => (
                  <div key={index} className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                    <div
                      className={cn(
                        "h-full bg-white",
                        index < currentIndex && "w-full",
                        index > currentIndex && "w-0",
                        index === currentIndex && (isPaused ? "w-0" : "animate-progress-bar") 
                      )}
                      style={index === currentIndex && !isPaused ? { animationPlayState: 'running', animationDuration: '7s' } : {animationPlayState: 'paused', width: index < currentIndex ? '100%' : '0%'}}
                    />
                  </div>
                ))}
              </div>
            )}
            {ownerName && (
              <div
                className={cn(
                  "flex items-center space-x-2",
                  onViewOwnerProfile && "cursor-pointer hover:opacity-80 transition-opacity"
                )}
                onClick={onViewOwnerProfile}
              >
                <Avatar className="h-8 w-8 border-2 border-white/50">
                  <AvatarImage src={ownerAvatarUrl} alt={ownerName} data-ai-hint={ownerAvatarAiHint || "profile avatar"}/>
                  <AvatarFallback className="bg-gray-600 text-white text-xs">{ownerName.substring(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-semibold drop-shadow-md">{ownerName}</span>
              </div>
            )}
          </div>
          <style jsx global>{`
            @keyframes progress-bar-animation {
              from { width: 0%; }
              to { width: 100%; }
            }
            .animate-progress-bar {
              animation: progress-bar-animation linear;
            }
          `}</style>

          <Button
            variant="ghost" size="icon" onClick={onClose}
            className="absolute top-3 right-3 z-30 text-white hover:bg-white/20 h-8 w-8"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>

          <div className="relative flex-grow w-full h-full flex items-center justify-center">
            {currentMoment ? (
              <>
                <Image
                    src={currentMoment.imageUrl} alt={currentMoment.caption || 'Moment'}
                    layout="fill" objectFit="cover" className="z-0"
                    data-ai-hint={currentMoment.aiHint || "story moment"} priority
                />
                {currentMoment.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10">
                    <p className="text-white text-sm text-center drop-shadow-md">{currentMoment.caption}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-white/80 p-4">
                <InformationCircleIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-semibold">No moments to show</p>
                {ownerName && <p className="text-sm">It looks like {ownerName} hasn&apos;t posted any moments yet.</p>}
              </div>
            )}
          </div>

          {moments.length > 1 && currentMoment && (
            <>
              <Button variant="ghost" size="icon" onClick={goToPrevious} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 text-white hover:bg-white/20 opacity-50 hover:opacity-100 sm:opacity-100"><ChevronLeftIcon className="h-6 w-6"/></Button>
              <Button variant="ghost" size="icon" onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 text-white hover:bg-white/20 opacity-50 hover:opacity-100 sm:opacity-100"><ChevronRightIcon className="h-6 w-6"/></Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MomentViewerScreen;
