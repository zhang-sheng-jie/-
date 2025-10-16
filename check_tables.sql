-- 检查数据库表结构的SQL脚本
-- 在Supabase SQL编辑器中运行这些查询

-- 1. 检查所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. 检查user_profiles表是否存在
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- 3. 检查auth.users表结构（系统表，只读）
-- 注意：auth.users是Supabase系统表，您无法直接修改

-- 4. 创建user_profiles表的SQL（如果不存在）
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 启用行级安全策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. 创建策略，允许用户查看所有用户资料
CREATE POLICY "允许查看所有用户资料" ON user_profiles
    FOR SELECT USING (true);

-- 7. 创建策略，允许用户更新自己的资料
CREATE POLICY "允许用户更新自己的资料" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 8. 创建策略，允许用户插入自己的资料
CREATE POLICY "允许用户插入自己的资料" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 9. 检查现有用户数据
SELECT * FROM user_profiles LIMIT 10;

-- 10. 检查auth.users中的用户（只显示基本信息）
SELECT id, email, created_at 
FROM auth.users 
LIMIT 10;