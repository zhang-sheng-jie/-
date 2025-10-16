# 解决Supabase RLS策略问题

## 问题描述
投稿功能被Supabase的Row Level Security (RLS)策略阻止，诗歌被保存到本地存储而不是数据库中。

## 解决方案

### 方案1：禁用RLS策略（最简单）
1. 登录 [Supabase控制台](https://supabase.com/dashboard)
2. 进入你的项目 `oqaekwgnvenqetgtbeio`
3. 点击左侧菜单的 **Authentication** → **Policies**
4. 找到 `poems` 表
5. 禁用所有RLS策略，或者为插入操作创建允许策略

### 方案2：创建适当的RLS策略
在Supabase控制台的SQL编辑器中执行以下SQL：

```sql
-- 允许所有用户插入诗歌
CREATE POLICY "允许所有用户插入诗歌" ON poems
FOR INSERT WITH CHECK (true);

-- 允许所有用户查看诗歌
CREATE POLICY "允许所有用户查看诗歌" ON poems
FOR SELECT USING (true);

-- 允许所有用户更新诗歌
CREATE POLICY "允许所有用户更新诗歌" ON poems
FOR UPDATE USING (true);

-- 允许所有用户删除诗歌
CREATE POLICY "允许所有用户删除诗歌" ON poems
FOR DELETE USING (true);
```

### 方案3：使用服务端密钥（需要后端）
如果需要更严格的控制，可以：
1. 创建后端API来处理投稿
2. 在后端使用服务端密钥（service_role key）
3. 前端调用后端API进行投稿

## 当前状态
目前投稿功能使用本地存储作为备用方案，投稿的诗歌会显示在网页中，但不会保存到数据库。

## 建议
推荐使用**方案1**（禁用RLS策略）作为快速解决方案，这样投稿的诗歌就能直接保存到数据库中。

完成配置后，投稿功能将正常工作，诗歌会保存到数据库而不是本地存储。