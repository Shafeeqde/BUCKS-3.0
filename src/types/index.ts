
import type { LucideIcon } from 'lucide-react';

export type TabName =
  | 'login'
  | 'registration'
  | 'home'
  | 'feeds'
  | 'menu' // Corresponds to ServicesScreen
  | 'recommended'
  | 'account'
  | 'skillsets'
  | 'vehicles'
  | 'business-profiles'
  | 'business-detail'
  | 'messages-notifications' // This is usually a modal/overlay
  | 'individual-profile'; // Added for the new screen

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
  icon: string; // SVG string for SvgRenderer
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

export interface UserSkill {
  id: string;
  name: string;
  level?: string;
  description: string;
  media?: string;
  mediaAiHint?: string;
  isActive?: boolean;
}

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
    vehicle?: string; // e.g., "Cool Car - XX00YZ0000"
    fare?: string;
    distance?: string; // Added for request details (e.g. "5 km")
    vehicleType?: string; // Added for request details (e.g. "Car (Mini)")
} | null;

// Data structure for Individual Professional Profile Screen
export interface IndividualProfileData {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarAiHint?: string;
  bio?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  skillsets: {
    name: string;
    level: string;
    description?: string;
    workExperience?: string;
    portfolioUrls?: { url: string; title?: string; }[]; // Links to portfolio items for this skill
  }[];
  recommendationsCount: number;
  averageRating: number;
  totalReviews: number;
  // In a real app, reviews would be an array of objects
  // reviews: { reviewerName: string; rating: number; comment: string; date: string; }[];
  // professionalFeed: any[]; // Placeholder for professional feed items
}
