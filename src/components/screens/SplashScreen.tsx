
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onDismiss: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  // Automatically dismiss after a few seconds if not clicked
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500); // 3.5 seconds
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background cursor-pointer animate-fade-in"
      onClick={onDismiss}
    >
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
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
      `}</style>
      <div className="text-center">
        <span className="text-7xl font-bold text-primary font-logo animate-pulse-logo">
          bucks
        </span>
        <p className="mt-4 text-muted-foreground animate-fade-in" style={{animationDelay: '0.5s'}}>
          Your personal finance and lifestyle companion.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
