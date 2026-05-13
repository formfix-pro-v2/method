-- Velora Database Schema
-- Safe to run multiple times

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns if they don't exist yet
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='quiz_data') THEN
    ALTER TABLE public.profiles ADD COLUMN quiz_data JSONB DEFAULT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='plan') THEN
    ALTER TABLE public.profiles ADD COLUMN plan TEXT DEFAULT 'free';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='premium') THEN
    ALTER TABLE public.profiles ADD COLUMN premium BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='current_day') THEN
    ALTER TABLE public.profiles ADD COLUMN current_day INTEGER DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='purchase_date') THEN
    ALTER TABLE public.profiles ADD COLUMN purchase_date TIMESTAMPTZ DEFAULT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='expiry_date') THEN
    ALTER TABLE public.profiles ADD COLUMN expiry_date TIMESTAMPTZ DEFAULT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='updated_at') THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Daily check-ins table
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sleep INTEGER CHECK (sleep >= 1 AND sleep <= 10),
  energy INTEGER CHECK (energy >= 1 AND energy <= 10),
  stress INTEGER CHECK (stress >= 1 AND stress <= 10),
  time TEXT,
  symptoms TEXT[] DEFAULT '{}',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (safe to run multiple times)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own checkins" ON public.checkins;
DROP POLICY IF EXISTS "Users can insert own checkins" ON public.checkins;
DROP POLICY IF EXISTS "Users can update own checkins" ON public.checkins;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Checkins policies
CREATE POLICY "Users can view own checkins"
  ON public.checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins"
  ON public.checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkins"
  ON public.checkins FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- COMPLETED SESSIONS — exercise session history
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL,
  phase TEXT NOT NULL,                          -- foundation / build / strengthen / master
  title TEXT,
  exercises_count INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,           -- actual elapsed time
  completed BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- JOURNAL ENTRIES — milestone reflections
-- ============================================================
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL,
  milestone TEXT,                                -- e.g. "Week 1 — First Impressions"
  text TEXT NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day)
);

-- ============================================================
-- FAVORITES — saved meals and exercises
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('meal', 'exercise')),
  item_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_name)
);

-- ============================================================
-- ACHIEVEMENTS — unlocked badges
-- ============================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,                  -- matches ACHIEVEMENTS[].id in lib/achievements.ts
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================================
-- PUSH SUBSCRIPTIONS — Web Push notification endpoints
-- ============================================================
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- ============================================================
-- REMINDERS — user-configured notification preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('exercise', 'checkin', 'supplements', 'water', 'sleep')),
  time_of_day TIME NOT NULL,                    -- e.g. 08:00, 21:00
  enabled BOOLEAN DEFAULT TRUE,
  days_of_week INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',  -- 1=Mon..7=Sun
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, reminder_type)
);

-- ============================================================
-- REFERRALS — tracking who referred whom
-- ============================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'signed_up' CHECK (status IN ('signed_up', 'converted', 'rewarded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referred_id)                           -- each user can only be referred once
);

-- ============================================================
-- SYNC METADATA — tracks last sync timestamp per device
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_id TEXT NOT NULL,                      -- fingerprint or random UUID per browser
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

-- ============================================================
-- ROW LEVEL SECURITY for new tables
-- ============================================================
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_log ENABLE ROW LEVEL SECURITY;

-- Sessions policies
DROP POLICY IF EXISTS "Users can view own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.sessions;
CREATE POLICY "Users can view own sessions"
  ON public.sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions"
  ON public.sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Journal policies
DROP POLICY IF EXISTS "Users can view own journal" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can insert own journal" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can update own journal" ON public.journal_entries;
CREATE POLICY "Users can view own journal"
  ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal"
  ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal"
  ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);

-- Favorites policies
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites"
  ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Achievements policies
DROP POLICY IF EXISTS "Users can view own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.achievements;
CREATE POLICY "Users can view own achievements"
  ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements"
  ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Push subscriptions policies
DROP POLICY IF EXISTS "Users can view own push subs" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can insert own push subs" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Users can delete own push subs" ON public.push_subscriptions;
CREATE POLICY "Users can view own push subs"
  ON public.push_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own push subs"
  ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own push subs"
  ON public.push_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- Reminders policies
DROP POLICY IF EXISTS "Users can view own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can manage own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can insert own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can update own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can delete own reminders" ON public.reminders;
CREATE POLICY "Users can view own reminders"
  ON public.reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders"
  ON public.reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders"
  ON public.reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders"
  ON public.reminders FOR DELETE USING (auth.uid() = user_id);

-- Referrals policies
DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can insert referrals" ON public.referrals;
CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can insert referrals"
  ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referred_id);

-- Sync log policies
DROP POLICY IF EXISTS "Users can view own sync log" ON public.sync_log;
DROP POLICY IF EXISTS "Users can manage own sync log" ON public.sync_log;
CREATE POLICY "Users can view own sync log"
  ON public.sync_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sync log"
  ON public.sync_log FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON public.checkins(user_id, date);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.sessions(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_journal_user_day ON public.journal_entries(user_id, day);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subs_user ON public.push_subscriptions(user_id);

-- ============================================================
-- HELPER: updated_at auto-trigger for tables that need it
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_journal_updated_at ON public.journal_entries;
CREATE TRIGGER set_journal_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- GRANTS — required for Supabase Data API (PostgREST)
-- Without explicit GRANTs, roles cannot access tables via API.
-- Enforced on all projects from October 30, 2026.
-- ============================================================

-- profiles
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;

-- checkins
GRANT SELECT, INSERT, UPDATE ON public.checkins TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkins TO service_role;

-- sessions
GRANT SELECT, INSERT ON public.sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessions TO service_role;

-- journal_entries
GRANT SELECT, INSERT, UPDATE ON public.journal_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journal_entries TO service_role;

-- favorites
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO service_role;

-- achievements
GRANT SELECT, INSERT ON public.achievements TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO service_role;

-- push_subscriptions
GRANT SELECT, INSERT, DELETE ON public.push_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO service_role;

-- reminders
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO service_role;

-- referrals
GRANT SELECT, INSERT ON public.referrals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.referrals TO service_role;

-- sync_log
GRANT SELECT, INSERT, UPDATE ON public.sync_log TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sync_log TO service_role;

-- ============================================================
-- BACKUP STRATEGY
-- ============================================================
-- Supabase Pro plan includes automatic daily backups.
-- For free tier, run this manually or via cron:
--
-- Export profiles:
-- SELECT * FROM profiles INTO OUTFILE '/tmp/profiles_backup.csv' DELIMITER ',' CSV HEADER;
--
-- Or use Supabase CLI:
-- supabase db dump -f backup.sql
--
-- Recommended: Enable Point-in-Time Recovery (PITR) on Supabase Pro plan
-- for continuous backups with ability to restore to any second.
-- ============================================================
