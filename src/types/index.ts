
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
  | 'messages-notifications' // This screen itself will remain, but items will navigate away or to chat
  | 'individual-profile'
  | 'skillset-profile'
  | 'user-skillsets'
  | 'manage-skillset-profile'
  | 'job-board'
  | 'job-detail'
  | 'account-settings'
  | 'digital-id-card'
  | 'create-post'
  | 'detailed-post'
  | 'service-booking'
  // Food Ordering Tabs
  | 'food-restaurants'
  | 'food-restaurant-detail'
  | 'food-cart'
  // Shopping Tabs
  | 'shopping-categories'
  | 'shopping-products-list'
  | 'shopping-product-detail'
  | 'shopping-cart';

export interface Category {
  id: string;
  name?: string;
  icon?: string | HeroIconType;
  image?: string;
  type?: 'moments' | 'profile' | 'default';
  viewed: boolean;
  color?: string;
  dataAiHint?: string;
  profileId?: string;
}

export interface MediaAttachment {
  type: 'image' | 'video' | 'document';
  url: string;
  fileName?: string;
  aiHint?: string;
  thumbnailUrl?: string;
}

export interface Comment {
  id: string;
  user: string;
  userAvatar?: string;
  userAvatarAiHint?: string;
  text: string;
  timestamp: string;
}

export interface FeedItem {
  id: number;
  type: 'post' | 'job' | 'ad';
  user: string;
  userImage: string;
  userImageAiHint?: string;
  timestamp: string;
  content: string;
  media?: MediaAttachment;
  comments: number;
  recommendations: number;
  notRecommendations: number;
  profileId?: string;
  commentsData?: Comment[];
}

export interface ProfilePost {
  id: string;
  user: string;
  userId?: string;
  userImage?: string;
  userImageAiHint?: string;
  timestamp: string;
  likes: number;
  comments: number;
  content?: string;
  media?: MediaAttachment;
  commentsData?: Comment[];
}


export interface Service {
  id: string;
  name: string;
  icon: HeroIconType;
  locked: boolean;
  dataAiHint?: string;
  targetTab?: TabName; // Optional: to directly navigate to a specific tab
}

export interface RecommendedPost {
  id: number;
  recommendedBy: string;
  userImage: string;
  userImageAiHint?: string;
  recommenderProfileId?: string;
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

export type BusinessType = 'products' | 'services' | 'products_and_services';

export interface UserBusinessProfile {
  id: string;
  name: string;
  logo?: string;
  logoAiHint?: string;
  coverPhoto?: string;
  coverPhotoAiHint?: string;
  bio: string;
  businessType: BusinessType; // Added businessType
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
  createdAt?: any;
  updatedAt?: any;
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
  chatPartnerId?: string; // Optional: To link to a full profile
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationItem {
  id: string | number;
  type: string; // E.g., 'Like', 'Comment', 'Follow', 'System Update'
  icon?: HeroIconType;
  content: string;
  timestamp: string;
  read: boolean;
  link?: string; // Old link, can be deprecated or used as fallback
  targetTab?: TabName; // New: For direct navigation
  targetId?: string | number; // New: For specific item ID (e.g., postId, profileId)
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

export interface PublicProfileData {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarAiHint?: string;
  professionalTitle?: string;
  bio?: string;
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

export interface UserMoment {
  id: string;
  imageUrl: string;
  aiHint?: string;
  caption?: string;
  timestamp: string;
}

export interface UserDataForSideMenu {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatarAiHint?: string;
  moments?: UserMoment[];
}

// --- Service Booking Types ---
export interface ServiceBookingRequest {
  professionalId: string;
  professionalName: string;
  skillName: string;
  serviceDescription: string;
  requestedDate?: string; // ISO string or formatted
  requestedTime?: string; // e.g., "10:00 AM", "Afternoon"
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface ActiveBooking {
  id: string;
  professionalId: string;
  professionalName: string;
  skillName: string;
  serviceDescription: string;
  status: BookingStatus;
  bookingDate: string; // Could be a combination of requestedDate and requestedTime
  createdAt: string; // ISO string
}
// --- End Service Booking Types ---

// --- Food Ordering Types ---
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string; // e.g., "Appetizers", "Main Course", "Desserts"
  imageUrl?: string;
  imageAiHint?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string; // e.g., "Italian", "Indian", "Chinese"
  rating: number;
  deliveryTime: string; // e.g., "25-35 min"
  priceRange: string; // e.g., "$$" (for relative cost)
  imageUrl?: string;
  imageAiHint?: string;
  address?: string;
  menu: MenuItem[];
}

export interface FoodCartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  imageAiHint?: string;
  restaurantId: string;
  restaurantName: string;
}
// --- End Food Ordering Types ---

// --- E-commerce (Shopping) Types ---
export interface ProductCategory {
  id: string;
  name: string;
  imageUrl?: string;
  imageAiHint?: string;
  description?: string;
}

export interface ProductListing {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For discounts
  categoryIds: string[]; // To link to ProductCategory
  imageUrl?: string;
  imageAiHint?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  tags?: string[];
  variants?: {
    id: string;
    name: string; // e.g., "Color", "Size"
    options: {
      value: string; // e.g., "Red", "Large"
      imageUrl?: string; // For color swatches etc.
      additionalPrice?: number;
    }[];
  }[];
}

export interface ShoppingCartItem {
  productId: string;
  name: string;
  price: number; // This would be the final price considering variant if any
  quantity: number;
  imageUrl?: string;
  imageAiHint?: string;
  variantInfo?: string; // e.g., "Color: Red, Size: Large"
}
// --- End E-commerce (Shopping) Types ---

// --- Chat & Messaging Types ---
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isSender: boolean; // True if the current logged-in user sent this message
  avatar?: string; // Avatar of the message sender (could be current user or other party)
  avatarAiHint?: string;
}
// --- End Chat & Messaging Types ---

    