-- Add birthdate column to user_profile table
ALTER TABLE public.user_profile 
ADD COLUMN birthdate DATE;

-- Add comment for documentation
COMMENT ON COLUMN public.user_profile.birthdate IS 'User date of birth, used to calculate age automatically'; 