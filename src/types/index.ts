
import type { LucideIcon } from 'lucide-react';

// Updated TabName to include new navigation destinations
export type TabName =
  | 'login'
  | 'registration' // Added for registration flow
  | 'home'
  | 'feeds'
  | 'menu' // Corresponds to ServicesScreen
  | 'recommended'
  | 'account' // User's own profile/account settings
  | 'skillsets' // User's own skillsets management/view
  | 'vehicles' // User's own vehicle management/view
  | 'business-profiles' // Listing of user's business profiles
  | 'business-detail'; // Viewing a specific business profile
  // 'messages-notifications' is usually a modal/overlay, not a main tab

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
  address?: string;
}

// User Skillset Data
export interface UserSkill {
  id: string;
  name: string;
  level?: string;
  description: string;
  media?: string;
  mediaAiHint?: string;
  isActive?: boolean;
}

// User Vehicle Data - Updated to match UserVehiclesScreen.tsx logic
export interface UserVehicle {
  id: string;
  vehicleType: string; // e.g., Car, Bike, Auto
  licensePlate: string;
  isActive: boolean;
  // Optional: brand, model, year, color can be added back if needed for other features
  // brand?: string;
  // model?: string;
  // year?: number | string;
  // color?: string;
}

// Business Profile Product
export interface BusinessProduct {
  id: string | number;
  name: string;
  description?: string;
  price: string | number;
  imageUrl?: string;
  imageAiHint?: string;
}

// Business Profile Job Opening
export interface BusinessJob {
  id: string | number;
  title: string;
  location?: string;
  type?: string; // Full-time, Part-time
  description?: string;
  postedDate?: string;
}

// Business Profile Feed Item
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
  type: string;
  icon?: LucideIcon;
  content: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

// Active Activity Details for FAB and Activity View
export type ActivityDetails = {
    type?: 'ride' | 'request' | 'driver_status'; // 'driver_status' for when driver is online but no request/ride
    status?: string; // e.g., 'Looking for driver...', 'Driver Assigned', 'en_route', 'arrived', 'Online, awaiting requests...'
    pickup?: string;
    dropoff?: string;
    driverName?: string; // For rider view
    riderName?: string;  // For driver view (request or active ride)
    vehicle?: string; // For rider view
    fare?: string; // For driver view (request)
} | null;
