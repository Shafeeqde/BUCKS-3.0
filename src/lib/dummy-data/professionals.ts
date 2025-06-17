
import type { IndividualProfessionalCardData } from '@/components/search/IndividualProfessionalCard';

export const dummyProfessionalProfiles: IndividualProfessionalCardData[] = [
  {
    id: 'prof1',
    name: 'Jenson Harris',
    avatarUrl: 'https://source.unsplash.com/random/80x80/?man,smiling,professional',
    avatarAiHint: 'man smiling professional',
    professionalTitle: 'Interior Home Stylist',
    previewImages: [
      { url: 'https://source.unsplash.com/random/200x150/?modern,living,room', aiHint: 'modern living room' },
      { url: 'https://source.unsplash.com/random/200x150/?stylish,kitchen', aiHint: 'stylish kitchen' },
      { url: 'https://source.unsplash.com/random/200x150/?cozy,bedroom', aiHint: 'cozy bedroom' },
      { url: 'https://source.unsplash.com/random/200x150/?elegant,dining,area', aiHint: 'elegant dining area' },
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
    avatarUrl: 'https://source.unsplash.com/random/80x80/?woman,architect',
    avatarAiHint: 'woman architect',
    professionalTitle: 'Lead UX Designer',
    previewImages: [
      { url: 'https://source.unsplash.com/random/200x150/?app,interface', aiHint: 'app interface' },
      { url: 'https://source.unsplash.com/random/200x150/?website,mockup', aiHint: 'website mockup' },
      { url: 'https://source.unsplash.com/random/200x150/?user,flow,diagram', aiHint: 'user flow diagram' },
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
    avatarUrl: 'https://source.unsplash.com/random/80x80/?man,plumber,tools',
    avatarAiHint: 'man plumber tools',
    professionalTitle: 'Master Plumber',
    previewImages: [
      { url: 'https://source.unsplash.com/random/200x150/?pipe,installation', aiHint: 'pipe installation' },
      { url: 'https://source.unsplash.com/random/200x150/?bathroom,fixture', aiHint: 'bathroom fixture' },
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
    avatarUrl: 'https://source.unsplash.com/random/80x80/?woman,graphic,designer',
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
