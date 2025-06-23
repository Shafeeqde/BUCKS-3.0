
import type { FeedItem } from '@/types';

export const recommendedItems: FeedItem[] = [
  {
    id: 101, type: 'recommended', user: 'Travel Vlogger', userImage: 'https://source.unsplash.com/random/40x40/?traveler,profile', userImageAiHint: 'traveler profile', profileId: 'travel-vlogger-profile',
    timestamp: '2 days ago', content: 'Incredible sunset view from the cliffs of Varkala. A must-visit for any traveler in Kerala! #travel #india #sunset',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x400/?varkala,cliffs,sunset', aiHint: 'varkala cliffs sunset' },
    comments: 15, recommendations: 120, notRecommendations: 2, commentsData: []
  },
  {
    id: 102, type: 'recommended', user: 'Food Explorer', userImage: 'https://source.unsplash.com/random/40x40/?foodie,profile', userImageAiHint: 'foodie profile', profileId: 'food-explorer-profile',
    timestamp: '1 day ago', content: 'Just tried the most amazing street-style Pizza in Naples. The birthplace of Pizza doesn\'t disappoint!',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x400/?naples,pizza,street', aiHint: 'naples pizza street' },
    comments: 25, recommendations: 200, notRecommendations: 5, commentsData: []
  },
  {
    id: 103, type: 'recommended', user: 'DIY Crafts', userImage: 'https://source.unsplash.com/random/40x40/?crafts,profile,woman', userImageAiHint: 'crafts profile woman', profileId: 'diy-crafts-profile',
    timestamp: '5 hours ago', content: 'Here\'s a quick tutorial on how to make your own macrame plant hangers. It\'s easier than you think! #diy #crafts #macrame',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x400/?macrame,plant,hanger', aiHint: 'macrame plant hanger' },
    comments: 8, recommendations: 85, notRecommendations: 1, commentsData: []
  },
  {
    id: 104, type: 'recommended', user: 'Tech Reviews', userImage: 'https://source.unsplash.com/random/40x40/?tech,reviewer,profile', userImageAiHint: 'tech reviewer profile', profileId: 'tech-reviews-profile',
    timestamp: '1 day ago', content: 'My full review of the new M4 laptop is up. Is it worth the upgrade? Check out the video!',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x400/?laptop,review,desk', aiHint: 'laptop review desk' },
    comments: 30, recommendations: 150, notRecommendations: 10, commentsData: []
  },
  {
    id: 105, type: 'recommended', user: 'Gardening Tips', userImage: 'https://source.unsplash.com/random/40x40/?gardener,profile', userImageAiHint: 'gardener profile', profileId: 'gardening-tips-profile',
    timestamp: '3 days ago', content: 'My tomato plants are thriving this year! The secret is consistent watering and organic compost. #gardening #homegrown',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x400/?tomato,plant,garden', aiHint: 'tomato plant garden' },
    comments: 12, recommendations: 95, notRecommendations: 3, commentsData: []
  },
  {
    id: 106, type: 'recommended', user: 'Fitness Coach', userImage: 'https://source.unsplash.com/random/40x40/?fitness,coach,profile', userImageAiHint: 'fitness coach profile', profileId: 'fitness-coach-profile',
    timestamp: '8 hours ago', content: 'Quick 15-minute HIIT workout you can do at home with no equipment. Let\'s get moving! #fitness #workout #hiit',
    media: { type: 'image', url: 'https://source.unsplash.com/random/600x400/?home,workout,fitness', aiHint: 'home workout fitness' },
    comments: 18, recommendations: 110, notRecommendations: 4, commentsData: []
  }
];
