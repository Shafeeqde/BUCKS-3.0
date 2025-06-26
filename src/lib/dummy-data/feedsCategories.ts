
import type { Category } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';

export const initialCategoriesData: Category[] = [
  { id: 'moments-0', name: 'Your Moments', icon: PlusIcon, type: 'moments', viewed: false, color: 'bg-primary/10 text-primary', dataAiHint: 'add story' },
  { id: 'cat-deepthi', name: 'Deepthi S.', image: 'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnaXJsfGVufDB8fHx8MTc1MDA5Njc4NHww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'woman ux designer professional', viewed: false, profileId: 'deepthi-suvarna-profile' },
  { id: 'cat-senthil', name: 'Senthil D.', image: 'https://source.unsplash.com/random/100x100/?man,designer,indian', dataAiHint: 'man designer indian', viewed: false, profileId: 'senthil-devaraj-profile' },
  { id: 'cat-shoby', name: 'Shoby C.', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW58ZW58MHx8fHwxNzUwMDk2NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'man founder creative studio', viewed: true, profileId: 'shoby-c-profile' },
  // Add more users with moments here to populate the bar
];
