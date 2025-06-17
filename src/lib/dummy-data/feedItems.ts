
import type { FeedItem, Comment } from '@/types';

const commonComments: Comment[] = [
  { id: 'c1', user: 'Alex P.', userAvatar: 'https://source.unsplash.com/random/32x32/?man,glasses', text: 'Great post! Very insightful.', timestamp: '1h ago' },
  { id: 'c2', user: 'Maria G.', userAvatar: 'https://source.unsplash.com/random/32x32/?woman,smiling', text: 'Thanks for sharing this!', timestamp: '45m ago' },
  { id: 'c3', user: 'John B.', userAvatar: 'https://source.unsplash.com/random/32x32/?person,casual', text: 'Interesting perspective. I agree.', timestamp: '30m ago' },
];

export const feedItems: FeedItem[] = [
  {
    id: 1, type: 'post', user: 'Senthil Devaraj', userImage: 'https://source.unsplash.com/random/100x100/?man,designer,indian', userImageAiHint: 'man designer indian', profileId: 'senthil-devaraj-profile',
    timestamp: '1 day ago',
    content: 'Exploring new design trends for 2024. So much inspiration out there! #UXdesign #UIDesign',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x400/?design,trends,moodboard', aiHint: 'design trends moodboard' },
    comments: 7, recommendations: 32, notRecommendations: 1,
    commentsData: [
        ...commonComments.slice(0,1),
        { id: 'c-sd-1', user: 'Deepthi Suvarna', userAvatar: 'https://source.unsplash.com/random/32x32/?woman,ux,designer', text: 'Totally agree, Senthil! Especially loving the use of glassmorphism.', timestamp: '20h ago' }
    ]
  },
  {
    id: 2, type: 'post', user: 'Deepthi Suvarna', userImage: 'https://source.unsplash.com/random/100x100/?woman,ux,designer,professional', userImageAiHint: 'woman ux designer professional', profileId: 'deepthi-suvarna-profile',
    timestamp: '2 hours ago',
    content: 'Thrilled to be part of the Mikado.biz team! Working on some exciting projects. #MikadoLife #UXJobs',
    comments: 6, recommendations: 28, notRecommendations: 0,
    commentsData: [
      { id: 'c-ds-1', user: 'Subhesh P.', userAvatar: 'https://source.unsplash.com/random/32x32/?man,team,lead', text: 'Welcome aboard, Deepthi! Glad to have you.', timestamp: '1h ago' },
    ]
  },
  {
    id: 3, type: 'post', user: 'Shoby C Chummar', userImage: 'https://source.unsplash.com/random/100x100/?man,founder,creative,studio', userImageAiHint: 'man founder creative studio', profileId: 'shoby-c-profile',
    timestamp: '12 hours ago',
    content: 'Reflecting on Mikado.biz\'s journey and excited for what the future holds. Grateful for our amazing team and clients! #Entrepreneurship #MikadoStory',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x400/?business,growth,chart', aiHint: 'business growth chart' },
    comments: 20, recommendations: 75, notRecommendations: 3,
    commentsData: [
        { id: 'c-scc-1', user: 'Diju K.', text: 'Well said, Shoby! To many more milestones.', timestamp: '10h ago' }
    ]
  },
  {
    id: 4, type: 'ad', user: 'Creative Cloud', userImage: 'https://source.unsplash.com/random/40x40/?adobe,logo', userImageAiHint: 'adobe logo', profileId: 'adobe-creative-cloud-profile',
    media: { type: 'image', url: 'https://images.unsplash.com/photo-1623079478319-945f25f0a97b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMnx8U2Nvb3RlcnxlbnwwfHx8fDE3NTAxNTI0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080', aiHint: 'scooter advertisement' },
    content: 'TVS Ntorq 125 Price : Check On-Road & Ex-Showroom Prices of All Variants -',
    timestamp: 'Sponsored Ad', comments: 0, recommendations: 150, notRecommendations: 0,
    commentsData: []
  },
  {
    id: 5, type: 'post', user: 'Anand Nanda Kumar', userImage: 'https://source.unsplash.com/random/100x100/?man,motion,graphics,artist', userImageAiHint: 'man motion graphics artist', profileId: 'anand-nk-profile',
    timestamp: '10 hours ago',
    content: 'Just finished a new motion graphics piece for a product showcase. So satisfying to see it all come together! #MotionGraphics #AfterEffects',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x400/?abstract,motion,design', aiHint: 'abstract motion design' }, // Placeholder as video player not implemented
    comments: 10, recommendations: 55, notRecommendations: 1,
    commentsData: commonComments
  },
  {
    id: 6, type: 'post', user: 'Nirmal G.', userImage: 'https://source.unsplash.com/random/100x100/?man,graphic,artist,focused', userImageAiHint: 'man graphic artist focused', profileId: 'nirmal-g-profile',
    timestamp: '6 hours ago',
    content: 'New logo design for a local startup. Loved working on this brand identity! #GraphicDesign #Branding',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x400/?logo,design,mockup', aiHint: 'logo design mockup' },
    comments: 8, recommendations: 40, notRecommendations: 0,
    commentsData: [
        { id: 'c-ng-1', user: 'Startup Owner', text: 'Amazing work, Nirmal! We love it.', timestamp: '5h ago' }
    ]
  },
];
