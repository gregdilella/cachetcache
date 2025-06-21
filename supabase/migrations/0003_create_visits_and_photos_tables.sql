-- Drop existing visits table if it exists (in case of conflicts)
DROP TABLE IF EXISTS visits CASCADE;

-- Create visits table
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    initial_consult_date DATE,
    follow_up_date DATE,
    expanded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visit_photos table
CREATE TABLE visit_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_type TEXT NOT NULL CHECK (photo_type IN ('initial_consult', 'follow_up')),
    r2_key TEXT NOT NULL,
    filename TEXT NOT NULL,
    original_name TEXT,
    file_size BIGINT,
    mime_type TEXT,
    doctor_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_created_at ON visits(created_at DESC);
CREATE INDEX idx_visit_photos_visit_id ON visit_photos(visit_id);
CREATE INDEX idx_visit_photos_user_id ON visit_photos(user_id);
CREATE INDEX idx_visit_photos_type ON visit_photos(photo_type);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_visits_updated_at 
    BEFORE UPDATE ON visits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visit_photos_updated_at 
    BEFORE UPDATE ON visit_photos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for visits table
CREATE POLICY "Users can view their own visits" ON visits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visits" ON visits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visits" ON visits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visits" ON visits
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for visit_photos table
CREATE POLICY "Users can view their own visit photos" ON visit_photos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visit photos" ON visit_photos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visit photos" ON visit_photos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visit photos" ON visit_photos
    FOR DELETE USING (auth.uid() = user_id); 