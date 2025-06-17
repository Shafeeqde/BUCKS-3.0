
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'; // For Heroicons

// Used by Heroicons
export type HeroIconType = ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {title?: string | undefined; titleId?: string | undefined;} & RefAttributes<SVGSVGElement>>;


export type TabName =
  | 'login'
  | 'registration'
  | 'home'
  | 'feeds'
  | 'menu'
  | 'recommended'
  | 'account'
  | 'professional-profile'
  | 'vehicles'
  | 'business-profiles'
  | 'business-detail'
  | 'manage-business-profile'
  | 'messages-notifications'
  | 'individual-profile'
  | 'skillset-profile'
  | 'user-skillsets'
  | 'manage-skillset-profile'
  | 'job-board'
  | 'job-detail'
  | 'account-settings'
  | 'digital-id-card'
  | 'create-post'; // Added new tab

export interface Category {
  id: string;
  name?: string;
  icon?: string | HeroIconType;
  image?: string;
  type?: 'moments' | 'profile' | 'default';
  viewed: boolean;
  color?: string;
  dataAiHint?: string;
  profileId?: string; // Added for linking user categories to profiles
}

export interface FeedItem {
  id: number; // Keeping as number for this specific mock data, could be string if from backend
  type: 'post' | 'job' | 'ad';
  user: string;
  userImage: string;
  userImageAiHint?: string;
  timestamp: string;
  content: string;
  postImage?: string;
  postImageAiHint?: string;
  comments: number;
  recommendations: number;
  notRecommendations: number;
  showCommentBox: boolean;
  currentComment: string;
  profileId?: string; // Added for linking post authors to profiles
}

export interface Service {
  id: string;
  name: string;
  icon: HeroIconType;
  locked: boolean;
  dataAiHint?: string;
}

export interface RecommendedPost {
  id: number; // Keeping as number for this specific mock data
  recommendedBy: string;
  userImage: string;
  userImageAiHint?: string;
  title: string;
  content: string;
  thumbnail: string;
  thumbnailAiHint?: string;
  type: 'image' | 'video';
  otherRecommendersCount?: number;
}

export interface LocationResult {
  name: string;
  address: string;
}

export interface GeneralQueryOutput {
  answer: string;
  locations?: LocationResult[];
  queryType: 'general' | 'location_search';
}

export interface VehicleOption {
  id: string;
  name: string;
  icon: HeroIconType;
  dataAiHint?: string;
  priceRange: string;
  estimatedETA: string;
  minRide?: string;
  pricePerKm?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address?: string;
  avatarUrl?: string;
}

export interface UserVehicle {
  id: string;
  vehicleType: string;
  licensePlate: string;
  isActive: boolean;
}

export interface BusinessProduct {
  id: string; 
  name: string;
  description?: string;
  price: string;
  discountPrice?: string;
  discountPercentage?: string;
  imageUrl?: string;
  imageAiHint?: string;
}

export interface BusinessJob {
  id: string; 
  businessId: string; 
  businessName: string;
  businessLogoUrl?: string;
  title: string;
  location?: string;
  type?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | string;
  description?: string;
  postedDate?: string;
  salaryRange?: string;
  requirements?: string[];
  applyLink?: string;
}


export interface BusinessFeedItem {
  id: string; 
  content: string;
  image?: string;
  imageAiHint?: string;
  videoUrl?: string;
  timestamp: string;
}

export interface BusinessService {
  id: string; 
  name:string;
  description?: string;
  price?: string;
}

