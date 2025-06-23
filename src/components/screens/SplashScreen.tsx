
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onDismiss: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show the tap prompt after the logo animation finishes
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 1500); // Corresponds to the animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-background p-4 transition-opacity duration-300"
      onClick={onDismiss}
      aria-label="Application Splash Screen, tap to enter"
    >
      <style jsx>{`
        @keyframes fade-in-scale-up {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fade-in-subtle {
           0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 0.7;
            transform: translateY(0);
          }
        }
        .animate-logo-entry {
          animation: fade-in-scale-up 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-prompt-fade-in {
          animation: fade-in-subtle 0.8s ease-out forwards;
        }
      `}</style>
      
      <div className="relative z-10 text-center">
        <span 
          className="text-7xl font-bold text-primary font-logo animate-logo-entry"
        >
          bucks
        </span>
      </div>

      {showPrompt && (
        <p className="absolute bottom-20 z-10 text-muted-foreground animate-prompt-fade-in">
          Tap anywhere to enter
        </p>
      )}
    </div>
  );
};

export default SplashScreen;
