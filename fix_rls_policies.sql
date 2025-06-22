-- Remove the problematic admin policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.user_profile;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.user_profile;
DROP POLICY IF EXISTS "Admin can view all visits" ON public.visits;
DROP POLICY IF EXISTS "Admin can update all visits" ON public.visits;
DROP POLICY IF EXISTS "Admin can view all visit photos" ON public.visit_photos;
DROP POLICY IF EXISTS "Admin can update all visit photos" ON public.visit_photos;
DROP POLICY IF EXISTS "Admin can view all user images" ON public.user_images;
DROP POLICY IF EXISTS "Admin can update all user images" ON public.user_images;

-- Verify the existing policies are still in place
-- These should be the only policies remaining:
-- "Users can view own profile" ON user_profile FOR SELECT
-- "Users can update own profile" ON user_profile FOR UPDATE  
-- "Enable insert for system" ON user_profile FOR INSERT

-- Check current policies (for verification)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'user_profile'; 