export interface BusinessReview {
  id: string; 
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserBusinessProfile {
  id: string; 
  name: string;
  logo?: string;
  logoAiHint?: string;
  coverPhoto?: string;
  coverPhotoAiHint?: string;
  bio: string;
  website?: string;
  phone?: string;
  email?: string;
  location?: string;
  specialties?: string[];
  followers?: number;
  following?: number;
  feed?: BusinessFeedItem[];
  products?: BusinessProduct[];
  services?: BusinessService[];
  jobs?: BusinessJob[];
  reviews?: BusinessReview[];
  averageRating?: number;
  totalReviews?: number;
  isActive?: boolean;
  licenseNumber?: string;
  documentUrl?: string;
  // Timestamps that Firestore might add automatically
  createdAt?: any; // Firestore Timestamp type
  updatedAt?: any; // Firestore Timestamp type
}


export interface BusinessProductCardItem {
  id: string;
  name: string;
  imageUrl?: string;
  imageAiHint?: string;
  price: string;
  discountPrice?: string;
  discountPercentage?: string;
}

export interface BusinessProfileCardData {
  id: string; 
  name: string;
  logoUrl?: string;
  logoAiHint?: string;
  briefInfo?: string;
  tagline?: string;
  previewMedia?: {
      id: string;
      type: 'image' | 'video';
      url: string;
      aiHint?: string;
  }[];
  averageRating?: number;
  totalReviews?: number;
  products?: BusinessProductCardItem[];
  phone?: string;
  email?: string;
}


export interface MessageItem {
  id: string | number;
  sender: string;
  senderImage?: string;
  senderImageAiHint?: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationItem {
  id: string | number;
  type: string;
  icon?: HeroIconType;
  content: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export type ActivityDetails = {
    type?: 'ride' | 'request' | 'driver_status';
    status?: string;
    pickup?: string;
    dropoff?: string;
    driverName?: string;
    riderName?: string;
    vehicle?: string;
    fare?: string;
    distance?: string;
    vehicleType?: string;
} | null;

export interface WorkExperienceEntry {
    id: string;
    title: string;
    company: string;
    employmentType?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

export interface EducationEntry {
    id: string;
    institution: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

export interface LicenseCertificationEntry {
    id: string;
    name: string;
    issuingOrganization?: string;
    issueDate?: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
}

export interface OverallProfessionalProfileData {
    id: string;
    userId: string;
    name?: string;
    professionalTitle?: string;
    avatarUrl?: string;
    avatarAiHint?: string;
    coverPhotoUrl?: string;
    coverPhotoAiHint?: string;
    professionalBio?: string;
    areasOfExpertise: string[];
    externalProfileLinks: {
        id: string;
        platform: string;
        url: string;
    }[];
    workExperience: WorkExperienceEntry[];
    education: EducationEntry[];
    licensesCertifications: LicenseCertificationEntry[];
}

// Renamed from previous IndividualProfileData to avoid confusion,
// this type is for VIEWING other users' profiles.
export interface PublicProfileData {
  id: string; // Unique ID for this user's profile
  name: string;
  avatarUrl?: string;
  avatarAiHint?: string;
  professionalTitle?: string;
  bio?: string;
  // Simplified posts structure for their feed
  posts: {
    id: string;
    content: string;
    timestamp: string;
    imageUrl?: string;
    imageAiHint?: string;
    likes: number;
    comments: number;
  }[];
  followers?: number;
  following?: number;
  // Optional: Add other fields like contact info if they should be public
  contactInfo?: {
    email?: string;
    website?: string;
    location?: string;
  };
}


export interface SkillsetSpecificWorkExperience {
  id: string;
  title: string;
  company: string;
  years: string;
  description?: string;
}

export interface SkillsetSpecificPortfolioItem {
  id:string;
  title: string;
  imageUrl?: string;
  imageAiHint?: string;
  videoUrl?: string;
  description?: string;
  link?: string;
}

export interface SkillsetSpecificFeedItem {
  id: string;
  content: string;
  imageUrl?: string;
  imageAiHint?: string;
  videoUrl?: string;
  timestamp: string;
}


export interface SkillsetProfileData {
  id: string;
  skillName: string;
  skillLevel?: string;
  skillDescription?: string;
  userName: string;
  userAvatarUrl?: string;
  userAvatarAiHint?: string;
  professionalTitle?: string;
  skillSpecificBio?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
    location?: string;
  };
  workExperienceEntries: SkillsetSpecificWorkExperience[];
  portfolioItems: SkillsetSpecificPortfolioItem[];
  professionalFeed: SkillsetSpecificFeedItem[];
  reviews: BusinessReview[];
  recommendationsCount: number;
  averageRating: number;
  totalReviews: number;
  isActive?: boolean;
}

export interface SkillsetProfileSummary {
  id: string;
  skillName: string;
  skillLevel?: string;
  isActive: boolean;
  portfolioItemCount?: number;
  averageRating?: number;
}

export interface UserDataForSideMenu {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatarAiHint?: string;
}

// This type is for the current user's content management screen (AccountScreen)
export interface ProfilePost {
  id: string; // Ensure ID is string for consistency
  type: 'image' | 'video' | 'link' | 'file' | 'tweet' | 'text' | 'post';
  user: string; // Name of the user
  userId?: string; // ID of the user who posted
  userImage?: string;
  userImageAiHint?: string;
  timestamp: string; // Can be formatted string like "2h ago" or ISO date
  likes: number;
  comments: number;
  content?: string;
  thumbnailUrl?: string;
  thumbnailAiHint?: string;
  imageUrl?: string;
  imageAiHint?: string;
  videoUrl?: string;
  url?: string; // For link type posts
  fileIcon?: string; // For file type posts
  fileName?: string; // For file type posts
}
