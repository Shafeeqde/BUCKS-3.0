
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
import type { TabName, UserProfile, UserBusinessProfile, UserSkill, UserVehicle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { User, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// Mock Data from user's App.js (simplified for this context)
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

  // Simulated state for FAB and ActiveActivityView (copied from previous version of page.tsx)
  const [userRoleSim, setUserRoleSim] = useState<'rider' | 'driver' | null>(null); // Default to null, set after login
  const [isFabVisibleSim, setIsFabVisibleSim] = useState(false);
  const [isActivityViewVisibleSim, setIsActivityViewVisibleSim] = useState(false);
  const [activityDetailsSim, setActivityDetailsSim] = useState<ActivityDetails>(null);
  const [isDriverOnlineSim, setIsDriverOnlineSim] = useState(false);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = (simulatedRole: 'rider' | 'driver' = 'rider') => {
    setIsLoggedIn(true);
    setUserRoleSim(simulatedRole); // Set user role on login
    setActiveTab('home');
    toast({ title: "Login Successful", description: `Welcome! You are logged in as a ${simulatedRole}.` });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRoleSim(null);
    setActiveTab('login');
    setShowSideMenu(false);
    setIsFabVisibleSim(false);
    setIsActivityViewVisibleSim(false);
    setActivityDetailsSim(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const handleTabSelection = (tab: TabName) => {
    setActiveTab(tab);
    setShowSideMenu(false);
    setSelectedBusinessProfileId(null); // Clear selected business profile when changing main tabs
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

  // FAB and ActivityView Simulation Logic (copied and adapted from previous page.tsx)
  useEffect(() => {
    if (!isLoggedIn) {
      setIsFabVisibleSim(false);
      return;
    }
    if (userRoleSim === 'driver' || userRoleSim === 'rider') {
      setIsFabVisibleSim(true);
    } else {
      setIsFabVisibleSim(false);
    }
  }, [userRoleSim, isLoggedIn]);

  const handleFabClick = () => {
    if (!isLoggedIn) return;
    if (userRoleSim === 'driver') {
      if (!isDriverOnlineSim) {
        setIsDriverOnlineSim(true);
        setActivityDetailsSim(null);
        setIsActivityViewVisibleSim(true);
        toast({ title: "You are now Online", description: "Waiting for ride requests." });
        setTimeout(() => {
          if (userRoleSim === 'driver' && isDriverOnlineSim && !activityDetailsSim?.type) {
            setActivityDetailsSim({
              type: 'request',
              riderName: 'Simulated User',
              pickup: '123 Frontend St',
              dropoff: '456 Backend Ave',
              fare: '₹180',
            });
            setIsActivityViewVisibleSim(true);
            toast({ title: "New Ride Request!", description: "A user needs a ride." });
          }
        }, 5000);
      } else {
        setIsActivityViewVisibleSim(true);
      }
    } else if (userRoleSim === 'rider') {
      setActivityDetailsSim({
        type: 'ride',
        status: 'Looking for driver...',
        pickup: 'Rider Pickup Point',
        dropoff: 'Rider Destination Point',
      });
      setIsActivityViewVisibleSim(true);
      toast({ title: "Ride Requested", description: "Searching for drivers." });
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
    if (activityDetailsSim?.type === 'request') {
      setActivityDetailsSim(null);
    }
  };

  useEffect(() => {
    if (isActivityViewVisibleSim && activityDetailsSim?.type === 'request' && userRoleSim === 'driver') {
      const timer = setTimeout(() => {
        setActivityDetailsSim({
          type: 'ride',
          status: 'en_route',
          riderName: activityDetailsSim.riderName,
          pickup: activityDetailsSim.pickup,
          dropoff: activityDetailsSim.dropoff,
          fare: activityDetailsSim.fare,
        });
        toast({ title: "Ride Accepted (Auto-Simulated)", description: "Proceed to pickup location." });
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isActivityViewVisibleSim, activityDetailsSim, userRoleSim]);

  const toggleUserRoleAndRelogin = () => { // More explicit name
    const newRole = userRoleSim === 'rider' ? 'driver' : 'rider';
    // Simulate logout then login with new role
    setIsLoggedIn(false); // Trigger logout effects
    setUserRoleSim(null);
    setIsFabVisibleSim(false);
    setIsActivityViewVisibleSim(false);
    setActivityDetailsSim(null);
    setIsDriverOnlineSim(false);
    
    // Simulate re-login with new role
    setTimeout(() => {
        handleLogin(newRole);
        setActiveTab('home'); // Reset tab
    }, 100); // Short delay to ensure state resets
  };


  const renderScreenContent = () => {
    if (!isClient) return null; // Or a global loading skeleton
    if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'feeds': return <FeedsScreen />;
      case 'menu': return <ServicesScreen setActiveTab={handleTabSelection} />;
      case 'recommended': return <RecommendedScreen />;
      case 'account': return <AccountScreen onLogout={handleLogout} userRole={userRoleSim}/>; // Pass userRole
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
    // You might want a basic page skeleton here if needed before client hydration
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
          unreadCount={(userRoleSim === 'driver' ? 5 : 2)} // Example unread count
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
          userRole={userRoleSim}
          activeActivityDetails={activityDetailsSim}
        />
      )}
      
      {isClient && isLoggedIn && ( // Button to simulate role toggle for testing
         <Button 
            variant="outline" 
            size="sm"
            onClick={toggleUserRoleAndRelogin} 
            className="fixed bottom-20 left-5 z-50 bg-card shadow-lg" // Adjusted bottom to avoid FAB overlap
            aria-label="Toggle user role for simulation"
          >
            {userRoleSim === 'driver' ? <UserCog className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
            SimRole: {userRoleSim || 'None'}
          </Button>
      )}

      {isClient && showMessagesNotifications && (
        <MessagesNotificationsScreen onClose={() => setShowMessagesNotifications(false)} />
      )}
    </div>
  );
}
