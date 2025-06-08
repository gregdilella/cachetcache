-- Create contactform table for storing contact form submissions
CREATE TABLE IF NOT EXISTS public.contactform (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS contactform_created_at_idx ON public.contactform(created_at DESC);
CREATE INDEX IF NOT EXISTS contactform_email_idx ON public.contactform(email);

-- Add comments for documentation
COMMENT ON TABLE public.contactform IS 'Contact form submissions from website visitors';
COMMENT ON COLUMN public.contactform.id IS 'Unique identifier for each contact form submission';
COMMENT ON COLUMN public.contactform.name IS 'Name of the person submitting the form';
COMMENT ON COLUMN public.contactform.email IS 'Email address of the person submitting the form';
COMMENT ON COLUMN public.contactform.phone_number IS 'Optional phone number of the person submitting the form';
COMMENT ON COLUMN public.contactform.message IS 'Message content from the contact form';
COMMENT ON COLUMN public.contactform.created_at IS 'Timestamp when the form was submitted'; 