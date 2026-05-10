-- 用户表（邮箱密码登录，不使用 Supabase Auth）
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 宠物状态
CREATE TABLE IF NOT EXISTS pet_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id TEXT NOT NULL CHECK (pet_id IN ('ping_an', 'mo', 'chi', 'hawk')),
  affinity INT DEFAULT 50 CHECK (affinity >= 0 AND affinity <= 100),
  mood TEXT DEFAULT '平静',
  mood_emoji TEXT DEFAULT '😌',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

-- 记忆键值对
CREATE TABLE IF NOT EXISTS memories_kv (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pet_id, key)
);

-- 记忆日记
CREATE TABLE IF NOT EXISTS memories_diary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS（行级安全）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_kv ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_diary ENABLE ROW LEVEL SECURITY;

-- Service Role 有完整权限（服务端 API 使用 service_role key 绕过 RLS）
