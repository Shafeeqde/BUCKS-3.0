
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
import ChatDetailScreen from '@/components/screens/ChatDetailScreen';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ActiveActivityView from '@/components/activity/ActiveActivityView';
import IndividualProfileScreen from '@/components/screens/IndividualProfileScreen';
import SkillsetProfileScreen from '@/components/screens/SkillsetProfileScreen';
import SkillsetProfileManagementScreen from '@/components/screens/SkillsetProfileManagementScreen';
import JobBoardScreen from '@/components/screens/JobBoardScreen';
import JobDetailScreen from '@/components/screens/JobDetailScreen';
import AccountSettingsScreen from '@/components/screens/AccountSettingsScreen';
import CreatePostScreen from '@/components/screens/CreatePostScreen';
import DetailedPostScreen from '@/components/screens/DetailedPostScreen';
import CreateMomentDialog from '@/components/moments/CreateMomentDialog';
import MomentViewerScreen from '@/components/moments/MomentViewerScreen';
import ServiceBookingDialog from '@/components/services/ServiceBookingDialog';
import { initialCategoriesData } from '@/lib/dummy-data/feedsCategories';
import { feedItems as initialFeedItemsData } from '@/lib/dummy-data/feedItems';

import FoodRestaurantsScreen from '@/components/screens/food/FoodRestaurantsScreen';
import FoodRestaurantDetailScreen from '@/components/screens/food/FoodRestaurantDetailScreen';
import { dummyRestaurants } from '@/lib/dummy-data/restaurants';

import ShoppingCategoriesScreen from '@/components/screens/shopping/ShoppingCategoriesScreen';
import ShoppingProductsListScreen from '@/components/screens/shopping/ShoppingProductsListScreen';
import ShoppingProductDetailScreen from '@/components/screens/shopping/ShoppingProductDetailScreen';
import ShoppingCartScreen from '@/components/screens/shopping/ShoppingCartScreen'; 
import { dummyProductCategories } from '@/lib/dummy-data/productCategories';
import { dummyProducts } from '@/lib/dummy-data/products';

import UnifiedCartScreen from '@/components/screens/cart/UnifiedCartScreen';


import type {
    TabName, UserBusinessProfile, ActivityDetails, BusinessJob, UserDataForSideMenu,
    ProfilePost, MediaAttachment, UserMoment, Category as CategoryType, FeedItem, Comment,
    ServiceBookingRequest, ActiveBooking, BookingStatus,
    Restaurant, MenuItem, FoodCartItem, 
    ProductCategory, ProductListing, ShoppingCartItem,
    MessageItem, NotificationItem, ChatMessage, ActivityType, ActivityStatus
} from '@/types';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from 'date-fns';
import { useCart } from '@/context/CartContext';


