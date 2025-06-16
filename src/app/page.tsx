
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
import DigitalIdCardScreen from '@/components/screens/DigitalIdCardScreen';
import ProfessionalProfileScreen from '@/components/screens/ProfessionalProfileScreen';
import UserSkillsetsScreen from '@/components/screens/UserSkillsetsScreen';
import UserVehiclesScreen from '@/components/screens/UserVehiclesScreen';
import UserBusinessProfilesScreen from '@/components/screens/UserBusinessProfilesScreen';
import UserBusinessProfileDetailScreen from '@/components/screens/UserBusinessProfileDetailScreen';
import BusinessProfileManagementScreen from '@/components/screens/BusinessProfileManagementScreen';
import MessagesNotificationsScreen from '@/components/screens/MessagesNotificationsScreen';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ActiveActivityView from '@/components/activity/ActiveActivityView';
import IndividualProfileScreen from '@/components/screens/IndividualProfileScreen';
import SkillsetProfileScreen from '@/components/screens/SkillsetProfileScreen';
import SkillsetProfileManagementScreen from '@/components/screens/SkillsetProfileManagementScreen';
import JobBoardScreen from '@/components/screens/JobBoardScreen';
import JobDetailScreen from '@/components/screens/JobDetailScreen';
import AccountSettingsScreen from '@/components/screens/AccountSettingsScreen';

import type { TabName, UserBusinessProfile, ActivityDetails, BusinessJob, UserDataForSideMenu } from '@/types';
import { useToast } from "@/hooks/use-toast";

