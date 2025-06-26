
import type { PublicProfileData } from '@/types';

export const individualProfiles: PublicProfileData[] = [
  {
    id: 'senthil-devaraj-profile',
    name: 'Senthil Devaraj',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,designer,indian',
    avatarAiHint: 'man designer indian',
    professionalTitle: 'UX UI Designer',
    bio: 'Passionate UX/UI Designer crafting intuitive and engaging digital experiences. Specializing in user research, wireframing, prototyping, and usability testing. Always eager to solve complex problems with user-centered design solutions.',
    followers: 180,
    following: 95,
    posts: [
      { id: 'sdp1', content: 'Exploring new design trends for 2024. So much inspiration out there! #UXdesign #UIDesign', timestamp: '1 day ago', imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx1eCUyMHVpfGVufDB8fHx8MTc1MDE3MTI5Mnww&ixlib=rb-4.1.0&q=80&w=1080', imageAiHint: 'design trends moodboard', likes: 32, comments: 7 },
      { id: 'sdp2', content: 'My latest article on "The Importance of User Feedback in Iterative Design" is now live on Medium. Link in bio!', timestamp: '3 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?design,article,mockup', imageAiHint: 'design article mockup', likes: 45, comments: 11 },
    ],
    contactInfo: { email: 'senthil.design@example.com', website: 'https://senthildesigns.com' }
  },
  {
    id: 'deepthi-suvarna-profile',
    name: 'Deepthi Suvarna',
    avatarUrl: 'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnaXJsfGVufDB8fHx8MTc1MDA5Njc4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    avatarAiHint: 'woman ux designer professional',
    professionalTitle: 'UX UI Designer at Mikado.biz',
    bio: 'Creative UX UI Designer at Mikado.biz, focused on creating seamless user journeys and visually appealing interfaces. Strong believer in collaborative design and agile methodologies.',
    followers: 210,
    following: 115,
    moments: [
        { id: 'ds-m1', imageUrl: 'https://source.unsplash.com/random/1080x1920/?office,whiteboard,ux', aiHint: 'office whiteboard ux', caption: 'Brainstorming session for the new feature!', timestamp: '2h ago' },
        { id: 'ds-m2', imageUrl: 'https://source.unsplash.com/random/1080x1920/?coffee,laptop,desk', aiHint: 'coffee laptop desk', caption: 'Fueling up for a productive afternoon.', timestamp: '1h ago' },
    ],
    posts: [
      { id: 'dsp1', content: 'Thrilled to be part of the Mikado.biz team! Working on some exciting projects. #MikadoLife #UXJobs', timestamp: '2 hours ago', likes: 28, comments: 6 },
      { id: 'dsp2', content: 'A sneak peek of a recent UI concept I developed for a client. Feedback welcome! #UI #DesignConcept', timestamp: '2 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?ui,concept,app', imageAiHint: 'ui concept app', likes: 52, comments: 10 },
    ],
    contactInfo: { email: 'deepthi.s@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'shoby-c-profile',
    name: 'Shoby C Chummar',
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW58ZW58MHx8fHwxNzUwMDk2NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    avatarAiHint: 'man founder creative studio',
    professionalTitle: 'Founder & Creative Head at Mikado.biz',
    bio: 'Visionary founder and creative force behind Mikado.biz. Dedicated to building a world-class design agency that delivers exceptional results and fosters innovation.',
    followers: 550,
    following: 200,
     moments: [
        { id: 'sc-m1', imageUrl: 'https://source.unsplash.com/random/1080x1920/?team,meeting,presentation', aiHint: 'team meeting presentation', caption: 'Presenting our Q3 roadmap to the team!', timestamp: '4h ago' },
    ],
    posts: [
      { id: 'sccp1', content: 'Reflecting on Mikado.biz\'s journey and excited for what the future holds. Grateful for our amazing team and clients! #Entrepreneurship #MikadoStory', timestamp: '12 hours ago', imageUrl: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxidXNpbmVzcyUyMGdyb3d0aHxlbnwwfHx8fDE3NTAxNzEzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080', imageAiHint: 'business growth chart', likes: 75, comments: 20 },
    ],
    contactInfo: { email: 'shoby.c@mikado.biz', website: 'https://mikado.biz' }
  },
  // Add other profiles here to ensure consistency
];
