
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import SideMenu from '@/components/layout/SideMenu';
import LoginScreen from '@/components/screens/LoginScreen';
import RegistrationScreen from '@/components/screens/RegistrationScreen';
import HomeScreen from '@/components/screens/HomeScreen';
import FeedsScreen from '@/components/screens/FeedsScreen';
import RecommendedScreen from '@/components/screens/RecommendedScreen';
import ServicesScreen from '@/components/screens/ServicesScreen';
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
import MomentViewerScreen from '@/components/moments/MomentViewerScreen';
import ServiceBookingDialog from '@/components/services/ServiceBookingDialog';
import SplashScreen from '@/components/screens/SplashScreen';
import Loading from '@/app/loading'; // Import the main loading component
import { initialCategoriesData } from '@/lib/dummy-data/feedsCategories';
import { feedItems as initialFeedItemsData } from '@/lib/dummy-data/feedItems';
import { recommendedItems as initialRecommendedItemsData } from '@/lib/dummy-data/recommendedItems';
import { dummyBusinessProfiles } from '@/lib/dummy-data/businessProfiles';


import FoodRestaurantsScreen from '@/components/screens/food/FoodRestaurantsScreen';
import FoodRestaurantDetailScreen from '@/components/screens/food/FoodRestaurantDetailScreen';
import { dummyRestaurants } from '@/lib/dummy-data/restaurants';

import ShoppingCategoriesScreen from '@/components/screens/shopping/ShoppingCategoriesScreen';
import ShoppingProductsListScreen from '@/components/screens/shopping/ShoppingProductsListScreen';
import ShoppingProductDetailScreen from '@/components/screens/shopping/ShoppingProductDetailScreen';
import { dummyProductCategories } from '@/lib/dummy-data/productCategories';
import { dummyProducts } from '@/lib/dummy-data/products';

import UnifiedCartScreen from '@/components/screens/cart/UnifiedCartScreen';


