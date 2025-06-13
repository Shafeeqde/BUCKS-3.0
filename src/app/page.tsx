
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import SideMenu from '@/components/layout/SideMenu';
import LoginScreen from '@/components/screens/LoginScreen';
import RegistrationScreen from '@/components/screens/RegistrationScreen';
import HomeScreen from '@/components/screens/HomeScreen';
import FeedsScreen from '@/components/screens/FeedsScreen';
import ServicesScreen from '@/components/screens/ServicesScreen';
import RecommendedScreen from '@/components/screens/RecommendedScreen';
import AccountScreen from '@/components/screens/AccountScreen';
import UserSkillsetsScreen from '@/components/screens/UserSkillsetsScreen';
import UserVehiclesScreen from '@/components/screens/UserVehiclesScreen';
import UserBusinessProfilesScreen from '@/components/screens/UserBusinessProfilesScreen';
import UserBusinessProfileDetailScreen from '@/components/screens/UserBusinessProfileDetailScreen';
import MessagesNotificationsScreen from '@/components/screens/MessagesNotificationsScreen';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ActiveActivityView from '@/components/activity/ActiveActivityView';
import type { TabName, UserBusinessProfile, ActivityDetails } from '@/types';
import { useToast } from "@/hooks/use-toast";


const initialBusinessProfiles: UserBusinessProfile[] = [
  {
    id: 1,
    name: 'Hot Griddle Restaurant',
    logo: 'https://placehold.co/80x80.png', logoAiHint: 'restaurant logo',
    coverPhoto: 'https://placehold.co/600x200.png', coverPhotoAiHint: 'restaurant food',
    followers: 567,
    following: 380,
    bio: 'International, locally sourced specialties, breakfast & mocktails offered in a relaxed restaurant.',
    website: 'https://hotgriddle.in/',
    phone: '+91 9876543210',
    location: 'Bangalore, Karnataka',
    specialties: ['International Cuisine', 'Local Specialties', 'Breakfast', 'Mocktails'],
    isActive: true,
    feed: [
      { id: 1, content: 'Exciting new menu items just dropped!', image: 'https://placehold.co/300x200.png', imageAiHint: 'menu item', timestamp: '2 hours ago' },
      { id: 2, content: 'Happy Hour extended!', timestamp: '1 day ago' },
    ],
    products: [
      { id: 101, name: 'Biryani', price: '250', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'biryani dish' },
      { id: 102, name: 'Pizza', price: '350', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'pizza slice' },
    ],
    services: ['Dine-in', 'Takeaway', 'Catering', 'Home Delivery'],
    jobs: [
      { id: 1, title: 'Head Chef', location: 'Bangalore', type: 'Full-time', postedDate: '2024-05-20' },
    ]
  },
  {
    id: 2,
    name: 'Mikado UX UI & Branding Studio',
    logo: 'https://placehold.co/80x80.png', logoAiHint: 'design studio',
    coverPhoto: 'https://placehold.co/600x200.png', coverPhotoAiHint: 'modern office',
    followers: 5600,
    following: 120,
    bio: 'Curating digital experiences that connect with people. Global branding and user experience design consultancy.',
    website: 'http://www.mikado.biz',
    phone: '+91 8197278080',
    location: 'Bengaluru, Karnataka',
    specialties: ['User Experience Design', 'Product Design', 'Branding'],
    isActive: true,
    feed: [], products: [], services: ['UI/UX Consulting', 'Brand Strategy'], jobs: []
  },
];


