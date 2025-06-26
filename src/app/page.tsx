
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import SideMenu from '@/components/layout/SideMenu';
import LoginScreen from '@/components/screens/LoginScreen';
import RegistrationScreen from '@/components/screens/RegistrationScreen';
import HomeScreen from '@/components/home/HomeScreen';
import FeedsScreen from '@/components/screens/FeedsScreen';
import ServicesScreen from '@/components/screens/services/ServicesScreen';
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
import Loading from '@/app/loading';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ActiveActivityView from '@/components/activity/ActiveActivityView';
import type {
    TabName, UserBusinessProfile, BusinessJob,
    ProfilePost, MediaAttachment, UserMoment, Comment,
    ServiceBookingRequest, ActiveBooking, ChatMessage, UserVehicle, ActivityDetails, FeedItem
} from '@/types';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { individualProfiles } from '@/lib/dummy-data/individualProfiles';


const newBusinessProfileTemplate: Omit<UserBusinessProfile, 'id'> = {
  name: '',
  bio: '',
  logo: '',
  logoAiHint: 'business logo',
  coverPhoto: '',
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

type UserRole = 'rider' | 'driver' | 'business_owner';

export default function AppRoot() {
  const { toast } = useToast();
  const { user, loading: authLoading, logout } = useAuth();
  
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
  
  const [userPosts, setUserPosts] = useState<ProfilePost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const [selectedPostForDetail, setSelectedPostForDetail] = useState<ProfilePost | null>(null);

  const [showServiceBookingDialog, setShowServiceBookingDialog] = useState(false);
  const [bookingTargetProfile, setBookingTargetProfile] = useState<BookingTargetProfile | null>(null);
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);

  const [showMessagesNotifications, setShowMessagesNotifications] = useState(false);
  const [showChatDetailScreen, setShowChatDetailScreen] = useState(false);
  const [currentChatContext, setCurrentChatContext] = useState<CurrentChatContext | null>(null);

  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('rider');
  const [showActiveActivityView, setShowActiveActivityView] = useState(false);
  const [activeActivityDetails, setActiveActivityDetails] = useState<ActivityDetails>(null);
  const [hasNewRequest, setHasNewRequest] = useState(false);
  const [onlineVehicle, setOnlineVehicle] = useState<UserVehicle | null>(null);

  const [showMomentViewer, setShowMomentViewer] = useState(false);
  const [viewingMomentOwner, setViewingMomentOwner] = useState<ViewingMomentOwnerDetails | null>(null);

  const isLoggedIn = !!user;

  const fetchUserPosts = useCallback(async (userId: string) => {
    setIsLoadingPosts(true);
    try {
        const response = await fetch(`/api/posts?userId=${userId}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Could not parse error response.' }));
            console.error("Failed to fetch user posts:", errorData.error);
            toast({ title: "Error", description: `Could not load your posts. (${errorData.error || 'Unknown API error'})`, variant: "destructive"});
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

  const fetchBusinessProfiles = useCallback(async (userId: string) => {
    if (!isLoggedIn) {
      setBusinessProfilesData([]);
      return;
    }
    setIsLoadingBusinessProfiles(true);
    try {
      const response = await fetch(`/api/business-profiles?userId=${userId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Could not parse error response from server.' }));
        throw new Error(errorData.error || `Failed to fetch profiles: ${response.statusText}`);
      }
      const profiles: UserBusinessProfile[] = await response.json();
      setBusinessProfilesData(profiles);
    } catch (error) {
      console.error("Network error fetching business profiles:", error);
      toast({ title: "Network Error", description: "Could not connect to the server to fetch business profiles.", variant: "destructive", duration: 10000 });
    } finally {
      setIsLoadingBusinessProfiles(false);
    }
  }, [toast, isLoggedIn]);

  useEffect(() => {
    if (user) {
        setActiveTabInternal('home');
        fetchUserPosts(user.id);
        fetchBusinessProfiles(user.id);
    } else {
        setActiveTabInternal('account');
        setBusinessProfilesData([]);
        setUserPosts([]);
    }
  }, [user, fetchUserPosts, fetchBusinessProfiles]);


  const handleSaveBusinessProfile = useCallback(async (profileData: UserBusinessProfile) => {
    if (!user) {
        toast({ title: "Not Logged In", description: "You must be logged in to save a profile.", variant: "destructive" });
        return;
    }
    const isNew = !profileData.id || profileData.id.startsWith('bp-local-');
    const url = isNew ? '/api/business-profiles' : `/api/business-profiles/${profileData.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const body = { ...profileData, userId: user.id };

    setIsLoadingBusinessProfiles(true);
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Failed to ${isNew ? 'create' : 'update'} profile.`);
      
      toast({ title: isNew ? "Profile Created" : "Profile Updated", description: `"${result.name || profileData.name}" has been saved successfully.` });
      await fetchBusinessProfiles(user.id);
    } catch (error) {
       console.error("Error saving business profile:", error);
       toast({ title: "Save Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
        setIsLoadingBusinessProfiles(false);
    }
  }, [user, toast, fetchBusinessProfiles]);

  const handleDeleteBusinessProfile = useCallback(async (profileId: string) => {
    if (!user) return;
    setIsLoadingBusinessProfiles(true);
    try {
      const response = await fetch(`/api/business-profiles/${profileId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error((await response.json()).error || "Failed to delete profile.");
      toast({ title: "Profile Deleted", description: "The business profile has been deleted.", variant: "destructive" });
      await fetchBusinessProfiles(user.id);
    } catch (error) {
      console.error("Error deleting business profile:", error);
      toast({ title: "Deletion Failed", description: error instanceof Error ? error.message : "An unknown error occurred.", variant: "destructive" });
    } finally {
        setIsLoadingBusinessProfiles(false);
    }
  }, [user, toast, fetchBusinessProfiles]);

  const handleToggleBusinessProfileActive = useCallback(async (profileId: string, newStatus: boolean) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/business-profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!response.ok) throw new Error((await response.json()).error || "Failed to update profile status.");
      toast({ title: "Status Updated", description: `Profile is now ${newStatus ? 'active' : 'inactive'}.` });
      await fetchBusinessProfiles(user.id);
    } catch (error) {
      console.error("Error toggling profile status:", error);
      toast({ title: "Update Failed", description: error instanceof Error ? error.message : "Could not update status.", variant: "destructive" });
      await fetchBusinessProfiles(user.id);
    }
  }, [user, toast, fetchBusinessProfiles]);

  const handleLogout = useCallback(async (showToast = true) => {
    try {
      await logout();
      if (showToast) {
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
      }
      // Reset all state
      setActiveTabInternal('home');
      setShowSideMenu(false);
      setSelectedBusinessProfileId(null);
      setBusinessProfileToManageId(null);
      setSelectedIndividualProfileId(null);
      setSelectedSkillsetProfileId(null);
      setSkillsetProfileToManageId(null);
      setSelectedJobId(null);
      setBusinessProfilesData([]);
      setUserPosts([]);
      setSelectedPostForDetail(null);
      setShowMessagesNotifications(false);
      setShowChatDetailScreen(false);
    } catch (error) {
      console.error("Logout Error", error);
      toast({ title: "Logout Failed", description: "Could not log you out. Please try again.", variant: "destructive" });
    }
  }, [logout, toast]);

  const handleTabSelection = useCallback((tab: TabName) => {
    setActiveTabInternal(tab);
    setShowSideMenu(false);

    const detailTabs: TabName[] = [ 'business-detail', 'individual-profile', 'skillset-profile', 'manage-skillset-profile', 'manage-business-profile', 'job-detail', 'professional-profile', 'account-settings', 'digital-id-card', 'create-post', 'detailed-post', 'service-booking' ];
    if (!detailTabs.includes(tab)) {
        setSelectedBusinessProfileId(null);
        setBusinessProfileToManageId(null);
        setSelectedIndividualProfileId(null);
        setSelectedSkillsetProfileId(null);
        setSkillsetProfileToManageId(null);
        setSelectedJobId(null);
        setSelectedPostForDetail(null);
        setBookingTargetProfile(null);
    }
    if (tab === 'business-profiles' && user) fetchBusinessProfiles(user.id);
    if (tab === 'home') setSelectedPostForDetail(null);
  }, [user, fetchBusinessProfiles]);

  const handlePostSubmit = useCallback(async (content: string, media?: MediaAttachment) => {
    if (!user) {
        toast({ title: "Not Logged In", description: "You must be logged in to create a post.", variant: "destructive" });
        return;
    }
    
    const postData = { userId: user.id, user: user.name, userImage: user.avatarUrl, userImageAiHint: user.avatarAiHint, content: content, media: media };
    try {
        const response = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(postData) });
        if (!response.ok) throw new Error((await response.json()).error || 'Failed to create post.');
        toast({ title: "Post Created!", description: "Your new post has been added." });
        await fetchUserPosts(user.id);
        setActiveTabInternal('account');
    } catch (error) {
        console.error("Error creating post:", error);
        toast({ title: "Post Failed", description: error instanceof Error ? error.message : "Could not create your post.", variant: "destructive" });
    }
  }, [user, toast, fetchUserPosts]);

  const handlePostCommentOnDetail = useCallback((postId: string, commentText: string) => {
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
    setUserPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = Array.isArray(post.commentsData) ? [...post.commentsData, newComment] : [newComment];
        return { ...post, comments: updatedComments.length, commentsData: updatedComments };
      }
      return post;
    }));
    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
        setSelectedPostForDetail(prev => {
            if (!prev) return null;
            const updatedComments = Array.isArray(prev.commentsData) ? [...prev.commentsData, newComment] : [newComment];
            return { ...prev, comments: updatedComments.length, commentsData: updatedComments };
        });
    }
    toast({ title: "Comment Posted", description: "Your comment has been added." });
  }, [user, toast, selectedPostForDetail]);

  const handleRequestRide = (rideDetails: { pickup: string; dropoff: string; vehicleId: string; }) => {
    setCurrentUserRole('rider');
    setActiveActivityDetails({
        type: 'ride',
        status: 'looking_for_driver',
        pickup: rideDetails.pickup,
        dropoff: rideDetails.dropoff,
    });
    setShowActiveActivityView(true);
    toast({ title: "Ride Requested", description: "Looking for drivers near you..." });

    setTimeout(() => {
        setHasNewRequest(true); 
        toast({ title: "Driver Alert", description: "A new ride request is available for drivers." });
    }, 3000);
  };

  const handleAcceptRequest = () => {
    if (!onlineVehicle) {
        toast({ title: "Error", description: "Cannot accept ride without an active vehicle.", variant: "destructive" });
        return;
    }
    setHasNewRequest(false);
    setActiveActivityDetails({
      ...activeActivityDetails,
      type: 'ride',
      status: 'en_route_to_pickup',
      driverName: user?.name || 'Your Driver',
      vehicleInfo: `${onlineVehicle.vehicleType} - ${onlineVehicle.licensePlate}`,
      vehicleId: onlineVehicle.id,
      licensePlate: onlineVehicle.licensePlate,
    });
    toast({ title: "Ride Accepted!", description: "You are on the way to the pickup." });
  };

  const handleDriverArrived = () => {
    setActiveActivityDetails(prev => prev ? {...prev, status: 'arrived_at_pickup'} : null);
    toast({ title: "Driver Arrived", description: "You have arrived at the pickup location." });
  };
  
  const handleStartRide = () => {
    setActiveActivityDetails(prev => prev ? {...prev, status: 'ride_in_progress'} : null);
    toast({ title: "Ride Started", description: "The ride is now in progress." });
  };

  const handleEndRide = () => {
    setActiveActivityDetails(prev => prev ? {...prev, status: 'ride_completed'} : null);
    toast({ title: "Ride Completed", description: "Thank you for your service!" });
  };

  const handleCancelRide = () => {
    setActiveActivityDetails(prev => prev ? {...prev, status: 'ride_cancelled'} : null);
    toast({ title: "Ride Cancelled", variant: "destructive" });
  };
  
  const handleGoOnlineWithVehicle = (vehicle: UserVehicle) => {
    if (vehicle.listingMode !== 'taxi') {
        toast({ title: "Invalid Vehicle", description: "Only vehicles listed for taxi service can go online.", variant: "destructive"});
        return;
    }
    setCurrentUserRole('driver');
    setOnlineVehicle(vehicle);
    setActiveActivityDetails({ 
        type: 'driver_status', 
        status: 'driver_online_idle',
        vehicleId: vehicle.id,
        vehicleType: vehicle.vehicleType,
        licensePlate: vehicle.licensePlate,
    });
    toast({ title: "You are Online", description: `Ready for rides with ${vehicle.vehicleType} (${vehicle.licensePlate}).` });
  };

  const handleGoOffline = () => {
    setOnlineVehicle(null);
    setActiveActivityDetails(null);
    setShowActiveActivityView(false);
    setCurrentUserRole('rider'); // Revert to default role
    toast({ title: "You are Offline" });
  };

  const openActivityView = () => {
      if(currentUserRole === 'driver' && hasNewRequest) {
          setActiveActivityDetails({
              type: 'request',
              status: undefined,
              riderName: 'Priya Sharma',
              pickup: 'Koramangala 4th Block',
              dropoff: 'Indiranagar 100 Feet Road',
              fare: '₹180-220',
              distance: '8 km',
              vehicleType: 'Car (Mini)',
          });
      }
      setShowActiveActivityView(true);
  }

  const renderScreenContent = useCallback(() => {
    if (showSplashScreen) return <SplashScreen onDismiss={() => setShowSplashScreen(false)} />;
    if (authLoading) return <Loading />;

    if (!isLoggedIn) {
        return authScreen === 'login' 
            ? <LoginScreen onSwitchToRegister={() => setAuthScreen('registration')} />
            : <RegistrationScreen onSwitchToLogin={() => setAuthScreen('login')} onRegistrationSuccess={() => setAuthScreen('login')} />;
    }

    switch (activeTabInternal) {
      case 'home': return <HomeScreen setActiveTab={handleTabSelection} onSelectBusinessProfile={(id) => { setSelectedBusinessProfileId(String(id)); handleTabSelection('business-detail'); }} onSelectIndividualProfile={(id) => { setSelectedIndividualProfileId(id); handleTabSelection('individual-profile'); }} onAddToCart={() => toast({ title: "Feature Coming Soon", description: "Shopping cart functionality is under development." })} />;
      case 'feeds': return <FeedsScreen onViewUserProfile={(id) => { setSelectedIndividualProfileId(id); handleTabSelection('individual-profile'); }} onViewPostDetail={(post) => { setSelectedPostForDetail(post); handleTabSelection('detailed-post'); }} />;
      case 'recommended': return <RecommendedScreen onViewPostDetail={(post: FeedItem) => { setSelectedPostForDetail(post as ProfilePost); handleTabSelection('detailed-post'); }} onViewUserProfile={(id) => { setSelectedIndividualProfileId(id); handleTabSelection('individual-profile'); }} onViewUserMoments={(profileId, userName, userAvatarUrl, userAvatarAiHint) => { setViewingMomentOwner({ profileId: profileId || '', name: userName || '', avatarUrl: userAvatarUrl, avatarAiHint: userAvatarAiHint }); setShowMomentViewer(true); }} />;
      case 'menu': return <ServicesScreen setActiveTab={handleTabSelection} onRequestRide={handleRequestRide} />;
      case 'account': return <AccountScreen userData={user} setActiveTab={handleTabSelection} userPosts={userPosts} onViewPostDetail={(post) => { setSelectedPostForDetail(post); handleTabSelection('detailed-post'); }} onCreatePost={() => handleTabSelection('create-post')} />;
      case 'create-post': return <CreatePostScreen onPost={handlePostSubmit} onCancel={() => handleTabSelection(userPosts.length > 0 ? 'account' : 'feeds')} />;
      case 'detailed-post': return selectedPostForDetail ? <DetailedPostScreen post={selectedPostForDetail} onPostComment={(commentText) => handlePostCommentOnDetail(selectedPostForDetail.id, commentText)} onBack={() => handleTabSelection((selectedPostForDetail as ProfilePost).userId === user?.id ? 'account' : 'feeds')} /> : <p>Loading post...</p>;
      case 'digital-id-card': return <DigitalIdCardScreen userData={user} setActiveTab={handleTabSelection} />;
      case 'professional-profile': return <ProfessionalProfileScreen setActiveTab={handleTabSelection} userData={user} />;
      case 'user-skillsets': return <UserSkillsetsScreen setActiveTab={handleTabSelection} onManageSkillsetProfile={(id) => { setSkillsetProfileToManageId(id); handleTabSelection('manage-skillset-profile'); }} />;
      case 'vehicles': return <UserVehiclesScreen onGoOnline={handleGoOnlineWithVehicle} onGoOffline={handleGoOffline} onlineVehicleId={onlineVehicle?.id || null} />;
      case 'business-profiles': return <UserBusinessProfilesScreen businessProfiles={businessProfilesData} onSelectProfile={(id) => { setSelectedBusinessProfileId(id); handleTabSelection('business-detail'); }} onManageProfile={(id) => { setBusinessProfileToManageId(id); handleTabSelection('manage-business-profile'); }} onDeleteProfile={handleDeleteBusinessProfile} onToggleProfileActive={handleToggleBusinessProfileActive} isLoading={isLoadingBusinessProfiles} />;
      case 'business-detail': return <UserBusinessProfileDetailScreen profile={businessProfilesData.find(p => p.id === selectedBusinessProfileId)} onBack={() => handleTabSelection('business-profiles')} />;
      case 'manage-business-profile': const profileDataToManage = businessProfileToManageId === 'new' ? { ...newBusinessProfileTemplate } : businessProfilesData.find(p => p.id === businessProfileToManageId); return profileDataToManage ? <BusinessProfileManagementScreen initialProfileData={profileDataToManage} onSave={handleSaveBusinessProfile} onBack={() => handleTabSelection('business-profiles')} /> : <p>Loading...</p>;
      case 'individual-profile': return selectedIndividualProfileId ? <IndividualProfileScreen profileId={selectedIndividualProfileId} setActiveTab={handleTabSelection} /> : <p>No profile selected.</p>;
      case 'skillset-profile': return selectedSkillsetProfileId ? <SkillsetProfileScreen skillsetProfileId={selectedSkillsetProfileId} setActiveTab={handleTabSelection} onBookService={(profileId, profName, skill) => { setBookingTargetProfile({ id: profileId, name: profName, skillName: skill }); setShowServiceBookingDialog(true); }} /> : <p>No skillset selected.</p>;
      case 'manage-skillset-profile': return skillsetProfileToManageId ? <SkillsetProfileManagementScreen skillsetProfileId={skillsetProfileToManageId} setActiveTab={handleTabSelection} onBack={() => handleTabSelection('user-skillsets')} /> : <p>Loading...</p>;
      case 'job-board': const allJobs = businessProfilesData.flatMap(bp => bp.jobs?.map(job => ({...job, businessId: bp.id, businessName: bp.name, businessLogoUrl: bp.logo})) || []); return <JobBoardScreen jobs={allJobs} onSelectJob={(id) => { setSelectedJobId(String(id)); handleTabSelection('job-detail'); }} />;
      case 'job-detail': const allJobsForDetail = businessProfilesData.flatMap(bp => bp.jobs?.map(job => ({...job, businessId: bp.id, businessName: bp.name, businessLogoUrl: bp.logo})) || []); const job = allJobsForDetail.find(j => j.id === selectedJobId); return job ? <JobDetailScreen job={job} onBack={() => handleTabSelection('job-board')} /> : <p>Job not found.</p>;
      case 'account-settings': return <AccountSettingsScreen />;
      case 'service-booking': return <p>Service booking form would appear here.</p>;
      default: return <HomeScreen setActiveTab={handleTabSelection} onSelectBusinessProfile={(id) => { setSelectedBusinessProfileId(String(id)); handleTabSelection('business-detail'); }} onSelectIndividualProfile={(id) => { setSelectedIndividualProfileId(id); handleTabSelection('individual-profile'); }} onAddToCart={() => toast({ title: "Feature Coming Soon" })} />;
    }
  }, [isLoggedIn, activeTabInternal, user, authLoading, showSplashScreen, businessProfilesData, isLoadingBusinessProfiles, userPosts, authScreen, handleTabSelection, handleSaveBusinessProfile, handleDeleteBusinessProfile, handleToggleBusinessProfileActive, handlePostSubmit, handlePostCommentOnDetail, selectedPostForDetail, selectedBusinessProfileId, businessProfileToManageId, selectedIndividualProfileId, selectedSkillsetProfileId, skillsetProfileToManageId, selectedJobId, onlineVehicle, handleGoOnlineWithVehicle, handleGoOffline, handleRequestRide, showMomentViewer, setShowMomentViewer, setViewingMomentOwner]);

  if (authLoading && showSplashScreen) return <SplashScreen onDismiss={() => setShowSplashScreen(false)} />;

  return (
    <div className="flex flex-col h-screen bg-background">
      {!showSplashScreen && (
        <Header isLoggedIn={isLoggedIn} onMenuClick={() => setShowSideMenu(true)} onMessagesClick={() => setShowMessagesNotifications(true)} onCartClick={() => toast({ title: "Feature Coming Soon"})} unreadCount={isLoggedIn ? 5 : 0} />
      )}
      {isLoggedIn && user && (
        <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} activeTab={activeTabInternal} setActiveTab={handleTabSelection} businessProfiles={businessProfilesData} onSelectBusinessProfile={(id) => { setSelectedBusinessProfileId(String(id)); handleTabSelection('business-detail'); }} selectedBusinessProfileId={selectedBusinessProfileId} onLogout={handleLogout} userData={user} />
      )}
      <div className="flex-grow overflow-hidden relative p-0">{renderScreenContent()}</div>
      {!showSplashScreen && !['detailed-post', 'create-post', 'manage-business-profile', 'manage-skillset-profile'].includes(activeTabInternal) && (
        <BottomNavigation activeTab={activeTabInternal} setActiveTab={handleTabSelection} />
      )}
      
      {isLoggedIn && onlineVehicle && (
        <FloatingActionButton
          onClick={openActivityView}
          activityType='taxi'
          tooltipText={hasNewRequest ? 'New Ride Request!' : (activeActivityDetails ? 'View Current Activity' : 'You are Online')}
          className={hasNewRequest ? 'animate-bounce bg-green-500' : ''}
        />
      )}

      {isLoggedIn && showActiveActivityView && (
        <ActiveActivityView
          isVisible={showActiveActivityView}
          onClose={() => setShowActiveActivityView(false)}
          userRole={currentUserRole}
          activeActivityDetails={activeActivityDetails}
          onAcceptRequest={handleAcceptRequest}
          onArrivedAtPickup={handleDriverArrived}
          onStartRide={handleStartRide}
          onEndRide={handleEndRide}
          onCancelRide={handleCancelRide}
          onGoOffline={handleGoOffline}
        />
      )}
      
      <MomentViewerScreen
          isOpen={showMomentViewer}
          onClose={() => { setShowMomentViewer(false); setViewingMomentOwner(null); }}
          moments={viewingMomentOwner?.profileId ? (individualProfiles.find(p => p.id === viewingMomentOwner.profileId)?.moments || []) : user?.moments || []}
          ownerName={viewingMomentOwner?.name}
          ownerAvatarUrl={viewingMomentOwner?.avatarUrl}
          ownerAvatarAiHint={viewingMomentOwner?.avatarAiHint}
          onViewOwnerProfile={viewingMomentOwner?.profileId ? () => { setSelectedIndividualProfileId(viewingMomentOwner.profileId); setShowMomentViewer(false); handleTabSelection('individual-profile'); } : undefined}
      />
    </div>
  );
}
