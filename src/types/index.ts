
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'; // For Heroicons

// Used by Heroicons
export type HeroIconType = ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {title?: string | undefined; titleId?: string | undefined;} & RefAttributes<SVGSVGElement>>;


export type TabName =
  | 'login'
  | 'registration'
  | 'home'
  | 'feeds'
  | 'menu'
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
  | 'create-post'
  | 'detailed-post'
  | 'service-booking'
  // Food Ordering Tabs
  | 'food-restaurants'
  | 'food-restaurant-detail'
  // Shopping Tabs
  | 'shopping-categories'
  | 'shopping-products-list'
  | 'shopping-product-detail'
  // Unified Cart
  | 'unified-cart';


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
  postImage?: string; // For older structure, try to consolidate into media
  postImageAiHint?: string;
  comments: number;
  recommendations: number;
  notRecommendations: number;
  profileId?: string;
  showCommentBox?: boolean; // UI state, might not be ideal here
  currentComment?: string; // UI state
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
  vehicleType: string; // e.g., "Car (Sedan)", "Bike", "Auto Rickshaw"
  vehicleCategory?: 'car' | 'bike' | 'auto'; // More specific category for logic
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
  businessType?: BusinessType; // Make optional for easier partial updates initially
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
  price: string; // Final price for display
  discountPrice?: string; // Original price if discounted
  discountPercentage?: string; // Optional discount string
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
  chatPartnerId?: string;
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
  targetTab?: TabName;
  targetId?: string | number;
}

export type ActivityType =
  | 'ride' // Rider is on a ride, Driver is on a ride
  | 'request' // Driver receives a ride request
  | 'driver_status' // Driver is online/offline, not on a ride
  | 'delivery_request' // Delivery driver receives a request
  | 'delivery_task' // Delivery driver accepted a task and is in progress
  | 'product_order_notification'; // Business owner receives a product order

export type ActivityStatus =
  // Ride statuses
  | 'looking_for_driver'
  | 'driver_assigned'
  | 'en_route_to_pickup' // Driver going to rider
  | 'arrived_at_pickup'
  | 'ride_in_progress' // Rider and Driver on the way to destination
  | 'ride_completed'
  | 'ride_cancelled'
  // Driver statuses
  | 'driver_online_idle'
  | 'driver_offline'
  // Delivery statuses for driver
  | 'delivery_pending_acceptance'
  | 'delivery_accepted_en_route_pickup'
  | 'delivery_arrived_at_pickup'
  | 'delivery_picked_up_en_route_dropoff'
  | 'delivery_arrived_at_dropoff' // Optional intermediate
  | 'delivery_completed'
  | 'delivery_cancelled'
  // Product Order statuses
  | 'new_product_order'
  | 'product_order_accepted'
  | 'product_order_rejected'
  | 'product_order_processing'
  | 'product_order_ready_for_pickup'
  | 'product_order_out_for_delivery'
  | 'product_order_completed'
  | 'product_order_cancelled';


export interface ActivityDetails {
    type?: ActivityType;
    status?: ActivityStatus;
    
    // Common for ride & delivery
    pickup?: string;
    dropoff?: string;

    // Ride specific
    driverName?: string; // Rider's view
    riderName?: string;  // Driver's view (for request & active ride)
    vehicle?: string;    // Rider's view
    fare?: string;       // Driver's view (for request & active ride)
    distance?: string;   // Driver's view (for request)
    vehicleType?: string;// Driver's view (for request)

    // Delivery specific (for request and active task)
    itemName?: string;
    itemDescription?: string;
    estimatedPayment?: string;
    recipientName?: string;
    recipientPhone?: string;

    // Product Order specific
    orderId?: string;
    businessName?: string; // Name of the business receiving the order
    productName?: string;
    quantity?: number;
    customerName?: string;
    customerAddress?: string; // For product delivery
    totalAmount?: string;


    // For user placing a delivery (not implemented yet, but for future)
    deliveryPartnerName?: string; 
    deliveryVehicleInfo?: string; 
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
  email: string; // This is the User ID
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
  category: string;
  imageUrl?: string;
  imageAiHint?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceRange: string; // e.g., "$", "$$", "$$$"
  imageUrl?: string;
  imageAiHint?: string;
  address?: string;
  menu: MenuItem[];
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
  originalPrice?: number;
  categoryIds: string[]; // To link product to one or more categories
  imageUrl?: string;
  imageAiHint?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  tags?: string[];
  variants?: {
    id: string; // e.g., 'color', 'size'
    name: string; // e.g., 'Color', 'Size'
    options: {
      value: string; // e.g., 'Red', 'Large'
      imageUrl?: string; // For color swatches
      additionalPrice?: number; // If this option changes the price
    }[];
  }[];
}
// --- End E-commerce (Shopping) Types ---

// --- Chat & Messaging Types ---
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isSender: boolean;
  avatar?: string;
  avatarAiHint?: string;
}
// --- End Chat & Messaging Types ---
