
import type { LucideIcon } from 'lucide-react';

export type TabName =
  | 'login'
  | 'registration'
  | 'home'
  | 'feeds'
  | 'menu' // Corresponds to ServicesScreen
  | 'recommended'
  | 'account'
  | 'vehicles'
  | 'business-profiles'
  | 'business-detail'
  | 'messages-notifications'
  | 'individual-profile' // Public view of a general professional profile
  | 'skillset-profile' // Public view of a specific skillset profile
  | 'user-skillsets' // User's management screen for their skillset profiles
  | 'manage-skillset-profile';

export interface Category {
  id: string;
  name?: string;
  icon?: string | LucideIcon; // Can be SVG string or Lucide component
  image?: string;
  type?: 'moments' | 'profile' | 'default';
  viewed: boolean;
  color?: string;
  dataAiHint?: string;
}

export interface FeedItem {
  id: number;
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
}

export interface Service {
  id: string;
  name: string;
  icon: string; // SVG string
  locked: boolean;
  dataAiHint?: string;
}

export interface RecommendedPost {
  id: number;
  recommendedBy: string;
  userImage: string;
  userImageAiHint?: string;
  title: string;
  content: string;
  thumbnail: string;
  thumbnailAiHint?: string;
  type: 'image' | 'video';
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
  icon: LucideIcon;
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
}

export interface UserVehicle {
  id: string;
  vehicleType: string;
  licensePlate: string;
  isActive: boolean;
}

// --- Types for Business Profiles ---

// Product within a business profile (detailed view and card view can share this)
export interface BusinessProduct {
  id: string | number; // Changed to string | number to match UserBusinessProfile ID type
  name: string;
  description?: string;
  price: string; // Keep as string for display flexibility (e.g. "₹299")
  discountPrice?: string;
  discountPercentage?: string;
  imageUrl?: string;
  imageAiHint?: string;
}

export interface BusinessJob {
  id: string | number; // Changed to string | number
  title: string;
  location?: string;
  type?: string;
  description?: string;
  postedDate?: string;
}

export interface BusinessFeedItem {
  id: string | number; // Changed to string | number
  content: string;
  image?: string;
  imageAiHint?: string;
  videoUrl?: string;
  timestamp: string;
}

export interface BusinessService {
  id: string | number; // Changed to string | number
  name: string;
  description?: string;
  price?: string; // Optional service price
}

export interface BusinessReview {
  id: string | number; // Changed to string | number
  reviewerName: string;
  rating: number; // e.g., 4.5
  comment: string;
  date: string; // e.g., "2023-10-28"
}

// Detailed Business Profile Data (for UserBusinessProfileDetailScreen)
export interface UserBusinessProfile {
  id: string | number;
  name: string;
  logo?: string;
  logoAiHint?: string;
  coverPhoto?: string; // URL for cover photo
  coverPhotoAiHint?: string;
  bio: string;
  website?: string;
  phone?: string;
  email?: string; // Added email
  location?: string;
  specialties?: string[];
  followers?: number; // Renamed from followersCount for consistency
  following?: number; // Renamed from followingCount for consistency
  feed?: BusinessFeedItem[];
  products?: BusinessProduct[];
  services?: BusinessService[];
  jobs?: BusinessJob[];
  reviews?: BusinessReview[];
  averageRating?: number;
  totalReviews?: number;
  isActive?: boolean; // Kept from previous structure
  licenseNumber?: string; // Kept from previous structure
  documentUrl?: string; // Kept from previous structure
}


// --- Types for Search Result Cards ---

// Product item for display within a BusinessProfileCard
export interface BusinessProductCardItem {
  id: string;
  name: string;
  imageUrl?: string;
  imageAiHint?: string;
  price: string;
  discountPrice?: string;
  discountPercentage?: string;
}

// Data for BusinessProfileCard component (search results)
export interface BusinessProfileCardData {
  id: string | number;
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
  icon?: LucideIcon;
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

// Data structure for a user's GENERAL professional profile
export interface IndividualProfileData {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarAiHint?: string;
  professionalTitle?: string;
  bio?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
    location?: string;
  };
  skillsets: {
    name: string;
    level: string;
    description?: string;
    workExperience?: string;
    portfolioUrls?: { url: string; title?: string; }[];
  }[];
  recommendationsCount: number;
  averageRating: number;
  totalReviews: number;
  workExperienceEntries?: SkillsetSpecificWorkExperience[];
  portfolioItems?: SkillsetSpecificPortfolioItem[];
  professionalFeed?: SkillsetSpecificFeedItem[]; // Re-using BusinessFeedItem here, might need distinct type later
  reviews?: BusinessReview[]; // Re-using BusinessReview here
}

// --- Types for Skillset-Specific Profiles ---

export interface SkillsetSpecificWorkExperience {
  id: string;
  title: string;
  company: string;
  years: string; // e.g., "2018 - 2022"
  description?: string;
}

export interface SkillsetSpecificPortfolioItem {
  id: string;
  title: string;
  imageUrl?: string;
  imageAiHint?: string;
  videoUrl?: string;
  description?: string;
  link?: string;
}

// SkillsetSpecificFeedItem is similar to BusinessFeedItem, can reuse or create specific if needed.
// For now, can use BusinessFeedItem.

// SkillsetSpecificReview is similar to BusinessReview, can reuse or create specific if needed.
// For now, can use BusinessReview.

// Data for the public-facing detailed view of a single Skillset Profile
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
  professionalFeed?: BusinessFeedItem[]; // Using BusinessFeedItem for now
  reviews: BusinessReview[]; // Using BusinessReview for now
  recommendationsCount: number;
  averageRating: number;
  totalReviews: number;
}

// Summary of a Skillset Profile for listing in UserSkillsetsScreen (management view)
export interface SkillsetProfileSummary {
  id: string;
  skillName: string;
  skillLevel?: string;
  isActive: boolean;
  portfolioItemCount?: number;
  averageRating?: number;
}

    