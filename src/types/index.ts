
import type { LucideIcon } from 'lucide-react';

// Updated TabName to include new navigation destinations
export type TabName =
  | 'login'
  | 'home'
  | 'feeds'
  | 'menu'
  | 'recommended'
  | 'account' // Professional Profile editing
  | 'skillsets' // User's own skillsets management/view
  | 'vehicles' // User's own vehicle management/view
  | 'business-profiles' // Listing of user's business profiles
  | 'business-detail'; // Viewing a specific business profile

export interface Category {
  id: string;
  name?: string;
  icon?: string | LucideIcon; // SVG string or Lucide component
  image?: string;
  type?: 'moments' | 'profile' | 'default';
  viewed: boolean;
  color?: string; // e.g. 'bg-purple-100'
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
  name: string;
  icon: string; // SVG string
  locked: boolean;
  targetTab?: TabName;
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
  name: string;
  eta: string;
  priceRange: string;
  minRide: string;
  pricePerKm: string;
  icon: string;
}

// User Profile Data (for AccountScreen)
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address?: string; // Added from user's example
  // Potentially other fields like profilePictureUrl, bio, etc.
}

// User Skillset Data
export interface UserSkill {
  id: string; // Or number
  name: string;
  level?: string; // e.g., Advanced, Intermediate
  description: string;
  media?: string; // URL to image, PDF, video
  isActive?: boolean;
}

// User Vehicle Data
export interface UserVehicle {
  id: string; // Or number
  brand: string; // e.g., Toyota
  model: string; // e.g., Camry
  year?: number | string;
  regNumber: string; // License Plate
  color?: string;
  documents?: File[]; // For uploads, or string[] for URLs
  isActive?: boolean;
}

// Business Profile Product (simplified from user's example)
export interface BusinessProduct {
  id: string | number;
  name: string;
  description?: string;
  price: string | number;
  imageUrl?: string;
  imageAiHint?: string;
}

// Business Profile Job Opening (simplified)
export interface BusinessJob {
  id: string | number;
  title: string;
  location?: string;
  type?: string; // Full-time, Part-time
  description?: string;
  postedDate?: string;
}

// Business Profile Feed Item (simplified)
export interface BusinessFeedItem {
  id: string | number;
  content: string;
  image?: string;
  imageAiHint?: string;
  timestamp: string;
}


// User Business Profile Data
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
  documentUrl?: string; // URL to registration, permit
  followers?: number;
  following?: number;
  specialties?: string[];
  products?: BusinessProduct[];
  services?: string[]; // List of service names
  feed?: BusinessFeedItem[];
  jobs?: BusinessJob[];
  isActive?: boolean;
}

// Message Item for MessagesNotificationsScreen
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

// Notification Item for MessagesNotificationsScreen
export interface NotificationItem {
  id: string | number;
  type: string; // e.g., 'Like', 'Comment', 'Follow', 'Update'
  icon?: LucideIcon; // Optional: Icon for the notification type
  content: string;
  timestamp: string;
  read: boolean;
  link?: string; // Optional: link to navigate to
}
