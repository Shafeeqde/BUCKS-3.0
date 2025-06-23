
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onDismiss: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background cursor-pointer animate-fade-out"
      style={{ animationFillMode: 'forwards', animationDelay: '2.5s' }}
      onClick={onDismiss}
      onAnimationEnd={onDismiss} // Dismiss when animation finishes
    >
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; pointer-events: none; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-in-out;
        }
        .animate-pulse-logo {
          animation: pulse 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .animate-fade-out {
            animation: fade-out 0.5s ease-in-out;
            animation-delay: 2s;
        }
      `}</style>
      <div className="animate-fade-in text-center">
        <span className="text-7xl font-bold text-primary font-logo animate-pulse-logo">
          bucks
        </span>
        <p className="mt-4 text-muted-foreground animate-fade-in" style={{animationDelay: '1s'}}>
          Your personal finance and lifestyle companion.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
