-- 创建诗歌表
CREATE TABLE IF NOT EXISTS poems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  dynasty VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建诗人表
CREATE TABLE IF NOT EXISTS poets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  biography TEXT,
  era VARCHAR(100),
  representative_works TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  poem_id UUID REFERENCES poems NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poem_id UUID REFERENCES poems NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建诗歌投稿表
CREATE TABLE IF NOT EXISTS poem_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  dynasty VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  submitted_by UUID REFERENCES auth.users NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建诗歌标签关联表
CREATE TABLE IF NOT EXISTS poem_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poem_id UUID REFERENCES poems NOT NULL,
  tag_id UUID REFERENCES tags NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poem_id, tag_id)
);

-- 启用行级安全
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE poets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_tags ENABLE ROW LEVEL SECURITY;

-- 删除已存在的策略（如果存在）
DROP POLICY IF EXISTS "任何人都可以查看诗歌" ON poems;
DROP POLICY IF EXISTS "任何人都可以查看用户资料" ON user_profiles;
DROP POLICY IF EXISTS "用户可以更新自己的资料" ON user_profiles;
DROP POLICY IF EXISTS "用户可以插入自己的资料" ON user_profiles;
DROP POLICY IF EXISTS "用户可以查看所有收藏" ON favorites;
DROP POLICY IF EXISTS "用户可以添加收藏" ON favorites;
DROP POLICY IF EXISTS "用户可以删除自己的收藏" ON favorites;
DROP POLICY IF EXISTS "用户可以查看所有评论" ON comments;
DROP POLICY IF EXISTS "用户可以添加评论" ON comments;
DROP POLICY IF EXISTS "用户可以更新自己的评论" ON comments;
DROP POLICY IF EXISTS "用户可以删除自己的评论" ON comments;
DROP POLICY IF EXISTS "用户可以查看自己的投稿" ON poem_submissions;
DROP POLICY IF EXISTS "用户可以添加投稿" ON poem_submissions;

-- 创建策略
-- 诗歌表策略：所有人都可以读取
CREATE POLICY "任何人都可以查看诗歌" ON poems FOR SELECT USING (true);

-- 用户资料策略：用户可以查看所有资料，但只能修改自己的
CREATE POLICY "任何人都可以查看用户资料" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "用户可以更新自己的资料" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "用户可以插入自己的资料" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 收藏表策略：用户可以查看所有收藏，但只能操作自己的
CREATE POLICY "用户可以查看所有收藏" ON favorites FOR SELECT USING (true);
CREATE POLICY "用户可以添加收藏" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以删除自己的收藏" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- 评论表策略：用户可以查看所有评论，但只能操作自己的
CREATE POLICY "用户可以查看所有评论" ON comments FOR SELECT USING (true);
CREATE POLICY "用户可以添加评论" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以更新自己的评论" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "用户可以删除自己的评论" ON comments FOR DELETE USING (auth.uid() = user_id);

-- 投稿表策略：用户可以查看自己的投稿，管理员可以查看所有
CREATE POLICY "用户可以查看自己的投稿" ON poem_submissions FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "用户可以添加投稿" ON poem_submissions FOR INSERT WITH CHECK (auth.uid() = submitted_by);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_author ON poems(author);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_poem_id ON favorites(poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_poem_id ON comments(poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_poem_submissions_status ON poem_submissions(status);
CREATE INDEX IF NOT EXISTS idx_poem_submissions_submitted_by ON poem_submissions(submitted_by);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 删除已存在的触发器（如果存在）
DROP TRIGGER IF EXISTS update_poems_updated_at ON poems;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;

-- 为需要更新时间的表创建触发器
CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();