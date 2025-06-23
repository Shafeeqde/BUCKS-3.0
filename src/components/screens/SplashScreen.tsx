
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
    }, 5000); // Let user enjoy the view for 5s
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0c0c1e] cursor-pointer overflow-hidden animate-fade-in"
      onClick={onDismiss}
      role="button"
      aria-label="Launch application"
    >
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { 
            text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00aaff, 0 0 20px #00aaff, 0 0 25px #00aaff, 0 0 30px #00aaff, 0 0 35px #00aaff;
          }
          50% { 
            text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00ccff, 0 0 40px #00ccff, 0 0 50px #00ccff, 0 0 60px #00ccff, 0 0 70px #00ccff;
          }
        }
        @keyframes space-travel {
            0% {
                transform: rotate(45deg) translateY(0);
            }
            100% {
                transform: rotate(45deg) translateY(-200vh);
            }
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-in-out;
        }
        .space-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200vmax;
          height: 200vmax;
          background-image:
              radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: space-travel 15s linear infinite;
          opacity: 0.5;
        }
      `}</style>
      
      <div className="space-bg"></div>

      <div className="relative z-10 text-center">
        <span 
          className="text-7xl font-bold text-white font-logo"
          style={{ animation: 'glow 3s ease-in-out infinite' }}
        >
          bucks
        </span>
        <p className="mt-4 text-blue-200/70 animate-fade-in" style={{animationDelay: '1s'}}>
          Your companion for the financial universe.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
