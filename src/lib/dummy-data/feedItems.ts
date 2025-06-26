
import type { FeedItem, Comment } from '@/types';

const commonComments: Comment[] = [
  { id: 'c1', user: 'Alex P.', userAvatar: 'https://source.unsplash.com/random/32x32/?man,glasses', userAvatarAiHint: 'man glasses', text: 'Great post! Very insightful.', timestamp: '1h ago' },
  { id: 'c2', user: 'Maria G.', userAvatar: 'https://source.unsplash.com/random/32x32/?woman,smiling', userAvatarAiHint: 'woman smiling', text: 'Thanks for sharing this!', timestamp: '45m ago' },
  { id: 'c3', user: 'John B.', userAvatar: 'https://source.unsplash.com/random/32x32/?person,casual', userAvatarAiHint: 'person casual', text: 'Interesting perspective. I agree.', timestamp: '30m ago' },
];

export const feedItems: FeedItem[] = [
  {
    id: 1, type: 'post', user: 'Senthil Devaraj', userImage: 'https://source.unsplash.com/random/100x100/?man,designer,indian', userImageAiHint: 'man designer indian', profileId: 'senthil-devaraj-profile',
    timestamp: '1 day ago',
    content: 'Exploring new design trends for 2024. So much inspiration out there! #UXdesign #UIDesign',
    media: { type: 'image', url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx1eCUyMHVpfGVufDB8fHx8MTc1MDE3MTI5Mnww&ixlib=rb-4.1.0&q=80&w=1080', aiHint: 'design trends moodboard' },
    comments: 7, recommendations: 32, notRecommendations: 1,
    commentsData: [
        ...commonComments.slice(0,1),
        { id: 'c-sd-1', user: 'Deepthi Suvarna', userAvatar: 'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnaXJsfGVufDB8fHx8MTc1MDA5Njc4NHww&ixlib=rb-4.1.0&q=80&w=1080', userAvatarAiHint: 'woman ux designer professional', text: 'Totally agree, Senthil! Especially loving the use of glassmorphism.', timestamp: '20h ago' }
    ]
  },
  {
    id: 2, type: 'post', user: 'Deepthi Suvarna', userImage: 'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnaXJsfGVufDB8fHx8MTc1MDA5Njc4NHww&ixlib=rb-4.1.0&q=80&w=1080', userImageAiHint: 'woman ux designer professional', profileId: 'deepthi-suvarna-profile',
    timestamp: '2 hours ago',
    content: 'Thrilled to be part of the Mikado.biz team! Working on some exciting projects. #MikadoLife #UXJobs',
    comments: 6, recommendations: 28, notRecommendations: 0,
    commentsData: []
  },
  {
    id: 3, type: 'post', user: 'Shoby C Chummar', userImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW58ZW58MHx8fHwxNzUwMDk2NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080', userImageAiHint: 'man founder creative studio', profileId: 'shoby-c-profile',
    timestamp: '12 hours ago',
    content: 'Reflecting on Mikado.biz\'s journey and excited for what the future holds. Grateful for our amazing team and clients! #Entrepreneurship #MikadoStory',
    media: { type: 'image', url: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxidXNpbmVzcyUyMGdyb3d0aHxlbnwwfHx8fDE3NTAxNzEzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080', aiHint: 'business growth chart' },
    comments: 20, recommendations: 75, notRecommendations: 3,
    commentsData: []
  },
];
