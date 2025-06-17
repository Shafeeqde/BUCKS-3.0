
import type { FeedItem, Comment } from '@/types';

const commonComments: Comment[] = [
  { id: 'c1', user: 'Alex P.', userAvatar: 'https://source.unsplash.com/random/32x32/?man,glasses', text: 'Great post! Very insightful.', timestamp: '1h ago' },
  { id: 'c2', user: 'Maria G.', userAvatar: 'https://source.unsplash.com/random/32x32/?woman,smiling', text: 'Thanks for sharing this!', timestamp: '45m ago' },
  { id: 'c3', user: 'John B.', userAvatar: 'https://source.unsplash.com/random/32x32/?person,casual', text: 'Interesting perspective. I agree.', timestamp: '30m ago' },
];

export const feedItems: FeedItem[] = [
  {
    id: 1, type: 'post', user: 'Shafeeq A.', userImage: 'https://source.unsplash.com/random/40x40/?man,casual,beard', userImageAiHint: 'man casual beard', profileId: 'shafeeq-profile',
    timestamp: 'Wishing you a joyful and prosperous Diwali',
    content: 'May this festival of lights bring happiness, success, and warmth to your lives.',
    media: { type: 'image', url: 'https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxEaXdhbGl8ZW58MHx8fHwxNzUwMTUxMjc3fDA&ixlib=rb-4.1.0&q=80&w=1080', aiHint: 'diwali festival' },
    comments: 7, recommendations: 10, notRecommendations: 2,
    commentsData: [
        ...commonComments.slice(0,2),
        { id: 'c-diwali-1', user: 'Priya K.', userAvatar: 'https://source.unsplash.com/random/32x32/?indian,woman', text: 'Happy Diwali to you too, Shafeeq!', timestamp: '2h ago' }
    ]
  },
  {
    id: 2, type: 'post', user: 'Senthil Devaraj', userImage: 'https://source.unsplash.com/random/40x40/?man,professional,southindian', userImageAiHint: 'man professional southindian', profileId: 'senthil-profile',
    timestamp: 'Unemployed for 12 months, seeking opportunities.',
    content: 'Hi Guys, I have been Unemployed for 12 months now, please help by reviewing my resume and please help if there are any opportunities. Senthil Devaraj Resume. \nAttaching my resume for quick review.',
    media: { type: 'document', url: '#', fileName: 'Senthil_Devaraj_Resume.pdf' },
    comments: 12, recommendations: 5, notRecommendations: 1,
    commentsData: [
      { id: 'c-senthil-1', user: 'HR Recruiter', userAvatar: 'https://source.unsplash.com/random/32x32/?professional,woman', text: 'Hi Senthil, please email your resume to careers@example.com.', timestamp: '5h ago' },
      { id: 'c-senthil-2', user: 'Tech Lead', userAvatar: 'https://source.unsplash.com/random/32x32/?man,tech', text: 'Good luck with your job search!', timestamp: '3h ago' },
    ]
  },
  {
    id: 3, type: 'job', user: 'Mikado UX UI', userImage: 'https://source.unsplash.com/random/40x40/?design,studio,logo', userImageAiHint: 'design studio logo', profileId: 'mikado-ux-ui-business-profile', 
    timestamp: 'Hiring Graphic Designer',
    content: 'Hi Design Enthusiast , we are in search of the graphic Designer with Illustrative and sketching skills , check out your Job portal and share you resume and please suggest you known persons if you know someone as we expected.',
    comments: 20, recommendations: 25, notRecommendations: 3,
    commentsData: [
        { id: 'c-mikado-1', user: 'Designer Dave', text: 'Applied! Looks like a great opportunity.', timestamp: '1d ago' }
    ]
  },
  {
    id: 4, type: 'ad', user: 'TVS Synergy', userImage: 'https://source.unsplash.com/random/40x40/?automotive,brand', userImageAiHint: 'automotive brand', profileId: 'tvs-synergy-profile',
    media: { type: 'image', url: 'https://images.unsplash.com/photo-1623079478319-945f25f0a97b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMnx8U2Nvb3RlcnxlbnwwfHx8fDE3NTAxNTI0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080', aiHint: 'scooter advertisement' },
    content: 'TVS Ntorq 125 Price : Check On-Road & Ex-Showroom Prices of All Variants -',
    timestamp: 'Sponsored Ad', comments: 0, recommendations: 15, notRecommendations: 0,
    commentsData: []
  },
  {
    id: 5, type: 'post', user: 'Hot Griddle Restaurant', userImage: 'https://source.unsplash.com/random/40x40/?restaurant,logo&sig=hg', userImageAiHint: 'restaurant logo', profileId: 'hot-griddle-business-profile', 
    timestamp: '4 days ago',
    content: 'Special Offer: Combo meals starting at just ₹249 this week! Perfect for a quick and delicious lunch. #FoodDeals #LunchSpecial \nEnjoy our amazing food!',
    comments: 18, recommendations: 88, notRecommendations: 1,
    commentsData: commonComments
  },
  {
    id: 6, type: 'post', user: 'GreenScape Landscaping', userImage: 'https://source.unsplash.com/random/40x40/?landscape,company,logo&sig=gs', userImageAiHint: 'landscape company logo', profileId: 'greenscape-business-profile', 
    timestamp: '1 day ago',
    content: 'Spring is here! 🌷 Time to get your garden ready. Contact us for a free consultation.',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x350/?garden,spring,flowers', aiHint: 'garden spring flowers' },
    comments: 9, recommendations: 45, notRecommendations: 0,
    commentsData: [
        { id: 'c-green-1', user: 'Gardener Sarah', text: 'Beautiful! When can you come over?', timestamp: '10h ago' }
    ]
  },
];
