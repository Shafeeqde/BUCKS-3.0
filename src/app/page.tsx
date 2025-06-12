"use client";
import { useEffect, useState } from 'react';
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import HomeScreen from '@/components/screens/HomeScreen';
import FeedsScreen from '@/components/screens/FeedsScreen';
import ServicesScreen from '@/components/screens/ServicesScreen';
import RecommendedScreen from '@/components/screens/RecommendedScreen';
import AccountScreen from '@/components/screens/AccountScreen';
import type { TabName } from '@/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderScreenContent = () => {
    // Only render dynamic screen content if on the client side
    if (!isClient) {
      // You could return a loading skeleton specific to the content area here if desired
      return null;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'feeds':
        return <FeedsScreen />;
      case 'menu':
        return <ServicesScreen setActiveTab={setActiveTab} />;
      case 'recommended':
        return <RecommendedScreen />;
      case 'account':
        return <AccountScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex-grow overflow-hidden">
        {renderScreenContent()}
      </div>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
