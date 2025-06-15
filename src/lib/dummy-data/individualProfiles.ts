
import type { PublicProfileData } from '@/types';

export const individualProfiles: PublicProfileData[] = [
  {
    id: 'deepthi-profile',
    name: 'Deepthi S.',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman,portrait,indian',
    avatarAiHint: 'woman portrait indian',
    professionalTitle: 'Software Engineer & Tech Enthusiast',
    bio: 'Passionate about coding and exploring new technologies. Loves to share insights and learn from the community.',
    followers: 150,
    following: 75,
    posts: [
      { id: 'dp1', content: 'Excited to start learning Genkit for AI development! #AI #GoogleCloud', timestamp: '1 day ago', likes: 25, comments: 5 },
      { id: 'dp2', content: 'My favorite VS Code extensions for productivity. What are yours?', timestamp: '3 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?code,vscode', imageAiHint: 'code vscode', likes: 40, comments: 12 },
    ],
    contactInfo: { email: 'deepthi.s@example.com', website: 'https://deepthi.dev' }
  },
  {
    id: 'manisha-profile',
    name: 'Maanisha K.',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman,smiling,professional',
    avatarAiHint: 'woman smiling professional',
    professionalTitle: 'Marketing Specialist | Content Creator',
    bio: 'Crafting compelling narratives and building brand presence. Always looking for creative ways to connect with audiences.',
    followers: 220,
    following: 110,
    posts: [
      { id: 'mp1', content: 'Just published a new blog post on the future of digital marketing. Link in bio!', timestamp: '2 hours ago', likes: 18, comments: 3 },
      { id: 'mp2', content: 'Brainstorming session for an upcoming campaign. Love the energy! 💡', timestamp: '2 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?brainstorming,office', imageAiHint: 'brainstorming office', likes: 33, comments: 7 },
    ],
    contactInfo: { email: 'maanisha.k@example.com' }
  },
  {
    id: 'subhesh-profile',
    name: 'Subhesh P.',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,office,indian',
    avatarAiHint: 'man office indian',
    professionalTitle: 'Project Manager | Agile Coach',
    bio: 'Helping teams deliver value efficiently. Certified Scrum Master with a focus on collaboration and continuous improvement.',
    followers: 180,
    following: 90,
    posts: [
      { id: 'sp1', content: 'Successful sprint review today! Great progress by the team. #agile #scrum', timestamp: '5 hours ago', likes: 22, comments: 4 },
      { id: 'sp2', content: 'Reading "The Phoenix Project" again. A classic for anyone in IT operations or project management.', timestamp: '4 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?book,reading', imageAiHint: 'book reading', likes: 29, comments: 6 },
    ],
  },
  {
    id: 'senthil-profile',
    name: 'Senthil Devaraj',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,professional,southindian',
    avatarAiHint: 'man professional southindian',
    professionalTitle: 'Data Analyst | SQL Expert',
    bio: 'Turning data into actionable insights. Proficient in SQL, Python, and data visualization tools.',
    followers: 120,
    following: 60,
    posts: [
      { id: 'sdp1', content: 'Exploring new datasets for an upcoming analytics project. Fascinating patterns emerging!', timestamp: '6 hours ago', likes: 15, comments: 2 },
      { id: 'sdp2', content: 'Quick tip for SQL joins: always specify your join conditions clearly!', timestamp: '1 day ago', likes: 35, comments: 10 },
    ],
    contactInfo: { email: 'senthil.d@example.com', website: 'https://senthildata.com' }
  },
  {
    id: 'seena-profile',
    name: 'Seena V.',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?person,outdoor,female',
    avatarAiHint: 'person outdoor female',
    professionalTitle: 'UX Researcher | Usability Advocate',
    bio: 'Understanding user needs to create better products. Experienced in various research methodologies.',
    followers: 95,
    following: 50,
    posts: [
      { id: 'svp1', content: 'Conducted some insightful user interviews today. Key takeaways will shape our next design iteration.', timestamp: '8 hours ago', likes: 12, comments: 1 },
      { id: 'svp2', content: 'The importance of accessibility in design cannot be overstated. #a11y #uxdesign', timestamp: '3 days ago', likes: 28, comments: 5 },
    ],
  },
  {
    id: 'shafeeq-profile',
    name: 'Shafeeq A.',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,casual,beard',
    avatarAiHint: 'man casual beard',
    professionalTitle: 'Mobile App Developer (iOS & Android)',
    bio: 'Building beautiful and functional mobile applications. Always learning new frameworks and best practices.',
    followers: 250,
    following: 120,
    posts: [
      { id: 'sap1', content: 'Just released version 2.0 of my personal finance app! Check it out on the app stores. #mobiledev #ios #android', timestamp: '10 hours ago', imageUrl: 'https://source.unsplash.com/random/600x400/?mobile,app,screen', imageAiHint: 'mobile app screen', likes: 55, comments: 15 },
      { id: 'sap2', content: 'Experimenting with Jetpack Compose for Android. Loving the declarative UI approach!', timestamp: '5 days ago', likes: 42, comments: 8 },
    ],
    contactInfo: { email: 'shafeeq.dev@example.com', website: 'https://shafeeqapps.com' }
  },
];

    