
"use client";
import React, { useState, useEffect } from 'react';
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
    setActiveTab('login'); // Navigate to login after registration
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

  useEffect(() => {
    if (isLoggedIn) {
      setIsFabVisible(true);
    } else {
      setIsFabVisible(false);
      setIsActiveActivityViewVisible(false);
      setActivityDetails(null);
    }
  }, [isLoggedIn]);

  const handleFabClick = () => {
    if (!isLoggedIn) return;

    if (isDriverOnlineSim && !activityDetails?.type) {
      setIsActiveActivityViewVisible(true);
      setActivityDetails({
        type: 'driver_status',
        status: 'Online, awaiting requests...',
      });
      return;
    }
    
    setActivityDetails({
      type: 'ride',
      status: 'Looking for driver...',
      pickup: 'Rider Pickup Point',
      dropoff: 'Rider Destination Point',
    });
    setIsActiveActivityViewVisible(true);
    toast({ title: "Ride Requested", description: "Searching for drivers." });

    setTimeout(() => {
      if (activityDetails?.type === 'ride' && activityDetails?.status === 'Looking for driver...') {
        setActivityDetails(prev => ({
          ...prev,
          type: 'ride',
          status: 'Driver Assigned',
          driverName: 'Sim Driver',
          vehicle: 'Cool Car - XX00YZ0000',
        }));
        toast({ title: "Driver Found!", description: "Your ride is on the way." });
      }
    }, 6000);
  };
  
  useEffect(() => {
    let requestTimeout: NodeJS.Timeout;
    // This simulation for driver going online and getting a request will eventually
    // be triggered by actions within UserVehiclesScreen (e.g., activating a vehicle)
    if (isLoggedIn && !isDriverOnlineSim && !activityDetails && !isActiveActivityViewVisible) {
      const onlineTimer = setTimeout(() => {
        if(isLoggedIn && !activityDetails && !isActiveActivityViewVisible) {
            setIsDriverOnlineSim(true); // Simulate driver going online
            toast({ title: "You are Online (Driver Sim)", description: "Waiting for ride requests. This will be triggered by vehicle activation later." });

            requestTimeout = setTimeout(() => {
                if (isDriverOnlineSim && !activityDetails?.type && isLoggedIn) {
                  setActivityDetails({
                      type: 'request',
                      riderName: 'Simulated User',
                      pickup: '123 Frontend St',
                      dropoff: '456 Backend Ave',
                      fare: '₹180',
                  });
                  setIsActiveActivityViewVisible(true);
                  toast({ title: "New Ride Request! (Driver Sim)", description: "A user needs a ride." });
                }
            }, 8000);
        }
      }, 5000);
      return () => {
        clearTimeout(onlineTimer);
        clearTimeout(requestTimeout);
      };
    }
  }, [isLoggedIn, isDriverOnlineSim, activityDetails, isActiveActivityViewVisible]);


  const handleCloseActivityView = () => {
    setIsActiveActivityViewVisible(false);
    if (activityDetails?.type === 'request' || activityDetails?.type === 'driver_status') {
      setActivityDetails(null);
    }
  };

  useEffect(() => {
    if (isActiveActivityViewVisible && activityDetails?.type === 'request') {
      const timer = setTimeout(() => {
        if (activityDetails?.type === 'request' && isLoggedIn) {
            setActivityDetails({
              type: 'ride',
              status: 'en_route', // Driver accepts and is en_route to rider
              riderName: activityDetails.riderName,
              pickup: activityDetails.pickup,
              dropoff: activityDetails.dropoff,
              fare: activityDetails.fare,
            });
            toast({ title: "Ride Accepted (Auto-Simulated)", description: "Proceed to pickup location." });
        }
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isActiveActivityViewVisible, activityDetails, isLoggedIn]);


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
      case 'menu': return <ServicesScreen setActiveTab={handleTabSelection} />;
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
        />
      )}
      
      {isClient && showMessagesNotifications && (
        <MessagesNotificationsScreen onClose={() => setShowMessagesNotifications(false)} />
      )}
    </div>
  );
}