const initialBusinessProfilesData: UserBusinessProfile[] = [
  {
    id: 'bp-1-cafe-bliss',
    name: 'Cafe Bliss',
    logo: 'https://placehold.co/100x100.png',
    logoAiHint: 'modern cafe logo',
    coverPhoto: 'https://placehold.co/1200x400.png',
    coverPhotoAiHint: 'cozy cafe interior',
    bio: 'Your friendly neighborhood cafe serving artisanal coffee and delicious pastries. A perfect spot to relax or work.',
    website: 'https://cafebliss.example.com',
    phone: '+91 98765 43210',
    email: 'hello@cafebliss.example.com',
    location: '123 Coffee Lane, MG Road, Bangalore',
    specialties: ['Artisanal Coffee', 'Fresh Pastries', 'Quiet Ambiance', 'Free Wi-Fi'],
    followers: 1250,
    following: 50,
    feed: [
      { id: 'feed-cb-1', content: 'Try our new seasonal Pumpkin Spice Latte! 🍂☕', timestamp: '2 days ago', image: 'https://placehold.co/600x400.png', imageAiHint: 'latte coffee' },
      { id: 'feed-cb-2', content: 'Live music this Friday evening from 7 PM. Don\'t miss out!', timestamp: '5 days ago' },
    ],
    products: [
      { id: 'prod-cb-cappuccino', name: 'Cappuccino', price: '180', description: 'Classic Italian cappuccino with rich espresso and steamed milk foam.', imageUrl: 'https://placehold.co/200x200.png', imageAiHint: 'cappuccino cup' },
      { id: 'prod-cb-croissant', name: 'Butter Croissant', price: '120', discountPrice: '100', discountPercentage: '16%', description: 'Flaky, buttery, and freshly baked.', imageUrl: 'https://placehold.co/200x200.png', imageAiHint: 'croissant pastry' },
    ],
    services: [
      { id: 'serv-cb-catering', name: 'Small Event Catering', description: 'We cater for small gatherings and office meetings. Contact us for a custom menu.', price: 'Enquire for quote' },
    ],
    jobs: [
      { id: 'job-cb-barista', businessId: 'bp-1-cafe-bliss', businessName: 'Cafe Bliss', title: 'Barista (Part-Time)', location: 'MG Road, Bangalore', type: 'Part-time', description: 'Looking for an enthusiastic barista to join our team. Experience preferred.', postedDate: '2024-06-10', salaryRange: '₹10k-15k/month' },
    ],
    reviews: [
      { id: 'rev-cb-1', reviewerName: 'Aisha R.', rating: 5, comment: 'Best coffee in town! Love the atmosphere.', date: '2024-06-01' },
      { id: 'rev-cb-2', reviewerName: 'Rohan S.', rating: 4, comment: 'Great place to work. Pastries are a bit pricey but good.', date: '2024-05-28' },
    ],
    averageRating: 4.5,
    totalReviews: 78,
    isActive: true,
  },
  {
    id: 'bp-2-techfix-solutions',
    name: 'TechFix Solutions',
    logo: 'https://placehold.co/100x100.png',
    logoAiHint: 'tech repair logo',
    coverPhoto: 'https://placehold.co/1200x400.png',
    coverPhotoAiHint: 'computer repair workshop',
    bio: 'Expert repairs for laptops, mobiles, and all your gadgets. Quick, reliable, and affordable services.',
    website: 'https://techfix.example.com',
    phone: '+91 90000 11111',
    email: 'support@techfix.example.com',
    location: 'Unit 5, Electronic City, Bangalore',
    specialties: ['Laptop Repair', 'Mobile Screen Replacement', 'Data Recovery', 'Virus Removal'],
    followers: 850,
    following: 20,
    feed: [
      { id: 'feed-tf-1', content: 'Smashed phone screen? We can fix it today! Visit us for quick screen replacements.', timestamp: '1 day ago', image: 'https://placehold.co/600x400.png', imageAiHint: 'broken phone screen' },
    ],
    products: [], // No direct products, mostly services
    services: [
      { id: 'serv-tf-laptop', name: 'Laptop Motherboard Repair', description: 'Component-level repair for all major laptop brands.', price: 'Starting at ₹2500' },
      { id: 'serv-tf-screen', name: 'Mobile Screen Replacement', description: 'Original and high-quality compatible screens available.', price: '₹1500 - ₹15000 (Varies by model)' },
      { id: 'serv-tf-data', name: 'Data Recovery Service', description: 'Recover lost data from hard drives and SSDs.', price: 'Enquire for quote' },
    ],
    jobs: [],
    reviews: [
      { id: 'rev-tf-1', reviewerName: 'Vikram G.', rating: 5, comment: 'Saved my laptop! Fast and professional service.', date: '2024-06-05' },
    ],
    averageRating: 4.8,
    totalReviews: 120,
    isActive: true,
  },
  {
    id: 'bp-3-greenscape-gardens',
    name: 'GreenScape Gardens',
    logo: 'https://placehold.co/100x100.png',
    logoAiHint: 'gardening service logo',
    coverPhoto: 'https://placehold.co/1200x400.png',
    coverPhotoAiHint: 'lush green garden',
    bio: 'Professional landscaping and garden maintenance services. We create and maintain beautiful green spaces.',
    location: 'Jayanagar, Bangalore',
    specialties: ['Landscaping Design', 'Garden Maintenance', 'Organic Gardening', 'Plant Nursery'],
    followers: 600,
    following: 30,
    products: [
        { id: 'prod-gs-rose', name: 'Hybrid Tea Rose Plant', price: '350', description: 'Healthy, blooming rose plant in various colors.', imageUrl: 'https://placehold.co/200x200.png', imageAiHint: 'rose plant' },
    ],
    services: [
      { id: 'serv-gs-landscape', name: 'Full Landscaping Design', description: 'Custom garden design from concept to installation.', price: 'Starts at ₹50,000' },
    ],
    averageRating: 4.2,
    totalReviews: 45,
    isActive: false, // Example of an inactive profile
  }
];

const newBusinessProfileTemplate: Omit<UserBusinessProfile, 'id'> = {
  name: '',
  bio: '',
  logo: '',
  logoAiHint: '',
  coverPhoto: '',
  coverPhotoAiHint: '',
  website: '',
  phone: '',
  email: '',
  location: '',
  specialties: [],
  followers: 0,
  following: 0,
  feed: [],
  products: [],
  services: [],
  jobs: [],
  reviews: [],
  averageRating: 0,
  totalReviews: 0,
  isActive: true,
  licenseNumber: '',
  documentUrl: '',
};

