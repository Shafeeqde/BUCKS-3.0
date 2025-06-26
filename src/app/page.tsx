
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import SideMenu from '@/components/layout/SideMenu';
import LoginScreen from '@/components/screens/LoginScreen';
import RegistrationScreen from '@/components/screens/RegistrationScreen';
import HomeScreen from '@/components/home/HomeScreen';
import FeedsScreen from '@/components/screens/FeedsScreen';
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
import type {
    TabName, UserBusinessProfile, BusinessJob,
    ProfilePost, MediaAttachment, UserMoment, Comment,
    ServiceBookingRequest, ActiveBooking, ChatMessage, MessageItem, UserVehicle
} from '@/types';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';


const newBusinessProfileTemplate: Omit<UserBusinessProfile, 'id'> = {
  name: '',
  bio: '',
  businessType: 'products_and_services',
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

const genericOtherUserMoments: UserMoment[] = [
  { id: 'other-moment-generic-1', imageUrl: 'https://placehold.co/1080x1920.png', aiHint: 'abstract art', caption: 'A moment from them!', timestamp: '2h ago' },
];


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

  const [userMoments, setUserMoments] = useState<UserMoment[]>([]); 
  const [momentsToDisplayInViewer, setMomentsToDisplayInViewer] = useState<UserMoment[]>([]); 
  const [showCreateMomentDialog, setShowCreateMomentDialog] = useState(false);
  const [showMomentViewer, setShowMomentViewer] = useState(false);
  const [viewingMomentOwnerDetails, setViewingMomentOwnerDetails] = useState<ViewingMomentOwnerDetails | null>(null);

  const [selectedPostForDetail, setSelectedPostForDetail] = useState<ProfilePost | null>(null);

  const [showServiceBookingDialog, setShowServiceBookingDialog] = useState(false);
  const [bookingTargetProfile, setBookingTargetProfile] = useState<BookingTargetProfile | null>(null);
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);

  const [showMessagesNotifications, setShowMessagesNotifications] = useState(false);
  const [showChatDetailScreen, setShowChatDetailScreen] = useState(false);
  const [currentChatContext, setCurrentChatContext] = useState<CurrentChatContext | null>(null);

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

  useEffect(() => {
    if (user) {
        setActiveTabInternal('home');
        fetchUserPosts(user.id);
        fetchBusinessProfiles();
    } else {
        setActiveTabInternal('account');
        setBusinessProfilesData([]);
        setUserPosts([]);
    }
  }, [user, fetchUserPosts]);


  const fetchBusinessProfiles = useCallback(async () => {
    if (!isLoggedIn) {
      setBusinessProfilesData([]);
      return;
    }
    setIsLoadingBusinessProfiles(true);
    try {
      const response = await fetch('/api/business-profiles');
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
      if (!response.ok) throw new Error(result.error || `Failed to ${isNew ? 'create' : 'update'} profile.`);
      
      toast({ title: isNew ? "Profile Created" : "Profile Updated", description: `"${result.name || profileData.name}" has been saved successfully.` });
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
      const response = await fetch(`/api/business-profiles/${profileId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error((await response.json()).error || "Failed to delete profile.");
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
      if (!response.ok) throw new Error((await response.json()).error || "Failed to update profile status.");
      toast({ title: "Status Updated", description: `Profile is now ${newStatus ? 'active' : 'inactive'}.` });
      await fetchBusinessProfiles();
    } catch (error) {
      console.error("Error toggling profile status:", error);
      toast({ title: "Update Failed", description: error instanceof Error ? error.message : "Could not update status.", variant: "destructive" });
      await fetchBusinessProfiles();
    }
  }, [toast, fetchBusinessProfiles]);

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
      setUserMoments([]);
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
    if (tab === 'business-profiles' && isLoggedIn) fetchBusinessProfiles();
    if (tab === 'home') setSelectedPostForDetail(null);
  }, [fetchBusinessProfiles, isLoggedIn]);

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


  const handlePostCommentOnDetail = useCallback((postId: string | number, commentText: string) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to comment."});
      return;
    }
    // This is a simulation. A real app would have a POST /api/posts/{postId}/comments endpoint.
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
        return { ...post, comments: (post.comments || 0) + 1, commentsData: [...(post.commentsData || []), newComment] };
      }
      return post;
    }));

    if (selectedPostForDetail && selectedPostForDetail.id === postId) {
        setSelectedPostForDetail(prev => prev ? { ...prev, comments: (prev.comments || 0) + 1, commentsData: [...(prev.commentsData || []), newComment] } : null);
    }
    toast({ title: "Comment Posted", description: "Your comment has been added." });
  }, [user, toast, selectedPostForDetail]);

  const handleOpenChatDetail = useCallback((messageItem: MessageItem) => {
    if (!user) return;
    const mockMessages: ChatMessage[] = [
      { id: `msg-${Date.now() - 2000}`, text: messageItem.content, timestamp: messageItem.timestamp, isSender: false, avatar: messageItem.senderImage, avatarAiHint: messageItem.senderImageAiHint },
      { id: `msg-${Date.now() - 1000}`, text: "Okay, I see. Thanks!", timestamp: "1 min ago", isSender: true, avatar: user.avatarUrl, avatarAiHint: user.avatarAiHint },
    ];
    setCurrentChatContext({ senderName: messageItem.sender, senderAvatar: messageItem.senderImage, senderAvatarAiHint: messageItem.senderImageAiHint, messages: mockMessages, originalMessageId: messageItem.id });
    setShowMessagesNotifications(false);
    setShowChatDetailScreen(true);
  }, [user]);

  const handleSendMessageInChatDetail = useCallback((text: string) => {
    if (!currentChatContext || !user) return;
    const newMessage: ChatMessage = { id: `msg-sent-${Date.now()}`, text: text, timestamp: "Just now", isSender: true, avatar: user.avatarUrl, avatarAiHint: user.avatarAiHint };
    setCurrentChatContext(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
  }, [currentChatContext, user]);

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
      case 'feeds': return <FeedsScreen onViewUserProfile={(id) => { setSelectedIndividualProfileId(id); handleTabSelection('individual-profile'); }} onAddMomentClick={() => setShowCreateMomentDialog(true)} onViewUserMomentsClick={() => {}} onViewPostDetail={(post) => { setSelectedPostForDetail(post); handleTabSelection('detailed-post'); }} />;
      case 'menu': return <ServicesScreen setActiveTab={handleTabSelection} />;
      case 'account': return <AccountScreen userData={user} setActiveTab={handleTabSelection} userPosts={userPosts} userMoments={userMoments} onAddMomentClick={() => setShowCreateMomentDialog(true)} onViewUserMomentsClick={() => {}} onViewPostDetail={(post) => { setSelectedPostForDetail(post); handleTabSelection('detailed-post'); }} onCreatePost={() => handleTabSelection('create-post')} />;
      case 'create-post': return <CreatePostScreen onPost={handlePostSubmit} onCancel={() => handleTabSelection(userPosts.length > 0 ? 'account' : 'feeds')} />;
      case 'detailed-post': return selectedPostForDetail ? <DetailedPostScreen post={selectedPostForDetail} onPostComment={(commentText) => handlePostCommentOnDetail(selectedPostForDetail.id, commentText)} onBack={() => handleTabSelection((selectedPostForDetail as ProfilePost).userId === user?.id ? 'account' : 'feeds')} /> : <p>Loading post...</p>;
      case 'digital-id-card': return <DigitalIdCardScreen userData={user} setActiveTab={handleTabSelection} />;
      case 'professional-profile': return <ProfessionalProfileScreen setActiveTab={handleTabSelection} userData={user} />;
      case 'user-skillsets': return <UserSkillsetsScreen setActiveTab={handleTabSelection} onManageSkillsetProfile={(id) => { setSkillsetProfileToManageId(id); handleTabSelection('manage-skillset-profile'); }} />;
      case 'vehicles': return <UserVehiclesScreen />;
      case 'business-profiles': return <UserBusinessProfilesScreen businessProfiles={businessProfilesData} onSelectProfile={(id) => { setSelectedBusinessProfileId(id); handleTabSelection('business-detail'); }} onManageProfile={(id) => { setBusinessProfileToManageId(id); handleTabSelection('manage-business-profile'); }} onDeleteProfile={handleDeleteBusinessProfile} onToggleProfileActive={handleToggleBusinessProfileActive} isLoading={isLoadingBusinessProfiles} />;
      case 'business-detail': return <UserBusinessProfileDetailScreen profile={businessProfilesData.find(p => p.id === selectedBusinessProfileId)} onBack={() => handleTabSelection('business-profiles')} />;
      case 'manage-business-profile': const profileDataToManage = businessProfileToManageId === 'new' ? { ...newBusinessProfileTemplate } : businessProfilesData.find(p => p.id === businessProfileToManageId); return profileDataToManage ? <BusinessProfileManagementScreen key={businessProfileToManageId} initialProfileData={profileDataToManage} onSave={handleSaveBusinessProfile} onBack={() => handleTabSelection('business-profiles')} /> : <p>Loading...</p>;
      case 'individual-profile': return selectedIndividualProfileId ? <IndividualProfileScreen profileId={selectedIndividualProfileId} setActiveTab={handleTabSelection} /> : <p>No profile selected.</p>;
      case 'skillset-profile': return selectedSkillsetProfileId ? <SkillsetProfileScreen skillsetProfileId={selectedSkillsetProfileId} setActiveTab={handleTabSelection} onBookService={(profileId, profName, skill) => { setBookingTargetProfile({ id: profileId, name: profName, skillName: skill }); setShowServiceBookingDialog(true); }} /> : <p>No skillset selected.</p>;
      case 'manage-skillset-profile': return skillsetProfileToManageId ? <SkillsetProfileManagementScreen skillsetProfileId={skillsetProfileToManageId} setActiveTab={handleTabSelection} onBack={() => handleTabSelection('user-skillsets')} /> : <p>Loading...</p>;
      case 'job-board': const allJobs = businessProfilesData.flatMap(bp => bp.jobs?.map(job => ({...job, businessId: bp.id, businessName: bp.name, businessLogoUrl: bp.logo})) || []); return <JobBoardScreen jobs={allJobs} onSelectJob={(id) => { setSelectedJobId(String(id)); handleTabSelection('job-detail'); }} />;
      case 'job-detail': const allJobsForDetail = businessProfilesData.flatMap(bp => bp.jobs?.map(job => ({...job, businessId: bp.id, businessName: bp.name, businessLogoUrl: bp.logo})) || []); const job = allJobsForDetail.find(j => j.id === selectedJobId); return job ? <JobDetailScreen job={job} onBack={() => handleTabSelection('job-board')} /> : <p>Job not found.</p>;
      case 'account-settings': return <AccountSettingsScreen />;
      case 'service-booking': return <p>Service booking form would appear here.</p>;
      default: return <HomeScreen setActiveTab={handleTabSelection} onSelectBusinessProfile={(id) => { setSelectedBusinessProfileId(String(id)); handleTabSelection('business-detail'); }} onSelectIndividualProfile={(id) => { setSelectedIndividualProfileId(id); handleTabSelection('individual-profile'); }} onAddToCart={() => toast({ title: "Feature Coming Soon" })} />;
    }
  }, [isLoggedIn, activeTabInternal, user, authLoading, showSplashScreen, businessProfilesData, isLoadingBusinessProfiles, userPosts, userMoments, authScreen, handleTabSelection, handleSaveBusinessProfile, handleDeleteBusinessProfile, handleToggleBusinessProfileActive, handlePostSubmit, handlePostCommentOnDetail, selectedPostForDetail, selectedBusinessProfileId, businessProfileToManageId, selectedIndividualProfileId, selectedSkillsetProfileId, skillsetProfileToManageId, selectedJobId]);

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
      {showMessagesNotifications && <MessagesNotificationsScreen onClose={() => setShowMessagesNotifications(false)} onOpenChatDetail={handleOpenChatDetail} />}
      {isLoggedIn && showChatDetailScreen && currentChatContext && <ChatDetailScreen isOpen={showChatDetailScreen} onClose={() => { setShowChatDetailScreen(false); setCurrentChatContext(null); }} chatContext={currentChatContext} onSendMessage={handleSendMessageInChatDetail} currentUserAvatar={user?.avatarUrl} currentUserAvatarAiHint={user?.avatarAiHint} />}
      {isLoggedIn && showServiceBookingDialog && bookingTargetProfile && <ServiceBookingDialog isOpen={showServiceBookingDialog} onClose={() => setShowServiceBookingDialog(false)} professionalId={bookingTargetProfile.id} professionalName={bookingTargetProfile.name} skillName={bookingTargetProfile.skillName} onSubmit={(req) => { setActiveBookings(prev => [...prev, { ...req, id: `booking-${Date.now()}`, status: 'Pending', createdAt: new Date().toISOString(), bookingDate: `${req.requestedDate}, ${req.requestedTime}` }]); setShowServiceBookingDialog(false); toast({ title: "Booking Request Sent!"}); }} />}
    </div>
  );
}
