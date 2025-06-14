
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
import IndividualProfileScreen from '@/components/screens/IndividualProfileScreen';
import SkillsetProfileScreen from '@/components/screens/SkillsetProfileScreen';
import SkillsetProfileManagementScreen from '@/components/screens/SkillsetProfileManagementScreen';


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
  
  const [selectedIndividualProfileId, setSelectedIndividualProfileId] = useState<string | null>(null);
  const [selectedSkillsetProfileId, setSelectedSkillsetProfileId] = useState<string | null>(null);
  const [skillsetProfileToManageId, setSkillsetProfileToManageId] = useState<string | null>(null);


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
    setSelectedBusinessProfileId(null);
    setSelectedIndividualProfileId(null);
    setSelectedSkillsetProfileId(null);
    setSkillsetProfileToManageId(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const handleTabSelection = (tab: TabName) => {
    setActiveTab(tab);
    setShowSideMenu(false);
    if (tab !== 'business-detail' && tab !== 'individual-profile' && tab !== 'skillset-profile' && tab !== 'manage-skillset-profile') {
        setSelectedBusinessProfileId(null);
        setSelectedIndividualProfileId(null);
        setSelectedSkillsetProfileId(null);
        setSkillsetProfileToManageId(null);
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
  
  const handleSelectIndividualProfile = (profileId: string) => {
    setSelectedIndividualProfileId(profileId);
    setActiveTab('individual-profile');
    setShowSideMenu(false);
  };

  const handleSelectSkillsetProfile = (skillsetProfileId: string) => {
    setSelectedSkillsetProfileId(skillsetProfileId);
    setActiveTab('skillset-profile');
    setShowSideMenu(false);
  };

  const handleManageSkillsetProfile = (skillsetProfileId: string) => {
    setSkillsetProfileToManageId(skillsetProfileId);
    setActiveTab('manage-skillset-profile');
    setShowSideMenu(false);
  };

  const handleBackFromManageSkillsetProfile = () => {
    setSkillsetProfileToManageId(null);
    setActiveTab('user-skillsets');
  };


  const handleRideRequest = useCallback((rideData: { pickup: string; dropoff: string; vehicleId: string }) => {
      console.log('Ride request received in page.tsx:', rideData);
      setActivityDetails({
          type: 'ride',
          status: 'Looking for driver...',
          pickup: rideData.pickup,
          dropoff: rideData.dropoff,
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
  }, [toast]);

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
  
  useEffect(() => {
    console.log('[Driver Sim Effect] Running. State:', { isLoggedIn, isDriverOnlineSim, activityDetailsType: activityDetails?.type, isActiveActivityViewVisible });
    let onlineTimer: NodeJS.Timeout;
    let requestTimeout: NodeJS.Timeout;

    if (isLoggedIn && !isDriverOnlineSim && !activityDetails && !isActiveActivityViewVisible) {
      console.log('[Driver Sim Effect] Condition 1 MET. Starting onlineTimer (5s).');
      onlineTimer = setTimeout(() => {
        console.log('[Driver Sim Effect] onlineTimer FIRED. Re-checking conditions. State:', { isLoggedIn, isDriverOnlineSim, activityDetailsType: activityDetails?.type, isActiveActivityViewVisible });
        if(isLoggedIn && !isDriverOnlineSim && !activityDetails && !isActiveActivityViewVisible) { 
            console.log('[Driver Sim Effect] Condition 2 MET. Simulating driver going online.');
            setIsDriverOnlineSim(true);
            toast({ title: "You are Online (Driver Sim)", description: "Waiting for ride requests." });

            console.log('[Driver Sim Effect] Starting requestTimeout (8s).');
            requestTimeout = setTimeout(() => {
              console.log('[Driver Sim Effect] requestTimeout FIRED. Checking conditions for request. State:', { isLoggedIn, isDriverOnlineSim, activityDetailsType: activityDetails?.type });
              if (isDriverOnlineSim && (!activityDetails?.type || activityDetails?.type === 'driver_status') && isLoggedIn) { 
                  console.log('[Driver Sim Effect] Condition 3 MET. Simulating driver receiving request.');
                  setActivityDetails({
                      type: 'request',
                      riderName: 'Simulated User',
                      pickup: '123 Frontend St',
                      dropoff: '456 Backend Ave',
                      fare: '₹180',
                      vehicleType: 'Car (Mini)', 
                      distance: '5 km',      
                  });
                  toast({ title: "New Ride Request! (Driver Sim)", description: "A user needs a ride." });
              } else {
                console.log('[Driver Sim Effect] Condition 3 FAILED for simulating request. Details:', {
                    isDriverOnlineSim,
                    isLoggedIn,
                    activityDetailsType: activityDetails?.type,
                    isCorrectActivityType: (!activityDetails?.type || activityDetails?.type === 'driver_status')
                });
              }
            }, 8000);
        } else {
          console.log('[Driver Sim Effect] Condition 2 FAILED for going online. Details:', {
            isLoggedIn,
            isDriverOnlineSim,
            activityDetailsPresent: !!activityDetails,
            isActiveActivityViewVisible
          });
        }
      }, 5000);
    } else {
      console.log('[Driver Sim Effect] Condition 1 FAILED. Not starting onlineTimer. Details:', {
        isLoggedIn,
        isDriverOnlineSim,
        activityDetailsPresent: !!activityDetails,
        isActiveActivityViewVisible
      });
    }

    return () => {
      console.log('[Driver Sim Effect] Cleanup. Clearing timers.');
      clearTimeout(onlineTimer);
      clearTimeout(requestTimeout);
    };
  }, [isLoggedIn, isDriverOnlineSim, activityDetails, isActiveActivityViewVisible, toast]);


  const handleCloseActivityView = () => {
    setIsActiveActivityViewVisible(false);
    if (activityDetails?.type === 'request' || activityDetails?.type === 'driver_status') {
      if (activityDetails?.status !== 'en_route' && activityDetails?.status !== 'arrived' && activityDetails?.status !== 'on_the_way') {
         setActivityDetails(null);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn && activityDetails?.type === 'request' && !isActiveActivityViewVisible) {
        setIsActiveActivityViewVisible(true);
    }
  }, [isLoggedIn, activityDetails, isActiveActivityViewVisible]);

  const handleAcceptRequest = useCallback(() => {
      console.log("Driver accepted request (Simulated)");
      if (activityDetails?.type === 'request') {
          setActivityDetails(prevDetails => {
            if (!prevDetails || prevDetails.type !== 'request') return prevDetails; 
            return {
              type: 'ride', 
              status: 'en_route', 
              riderName: prevDetails.riderName,
              pickup: prevDetails.pickup,
              dropoff: prevDetails.dropoff,
              fare: prevDetails.fare,
              vehicle: `My ${prevDetails.vehicleType || 'Car'} - SIM123`, 
            };
          });
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
      if (activityDetails?.type === 'ride' && (activityDetails.status === 'en_route' && !activityDetails.driverName)) { 
          setActivityDetails(prev => prev ? ({ ...prev, status: 'arrived' }) : null);
          toast({ title: "Arrived", description: "You have arrived at the pickup location." });
      }
  }, [activityDetails, toast]);

  const handleStartRide = useCallback(() => {
      console.log("Driver started ride (Simulated)");
      if (activityDetails?.type === 'ride' && (activityDetails.status === 'arrived' && !activityDetails.driverName)) { 
          setActivityDetails(prev => prev ? ({ ...prev, status: 'on_the_way' }) : null);
          toast({ title: "Ride Started", description: "Ride in progress." });
      }
  }, [activityDetails, toast]);

  const handleEndRide = useCallback(() => {
      console.log("Driver/Rider ended ride (Simulated)");
      if (activityDetails?.type === 'ride') {
          const currentRole = activityDetails.driverName ? 'rider' : 'driver';
          toast({ title: "Ride Completed", description: `Ride has ended. (${currentRole} perspective)` });
          setActivityDetails(prev => prev ? ({ ...prev, status: 'completed' }) : null);
          setTimeout(() => {
              setActivityDetails(null);
              setIsActiveActivityViewVisible(false);
          }, 3000);
      }
  }, [activityDetails, toast]);
  
  const handleCancelRide = useCallback(() => {
      console.log("Ride cancelled (Simulated)");
      if (activityDetails?.type === 'ride' || activityDetails?.type === 'request') {
        const currentRole = activityDetails.driverName ? 'rider' : (activityDetails.type === 'ride' ? 'driver' : 'driver');
        toast({ title: "Ride Cancelled", description: `The ride has been cancelled. (${currentRole} perspective)` });
        setActivityDetails(prev => prev ? ({ ...prev, status: 'cancelled' }) : null);
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

  useEffect(() => {
    let autoAcceptTimer: NodeJS.Timeout;
    if (isActiveActivityViewVisible && activityDetails?.type === 'request' && isLoggedIn && (!activityDetails?.driverName)) { 
      console.log("Setting up auto-accept timer for driver's request view.");
      autoAcceptTimer = setTimeout(() => {
        if (activityDetails?.type === 'request' && isLoggedIn && (!activityDetails?.driverName)) {
            console.log("Simulating driver auto-accept due to timeout.");
            handleAcceptRequest();
        }
      }, 7000); 
      return () => {
        console.log("Clearing auto-accept timer.");
        clearTimeout(autoAcceptTimer);
      }
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
      case 'home': return <HomeScreen 
                            onSelectIndividualProfile={handleSelectIndividualProfile} 
                            onSelectSkillsetProfile={handleSelectSkillsetProfile}
                         />;
      case 'feeds': return <FeedsScreen />;
      case 'menu': return <ServicesScreen setActiveTab={handleTabSelection} onRequestRide={handleRideRequest} />;
      case 'recommended': return <RecommendedScreen />;
      case 'account': return <AccountScreen onLogout={handleLogout} userData={userData} />;
      case 'user-skillsets': return (
                            <UserSkillsetsScreen 
                                setActiveTab={handleTabSelection} 
                                onManageSkillsetProfile={handleManageSkillsetProfile} 
                            />
                        );
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
      
      case 'individual-profile': 
        if (selectedIndividualProfileId === "currentUser" && userData) {
             return <IndividualProfileScreen currentUserData={userData} setActiveTab={handleTabSelection} />;
        } else if (selectedIndividualProfileId) {
             return <IndividualProfileScreen profileId={selectedIndividualProfileId} setActiveTab={handleTabSelection} />;
        }
        return <p className="p-4 text-center text-muted-foreground">No individual profile selected or user data missing.</p>;


      case 'skillset-profile':
        if (selectedSkillsetProfileId) {
          return <SkillsetProfileScreen skillsetProfileId={selectedSkillsetProfileId} setActiveTab={handleTabSelection} />;
        }
        return <p className="p-4 text-center text-muted-foreground">No skillset profile selected.</p>; 

      case 'manage-skillset-profile':
        if (skillsetProfileToManageId) {
          return (
            <SkillsetProfileManagementScreen
              skillsetProfileId={skillsetProfileToManageId}
              setActiveTab={handleTabSelection}
              onBack={handleBackFromManageSkillsetProfile}
            />
          );
        }
        return <p className="p-4 text-center text-muted-foreground">No skillset profile selected for management.</p>; 

      default: return <HomeScreen onSelectIndividualProfile={handleSelectIndividualProfile} onSelectSkillsetProfile={handleSelectSkillsetProfile} />;
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

