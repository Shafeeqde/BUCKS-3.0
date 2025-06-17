
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
    posts: [
      { id: 'dsp1', content: 'Thrilled to be part of the Mikado.biz team! Working on some exciting projects. #MikadoLife #UXJobs', timestamp: '2 hours ago', likes: 28, comments: 6 },
      { id: 'dsp2', content: 'A sneak peek of a recent UI concept I developed for a client. Feedback welcome! #UI #DesignConcept', timestamp: '2 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?ui,concept,app', imageAiHint: 'ui concept app', likes: 52, comments: 10 },
    ],
    contactInfo: { email: 'deepthi.s@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'maanisha-k-profile',
    name: 'Maanisha K.',
    avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8Z2lybHxlbnwwfHx8fDE3NTAwOTY3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    avatarAiHint: 'woman creative designer indian',
    professionalTitle: 'UX UI Designer at Mikado.biz',
    bio: 'Detail-oriented UX UI Designer at Mikado.biz with a passion for creating delightful user experiences. Skilled in interaction design, visual design, and design systems.',
    followers: 195,
    following: 100,
    posts: [
      { id: 'mkp1', content: 'Just wrapped up a user testing session for a new feature. Valuable insights gathered! #UserResearch #UX', timestamp: '4 hours ago', likes: 25, comments: 4 },
      { id: 'mkp2', content: 'The power of a well-structured design system is incredible for team efficiency. #DesignSystem #MikadoDesign', timestamp: '4 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?design,system,components', imageAiHint: 'design system components', likes: 38, comments: 9 },
    ],
    contactInfo: { email: 'maanisha.k@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'nirmal-g-profile',
    name: 'Nirmal G.',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,graphic,artist,focused',
    avatarAiHint: 'man graphic artist focused',
    professionalTitle: 'Graphic Designer',
    bio: 'Freelance Graphic Designer specializing in branding, illustration, and print design. Bringing ideas to life with impactful visuals. Open for collaborations!',
    followers: 150,
    following: 80,
    posts: [
      { id: 'ngp1', content: 'New logo design for a local startup. Loved working on this brand identity! #GraphicDesign #Branding', timestamp: '6 hours ago', imageUrl: 'https://source.unsplash.com/random/600x400/?logo,design,mockup', imageAiHint: 'logo design mockup', likes: 40, comments: 8 },
      { id: 'ngp2', content: 'Experimenting with some new illustration styles. What do you think? #Illustration #Art', timestamp: '5 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?digital,illustration,abstract', imageAiHint: 'digital illustration abstract', likes: 29, comments: 5 },
    ],
    contactInfo: { email: 'nirmal.graphics@example.com', website: 'https://nirmalgraphics.com' }
  },
  {
    id: 'subhesh-p-profile',
    name: 'Subhesh P.',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,team,lead,office',
    avatarAiHint: 'man team lead office',
    professionalTitle: 'Design Team Lead at Mikado.biz',
    bio: 'Leading a talented team of designers at Mikado.biz to create innovative and user-centric solutions. Passionate about mentoring and fostering a creative environment.',
    followers: 320,
    following: 150,
    posts: [
      { id: 'spp1', content: 'Proud of my team at Mikado.biz for launching the new client project successfully! #TeamWork #DesignLeadership', timestamp: '8 hours ago', likes: 60, comments: 15 },
      { id: 'spp2', content: 'Key principles for effective design leadership: empathy, clear communication, and continuous learning. #Leadership #Mikado', timestamp: '6 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?leadership,meeting,team', imageAiHint: 'leadership meeting team', likes: 48, comments: 12 },
    ],
    contactInfo: { email: 'subhesh.p@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'anand-nk-profile',
    name: 'Anand Nanda Kumar',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,motion,graphics,artist',
    avatarAiHint: 'man motion graphics artist',
    professionalTitle: 'Motion Graphic Artist at Mikado.biz',
    bio: 'Bringing designs to life through motion at Mikado.biz. Specializing in 2D/3D animation, video editing, and visual effects. Always pushing creative boundaries.',
    followers: 250,
    following: 130,
    posts: [
      { id: 'ankp1', content: 'Just finished a new motion graphics piece for a product showcase. So satisfying to see it all come together! #MotionGraphics #AfterEffects', timestamp: '10 hours ago', imageUrl: 'https://source.unsplash.com/random/600x400/?abstract,motion,design', imageAiHint: 'abstract motion design', likes: 55, comments: 10 }, // Ideally this would be a video link
      { id: 'ankp2', content: 'My workflow for creating engaging explainer videos. #MotionDesign #Tutorial', timestamp: '1 week ago', likes: 42, comments: 7 },
    ],
    contactInfo: { email: 'anand.nk@mikado.biz', website: 'https://mikado.biz' }
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
    posts: [
      { id: 'sccp1', content: 'Reflecting on Mikado.biz\'s journey and excited for what the future holds. Grateful for our amazing team and clients! #Entrepreneurship #MikadoStory', timestamp: '12 hours ago', imageUrl: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxidXNpbmVzcyUyMGdyb3d0aHxlbnwwfHx8fDE3NTAxNzEzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080', imageAiHint: 'business growth chart', likes: 75, comments: 20 },
      { id: 'sccp2', content: 'Innovation in design is not just about aesthetics, it\'s about solving real-world problems effectively. #DesignThinking', timestamp: '1 week ago', likes: 65, comments: 18 },
    ],
    contactInfo: { email: 'shoby.c@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'seena-p-profile',
    name: 'Seena P.',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman,creative,director,professional',
    avatarAiHint: 'woman creative director professional',
    professionalTitle: 'Creative Director at Mikado.biz',
    bio: 'Leading creative strategy and execution at Mikado.biz. Passionate about storytelling, brand development, and inspiring design excellence.',
    followers: 480,
    following: 180,
    posts: [
      { id: 'spprof1', content: 'Just wrapped up a major branding project for a new tech client. Incredibly proud of the team\'s work! #Branding #CreativeDirection #Mikado', timestamp: '14 hours ago', imageUrl: 'https://source.unsplash.com/random/600x400/?branding,moodboard,design', imageAiHint: 'branding moodboard design', likes: 68, comments: 16 },
      { id: 'spprof2', content: 'The intersection of art and technology is where true magic happens in design. #Innovation #DesignInspo', timestamp: '2 weeks ago', likes: 58, comments: 14 },
    ],
    contactInfo: { email: 'seena.p@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'rohith-b-profile',
    name: 'Rohith B.',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,business,development,manager',
    avatarAiHint: 'man business development manager',
    professionalTitle: 'Business Development Manager at Mikado.biz',
    bio: 'Driving growth and forging strategic partnerships for Mikado.biz. Passionate about connecting clients with innovative design solutions that achieve their business goals.',
    followers: 300,
    following: 140,
    posts: [
      { id: 'rbp1', content: 'Excited to announce a new partnership that will bring Mikado.biz\'s design expertise to a wider audience! #BusinessDevelopment #Growth', timestamp: '16 hours ago', likes: 40, comments: 9 },
      { id: 'rbp2', content: 'Networking and building relationships is key to success in any field. #MikadoBiz #Connections', timestamp: '3 weeks ago', likes: 35, comments: 7 },
    ],
    contactInfo: { email: 'rohith.b@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'manu-g-profile',
    name: 'Manu G.',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,design,lead,focused',
    avatarAiHint: 'man design lead focused',
    professionalTitle: 'Design Team Lead at Mikado.biz',
    bio: 'Guiding and mentoring a team of talented designers at Mikado.biz. Focused on delivering high-quality design work and fostering a collaborative and inspiring team culture.',
    followers: 310,
    following: 145,
    posts: [
      { id: 'mgp1', content: 'Team brainstorming sessions are where the best ideas are born! Love the creative energy at Mikado. #DesignTeam #Collaboration', timestamp: '18 hours ago', imageUrl: 'https://source.unsplash.com/random/600x400/?team,meeting,whiteboard', imageAiHint: 'team meeting whiteboard', likes: 50, comments: 11 },
      { id: 'mgp2', content: 'Critique is a gift. Constructive feedback helps us grow as designers. #DesignCritique #Mentorship', timestamp: '10 days ago', likes: 42, comments: 8 },
    ],
    contactInfo: { email: 'manu.g@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'vibin-mb-profile',
    name: 'Vibin MB',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,graphic,designer,creative',
    avatarAiHint: 'man graphic designer creative',
    professionalTitle: 'Graphic Designer at Mikado.biz',
    bio: 'Creating compelling visual narratives and brand assets as a Graphic Designer at Mikado.biz. Proficient in Adobe Creative Suite and passionate about visual problem-solving.',
    followers: 170,
    following: 85,
    posts: [
      { id: 'vmbp1', content: 'Working on some exciting new branding materials for a client. Can\'t wait to share the final results! #GraphicDesign #BrandingInProgress', timestamp: '20 hours ago', likes: 28, comments: 5 },
      { id: 'vmbp2', content: 'My favorite part of the design process is transforming a concept into a tangible visual. #DesignLife #MikadoCreates', timestamp: '12 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?graphic,design,portfolio', imageAiHint: 'graphic design portfolio', likes: 33, comments: 6 },
    ],
    contactInfo: { email: 'vibin.mb@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'ashik-thomas-profile',
    name: 'Ashik Thomas',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,designer,sketching,indian',
    avatarAiHint: 'man designer sketching indian',
    professionalTitle: 'Graphic Designer at Mikado.biz',
    bio: 'Innovative Graphic Designer at Mikado.biz with a flair for typography and layout design. Dedicated to crafting visually stunning and effective design solutions.',
    followers: 160,
    following: 75,
    posts: [
      { id: 'atp1', content: 'Exploring typography combinations for a new web project. The right font makes all the difference! #Typography #WebDesign', timestamp: '22 hours ago', imageUrl: 'https://source.unsplash.com/random/600x400/?typography,design,letters', imageAiHint: 'typography design letters', likes: 30, comments: 4 },
      { id: 'atp2', content: 'The challenge of designing for multiple platforms is always exciting. #ResponsiveDesign #MikadoTeam', timestamp: '2 weeks ago', likes: 25, comments: 3 },
    ],
    contactInfo: { email: 'ashik.t@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'christin-of-profile',
    name: 'Christin OF',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman,graphic,designer,smiling',
    avatarAiHint: 'woman graphic designer smiling',
    professionalTitle: 'Graphic Designer at Mikado.biz',
    bio: 'Versatile Graphic Designer at Mikado.biz, passionate about illustration, branding, and digital art. Always striving to create designs that resonate and inspire.',
    followers: 185,
    following: 90,
    posts: [
      { id: 'cofp1', content: 'New set of illustrations completed for a children\'s book project. Such a fun and rewarding experience! #Illustration #KidLitArt', timestamp: '1 day ago', imageUrl: 'https://source.unsplash.com/random/600x400/?childrens,book,illustration', imageAiHint: 'childrens book illustration', likes: 38, comments: 7 },
      { id: 'cofp2', content: 'Design inspiration can come from anywhere! Today it was the vibrant colors of a local market. #Inspiration #MikadoDesigners', timestamp: '3 weeks ago', likes: 29, comments: 5 },
    ],
    contactInfo: { email: 'christin.of@mikado.biz', website: 'https://mikado.biz' }
  },
  {
    id: 'diju-k-profile',
    name: 'Diju Kanjiraparambil',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,ceo,founder,professional',
    avatarAiHint: 'man ceo founder professional',
    professionalTitle: 'CEO and Founder at Mikado.biz',
    bio: 'Driving the vision and strategy of Mikado.biz as CEO and Founder. Committed to excellence, innovation, and empowering our team to create impactful design solutions.',
    followers: 600,
    following: 220,
    posts: [
      { id: 'dkp1', content: 'Mikado.biz is proud to be recognized as a top design agency in the region! A testament to our team\'s hard work and dedication. #AwardWinning #DesignAgency', timestamp: '2 days ago', imageUrl: 'https://source.unsplash.com/random/600x400/?award,trophy,business', imageAiHint: 'award trophy business', likes: 85, comments: 25 },
      { id: 'dkp2', content: 'The future of design lies in understanding human behavior and leveraging technology to create meaningful experiences. #FutureOfDesign #MikadoLeadership', timestamp: '4 weeks ago', likes: 70, comments: 22 },
    ],
    contactInfo: { email: 'diju.k@mikado.biz', website: 'https://mikado.biz' }
  }
];
