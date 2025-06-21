-- Create user_images table
CREATE TABLE user_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    description TEXT,
    r2_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only see their own images
CREATE POLICY "Users can view their own images" ON user_images
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own images
CREATE POLICY "Users can insert their own images" ON user_images
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own images
CREATE POLICY "Users can update their own images" ON user_images
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own images
CREATE POLICY "Users can delete their own images" ON user_images
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_images_user_id ON user_images(user_id);
CREATE INDEX idx_user_images_created_at ON user_images(created_at DESC); 