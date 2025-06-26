

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
  | 'service-booking';


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
  id: number | string; // Allow string for Firestore IDs
  type: 'post' | 'job' | 'ad' | 'recommended';
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
  showCommentBox?: boolean;
  currentComment?: string;
  commentsData?: Comment[];
  recommendedBy?: {
    name: string;
    othersCount: number;
  };
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
  targetTab?: TabName;
}

export interface LocationResult {
  name: string;
  address: string;
}

export interface GeneralQueryOutput {
  answer: string;
  locations?: LocationResult[];
  queryType: 'general' | 'location_search';
  suggestedAction?: {
    label: string;
    targetTab: string;
  }
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
  userId: string;
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
  userId?: string;
  name: string;
  name_lowercase?: string;
  logo?: string;
  logoAiHint?: string;
  coverPhoto?: string;
  coverPhotoAiHint?: string;
  bio: string;
  businessType?: BusinessType;
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
  | 'ride'
  | 'request'
  | 'driver_status'
  | 'delivery_request'
  | 'delivery_task'
  | 'product_order_notification';

export type ActivityStatus =
  | 'looking_for_driver'
  | 'driver_assigned'
  | 'en_route_to_pickup'
  | 'arrived_at_pickup'
  | 'ride_in_progress'
  | 'ride_completed'
  | 'ride_cancelled'
  | 'driver_online_idle'
  | 'driver_offline'
  | 'delivery_pending_acceptance'
  | 'delivery_accepted_en_route_pickup'
  | 'delivery_arrived_at_pickup'
  | 'delivery_picked_up_en_route_dropoff'
  | 'delivery_arrived_at_dropoff'
  | 'delivery_completed'
  | 'delivery_cancelled'
  | 'new_product_order'
  | 'product_order_accepted'
  | 'product_order_rejected'
  | 'product_order_processing'
  | 'product_order_ready_for_pickup'
  ...
  | 'product_order_out_for_delivery'
  | 'product_order_completed'
  | 'product_order_cancelled';


export interface ActivityDetails {
    type?: ActivityType;
    status?: ActivityStatus;
    pickup?: string;
    dropoff?: string;
    driverName?: string;
    riderName?: string;
    vehicle?: string;
    fare?: string;
    distance?: string;
    vehicleType?: string;
    itemName?: string;
    itemDescription?: string;
    estimatedPayment?: string;
    recipientName?: string;
    recipientPhone?: string;
    orderId?: string;
    businessName?: string;
    productName?: string;
    quantity?: number;
    customerName?: string;
    customerAddress?: string;
    totalAmount?: string;
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
    name_lowercase?: string;
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
  userId: string;
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

export interface ServiceBookingRequest {
  professionalId: string;
  professionalName: string;
  skillName: string;
  serviceDescription: string;
  requestedDate?: string;
  requestedTime?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface ActiveBooking {
  id: string;
  professionalId: string;
  professionalName: string;
  skillName: string;
  serviceDescription: string;
  status: BookingStatus;
  bookingDate: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isSender: boolean;
  avatar?: string;
  avatarAiHint?: string;
}
