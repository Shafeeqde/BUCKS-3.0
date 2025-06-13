
"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import SideMenu from '@/components/layout/SideMenu';
import LoginScreen from '@/components/screens/LoginScreen';
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
import type { TabName, UserBusinessProfile, UserSkill, UserVehicle } from '@/types';
import { useToast } from "@/hooks/use-toast";
// Removed User, UserCog imports as SimRole button is removed
// import { Button } from '@/components/ui/button'; // No longer needed for SimRole button

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
      { id: 101, name: 'Biryani', price: 250, imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'biryani dish' },
      { id: 102, name: 'Pizza', price: 350, imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'pizza slice' },
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
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>('login');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMessagesNotifications, setShowMessagesNotifications] = useState(false);
  const [selectedBusinessProfileId, setSelectedBusinessProfileId] = useState<string | number | null>(null);
  const [businessProfiles, setBusinessProfiles] = useState<UserBusinessProfile[]>(initialBusinessProfiles);

  const { toast } = useToast();

  // Removed userRoleSim state
  const [isFabVisibleSim, setIsFabVisibleSim] = useState(false);
  const [isActivityViewVisibleSim, setIsActivityViewVisibleSim] = useState(false);
  const [activityDetailsSim, setActivityDetailsSim] = useState<ActivityDetails>(null);
  const [isDriverOnlineSim, setIsDriverOnlineSim] = useState(false); // This state remains for driver auto-request simulation


  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = () => { // Removed simulatedRole parameter
    setIsLoggedIn(true);
    // setUserRoleSim(simulatedRole); // Removed
    setActiveTab('home');
    toast({ title: "Login Successful", description: "Welcome!" }); // Simplified message
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // setUserRoleSim(null); // Removed
    setActiveTab('login');
    setShowSideMenu(false);
    setIsFabVisibleSim(false);
    setIsActivityViewVisibleSim(false);
    setActivityDetailsSim(null);
    setIsDriverOnlineSim(false); // Reset driver online status
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const handleTabSelection = (tab: TabName) => {
    setActiveTab(tab);
    setShowSideMenu(false);
    setSelectedBusinessProfileId(null); 
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

  // FAB visibility logic updated
  useEffect(() => {
    if (isLoggedIn) {
      setIsFabVisibleSim(true); // FAB visible if logged in
    } else {
      setIsFabVisibleSim(false);
    }
  }, [isLoggedIn]);

  const handleFabClick = () => {
    if (!isLoggedIn) return;

    // If driver is online (simulated background state), show current activity
    if (isDriverOnlineSim) {
        setIsActivityViewVisibleSim(true); // Show current status or request
        return;
    }

    // Default FAB click action: Rider requests a ride
    setActivityDetailsSim({
      type: 'ride',
      status: 'Looking for driver...',
      pickup: 'Rider Pickup Point',
      dropoff: 'Rider Destination Point',
    });
    setIsActivityViewVisibleSim(true);
    toast({ title: "Ride Requested", description: "Searching for drivers." });

    // Simulate finding a driver
    setTimeout(() => {
      // Check if still in rider requesting mode
      if (activityDetailsSim?.type === 'ride' && activityDetailsSim?.status === 'Looking for driver...') {
        setActivityDetailsSim(prev => ({
          ...prev,
          type: 'ride', // ensure type remains 'ride'
          status: 'Driver Assigned',
          driverName: 'Sim Driver',
          vehicle: 'Cool Car - XX00YZ0000',
        }));
        toast({ title: "Driver Found!", description: "Your ride is on the way." });
      }
    }, 6000);
  };

  // Simulate Driver going online and receiving a request (can be moved to Vehicle activation later)
  useEffect(() => {
    let requestTimeout: NodeJS.Timeout;
    // This effect simulates a driver "going online" implicitly after login for now
    // and then receiving a request. This can be tied to vehicle activation later.
    if (isLoggedIn && !isDriverOnlineSim && !activityDetailsSim) { // Simulate driver coming online if not already and no activity
      const onlineTimer = setTimeout(() => {
        if(isLoggedIn && !activityDetailsSim) { // Check again before setting driver online
            setIsDriverOnlineSim(true);
            setActivityDetailsSim(null); // No specific ride yet, just online
            setIsActivityViewVisibleSim(false); // Don't show modal just for being online, unless FAB is clicked
            toast({ title: "You are Online (Driver Sim)", description: "Waiting for ride requests." });

            // Then simulate receiving a request
            requestTimeout = setTimeout(() => {
                if (isDriverOnlineSim && !activityDetailsSim?.type) { // If still online and no active ride/request
                setActivityDetailsSim({
                    type: 'request',
                    riderName: 'Simulated User',
                    pickup: '123 Frontend St',
                    dropoff: '456 Backend Ave',
                    fare: '₹180',
                });
                setIsActivityViewVisibleSim(true);
                toast({ title: "New Ride Request! (Driver Sim)", description: "A user needs a ride." });
                }
            }, 8000); // Increased delay for request after going online
        }
      }, 5000); // Delay for "going online"
      return () => {
        clearTimeout(onlineTimer);
        clearTimeout(requestTimeout);
      };
    }
  }, [isLoggedIn, isDriverOnlineSim, activityDetailsSim]);


  const handleCloseActivityView = () => {
    setIsActivityViewVisibleSim(false);
    // If a driver request was showing, closing it means they didn't accept/reject, so clear it
    if (activityDetailsSim?.type === 'request') {
      setActivityDetailsSim(null); 
      // setIsDriverOnlineSim(true); // Driver remains online
    }
    // Rider cancelling or ride ending would be handled by buttons inside the view
  };

  // Simulate driver "accepting" a request automatically
  useEffect(() => {
    if (isActivityViewVisibleSim && activityDetailsSim?.type === 'request') {
      const timer = setTimeout(() => {
         // Check if still a request, meaning it wasn't closed/handled
        if (activityDetailsSim?.type === 'request') {
            setActivityDetailsSim({
            type: 'ride', // Change type to 'ride' as it's now an active ride for the driver
            status: 'en_route',
            riderName: activityDetailsSim.riderName,
            pickup: activityDetailsSim.pickup,
            dropoff: activityDetailsSim.dropoff,
            fare: activityDetailsSim.fare,
            });
            toast({ title: "Ride Accepted (Auto-Simulated)", description: "Proceed to pickup location." });
        }
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isActivityViewVisibleSim, activityDetailsSim]);

  // Removed toggleUserRoleAndRelogin function

  const renderScreenContent = () => {
    if (!isClient) return null;
    if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'feeds': return <FeedsScreen />;
      case 'menu': return <ServicesScreen setActiveTab={handleTabSelection} />;
      case 'recommended': return <RecommendedScreen />;
      case 'account': return <AccountScreen onLogout={handleLogout} />; // Removed userRole prop
      case 'skillsets': return <UserSkillsetsScreen />;
      case 'vehicles': return <UserVehiclesScreen />;
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
      {isLoggedIn && (
        <Header
          onMenuClick={() => setShowSideMenu(true)}
          onMessagesClick={() => setShowMessagesNotifications(true)}
          unreadCount={5} // Simplified example unread count
        />
      )}

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

      {isClient && isLoggedIn && isFabVisibleSim && (
        <FloatingActionButton onClick={handleFabClick} />
      )}

      {isClient && isLoggedIn && (
        <ActiveActivityView
          isVisible={isActivityViewVisibleSim}
          onClose={handleCloseActivityView}
          // Determine userRole for view based on activity type
          userRole={activityDetailsSim?.type === 'request' ? 'driver' : (activityDetailsSim?.type === 'ride' ? (activityDetailsSim?.driverName ? 'rider' : 'driver') : null)}
          activeActivityDetails={activityDetailsSim}
        />
      )}
      
      {/* Removed SimRole button */}

      {isClient && showMessagesNotifications && (
        <MessagesNotificationsScreen onClose={() => setShowMessagesNotifications(false)} />
      )}
    </div>
  );
}
