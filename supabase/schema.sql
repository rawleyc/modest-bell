-- ===================================================
-- Słówka V2 — Supabase PostgreSQL Database Schema
-- ===================================================

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT NOT NULL,
  native_language TEXT NOT NULL DEFAULT 'en',
  learning_language TEXT NOT NULL DEFAULT 'pl',
  xp INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. WORDS TABLE (Public Vocabulary Database)
CREATE TABLE IF NOT EXISTS public.words (
  id TEXT PRIMARY KEY,
  language TEXT NOT NULL DEFAULT 'pl',
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  pronunciation TEXT,
  example_sentence TEXT,
  example_translation TEXT,
  category TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WORD_PROGRESS TABLE (Per-User Mastery Tracking)
CREATE TABLE IF NOT EXISTS public.word_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  mastery_score INTEGER NOT NULL DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
  correct_attempts INTEGER NOT NULL DEFAULT 0,
  incorrect_attempts INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_word UNIQUE (user_id, word_id)
);

-- 4. ATTEMPTS TABLE (Atomic Evidence Logs for Future V3 AI)
CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  stage INTEGER NOT NULL CHECK (stage >= 1 AND stage <= 5),
  question_type TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  response_time_ms INTEGER,
  used_hint BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. GENERATED_CONTENT TABLE (V3 AI Examples Caching)
CREATE TABLE IF NOT EXISTS public.generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'examples',
  content_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_word_content_type UNIQUE (word_id, type)
);

-- 6. GENERATED_EXERCISES TABLE (V3 AI Exercises Caching)
CREATE TABLE IF NOT EXISTS public.generated_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id TEXT NOT NULL,
  stage INTEGER NOT NULL CHECK (stage >= 1 AND stage <= 5),
  exercise_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_word_stage UNIQUE (word_id, stage)
);


-- ===================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;

-- Words: Public Read Access
CREATE POLICY "Public words read access"
  ON public.words FOR SELECT
  USING (true);

-- Profiles: Own Profile Read & Write
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Word Progress: Own Progress Read & Write
CREATE POLICY "Users read own word progress"
  ON public.word_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users write own word progress"
  ON public.word_progress FOR ALL
  USING (auth.uid() = user_id);

-- Attempts: Own Attempts Read & Write
CREATE POLICY "Users read own attempts"
  ON public.attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own attempts"
  ON public.attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ===================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ===================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', new.email),
    split_part(new.email, '@', 1)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
