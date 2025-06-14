
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
import BusinessProfileManagementScreen from '@/components/screens/BusinessProfileManagementScreen'; // New import
import MessagesNotificationsScreen from '@/components/screens/MessagesNotificationsScreen';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ActiveActivityView from '@/components/activity/ActiveActivityView';
import IndividualProfileScreen from '@/components/screens/IndividualProfileScreen';
import SkillsetProfileScreen from '@/components/screens/SkillsetProfileScreen';
import SkillsetProfileManagementScreen from '@/components/screens/SkillsetProfileManagementScreen';


import type { TabName, UserBusinessProfile, ActivityDetails } from '@/types';
import { useToast } from "@/hooks/use-toast";


export const initialBusinessProfiles: UserBusinessProfile[] = [
  {
    id: 1,
    name: 'Hot Griddle Restaurant',
    logo: 'https://placehold.co/80x80.png', logoAiHint: 'restaurant logo',
    coverPhoto: 'https://placehold.co/1200x300.png', coverPhotoAiHint: 'restaurant food noodles',
    bio: 'International, locally sourced specialties, breakfast & mocktails offered in a relaxed restaurant. We pride ourselves on fresh ingredients and a vibrant atmosphere perfect for any occasion. Come taste the difference!',
    website: 'https://hotgriddle.in/',
    phone: '+91 9876543210',
    email: 'contact@hotgriddle.in',
    location: 'BTM Layout, Bangalore, Karnataka',
    specialties: ['International Cuisine', 'Local Specialties', 'Breakfast', 'Mocktails', 'Grills', 'Sizzlers'],
    followers: 567,
    following: 380,
    isActive: true,
    feed: [
      { id: 'bf1', content: 'Exciting new menu items just dropped! Come try our new sizzlers and expanded mocktail selection. Photos coming soon!', image: 'https://placehold.co/600x350.png', imageAiHint: 'menu item food', timestamp: '2 hours ago' },
      { id: 'bf2', content: 'Happy Hour extended! Enjoy 20% off on all beverages from 4 PM to 7 PM daily. Bring your friends!', timestamp: '1 day ago' },
      { id: 'bf3', content: 'Weekend special: Live music every Friday and Saturday night! Experience great food with amazing tunes.', image: 'https://placehold.co/600x350.png', imageAiHint: 'live music band', timestamp: '3 days ago' },
    ],
    products: [
      { id: 'prod-biryani-101', name: 'Biryani', price: '₹299', discountPrice: '₹229', discountPercentage: '23%', imageUrl: 'https://placehold.co/100x100.png', imageAiHint: 'biryani food', description: 'Aromatic basmati rice cooked with tender mutton pieces and exotic spices. A house specialty, perfect for a hearty meal.' },
      { id: 'prod-pizza-102', name: 'Pizza', price: '₹350', imageUrl: 'https://placehold.co/100x100.png', imageAiHint: 'pizza slice', description: 'Thin crust pizza topped with spicy chicken, bell peppers, onions, and mozzarella. Customizable toppings available.' },
      { id: 'prod-burger-103', name: 'Burger', price: '₹180', imageUrl: 'https://placehold.co/100x100.png', imageAiHint: 'burger meal', description: 'A delicious veg patty (or chicken option) with fresh lettuce, tomatoes, onions, and our special sauce. Served with fries.' },
      { id: 'prod-sandwich-104', name: 'Sandwich', price: '₹150', imageUrl: 'https://placehold.co/100x100.png', imageAiHint: 'club sandwich', description: 'Classic grilled sandwich with your choice of filling - veg, chicken, or paneer. Perfect for a quick bite.' },
      { id: 'prod-cakes-105', name: 'Cakes', price: '₹450', imageUrl: 'https://placehold.co/100x100.png', imageAiHint: 'chocolate cake', description: 'Delicious cakes for all occasions. Order in advance for custom designs. Slices also available.' },
      { id: 'prod-rolls-106', name: 'Rolls', price: '₹120', imageUrl: 'https://placehold.co/100x100.png', imageAiHint: 'spring rolls', description: 'Crispy and flavorful rolls with various fillings like veg, chicken, or paneer. Served with dipping sauce.' },
    ],
    services: [
        {id: 'serv1', name: 'Dine-in Experience', description: 'Enjoy our comfortable and vibrant restaurant ambiance for a delightful meal with family and friends.', price: 'Varies'},
        {id: 'serv2', name: 'Takeaway & Pickup', description: 'Quick and convenient takeaway options available for all menu items. Call ahead or order online.', price: 'Varies'},
        {id: 'serv3', name: 'Event Catering', description: 'Professional catering services for parties, corporate events, and gatherings. Customizable menus available to suit your needs.', price: 'Starting from ₹500 per person'},
        {id: 'serv4', name: 'Home Delivery (Partnered)', description: 'Get your favorite meals delivered to your doorstep through our delivery partners (Swiggy, Zomato).', price: 'Varies'},
    ],
    jobs: [
      { id: 'job-chef-1', title: 'Head Chef', location: 'Bangalore', type: 'Full-time', postedDate: '2024-05-20', description: 'Seeking an experienced Head Chef with expertise in multi-cuisine cooking and kitchen management. Competitive salary and benefits.' },
      { id: 'job-waiter-2', title: 'Service Staff / Waiter', location: 'Bangalore', type: 'Part-time', postedDate: '2024-05-18', description: 'Looking for energetic and customer-friendly service staff for weekend shifts. Good communication skills required.' },
    ],
    reviews: [
        { id: 'rev1', reviewerName: 'Aisha K.', rating: 5, comment: 'The biryani was absolutely fantastic! Best I have had in Bangalore. Ambiance is great too. Will visit again!', date: '2024-05-15'},
        { id: 'rev2', reviewerName: 'Rohan S.', rating: 4, comment: 'Good food and quick service. The mocktails were refreshing. A bit crowded on weekends, so book ahead.', date: '2024-05-12'},
        { id: 'rev3', reviewerName: 'Priya M.', rating: 5, comment: 'Celebrated my birthday here. The staff was very accommodating and the food was delicious. They even arranged a small cake! Highly recommend!', date: '2024-05-10'},
    ],
    averageRating: 4.5,
    totalReviews: 123,
  },
  {
    id: 2,
    name: 'Mikado UX UI & Branding Studio',
    logo: 'https://placehold.co/80x80.png', logoAiHint: 'design studio',
    coverPhoto: 'https://placehold.co/1200x300.png', coverPhotoAiHint: 'modern office design',
    bio: 'Curating digital experiences that connect with people. Global branding and user experience design consultancy dedicated to innovation and quality. We partner with startups and enterprises to create impactful digital products.',
    website: 'http://www.mikado.biz',
    phone: '+91 8197278080',
    email: 'hello@mikado.biz',
    location: 'Indiranagar, Bengaluru, Karnataka',
    specialties: ['User Experience Design (UX)', 'User Interface Design (UI)', 'Branding & Identity', 'Mobile App Design', 'Web Design', 'Design Sprints'],
    followers: 5600,
    following: 120,
    isActive: true,
    feed: [
        {id: 'mfeed1', content: 'Excited to launch our new branding for a major e-commerce client! Check out the case study on our website for a deep dive into our process.', image: 'https://placehold.co/600x350.png', imageAiHint: 'branding design project', timestamp: '1 week ago'},
        {id: 'mfeed2', content: 'We are hiring talented UX Designers! If you are passionate about creating user-centric solutions, visit our careers page for more details.', timestamp: '3 days ago'},
    ],
    products: [], 
    services: [
        {id: 'mserv1', name: 'UI/UX Design Sprint', description: 'Intensive design sprint to rapidly prototype and validate your product ideas. Ideal for startups and new product development.', price: 'Contact for Quote'},
        {id: 'mserv2', name: 'Brand Identity Package', description: 'Comprehensive branding package including logo design, style guide creation, and marketing collateral design.', price: 'Starting at ₹50,000'},
        {id: 'mserv3', name: 'Website Design & Development', description: 'End-to-end website design and development services using modern technologies like Next.js and Webflow.'},
        {id: 'mserv4', name: 'Mobile App Design (iOS & Android)', description: 'User-centric mobile application design for optimal engagement and usability, covering both iOS and Android platforms.'},
    ],
    jobs: [
        {id: 'mjob1', title: 'Senior UX Designer', location: 'Bengaluru (Remote option available)', type: 'Full-time', postedDate: '2024-05-15', description: 'Looking for a seasoned UX designer to lead projects and mentor junior designers. Strong portfolio showcasing complex problem-solving required.'},
        {id: 'mjob2', title: 'Graphic Design Intern', location: 'Bengaluru', type: 'Internship', postedDate: '2024-05-20', description: 'Opportunity for aspiring graphic designers to learn and contribute to real-world projects. Paid internship.'},
    ],
    reviews: [
        {id: 'mrev1', reviewerName: 'Startup Founder X', rating: 5, comment: 'Mikado transformed our app! The new UX is intuitive and has significantly improved user engagement. Their team is top-notch.', date: '2024-04-30'},
        {id: 'mrev2', reviewerName: 'Marketing Manager Y', rating: 5, comment: 'The branding package they delivered was exceptional. Our new brand identity truly stands out and resonates with our target audience.', date: '2024-03-15'},
    ],
    averageRating: 4.9,
    totalReviews: 75,
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

  const [businessProfilesData, setBusinessProfilesData] = useState<UserBusinessProfile[]>(initialBusinessProfiles);
  const [selectedBusinessProfileId, setSelectedBusinessProfileId] = useState<string | number | null>(null);
  const [businessProfileToManageId, setBusinessProfileToManageId] = useState<string | number | null>(null); // New state
  
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
    setBusinessProfileToManageId(null); // Clear on logout
    setSelectedIndividualProfileId(null);
    setSelectedSkillsetProfileId(null);
    setSkillsetProfileToManageId(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const handleTabSelection = (tab: TabName) => {
    setActiveTab(tab);
    setShowSideMenu(false);
    if (tab !== 'business-detail' && tab !== 'individual-profile' && tab !== 'skillset-profile' && tab !== 'manage-skillset-profile' && tab !== 'manage-business-profile') {
        setSelectedBusinessProfileId(null);
        setBusinessProfileToManageId(null);
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

  const handleManageBusinessProfile = (profileId: string | number) => { // New handler
    setBusinessProfileToManageId(profileId);
    setActiveTab('manage-business-profile');
    setShowSideMenu(false);
  };

  const handleBackFromBusinessDetail = () => {
    setActiveTab('business-profiles'); 
    setSelectedBusinessProfileId(null);
    setBusinessProfileToManageId(null); 
  };

  const handleBackFromManageBusinessProfile = () => { 
    setBusinessProfileToManageId(null);
    setActiveTab('business-profiles');
  };
  
  const handleSelectIndividualProfile = (profileId: string) => {
    if(profileId === 'individual-jenson-1' || profileId === 'jenson-interior-stylist-123') { 
        handleSelectSkillsetProfile('jenson-interior-stylist-123'); 
    } else if (profileId === 'prof2' || profileId === 'prof2-ux-designer-skillset'){
        handleSelectSkillsetProfile('prof2-ux-designer-skillset'); 
    } else if (profileId === "currentUser" && userData) {
        setActiveTab('account'); 
    } else {
        setSelectedIndividualProfileId(profileId);
        setActiveTab('individual-profile');
    }
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

  const handleAddToCart = (businessId: string | number, productId: string) => {
    console.log('Add to Cart:', { businessId, productId });
    toast({ title: "Added to Cart (Simulated)", description: `Product ${productId} from business ${businessId}` });
  };

  const handleRideRequest = useCallback((rideData: { pickup: string; dropoff: string; vehicleId: string }) => {
      console.log('Ride request received in page.tsx:', rideData);
      const rideDetails: ActivityDetails = {
          type: 'ride',
          status: 'Looking for driver...',
          pickup: rideData.pickup,
          dropoff: rideData.dropoff,
          vehicle: rideData.vehicleId,
      };
      setActivityDetails(rideDetails);
      setIsActiveActivityViewVisible(true);
      
      setTimeout(() => {
          setActivityDetails(prev => {
            if (prev?.type === 'ride' && prev?.status === 'Looking for driver...') {
              console.log("Simulating driver found for rider");
              return {
                ...prev,
                status: 'Driver Assigned',
                driverName: 'Sim Driver',
                vehicle: `${prev.vehicle || 'Vehicle'} - XX00YZ0000 (Simulated)`, 
              };
            }
            return prev;
          });
      }, 6000);
  }, []);

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
         if (activityDetails?.status !== 'completed' && activityDetails?.status !== 'cancelled') {
            setActivityDetails(null);
         }
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
                            setActiveTab={handleTabSelection}
                            onSelectBusinessProfile={handleSelectBusinessProfile}
                            onSelectSkillsetProfile={handleSelectSkillsetProfile}
                            onAddToCart={handleAddToCart}
                         />;
      case 'feeds': return <FeedsScreen />;
      case 'menu': return <ServicesScreen setActiveTab={handleTabSelection} onRequestRide={handleRideRequest} />;
      case 'recommended': return <RecommendedScreen />;
      case 'account': return <AccountScreen onLogout={handleLogout} />;
      case 'user-skillsets': return (
                            <UserSkillsetsScreen 
                                setActiveTab={handleTabSelection} 
                                onManageSkillsetProfile={handleManageSkillsetProfile} 
                            />
                        );
      case 'vehicles': return <UserVehiclesScreen setActiveTab={handleTabSelection} />;
      case 'business-profiles': return (
        <UserBusinessProfilesScreen
          businessProfiles={businessProfilesData}
          onSelectProfile={handleSelectBusinessProfile}
          onManageProfile={handleManageBusinessProfile} 
        />
      );
      case 'business-detail':
        const selectedProfile = businessProfilesData.find(p => p.id === selectedBusinessProfileId);
        return <UserBusinessProfileDetailScreen profile={selectedProfile} onBack={handleBackFromBusinessDetail} />;
      
      case 'manage-business-profile': 
        if (businessProfileToManageId) {
          return (
            <BusinessProfileManagementScreen
              businessProfileId={businessProfileToManageId}
              onBack={handleBackFromManageBusinessProfile}
            />
          );
        }
        return <p className="p-4 text-center text-muted-foreground">No business profile selected for management.</p>;
      
      case 'individual-profile': 
        if (selectedIndividualProfileId === "currentUser" && userData) {
             return <IndividualProfileScreen profileId="currentUser" setActiveTab={handleTabSelection} />;
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

      default: return <HomeScreen 
                        setActiveTab={handleTabSelection}
                        onSelectBusinessProfile={handleSelectBusinessProfile}
                        onSelectSkillsetProfile={handleSelectSkillsetProfile}
                        onAddToCart={handleAddToCart}
                      />;
    }
  };
  
  if (!isClient) {
    return (
      <div className="flex flex-col h-screen bg-background items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading App...</p>
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
          businessProfiles={businessProfilesData}
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
    

