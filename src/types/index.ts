
import type { LucideIcon } from 'lucide-react';

export type TabName =
  | 'login'
  | 'registration'
  | 'home'
  | 'feeds'
  | 'menu' // Corresponds to ServicesScreen
  | 'recommended'
  | 'account'
  // | 'skillsets' // Replaced by 'user-skillsets' for clarity
  | 'vehicles'
  | 'business-profiles'
  | 'business-detail'
  | 'messages-notifications'
  | 'individual-profile' // Public view of a general professional profile
  | 'skillset-profile' // Public view of a specific skillset profile
  | 'user-skillsets' // User's management screen for their skillset profiles
  | 'manage-skillset-profile'; // Screen to edit/manage a specific skillset profile

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
  icon: LucideIcon; // Changed to LucideIcon
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

// Represents a skill a user lists on their UserSkillsetsScreen (management view)
// This is being replaced by SkillsetProfileSummary
// export interface UserSkill {
//   id: string;
//   name: string;
//   level?: string;
//   description: string;
//   media?: string;
//   mediaAiHint?: string;
//   isActive?: boolean;
// }

export interface UserVehicle {
  id: string;
  vehicleType: string;
  licensePlate: string;
  isActive: boolean;
}

export interface BusinessProduct {
  id: string | number;
  name: string;
  description?: string;
  price: string | number;
  imageUrl?: string;
  imageAiHint?: string;
}

export interface BusinessJob {
  id: string | number;
  title: string;
  location?: string;
  type?: string;
  description?: string;
  postedDate?: string;
}

export interface BusinessFeedItem {
  id: string | number;
  content: string;
  image?: string;
  imageAiHint?: string;
  timestamp: string;
}

export interface UserBusinessProfile {
  id: string | number;
  name: string;
  logo?: string;
  logoAiHint?: string;
  coverPhoto?: string;
  coverPhotoAiHint?: string;
  bio: string;
  location?: string;
  website?: string;
  phone?: string;
  licenseNumber?: string;
  documentUrl?: string;
  followers?: number;
  following?: number;
  specialties?: string[];
  products?: BusinessProduct[];
  services?: string[];
  feed?: BusinessFeedItem[];
  jobs?: BusinessJob[];
  isActive?: boolean;
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

// Data structure for a user's GENERAL professional profile (if needed)
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
  skillsets: { // This would be a list of skills on a general profile
    name: string;
    level: string;
    description?: string;
    workExperience?: string; // General work experience related to this skill
    portfolioUrls?: { url: string; title?: string; }[]; 
  }[];
  recommendationsCount: number;
  averageRating: number;
  totalReviews: number;
  workExperienceEntries?: SkillsetSpecificWorkExperience[]; 
  portfolioItems?: SkillsetSpecificPortfolioItem[]; 
  professionalFeed?: SkillsetSpecificFeedItem[]; 
  reviews?: SkillsetSpecificReview[];
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

export interface SkillsetSpecificFeedItem {
  id: string;
  content: string;
  imageUrl?: string;
  imageAiHint?: string;
  timestamp: string;
}

export interface SkillsetSpecificReview {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

// Data for the public-facing detailed view of a single Skillset Profile
export interface SkillsetProfileData {
  id: string; // Unique ID for this specific Skillset Profile
  skillName: string;
  skillLevel?: string;
  skillDescription?: string;
  userName: string; // The user who owns this skillset profile
  userAvatarUrl?: string;
  userAvatarAiHint?: string;
  professionalTitle?: string; // User's overall professional title (can be overridden by skill-specific one)
  skillSpecificBio?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
    location?: string;
  };
  workExperienceEntries: SkillsetSpecificWorkExperience[];
  portfolioItems: SkillsetSpecificPortfolioItem[];
  professionalFeed?: SkillsetSpecificFeedItem[];
  reviews: SkillsetSpecificReview[];
  recommendationsCount: number; // Specific to this skillset
  averageRating: number; // Specific to this skillset
  totalReviews: number; // Specific to this skillset
}

// Summary of a Skillset Profile for listing in UserSkillsetsScreen (management view)
export interface SkillsetProfileSummary {
  id: string; 
  skillName: string; 
  skillLevel?: string; 
  isActive: boolean; 
  // Optional summary stats for display in list
  portfolioItemCount?: number;
  averageRating?: number; 
}
