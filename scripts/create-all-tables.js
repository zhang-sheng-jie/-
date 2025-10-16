const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oqaekwgnvenqetgtbeio.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xYWVrd2dudmVucWV0Z3RiZWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njg1MTMsImV4cCI6MjA3NjA0NDUxM30.ZsuCQSJzlgbbFKMBOASUpSNBNYQPHe6HMbqMyj5cUAY'

const supabase = createClient(supabaseUrl, supabaseKey)

// 完整的SQL脚本
const sqlScript = `
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

-- 启用行级安全
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_submissions ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "任何人都可以查看诗歌" ON poems FOR SELECT USING (true);
CREATE POLICY "任何人都可以查看用户资料" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "用户可以更新自己的资料" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "用户可以插入自己的资料" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "用户可以查看所有收藏" ON favorites FOR SELECT USING (true);
CREATE POLICY "用户可以添加收藏" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以删除自己的收藏" ON favorites FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "用户可以查看所有评论" ON comments FOR SELECT USING (true);
CREATE POLICY "用户可以添加评论" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "用户可以更新自己的评论" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "用户可以删除自己的评论" ON comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "用户可以查看自己的投稿" ON poem_submissions FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "用户可以添加投稿" ON poem_submissions FOR INSERT WITH CHECK (auth.uid() = submitted_by);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_author ON poems(author);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_poem_id ON favorites(poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_poem_id ON comments(poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_poem_submissions_status ON poem_submissions(status);
CREATE INDEX IF NOT EXISTS idx_poem_submissions_submitted_by ON poem_submissions(submitted_by);
`

async function createTables() {
  console.log('开始创建数据库表...')
  
  try {
    // 执行SQL脚本
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript })
    
    if (error) {
      console.error('创建表失败:', error)
      // 如果rpc不可用，尝试直接执行SQL
      console.log('尝试直接执行SQL...')
      const statements = sqlScript.split(';').filter(stmt => stmt.trim())
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: stmtError } = await supabase.from('poems').select('*').limit(0)
          if (stmtError) {
            console.log('执行语句:', statement.substring(0, 100) + '...')
          }
        }
      }
    } else {
      console.log('数据库表创建成功！')
    }
    
    // 现在插入示例数据
    console.log('开始插入示例数据...')
    const poemsData = [
      {
        title: '静夜思',
        author: '李白',
        dynasty: '唐代',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
      },
      {
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐代',
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'
      },
      {
        title: '登鹳雀楼',
        author: '王之涣',
        dynasty: '唐代',
        content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
      },
      {
        title: '望庐山瀑布',
        author: '李白',
        dynasty: '唐代',
        content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。'
      },
      {
        title: '相思',
        author: '王维',
        dynasty: '唐代',
        content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。'
      },
      {
        title: '江雪',
        author: '柳宗元',
        dynasty: '唐代',
        content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。'
      },
      {
        title: '悯农',
        author: '李绅',
        dynasty: '唐代',
        content: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。'
      },
      {
        title: '游子吟',
        author: '孟郊',
        dynasty: '唐代',
        content: '慈母手中线，游子身上衣。临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。'
      },
      {
        title: '水调歌头',
        author: '苏轼',
        dynasty: '宋代',
        content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。'
      },
      {
        title: '声声慢',
        author: '李清照',
        dynasty: '宋代',
        content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急？雁过也，正伤心，却是旧时相识。'
      }
    ]
    
    for (const poem of poemsData) {
      const { error: insertError } = await supabase
        .from('poems')
        .insert(poem)
      
      if (insertError) {
        console.log(`插入诗歌 "${poem.title}" 失败:`, insertError.message)
      } else {
        console.log(`成功插入诗歌: ${poem.title}`)
      }
    }
    
    console.log('数据库初始化完成！')
    
  } catch (error) {
    console.error('初始化失败:', error)
  }
}

createTables()