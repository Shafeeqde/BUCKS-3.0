
import type { ProductCategory } from '@/types';

export const dummyProductCategories: ProductCategory[] = [
  {
    id: 'cat-electronics',
    name: 'Electronics',
    imageUrl: 'https://source.unsplash.com/random/600x400/?electronics,gadgets',
    imageAiHint: 'electronics gadgets',
    description: 'Discover the latest in tech and gadgets.',
  },
  {
    id: 'cat-fashion',
    name: 'Fashion',
    imageUrl: 'https://source.unsplash.com/random/600x400/?fashion,apparel',
    imageAiHint: 'fashion apparel',
    description: 'Trendy clothing, shoes, and accessories.',
  },
  {
    id: 'cat-home-kitchen',
    name: 'Home & Kitchen',
    imageUrl: 'https://source.unsplash.com/random/600x400/?home,kitchen,appliances',
    imageAiHint: 'home kitchen appliances',
    description: 'Essentials for your home and kitchen needs.',
  },
  {
    id: 'cat-books',
    name: 'Books',
    imageUrl: 'https://source.unsplash.com/random/600x400/?books,library',
    imageAiHint: 'books library',
    description: 'Explore a world of stories and knowledge.',
  },
  {
    id: 'cat-sports-outdoors',
    name: 'Sports & Outdoors',
    imageUrl: 'https://source.unsplash.com/random/600x400/?sports,outdoors,equipment',
    imageAiHint: 'sports outdoors equipment',
    description: 'Gear up for your favorite activities.',
  },
];