export default function AppRoot() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [activeTab, setActiveTab] = useState<TabName>('login');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMessagesNotifications, setShowMessagesNotifications] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [businessProfiles, setBusinessProfiles] = useState<UserBusinessProfile[]>(initialBusinessProfiles);
  const [selectedBusinessProfileId, setSelectedBusinessProfileId] = useState<string | number | null>(null);

  const [isFabVisible, setIsFabVisible] = useState(false);
  const [isActiveActivityViewVisible, setIsActiveActivityViewVisible] = useState(false);
  const [activityDetails, setActivityDetails] = useState<ActivityDetails>(null);
  const [isDriverOnlineSim, setIsDriverOnlineSim] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLoginSuccess = (user: any) => {
    setIsLoggedIn(true);
    setUserData(user);
    setActiveTab('home');
    toast({ title: "Login Successful", description: `Welcome back, ${user.name || 'User'}!` });
  };

  const handleRegistrationSuccess = (user: any) => {
    setActiveTab('login'); 
    toast({ title: "Registration Complete!", description: `Welcome, ${user.name}! Please log in.` });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setActiveTab('login');
    setShowSideMenu(false);
    setIsFabVisible(false);
    setIsActiveActivityViewVisible(false);
    setActivityDetails(null);
    setIsDriverOnlineSim(false);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const handleTabSelection = (tab: TabName) => {
    setActiveTab(tab);
    setShowSideMenu(false);
    if (tab !== 'business-detail') {
        setSelectedBusinessProfileId(null);
    }
  };

  const handleSelectBusinessProfile = (profileId: string | number) => {
    setSelectedBusinessProfileId(profileId);
    setActiveTab('business-detail');
    setShowSideMenu(false);
  };

  const handleBackFromBusinessDetail = () => {
    setActiveTab('business-profiles');
    setSelectedBusinessProfileId(null);
  };

  const handleRideRequest = useCallback((rideData: { pickup: string; dropoff: string; vehicleId: string }) => {
      console.log('Ride request received in page.tsx:', rideData);
      setActivityDetails({
          type: 'ride',
          status: 'Looking for driver...',
          pickup: rideData.pickup,
          dropoff: rideData.dropoff,
          // vehicleId: rideData.vehicleId, // Store if needed for rider view
      });
      setIsActiveActivityViewVisible(true);
      toast({ title: "Ride Requested", description: "Searching for drivers." });

      setTimeout(() => {
          setActivityDetails(prev => {
            if (prev?.type === 'ride' && prev?.status === 'Looking for driver...') {
              console.log("Simulating driver found for rider");
              return {
                ...prev,
                status: 'Driver Assigned',
                driverName: 'Sim Driver',
                vehicle: 'Cool Car - XX00YZ0000',
              };
            }
            return prev;
          });
           toast({ title: "Driver Found!", description: "Your ride is on the way." });
      }, 6000);
  }, [toast]); // Removed activityDetails from deps to avoid stale closure issues with the timeout check

  useEffect(() => {
    if (isLoggedIn && (isDriverOnlineSim || activityDetails)) {
        setIsFabVisible(true);
    } else {
        setIsFabVisible(false);
        if (!activityDetails) {
             setIsActiveActivityViewVisible(false);
        }
    }
  }, [isLoggedIn, isDriverOnlineSim, activityDetails]);

  const handleFabClick = () => {
    if (!isLoggedIn) return;

    if (isDriverOnlineSim && !activityDetails) {
         setIsActiveActivityViewVisible(true);
         setActivityDetails({
            type: 'driver_status',
            status: 'Online, awaiting requests...',
         });
         return;
    }
    
     if (activityDetails) {
         setIsActiveActivityViewVisible(true);
     }
  };
  
  // Simulate driver going online and receiving a request
  useEffect(() => {
    let onlineTimer: NodeJS.Timeout;
    let requestTimeout: NodeJS.Timeout;
    if (isLoggedIn && !isDriverOnlineSim && !activityDetails && !isActiveActivityViewVisible) {
      onlineTimer = setTimeout(() => {
        if(isLoggedIn && !isDriverOnlineSim && !activityDetails && !isActiveActivityViewVisible) {
            console.log("Simulating driver going online");
            setIsDriverOnlineSim(true);
            toast({ title: "You are Online (Driver Sim)", description: "Waiting for ride requests." });

            requestTimeout = setTimeout(() => {
                if (isDriverOnlineSim && !activityDetails?.type && isLoggedIn) {
                  console.log("Simulating driver receiving request");
                  setActivityDetails({
                      type: 'request',
                      riderName: 'Simulated User',
                      pickup: '123 Frontend St',
                      dropoff: '456 Backend Ave',
                      fare: '₹180',
                      vehicleType: 'Car (Mini)', // Rider's preferred vehicle type for the request
                      distance: '5 km',      // Estimated distance for the request
                  });
                  toast({ title: "New Ride Request! (Driver Sim)", description: "A user needs a ride." });
                }
            }, 8000); // 8 seconds after going online
        }
      }, 5000); // 5 seconds after login (if conditions met)
      return () => {
        clearTimeout(onlineTimer);
        clearTimeout(requestTimeout);
      };
    }
  }, [isLoggedIn, isDriverOnlineSim, activityDetails, isActiveActivityViewVisible, toast]);


  const handleCloseActivityView = () => {
    setIsActiveActivityViewVisible(false);
    if (activityDetails?.type === 'request' || activityDetails?.type === 'driver_status') {
      setActivityDetails(null);
    }
  };

  // Auto-open Active Activity View for Driver Requests
  useEffect(() => {
    if (isLoggedIn && activityDetails?.type === 'request' && !isActiveActivityViewVisible) {
        setIsActiveActivityViewVisible(true);
    }
  }, [isLoggedIn, activityDetails, isActiveActivityViewVisible]);

  // --- Action Handlers for ActiveActivityView ---
  const handleAcceptRequest = useCallback(() => {
      console.log("Driver accepted request (Simulated)");
      if (activityDetails?.type === 'request') {
          setActivityDetails(prevDetails => ({
              ...prevDetails,
              type: 'ride', 
              status: 'en_route', 
              vehicle: `Driver's ${prevDetails.vehicleType || 'Car'} - DRV123`, // Use requested type or default
          }));
          toast({ title: "Ride Accepted", description: "Proceed to pickup location." });
      }
  }, [activityDetails, toast]);

  const handleRejectRequest = useCallback(() => {
      console.log("Driver rejected request (Simulated)");
      setActivityDetails(null);
      setIsActiveActivityViewVisible(false);
      toast({ title: "Request Rejected", description: "You rejected the ride request." });
  }, [toast]);

  const handleArrivedAtPickup = useCallback(() => {
      console.log("Driver arrived at pickup (Simulated)");
      if (activityDetails?.type === 'ride' && (activityDetails.driverName || activityDetails.status === 'en_route')) { // Check if it's a driver's ride
          setActivityDetails(prev => prev ? ({ ...prev, status: 'arrived' }) : null);
          toast({ title: "Arrived", description: "You have arrived at the pickup location." });
      }
  }, [activityDetails, toast]);

  const handleStartRide = useCallback(() => {
      console.log("Driver started ride (Simulated)");
      if (activityDetails?.type === 'ride' && (activityDetails.driverName || activityDetails.status === 'arrived')) {
          setActivityDetails(prev => prev ? ({ ...prev, status: 'on_the_way' }) : null);
          toast({ title: "Ride Started", description: "Ride in progress." });
      }
  }, [activityDetails, toast]);

  const handleEndRide = useCallback(() => {
      console.log("Driver/Rider ended ride (Simulated)");
      if (activityDetails?.type === 'ride') {
          setActivityDetails(prev => prev ? ({ ...prev, status: 'completed' }) : null);
          toast({ title: "Ride Completed", description: "Ride has ended." });
          setTimeout(() => {
              setActivityDetails(null);
              setIsActiveActivityViewVisible(false);
          }, 3000);
      }
  }, [activityDetails, toast]);
  
  const handleCancelRide = useCallback(() => {
      console.log("Ride cancelled (Simulated)");
      if (activityDetails?.type === 'ride' || activityDetails?.type === 'request') {
        setActivityDetails(prev => prev ? ({ ...prev, status: 'cancelled' }) : null);
        toast({ title: "Ride Cancelled", description: "The ride has been cancelled." });
        setTimeout(() => {
            setActivityDetails(null);
            setIsActiveActivityViewVisible(false);
        }, 3000);
      }
  }, [activityDetails, toast]);

  const handleContactDriver = useCallback(() => {
      console.log("Contact Driver (Simulated)");
      toast({ title: "Contacting Driver", description: "Simulating contact..." });
  }, [toast]);

  const handleGoOffline = useCallback(() => {
      console.log("Driver going offline (Simulated)");
      setIsDriverOnlineSim(false);
      setActivityDetails(null);
      setIsActiveActivityViewVisible(false);
      toast({ title: "Offline", description: "You are now offline." });
  }, [toast]);

  // Simulate Driver Auto-Accepting Request
  useEffect(() => {
    let autoAcceptTimer: NodeJS.Timeout;
    if (isActiveActivityViewVisible && activityDetails?.type === 'request' && isLoggedIn) {
      autoAcceptTimer = setTimeout(() => {
        // Ensure it's still a request and user is logged in before auto-accepting
        if (activityDetails?.type === 'request' && isLoggedIn) {
            console.log("Simulating driver auto-accept");
            handleAcceptRequest();
        }
      }, 7000); 
      return () => clearTimeout(autoAcceptTimer);
    }
  }, [isActiveActivityViewVisible, activityDetails, isLoggedIn, handleAcceptRequest]);


  const renderScreenContent = () => {
    if (!isClient) return null;

    if (!isLoggedIn) {
      if (activeTab === 'registration') {
        return <RegistrationScreen setActiveTab={setActiveTab} onRegistrationSuccess={handleRegistrationSuccess} />;
      }
      return <LoginScreen setActiveTab={setActiveTab} onLoginSuccess={handleLoginSuccess} />;
    }

    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'feeds': return <FeedsScreen />;
      case 'menu': 
        return <ServicesScreen setActiveTab={handleTabSelection} onRequestRide={handleRideRequest} />;
      case 'recommended': return <RecommendedScreen />;
      case 'account': return <AccountScreen onLogout={handleLogout} />;
      case 'skillsets': return <UserSkillsetsScreen />;
      case 'vehicles': return <UserVehiclesScreen setActiveTab={handleTabSelection} />;
      case 'business-profiles': return (
        <UserBusinessProfilesScreen
          businessProfiles={businessProfiles}
          onSelectProfile={handleSelectBusinessProfile}
        />
      );
      case 'business-detail':
        const selectedProfile = businessProfiles.find(p => p.id === selectedBusinessProfileId);
        return <UserBusinessProfileDetailScreen profile={selectedProfile} onBack={handleBackFromBusinessDetail} />;
      default: return <HomeScreen />;
    }
  };
  
  if (!isClient) {
    return (
      <div className="flex flex-col h-screen bg-background items-center justify-center">
        <p>Loading App...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        onMenuClick={() => setShowSideMenu(true)}
        onMessagesClick={() => setShowMessagesNotifications(true)}
        unreadCount={isLoggedIn ? 5 : 0} 
      />

      {isLoggedIn && (
        <SideMenu
          isOpen={showSideMenu}
          onClose={() => setShowSideMenu(false)}
          activeTab={activeTab}
          setActiveTab={handleTabSelection}
          businessProfiles={businessProfiles}
          onSelectBusinessProfile={handleSelectBusinessProfile}
          onLogout={handleLogout}
        />
      )}
      
      <div className="flex-grow overflow-hidden relative">
        {renderScreenContent()}
      </div>

      {isLoggedIn && (
        <BottomNavigation activeTab={activeTab} setActiveTab={handleTabSelection} />
      )}

      {isClient && isLoggedIn && isFabVisible && (
        <FloatingActionButton onClick={handleFabClick} />
      )}

      {isClient && isLoggedIn && isActiveActivityViewVisible && (
        <ActiveActivityView
          isVisible={isActiveActivityViewVisible}
          onClose={handleCloseActivityView}
          userRole={
            activityDetails?.type === 'request' ? 'driver' : 
            (activityDetails?.type === 'ride' ? (activityDetails.driverName ? 'rider' : 'driver') : 
            (activityDetails?.type === 'driver_status' ? 'driver' : null))
          }
          activeActivityDetails={activityDetails}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
          onArrivedAtPickup={handleArrivedAtPickup}
          onStartRide={handleStartRide}
          onEndRide={handleEndRide}
          onCancelRide={handleCancelRide}
          onContactDriver={handleContactDriver}
          onGoOffline={handleGoOffline}
        />
      )}
      
      {isClient && showMessagesNotifications && (
        <MessagesNotificationsScreen onClose={() => setShowMessagesNotifications(false)} />
      )}
    </div>
  );
}

