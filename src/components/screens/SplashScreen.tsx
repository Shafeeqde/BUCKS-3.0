"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
  onDismiss: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0c0c1e] overflow-hidden animate-fade-in"
      aria-label="Application Splash Screen"
    >
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes subtle-glow {
            0% {
                text-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 6px #00aaff;
                opacity: 0.8;
            }
            100% {
                text-shadow: 0 0 5px #fff, 0 0 8px #00aaff, 0 0 12px #00aaff;
                opacity: 1;
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
        @keyframes core-pulse {
            0%, 100% {
                transform: scale(0.9);
                opacity: 0.7;
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
            50% {
                transform: scale(1);
                opacity: 1;
                box-shadow: 0 0 25px rgba(0, 255, 255, 0.8);
            }
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-in-out;
        }
        .animate-glow-once {
          animation: subtle-glow 2.5s ease-out forwards;
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
          className="text-7xl font-bold text-white font-logo animate-glow-once"
        >
          bucks
        </span>
        <p className="mt-4 text-blue-200/70 animate-fade-in" style={{animationDelay: '1s'}}>
          Your companion for the financial universe.
        </p>
      </div>

      <button
        onClick={onDismiss}
        className="absolute bottom-16 sm:bottom-20 z-20 flex flex-col items-center gap-3 group"
        aria-label="Touch to begin"
      >
        <div className="h-20 w-20 rounded-full flex items-center justify-center bg-white/5 border border-white/20 backdrop-blur-sm shadow-[0_0_20px_rgba(0,191,255,0.5)] transition-transform group-hover:scale-105">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center border border-white/30">
                <div className="h-10 w-10 rounded-full bg-cyan-400" style={{ animation: 'core-pulse 2s infinite ease-in-out' }}></div>
            </div>
        </div>
        <span className="text-white/70 tracking-widest text-sm uppercase transition-all group-hover:text-white group-hover:tracking-wider">touch here</span>
    </button>

    </div>
  );
};

export default SplashScreen;