import type {
    TabName, UserBusinessProfile, ActivityDetails, BusinessJob, UserDataForSideMenu,
    ProfilePost, MediaAttachment, UserMoment, Category as CategoryType, FeedItem, Comment,
    ServiceBookingRequest, ActiveBooking, BookingStatus,
    Restaurant, MenuItem,
    ProductCategory, ProductListing,
    MessageItem, NotificationItem, ChatMessage, ActivityType, ActivityStatus, UserVehicle
} from '@/types';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from 'date-fns';
import { useCart } from '@/context/CartContext';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase/client';


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
  const { user, loading: authLoading } = useAuth();
  const { addToCart: globalAddToCart } = useCart(); 
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  const [activeTabInternal, setActiveTabInternal] = useState<TabName>('home');
  const [authScreen, setAuthScreen] = useState<'login' | 'registration'>('login');
  const [showSideMenu, setShowSideMenu] = useState(false);

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
  const [isDeliveryDriverOnlineSim, setIsDeliveryDriverOnlineSim] = useState(false);
  const [isBusinessActiveSim, setIsBusinessActiveSim] = useState(false);

  const [userPosts, setUserPosts] = useState<ProfilePost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItemsData);
  const [recommendedItems, setRecommendedItems] = useState<FeedItem[]>(initialRecommendedItemsData);

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

  const [productCategoriesData, setProductCategoriesData] = useState<ProductCategory[]>(dummyProductCategories);
  const [productsData, setProductsData] = useState<ProductListing[]>(dummyProducts);
  const [selectedShoppingCategoryId, setSelectedShoppingCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [showMessagesNotifications, setShowMessagesNotifications] = useState(false);
  const [showChatDetailScreen, setShowChatDetailScreen] = useState(false);
  const [currentChatContext, setCurrentChatContext] = useState<CurrentChatContext | null>(null);

  const isLoggedIn = !!user;

  const fetchUserPosts = useCallback(async (userId: string) => {
    setIsLoadingPosts(true);
    try {
        const response = await fetch(`/api/posts?userId=${userId}`);
        if (!response.ok) {
            console.error("Failed to fetch user posts");
            toast({ title: "Error", description: "Could not load your posts.", variant: "destructive"});
            setUserPosts([]);
        } else {
            const posts: ProfilePost[] = await response.json();
            setUserPosts(posts);
        }
    } catch (error) {
        console.error("Network error fetching user posts:", error);
        toast({ title: "Error", description: "Could not load your posts due to a network error.", variant: "destructive"});
    } finally {
        setIsLoadingPosts(false);
    }
  }, [toast]);

  useEffect(() => {
    // This effect now reacts to the user state from the context
    if (user) {
        setActiveTabInternal('home');
        fetchUserPosts(user.id);
        fetchBusinessProfiles();
    } else {
        setActiveTabInternal('account'); // Show login screen
        setBusinessProfilesData([]);
        setUserPosts([]);
    }
  }, [user]);


  const fetchBusinessProfiles = useCallback(async () => {
    if (!isLoggedIn) {
      setBusinessProfilesData([]);
      return;
    }
    setIsLoadingBusinessProfiles(true);
    console.log("Fetching business profiles from API...");
    try {
      const response = await fetch('/api/business-profiles');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Could not parse error response from server.' }));
        const errorMessage = errorData.error || `Failed to fetch profiles: ${response.statusText}`;
        
        console.error("API error fetching business profiles:", errorMessage);
        
        toast({
          title: "Displaying Sample Data",
          description: "Could not connect to the database. Please check backend configuration.",
          variant: "default",
          duration: 10000,
        });
        
        setBusinessProfilesData(dummyBusinessProfiles);
        
      } else {
        const profiles: UserBusinessProfile[] = await response.json();
        setBusinessProfilesData(profiles);
        console.log("Business profiles loaded from API.");
      }

    } catch (error) {
      console.error("Network error fetching business profiles:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Displaying local sample data.",
        variant: "destructive",
        duration: 10000,
      });
      setBusinessProfilesData(dummyBusinessProfiles);
    } finally {
      setIsLoadingBusinessProfiles(false);
    }
  }, [toast, isLoggedIn]);

  const handleSaveBusinessProfile = useCallback(async (profileData: UserBusinessProfile) => {
    const isNew = !profileData.id || profileData.id.startsWith('bp-local-');
    const url = isNew ? '/api/business-profiles' : `/api/business-profiles/${profileData.id}`;
    const method = isNew ? 'POST' : 'PUT';

    setIsLoadingBusinessProfiles(true);
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isNew ? 'create' : 'update'} profile.`);
      }
      
      toast({
        title: isNew ? "Profile Created" : "Profile Updated",
        description: `"${result.name || profileData.name}" has been saved successfully.`,
      });
      await fetchBusinessProfiles();
    } catch (error) {
       console.error("Error saving business profile:", error);
       toast({ title: "Save Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
        setIsLoadingBusinessProfiles(false);
    }
  }, [toast, fetchBusinessProfiles]);

  const handleDeleteBusinessProfile = useCallback(async (profileId: string) => {
    setIsLoadingBusinessProfiles(true);
    try {
      const response = await fetch(`/api/business-profiles/${profileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete profile.");
      }
      toast({ title: "Profile Deleted", description: "The business profile has been deleted.", variant: "destructive" });
      await fetchBusinessProfiles();
    } catch (error) {
      console.error("Error deleting business profile:", error);
      toast({ title: "Deletion Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
        setIsLoadingBusinessProfiles(false);
    }
  }, [toast, fetchBusinessProfiles]);

  const handleToggleBusinessProfileActive = useCallback(async (profileId: string, newStatus: boolean) => {
    try {
      const response = await fetch(`/api/business-profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update profile status.");
      }

      setBusinessProfilesData(prevProfiles =>
        prevProfiles.map(p =>
          p.id === profileId ? { ...p, isActive: newStatus } : p
        )
      );

      toast({
        title: "Status Updated",
        description: `Profile is now ${newStatus ? 'active' : 'inactive'}.`,
      });

      setIsBusinessActiveSim(newStatus);
      if (newStatus) {
        setIsTaxiDriverOnlineSim(false);
        setIsDeliveryDriverOnlineSim(false);
        toast({ title: "Business Now Active", description: "You are now available to receive simulated product orders." });
      } else {
        if (activityDetails?.type === 'product_order_notification') {
          setActivityDetails(null);
          setIsActiveActivityViewVisible(false);
        }
        toast({ title: "Business Now Inactive", description: "You will no longer receive product orders." });
      }
      
      fetchBusinessProfiles();

    } catch (error) {
      console.error("Error toggling profile status:", error);
      toast({ title: "Update Failed", description: error instanceof Error ? error.message : "Could not update status.", variant: "destructive" });
      await fetchBusinessProfiles();
    }
  }, [toast, fetchBusinessProfiles, activityDetails]);


  const handleToggleVehicleActive = useCallback((vehicle: UserVehicle, newStatus: boolean) => {
      const lowerType = vehicle.vehicleType.toLowerCase();
      if (lowerType.includes('car') || lowerType.includes('auto')) {
          setIsTaxiDriverOnlineSim(newStatus);
          if (newStatus) {
              setIsDeliveryDriverOnlineSim(false);
              setIsBusinessActiveSim(false);
              setActivityDetails({ type: 'driver_status', status: 'driver_online_idle' });
              setIsActiveActivityViewVisible(true);
              toast({ title: "Online for Rides", description: `You are now available for taxi requests with ${vehicle.vehicleType}.` });
          } else {
              handleGoOffline('taxi');
          }
      } else if (lowerType.includes('bike')) {
          setIsDeliveryDriverOnlineSim(newStatus);
          if (newStatus) {
              setIsTaxiDriverOnlineSim(false);
              setIsBusinessActiveSim(false);
              setActivityDetails({type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)'});
              setIsActiveActivityViewVisible(true);
              toast({ title: "Online for Deliveries", description: `You are now available for delivery requests with your ${vehicle.vehicleType}.` });
          } else {
              handleGoOffline('delivery');
          }
      }
  }, [toast]);


  const handleLogout = useCallback(async (showToast = true) => {
    try {
      await signOut(auth);
      if (showToast) {
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
      }
      // Reset all local component state on logout
      setActiveTabInternal('home');
      setShowSideMenu(false);
      setIsFabVisible(false);
      setIsActiveActivityViewVisible(false);
      setActivityDetails(null);
      setIsTaxiDriverOnlineSim(false);
      setIsDeliveryDriverOnlineSim(false);
      setIsBusinessActiveSim(false);
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
      setSelectedShoppingCategoryId(null);
      setSelectedProductId(null);
      setShowMessagesNotifications(false);
      setShowChatDetailScreen(false);
      setCurrentChatContext(null);
    } catch (error) {
      console.error("Logout Error", error);
      toast({ title: "Logout Failed", description: "Could not log you out. Please try again.", variant: "destructive" });
    }
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
        'shopping-products-list', 'shopping-product-detail',
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
        if (tab !== 'food-restaurant-detail' && tab !== 'unified-cart' && !tab.startsWith('food-')) {
            setSelectedRestaurantId(null);
        }
        if (tab !== 'shopping-product-detail' && tab !== 'unified-cart' && !tab.startsWith('shopping-')) {
            setSelectedShoppingCategoryId(null);
            setSelectedProductId(null);
        }
    }

    if (tab === 'business-profiles' && isLoggedIn) {
        fetchBusinessProfiles();
    }
    if (tab === 'home') {
        setSelectedPostForDetail(null);
        setSelectedRestaurantId(null);
        setSelectedShoppingCategoryId(null);
        setSelectedProductId(null);
    }

  }, [fetchBusinessProfiles, isLoggedIn]);

  const setActiveTab = handleTabSelection;

  const handleSelectSkillsetProfile = useCallback((skillsetProfileId: string) => {
    setSelectedSkillsetProfileId(skillsetProfileId);
    setActiveTab('skillset-profile');
    setShowSideMenu(false);
  }, [setActiveTab]);

  const handleSelectIndividualProfile = useCallback((profileId: string) => {
    if (user && profileId === user.id) { 
        setActiveTab('account');
    } else if (profileId) { 
        setSelectedIndividualProfileId(profileId);
        setActiveTab('individual-profile');
    }
    setShowSideMenu(false);
  }, [user, setActiveTab]);


  const handleSelectBusinessProfile = useCallback((profileId: string | number) => {
    setSelectedBusinessProfileId(String(profileId));
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

  const handleCreatePost = useCallback(() => {
    setActiveTab('create-post');
  }, [setActiveTab]);
  
  const handlePostSubmit = useCallback(async (content: string, media?: MediaAttachment) => {
    if (!user) {
        toast({ title: "Not Logged In", description: "You must be logged in to create a post.", variant: "destructive" });
        return;
    }
    
    const postData = {
        userId: user.id,
        user: user.name,
        userImage: user.avatarUrl,
        userImageAiHint: user.avatarAiHint,
        content: content,
        media: media,
    };

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.error || 'Failed to create post.');
        }

        toast({ title: "Post Created!", description: "Your new post has been added." });
        await fetchUserPosts(user.id); // Refresh posts from server
        setActiveTab('account');

    } catch (error) {
        console.error("Error creating post:", error);
        toast({ title: "Post Failed", description: error instanceof Error ? error.message : "Could not create your post.", variant: "destructive" });
    }
  }, [user, toast, setActiveTab, fetchUserPosts]);


  const handleViewPostDetail = useCallback((post: FeedItem | ProfilePost) => {
    setSelectedPostForDetail(post);
    setActiveTab('detailed-post');
  }, [setActiveTab]);

  const handlePostCommentOnDetail = useCallback((postId: string | number, commentText: string) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to comment."});
      return;
    }
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: user.name,
      userAvatar: user.avatarUrl,
      userAvatarAiHint: user.avatarAiHint,
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
  }, [user, toast, selectedPostForDetail]);


  const handleCreateMoment = useCallback((imageUrl: string, caption?: string, aiHint?: string) => {
    if (!user) {
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
    
    toast({ title: "Moment Posted!", description: "Your new moment has been added." });
    setShowCreateMomentDialog(false);
  }, [user, userMoments, toast]);

  const handleAddMomentFromAccount = useCallback(() => {
    setShowCreateMomentDialog(true);
  }, []);

  const handleViewUserMomentsFromAccount = useCallback(() => {
    if (user) {
        setViewingMomentOwnerDetails({
            name: user.name,
            avatarUrl: user.avatarUrl,
            avatarAiHint: user.avatarAiHint,
            profileId: user.id
        });
        setMomentsToDisplayInViewer(userMoments);
        setShowMomentViewer(true);
    } else {
      toast({ title: "Error", description: "User data not available." });
    }
  }, [toast, user, userMoments]);

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
             } else if (user && profileId === user.id) {
                 ownerDetails = { name: user.name, avatarUrl: user.avatarUrl, avatarAiHint: user.avatarAiHint || defaultAvatarAiHint, profileId: user.id };
             } else {
                ownerDetails = { name: `User ${profileId.substring(0,5)}...`, avatarUrl: `https://source.unsplash.com/random/48x48/?${defaultAvatarAiHint.split(' ').join(',')}`, avatarAiHint: defaultAvatarAiHint, profileId };
             }
        }
    } else if (user) {
        ownerDetails = { name: user.name, avatarUrl: user.avatarUrl, avatarAiHint: user.avatarAiHint || defaultAvatarAiHint, profileId: user.id };
    }

    if (ownerDetails) {
        setViewingMomentOwnerDetails(ownerDetails);
        if (ownerDetails.profileId === user?.id) {
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
  }, [user, userMoments, toast, initialCategoriesData, businessProfilesData]);


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
    console.log('[Sim Effect] Running. States:', { isLoggedIn, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, isBusinessActiveSim, activityDetailsType: activityDetails?.type, isActiveActivityViewVisible });
    let onlineTimer: NodeJS.Timeout;
    let requestTimeout: NodeJS.Timeout;

    const canSimulate = isLoggedIn && !activityDetails && !isActiveActivityViewVisible;

    if (canSimulate && (isTaxiDriverOnlineSim || isDeliveryDriverOnlineSim || isBusinessActiveSim)) {
        onlineTimer = setTimeout(() => {
            if (isLoggedIn && !activityDetails && !isActiveActivityViewVisible) {
                if (isTaxiDriverOnlineSim) {
                    toast({ title: "You are Online (Taxi Driver Sim)", description: "Waiting for ride requests." });
                    setActivityDetails({ type: 'driver_status', status: 'driver_online_idle'});
                    setIsActiveActivityViewVisible(true);

                    requestTimeout = setTimeout(() => {
                        if (isTaxiDriverOnlineSim && activityDetails?.type === 'driver_status' && activityDetails?.status === 'driver_online_idle' && isLoggedIn) {
                            setActivityDetails({
                                type: 'request', status: 'ride_in_progress',
                                riderName: 'Simulated Rider', pickup: '123 Frontend St', dropoff: '789 Backend Ave',
                                fare: '₹180', vehicleType: 'Car (Mini)', distance: '5 km',
                            });
                        }
                    }, 8000);
                } else if (isDeliveryDriverOnlineSim) {
                    toast({ title: "You are Online (Delivery Sim)", description: "Waiting for delivery requests." });
                    setActivityDetails({ type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)' });
                    setIsActiveActivityViewVisible(true);

                    requestTimeout = setTimeout(() => {
                         if (isDeliveryDriverOnlineSim && activityDetails?.type === 'driver_status' && activityDetails?.status === 'driver_online_idle' && isLoggedIn) {
                            setActivityDetails({
                                type: 'delivery_request', status: 'delivery_pending_acceptance',
                                pickup: 'Green Veggies Store', dropoff: 'Apt 101, Park View',
                                itemName: 'Groceries Package', itemDescription: '1 bag, approx 2kg',
                                estimatedPayment: '₹55',
                            });
                        }
                    }, 9000);
                } else if (isBusinessActiveSim) {
                    toast({ title: "Your Business is Active", description: "Waiting for product orders." });
                    requestTimeout = setTimeout(() => {
                         if (isBusinessActiveSim && !activityDetails && isLoggedIn) { 
                            console.log('[Sim Effect] Simulating incoming product order.');
                            setActivityDetails({
                                type: 'product_order_notification', status: 'new_product_order',
                                orderId: `order-${Date.now()}`,
                                businessName: 'Your Simulated Store', 
                                productName: 'Super Widget Pro',
                                quantity: 2,
                                customerName: 'Simulated Customer',
                                totalAmount: '₹1998.00',
                            });
                            setIsActiveActivityViewVisible(true); 
                        }
                    }, 10000); 
                }
            }
        }, 5000);
    }

    return () => {
        clearTimeout(onlineTimer);
        clearTimeout(requestTimeout);
    };
  }, [isLoggedIn, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, isBusinessActiveSim, activityDetails, isActiveActivityViewVisible, toast]);


  const handleFabClick = useCallback(() => {
    if (!isLoggedIn) return;

    if (activityDetails) { 
         setIsActiveActivityViewVisible(true);
         return;
    }
    if (isTaxiDriverOnlineSim) {
         setIsActiveActivityViewVisible(true);
         setActivityDetails({ type: 'driver_status', status: 'driver_online_idle'});
    } else if (isDeliveryDriverOnlineSim) {
        setIsActiveActivityViewVisible(true);
        setActivityDetails({ type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)' });
    } else if (isBusinessActiveSim) {
        toast({ title: "Business Active", description: "Your business is active for orders."});
    }
  }, [isLoggedIn, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, isBusinessActiveSim, activityDetails, toast]);
  
   useEffect(() => {
    if (isLoggedIn && (isTaxiDriverOnlineSim || isDeliveryDriverOnlineSim || isBusinessActiveSim || activityDetails)) {
        if (activeTabInternal !== 'account') {
          setIsFabVisible(true);
        } else {
          setIsFabVisible(false);
        }
    } else {
        setIsFabVisible(false);
        if (!activityDetails) { 
             setIsActiveActivityViewVisible(false);
        }
    }
  }, [isLoggedIn, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, isBusinessActiveSim, activityDetails, activeTabInternal]);


  const handleCloseActivityView = useCallback(() => {
    setIsActiveActivityViewVisible(false);
    const currentType = activityDetails?.type;
    const currentStatus = activityDetails?.status;

    if (currentType === 'driver_status' && currentStatus === 'driver_online_idle') {
    } else if (currentType === 'product_order_notification' && currentStatus === 'new_product_order') {
    } else if (
        (currentType === 'request' || currentType === 'ride' || currentType === 'delivery_request' || currentType === 'delivery_task' || currentType === 'product_order_notification') &&
        currentStatus !== 'ride_completed' && currentStatus !== 'ride_cancelled' &&
        currentStatus !== 'delivery_completed' && currentStatus !== 'delivery_cancelled' &&
        currentStatus !== 'product_order_completed' && currentStatus !== 'product_order_cancelled' && currentStatus !== 'product_order_rejected'
    ) {
    } else {
        if (isTaxiDriverOnlineSim) setActivityDetails({ type: 'driver_status', status: 'driver_online_idle' });
        else if (isDeliveryDriverOnlineSim) setActivityDetails({ type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)' });
        else if (isBusinessActiveSim && currentType === 'product_order_notification' && (currentStatus === 'product_order_accepted' || currentStatus === 'product_order_rejected' || currentStatus === 'product_order_completed' || currentStatus === 'product_order_cancelled')) {
            setActivityDetails(null); 
        }
        else if (!isTaxiDriverOnlineSim && !isDeliveryDriverOnlineSim && !isBusinessActiveSim){
            setActivityDetails(null); 
        }
    }
  }, [activityDetails, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, isBusinessActiveSim]);

  useEffect(() => {
    if (isLoggedIn && activityDetails && (activityDetails.type === 'request' || activityDetails.type === 'delivery_request' || activityDetails.type === 'product_order_notification') && !isActiveActivityViewVisible) {
        setIsActiveActivityViewVisible(true);
    }
  }, [isLoggedIn, activityDetails, isActiveActivityViewVisible]);


  const handleAcceptRequest = useCallback(() => { 
      if (activityDetails?.type === 'request') {
          setActivityDetails(prev => ({
            ...prev,
            type: 'ride', 
            status: 'en_route_to_pickup',
          }));
          toast({ title: "Ride Accepted", description: "Proceed to pickup location." });
      }
  }, [activityDetails, toast]);

  const handleRejectRequest = useCallback(() => { 
      setActivityDetails(null); 
      setIsActiveActivityViewVisible(false);
      if (isTaxiDriverOnlineSim) {
          setActivityDetails({ type: 'driver_status', status: 'driver_online_idle' });
          setIsActiveActivityViewVisible(true); 
      }
      toast({ title: "Request Rejected", description: "You rejected the ride request." });
  }, [toast, isTaxiDriverOnlineSim]);

  const handleArrivedAtPickup = useCallback(() => { 
      if (activityDetails?.type === 'ride' && activityDetails.status === 'en_route_to_pickup') {
          setActivityDetails(prev => prev ? ({ ...prev, status: 'arrived_at_pickup' }) : null);
          toast({ title: "Arrived", description: "You have arrived at the pickup location." });
      }
  }, [activityDetails, toast]);

  const handleStartRide = useCallback(() => { 
      if (activityDetails?.type === 'ride' && activityDetails.status === 'arrived_at_pickup') {
          setActivityDetails(prev => prev ? ({ ...prev, status: 'ride_in_progress' }) : null);
          toast({ title: "Ride Started", description: "Ride in progress." });
      }
  }, [activityDetails, toast]);

  const handleEndRide = useCallback(() => { 
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

  const handleCancelRide = useCallback(() => {
    if (!activityDetails) return;
    const type = activityDetails.type;
    const newStatus: ActivityStatus = 
        type === 'delivery_task' || type === 'delivery_request' ? 'delivery_cancelled' :
        type === 'product_order_notification' ? 'product_order_cancelled' :
        'ride_cancelled';
    
    const toastTitle = 
        type === 'delivery_task' || type === 'delivery_request' ? "Delivery Cancelled" :
        type === 'product_order_notification' ? "Order Cancelled" :
        "Ride Cancelled";
    
    toast({ title: toastTitle, description: `The ${type === 'product_order_notification' ? 'order' : (type === 'delivery_task' || type === 'delivery_request' ? 'delivery' : 'ride')} has been cancelled.` });
    setActivityDetails(prev => prev ? ({ ...prev, status: newStatus }) : null);
    
    setTimeout(() => {
        setActivityDetails(null);
        setIsActiveActivityViewVisible(false);
        if (isTaxiDriverOnlineSim && (type === 'ride' || type === 'request')) setActivityDetails({ type: 'driver_status', status: 'driver_online_idle' });
        else if (isDeliveryDriverOnlineSim && (type === 'delivery_task' || type === 'delivery_request')) setActivityDetails({ type: 'driver_status', status: 'driver_online_idle', vehicleType: 'Bike (Delivery)' });
    }, 3000);
  }, [activityDetails, toast, isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim]);


  const handleContactDriver = useCallback(() => {
      toast({ title: "Contacting Driver", description: "Simulating contact..." });
  }, [toast]);

  const handleGoOffline = useCallback((mode: 'taxi' | 'delivery' | 'business') => {
      if (mode === 'taxi') setIsTaxiDriverOnlineSim(false);
      if (mode === 'delivery') setIsDeliveryDriverOnlineSim(false);
      if (mode === 'business') setIsBusinessActiveSim(false); 
      
      if (activityDetails && 
          ((mode === 'taxi' && (activityDetails.type === 'request' || activityDetails.type === 'ride' || (activityDetails.type === 'driver_status' && !activityDetails.vehicleType))) ||
           (mode === 'delivery' && (activityDetails.type === 'delivery_request' || activityDetails.type === 'delivery_task' || (activityDetails.type === 'driver_status' && activityDetails.vehicleType === 'Bike (Delivery)'))) ||
           (mode === 'business' && activityDetails.type === 'product_order_notification') )) {
          setActivityDetails(null);
          setIsActiveActivityViewVisible(false);
      } else if (!isTaxiDriverOnlineSim && !isDeliveryDriverOnlineSim && !isBusinessActiveSim && !activityDetails) {
          setIsActiveActivityViewVisible(false);
      }
      
      toast({ title: "Offline", description: `You are now offline for ${mode} services.` });
  }, [toast, activityDetails]);

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
  
  const handleAcceptProductOrder = useCallback(() => {
    if (activityDetails?.type === 'product_order_notification') {
      setActivityDetails(prev => prev ? ({ ...prev, status: 'product_order_accepted' }) : null);
      toast({ title: "Order Accepted", description: `Order ${activityDetails.orderId} has been accepted. Start processing.` });
    }
  }, [activityDetails, toast]);

  const handleRejectProductOrder = useCallback(() => {
    if (activityDetails?.type === 'product_order_notification') {
      setActivityDetails(prev => prev ? ({ ...prev, status: 'product_order_rejected' }) : null);
      toast({ title: "Order Rejected", description: `Order ${activityDetails.orderId} has been rejected.` });
      setTimeout(() => { 
          setActivityDetails(null);
          setIsActiveActivityViewVisible(false);
      }, 3000);
    }
  }, [activityDetails, toast]);


  useEffect(() => {
    let autoAcceptTimer: NodeJS.Timeout;
    if (isActiveActivityViewVisible && (activityDetails?.type === 'request' || activityDetails?.type === 'delivery_request' || activityDetails?.type === 'product_order_notification') && isLoggedIn) {
      const isTaxiRequest = activityDetails?.type === 'request' && !activityDetails?.driverName;
      const isDeliveryReq = activityDetails?.type === 'delivery_request';
      const isProductOrder = activityDetails?.type === 'product_order_notification' && activityDetails.status === 'new_product_order';


      if(isTaxiRequest || isDeliveryReq || isProductOrder) {
        console.log(`Setting up auto-action timer for ${activityDetails?.type}.`);
        autoAcceptTimer = setTimeout(() => {
          if(activityDetails?.type === 'request' && isTaxiRequest && isLoggedIn) {
            console.log("Simulating driver auto-accept for taxi due to timeout.");
            handleAcceptRequest();
          } else if (activityDetails?.type === 'delivery_request' && isDeliveryReq && isLoggedIn) {
            console.log("Simulating driver auto-accept for delivery due to timeout.");
            handleAcceptDelivery();
          } else if (activityDetails?.type === 'product_order_notification' && isProductOrder && isLoggedIn) {
            console.log("Simulating business auto-accept for product order due to timeout.");
            handleAcceptProductOrder();
          }
        }, 7000); 
      }
      return () => {
        clearTimeout(autoAcceptTimer);
      }
    }
  }, [isActiveActivityViewVisible, activityDetails, isLoggedIn, handleAcceptRequest, handleAcceptDelivery, handleAcceptProductOrder]);

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
    globalAddToCart({
        id: menuItem.id,
        name: menuItem.name,
        price: String(menuItem.price),
        businessId: restaurantId,
        businessName: restaurantName,
        imageUrl: menuItem.imageUrl,
        imageAiHint: menuItem.imageAiHint
    });
  }, [globalAddToCart]);

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
    globalAddToCart({
        id: product.id,
        name: product.name,
        price: String(product.price),
        businessId: product.brand || 'generic-shop',
        businessName: product.brand || 'Online Store',
        imageUrl: product.imageUrl,
        imageAiHint: product.imageAiHint
    }, quantity);
  }, [globalAddToCart]);

  const handleOpenChatDetail = useCallback((messageItem: MessageItem) => {
    if (!user) {
      toast({ title: "Error", description: "User data not available for chat.", variant: "destructive" });
      return;
    }
    const mockMessages: ChatMessage[] = [
      { id: `msg-${Date.now() - 2000}`, text: messageItem.content, timestamp: messageItem.timestamp, isSender: false, avatar: messageItem.senderImage, avatarAiHint: messageItem.senderImageAiHint },
      { id: `msg-${Date.now() - 1000}`, text: "Okay, I see. Thanks for letting me know!", timestamp: "1 min ago", isSender: true, avatar: user.avatarUrl, avatarAiHint: user.avatarAiHint },
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
  }, [user, toast]);

  const handleSendMessageInChatDetail = useCallback((text: string) => {
    if (!currentChatContext || !user) return;

    const newMessage: ChatMessage = {
      id: `msg-sent-${Date.now()}`,
      text: text,
      timestamp: "Just now",
      isSender: true,
      avatar: user.avatarUrl,
      avatarAiHint: user.avatarAiHint,
    };

    setCurrentChatContext(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage]
    } : null);
  }, [currentChatContext, user]);

  const renderScreenContent = useCallback(() => {
    if (showSplashScreen) {
      return <SplashScreen onDismiss={() => setShowSplashScreen(false)} />;
    }

    if (authLoading) {
      return <Loading />;
    }

    switch (activeTabInternal) {
      case 'home': return <HomeScreen
                            setActiveTab={setActiveTab}
                            onSelectBusinessProfile={handleSelectBusinessProfile}
                            onSelectIndividualProfile={handleSelectIndividualProfile}
                            onAddToCart={(businessId, productId) => {
                                const business = businessProfilesData.find(b => b.id === businessId);
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
      case 'recommended': return <RecommendedScreen
                                      onViewPostDetail={handleViewPostDetail}
                                      onViewUserProfile={handleSelectIndividualProfile}
                                      onViewUserMoments={handleViewUserMoments}
                                  />;
      case 'menu': return <ServicesScreen setActiveTab={setActiveTab} onRequestRide={handleRideRequest} />;
      case 'account':
        if (isLoggedIn) {
          return <AccountScreen
                   userData={user}
                   setActiveTab={setActiveTab}
                   userPosts={userPosts}
                   userMoments={userMoments}
                   onAddMomentClick={handleAddMomentFromAccount}
                   onViewUserMomentsClick={handleViewUserMomentsFromAccount}
                   onViewPostDetail={handleViewPostDetail}
                   onCreatePost={handleCreatePost}
                 />;
        } else {
            if (authScreen === 'login') {
                return <LoginScreen onSwitchToRegister={() => setAuthScreen('registration')} />;
            } else {
                return <RegistrationScreen onSwitchToLogin={() => setAuthScreen('login')} onRegistrationSuccess={() => setAuthScreen('login')} />;
            }
        }
      case 'create-post': return <CreatePostScreen onPost={handlePostSubmit} onCancel={() => setActiveTab(userPosts.length > 0 ? 'account' : 'feeds')} />;
      case 'detailed-post':
        if (selectedPostForDetail) {
          return (
            <DetailedPostScreen
              post={selectedPostForDetail}
              onPostComment={(commentText) => handlePostCommentOnDetail(selectedPostForDetail.id, commentText)}
              onBack={() => setActiveTab( (selectedPostForDetail as ProfilePost).userId === user?.id ? 'account' : 'feeds')}
            />
          );
        }
        return <p className="p-4 text-center text-muted-foreground">Loading post details...</p>;
      case 'digital-id-card': return <DigitalIdCardScreen userData={user} setActiveTab={setActiveTab} />;
      case 'professional-profile': return <ProfessionalProfileScreen setActiveTab={setActiveTab} userData={user} />;
      case 'user-skillsets': return (
                            <UserSkillsetsScreen
                                setActiveTab={setActiveTab}
                                onManageSkillsetProfile={handleManageSkillsetProfile}
                            />
                        );
      case 'vehicles': return <UserVehiclesScreen setActiveTab={setActiveTab} onToggleVehicleActive={handleToggleVehicleActive} />;
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
        if (user && !selectedIndividualProfileId) { 
             setActiveTab('account');
             return <AccountScreen
                        userData={user}
                        setActiveTab={setActiveTab}
                        userPosts={userPosts}
                        userMoments={userMoments}
                        onAddMomentClick={handleAddMomentFromAccount}
                        onViewUserMomentsClick={handleViewUserMomentsFromAccount}
                        onViewPostDetail={handleViewPostDetail}
                        onCreatePost={handleCreatePost}
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
        if (bookingTargetProfile && selectedSkillsetProfileId) {
            return <SkillsetProfileScreen skillsetProfileId={selectedSkillsetProfileId} setActiveTab={setActiveTab} onBookService={handleOpenServiceBooking} />;
        }
        setActiveTab('home');
        return <p className="p-4 text-center text-muted-foreground">Loading booking details...</p>;

      case 'food-restaurants':
        return <FoodRestaurantsScreen restaurants={restaurantsData} onSelectRestaurant={handleSelectFoodRestaurant} />;
      case 'food-restaurant-detail':
        const selectedRestaurant = restaurantsData.find(r => r.id === selectedRestaurantId);
        return <FoodRestaurantDetailScreen restaurant={selectedRestaurant || null} onAddToCart={(item, qty) => handleAddItemToLocalFoodCart(item, selectedRestaurantId!, selectedRestaurant?.name || 'Restaurant')} onBack={() => setActiveTab('food-restaurants')} />;

      case 'shopping-categories':
        return <ShoppingCategoriesScreen 
            categories={productCategoriesData} 
            onSelectCategory={handleSelectShoppingCategory} 
            onSelectBusinessProfile={handleSelectBusinessProfile}
        />;
      case 'shopping-products-list':
        const currentCategory = productCategoriesData.find(c => c.id === selectedShoppingCategoryId);
        const productsForCategory = productsData.filter(p => selectedShoppingCategoryId ? p.categoryIds.includes(selectedShoppingCategoryId) : true);
        return <ShoppingProductsListScreen products={productsForCategory} category={currentCategory || null} onSelectProduct={handleSelectShoppingProduct} onBack={() => setActiveTab('shopping-categories')} onAddToCart={handleAddItemToShoppingCart} />;
      case 'shopping-product-detail':
        const currentProduct = productsData.find(p => p.id === selectedProductId);
        return <ShoppingProductDetailScreen product={currentProduct || null} onAddToCart={handleAddItemToShoppingCart} onBack={() => setActiveTab('shopping-products-list')} />;
      
      case 'unified-cart':
        const previousTab = 
            activeTabInternal === 'food-restaurant-detail' && selectedRestaurantId ? 'food-restaurant-detail' :
            activeTabInternal === 'shopping-product-detail' && selectedProductId ? 'shopping-product-detail' :
            'home';
        return <UnifiedCartScreen onBack={() => setActiveTab(previousTab)} setActiveTab={setActiveTab}/>;

      default: return <HomeScreen
                        setActiveTab={setActiveTab}
                        onSelectBusinessProfile={handleSelectBusinessProfile}
                        onSelectIndividualProfile={handleSelectIndividualProfile}
                        onAddToCart={(businessId, productId) => {
                            const business = businessProfilesData.find(b => b.id === businessId);
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
    isLoggedIn, activeTabInternal, user, authLoading, showSplashScreen, businessProfilesData, isLoadingBusinessProfiles, userPosts, isLoadingPosts, userMoments, feedItems, recommendedItems,
    selectedBusinessProfileId, businessProfileToManageId,
    selectedIndividualProfileId, selectedSkillsetProfileId, skillsetProfileToManageId, selectedJobId, selectedPostForDetail,
    bookingTargetProfile,
    restaurantsData, selectedRestaurantId, 
    productCategoriesData, productsData, selectedShoppingCategoryId, selectedProductId, 
    isTaxiDriverOnlineSim, isDeliveryDriverOnlineSim, isBusinessActiveSim, 
    authScreen,
    handleLogout,
    setActiveTab,
    handleSelectBusinessProfile, handleManageBusinessProfile, handleBackFromBusinessDetail, handleBackFromManageBusinessProfile,
    handleSelectIndividualProfile, handleManageSkillsetProfile, handleBackFromManageSkillsetProfile,
    handleSelectJob, handleBackFromJobDetail, handleGlobalAddToCart, handleRideRequest,
    handleSaveBusinessProfile, handleDeleteBusinessProfile, handleToggleBusinessProfileActive,
    handleCreatePost, handlePostSubmit, handleViewPostDetail, handlePostCommentOnDetail,
    handleAddMomentFromAccount, handleViewUserMomentsFromAccount,
    handleViewUserMoments,
    handleNavigateToOwnerProfileFromMomentViewer,
    handleOpenServiceBooking, handleConfirmServiceBooking,
    handleSelectFoodRestaurant, handleAddItemToLocalFoodCart, 
    handleSelectShoppingCategory, handleSelectShoppingProduct, handleAddItemToShoppingCart, 
    handleToggleVehicleActive, 
    toast
  ]);


  if (authLoading && showSplashScreen) {
    return <SplashScreen onDismiss={() => setShowSplashScreen(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {!showSplashScreen && (
        <Header
          isLoggedIn={isLoggedIn}
          onMenuClick={() => setShowSideMenu(true)}
          onMessagesClick={() => setShowMessagesNotifications(true)}
          onCartClick={handleNavigateToCart}
          unreadCount={isLoggedIn ? 5 : 0}
        />
      )}

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
          userData={user}
        />
      )}

      <div className="flex-grow overflow-hidden relative p-0">
        {renderScreenContent()}
      </div>

      {!showSplashScreen && !['detailed-post', 'create-post', 'service-booking', 'food-restaurant-detail', 'shopping-product-detail', 'unified-cart'].includes(activeTabInternal) && (
        <BottomNavigation activeTab={activeTabInternal} setActiveTab={setActiveTab} />
      )}

      {isLoggedIn && isFabVisible && (
        <FloatingActionButton
            onClick={handleFabClick}
            activityType={
              activityDetails?.type === 'request' || (activityDetails?.type === 'ride' && activityDetails?.status !== 'ride_completed' && activityDetails?.status !== 'ride_cancelled') ? 'taxi' :
              activityDetails?.type === 'delivery_request' || (activityDetails?.type === 'delivery_task' && activityDetails?.status !== 'delivery_completed' && activityDetails?.status !== 'delivery_cancelled') ? 'delivery' :
              activityDetails?.type === 'product_order_notification' && activityDetails.status !== 'product_order_completed' && activityDetails.status !== 'product_order_cancelled' && activityDetails.status !== 'product_order_rejected' ? 'business' :
              isTaxiDriverOnlineSim ? 'taxi' : 
              isDeliveryDriverOnlineSim ? 'delivery' :
              isBusinessActiveSim ? 'business' : 
              null 
            }
            tooltipText={
              activityDetails ? "View Current Activity" :
              isTaxiDriverOnlineSim ? "Online for Rides" : 
              isDeliveryDriverOnlineSim ? "Online for Deliveries" :
              isBusinessActiveSim ? "Business Active (Orders)" :
              "View Activity"
            }
        />
      )}

      {isLoggedIn && isActiveActivityViewVisible && (
        <ActiveActivityView
          isVisible={isActiveActivityViewVisible}
          onClose={handleCloseActivityView}
          userRole={
            (activityDetails?.type === 'request' || (activityDetails?.type === 'ride' && !activityDetails.driverName) || (activityDetails?.type === 'driver_status' && !activityDetails.vehicleType) || (activityDetails?.type === 'delivery_request') || (activityDetails?.type === 'delivery_task')) ? 'driver' :
            (activityDetails?.type === 'ride' && activityDetails.driverName) ? 'rider' :
            (activityDetails?.type === 'product_order_notification') ? 'business_owner' : 
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
              else if (activityDetails?.type === 'product_order_notification' || isBusinessActiveSim) handleGoOffline('business');
              else handleGoOffline('taxi');
          }}
          onAcceptDelivery={handleAcceptDelivery}
          onRejectDelivery={handleRejectDelivery}
          onArrivedAtDeliveryPickup={handleArrivedAtDeliveryPickup}
          onItemPickedUp={handleItemPickedUp}
          onArrivedAtDeliveryDropoff={handleArrivedAtDeliveryDropoff}
          onCompleteDelivery={handleCompleteDelivery}
          onAcceptProductOrder={handleAcceptProductOrder}
          onRejectProductOrder={handleRejectProductOrder}
        />
      )}

      {showMessagesNotifications && (
        <MessagesNotificationsScreen
          onClose={() => setShowMessagesNotifications(false)}
          onOpenChatDetail={handleOpenChatDetail}
        />
      )}

      {isLoggedIn && showChatDetailScreen && currentChatContext && (
        <ChatDetailScreen
          isOpen={showChatDetailScreen}
          onClose={() => {
            setShowChatDetailScreen(false);
            setCurrentChatContext(null);
          }}
          chatContext={currentChatContext}
          onSendMessage={handleSendMessageInChatDetail}
          currentUserAvatar={user?.avatarUrl}
          currentUserAvatarAiHint={user?.avatarAiHint}
        />
      )}

      {isLoggedIn && showCreateMomentDialog && (
        <MomentViewerScreen
          isOpen={showCreateMomentDialog}
          onClose={() => setShowCreateMomentDialog(false)}
          moments={[]}
          ownerName={user?.name}
          ownerAvatarUrl={user?.avatarUrl}
          ownerAvatarAiHint={user?.avatarAiHint}
          onViewOwnerProfile={() => setActiveTab('account')}
        />
      )}

      {isLoggedIn && showMomentViewer && viewingMomentOwnerDetails && (
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

      {isLoggedIn && showServiceBookingDialog && bookingTargetProfile && (
        <ServiceBookingDialog
          isOpen={showServiceBookingDialog}
          onClose={() => {
            setShowServiceBookingDialog(false);
            setBookingTargetProfile(null);
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
