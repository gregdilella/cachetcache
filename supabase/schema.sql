-- =============================================
-- CachetCache Database Schema
-- Updated schema with trigger for auto user creation
-- =============================================

-- Table: users
-- Description: User accounts table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT,
    username TEXT,
    email TEXT,
    phone_number TEXT,
    sex TEXT,
    age INTEGER,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Table: visits  
-- Description: User visit tracking table
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    initial_date TIMESTAMPTZ,
    initial_notes TEXT,
    initial_pictures TEXT,
    followup_date TIMESTAMPTZ,
    followup_notes TEXT,
    followup_pictures TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    type TEXT
);

-- =============================================
-- Indexes
-- =============================================

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Indexes for visits table  
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON public.visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON public.visits(created_at);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on visits table
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Policies
-- =============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile  
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can view their own visits
CREATE POLICY "Users can view own visits" ON public.visits
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own visits
CREATE POLICY "Users can insert own visits" ON public.visits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own visits
CREATE POLICY "Users can update own visits" ON public.visits
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- Database Trigger to create public.users when auth.users is created
-- =============================================

-- Function to create public user when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create public.users record
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