export default function AppRoot() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [activeTab, setActiveTabInternal] = useState<TabName>('login');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMessagesNotifications, setShowMessagesNotifications] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserDataForSideMenu | null>(null);

  const [businessProfilesData, setBusinessProfilesData] = useState<UserBusinessProfile[]>([]);
  const [isLoadingBusinessProfiles, setIsLoadingBusinessProfiles] = useState(true); // Start true
  const [selectedBusinessProfileId, setSelectedBusinessProfileId] = useState<string | null>(null);
  const [businessProfileToManageId, setBusinessProfileToManageId] = useState<string | null>(null);


  const [selectedIndividualProfileId, setSelectedIndividualProfileId] = useState<string | null>(null);
  const [selectedSkillsetProfileId, setSelectedSkillsetProfileId] = useState<string | null>(null);
  const [skillsetProfileToManageId, setSkillsetProfileToManageId] = useState<string | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [isFabVisible, setIsFabVisible] = useState(false);
  const [isActiveActivityViewVisible, setIsActiveActivityViewVisible] = useState(false);
  const [activityDetails, setActivityDetails] = useState<ActivityDetails>(null);
  const [isDriverOnlineSim, setIsDriverOnlineSim] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchBusinessProfiles = useCallback(async () => {
    if (!isLoggedIn) {
      setBusinessProfilesData([]); // Clear data if not logged in
      setIsLoadingBusinessProfiles(false);
      return;
    }
    setIsLoadingBusinessProfiles(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 750));
    try {
      setBusinessProfilesData(initialBusinessProfilesData); // Use mock data
      console.log("Mock business profiles loaded into state.");
    } catch (error) {
      console.error("Error setting mock business profiles:", error);
      toast({ title: "Error Loading Profiles", description: "Could not load mock business profiles.", variant: "destructive" });
      setBusinessProfilesData([]);
    } finally {
      setIsLoadingBusinessProfiles(false);
    }
  }, [toast, isLoggedIn]);


  useEffect(() => {
    if (isLoggedIn) {
      fetchBusinessProfiles();
    } else {
      setBusinessProfilesData([]);
      setIsLoadingBusinessProfiles(false);
    }
  }, [isLoggedIn, fetchBusinessProfiles]);

  const handleSaveBusinessProfile = useCallback((profileData: UserBusinessProfile) => {
    setBusinessProfilesData(prevProfiles => {
      const existingIndex = prevProfiles.findIndex(p => p.id === profileData.id);
      if (existingIndex > -1) {
        // Update existing
        const updatedProfiles = [...prevProfiles];
        updatedProfiles[existingIndex] = profileData;
        toast({ title: "Profile Updated", description: `"${profileData.name}" has been updated locally.` });
        return updatedProfiles;
      } else {
        // Add new
        const newProfileWithId = { ...profileData, id: profileData.id || `bp-local-${Date.now()}` }; // Ensure ID for local
        toast({ title: "Profile Created", description: `"${newProfileWithId.name}" has been created locally.` });
        return [...prevProfiles, newProfileWithId];
      }
    });
  }, [toast]);

  const handleDeleteBusinessProfile = useCallback((profileId: string) => {
    setBusinessProfilesData(prevProfiles => {
      const profileToDelete = prevProfiles.find(p => p.id === profileId);
      if (profileToDelete) {
        toast({ title: "Profile Deleted", description: `"${profileToDelete.name}" has been deleted locally.`, variant: "destructive" });
      }
      return prevProfiles.filter(p => p.id !== profileId);
    });
  }, [toast]);

  const handleToggleBusinessProfileActive = useCallback((profileId: string) => {
    setBusinessProfilesData(prevProfiles => {
      const profileToToggle = prevProfiles.find(p => p.id === profileId);
      const newProfiles = prevProfiles.map(p =>
        p.id === profileId ? { ...p, isActive: !p.isActive } : p
      );
      if (profileToToggle) {
        toast({ title: "Status Updated", description: `"${profileToToggle.name}" is now ${!profileToToggle.isActive ? 'active' : 'inactive'}.` });
      }
      return newProfiles;
    });
  }, [toast]);


  const handleLoginSuccess = useCallback((user: UserDataForSideMenu) => {
    setIsLoggedIn(true);
    setUserData({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || 'https://source.unsplash.com/random/48x48/?user,avatar',
        avatarAiHint: user.avatarAiHint || 'user avatar',
    });
    setActiveTabInternal('home');
    toast({ title: "Login Successful", description: `Welcome back, ${user.name || 'User'}!` });
  }, [toast]);

  const handleRegistrationSuccess = useCallback((user: {name: string; email: string}) => {
    setActiveTabInternal('login');
    toast({ title: "Registration Complete!", description: `Welcome, ${user.name}! Please log in to Bucks.` });
  }, [toast]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserData(null);
    setActiveTabInternal('login');
    setShowSideMenu(false);
    setIsFabVisible(false);
    setIsActiveActivityViewVisible(false);
    setActivityDetails(null);
    setIsDriverOnlineSim(false);
    setSelectedBusinessProfileId(null);
    setBusinessProfileToManageId(null);
    setSelectedIndividualProfileId(null);
    setSelectedSkillsetProfileId(null);
    setSkillsetProfileToManageId(null);
    setSelectedJobId(null);
    setBusinessProfilesData([]); // Clear business profiles on logout
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  }, [toast]);

  const handleTabSelection = useCallback((tab: TabName) => {
    setActiveTabInternal(tab);
    setShowSideMenu(false);
    if (tab !== 'business-detail' &&
        tab !== 'individual-profile' &&
        tab !== 'skillset-profile' &&
        tab !== 'manage-skillset-profile' &&
        tab !== 'manage-business-profile' &&
        tab !== 'job-detail' &&
        tab !== 'professional-profile' &&
        tab !== 'account-settings' &&
        tab !== 'digital-id-card') {
        setSelectedBusinessProfileId(null);
        setBusinessProfileToManageId(null);
        setSelectedIndividualProfileId(null);
        setSelectedSkillsetProfileId(null);
        setSkillsetProfileToManageId(null);
        setSelectedJobId(null);
    }
    if (tab === 'business-profiles' && isLoggedIn) { // Fetch only if logged in
        fetchBusinessProfiles();
    }
  }, [fetchBusinessProfiles, isLoggedIn]);

  const setActiveTab = handleTabSelection;

  const handleSelectBusinessProfile = useCallback((profileId: string) => {
    setSelectedBusinessProfileId(profileId);
    setActiveTab('business-detail');
    setShowSideMenu(false);
  }, [setActiveTab]);

  const handleManageBusinessProfile = useCallback((profileId: string) => { // profileId can be "new"
    setBusinessProfileToManageId(profileId);
    setActiveTab('manage-business-profile');
    setShowSideMenu(false);
  }, [setActiveTab]);

  const handleBackFromBusinessDetail = useCallback(() => {
    setActiveTab('business-profiles');
    setSelectedBusinessProfileId(null);
    // No need to set businessProfileToManageId to null here, that's for management screen
  }, [setActiveTab]);

  const handleBackFromManageBusinessProfile = useCallback(() => {
    setBusinessProfileToManageId(null);
    setActiveTab('business-profiles');
    // fetchBusinessProfiles(); // Data is local, so no explicit fetch needed, re-render will use current state
  }, [setActiveTab]);

  const handleSelectSkillsetProfile = useCallback((skillsetProfileId: string) => {
    setSelectedSkillsetProfileId(skillsetProfileId);
    setActiveTab('skillset-profile');
    setShowSideMenu(false);
  }, [setActiveTab]);

  const handleSelectIndividualProfile = useCallback((profileId: string) => {
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
  }, [userData, handleSelectSkillsetProfile, setActiveTab]);


  const handleManageSkillsetProfile = useCallback((skillsetProfileId: string) => {
    setSkillsetProfileToManageId(skillsetProfileId);
    setActiveTab('manage-skillset-profile');
    setShowSideMenu(false);
  }, [setActiveTab]);

  const handleBackFromManageSkillsetProfile = useCallback(() => {
    setSkillsetProfileToManageId(null);
    setActiveTab('user-skillsets');
  }, [setActiveTab]);

  const handleSelectJob = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setActiveTab('job-detail');
    setShowSideMenu(false);
  }, [setActiveTab]);

  const handleBackFromJobDetail = useCallback(() => {
    setSelectedJobId(null);
    setActiveTab('job-board');
  }, [setActiveTab]);

  const handleAddToCart = useCallback((businessId: string | number, productId: string) => {
    console.log('Add to Cart:', { businessId, productId });
    toast({ title: "Added to Cart (Simulated)", description: `Product ${productId} from business ${businessId}` });
  }, [toast]);


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

  const handleFabClick = useCallback(() => {
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
  }, [isLoggedIn, isDriverOnlineSim, activityDetails]);


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


  const handleCloseActivityView = useCallback(() => {
    setIsActiveActivityViewVisible(false);
    if (activityDetails?.type === 'request' || activityDetails?.type === 'driver_status') {
      if (activityDetails?.status !== 'en_route' && activityDetails?.status !== 'arrived' && activityDetails?.status !== 'on_the_way') {
         if (activityDetails?.status !== 'completed' && activityDetails?.status !== 'cancelled') {
            setActivityDetails(null);
         }
      }
    }
  }, [activityDetails]);

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


  const renderScreenContent = useCallback(() => {
    if (!isClient) return null;

    if (!isLoggedIn) {
      if (activeTab === 'registration') {
        return <RegistrationScreen setActiveTab={setActiveTab} onRegistrationSuccess={handleRegistrationSuccess} />;
      }
      return <LoginScreen setActiveTab={setActiveTab} onLoginSuccess={handleLoginSuccess} />;
    }

    switch (activeTab) {
      case 'home': return <HomeScreen
                            setActiveTab={setActiveTab}
                            onSelectBusinessProfile={handleSelectBusinessProfile}
                            onSelectSkillsetProfile={handleSelectSkillsetProfile}
                            onAddToCart={handleAddToCart}
                         />;
      case 'feeds': return <FeedsScreen onViewUserProfile={handleSelectIndividualProfile} />;
      case 'menu': return <ServicesScreen setActiveTab={setActiveTab} onRequestRide={handleRideRequest} />;
      case 'recommended': return <RecommendedScreen />;
      case 'account': return <AccountScreen userData={userData} setActiveTab={setActiveTab} />;
      case 'digital-id-card': return <DigitalIdCardScreen userData={userData} setActiveTab={setActiveTab} />;
      case 'professional-profile': return <ProfessionalProfileScreen setActiveTab={setActiveTab} userData={userData} />;
      case 'user-skillsets': return (
                            <UserSkillsetsScreen
                                setActiveTab={setActiveTab}
                                onManageSkillsetProfile={handleManageSkillsetProfile}
                            />
                        );
      case 'vehicles': return <UserVehiclesScreen setActiveTab={setActiveTab} />;
      case 'business-profiles': return (
        <UserBusinessProfilesScreen
          businessProfiles={businessProfilesData}
          onSelectProfile={handleSelectBusinessProfile}
          onManageProfile={handleManageBusinessProfile}
          onDeleteProfile={handleDeleteBusinessProfile}
          onToggleProfileActive={handleToggleBusinessProfileActive}
          isLoading={isLoadingBusinessProfiles}
        />
      );
      case 'business-detail':
        const selectedProfile = businessProfilesData.find(p => p.id === selectedBusinessProfileId);
        return <UserBusinessProfileDetailScreen profile={selectedProfile} onBack={handleBackFromBusinessDetail} />;

      case 'manage-business-profile':
        const profileDataToManage = businessProfileToManageId === 'new'
          ? { ...newBusinessProfileTemplate } // Pass a copy of the template for new
          : businessProfilesData.find(p => p.id === businessProfileToManageId);
        if (businessProfileToManageId && profileDataToManage) {
          return (
            <BusinessProfileManagementScreen
              key={businessProfileToManageId} // Re-mount component if ID changes (e.g. from new to an ID)
              initialProfileData={profileDataToManage} // Now passing the full object or template
              onSave={handleSaveBusinessProfile} // New prop for saving
              onBack={handleBackFromManageBusinessProfile}
            />
          );
        }
        // Fallback or error if profile not found for management and it's not "new"
        if (businessProfileToManageId !== 'new') {
            toast({ title: "Error", description: "Could not find business profile to manage.", variant: "destructive" });
            setActiveTab('business-profiles'); // Navigate back if profile not found
        }
        return <p className="p-4 text-center text-muted-foreground">Loading management screen...</p>;


      case 'individual-profile':
        if (selectedIndividualProfileId) {
             return <IndividualProfileScreen profileId={selectedIndividualProfileId} setActiveTab={setActiveTab} />;
        }
        if (userData && !selectedIndividualProfileId) {
             setActiveTab('account');
             return <AccountScreen userData={userData} setActiveTab={setActiveTab} />;
        }
        return <p className="p-4 text-center text-muted-foreground">No individual profile selected or user data missing.</p>;


      case 'skillset-profile':
        if (selectedSkillsetProfileId) {
          return <SkillsetProfileScreen skillsetProfileId={selectedSkillsetProfileId} setActiveTab={setActiveTab} />;
        }
        return <p className="p-4 text-center text-muted-foreground">No skillset profile selected.</p>;

      case 'manage-skillset-profile':
        if (skillsetProfileToManageId) {
          return (
            <SkillsetProfileManagementScreen
              skillsetProfileId={skillsetProfileToManageId}
              setActiveTab={setActiveTab}
              onBack={handleBackFromManageSkillsetProfile}
            />
          );
        }
        return <p className="p-4 text-center text-muted-foreground">No skillset profile selected for management.</p>;

      case 'job-board':
        const allJobs = businessProfilesData.flatMap(bp => bp.jobs?.map(job => ({...job, businessId: bp.id, businessName: bp.name, businessLogoUrl: bp.logo})) || []);
        return <JobBoardScreen jobs={allJobs} onSelectJob={handleSelectJob} />;

      case 'job-detail':
        const allJobsForDetail = businessProfilesData.flatMap(bp => bp.jobs?.map(job => ({...job, businessId: bp.id, businessName: bp.name, businessLogoUrl: bp.logo})) || []);
        const job = allJobsForDetail.find(j => j.id === selectedJobId);
        if (job) {
            return <JobDetailScreen job={job} onBack={handleBackFromJobDetail} />;
        }
        return <p className="p-4 text-center text-muted-foreground">Job details not found.</p>;

      case 'account-settings':
        return <AccountSettingsScreen />;


      default: return <HomeScreen
                        setActiveTab={setActiveTab}
                        onSelectBusinessProfile={handleSelectBusinessProfile}
                        onSelectSkillsetProfile={handleSelectSkillsetProfile}
                        onAddToCart={handleAddToCart}
                      />;
    }
  }, [
    isClient, isLoggedIn, activeTab, userData, businessProfilesData, isLoadingBusinessProfiles,
    selectedBusinessProfileId, businessProfileToManageId,
    selectedIndividualProfileId, selectedSkillsetProfileId, skillsetProfileToManageId, selectedJobId,
    handleLoginSuccess, handleRegistrationSuccess, setActiveTab,
    handleSelectBusinessProfile, handleManageBusinessProfile, handleBackFromBusinessDetail, handleBackFromManageBusinessProfile,
    handleSelectIndividualProfile, handleSelectSkillsetProfile, handleManageSkillsetProfile, handleBackFromManageSkillsetProfile,
    handleSelectJob, handleBackFromJobDetail, handleAddToCart, handleRideRequest,
    handleSaveBusinessProfile, handleDeleteBusinessProfile, handleToggleBusinessProfileActive, // Added local data handlers
    toast
  ]);


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
          setActiveTab={setActiveTab}
          businessProfiles={businessProfilesData}
          onSelectBusinessProfile={handleSelectBusinessProfile}
          selectedBusinessProfileId={selectedBusinessProfileId}
          onLogout={handleLogout}
          userData={userData}
        />
      )}

      <div className="flex-grow overflow-hidden relative p-4">
        {renderScreenContent()}
      </div>

      {isLoggedIn && (
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
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
