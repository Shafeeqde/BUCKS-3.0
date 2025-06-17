
import type { Category } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';

export const initialCategoriesData: Category[] = [
  { id: 'moments-0', name: 'Your Moments', icon: PlusIcon, type: 'moments', viewed: false, color: 'bg-primary/10 text-primary' },
  { id: 'cat-deepthi', name: 'Deepthi', image: 'https://source.unsplash.com/random/100x100/?woman,portrait,indian', dataAiHint: 'woman portrait indian', viewed: false, profileId: 'deepthi-profile' },
  { id: 'cat-maanisha', name: 'Maanisha', image: 'https://source.unsplash.com/random/100x100/?woman,smiling,professional', dataAiHint: 'woman smiling professional', viewed: false, profileId: 'manisha-profile' },
  { id: 'cat-subhesh', name: 'Subhesh', image: 'https://source.unsplash.com/random/100x100/?man,office,indian', dataAiHint: 'man office indian', viewed: true, profileId: 'subhesh-profile' },
  { id: 'cat-seena', name: 'Seena', image: 'https://source.unsplash.com/random/100x100/?person,outdoor,female', dataAiHint: 'person outdoor female', viewed: false, profileId: 'seena-profile' },
  { id: 'cat-shafeeq', name: 'Shafeeq', image: 'https://source.unsplash.com/random/100x100/?man,casual,beard', dataAiHint: 'man casual beard', viewed: false, profileId: 'shafeeq-profile' },
  { id: 'cat-senthil', name: 'Senthil', image: 'https://source.unsplash.com/random/100x100/?person,tech,southindian', dataAiHint: 'person tech southindian', viewed: true, profileId: 'senthil-profile' },
  { id: 'cat-mikado', name: 'Mikado', image: 'https://source.unsplash.com/random/100x100/?company,logo', dataAiHint: 'company logo', viewed: true, profileId: 'mikado-ux-ui-business-profile' },
  { id: 'cat-tvs', name: 'TVS Synergy', image: 'https://source.unsplash.com/random/100x100/?vehicle,brand', dataAiHint: 'vehicle brand', viewed: false },
];

    