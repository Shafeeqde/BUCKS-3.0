
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
  | 'messages-notifications'; // This is usually a modal/overlay

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
  id: string; // Added id for key prop
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

// Updated VehicleOption for ServicesScreen taxi booking
export interface VehicleOption {
  id: string;
  name: string;
  icon: LucideIcon; // Changed to LucideIcon for direct usage
  priceRange: string;
  estimatedETA: string;
  dataAiHint?: string;
  // minRide and pricePerKm can be added if needed for detailed display
  // minRide?: string; 
  // pricePerKm?: string;
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
    vehicle?: string;
    fare?: string;
} | null;


    