-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  username TEXT UNIQUE,
  avatarUrl TEXT,
  avatarAiHint TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  email TEXT,
  isVerified BOOLEAN DEFAULT FALSE,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  socialLinks JSONB,
  moments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profile_posts table
CREATE TABLE IF NOT EXISTS profile_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profileId UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  imageUrl TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  type TEXT DEFAULT 'post'
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  viewed BOOLEAN DEFAULT FALSE,
  profileId TEXT,
  image TEXT,
  dataAiHint TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recommended_items table
CREATE TABLE IF NOT EXISTS recommended_items (
  id TEXT PRIMARY KEY,
  user TEXT NOT NULL,
  userImage TEXT,
  userImageAiHint TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content TEXT,
  comments INTEGER DEFAULT 0,
  recommendations INTEGER DEFAULT 0,
  notRecommendations INTEGER DEFAULT 0,
  type TEXT DEFAULT 'recommended',
  profileId TEXT
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommended_items ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles can be read by anyone but only updated by the owner
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Profile posts can be read by anyone but only created/updated/deleted by the owner
CREATE POLICY "Public posts are viewable by everyone" ON profile_posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON profile_posts FOR INSERT WITH CHECK (auth.uid() = profileId);
CREATE POLICY "Users can update their own posts" ON profile_posts FOR UPDATE USING (auth.uid() = profileId);
CREATE POLICY "Users can delete their own posts" ON profile_posts FOR DELETE USING (auth.uid() = profileId);

-- Categories can be read by everyone
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Recommended items can be read by everyone
CREATE POLICY "Recommended items are viewable by everyone" ON recommended_items FOR SELECT USING (true);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, username, email, avatarUrl)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email, new.email, new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
INSERT INTO categories (id, name, icon, viewed)
VALUES
  ('all', 'All', 'QueueListIcon', false),
  ('trending', 'Trending', 'ChartBarIcon', false),
  ('business', 'Business', 'BriefcaseIcon', false),
  ('services', 'Services', 'WrenchScrewdriverIcon', false),
  ('community', 'Community', 'UsersIcon', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample recommended items
INSERT INTO recommended_items (id, user, userImage, userImageAiHint, content, comments, recommendations, notRecommendations, type, profileId)
VALUES
  ('1', 'Sarah Johnson', '/images/avatars/user1.png', 'professional woman with glasses', 'Just launched a new service for small business accounting. Check out my business profile for details!', 5, 24, 2, 'recommended', 'user1'),
  ('2', 'David Chen', '/images/avatars/user2.png', 'young man with casual attire', 'Looking for recommendations for reliable web developers in the area. Any suggestions?', 12, 18, 0, 'recommended', 'user2')
ON CONFLICT (id) DO NOTHING;
