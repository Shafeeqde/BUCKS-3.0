
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
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ActiveActivityView from '@/components/activity/ActiveActivityView';
import type { TabName } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button'; // For role toggle button
import { User, UserCog } from 'lucide-react'; // Icons for role toggle

// Define a type for activeActivityDetails to be used with ActiveActivityView
type ActivityDetails = {
  type?: 'ride' | 'request';
  status?: string;
  pickup?: string;
  dropoff?: string;
  driverName?: string;
  riderName?: string;
  vehicle?: string;
  fare?: string;
} | null;

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  // Simulated state for FAB and ActiveActivityView
  const [userRoleSim, setUserRoleSim] = useState<'rider' | 'driver' | null>('driver');
  const [isFabVisibleSim, setIsFabVisibleSim] = useState(false);
  const [isActivityViewVisibleSim, setIsActivityViewVisibleSim] = useState(false);
  const [activityDetailsSim, setActivityDetailsSim] = useState<ActivityDetails>(null);
  const [isDriverOnlineSim, setIsDriverOnlineSim] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Show FAB if the user is a driver (simulated) and has a vehicle (assumed for now)
    // Or if user is a rider and might have an ongoing activity (simplification)
    if (userRoleSim === 'driver' || userRoleSim === 'rider') {
      setIsFabVisibleSim(true);
    } else {
      setIsFabVisibleSim(false);
    }
  }, [userRoleSim]);


  const handleFabClick = () => {
    if (userRoleSim === 'driver') {
      if (!isDriverOnlineSim) {
        setIsDriverOnlineSim(true);
        setActivityDetailsSim(null); // No specific ride/request yet
        setIsActivityViewVisibleSim(true);
        toast({ title: "You are now Online", description: "Waiting for ride requests." });
        
        // Simulate receiving a request after 5 seconds
        setTimeout(() => {
          // Check if still online and in driver role, and no other activity view open with a request
          if (userRoleSim === 'driver' && isDriverOnlineSim && !activityDetailsSim?.type) {
            setActivityDetailsSim({
              type: 'request',
              riderName: 'Simulated User',
              pickup: '123 Frontend St',
              dropoff: '456 Backend Ave',
              fare: '₹180',
            });
            setIsActivityViewVisibleSim(true); // Ensure it's visible
            toast({ title: "New Ride Request!", description: "A user needs a ride." });
          }
        }, 5000);
      } else {
        // If already online, FAB click just opens/shows the current activity view
        setIsActivityViewVisibleSim(true); 
      }
    } else if (userRoleSim === 'rider') {
      // Simulate rider booking a ride
      setActivityDetailsSim({
        type: 'ride',
        status: 'Looking for driver...',
        pickup: 'Rider Pickup Point',
        dropoff: 'Rider Destination Point',
      });
      setIsActivityViewVisibleSim(true);
      toast({ title: "Ride Requested", description: "Searching for drivers." });
      
      // Sim`ulate driver found after 6 seconds
       setTimeout(() => {
         if (userRoleSim === 'rider' && activityDetailsSim?.status === 'Looking for driver...') {
            setActivityDetailsSim(prev => ({
                ...prev,
                status: 'Driver Assigned',
                driverName: 'Sim Driver',
                vehicle: 'Cool Car - XX00YZ0000',
            }));
            toast({ title: "Driver Found!", description: "Your ride is on the way." });
         }
      }, 6000);
    }
  };

  const handleCloseActivityView = () => {
    setIsActivityViewVisibleSim(false);
    // Optional: If driver closes a request view, they might be implicitly rejecting it or just closing the modal.
    // For this simulation, just closing. If it was a request, clear it so new one can come.
    if (activityDetailsSim?.type === 'request') {
        setActivityDetailsSim(null);
    }
  };
  
  // Simulate driver accepting a request (this would usually be triggered by a button IN ActiveActivityView)
  // For this simulation, let's add a temporary effect if a request is visible
   useEffect(() => {
    if (isActivityViewVisibleSim && activityDetailsSim?.type === 'request' && userRoleSim === 'driver') {
      const timer = setTimeout(() => {
        setActivityDetailsSim({
          type: 'ride', // It's now an active ride for the driver
          status: 'en_route', // Driver is on the way to pickup
          riderName: activityDetailsSim.riderName,
          pickup: activityDetailsSim.pickup,
          dropoff: activityDetailsSim.dropoff,
          fare: activityDetailsSim.fare,
        });
        toast({ title: "Ride Accepted (Auto-Simulated)", description: "Proceed to pickup location." });
      }, 7000); // Auto-accept after 7s for demo
      return () => clearTimeout(timer);
    }
  }, [isActivityViewVisibleSim, activityDetailsSim, userRoleSim]);


  const toggleUserRole = () => {
    setActiveTab('home'); // Reset tab on role change
    setIsDriverOnlineSim(false);
    setActivityDetailsSim(null);
    setIsActivityViewVisibleSim(false);
    setUserRoleSim(prev => (prev === 'rider' ? 'driver' : 'rider'));
  };

  const renderScreenContent = () => {
    if (!isClient) {
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
      <div className="flex-grow overflow-hidden relative">
        {renderScreenContent()}
      </div>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {isClient && isFabVisibleSim && (
        <FloatingActionButton onClick={handleFabClick} />
      )}

      {isClient && (
        <ActiveActivityView
          isVisible={isActivityViewVisibleSim}
          onClose={handleCloseActivityView}
          userRole={userRoleSim}
          activeActivityDetails={activityDetailsSim}
        />
      )}

      {/* Temporary button to toggle user role for simulation */}
      {isClient && (
         <Button 
            variant="outline" 
            size="sm"
            onClick={toggleUserRole} 
            className="fixed bottom-5 left-5 z-50 bg-card shadow-lg"
            aria-label="Toggle user role for simulation"
          >
            {userRoleSim === 'driver' ? <UserCog className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
            Role: {userRoleSim || 'None'}
          </Button>
      )}
    </div>
  );
}