const initialBusinessProfilesData: UserBusinessProfile[] = [
  {
    id: 'bp-1-cafe-bliss',
    name: 'Cafe Bliss',
    logo: 'https://source.unsplash.com/random/100x100/?modern,cafe,logo',
    logoAiHint: 'modern cafe logo',
    coverPhoto: 'https://source.unsplash.com/random/1200x400/?cozy,cafe,interior',
    coverPhotoAiHint: 'cozy cafe interior',
    bio: 'Your friendly neighborhood cafe serving artisanal coffee and delicious pastries. A perfect spot to relax or work.',
    businessType: 'products_and_services',
    website: 'https://cafebliss.example.com',
    phone: '+91 98765 43210',
    email: 'hello@cafebliss.example.com',
    location: '123 Coffee Lane, MG Road, Bangalore',
    specialties: ['Artisanal Coffee', 'Fresh Pastries', 'Quiet Ambiance', 'Free Wi-Fi'],
    followers: 1250,
    following: 50,
    feed: [
      { id: 'feed-cb-1', content: 'Try our new seasonal Pumpkin Spice Latte! 🍂☕', image: 'https://source.unsplash.com/random/600x400/?latte,coffee', imageAiHint: 'latte coffee', timestamp: '2 days ago' },
      { id: 'feed-cb-2', content: 'Live music this Friday evening from 7 PM. Don\'t miss out!', timestamp: '5 days ago' },
    ],
    products: [
      { id: 'prod-cb-cappuccino', name: 'Cappuccino', price: '180', description: 'Classic Italian cappuccino with rich espresso and steamed milk foam.', imageUrl: 'https://source.unsplash.com/random/200x200/?cappuccino,cup', imageAiHint: 'cappuccino cup' },
      { id: 'prod-cb-croissant', name: 'Butter Croissant', price: '120', discountPrice: '100', discountPercentage: '16%', description: 'Flaky, buttery, and freshly baked.', imageUrl: 'https://source.unsplash.com/random/200x200/?croissant,pastry', imageAiHint: 'croissant pastry' },
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
    logo: 'https://source.unsplash.com/random/100x100/?tech,repair,logo',
    logoAiHint: 'tech repair logo',
    coverPhoto: 'https://source.unsplash.com/random/1200x400/?computer,repair,workshop',
    coverPhotoAiHint: 'computer repair workshop',
    bio: 'Expert repairs for laptops, mobiles, and all your gadgets. Quick, reliable, and affordable services.',
    businessType: 'services',
    website: 'https://techfix.example.com',
    phone: '+91 90000 11111',
    email: 'support@techfix.example.com',
    location: 'Unit 5, Electronic City, Bangalore',
    specialties: ['Laptop Repair', 'Mobile Screen Replacement', 'Data Recovery', 'Virus Removal'],
    followers: 850,
    following: 20,
    feed: [
      { id: 'feed-tf-1', content: 'Smashed phone screen? We can fix it today! Visit us for quick screen replacements.', timestamp: '1 day ago', image: 'https://source.unsplash.com/random/600x400/?broken,phone,screen', imageAiHint: 'broken phone screen' },
    ],
    products: [],
    services: [
      { id: 'serv-tf-laptop', name: 'Laptop Motherboard Repair', description: 'Component-level repair for all major laptop brands.', price: 'Starting at ₹2500' },
      { id: 'serv-tf-screen', name: 'Mobile Screen Replacement', description: 'Original and high-quality compatible screens available.', price: '₹1500 - ₹15000 (Varies by model)' },
      { id: 'serv-tf-data', name: 'Data Recovery Service', description: 'Recover lost data from hard drives and SSDs.', price: 'Enquire for quote' },
    ],
    jobs: [
        { id: 'job-tf-technician', businessId: 'bp-2-techfix-solutions', businessName: 'TechFix Solutions', title: 'Repair Technician (Full-Time)', location: 'Electronic City, Bangalore', type: 'Full-time', description: 'Skilled technician needed for laptop and mobile repairs. Min. 2 years experience.', postedDate: '2024-06-15', salaryRange: '₹25k-35k/month', requirements: ['Diploma/Degree in Electronics', 'Soldering skills', 'Customer service experience'] },
        { id: 'job-tf-csr', businessId: 'bp-2-techfix-solutions', businessName: 'TechFix Solutions', title: 'Customer Service Rep', location: 'Electronic City, Bangalore', type: 'Full-time', description: 'Handle customer inquiries, manage bookings, and provide support.', postedDate: '2024-06-18', salaryRange: '₹18k-22k/month', requirements: ['Excellent communication skills', 'Basic computer knowledge'] },
    ],
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
    logo: 'https://source.unsplash.com/random/100x100/?gardening,service,logo',
    logoAiHint: 'gardening service logo',
    coverPhoto: 'https://source.unsplash.com/random/1200x400/?lush,green,garden',
    coverPhotoAiHint: 'lush green garden',
    bio: 'Professional landscaping and garden maintenance services. We create and maintain beautiful green spaces.',
    businessType: 'products_and_services',
    location: 'Jayanagar, Bangalore',
    specialties: ['Landscaping Design', 'Garden Maintenance', 'Organic Gardening', 'Plant Nursery'],
    followers: 600,
    following: 30,
    products: [
        { id: 'prod-gs-rose', name: 'Hybrid Tea Rose Plant', price: '350', description: 'Healthy, blooming rose plant in various colors.', imageUrl: 'https://source.unsplash.com/random/200x200/?rose,plant', imageAiHint: 'rose plant' },
    ],
    services: [
      { id: 'serv-gs-landscape', name: 'Full Landscaping Design', description: 'Custom garden design from concept to installation.', price: 'Starts at ₹50,000' },
    ],
    jobs: [
        { id: 'job-gs-gardener', businessId: 'bp-3-greenscape-gardens', businessName: 'GreenScape Gardens', title: 'Horticulturist / Senior Gardener', location: 'Jayanagar, Bangalore', type: 'Full-time', description: 'Experienced horticulturist to manage garden projects and plant care. Knowledge of local flora is a plus.', postedDate: '2024-06-01', salaryRange: '₹22k-30k/month', requirements: ['Degree in Horticulture or related field', 'Plant identification skills'] },
    ],
    averageRating: 4.2,
    totalReviews: 45,
    isActive: false,
  }
];

const newBusinessProfileTemplate: Omit<UserBusinessProfile, 'id'> = {
  name: '',
  bio: '',
  businessType: 'products_and_services',
  logo: 'https://source.unsplash.com/random/100x100/?business,logo',
  logoAiHint: 'business logo',
  coverPhoto: 'https://source.unsplash.com/random/1200x400/?business,background',
  coverPhotoAiHint: 'business background',
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

interface ViewingMomentOwnerDetails {
    name: string;
    avatarUrl?: string;
    avatarAiHint?: string;
    profileId: string;
}

interface BookingTargetProfile {
  id: string;
  name: string;
  skillName: string;
}

interface CurrentChatContext {
  senderName: string;
  senderAvatar?: string;
  senderAvatarAiHint?: string;
  messages: ChatMessage[];
  originalMessageId: string | number;
}

const genericOtherUserMoments: UserMoment[] = [
  { id: 'other-moment-generic-1', imageUrl: 'https://placehold.co/1080x1920.png', aiHint: 'abstract art', caption: 'A moment from them!', timestamp: '2h ago' },
  { id: 'other-moment-generic-2', imageUrl: 'https://placehold.co/1080x1920.png', aiHint: 'city scape', caption: 'Another cool moment.', timestamp: '1h ago' },
];


export default function AppRoot() {
  const { toast } = useToast();
  const { addToCart: globalAddToCart } = useCart(); 
  const [isClient, setIsClient] = useState(false);

  const [activeTabInternal, setActiveTabInternal] = useState<TabName>('login');
  const [showSideMenu, setShowSideMenu] = useState(false);


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserDataForSideMenu | null>(null);

  const [businessProfilesData, setBusinessProfilesData] = useState<UserBusinessProfile[]>([]);
  const [isLoadingBusinessProfiles, setIsLoadingBusinessProfiles] = useState(false);
  const [selectedBusinessProfileId, setSelectedBusinessProfileId] = useState<string | null>(null);
  const [businessProfileToManageId, setBusinessProfileToManageId] = useState<string | null>(null);

  const [selectedIndividualProfileId, setSelectedIndividualProfileId] = useState<string | null>(null);
  const [selectedSkillsetProfileId, setSelectedSkillsetProfileId] = useState<string | null>(null);
  const [skillsetProfileToManageId, setSkillsetProfileToManageId] = useState<string | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [isFabVisible, setIsFabVisible] = useState(false);
  const [isActiveActivityViewVisible, setIsActiveActivityViewVisible] = useState(false);
  const [activityDetails, setActivityDetails] = useState<ActivityDetails>(null);
  const [isTaxiDriverOnlineSim, setIsTaxiDriverOnlineSim] = useState(false);
  const [isDeliveryDriverOnlineSim, setIsDeliveryDriverOnlineSim] = useState(false); // New state for delivery


  const [userPosts, setUserPosts] = useState<ProfilePost[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItemsData);

  const [userMoments, setUserMoments] = useState<UserMoment[]>([]); 
  const [momentsToDisplayInViewer, setMomentsToDisplayInViewer] = useState<UserMoment[]>([]); 
  const [showCreateMomentDialog, setShowCreateMomentDialog] = useState(false);
  const [showMomentViewer, setShowMomentViewer] = useState(false);
  const [viewingMomentOwnerDetails, setViewingMomentOwnerDetails] = useState<ViewingMomentOwnerDetails | null>(null);

  const [selectedPostForDetail, setSelectedPostForDetail] = useState<FeedItem | ProfilePost | null>(null);

  const [showServiceBookingDialog, setShowServiceBookingDialog] = useState(false);
  const [bookingTargetProfile, setBookingTargetProfile] = useState<BookingTargetProfile | null>(null);
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);

  const [restaurantsData, setRestaurantsData] = useState<Restaurant[]>(dummyRestaurants);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [localFoodCartItems, setLocalFoodCartItems] = useState<FoodCartItem[]>([]); 


  const [productCategoriesData, setProductCategoriesData] = useState<ProductCategory[]>(dummyProductCategories);
  const [productsData, setProductsData] = useState<ProductListing[]>(dummyProducts);
  const [selectedShoppingCategoryId, setSelectedShoppingCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [shoppingCartItems, setShoppingCartItems] = useState<ShoppingCartItem[]>([]);

  const [showMessagesNotifications, setShowMessagesNotifications] = useState(false);
  const [showChatDetailScreen, setShowChatDetailScreen] = useState(false);
  const [currentChatContext, setCurrentChatContext] = useState<CurrentChatContext | null>(null);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchBusinessProfiles = useCallback(async () => {
    if (!isLoggedIn) {
      setBusinessProfilesData([]);
      setIsLoadingBusinessProfiles(false);
      return;
    }
    setIsLoadingBusinessProfiles(true);
    console.log("Fetching business profiles (local mock)...");
    await new Promise(resolve => setTimeout(resolve, 750));
    try {
      setBusinessProfilesData(initialBusinessProfilesData);
      console.log("Mock business profiles loaded into state.");
    } catch (error) {
      console.error("Error setting mock business profiles:", error);
      let detailedErrorMessage = "Could not load mock business profiles.";
      if (error instanceof Error) {
        detailedErrorMessage = error.message;
      }
      toast({ title: "Error Loading Profiles", description: detailedErrorMessage, variant: "destructive" });
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
        const updatedProfiles = [...prevProfiles];
        updatedProfiles[existingIndex] = profileData;
        toast({ title: "Profile Updated", description: `"${profileData.name}" has been updated locally.` });
        return updatedProfiles;
      } else {
        const newProfileWithId = { ...profileData, id: profileData.id || `bp-local-${Date.now()}` };
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
    const avatarAiHint = user.avatarAiHint || 'user avatar';
    setUserData({
        id: user.id,
        name: user.name,
        email: user.email, // This holds the User ID / Email
        avatarUrl: user.avatarUrl || `https://source.unsplash.com/random/48x48/?${avatarAiHint.split(' ').join(',')}`,
        avatarAiHint: avatarAiHint,
        moments: [], 
    });
    setActiveTabInternal('home');
    toast({ title: "Login Successful", description: `Welcome back, ${user.name || 'User'}!` });
  }, [toast]);

  const handleRegistrationSuccess = useCallback((user: { name: string; userId: string; email?: string }) => {
    setActiveTabInternal('login'); 
    toast({ title: "Registration Complete!", description: `Welcome, ${user.name}! Please log in with your User ID (${user.userId}) and the auto-suggested password.` });
  }, [toast]);


  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserData(null);
    setActiveTabInternal('login');
    setShowSideMenu(false);
    setIsFabVisible(false);
    setIsActiveActivityViewVisible(false);
    setActivityDetails(null);
    setIsTaxiDriverOnlineSim(false);
    setIsDeliveryDriverOnlineSim(false);
    setSelectedBusinessProfileId(null);
    setBusinessProfileToManageId(null);
    setSelectedIndividualProfileId(null);
    setSelectedSkillsetProfileId(null);
    setSkillsetProfileToManageId(null);
    setSelectedJobId(null);
    setBusinessProfilesData([]);
    setUserPosts([]);
    setUserMoments([]);
    setMomentsToDisplayInViewer([]);
    setShowCreateMomentDialog(false);
    setShowMomentViewer(false);
    setViewingMomentOwnerDetails(null);
    setSelectedPostForDetail(null);
    setShowServiceBookingDialog(false);
    setBookingTargetProfile(null);
    setActiveBookings([]);
    setSelectedRestaurantId(null);
    setLocalFoodCartItems([]);
    setSelectedShoppingCategoryId(null);
    setSelectedProductId(null);
    setShoppingCartItems([]);
    setShowMessagesNotifications(false);
    setShowChatDetailScreen(false);
    setCurrentChatContext(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  }, [toast]);

  const handleTabSelection = useCallback((tab: TabName) => {
    setActiveTabInternal(tab);
    setShowSideMenu(false);

    const detailTabs: TabName[] = [
        'business-detail', 'individual-profile', 'skillset-profile',
        'manage-skillset-profile', 'manage-business-profile', 'job-detail',
        'professional-profile', 'account-settings', 'digital-id-card',
        'create-post', 'detailed-post', 'service-booking',
        'food-restaurant-detail', 'unified-cart',
        'shopping-products-list', 'shopping-product-detail', 'shopping-cart'
    ];

    if (!detailTabs.includes(tab)) {
        setSelectedBusinessProfileId(null);
        setBusinessProfileToManageId(null);
        setSelectedIndividualProfileId(null);
        setSelectedSkillsetProfileId(null);
        setSkillsetProfileToManageId(null);
        setSelectedJobId(null);
        setSelectedPostForDetail(null);
        setBookingTargetProfile(null);
        if (!tab.startsWith('food-') && tab !== 'unified-cart') {
            setSelectedRestaurantId(null);
        }
        if (!tab.startsWith('shopping-')) {
            setSelectedShoppingCategoryId(null);
            setSelectedProductId(null);
        }
    }

    if (tab === 'business-profiles' && isLoggedIn) {
        fetchBusinessProfiles();
    }
  }, [fetchBusinessProfiles, isLoggedIn]);

  const setActiveTab = handleTabSelection;

  const handleSelectSkillsetProfile = useCallback((skillsetProfileId: string) => {
    setSelectedSkillsetProfileId(skillsetProfileId);
    setActiveTab('skillset-profile');
    setShowSideMenu(false);
  }, [setActiveTab]);

  const handleSelectIndividualProfile = useCallback((profileId: string) => {
    if (profileId === 'jenson-interior-stylist-123' || profileId === 'plumbing-profile-johndoe-123' ||
        (profileId.startsWith('prof') && profileId.endsWith('-skillset'))) { 
        handleSelectSkillsetProfile(profileId);
        return;
    }
    if (userData && profileId === userData.id) { 
        setActiveTab('account');
    } else if (profileId) { 
        setSelectedIndividualProfileId(profileId);
        setActiveTab('individual-profile');
    }
    setShowSideMenu(false);
  }, [userData, handleSelectSkillsetProfile, setActiveTab]);


  const handleSelectBusinessProfile = useCallback((profileId: string) => {
    setSelectedBusinessProfileId(profileId);
    setActiveTab('business-detail');
    setShowSideMenu(false);
  }, [setActiveTab]);

  const handleManageBusinessProfile = useCallback((profileId: string) => {
    setBusinessProfileToManageId(profileId);
    setActiveTab('manage-business-profile');
    setShowSideMenu(false);
  }, [setActiveTab]);

  const handleBackFromBusinessDetail = useCallback(() => {
    setActiveTab('business-profiles');
    setSelectedBusinessProfileId(null);
  }, [setActiveTab]);

  const handleBackFromManageBusinessProfile = useCallback(() => {
    setBusinessProfileToManageId(null);
    setActiveTab('business-profiles');
  }, [setActiveTab]);


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

  const handleGlobalAddToCart = useCallback((business: {id: string | number; name: string}, product: {id: string; name: string; price: string; imageUrl?: string; imageAiHint?: string}) => {
    globalAddToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        businessId: business.id,
        businessName: business.name,
        imageUrl: product.imageUrl,
        imageAiHint: product.imageAiHint
    });
  }, [globalAddToCart]);

  const handleCreatePost = useCallback((content: string, media?: MediaAttachment) => {
    if (!userData) {
        toast({ title: "Not Logged In", description: "You must be logged in to create a post.", variant: "destructive" });
        return;
    }
    const newPost: ProfilePost = {
        id: `post-${Date.now()}`,
        user: userData.name,
        userId: userData.id,
        userImage: userData.avatarUrl,
        userImageAiHint: userData.avatarAiHint,
        content: content,
        media: media,
        timestamp: formatDistanceToNow(new Date(), { addSuffix: true }),
        likes: 0,
        comments: 0,
        commentsData: []
    };
    setUserPosts(prevPosts => [newPost, ...prevPosts]);
    toast({ title: "Post Created!", description: "Your new post has been added." });
    setActiveTab('account');
  }, [userData, toast, setActiveTab]);

  const handleViewPostDetail = useCallback((post: FeedItem | ProfilePost) => {
    setSelectedPostForDetail(post);
    setActiveTab('detailed-post');
  }, [setActiveTab]);

  const handlePostCommentOnDetail = useCallback((postId: string | number, commentText: string) => {
    if (!userData) {
      toast({ title: "Error", description: "You must be logged in to comment."});
      return;
    }
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: userData.name,
      userAvatar: userData.avatarUrl,
      userAvatarAiHint: userData.avatarAiHint,
      text: commentText,
      timestamp: formatDistanceToNow(new Date(), { addSuffix: true })
    };

    setFeedItems(prevItems => prevItems.map(item => {
      if (item.id === postId) {
        return {
          ...item,
          comments: (item.comments || 0) + 1,
          commentsData: [...(item.commentsData || []), newComment]
        };
      }
      return item;
    }));

    setUserPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: (post.comments || 0) + 1,
          commentsData: [...(post.commentsData || []), newComment]
        };
      }
      return post;
    }));

    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
        setSelectedPostForDetail(prevSelectedPost => {
            if (!prevSelectedPost) return null;
            return {
                ...prevSelectedPost,
                comments: (prevSelectedPost.comments || 0) + 1,
                commentsData: [...(prevSelectedPost.commentsData || []), newComment]
            };
        });
    }

    toast({ title: "Comment Posted", description: "Your comment has been added." });
  }, [userData, toast, selectedPostForDetail]);


  const handleCreateMoment = useCallback((imageUrl: string, caption?: string, aiHint?: string) => {
    if (!userData) {
      toast({ title: "Not Logged In", description: "You must be logged in to create a moment.", variant: "destructive" });
      return;
    }
    const newMoment: UserMoment = {
      id: `moment-${Date.now()}`,
      imageUrl,
      caption,
      aiHint,
      timestamp: new Date().toISOString(),
    };
    const updatedMoments = [newMoment, ...userMoments];
    setUserMoments(updatedMoments);
    setUserData(prevUserData => prevUserData ? ({ ...prevUserData, moments: updatedMoments }) : null);
    toast({ title: "Moment Posted!", description: "Your new moment has been added." });
    setShowCreateMomentDialog(false);
  }, [userData, userMoments, toast]);

  const handleAddMomentFromAccount = useCallback(() => {
    setShowCreateMomentDialog(true);
  }, []);

  const handleViewUserMomentsFromAccount = useCallback(() => {
    if (userData) {
        setViewingMomentOwnerDetails({
            name: userData.name,
            avatarUrl: userData.avatarUrl,
            avatarAiHint: userData.avatarAiHint,
            profileId: userData.id
        });
        setMomentsToDisplayInViewer(userMoments);
        setShowMomentViewer(true);
    } else {
      toast({ title: "Error", description: "User data not available." });
    }
  }, [toast, userData, userMoments]);

  const handleViewUserMoments = useCallback((profileId?: string, userName?: string, userAvatarUrl?: string, userAvatarAiHint?: string) => {
    let ownerDetails: ViewingMomentOwnerDetails | null = null;
    const defaultAvatarAiHint = 'person avatar';

    if (userName && profileId) {
        ownerDetails = { name: userName, avatarUrl: userAvatarUrl, avatarAiHint: userAvatarAiHint || defaultAvatarAiHint, profileId };
    } else if (profileId) {
        const categoryUser = initialCategoriesData.find(cat => cat.profileId === profileId);
        if (categoryUser) {
            ownerDetails = { name: categoryUser.name || 'User', avatarUrl: categoryUser.image, avatarAiHint: categoryUser.dataAiHint || defaultAvatarAiHint, profileId };
        } else {
             const businessProfileUser = businessProfilesData.find(bp => bp.id === profileId);
             if (businessProfileUser) {
                 ownerDetails = { name: businessProfileUser.name, avatarUrl: businessProfileUser.logo, avatarAiHint: businessProfileUser.logoAiHint || 'business logo', profileId };
             } else if (userData && profileId === userData.id) {
                 ownerDetails = { name: userData.name, avatarUrl: userData.avatarUrl, avatarAiHint: userData.avatarAiHint || defaultAvatarAiHint, profileId: userData.id };
             } else {
                ownerDetails = { name: `User ${profileId.substring(0,5)}...`, avatarUrl: `https://source.unsplash.com/random/48x48/?${defaultAvatarAiHint.split(' ').join(',')}`, avatarAiHint: defaultAvatarAiHint, profileId };
             }
        }
    } else if (userData) {
        ownerDetails = { name: userData.name, avatarUrl: userData.avatarUrl, avatarAiHint: userData.avatarAiHint || defaultAvatarAiHint, profileId: userData.id };
    }

    if (ownerDetails) {
        setViewingMomentOwnerDetails(ownerDetails);
        if (ownerDetails.profileId === userData?.id) {
            setMomentsToDisplayInViewer(userMoments);
        } else {
            const otherUserDisplayMoments = genericOtherUserMoments.map(m => ({
                ...m,
                id: `${ownerDetails!.profileId}-${m.id}`, 
                caption: m.caption || `${ownerDetails!.name}'s Moment`,
            }));
            setMomentsToDisplayInViewer(otherUserDisplayMoments.length > 0 ? otherUserDisplayMoments : [{id: 'no-moments-placeholder', imageUrl: 'https://placehold.co/1080x1920.png', aiHint: 'empty state', caption: `${ownerDetails!.name} hasn't posted any moments yet.`, timestamp: new Date().toISOString()}]);
        }
        setShowMomentViewer(true);
    } else {
        toast({ title: "Please Log In", description: "Log in to view or create moments." });
    }
  }, [userData, userMoments, toast, initialCategoriesData, businessProfilesData]);


  const handleNavigateToOwnerProfileFromMomentViewer = useCallback(() => {
    if (viewingMomentOwnerDetails?.profileId) {
        setShowMomentViewer(false);
        const isBusiness = businessProfilesData.some(bp => bp.id === viewingMomentOwnerDetails.profileId);
        if (isBusiness) {
            handleSelectBusinessProfile(viewingMomentOwnerDetails.profileId);
        } else {
            handleSelectIndividualProfile(viewingMomentOwnerDetails.profileId);
        }
    }
  }, [viewingMomentOwnerDetails, handleSelectIndividualProfile, handleSelectBusinessProfile, businessProfilesData]);

  // --- Ride Hailing Simulation ---
  const handleRideRequest = useCallback((rideData: { pickup: string; dropoff: string; vehicleId: string }) => {
      console.log('Ride request received in page.tsx:', rideData);
      const rideDetails: ActivityDetails = {
          type: 'ride',
          status: 'looking_for_driver',
          pickup: rideData.pickup,
          dropoff: rideData.dropoff,
          vehicle: rideData.vehicleId,
      };
      setActivityDetails(rideDetails);
      setIsActiveActivityViewVisible(true);

      setTimeout(() => {
          setActivityDetails(prev => {
            if (prev?.type === 'ride' && prev?.status === 'looking_for_driver') {
              console.log("Simulating driver found for rider");
              return {
                ...prev,
                status: 'driver_assigned',
                driverName: 'Sim Driver',
                vehicle: `${prev.vehicle || 'Vehicle'} - XX00YZ0000 (Simulated)`,
              };
            }
            return prev;
          });
      }, 6000);
  }, []);

  useEffect(() => {
    console.log('[Driver/Delivery Sim Effect] Running. States:', { isLoggedIn, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, activityDetailsType: activityDetails?.type, isActiveActivityViewVisible });
    let onlineTimer: NodeJS.Timeout;
    let requestTimeout: NodeJS.Timeout;

    const canSimulate = isLoggedIn && !activityDetails && !isActiveActivityViewVisible;

    if (canSimulate && (isTaxiDriverOnlineSim || isDeliveryDriverOnlineSim)) {
        console.log('[Driver/Delivery Sim Effect] Condition 1 MET. Starting onlineTimer (5s).');
        onlineTimer = setTimeout(() => {
            console.log('[Driver/Delivery Sim Effect] onlineTimer FIRED. Re-checking conditions.');
            if (isLoggedIn && !activityDetails && !isActiveActivityViewVisible) { // Re-check if still valid
                if (isTaxiDriverOnlineSim) {
                    console.log('[Driver/Delivery Sim Effect] Condition 2 MET for Taxi. Simulating driver going online.');
                    toast({ title: "You are Online (Taxi Driver Sim)", description: "Waiting for ride requests." });
                    setActivityDetails({ type: 'driver_status', status: 'driver_online_idle'});
                    setIsActiveActivityViewVisible(true); // Show the FAB immediately

                    requestTimeout = setTimeout(() => {
                        if (isTaxiDriverOnlineSim && activityDetails?.type === 'driver_status' && activityDetails?.status === 'driver_online_idle' && isLoggedIn) {
                            console.log('[Driver/Delivery Sim Effect] Condition 3 MET for Taxi. Simulating taxi request.');
                            setActivityDetails({
                                type: 'request', status: 'ride_in_progress', // Simplified for now
                                riderName: 'Simulated Rider', pickup: '123 Frontend St, Anytown', dropoff: '789 Backend Ave, Otherville',
                                fare: '₹180', vehicleType: 'Car (Mini)', distance: '5 km',
                            });
                        }
                    }, 8000);
                } else if (isDeliveryDriverOnlineSim) {
                    console.log('[Driver/Delivery Sim Effect] Condition 2 MET for Delivery. Simulating driver going online for deliveries.');
                    toast({ title: "You are Online (Delivery Sim)", description: "Waiting for delivery requests." });
                    setActivityDetails({ type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)' }); // Specify context
                    setIsActiveActivityViewVisible(true);

                    requestTimeout = setTimeout(() => {
                         if (isDeliveryDriverOnlineSim && activityDetails?.type === 'driver_status' && activityDetails?.status === 'driver_online_idle' && isLoggedIn) {
                            console.log('[Driver/Delivery Sim Effect] Condition 3 MET for Delivery. Simulating delivery request.');
                            setActivityDetails({
                                type: 'delivery_request', status: 'delivery_pending_acceptance',
                                pickup: 'Green Veggies Store, Main St', dropoff: 'Apt 101, Park View Residency',
                                itemName: 'Groceries Package', itemDescription: '1 bag, approx 2kg',
                                estimatedPayment: '₹55',
                            });
                        }
                    }, 9000); // Slightly different timing for variety
                }
            } else {
                console.log('[Driver/Delivery Sim Effect] onlineTimer fired, but conditions no longer met.');
            }
        }, 5000);
    }

    return () => {
        clearTimeout(onlineTimer);
        clearTimeout(requestTimeout);
    };
  }, [isLoggedIn, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, activityDetails, isActiveActivityViewVisible, toast]);


  const handleFabClick = useCallback(() => {
    if (!isLoggedIn) return;

    if (isTaxiDriverOnlineSim && !activityDetails) {
         setIsActiveActivityViewVisible(true);
         setActivityDetails({ type: 'driver_status', status: 'driver_online_idle'});
         return;
    }
    if (isDeliveryDriverOnlineSim && !activityDetails) {
        setIsActiveActivityViewVisible(true);
        setActivityDetails({ type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)' });
        return;
    }

     if (activityDetails) {
         setIsActiveActivityViewVisible(true);
     }
  }, [isLoggedIn, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, activityDetails]);
  
   useEffect(() => {
    if (isLoggedIn && (isTaxiDriverOnlineSim || isDeliveryDriverOnlineSim || activityDetails)) {
        setIsFabVisible(true);
    } else {
        setIsFabVisible(false);
        if (!activityDetails) {
             setIsActiveActivityViewVisible(false);
        }
    }
  }, [isLoggedIn, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, activityDetails]);


  const handleCloseActivityView = useCallback(() => {
    setIsActiveActivityViewVisible(false);
    const currentType = activityDetails?.type;
    const currentStatus = activityDetails?.status;

    if (currentType === 'driver_status' && currentStatus === 'driver_online_idle') {
        // Don't clear, driver is just idle
    } else if (
        (currentType === 'request' || currentType === 'ride' || currentType === 'delivery_request' || currentType === 'delivery_task') &&
        currentStatus !== 'ride_completed' && currentStatus !== 'ride_cancelled' &&
        currentStatus !== 'delivery_completed' && currentStatus !== 'delivery_cancelled'
    ) {
        // Keep the activity if it's ongoing (e.g., en_route, picked_up)
        // but not if it's just an incoming request that wasn't accepted or a final state.
        // If it was just a 'request' or 'delivery_request' and not accepted, clear it.
        if (currentType === 'request' || (currentType === 'delivery_request' && currentStatus === 'delivery_pending_acceptance')) {
           // No, actually keep it if driver closes it.
        }
    } else {
        // For completed/cancelled or if no specific ongoing condition met
        // setActivityDetails(null); // This might be too aggressive, let user "go offline" or complete task
    }
  }, [activityDetails]);

  useEffect(() => {
    if (isLoggedIn && activityDetails && (activityDetails.type === 'request' || activityDetails.type === 'delivery_request') && !isActiveActivityViewVisible) {
        setIsActiveActivityViewVisible(true);
    }
  }, [isLoggedIn, activityDetails, isActiveActivityViewVisible]);


  const handleAcceptRequest = useCallback(() => { // Taxi Ride
      if (activityDetails?.type === 'request') {
          setActivityDetails(prev => ({
            ...prev,
            type: 'ride',
            status: 'en_route_to_pickup',
          }));
          toast({ title: "Ride Accepted", description: "Proceed to pickup location." });
      }
  }, [activityDetails, toast]);

  const handleRejectRequest = useCallback(() => { // Taxi Ride
      setActivityDetails(null); // Clears the request from driver's view
      setIsActiveActivityViewVisible(false);
      // Potentially go back to 'driver_online_idle' if they were online
      if (isTaxiDriverOnlineSim) {
          setActivityDetails({ type: 'driver_status', status: 'driver_online_idle' });
          setIsActiveActivityViewVisible(true); // Keep FAB view open showing idle status
      }
      toast({ title: "Request Rejected", description: "You rejected the ride request." });
  }, [toast, isTaxiDriverOnlineSim]);

  const handleArrivedAtPickup = useCallback(() => { // Taxi Ride
      if (activityDetails?.type === 'ride' && activityDetails.status === 'en_route_to_pickup') {
          setActivityDetails(prev => prev ? ({ ...prev, status: 'arrived_at_pickup' }) : null);
          toast({ title: "Arrived", description: "You have arrived at the pickup location." });
      }
  }, [activityDetails, toast]);

  const handleStartRide = useCallback(() => { // Taxi Ride
      if (activityDetails?.type === 'ride' && activityDetails.status === 'arrived_at_pickup') {
          setActivityDetails(prev => prev ? ({ ...prev, status: 'ride_in_progress' }) : null);
          toast({ title: "Ride Started", description: "Ride in progress." });
      }
  }, [activityDetails, toast]);

  const handleEndRide = useCallback(() => { // Taxi Ride
      if (activityDetails?.type === 'ride') {
          const currentRole = activityDetails.driverName ? 'rider' : 'driver';
          toast({ title: "Ride Completed", description: `Ride has ended. (${currentRole} perspective)` });
          setActivityDetails(prev => prev ? ({ ...prev, status: 'ride_completed' }) : null);
          setTimeout(() => {
              setActivityDetails(null);
              setIsActiveActivityViewVisible(false);
              if (isTaxiDriverOnlineSim) setActivityDetails({ type: 'driver_status', status: 'driver_online_idle' });
          }, 3000);
      }
  }, [activityDetails, toast, isTaxiDriverOnlineSim]);

  const handleCancelRide = useCallback(() => { // Taxi Ride & Delivery
      if (activityDetails?.type === 'ride' || activityDetails?.type === 'request' || activityDetails?.type === 'delivery_task' || activityDetails?.type === 'delivery_request') {
        const isDelivery = activityDetails.type === 'delivery_task' || activityDetails.type === 'delivery_request';
        const newStatus = isDelivery ? 'delivery_cancelled' : 'ride_cancelled';
        toast({ title: isDelivery ? "Delivery Cancelled" : "Ride Cancelled", description: `The ${isDelivery ? 'delivery' : 'ride'} has been cancelled.` });
        setActivityDetails(prev => prev ? ({ ...prev, status: newStatus }) : null);
        setTimeout(() => {
            setActivityDetails(null);
            setIsActiveActivityViewVisible(false);
            if (isTaxiDriverOnlineSim && !isDelivery) setActivityDetails({ type: 'driver_status', status: 'driver_online_idle' });
            if (isDeliveryDriverOnlineSim && isDelivery) setActivityDetails({ type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)' });
        }, 3000);
      }
  }, [activityDetails, toast, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim]);

  const handleContactDriver = useCallback(() => {
      toast({ title: "Contacting Driver", description: "Simulating contact..." });
  }, [toast]);

  const handleGoOffline = useCallback((mode: 'taxi' | 'delivery') => {
      if (mode === 'taxi') setIsTaxiDriverOnlineSim(false);
      if (mode === 'delivery') setIsDeliveryDriverOnlineSim(false);
      setActivityDetails(null);
      setIsActiveActivityViewVisible(false);
      toast({ title: "Offline", description: `You are now offline for ${mode} services.` });
  }, [toast]);

  // --- Delivery Specific Handlers ---
  const handleAcceptDelivery = useCallback(() => {
    if (activityDetails?.type === 'delivery_request') {
      setActivityDetails(prev => ({
        ...prev,
        type: 'delivery_task',
        status: 'delivery_accepted_en_route_pickup',
      }));
      toast({ title: "Delivery Accepted", description: "Proceed to pickup location for the item." });
    }
  }, [activityDetails, toast]);

  const handleRejectDelivery = useCallback(() => {
    setActivityDetails(null);
    setIsActiveActivityViewVisible(false);
    if (isDeliveryDriverOnlineSim) {
      setActivityDetails({ type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)' });
      setIsActiveActivityViewVisible(true);
    }
    toast({ title: "Delivery Rejected", description: "You rejected the delivery request." });
  }, [toast, isDeliveryDriverOnlineSim]);

  const handleItemPickedUp = useCallback(() => {
    if (activityDetails?.type === 'delivery_task' && activityDetails.status === 'delivery_arrived_at_pickup') {
      setActivityDetails(prev => prev ? ({ ...prev, status: 'delivery_picked_up_en_route_dropoff' }) : null);
      toast({ title: "Item Picked Up", description: "Proceed to deliver the item to the recipient." });
    }
  }, [activityDetails, toast]);
  
  const handleArrivedAtDeliveryPickup = useCallback(() => {
    if (activityDetails?.type === 'delivery_task' && activityDetails.status === 'delivery_accepted_en_route_pickup') {
        setActivityDetails(prev => prev ? ({ ...prev, status: 'delivery_arrived_at_pickup' }) : null);
        toast({ title: "Arrived at Pickup", description: "You have arrived at the item pickup location." });
    }
  }, [activityDetails, toast]);
  
  const handleArrivedAtDeliveryDropoff = useCallback(() => {
      if (activityDetails?.type === 'delivery_task' && activityDetails.status === 'delivery_picked_up_en_route_dropoff') {
          setActivityDetails(prev => prev ? ({ ...prev, status: 'delivery_arrived_at_dropoff' }) : null);
          toast({ title: "Arrived at Drop-off", description: "You have arrived at the delivery destination." });
      }
  }, [activityDetails, toast]);


  const handleCompleteDelivery = useCallback(() => {
    if (activityDetails?.type === 'delivery_task' && (activityDetails.status === 'delivery_picked_up_en_route_dropoff' || activityDetails.status === 'delivery_arrived_at_dropoff')) {
      toast({ title: "Delivery Completed", description: "The item has been successfully delivered." });
      setActivityDetails(prev => prev ? ({ ...prev, status: 'delivery_completed' }) : null);
      setTimeout(() => {
        setActivityDetails(null);
        setIsActiveActivityViewVisible(false);
        if (isDeliveryDriverOnlineSim) setActivityDetails({ type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)' });
      }, 3000);
    }
  }, [activityDetails, toast, isDeliveryDriverOnlineSim]);

  useEffect(() => {
    let autoAcceptTimer: NodeJS.Timeout;
    if (isActiveActivityViewVisible && (activityDetails?.type === 'request' || activityDetails?.type === 'delivery_request') && isLoggedIn) {
      const isTaxiRequest = activityDetails?.type === 'request' && !activityDetails?.driverName;
      const isDeliveryReq = activityDetails?.type === 'delivery_request';

      if(isTaxiRequest || isDeliveryReq) {
        console.log(`Setting up auto-action timer for ${activityDetails?.type}.`);
        autoAcceptTimer = setTimeout(() => {
          if(activityDetails?.type === 'request' && isTaxiRequest && isLoggedIn) {
            console.log("Simulating driver auto-accept for taxi due to timeout.");
            handleAcceptRequest();
          } else if (activityDetails?.type === 'delivery_request' && isDeliveryReq && isLoggedIn) {
            console.log("Simulating driver auto-accept for delivery due to timeout.");
            handleAcceptDelivery();
          }
        }, 7000); // 7 seconds for auto-accept
      }
      return () => {
        clearTimeout(autoAcceptTimer);
      }
    }
  }, [isActiveActivityViewVisible, activityDetails, isLoggedIn, handleAcceptRequest, handleAcceptDelivery]);

  const handleOpenServiceBooking = useCallback((profileId: string, profileName: string, skillName: string) => {
    setBookingTargetProfile({ id: profileId, name: profileName, skillName });
    setShowServiceBookingDialog(true);
    setActiveTab('service-booking');
  }, [setActiveTab]);

  const handleConfirmServiceBooking = useCallback((request: ServiceBookingRequest) => {
    const newBooking: ActiveBooking = {
      id: `booking-${Date.now()}`,
      ...request,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      bookingDate: `${request.requestedDate ? format(new Date(request.requestedDate), 'PPP') : 'Date TBD'}${request.requestedTime ? `, ${request.requestedTime}` : ''}`
    };
    setActiveBookings(prev => [newBooking, ...prev]);
    setShowServiceBookingDialog(false);
    setBookingTargetProfile(null);
    toast({
      title: "Booking Request Sent!",
      description: `Your request for ${request.skillName} with ${request.professionalName} has been submitted.`,
    });
    setActiveTab('skillset-profile');
  }, [toast, setActiveTab]);

  const handleSelectFoodRestaurant = useCallback((restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setActiveTab('food-restaurant-detail');
  }, [setActiveTab, setSelectedRestaurantId]);

  const handleAddItemToLocalFoodCart = useCallback((menuItem: MenuItem, restaurantId: string, restaurantName: string) => {
    setLocalFoodCartItems(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.menuItemId === menuItem.id && item.restaurantId === restaurantId);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { ...menuItem, menuItemId: menuItem.id, quantity: 1, restaurantId, restaurantName }];
      }
    });
    toast({ title: "Added to Food Order", description: `${menuItem.name} added.` });
  }, [toast]);

  const handleUpdateLocalFoodCartItemQuantity = useCallback((menuItemId: string, newQuantity: number) => {
    setLocalFoodCartItems(prevCart =>
      prevCart.map(item =>
        item.menuItemId === menuItemId ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const handleRemoveLocalFoodCartItem = useCallback((menuItemId: string) => {
    setLocalFoodCartItems(prevCart => prevCart.filter(item => item.menuItemId !== menuItemId));
    toast({ title: "Item Removed", description: "Item removed from your food order.", variant: "destructive" });
  }, [toast]);

  const handleLocalFoodCheckout = useCallback(() => {
    if (localFoodCartItems.length === 0) {
        toast({ title: "Empty Food Order", description: "Your food order is empty.", variant: "destructive"});
        return;
    }
    toast({ title: "Food Order Placed (Simulated)", description: "Your food order has been placed successfully!" });
    setLocalFoodCartItems([]);
    setActiveTab('home');
  }, [localFoodCartItems, toast, setActiveTab]);


  const handleNavigateToCart = useCallback(() => {
    setActiveTab('unified-cart');
  }, [setActiveTab]);

  const handleSelectShoppingCategory = useCallback((categoryId: string) => {
    setSelectedShoppingCategoryId(categoryId);
    setActiveTab('shopping-products-list');
  }, [setActiveTab]);

  const handleSelectShoppingProduct = useCallback((productId: string) => {
    setSelectedProductId(productId);
    setActiveTab('shopping-product-detail');
  }, [setActiveTab]);

  const handleAddItemToShoppingCart = useCallback((product: ProductListing, quantity: number) => {
    setShoppingCartItems(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => item.productId === product.id);
        if (existingItemIndex > -1) {
            const updatedCart = [...prevCart];
            updatedCart[existingItemIndex].quantity += quantity;
            return updatedCart;
        } else {
            return [...prevCart, {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                imageUrl: product.imageUrl,
                imageAiHint: product.imageAiHint
            }];
        }
    });
    toast({ title: "Added to Shopping Cart", description: `${quantity} x ${product.name} added.` });
  }, [toast]);

  const handleUpdateShoppingCartItemQuantity = useCallback((productId: string, newQuantity: number) => {
    setShoppingCartItems(prevCart =>
      prevCart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const handleRemoveShoppingCartItem = useCallback((productId: string) => {
    setShoppingCartItems(prevCart => prevCart.filter(item => item.productId !== productId));
    toast({ title: "Item Removed", description: "Item removed from your shopping cart.", variant: "destructive" });
  }, [toast]);

  const handleShoppingCheckout = useCallback(() => {
    if (shoppingCartItems.length === 0) {
        toast({ title: "Empty Cart", description: "Your shopping cart is empty.", variant: "destructive"});
        return;
    }
    toast({ title: "Purchase Complete (Simulated)", description: "Thank you for your purchase!" });
    setShoppingCartItems([]);
    setActiveTab('home');
  }, [shoppingCartItems, toast, setActiveTab]);


  const handleOpenChatDetail = useCallback((messageItem: MessageItem) => {
    if (!userData) {
      toast({ title: "Error", description: "User data not available for chat.", variant: "destructive" });
      return;
    }
    const mockMessages: ChatMessage[] = [
      { id: `msg-${Date.now() - 2000}`, text: messageItem.content, timestamp: messageItem.timestamp, isSender: false, avatar: messageItem.senderImage, avatarAiHint: messageItem.senderImageAiHint },
      { id: `msg-${Date.now() - 1000}`, text: "Okay, I see. Thanks for letting me know!", timestamp: "1 min ago", isSender: true, avatar: userData.avatarUrl, avatarAiHint: userData.avatarAiHint },
      { id: `msg-${Date.now()}`, text: "No problem! Glad I could help.", timestamp: "Just now", isSender: false, avatar: messageItem.senderImage, avatarAiHint: messageItem.senderImageAiHint },
    ];

    setCurrentChatContext({
      senderName: messageItem.sender,
      senderAvatar: messageItem.senderImage,
      senderAvatarAiHint: messageItem.senderImageAiHint,
      messages: mockMessages,
      originalMessageId: messageItem.id,
    });
    setShowMessagesNotifications(false);
    setShowChatDetailScreen(true);
  }, [userData, toast]);

  const handleSendMessageInChatDetail = useCallback((text: string) => {
    if (!currentChatContext || !userData) return;

    const newMessage: ChatMessage = {
      id: `msg-sent-${Date.now()}`,
      text: text,
      timestamp: "Just now",
      isSender: true,
      avatar: userData.avatarUrl,
      avatarAiHint: userData.avatarAiHint,
    };

    setCurrentChatContext(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);
  }, [currentChatContext, userData]);

  const handleToggleDeliveryDriverOnline = useCallback(() => {
    setIsDeliveryDriverOnlineSim(prev => {
        const newState = !prev;
        if (newState) {
            setIsTaxiDriverOnlineSim(false); // Can't be both
            setActivityDetails({type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)'});
            setIsActiveActivityViewVisible(true);
            toast({ title: "Online for Deliveries", description: "You are now available for delivery requests." });
        } else {
            if(activityDetails?.type === 'driver_status' && activityDetails?.vehicleType === 'Bike (Delivery)') {
                setActivityDetails(null);
                setIsActiveActivityViewVisible(false);
            }
            toast({ title: "Offline for Deliveries", description: "You are no longer available for delivery requests." });
        }
        return newState;
    });
  }, [toast, activityDetails]);
  
  const handleToggleTaxiDriverOnline = useCallback(() => {
      setIsTaxiDriverOnlineSim(prev => {
          const newState = !prev;
          if (newState) {
              setIsDeliveryDriverOnlineSim(false); // Can't be both
              setActivityDetails({ type: 'driver_status', status: 'driver_online_idle' });
              setIsActiveActivityViewVisible(true);
              toast({ title: "Online for Rides", description: "You are now available for taxi ride requests." });
          } else {
              if(activityDetails?.type === 'driver_status' && !activityDetails?.vehicleType) {
                  setActivityDetails(null);
                  setIsActiveActivityViewVisible(false);
              }
              toast({ title: "Offline for Rides", description: "You are no longer available for taxi ride requests." });
          }
          return newState;
      });
  }, [toast, activityDetails]);


  const renderScreenContent = useCallback(() => {
    if (!isClient) return null;

    if (!isLoggedIn) {
      if (activeTabInternal === 'registration') {
        return <RegistrationScreen setActiveTab={setActiveTab} onRegistrationSuccess={handleRegistrationSuccess} />;
      }
      return <LoginScreen setActiveTab={setActiveTab} onLoginSuccess={handleLoginSuccess} />;
    }

    switch (activeTabInternal) {
      case 'home': return <HomeScreen
                            setActiveTab={setActiveTab}
                            onSelectBusinessProfile={handleSelectBusinessProfile}
                            onSelectSkillsetProfile={handleSelectSkillsetProfile}
                            onAddToCart={(businessId, productId) => {
                                const business = businessProfilesData.find(b => b.id === businessId) || initialBusinessProfilesData.find(b => b.id === businessId);
                                const product = business?.products?.find(p => p.id === productId);
                                if (business && product) {
                                    handleGlobalAddToCart(business, product);
                                } else {
                                    toast({title: "Error", description: "Could not add product to cart.", variant: "destructive"});
                                }
                            }}
                         />;
      case 'feeds': return <FeedsScreen
                              feedItems={feedItems}
                              onViewUserProfile={handleSelectIndividualProfile}
                              onAddMomentClick={handleAddMomentFromAccount}
                              onViewUserMomentsClick={handleViewUserMoments}
                              onViewPostDetail={handleViewPostDetail}
                           />;
      case 'menu': return <ServicesScreen setActiveTab={setActiveTab} onRequestRide={handleRideRequest} />;
      case 'recommended': return <RecommendedScreen
                                    onViewUserMomentsClick={handleViewUserMoments}
                                    onViewUserProfile={handleSelectIndividualProfile}
                                    onViewPost={(postTitle) => toast({title: "Viewing Post", description: postTitle})}
                                 />;
      case 'account': return <AccountScreen
                                userData={userData}
                                setActiveTab={setActiveTab}
                                userPosts={userPosts}
                                userMoments={userMoments}
                                onAddMomentClick={handleAddMomentFromAccount}
                                onViewUserMomentsClick={handleViewUserMomentsFromAccount}
                                onViewPostDetail={handleViewPostDetail}
                                isTaxiDriverOnline={isTaxiDriverOnlineSim}
                                onToggleTaxiDriverOnline={handleToggleTaxiDriverOnline}
                                isDeliveryDriverOnline={isDeliveryDriverOnlineSim}
                                onToggleDeliveryDriverOnline={handleToggleDeliveryDriverOnline}
                             />;
      case 'create-post': return <CreatePostScreen onPost={handleCreatePost} onCancel={() => setActiveTab('account')} />;
      case 'detailed-post':
        if (selectedPostForDetail) {
          return (
            <DetailedPostScreen
              post={selectedPostForDetail}
              onPostComment={(commentText) => handlePostCommentOnDetail(selectedPostForDetail.id, commentText)}
              onBack={() => setActiveTab( (selectedPostForDetail as ProfilePost).userId === userData?.id ? 'account' : 'feeds')}
            />
          );
        }
        return <p className="p-4 text-center text-muted-foreground">Loading post details...</p>;
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
          ? { ...newBusinessProfileTemplate }
          : businessProfilesData.find(p => p.id === businessProfileToManageId);
        if (businessProfileToManageId && profileDataToManage) {
          return (
            <BusinessProfileManagementScreen
              key={businessProfileToManageId}
              initialProfileData={profileDataToManage}
              onSave={handleSaveBusinessProfile}
              onBack={handleBackFromManageBusinessProfile}
            />
          );
        }
        if (businessProfileToManageId !== 'new') {
            toast({ title: "Error", description: "Could not find business profile to manage.", variant: "destructive" });
            setActiveTab('business-profiles');
        }
        return <p className="p-4 text-center text-muted-foreground">Loading management screen...</p>;


      case 'individual-profile':
        if (selectedIndividualProfileId) {
             return <IndividualProfileScreen profileId={selectedIndividualProfileId} setActiveTab={setActiveTab} />;
        }
        if (userData && !selectedIndividualProfileId) { 
             setActiveTab('account');
             return <AccountScreen
                        userData={userData}
                        setActiveTab={setActiveTab}
                        userPosts={userPosts}
                        userMoments={userMoments}
                        onAddMomentClick={handleAddMomentFromAccount}
                        onViewUserMomentsClick={handleViewUserMomentsFromAccount}
                        onViewPostDetail={handleViewPostDetail}
                        isTaxiDriverOnline={isTaxiDriverOnlineSim}
                        onToggleTaxiDriverOnline={handleToggleTaxiDriverOnline}
                        isDeliveryDriverOnline={isDeliveryDriverOnlineSim}
                        onToggleDeliveryDriverOnline={handleToggleDeliveryDriverOnline}
                     />;
        }
        return <p className="p-4 text-center text-muted-foreground">No individual profile selected or user data missing.</p>;


      case 'skillset-profile':
        if (selectedSkillsetProfileId) {
          return <SkillsetProfileScreen skillsetProfileId={selectedSkillsetProfileId} setActiveTab={setActiveTab} onBookService={handleOpenServiceBooking} />;
        }
        return <p className="text-center text-muted-foreground">No skillset profile selected.</p>;

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

      case 'service-booking':
        if (bookingTargetProfile) {
            return <SkillsetProfileScreen skillsetProfileId={selectedSkillsetProfileId!} setActiveTab={setActiveTab} onBookService={handleOpenServiceBooking} />;
        }
        setActiveTab('home'); 
        return <p className="p-4 text-center text-muted-foreground">Loading booking screen...</p>;

      case 'food-restaurants':
        return <FoodRestaurantsScreen restaurants={restaurantsData} onSelectRestaurant={handleSelectFoodRestaurant} />;
      case 'food-restaurant-detail':
        const selectedRestaurant = restaurantsData.find(r => r.id === selectedRestaurantId);
        return <FoodRestaurantDetailScreen restaurant={selectedRestaurant || null} onAddToCart={(item, qty) => handleAddItemToLocalFoodCart(item, selectedRestaurantId!, selectedRestaurant?.name || 'Restaurant')} onBack={() => setActiveTab('food-restaurants')} />;

      case 'shopping-categories':
        return <ShoppingCategoriesScreen categories={productCategoriesData} onSelectCategory={handleSelectShoppingCategory} />;
      case 'shopping-products-list':
        const currentCategory = productCategoriesData.find(c => c.id === selectedShoppingCategoryId);
        const productsForCategory = productsData.filter(p => selectedShoppingCategoryId ? p.categoryIds.includes(selectedShoppingCategoryId) : true);
        return <ShoppingProductsListScreen products={productsForCategory} category={currentCategory || null} onSelectProduct={handleSelectShoppingProduct} onBack={() => setActiveTab('shopping-categories')} onAddToCart={handleAddItemToShoppingCart} />;
      case 'shopping-product-detail':
        const currentProduct = productsData.find(p => p.id === selectedProductId);
        return <ShoppingProductDetailScreen product={currentProduct || null} onAddToCart={handleAddItemToShoppingCart} onBack={() => setActiveTab('shopping-products-list')} />;
      case 'shopping-cart':
        return <ShoppingCartScreen cartItems={shoppingCartItems} onUpdateQuantity={handleUpdateShoppingCartItemQuantity} onRemoveItem={handleRemoveShoppingCartItem} onCheckout={handleShoppingCheckout} onBack={() => setActiveTab(selectedProductId ? 'shopping-product-detail' : (selectedShoppingCategoryId ? 'shopping-products-list' : 'shopping-categories'))} />;

      case 'unified-cart':
        const previousTab = activeTabInternal === 'food-restaurant-detail' && selectedRestaurantId ? 'food-restaurant-detail' : 'home';
        return <UnifiedCartScreen onBack={() => setActiveTab(previousTab)} setActiveTab={setActiveTab}/>;

      default: return <HomeScreen
                        setActiveTab={setActiveTab}
                        onSelectBusinessProfile={handleSelectBusinessProfile}
                        onSelectSkillsetProfile={handleSelectSkillsetProfile}
                        onAddToCart={(businessId, productId) => {
                            const business = businessProfilesData.find(b => b.id === businessId) || initialBusinessProfilesData.find(b => b.id === businessId);
                            const product = business?.products?.find(p => p.id === productId);
                            if (business && product) {
                                handleGlobalAddToCart(business, product);
                            } else {
                                toast({title: "Error", description: "Could not add product to cart.", variant: "destructive"});
                            }
                        }}
                      />;
    }
  }, [
    isClient, isLoggedIn, activeTabInternal, userData, businessProfilesData, isLoadingBusinessProfiles, userPosts, userMoments, feedItems,
    selectedBusinessProfileId, businessProfileToManageId,
    selectedIndividualProfileId, selectedSkillsetProfileId, skillsetProfileToManageId, selectedJobId, selectedPostForDetail,
    bookingTargetProfile,
    restaurantsData, selectedRestaurantId, localFoodCartItems,
    productCategoriesData, productsData, selectedShoppingCategoryId, selectedProductId, shoppingCartItems,
    isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, // Include new states
    handleLoginSuccess, handleRegistrationSuccess, setActiveTab,
    handleSelectBusinessProfile, handleManageBusinessProfile, handleBackFromBusinessDetail, handleBackFromManageBusinessProfile,
    handleSelectIndividualProfile, handleSelectSkillsetProfile, handleManageSkillsetProfile, handleBackFromManageSkillsetProfile,
    handleSelectJob, handleBackFromJobDetail, handleGlobalAddToCart, handleRideRequest,
    handleSaveBusinessProfile, handleDeleteBusinessProfile, handleToggleBusinessProfileActive,
    handleCreatePost, handleViewPostDetail, handlePostCommentOnDetail,
    handleAddMomentFromAccount, handleViewUserMomentsFromAccount,
    handleViewUserMoments,
    handleNavigateToOwnerProfileFromMomentViewer,
    handleOpenServiceBooking, handleConfirmServiceBooking,
    handleSelectFoodRestaurant, handleAddItemToLocalFoodCart, handleUpdateLocalFoodCartItemQuantity, handleRemoveLocalFoodCartItem, handleLocalFoodCheckout,
    handleSelectShoppingCategory, handleSelectShoppingProduct, handleAddItemToShoppingCart, handleUpdateShoppingCartItemQuantity, handleRemoveShoppingCartItem, handleShoppingCheckout,
    handleToggleTaxiDriverOnline, handleToggleDeliveryDriverOnline, // Include new handlers
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
        onCartClick={handleNavigateToCart}
        unreadCount={isLoggedIn ? 5 : 0}
      />

      {isLoggedIn && (
        <SideMenu
          isOpen={showSideMenu}
          onClose={() => setShowSideMenu(false)}
          activeTab={activeTabInternal}
          setActiveTab={setActiveTab}
          businessProfiles={businessProfilesData}
          onSelectBusinessProfile={(id) => handleSelectBusinessProfile(String(id))}
          selectedBusinessProfileId={selectedBusinessProfileId?.toString() ?? null}
          onLogout={handleLogout}
          userData={userData}
        />
      )}

      <div className="flex-grow overflow-hidden relative p-0">
        {renderScreenContent()}
      </div>

      {isLoggedIn && !['detailed-post', 'service-booking', 'food-restaurant-detail', 'unified-cart', 'shopping-product-detail', 'shopping-cart'].includes(activeTabInternal) && (
        <BottomNavigation activeTab={activeTabInternal} setActiveTab={setActiveTab} />
      )}

      {isClient && isLoggedIn && isFabVisible && (
        <FloatingActionButton
            onClick={handleFabClick}
            tooltipText={
              activityDetails?.type === 'driver_status' && activityDetails.status === 'driver_online_idle' && activityDetails.vehicleType === 'Bike (Delivery)'
                ? "Online for Deliveries"
                : activityDetails?.type === 'driver_status' && activityDetails.status === 'driver_online_idle'
                ? "Online for Rides"
                : "Open Activity View"
            }
        />
      )}

      {isClient && isLoggedIn && isActiveActivityViewVisible && (
        <ActiveActivityView
          isVisible={isActiveActivityViewVisible}
          onClose={handleCloseActivityView}
          userRole={
            (activityDetails?.type === 'request' || (activityDetails?.type === 'ride' && !activityDetails.driverName) || (activityDetails?.type === 'driver_status' && !activityDetails.vehicleType) || (activityDetails?.type === 'delivery_request') || (activityDetails?.type === 'delivery_task')) ? 'driver' :
            (activityDetails?.type === 'ride' && activityDetails.driverName) ? 'rider' :
            null
          }
          activeActivityDetails={activityDetails}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
          onArrivedAtPickup={handleArrivedAtPickup}
          onStartRide={handleStartRide}
          onEndRide={handleEndRide}
          onCancelRide={handleCancelRide}
          onContactDriver={handleContactDriver}
          onGoOffline={() => {
              if (activityDetails?.vehicleType === 'Bike (Delivery)' || isDeliveryDriverOnlineSim) handleGoOffline('delivery');
              else handleGoOffline('taxi');
          }}
          // Delivery actions
          onAcceptDelivery={handleAcceptDelivery}
          onRejectDelivery={handleRejectDelivery}
          onArrivedAtDeliveryPickup={handleArrivedAtDeliveryPickup}
          onItemPickedUp={handleItemPickedUp}
          onArrivedAtDeliveryDropoff={handleArrivedAtDeliveryDropoff}
          onCompleteDelivery={handleCompleteDelivery}
        />
      )}

      {isClient && showMessagesNotifications && (
        <MessagesNotificationsScreen
          onClose={() => setShowMessagesNotifications(false)}
          onOpenChatDetail={handleOpenChatDetail}
        />
      )}

      {isClient && isLoggedIn && showChatDetailScreen && currentChatContext && (
        <ChatDetailScreen
          isOpen={showChatDetailScreen}
          onClose={() => {
            setShowChatDetailScreen(false);
            setCurrentChatContext(null);
          }}
          chatContext={currentChatContext}
          onSendMessage={handleSendMessageInChatDetail}
          currentUserAvatar={userData?.avatarUrl}
          currentUserAvatarAiHint={userData?.avatarAiHint}
        />
      )}

      {isClient && isLoggedIn && showCreateMomentDialog && userData && (
        <CreateMomentDialog
          isOpen={showCreateMomentDialog}
          onClose={() => setShowCreateMomentDialog(false)}
          onCreateMoment={handleCreateMoment}
        />
      )}

      {isClient && isLoggedIn && showMomentViewer && viewingMomentOwnerDetails && (
        <MomentViewerScreen
          isOpen={showMomentViewer}
          onClose={() => { setShowMomentViewer(false); setViewingMomentOwnerDetails(null); }}
          moments={momentsToDisplayInViewer} 
          ownerName={viewingMomentOwnerDetails.name}
          ownerAvatarUrl={viewingMomentOwnerDetails.avatarUrl}
          ownerAvatarAiHint={viewingMomentOwnerDetails.avatarAiHint}
          onViewOwnerProfile={viewingMomentOwnerDetails.profileId ? handleNavigateToOwnerProfileFromMomentViewer : undefined}
        />
      )}

      {isClient && isLoggedIn && showServiceBookingDialog && bookingTargetProfile && (
        <ServiceBookingDialog
          isOpen={showServiceBookingDialog}
          onClose={() => {
            setShowServiceBookingDialog(false);
            setBookingTargetProfile(null);
            setActiveTab('skillset-profile');
          }}
          professionalId={bookingTargetProfile.id}
          professionalName={bookingTargetProfile.name}
          skillName={bookingTargetProfile.skillName}
          onSubmit={handleConfirmServiceBooking}
        />
      )}
    </div>
  );
}
