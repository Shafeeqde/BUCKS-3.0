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

  // State to track if the component has mounted on the client side
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after the component mounts on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderContent = () => {
    // Only render content if on the client side
    if (!isClient) return null; // Or a loading state

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

  // Only render the full app structure on the client side
  if (!isClient) return null; // Or a loading state for the initial server render

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex-grow overflow-hidden">
        {renderContent()}
      </div>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
