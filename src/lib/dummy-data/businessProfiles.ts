
import type { UserBusinessProfile } from '@/types';

export const dummyBusinessProfiles: UserBusinessProfile[] = [
  {
    id: 'bp-1',
    name: 'Hot Griddle Restaurant (Local Data)',
    bio: 'The best griddle in town! Serving international and locally sourced specialties. This is mock data because the database is not connected.',
    logo: 'https://placehold.co/100x100.png',
    logoAiHint: 'restaurant logo',
    coverPhoto: 'https://placehold.co/1200x400.png',
    coverPhotoAiHint: 'restaurant interior',
    location: 'BTM Layout, Bangalore',
    phone: '+91 9876543210',
    email: 'contact@hotgriddle.com',
    website: 'https://hotgriddle.com',
    followers: 1200,
    following: 15,
    averageRating: 4.5,
    totalReviews: 232,
    isActive: true,
    businessType: 'products_and_services',
    products: [
        { id: 'prod-biryani-101', name: 'Mutton Biryani (Serves 2)', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'mutton biryani', price: '299', discountPrice: '229', discountPercentage: '22%' },
        { id: 'prod-pizza-102', name: 'Spicy Chicken Pizza', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'pizza slice', price: '350' },
    ],
    services: [
        { id: 'serv-catering', name: 'Event Catering', description: 'Catering for parties and corporate events.' }
    ],
    jobs: [
        { id: 'job-chef', businessId: 'bp-1', businessName: 'Hot Griddle Restaurant', title: 'Sous Chef', location: 'Bangalore', type: 'Full-time', salaryRange: '₹40,000 - ₹55,000/month' }
    ]
  },
  {
    id: 'bp-2',
    name: 'Mikado UX UI Studio (Local Data)',
    bio: 'Curating digital experiences that connect with people. We specialize in UX, UI, and branding. This is mock data because the database is not connected.',
    logo: 'https://placehold.co/100x100.png',
    logoAiHint: 'design studio logo',
    coverPhoto: 'https://placehold.co/1200x400.png',
    coverPhotoAiHint: 'modern office',
    location: 'Indiranagar, Bangalore',
    phone: '+91 8197278080',
    email: 'hello@mikado.biz',
    website: 'https://mikado.biz',
    followers: 5000,
    following: 120,
    averageRating: 4.9,
    totalReviews: 75,
    isActive: true,
    businessType: 'services',
    services: [
        { id: 'serv-ux-research', name: 'UX Research', price: 'Quote Based' },
        { id: 'serv-ui-design', name: 'UI/UX Design', price: 'Quote Based' },
        { id: 'serv-branding', name: 'Brand Identity Package', price: 'Starting at ₹50,000' }
    ]
  }
];
