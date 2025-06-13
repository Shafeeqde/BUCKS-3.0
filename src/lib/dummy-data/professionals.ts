
import type { IndividualProfessionalCardData } from '@/components/search/IndividualProfessionalCard';

export const dummyProfessionalProfiles: IndividualProfessionalCardData[] = [
  {
    id: 'prof1',
    name: 'Jenson Harris',
    avatarUrl: 'https://placehold.co/80x80.png',
    avatarAiHint: 'man smiling professional',
    professionalTitle: 'Interior Home Stylist',
    previewImages: [
      { url: 'https://placehold.co/200x150.png', aiHint: 'modern living room' },
      { url: 'https://placehold.co/200x150.png', aiHint: 'stylish kitchen' },
      { url: 'https://placehold.co/200x150.png', aiHint: 'cozy bedroom' },
      { url: 'https://placehold.co/200x150.png', aiHint: 'elegant dining area' },
    ],
    shortBio: 'Transforming spaces with creativity and precision. Passionate about creating beautiful and functional interiors that reflect your personality.',
    averageRating: 4.8,
    totalReviews: 125,
    recommendationsCount: 98,
    phone: '555-0101',
    email: 'jenson.h@example.com',
  },
  {
    id: 'prof2',
    name: 'Alicia Keyson',
    avatarUrl: 'https://placehold.co/80x80.png',
    avatarAiHint: 'woman architect',
    professionalTitle: 'Lead UX Designer',
    previewImages: [
      { url: 'https://placehold.co/200x150.png', aiHint: 'app interface' },
      { url: 'https://placehold.co/200x150.png', aiHint: 'website mockup' },
      { url: 'https://placehold.co/200x150.png', aiHint: 'user flow diagram' },
    ],
    shortBio: 'Crafting intuitive and engaging digital experiences. Expert in user research, prototyping, and usability testing.',
    averageRating: 4.9,
    totalReviews: 210,
    recommendationsCount: 180,
    phone: '555-0102',
    email: 'alicia.k@example.com',
  },
  {
    id: 'prof3',
    name: 'Marcus Cole',
    avatarUrl: 'https://placehold.co/80x80.png',
    avatarAiHint: 'man plumber tools',
    professionalTitle: 'Master Plumber',
    previewImages: [
      { url: 'https://placehold.co/200x150.png', aiHint: 'pipe installation' },
      { url: 'https://placehold.co/200x150.png', aiHint: 'bathroom fixture' },
    ],
    shortBio: 'Reliable and certified plumbing services for residential and commercial properties. 15+ years of experience.',
    averageRating: 4.6,
    totalReviews: 75,
    recommendationsCount: 60,
    phone: '555-0103',
    email: 'marcus.c@example.com',
  },
  {
    id: 'prof4',
    name: 'Sophia Lorenza',
    avatarUrl: 'https://placehold.co/80x80.png',
    avatarAiHint: 'woman graphic designer',
    professionalTitle: 'Freelance Graphic Designer',
    shortBio: 'Creative graphic designer specializing in branding, logo design, and marketing materials. Let\'s bring your vision to life!',
    averageRating: 4.7,
    totalReviews: 92,
    recommendationsCount: 78,
    // No preview images for this one to test conditional rendering
    phone: '555-0104',
    email: 'sophia.l@example.com',
  }
];
