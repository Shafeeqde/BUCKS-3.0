
import type { LucideIcon } from 'lucide-react';

export type TabName =
  | 'login'
  | 'registration'
  | 'home'
  | 'feeds'
  | 'menu' // Corresponds to ServicesScreen
  | 'recommended'
  | 'account' // This will now be for "Personal Content Profile"
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
  | 'job-detail'; 

export interface Category {
  id: string;
  name?: string;
  icon?: string | LucideIcon; 
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
  icon: LucideIcon;
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

// For basic user profile editing in the original AccountScreen.
// This might be deprecated or merged with UserDataForSideMenu if professional profile handles all.
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

// --- Types for Business Profiles ---

export interface BusinessProduct {
  id: string | number;
  name: string;
  description?: string;
  price: string;
  discountPrice?: string;
  discountPercentage?: string;
  imageUrl?: string;
  imageAiHint?: string;
}

export interface BusinessJob {
  id: string | number; 
  businessId: string | number; 
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
  id: string | number;
  content: string;
  image?: string;
  imageAiHint?: string;
  videoUrl?: string;
  timestamp: string;
}

export interface BusinessService {
  id: string | number;
  name:string;
  description?: string;
  price?: string;
}

export interface BusinessReview {
  id: string | number;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserBusinessProfile {
  id: string | number;
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
}


// --- Types for Search Result Cards ---

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

// --- Overall Professional Profile Management ---
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
    id: string; 
    name: string;
    level: string;
    description?: string;
  }[];
  recommendationsCount: number;
  averageRating: number;
  totalReviews: number;
  workExperienceEntries?: WorkExperienceEntry[]; 
  portfolioItems?: SkillsetSpecificPortfolioItem[]; 
  professionalFeed?: BusinessFeedItem[]; 
  reviews?: BusinessReview[]; 
}

// --- Types for Skillset-Specific Profiles ---

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

// For SideMenu User Data & AccountScreen user data
export interface UserDataForSideMenu {
  id: string; // Added ID
  name: string;
  email: string;
  avatarUrl?: string;
  avatarAiHint?: string;
}

// --- Types for Personal Content Profile (AccountScreen) ---
export interface ProfilePost {
  id: string | number;
  type: 'image' | 'video' | 'link' | 'file' | 'tweet' | 'text'; // 'post' renamed to 'text' for clarity
  user: string; // User who posted (should be the logged-in user for this screen)
  timestamp: string;
  likes: number;
  comments: number;
  thumbnailUrl?: string; // For image, video, link previews
  thumbnailAiHint?: string;
  imageUrl?: string; // For full image
  imageAiHint?: string;
  videoUrl?: string;
  content?: string; // For text, tweet, link title, file name
  url?: string; // For links
  fileIcon?: string; // For files (e.g., '📄' or a Lucide icon name)
  fileName?: string;
}
