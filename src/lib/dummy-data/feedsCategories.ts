
import type { Category } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';

export const initialCategoriesData: Category[] = [
  { id: 'moments-0', name: 'Your Moments', icon: PlusIcon, type: 'moments', viewed: false, color: 'bg-primary/10 text-primary', dataAiHint: 'add story' },
  { id: 'cat-deepthi', name: 'Deepthi S.', image: 'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnaXJsfGVufDB8fHx8MTc1MDA5Njc4NHww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'woman ux designer professional', viewed: false, profileId: 'deepthi-suvarna-profile' },
  { id: 'cat-maanisha', name: 'Maanisha K.', image: 'https://source.unsplash.com/random/100x100/?woman,creative,designer,indian', dataAiHint: 'woman creative designer indian', viewed: false, profileId: 'maanisha-k-profile' },
  { id: 'cat-subhesh', name: 'Subhesh P.', image: 'https://source.unsplash.com/random/100x100/?man,team,lead,office', dataAiHint: 'man team lead office', viewed: false, profileId: 'subhesh-p-profile' },
  { id: 'cat-seena', name: 'Seena P.', image: 'https://source.unsplash.com/random/100x100/?woman,creative,director,professional', dataAiHint: 'woman creative director professional', viewed: false, profileId: 'seena-p-profile' },
  { id: 'cat-senthil', name: 'Senthil D.', image: 'https://source.unsplash.com/random/100x100/?man,designer,indian', dataAiHint: 'man designer indian', viewed: false, profileId: 'senthil-devaraj-profile' },
  { id: 'cat-shoby', name: 'Shoby C.', image: 'https://source.unsplash.com/random/100x100/?man,founder,creative,studio', dataAiHint: 'man founder creative studio', viewed: true, profileId: 'shoby-c-profile' },
  { id: 'cat-diju', name: 'Diju K.', image: 'https://source.unsplash.com/random/100x100/?man,ceo,founder,professional', dataAiHint: 'man ceo founder professional', viewed: true, profileId: 'diju-k-profile' },
  { id: 'cat-anand', name: 'Anand NK.', image: 'https://source.unsplash.com/random/100x100/?man,motion,graphics,artist', dataAiHint: 'man motion graphics artist', viewed: false, profileId: 'anand-nk-profile' },
];
