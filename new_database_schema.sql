-- =============================================
-- COMPLETE DATABASE SCHEMA FOR NEW SUPABASE PROJECT
-- =============================================

-- Create user_profile table  
CREATE TABLE public.user_profile (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    name TEXT,
    phone_number TEXT,
    sex TEXT CHECK (sex IN ('Male', 'Female', 'Other')),
    age INTEGER CHECK (age >= 0 AND age <= 150),
    birthdate DATE,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to auto-update updated_at column
CREATE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on every update
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_profile
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to create user_profile when auth user is created
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profile (id, email, created_at)
    VALUES (NEW.id, NEW.email, NEW.created_at);
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the auth user creation
        RAISE LOG 'Error creating user profile: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user_profile when auth.users is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" 
    ON public.user_profile FOR SELECT 
    USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" 
    ON public.user_profile FOR UPDATE 
    USING (auth.uid() = id);

-- Allow inserts for the trigger (system-level)
CREATE POLICY "Enable insert for system" 
    ON public.user_profile FOR INSERT 
    WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profile TO postgres, authenticated, service_role;
GRANT SELECT ON public.user_profile TO anon;

-- Create performance indexes
CREATE INDEX idx_user_profile_email ON public.user_profile(email);
CREATE INDEX idx_user_profile_created_at ON public.user_profile(created_at);

-- Success message
SELECT 'Database setup complete! ✅' as status; 