import type { LucideIcon } from 'lucide-react';

export type TabName = 'home' | 'feeds' | 'menu' | 'recommended' | 'account';

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
  timestamp: string; // Could be a date string or relative time like "2 hours ago"
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
  targetTab?: TabName; // Optional: for services that navigate
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
